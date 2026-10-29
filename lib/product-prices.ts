/**
 * Shared types + sheet parsing for /market-ops/products (factory price list, RMB). Kept out of
 * lib/actions/product-prices.ts because a "use server" file must not export plain constants or
 * functions meant for client import (see CLAUDE.md → Server Actions).
 */

export interface ProductPrice {
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
}

export function formatRmb(value: number | null): string {
  if (value === null) return "—";
  return `¥${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** "12.5", "¥12.50", "RMB 1,200" → number. Blank → null. Anything else → NaN (reported as a warning). */
export function parsePrice(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === "number") return Number.isFinite(raw) ? Math.round(raw * 100) / 100 : NaN;
  const cleaned = String(raw).replace(/rmb|cny|元|[¥￥,\s]/gi, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : NaN;
}

const FACTORY_HEADER = /^(factory|supplier|vendor|工厂|供应商)/i;
const SKU_HEADER = /^(sku|seller\s*sku|item)/i;
const PRICE_HEADER = /(price|rmb|cny|cost|价格|单价)/i;

/**
 * Reads a Factory / SKU / Price sheet given as a row matrix. Finds the header row in the first
 * 10 rows; without one, assumes columns A/B/C from the first row. A blank factory cell inherits
 * the factory above it, since the source sheet groups rows by factory.
 */
export function parsePriceMatrix(matrix: unknown[][]): { rows: PriceSheetRow[]; warnings: string[] } {
  const warnings: string[] = [];
  let cols = { factory: 0, sku: 1, price: 2 };
  let start = 0;

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

    const dup = seen.get(sku);
    if (dup !== undefined) {
      warnings.push(`${sku} appears more than once — the last row wins.`);
      rows[dup] = { factory: currentFactory, sku, price };
      continue;
    }
    seen.set(sku, rows.length);
    rows.push({ factory: currentFactory, sku, price });
  }

  return { rows, warnings };
}
