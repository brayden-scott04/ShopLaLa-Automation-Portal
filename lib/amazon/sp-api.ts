import {
  MARKETPLACE_IDS,
  REGION_HOSTS,
  marketplace,
  type MarketplaceCode,
  type Region,
} from "./marketplaces";

const LWA_TOKEN_URL = "https://api.amazon.com/auth/o2/token";
const CHUNK_SIZE = 20;
const CHUNK_DELAY_MS = 1100;
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503]);

export { MARKETPLACE_IDS };
export type { MarketplaceCode };

export interface PricingResult {
  sku: string;
  listPrice: number | null;
  listPriceAttr: number | null;
  salesPrice: number | null;
  discountedPrice: number | null;
  featuredPrice: number | null;
  /** Raw Pricing API sales price, captured before the no-active-offer/our_price fallback below may overwrite salesPrice. */
  livePrice: number | null;
  /** Seller-configured price — Listings Items purchasable_offer.our_price, read directly (not a fallback). */
  ourPrice: number | null;
  error?: string;
}

export interface SkuDetail {
  sku: string;
  asin: string | null;
  salesPrice: number | null;
  discountedPrice: number | null;
  listPrice: number | null;
  featuredPrice: number | null;
  minSellerAllowedPrice: number | null;
  maxSellerAllowedPrice: number | null;
  productName: string | null;
  productDescription: string | null;
  /** Seller-configured price — Listings Items purchasable_offer.our_price, read directly (not a fallback). */
  ourPrice: number | null;
  /** Amazon's live buyer-facing price — the raw v0 BuyingPrice.ListingPrice.Amount, before getSkuPricing's our_price fallback (for listings with no active offer) overwrites salesPrice. */
  livePrice: number | null;
  /** Real List Price only (v0 AttributeSets.ListPrice or Listings Items list_price attribute) — null if neither is set, never RegularPrice. */
  listPriceExact: number | null;
  error?: string;
}

/**
 * Per-region credentials.
 *
 * NA reads the original unsuffixed variables, so US and CA resolve to exactly
 * the values they used before regions existed. EU and FE REQUIRE their own
 * suffixed variables and never fall back to NA's -- falling back would send a
 * North America token to a European host, which is the same class of bug as the
 * shared token cache below, just relocated.
 */
function credentialsFor(region: Region) {
  const suffix = region === "NA" ? "" : `_${region}`;
  const read = (name: string) => {
    const key = `${name}${suffix}`;
    const value = process.env[key];
    if (!value) {
      // Name the variable. An unset credential previously surfaced as an opaque
      // upstream 401, which is genuinely hard to trace back to config.
      throw new Error(`Amazon SP-API not configured for ${region}: ${key} is not set`);
    }
    return value;
  };
  return {
    refreshToken: read("REFRESH_TOKEN"),
    sellerId: read("SELLER_ID"),
    // One LWA application serves all three regions.
    clientId: read2("CLIENT_ID"),
    clientSecret: read2("CLIENT_SECRET"),
  };
}

function read2(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Amazon SP-API not configured: ${name} is not set`);
  return value;
}

/**
 * Access tokens are region-scoped: one issued for NA is rejected by the EU
 * host. Both maps are therefore keyed by region -- a single shared slot would
 * hand whichever region warmed the cache first to every other region for the
 * next hour, failing in an order- and time-dependent way.
 */
const tokenCache = new Map<Region, { accessToken: string; expiresAt: number }>();
const refreshInFlight = new Map<Region, Promise<string>>();

async function getAccessToken(region: Region): Promise<string> {
  const cached = tokenCache.get(region);
  if (cached && cached.expiresAt - 60_000 > Date.now()) return cached.accessToken;

  // Coalesce concurrent refreshes, but only within the same region.
  const existing = refreshInFlight.get(region);
  if (existing) return existing;

  const promise = (async () => {
    const { refreshToken, clientId, clientSecret } = credentialsFor(region);
    const res = await fetch(LWA_TOKEN_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    if (!res.ok) throw new Error(`LWA token refresh failed for ${region} (${res.status})`);
    const json = await res.json();
    tokenCache.set(region, {
      accessToken: json.access_token,
      expiresAt: Date.now() + json.expires_in * 1000,
    });
    return json.access_token as string;
  })();

  refreshInFlight.set(region, promise);
  try {
    return await promise;
  } finally {
    // Only this region's entry -- clearing the whole map would drop another
    // region's in-flight refresh.
    refreshInFlight.delete(region);
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

interface MoneyType {
  Amount: number;
  CurrencyCode: string;
}

interface PricingApiItem {
  SellerSKU: string;
  status: string;
  Product?: {
    Offers?: { BuyingPrice?: { ListingPrice?: MoneyType }; RegularPrice?: MoneyType }[];
    AttributeSets?: { ListPrice?: MoneyType }[];
    CompetitivePricing?: {
      CompetitivePrices?: { CompetitivePriceId: string; Price?: { ListingPrice?: MoneyType } }[];
    };
  };
}

interface PricingApiResponse {
  payload: PricingApiItem[];
}

async function callSpApiJson<T>(
  path: string,
  params: Record<string, string>,
  region: Region
): Promise<T> {
  const accessToken = await getAccessToken(region);
  // Host and token must come from the same region or Amazon rejects the call.
  const url = `${REGION_HOSTS[region]}${path}?${new URLSearchParams(params).toString()}`;

  let lastError: Error = new Error("SP-API call failed");
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, { headers: { "x-amz-access-token": accessToken } });
    if (res.ok) return res.json();

    lastError = new Error(`SP-API ${path} failed (${res.status})`);
    if (!RETRYABLE_STATUSES.has(res.status)) throw lastError;
    await sleep(1000 * 2 ** attempt);
  }
  throw lastError;
}

function callSpApi(
  path: string,
  params: Record<string, string>,
  region: Region
): Promise<PricingApiResponse> {
  return callSpApiJson<PricingApiResponse>(path, params, region);
}

/**
 * getPricing (ItemType=Sku) is keyed by the caller's own SellerSKU, so the
 * returned offer is always the seller's own listing — that's our "sales price".
 * List Price comes from the item's AttributeSets when Amazon has it on file,
 * falling back to the offer's RegularPrice otherwise.
 */
function extractOwnPricing(payload: PricingApiItem[], results: Map<string, PricingResult>) {
  for (const item of payload ?? []) {
    const sku = item.SellerSKU;
    const result = results.get(sku);
    if (!result) continue;

    if (item.status !== "Success") {
      result.error = item.status === "ClientError" ? "No matching Amazon listing" : `Pricing lookup failed: ${item.status}`;
      continue;
    }

    const offer = item.Product?.Offers?.[0];
    const listPriceAttr = item.Product?.AttributeSets?.[0]?.ListPrice?.Amount;
    result.salesPrice = offer?.BuyingPrice?.ListingPrice?.Amount ?? null;
    result.listPrice = listPriceAttr ?? offer?.RegularPrice?.Amount ?? null;
    result.listPriceAttr = listPriceAttr ?? null;
  }
}

/** CompetitivePriceId "1" is Amazon's "New Buy Box" price — the featured offer price. */
function extractFeaturedPricing(payload: PricingApiItem[], results: Map<string, PricingResult>) {
  for (const item of payload ?? []) {
    const sku = item.SellerSKU;
    const result = results.get(sku);
    if (!result || item.status !== "Success") continue;

    const buyBox = item.Product?.CompetitivePricing?.CompetitivePrices?.find(
      (p) => p.CompetitivePriceId === "1"
    );
    result.featuredPrice = buyBox?.Price?.ListingPrice?.Amount ?? null;
  }
}

const LISTINGS_CONCURRENCY = 5;
const LISTINGS_BATCH_DELAY_MS = 500;

/**
 * Seller-configured offer prices from the Listings Items API — `our_price` (a.k.a. "Your Price"
 * in this portal) and `discounted_price` (the promotional Sale Price), read in one call. These
 * live on the listing itself, independent of whether the Product Pricing API currently reports a
 * buyable offer. Best-effort: nulls on any failure.
 */
async function getListingsOfferPrices(
  sku: string,
  code: MarketplaceCode
): Promise<{ ourPrice: number | null; discountedPrice: number | null }> {
  try {
    const { id: marketplaceId, region } = marketplace(code);
    // Seller id is per region -- EU and FE are separate seller accounts.
    const { sellerId } = credentialsFor(region);
    const listing = await callSpApiJson<ListingsItemResponse>(
      `/listings/2021-08-01/items/${sellerId}/${encodeURIComponent(sku)}`,
      { marketplaceIds: marketplaceId, includedData: "attributes" },
      region
    );
    return {
      ourPrice: extractOfferPrice(listing.attributes, "our_price"),
      discountedPrice: extractOfferPrice(listing.attributes, "discounted_price"),
    };
  } catch {
    return { ourPrice: null, discountedPrice: null };
  }
}

export async function getSkuPricing(skus: string[], code: MarketplaceCode): Promise<PricingResult[]> {
  const { id: marketplaceId, region } = marketplace(code);
  const cleaned = [...new Set(skus.map((s) => s.trim()).filter(Boolean))];
  const results = new Map<string, PricingResult>(
    cleaned.map((sku) => [
      sku,
      {
        sku,
        listPrice: null,
        listPriceAttr: null,
        salesPrice: null,
        discountedPrice: null,
        featuredPrice: null,
        livePrice: null,
        ourPrice: null,
      },
    ])
  );

  const chunks = chunk(cleaned, CHUNK_SIZE);
  for (let i = 0; i < chunks.length; i++) {
    const batch = chunks[i];
    const params = { MarketplaceId: marketplaceId, Skus: batch.join(","), ItemType: "Sku" };

    try {
      const pricing = await callSpApi("/products/pricing/v0/price", params, region);
      extractOwnPricing(pricing.payload, results);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Pricing lookup failed";
      for (const sku of batch) results.get(sku)!.error = message;
    }

    await sleep(CHUNK_DELAY_MS);

    try {
      const competitive = await callSpApi("/products/pricing/v0/competitivePrice", params, region);
      extractFeaturedPricing(competitive.payload, results);
    } catch {
      // Featured price is best-effort — a failure here shouldn't blank out the sales/list price already fetched.
    }

    if (i < chunks.length - 1) await sleep(CHUNK_DELAY_MS);
  }

  for (const result of results.values()) {
    result.livePrice = result.salesPrice;
  }

  // "Your Price" (our_price) and Sale Price (discounted_price) live on the listing itself, not
  // the Product Pricing API — fetch them for every SKU, chunked with light concurrency since the
  // Listings Items API is a single-SKU-per-call endpoint (unlike the batched pricing calls above).
  const listingsChunks = chunk(cleaned, LISTINGS_CONCURRENCY);
  for (let i = 0; i < listingsChunks.length; i++) {
    const batch = listingsChunks[i];
    const offerPrices = await Promise.all(batch.map((sku) => getListingsOfferPrices(sku, code)));
    batch.forEach((sku, idx) => {
      const result = results.get(sku)!;
      result.ourPrice = offerPrices[idx].ourPrice;
      result.discountedPrice = offerPrices[idx].discountedPrice;
    });
    if (i < listingsChunks.length - 1) await sleep(LISTINGS_BATCH_DELAY_MS);
  }

  // getPricing/getCompetitivePricing both report "Success" even when a SKU has zero
  // buyable offers — they just omit Offers/CompetitivePrices entirely in that case. Some of
  // those still have the seller's own configured price in the listing — fall back to that
  // before giving up.
  for (const result of results.values()) {
    if (!result.error && result.listPrice === null && result.salesPrice === null && result.featuredPrice === null) {
      if (result.ourPrice !== null) {
        result.salesPrice = result.ourPrice;
      } else {
        result.error = "No active offer on Amazon";
      }
    }
  }

  return cleaned.map((sku) => results.get(sku)!);
}

// The Listings Items API returns the seller's own submitted listing. `attributes` is a
// map of attributeName -> array of values, but the exact nesting varies by product type,
// so every extraction below is defensive and falls back to null.
interface ListingsItemResponse {
  sku?: string;
  summaries?: { marketplaceId?: string; itemName?: string; asin?: string }[];
  attributes?: Record<string, unknown[]>;
}

function firstAttr(attributes: Record<string, unknown[]> | undefined, key: string): Record<string, unknown> | null {
  const value = attributes?.[key]?.[0];
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/** Reads a price sub-attribute of purchasable_offer (our_price, min/max seller allowed), with a top-level fallback. */
function extractOfferPrice(attributes: Record<string, unknown[]> | undefined, key: string): number | null {
  const offer = firstAttr(attributes, "purchasable_offer");
  const nested = offer?.[key];
  if (Array.isArray(nested)) {
    const schedule = (nested[0] as Record<string, unknown>)?.schedule;
    if (Array.isArray(schedule)) {
      const amount = asNumber((schedule[0] as Record<string, unknown>)?.value_with_tax);
      if (amount !== null) return amount;
    }
  }
  // Fallback: some product types expose it as a top-level attribute.
  const topLevel = firstAttr(attributes, key);
  return asNumber(topLevel?.value ?? topLevel?.value_with_tax);
}

function extractStringAttr(attributes: Record<string, unknown[]> | undefined, key: string): string | null {
  const attr = firstAttr(attributes, key);
  const value = attr?.value;
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

/**
 * Combines the Product Pricing API (sales/list/featured price) with the Listings Items API
 * (product name/description + seller-allowed min/max prices) for a single SKU. The listings
 * lookup is best-effort — a failure there leaves those fields null but keeps the prices.
 */
export async function getSkuDetail(sku: string, code: MarketplaceCode): Promise<SkuDetail> {
  const { id: marketplaceId, region } = marketplace(code);
  const [pricing] = await getSkuPricing([sku], code);

  const detail: SkuDetail = {
    sku,
    asin: null,
    salesPrice: pricing.salesPrice,
    discountedPrice: pricing.discountedPrice,
    listPrice: pricing.listPrice,
    featuredPrice: pricing.featuredPrice,
    minSellerAllowedPrice: null,
    maxSellerAllowedPrice: null,
    productName: null,
    productDescription: null,
    ourPrice: pricing.ourPrice,
    livePrice: pricing.livePrice,
    listPriceExact: pricing.listPriceAttr,
    error: pricing.error,
  };

  try {
    const { sellerId } = credentialsFor(region);
    const listing = await callSpApiJson<ListingsItemResponse>(
      `/listings/2021-08-01/items/${sellerId}/${encodeURIComponent(sku)}`,
      { marketplaceIds: marketplaceId, includedData: "summaries,attributes" },
      region
    );

    const attrs = listing.attributes;
    detail.asin = listing.summaries?.[0]?.asin ?? null;
    detail.productName = listing.summaries?.[0]?.itemName ?? extractStringAttr(attrs, "item_name");
    detail.productDescription = extractStringAttr(attrs, "product_description");
    detail.minSellerAllowedPrice = extractOfferPrice(attrs, "minimum_seller_allowed_price");
    detail.maxSellerAllowedPrice = extractOfferPrice(attrs, "maximum_seller_allowed_price");

    if (detail.listPrice === null) {
      const listPriceAttr = firstAttr(attrs, "list_price");
      detail.listPrice = asNumber(listPriceAttr?.value_with_tax ?? listPriceAttr?.value);
    }

    if (detail.listPriceExact === null) {
      const listPriceAttr = firstAttr(attrs, "list_price");
      detail.listPriceExact = asNumber(listPriceAttr?.value_with_tax ?? listPriceAttr?.value);
    }

  } catch {
    // Best-effort: keep the pricing fields; leave name/description/min/max as null.
  }

  return detail;
}
