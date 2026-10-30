"use server";

import * as XLSX from "xlsx";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getSession } from "@/lib/session";
import { getMyPermissions } from "@/lib/permissions";
import { isAllowed } from "@/lib/roles";
import { SHORT_NAME_MAX } from "@/lib/partners-constants";
import {
  MATERIALS,
  parsePriceMatrix,
  TERMS,
  TIERS,
  type FactoryRef,
  type PriceSheetRow,
  type ProductDetails,
  type ProductPrice,
} from "@/lib/product-prices";

type Result<T> = { data: T | null; error: string | null };

export interface PriceImportPreview {
  rows: PriceSheetRow[];
  warnings: string[];
  newFactories: string[];
  added: number;
  updated: number;
  unchanged: number;
}

/** Same item check the page's layout.tsx guard enforces on navigation. */
async function requireProductsAccess() {
  const session = await getSession();
  if (!session) return { session: null, error: "Unauthorized" as const };

  const { role, permissions } = await getMyPermissions();
  if (!isAllowed(role, permissions, "marketOps", "products")) {
    return { session: null, error: "Forbidden" as const };
  }
  return { session, error: null };
}

function cleanPrice(price: number | null): { price: number | null; error: string | null } {
  if (price === null) return { price: null, error: null };
  if (!Number.isFinite(price) || price < 0) return { price: null, error: "Enter a valid price" };
  return { price: Math.round(price * 100) / 100, error: null };
}

function toNumber(value: unknown): number | null {
  return value === null || value === undefined ? null : Number(value);
}

const DETAIL_COLUMNS =
  "tier, term, material, local_delivery_rmb, shipping_fee_rmb, commission_rate, price_updated";
const NUMERIC_DETAILS = ["local_delivery_rmb", "shipping_fee_rmb", "commission_rate"] as const;

/** Validates whichever detail fields are present; absent ones stay absent. */
function cleanDetails(changes: Partial<ProductDetails>): {
  details: Partial<ProductDetails>;
  error: string | null;
} {
  const details: Partial<ProductDetails> = { ...changes };
  const options = [
    ["tier", TIERS],
    ["term", TERMS],
    ["material", MATERIALS],
  ] as const;
  for (const [key, allowed] of options) {
    const value = details[key];
    if (value && !(allowed as readonly string[]).includes(value)) {
      return { details: {}, error: `Invalid ${key}` };
    }
  }
  for (const key of NUMERIC_DETAILS) {
    const value = details[key];
    if (value === undefined || value === null) continue;
    if (!Number.isFinite(value) || value < 0) return { details: {}, error: "Enter a valid amount" };
    details[key] = Math.round(value * 10000) / 10000;
  }
  return { details, error: null };
}

async function listFactories(client: Awaited<ReturnType<typeof createClient>>) {
  return client
    .from("supply_partners")
    .select("id, short_name, sort_order")
    .eq("kind", "factory")
    .order("sort_order");
}

export async function listProductPrices(): Promise<
  Result<{ prices: ProductPrice[]; factories: FactoryRef[] }>
> {
  const { error } = await requireProductsAccess();
  if (error) return { data: null, error };

  const client = await createClient();
  const [pricesRes, factoriesRes] = await Promise.all([
    client
      .from("product_prices")
      .select(`id, sku, partner_id, price_rmb, position, updated_at, updated_by, ${DETAIL_COLUMNS}`)
      .order("position")
      .range(0, 9999),
    listFactories(client),
  ]);
  if (pricesRes.error) return { data: null, error: pricesRes.error.message };
  if (factoriesRes.error) return { data: null, error: factoriesRes.error.message };

  const prices = (pricesRes.data ?? []).map((p) => ({
    ...p,
    price_rmb: toNumber(p.price_rmb),
    local_delivery_rmb: toNumber(p.local_delivery_rmb),
    shipping_fee_rmb: toNumber(p.shipping_fee_rmb),
    commission_rate: toNumber(p.commission_rate),
  }));
  return { data: { prices, factories: factoriesRes.data ?? [] }, error: null };
}

/**
 * For the Master List SKU dialog. Only needs a session — staff without Products access still see
 * the price; the "Go to price list" link is what the Products guard protects.
 */
export async function getPriceForSku(
  sku: string
): Promise<Result<{ price_rmb: number | null; factory: string | null } | null>> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const client = await createClient();
  const { data, error } = await client
    .from("product_prices")
    .select("price_rmb, supply_partners(short_name)")
    .eq("sku", sku)
    .maybeSingle();
  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: null };

  const partner = data.supply_partners as unknown as { short_name: string } | null;
  return {
    data: { price_rmb: toNumber(data.price_rmb), factory: partner?.short_name ?? null },
    error: null,
  };
}

export async function setProductPrice(id: string, price: number | null): Promise<Result<null>> {
  const { session, error } = await requireProductsAccess();
  if (error) return { data: null, error };
  const { price: clean, error: priceError } = cleanPrice(price);
  if (priceError) return { data: null, error: priceError };

  const service = createServiceClient();
  const { error: dbError } = await service
    .from("product_prices")
    .update({ price_rmb: clean, updated_at: new Date().toISOString(), updated_by: session.username })
    .eq("id", id);
  if (dbError) return { data: null, error: dbError.message };
  return { data: null, error: null };
}

export async function setProductDetails(id: string, changes: Partial<ProductDetails>): Promise<Result<null>> {
  const { session, error } = await requireProductsAccess();
  if (error) return { data: null, error };
  const { details, error: detailError } = cleanDetails(changes);
  if (detailError) return { data: null, error: detailError };

  const service = createServiceClient();
  const { error: dbError } = await service
    .from("product_prices")
    .update({ ...details, updated_at: new Date().toISOString(), updated_by: session.username })
    .eq("id", id);
  if (dbError) return { data: null, error: dbError.message };
  return { data: null, error: null };
}

export async function setProductFactory(id: string, partnerId: string | null): Promise<Result<null>> {
  const { session, error } = await requireProductsAccess();
  if (error) return { data: null, error };

  const service = createServiceClient();
  const { error: dbError } = await service
    .from("product_prices")
    .update({ partner_id: partnerId, updated_at: new Date().toISOString(), updated_by: session.username })
    .eq("id", id);
  if (dbError) return { data: null, error: dbError.message };
  return { data: null, error: null };
}

export async function addProductPrice(
  sku: string,
  partnerId: string | null,
  price: number | null
): Promise<Result<null>> {
  const { session, error } = await requireProductsAccess();
  if (error) return { data: null, error };

  const trimmed = sku.trim();
  if (!trimmed) return { data: null, error: "Enter a SKU" };
  const { price: clean, error: priceError } = cleanPrice(price);
  if (priceError) return { data: null, error: priceError };

  const service = createServiceClient();
  const { data: last } = await service
    .from("product_prices")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error: dbError } = await service.from("product_prices").insert({
    sku: trimmed,
    partner_id: partnerId,
    price_rmb: clean,
    position: (last?.position ?? -1) + 1,
    updated_by: session.username,
  });
  if (dbError) {
    return {
      data: null,
      error: dbError.code === "23505" ? `${trimmed} is already in the price list` : dbError.message,
    };
  }
  return { data: null, error: null };
}

export async function deleteProductPrice(id: string): Promise<Result<null>> {
  const { error } = await requireProductsAccess();
  if (error) return { data: null, error };

  const service = createServiceClient();
  const { error: dbError } = await service.from("product_prices").delete().eq("id", id);
  if (dbError) return { data: null, error: dbError.message };
  return { data: null, error: null };
}

/** Reads the first sheet and diffs it against the current list. Writes nothing. */
export async function parsePriceExcel(formData: FormData): Promise<Result<PriceImportPreview>> {
  const { error } = await requireProductsAccess();
  if (error) return { data: null, error };

  const file = formData.get("file");
  if (!(file instanceof File)) return { data: null, error: "No file provided" };
  if (file.size > 5_000_000) return { data: null, error: "File too large (max 5MB)" };

  let matrix: unknown[][];
  try {
    const workbook = XLSX.read(Buffer.from(await file.arrayBuffer()), { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true, defval: null }) as unknown[][];
  } catch {
    return { data: null, error: "Couldn't read this file — make sure it's a valid Excel spreadsheet" };
  }

  const { rows, warnings } = parsePriceMatrix(matrix);
  if (rows.length === 0) return { data: null, error: "Couldn't find any Factory / SKU / Price rows in this file" };

  const client = await createClient();
  const [factoriesRes, pricesRes] = await Promise.all([
    listFactories(client),
    client.from("product_prices").select(`sku, partner_id, price_rmb, ${DETAIL_COLUMNS}`).range(0, 9999),
  ]);
  if (factoriesRes.error) return { data: null, error: factoriesRes.error.message };
  if (pricesRes.error) return { data: null, error: pricesRes.error.message };

  const factoryIds = new Map((factoriesRes.data ?? []).map((f) => [f.short_name.toLowerCase(), f.id]));
  const newFactories = [
    ...new Set(rows.map((r) => r.factory).filter((f) => f && !factoryIds.has(f.toLowerCase()))),
  ];
  for (const name of newFactories) {
    if (name.length > SHORT_NAME_MAX) {
      return { data: null, error: `Factory name "${name}" is longer than ${SHORT_NAME_MAX} characters` };
    }
  }

  const existing = new Map((pricesRes.data ?? []).map((p) => [p.sku, p]));
  let added = 0;
  let updated = 0;
  let unchanged = 0;
  for (const row of rows) {
    const current = existing.get(row.sku);
    if (!current) added++;
    else if (
      toNumber(current.price_rmb) !== row.price ||
      current.partner_id !== (factoryIds.get(row.factory.toLowerCase()) ?? null) ||
      Object.entries(row.details ?? {}).some(([key, value]) => {
        const stored = current[key as keyof ProductDetails];
        return (typeof value === "number" ? toNumber(stored) : stored) !== value;
      })
    )
      updated++;
    else unchanged++;
  }

  return { data: { rows, warnings, newFactories, added, updated, unchanged }, error: null };
}

/**
 * Upserts every row by SKU, creating factories that aren't in Partners yet. Never deletes:
 * SKUs missing from the file keep their current price.
 */
export async function importProductPrices(rows: PriceSheetRow[]): Promise<Result<{ written: number }>> {
  const { session, error } = await requireProductsAccess();
  if (error) return { data: null, error };
  if (!Array.isArray(rows) || rows.length === 0) return { data: null, error: "Nothing to import" };

  const service = createServiceClient();
  const { data: factories, error: fError } = await service
    .from("supply_partners")
    .select("id, short_name, sort_order")
    .eq("kind", "factory");
  if (fError) return { data: null, error: fError.message };

  const factoryIds = new Map((factories ?? []).map((f) => [f.short_name.toLowerCase(), f.id]));
  let nextOrder = Math.max(-1, ...(factories ?? []).map((f) => f.sort_order)) + 1;

  for (const name of new Set(rows.map((r) => r.factory.trim()).filter(Boolean))) {
    if (factoryIds.has(name.toLowerCase())) continue;
    if (name.length > SHORT_NAME_MAX) {
      return { data: null, error: `Factory name "${name}" is longer than ${SHORT_NAME_MAX} characters` };
    }
    const { data: created, error: cError } = await service
      .from("supply_partners")
      .insert({ kind: "factory", short_name: name, sort_order: nextOrder++, updated_by: session.username })
      .select("id")
      .single();
    if (cError || !created) return { data: null, error: cError?.message ?? `Couldn't create factory ${name}` };
    factoryIds.set(name.toLowerCase(), created.id);
  }

  for (const r of rows) {
    const { error: detailError } = cleanDetails(r.details ?? {});
    if (detailError) return { data: null, error: `${r.sku}: ${detailError}` };
  }

  const now = new Date().toISOString();
  const records = rows.map((r, i) => {
    const { price } = cleanPrice(r.price);
    return {
      ...cleanDetails(r.details ?? {}).details,
      sku: r.sku.trim(),
      partner_id: factoryIds.get(r.factory.trim().toLowerCase()) ?? null,
      price_rmb: price,
      position: i,
      updated_at: now,
      updated_by: session.username,
    };
  });

  for (let i = 0; i < records.length; i += 500) {
    const { error: uError } = await service
      .from("product_prices")
      .upsert(records.slice(i, i + 500), { onConflict: "sku" });
    if (uError) return { data: null, error: uError.message };
  }
  return { data: { written: records.length }, error: null };
}
