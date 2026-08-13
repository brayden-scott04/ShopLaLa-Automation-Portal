/**
 * Every Amazon marketplace this portal knows about.
 *
 * Single source of truth for marketplace id, currency, SP-API region and
 * whether we are allowed to write real prices there. Mirrored by MARKETPLACES
 * in the pricing worker's amazon_api.py -- nothing enforces that across the two
 * repos, so they must be edited together.
 *
 * The contents were read back from Amazon with the live credentials
 * (GET /sellers/v1/marketplaceParticipations, one call per region), not copied
 * from docs. Amazon's own country code for the UK is "GB"; the Sponsored Brands
 * feature uses "UK" for its bulk files, which is a separate namespace.
 *
 * `live: false` means the marketplace is wired up end to end but the worker
 * stops short of the Amazon PATCH -- see is_live() in amazon_api.py. Flipping a
 * marketplace on is a one-word change here and in that file.
 */

export type Region = "NA" | "EU" | "FE";

/** SP-API is partitioned by region; a token issued for one is rejected by the others. */
export const REGION_HOSTS: Record<Region, string> = {
  NA: "https://sellingpartnerapi-na.amazon.com",
  EU: "https://sellingpartnerapi-eu.amazon.com",
  FE: "https://sellingpartnerapi-fe.amazon.com",
};

export const REGION_LABELS: Record<Region, string> = {
  NA: "North America",
  EU: "Europe",
  FE: "Asia Pacific",
};

export interface Marketplace {
  id: string;
  currency: string;
  region: Region;
  /** false -> price writes are simulated, never sent to Amazon. */
  live: boolean;
  label: string;
}

export const MARKETPLACES = {
  // --- North America -------------------------------------------------------
  US: { id: "ATVPDKIKX0DER",  currency: "USD", region: "NA", live: true,  label: "United States" },
  CA: { id: "A2EUQ1WTGCTBG2", currency: "CAD", region: "NA", live: true,  label: "Canada" },
  MX: { id: "A1AM78C64UM0Y8", currency: "MXN", region: "NA", live: false, label: "Mexico" },

  // --- Europe (also covers the Middle East marketplaces) -------------------
  GB: { id: "A1F83G8C2ARO7P", currency: "GBP", region: "EU", live: false, label: "United Kingdom" },
  DE: { id: "A1PA6795UKMFR9", currency: "EUR", region: "EU", live: false, label: "Germany" },
  FR: { id: "A13V1IB3VIYZZH", currency: "EUR", region: "EU", live: false, label: "France" },
  IT: { id: "APJ6JRA9NG5V4",  currency: "EUR", region: "EU", live: false, label: "Italy" },
  ES: { id: "A1RKKUPIHCS9HS", currency: "EUR", region: "EU", live: false, label: "Spain" },
  NL: { id: "A1805IZSGTT6HS", currency: "EUR", region: "EU", live: false, label: "Netherlands" },
  BE: { id: "AMEN7PMS3EDWL",  currency: "EUR", region: "EU", live: false, label: "Belgium" },
  IE: { id: "A28R8C7NBKEWEA", currency: "EUR", region: "EU", live: false, label: "Ireland" },
  SE: { id: "A2NODRKZP88ZB9", currency: "SEK", region: "EU", live: false, label: "Sweden" },
  PL: { id: "A1C3SOZRARQ6R3", currency: "PLN", region: "EU", live: false, label: "Poland" },
  AE: { id: "A2VIGQ35RCS4UG", currency: "AED", region: "EU", live: false, label: "United Arab Emirates" },
  SA: { id: "A17E79C6D8DWNP", currency: "SAR", region: "EU", live: false, label: "Saudi Arabia" },

  // --- Far East ------------------------------------------------------------
  AU: { id: "A39IBJ37TRP1C6", currency: "AUD", region: "FE", live: false, label: "Australia" },
} as const satisfies Record<string, Marketplace>;

export type MarketplaceCode = keyof typeof MARKETPLACES;

/** Kept for the existing `MARKETPLACE_IDS[code]` call shape. */
export const MARKETPLACE_IDS = Object.fromEntries(
  Object.entries(MARKETPLACES).map(([code, m]) => [code, m.id])
) as Record<MarketplaceCode, string>;

export const MARKETPLACE_CODES = Object.keys(MARKETPLACES) as MarketplaceCode[];

export function marketplace(code: MarketplaceCode): Marketplace {
  const entry = MARKETPLACES[code];
  if (!entry) {
    // Never fall back to a default -- silently pricing one country's listing
    // against another's is exactly the bug this registry exists to prevent.
    throw new Error(`Unknown marketplace "${code}"`);
  }
  return entry;
}

export function isLiveMarketplace(code: MarketplaceCode): boolean {
  return MARKETPLACES[code]?.live ?? false;
}

/** Marketplaces grouped by region, for <optgroup> in the pickers. */
export function marketplacesByRegion(): { region: Region; label: string; codes: MarketplaceCode[] }[] {
  const order: Region[] = ["NA", "EU", "FE"];
  return order.map((region) => ({
    region,
    label: REGION_LABELS[region],
    codes: MARKETPLACE_CODES.filter((c) => MARKETPLACES[c].region === region),
  }));
}

/**
 * Format money in a marketplace's own currency. The old formatters hardcoded
 * "$", which rendered a €19.99 plan as $19.99.
 */
export function formatMoney(amount: number | null, code: MarketplaceCode): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return "—";
  const { currency } = marketplace(code);
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    // Unknown currency code -> still show the number rather than nothing.
    return `${amount.toFixed(2)} ${currency}`;
  }
}
