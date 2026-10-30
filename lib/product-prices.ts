/**
 * Shared types + sheet parsing for /market-ops/products (factory price list, RMB). Kept out of
 * lib/actions/product-prices.ts because a "use server" file must not export plain constants or
 * functions meant for client import (see CLAUDE.md → Server Actions).
 */

export const TIERS = ["SS", "OS"] as const;
export const TERMS = ["EXW", "FOB"] as const;
export const MATERIALS = ["Wood", "Coco", "Other"] as const;

/** The per-SKU columns beyond the unit price. Fees are per unit, in RMB. */
export interface ProductDetails {
  tier: string | null;
  term: string | null;
  material: string | null;
  /** Factory to our Guangzhou warehouse. Null on FOB rows: the supplier pays. */
  local_delivery_rmb: number | null;
  /** Guangzhou to the US Amazon FC. */
  shipping_fee_rmb: number | null;
  /** 0.03 = 3%. The commission itself is always derived from the price. */
  commission_rate: number | null;
  /** The sheet's "Up date": "2026-07-09", or "2026-07" when it only gave a month. */
  price_updated: string | null;
}

export interface ProductPrice extends ProductDetails {
  id: string;
  sku: string;
  partner_id: string | null;
  price_rmb: number | null;
  position: number;
  updated_at: string;
  updated_by: string | null;
}

export interface FactoryRef {
  id: string;
  short_name: string;
  sort_order: number;
}

export interface PriceSheetRow {
  factory: string;
  sku: string;
  price: number | null;
  /** Only the columns the sheet actually has, so an older Factory/SKU/Price file wipes nothing. */
  details?: Partial<ProductDetails>;
}

export function formatRmb(value: number | null): string {
  if (value === null) return "—";
  return `¥${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function commissionRmb(row: Pick<ProductPrice, "price_rmb" | "commission_rate">): number | null {
  if (row.price_rmb === null || row.commission_rate === null) return null;
  return row.price_rmb * row.commission_rate;
}

/** Unit price plus all per-unit fees. Null until the row has a price and a shipping fee. */
export function landedCostRmb(row: ProductPrice): number | null {
  if (row.price_rmb === null || row.shipping_fee_rmb === null) return null;
  return row.price_rmb + (row.local_delivery_rmb ?? 0) + row.shipping_fee_rmb + (commissionRmb(row) ?? 0);
}

/** "12.5", "¥12.50", "RMB 1,200" → number. Blank → null. Anything else → NaN (reported as a warning). */
export function parsePrice(raw: unknown, decimals = 2): number | null {
  if (raw === null || raw === undefined) return null;
  const scale = 10 ** decimals;
  if (typeof raw === "number") return Number.isFinite(raw) ? Math.round(raw * scale) / scale : NaN;
  const cleaned = String(raw).replace(/rmb|cny|元|[¥￥,\s]/gi, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n >= 0 ? Math.round(n * scale) / scale : NaN;
}

/** 20260709 → "2026-07-09", 202607 → "2026-07". Anything else is kept as written. */
function parseUpdated(raw: unknown): string | null {
  const text = String(raw ?? "").trim();
  if (!text) return null;
  const full = text.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (full) return `${full[1]}-${full[2]}-${full[3]}`;
  const month = text.match(/^(\d{4})(\d{2})$/);
  return month ? `${month[1]}-${month[2]}` : text;
}

/** 0.03 or "3%" → 0.03. */
function parseRate(raw: unknown): number | null {
  const text = String(raw ?? "").trim();
  if (text.endsWith("%")) {
    const n = parsePrice(text.slice(0, -1), 4);
    return n === null || Number.isNaN(n) ? n : Math.round(n * 100) / 10000;
  }
  return parsePrice(raw, 4);
}

const FACTORY_HEADER = /^(factory|supplier|vendor|工厂|供应商)/i;
const SKU_HEADER = /^(sku|seller\s*sku|item)/i;
const PRICE_HEADER = /(price|rmb|cny|cost|价格|单价)/i;

const DETAIL_HEADERS: Record<keyof ProductDetails, RegExp> = {
  tier: /^tier$/i,
  term: /^(term|incoterm)s?$/i,
  material: /^(type|material)$/i,
  local_delivery_rmb: /^local\s*delivery/i,
  shipping_fee_rmb: /^shipping/i,
  // "Com" is the rate; the sheet's "Commission" column is rate × price, so it isn't read.
  commission_rate: /^com(\s*%|\s*rate)?$|^commission\s*(%|rate)$/i,
  price_updated: /^up\s*-?\s*date/i,
};
const DETAIL_KEYS = Object.keys(DETAIL_HEADERS) as (keyof ProductDetails)[];

const ALLOWED: Partial<Record<keyof ProductDetails, readonly string[]>> = {
  tier: TIERS,
  term: TERMS,
  material: MATERIALS,
};

function parseDetail(
  key: keyof ProductDetails,
  raw: unknown
): { value: string | number | null; invalid: boolean } {
  if (key === "price_updated") return { value: parseUpdated(raw), invalid: false };
  const allowed = ALLOWED[key];
  if (allowed) {
    const text = String(raw ?? "").trim();
    const match = allowed.find((v) => v.toLowerCase() === text.toLowerCase());
    return { value: match ?? null, invalid: !!text && !match };
  }
  const n = key === "commission_rate" ? parseRate(raw) : parsePrice(raw, 4);
  const invalid = n !== null && (Number.isNaN(n) || n < 0);
  return { value: invalid ? null : n, invalid };
}

/**
 * Reads a Factory / SKU / Price sheet given as a row matrix. Finds the header row in the first
 * 10 rows; without one, assumes columns A/B/C from the first row. A blank factory cell inherits
 * the factory above it, since the source sheet groups rows by factory.
 */
export function parsePriceMatrix(matrix: unknown[][]): { rows: PriceSheetRow[]; warnings: string[] } {
  const warnings: string[] = [];
  let cols = { factory: 0, sku: 1, price: 2 };
  let start = 0;
  let detailCols: [keyof ProductDetails, number][] = [];

  for (let r = 0; r < Math.min(matrix.length, 10); r++) {
    const cells = (matrix[r] ?? []).map((c) => String(c ?? "").trim());
    const f = cells.findIndex((c) => FACTORY_HEADER.test(c));
    const s = cells.findIndex((c) => SKU_HEADER.test(c));
    if (f === -1 || s === -1) continue;
    // The live sheet heads its price column with the quote date ("20/10/2026"), not a word,
    // so without a recognisable price header take the first non-empty header after SKU.
    let p = cells.findIndex((c, i) => i !== s && i !== f && PRICE_HEADER.test(c));
    if (p === -1) p = cells.findIndex((c, i) => i > s && i !== f && c !== "");
    if (p !== -1) {
      cols = { factory: f, sku: s, price: p };
      start = r + 1;
      detailCols = DETAIL_KEYS.flatMap((key) => {
        const i = cells.findIndex((c) => DETAIL_HEADERS[key].test(c));
        return i === -1 ? [] : [[key, i] as [keyof ProductDetails, number]];
      });
      break;
    }
  }

  const rows: PriceSheetRow[] = [];
  const seen = new Map<string, number>();
  let currentFactory = "";

  for (let r = start; r < matrix.length; r++) {
    const row = matrix[r] ?? [];
    const factoryCell = String(row[cols.factory] ?? "").trim();
    if (factoryCell) currentFactory = factoryCell;
    const sku = String(row[cols.sku] ?? "").trim();
    if (!sku) continue;

    let price = parsePrice(row[cols.price]);
    if (Number.isNaN(price)) {
      warnings.push(`Row ${r + 1} (${sku}): "${row[cols.price]}" isn't a price — left blank.`);
      price = null;
    }
    if (!currentFactory) warnings.push(`Row ${r + 1} (${sku}): no factory — will be Unassigned.`);

    const details: Record<string, string | number | null> = {};
    for (const [key, col] of detailCols) {
      const { value, invalid } = parseDetail(key, row[col]);
      if (invalid) warnings.push(`Row ${r + 1} (${sku}): "${row[col]}" isn't a valid ${key} — left blank.`);
      details[key] = value;
    }
    const parsed: PriceSheetRow = {
      factory: currentFactory,
      sku,
      price,
      details: details as Partial<ProductDetails>,
    };

    const dup = seen.get(sku);
    if (dup !== undefined) {
      warnings.push(`${sku} appears more than once — the last row wins.`);
      rows[dup] = parsed;
      continue;
    }
    seen.set(sku, rows.length);
    rows.push(parsed);
  }

  return { rows, warnings };
}
