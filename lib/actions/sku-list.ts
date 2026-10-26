"use server";

import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import * as XLSX from "xlsx";
import { getSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { listSellerSkus } from "@/lib/amazon/sp-api";
import type { MarketplaceCode } from "@/lib/amazon/marketplaces";
import { planInsertions } from "@/lib/sku-grouping";
import { cleanRegions, type SkuRegion } from "@/lib/sku-regions";

async function requireStaff() {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" as const };
  return { error: null };
}

export interface Sku {
  id: string;
  sku: string;
  position: number;
  /** Empty = Uncategorised. See lib/sku-regions.ts. */
  regions: SkuRegion[];
  created_at: string;
}

export async function listSkus() {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();
  const { data, error: dbError } = await client
    .from("sku_master_list")
    .select("id, sku, position, regions, created_at")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  return { data: data as Sku[] | null, error: dbError?.message ?? null };
}

type ServiceClient = ReturnType<typeof createServiceClient>;

/**
 * Add `regions` to every row in `rows` that lacks one of them. Additive — never removes a region.
 * Rows are grouped by their resulting region set so it's one UPDATE per distinct set, not per row.
 */
async function addRegionsTo(
  service: ServiceClient,
  rows: { id: string; regions: string[] | null }[],
  regions: SkuRegion[]
): Promise<{ tagged: number; error: string | null }> {
  if (regions.length === 0) return { tagged: 0, error: null };

  const idsByRegions = new Map<string, string[]>();
  for (const row of rows) {
    const current = cleanRegions(row.regions);
    const next = cleanRegions([...current, ...regions]);
    if (next.length === current.length) continue;
    const key = next.join(",");
    idsByRegions.set(key, [...(idsByRegions.get(key) ?? []), row.id]);
  }

  let tagged = 0;
  for (const [key, ids] of idsByRegions) {
    for (let i = 0; i < ids.length; i += 200) {
      const chunk = ids.slice(i, i + 200);
      const { error } = await service
        .from("sku_master_list")
        .update({ regions: key.split(",") })
        .in("id", chunk);
      if (error) return { tagged, error: error.message };
      tagged += chunk.length;
    }
  }
  return { tagged, error: null };
}

/**
 * Append SKUs to the end of the list, tagged with `regions` (empty = Uncategorised). SKUs that
 * already exist keep their position; when `regions` is non-empty they gain those regions.
 */
export async function addSkus(skus: string[], regionsInput: string[] = []) {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  // SKUs are case-sensitive — preserve original case, only trim. Dedupe keeps first occurrence.
  const cleaned = [...new Set(skus.map((s) => s.trim()).filter(Boolean))];
  if (cleaned.length === 0) return { data: null, error: "No SKUs provided" };
  const regions = cleanRegions(regionsInput);

  const service = createServiceClient();

  // New SKUs land at the end of the manual order, after the current max position.
  const { data: maxRow } = await service
    .from("sku_master_list")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const start = (maxRow?.position ?? -1) + 1;

  const { data, error: dbError } = await service
    .from("sku_master_list")
    .upsert(
      cleaned.map((sku, i) => ({ sku, position: start + i, regions })),
      { onConflict: "sku", ignoreDuplicates: true }
    )
    .select("id, sku, position, regions, created_at");
  if (dbError) return { data: null, error: dbError.message };

  if (regions.length > 0) {
    const insertedSet = new Set((data ?? []).map((r) => r.sku as string));
    const existingSkus = cleaned.filter((s) => !insertedSet.has(s));
    if (existingSkus.length > 0) {
      const { data: existingRows, error: readError } = await service
        .from("sku_master_list")
        .select("id, regions")
        .in("sku", existingSkus);
      if (readError) return { data: null, error: readError.message };
      const { error: tagError } = await addRegionsTo(service, existingRows ?? [], regions);
      if (tagError) return { data: null, error: tagError };
    }
  }

  return { data: data as Sku[] | null, error: null };
}

/** Set one SKU's regions outright (the row tag on the master list). Empty = Uncategorised. */
export async function setSkuRegions(id: string, regionsInput: string[]) {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const regions = cleanRegions(regionsInput);
  const service = createServiceClient();
  const { error: dbError } = await service
    .from("sku_master_list")
    .update({ regions })
    .eq("id", id);

  return { data: dbError ? null : { regions }, error: dbError?.message ?? null };
}

/**
 * Replace the entire master list with `skus`. After this runs the table holds exactly the
 * provided SKUs, in the given order (`position` 0..n-1). Existing SKUs not in the list are
 * removed. Done as upsert-then-delete (never a moment of emptiness).
 */
export async function replaceSkus(skus: string[]) {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  // Preserve import order and original case (SKUs are case-sensitive); drop empties, dedupe keeping first occurrence.
  const cleaned = [...new Set(skus.map((s) => s.trim()).filter(Boolean))];
  if (cleaned.length === 0) return { data: null, error: "No SKUs provided" };

  const service = createServiceClient();

  // 1. Snapshot existing rows so we know which to delete afterwards.
  const { data: existing, error: fetchError } = await service
    .from("sku_master_list")
    .select("id, sku");
  if (fetchError) return { data: null, error: fetchError.message };

  // 2. Upsert the imported set with fresh positions (kept SKUs re-positioned, new inserted).
  const { error: upsertError } = await service
    .from("sku_master_list")
    .upsert(
      cleaned.map((sku, i) => ({ sku, position: i })),
      { onConflict: "sku" }
    );
  if (upsertError) return { data: null, error: upsertError.message };

  // 3. Delete rows whose sku isn't in the imported set, by id, in chunks.
  const keep = new Set(cleaned);
  const staleIds = (existing ?? [])
    .filter((r) => !keep.has(r.sku as string))
    .map((r) => r.id as string);

  for (let i = 0; i < staleIds.length; i += 200) {
    const chunk = staleIds.slice(i, i + 200);
    const { error: delError } = await service.from("sku_master_list").delete().in("id", chunk);
    if (delError) return { data: null, error: delError.message };
  }

  return { data: { ok: true }, error: null };
}

/**
 * Persist a new manual order for the master list. `orderedIds` is the full list of
 * SKU ids in the desired top-to-bottom order; each row's `position` is set to its
 * index. Ids not currently in the table are ignored by the upsert (they simply won't
 * match an existing row's `sku` — but since we upsert on `id`, unknown ids would insert
 * empty rows, so we filter to known ids first).
 */
export async function reorderSkus(orderedIds: string[]) {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  if (orderedIds.length === 0) return { data: { ok: true }, error: null };

  const service = createServiceClient();

  // Only reorder ids that actually exist, so a stale client list can't insert junk rows.
  // `sku` is included in each upsert row because it is NOT NULL — the upsert always
  // conflicts on the existing id and updates position, but the candidate row must still
  // carry a valid sku.
  const { data: existing, error: fetchError } = await service
    .from("sku_master_list")
    .select("id, sku");
  if (fetchError) return { data: null, error: fetchError.message };

  const skuById = new Map((existing ?? []).map((r) => [r.id as string, r.sku as string]));
  const rows = orderedIds
    .filter((id) => skuById.has(id))
    .map((id, index) => ({ id, sku: skuById.get(id)!, position: index }));

  if (rows.length === 0) return { data: { ok: true }, error: null };

  const { error: dbError } = await service
    .from("sku_master_list")
    .upsert(rows, { onConflict: "id" });

  return { data: dbError ? null : { ok: true }, error: dbError?.message ?? null };
}

// --- Pull from Amazon ---

const PAGE_SIZE = 1000;
const AMAZON_GENERATED_SKU = /^amzn\./i;

/** Whole table in position order, paged past PostgREST's 1000-row cap — a truncated read here would mis-order the rewrite. */
async function readAllSkusOrdered(service: ServiceClient) {
  const rows: { id: string; sku: string; regions: string[] | null }[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await service
      .from("sku_master_list")
      .select("id, sku, regions")
      .order("position", { ascending: true })
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) return { data: null, error: error.message };
    rows.push(...((data ?? []) as { id: string; sku: string; regions: string[] | null }[]));
    if (!data || data.length < PAGE_SIZE) return { data: rows, error: null };
  }
}

export interface MissingAmazonSku {
  sku: string;
  asin: string | null;
  itemName: string | null;
  /** Existing SKU this one would land directly below; null = new group, appended at the end. */
  anchor: string | null;
  /** Existing SKU that differs from this one only in letter case — likely the same product. */
  caseClash: string | null;
}

/** A buyable Amazon SKU that's already in the master list, with the regions it has today. */
export interface ExistingAmazonSku {
  sku: string;
  itemName: string | null;
  regions: SkuRegion[];
}

/**
 * Read-only: buyable SKUs in one marketplace that aren't in the master list yet, each with where
 * `addSkusGrouped` would put it. Nothing is written.
 */
export async function fetchAmazonMissingSkus(code: MarketplaceCode) {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  let listings;
  try {
    listings = await listSellerSkus(code, { buyableOnly: true });
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : "Amazon listings lookup failed" };
  }

  const { data: existing, error: readError } = await readAllSkusOrdered(createServiceClient());
  if (readError || !existing) return { data: null, error: readError ?? "Couldn't read the master list" };

  const existingSkus = existing.map((r) => r.sku);
  const existingSet = new Set(existingSkus);
  const regionsBySku = new Map(existing.map((r) => [r.sku, cleanRegions(r.regions)]));
  const byLower = new Map(existingSkus.map((s) => [s.toLowerCase(), s]));

  const buyable = listings.filter((l) => l.buyable);
  // "amzn.gr.<sku>-<id>" listings are Amazon-generated Grade & Resell (returned/used) offers of
  // our products, not products of our own — 500+ of them on US alone.
  const resale = buyable.filter((l) => AMAZON_GENERATED_SKU.test(l.sku));
  const missingListings = buyable.filter(
    (l) => !existingSet.has(l.sku) && !AMAZON_GENERATED_SKU.test(l.sku)
  );
  const { order, anchors } = planInsertions(
    existingSkus,
    missingListings.map((l) => l.sku)
  );

  // Show them in the order they'll appear in the list.
  const rank = new Map(order.map((sku, i) => [sku, i]));
  const missing: MissingAmazonSku[] = missingListings
    .map((l) => ({
      sku: l.sku,
      asin: l.asin,
      itemName: l.itemName,
      anchor: anchors.get(l.sku) ?? null,
      caseClash: byLower.get(l.sku.toLowerCase()) ?? null,
    }))
    .sort((a, b) => (rank.get(a.sku) ?? 0) - (rank.get(b.sku) ?? 0));

  // The client decides which of these lack the region(s) being pulled; list order = master list order.
  const existingRank = new Map(existingSkus.map((sku, i) => [sku, i]));
  const existingMatches: ExistingAmazonSku[] = buyable
    .filter((l) => existingSet.has(l.sku))
    .map((l) => ({ sku: l.sku, itemName: l.itemName, regions: regionsBySku.get(l.sku) ?? [] }))
    .sort((a, b) => (existingRank.get(a.sku) ?? 0) - (existingRank.get(b.sku) ?? 0));

  return {
    data: {
      missing,
      existingMatches,
      buyableCount: buyable.length,
      alreadyInList: buyable.length - resale.length - missingListings.length,
      resaleSkipped: resale.length,
    },
    error: null,
  };
}

/**
 * Add SKUs, each placed directly below the last row of its prefix group (see `planInsertions`).
 * Additive only: never deletes, and existing rows keep their relative order — only their
 * `position` numbers shift to make room. Placement is planned from a fresh DB read, not the
 * client's copy of the list. New SKUs get `regions`; SKUs in `skus` that already exist gain
 * `regions` (union) without moving.
 */
export async function addSkusGrouped(skus: string[], regionsInput: string[] = []) {
  const { error } = await requireStaff();
  if (error) return { data: null, error };
  const regions = cleanRegions(regionsInput);

  const service = createServiceClient();
  const { data: existing, error: readError } = await readAllSkusOrdered(service);
  if (readError || !existing) return { data: null, error: readError ?? "Couldn't read the master list" };

  const requested = new Set(skus.map((s) => s.trim()).filter(Boolean));
  const { tagged, error: tagError } = await addRegionsTo(
    service,
    existing.filter((r) => requested.has(r.sku)),
    regions
  );
  if (tagError) return { data: null, error: tagError };

  const { order, anchors } = planInsertions(
    existing.map((r) => r.sku),
    skus
  );
  const fresh = [...anchors.keys()];
  if (fresh.length === 0) return { data: { added: 0, tagged }, error: null };

  // 1. Insert at the bottom first. If step 2 fails the SKUs are still saved, just unsorted.
  const start = existing.length;
  const { data: inserted, error: insertError } = await service
    .from("sku_master_list")
    .upsert(
      fresh.map((sku, i) => ({ sku, position: start + i, regions })),
      { onConflict: "sku", ignoreDuplicates: true }
    )
    .select("id, sku");
  if (insertError) return { data: null, error: insertError.message };

  // 2. Renumber every row to the merged order (upsert on id, as reorderSkus does).
  const idBySku = new Map(
    [...existing, ...((inserted ?? []) as { id: string; sku: string }[])].map((r) => [r.sku, r.id])
  );
  const rows = order
    .filter((sku) => idBySku.has(sku))
    .map((sku, position) => ({ id: idBySku.get(sku)!, sku, position }));
  const { error: positionError } = await service
    .from("sku_master_list")
    .upsert(rows, { onConflict: "id" });
  if (positionError) {
    return {
      data: null,
      error: `Added ${inserted?.length ?? 0} SKUs, but couldn't move them into their groups (${positionError.message}) — they're at the bottom of the list.`,
    };
  }

  return { data: { added: inserted?.length ?? 0, tagged }, error: null };
}

export async function deleteSku(id: string) {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const service = createServiceClient();
  const { error: dbError } = await service.from("sku_master_list").delete().eq("id", id);

  return { data: dbError ? null : { ok: true }, error: dbError?.message ?? null };
}

// --- AI-assisted Excel import ---

// Deliberately does not include "asin" — a sheet with both ASIN and SKU columns should always
// lock onto the real SKU column. ASIN-only sheets (no match here at all) fall through to the
// AI detector below, which is trusted to use ASIN as the identifier only when no SKU column exists.
const SKU_HINTS = ["sku", "item number", "item #", "item no", "product code", "product id"];
const STATUS_HINTS = ["status", "active", "enabled", "live", "state"];

// Normalized (trim + lowercase) exact-match values that mean a row's SKU is inactive/discontinued.
const INACTIVE_KEYWORDS = [
  "inactive",
  "disabled",
  "discontinued",
  "no",
  "n",
  "false",
  "0",
  "archived",
  "suspended",
  "paused",
  "delisted",
  "removed",
  "out of stock",
];

function normalizeHeader(cell: unknown): string {
  return String(cell ?? "").trim().toLowerCase();
}

function findColumn(row: unknown[], hints: string[]): number {
  let col = -1;
  row.forEach((cell, i) => {
    const h = normalizeHeader(cell);
    if (col === -1 && hints.some((hint) => h.includes(hint))) col = i;
  });
  return col;
}

function isInactive(rawValue: unknown, hints: string[] = []): boolean {
  const v = String(rawValue ?? "").trim().toLowerCase();
  if (!v) return false;
  return INACTIVE_KEYWORDS.includes(v) || hints.some((h) => h.trim().toLowerCase() === v);
}

interface ColumnMapping {
  headerRowIndex: number;
  skuCol: number;
  statusCol?: number;
  inactiveHints?: string[];
}

function detectColumnHeuristically(matrix: unknown[][]): ColumnMapping | null {
  const maxScan = Math.min(matrix.length, 15);
  for (let r = 0; r < maxScan; r++) {
    const row = matrix[r] ?? [];
    const skuCol = findColumn(row, SKU_HINTS);
    if (skuCol !== -1) {
      const statusCol = detectStatusColumnHeuristically(row, skuCol);
      return { headerRowIndex: r, skuCol, ...(statusCol !== null ? { statusCol } : {}) };
    }
  }
  return null;
}

/** Scans the same header row already found for the SKU column for a status/active header, skipping the SKU column itself. */
function detectStatusColumnHeuristically(headerRow: unknown[], skuCol: number): number | null {
  let statusCol = -1;
  headerRow.forEach((cell, i) => {
    if (i === skuCol) return;
    const h = normalizeHeader(cell);
    if (statusCol === -1 && STATUS_HINTS.some((hint) => h.includes(hint))) statusCol = i;
  });
  return statusCol === -1 ? null : statusCol;
}

const ColumnDetectSchema = z.object({
  sheets: z.array(
    z.object({
      sheetName: z.string(),
      headerRowIndex: z.number().nullable(),
      skuColumnIndex: z.number().nullable(),
      statusColumnIndex: z.number().nullable(),
      inactiveValueHints: z.array(z.string()),
    })
  ),
});

/** Structure-only detection — Claude never sees or reproduces the actual SKU values, just which column holds them. */
async function detectColumnWithAi(
  sheets: { sheetName: string; matrix: unknown[][] }[]
): Promise<Record<string, ColumnMapping> | null> {
  const anthropic = new Anthropic();
  const preview = sheets
    .map(({ sheetName, matrix }) => {
      const rows = matrix
        .slice(0, 20)
        .map((row, i) => `[row ${i}] ${(row ?? []).map((c) => String(c ?? "")).join(" | ")}`);
      return `--- Sheet: ${sheetName} ---\n${rows.join("\n")}`;
    })
    .join("\n\n");

  let response;
  try {
    response = await anthropic.messages.parse({
      model: "claude-opus-4-8",
      max_tokens: 4000,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium", format: zodOutputFormat(ColumnDetectSchema) },
      messages: [
        {
          role: "user",
          content: `Identify the table structure in each sheet below (0-based row/column indices). Do NOT extract or reproduce any data values — only identify structure, except for inactiveValueHints as noted below.

A SKU is a short product/item identifier code (letters, numbers, dashes/underscores) — not a description, note, or free-text field. Use that to pick the right column even on messy or inconsistently formatted sheets. If a sheet has both an ASIN column and a separate SKU column, skuColumnIndex must be the SKU column — ASIN is only a valid identifier when no dedicated SKU column exists.

For each sheet return:
- headerRowIndex: the row index containing column headers (null if none)
- skuColumnIndex: the column index holding product/item SKUs (null if no such column exists in this sheet)
- statusColumnIndex: the column index holding an active/status/enabled flag for each item (null if no such column exists)
- inactiveValueHints: the distinct raw values you see in that status column (if any) that mean the item is inactive/discontinued/disabled (e.g. "Discontinued", "N", "No") — empty array if there's no status column or you're unsure

${preview}`,
        },
      ],
    });
  } catch {
    return null;
  }

  const parsed = response.parsed_output;
  if (!parsed) return null;

  const result: Record<string, ColumnMapping> = {};
  for (const s of parsed.sheets) {
    if (s.headerRowIndex === null || s.skuColumnIndex === null) continue;
    result[s.sheetName] = {
      headerRowIndex: s.headerRowIndex,
      skuCol: s.skuColumnIndex,
      ...(s.statusColumnIndex !== null ? { statusCol: s.statusColumnIndex } : {}),
      ...(s.inactiveValueHints.length > 0 ? { inactiveHints: s.inactiveValueHints } : {}),
    };
  }
  return Object.keys(result).length > 0 ? result : null;
}

export interface DetectedSkuSheet {
  sheetName: string;
  headerRowIndex: number;
  skuColumnLabel: string;
  source: "heuristic" | "ai";
  rowsFound: number;
  inactiveExcluded: number;
}

function extractSkusFromSheet(opts: {
  sheetName: string;
  matrix: unknown[][];
  mapping: ColumnMapping;
  source: "heuristic" | "ai";
  found: Set<string>;
  detected: DetectedSkuSheet[];
}) {
  const { sheetName, matrix, mapping, source, found, detected } = opts;
  const { headerRowIndex, skuCol, statusCol, inactiveHints } = mapping;
  const headerRow = matrix[headerRowIndex] ?? [];

  let rowsFound = 0;
  let inactiveExcluded = 0;
  for (let r = headerRowIndex + 1; r < matrix.length; r++) {
    const row = matrix[r];
    if (!row) continue;
    const raw = row[skuCol];
    if (raw === null || raw === undefined) continue;
    const sku = String(raw).trim();
    if (!sku) continue;
    if (statusCol !== undefined && isInactive(row[statusCol], inactiveHints)) {
      inactiveExcluded++;
      continue;
    }
    found.add(sku);
    rowsFound++;
  }

  detected.push({
    sheetName,
    headerRowIndex,
    skuColumnLabel: String(headerRow[skuCol] ?? `column ${skuCol}`),
    source,
    rowsFound,
    inactiveExcluded,
  });
}

export async function parseSkuExcel(formData: FormData) {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const file = formData.get("file");
  if (!(file instanceof File)) return { data: null, error: "No file provided" };
  if (file.size > 2_000_000) return { data: null, error: "File too large (max 2MB)" };

  let workbook: XLSX.WorkBook;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    workbook = XLSX.read(buffer, { type: "buffer" });
  } catch {
    return { data: null, error: "Couldn't read this file — make sure it's a valid Excel spreadsheet" };
  }

  const warnings: string[] = [];
  const found = new Set<string>();
  const detected: DetectedSkuSheet[] = [];
  const sheetsNeedingAi: { sheetName: string; matrix: unknown[][] }[] = [];

  for (const sheetName of workbook.SheetNames) {
    const matrix = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      header: 1,
      raw: true,
      defval: null,
    }) as unknown[][];
    if (matrix.length === 0) continue;

    const mapping = detectColumnHeuristically(matrix);
    if (!mapping) {
      sheetsNeedingAi.push({ sheetName, matrix });
      continue;
    }
    extractSkusFromSheet({ sheetName, matrix, mapping, source: "heuristic", found, detected });
  }

  if (sheetsNeedingAi.length > 0) {
    const columnMap = await detectColumnWithAi(sheetsNeedingAi);
    for (const { sheetName, matrix } of sheetsNeedingAi) {
      const mapping = columnMap?.[sheetName];
      if (!mapping) {
        warnings.push(`${sheetName}: couldn't identify a SKU column — sheet skipped.`);
        continue;
      }
      extractSkusFromSheet({ sheetName, matrix, mapping, source: "ai", found, detected });
    }
  }

  if (detected.length === 0) {
    return { data: null, error: "Couldn't find any recognizable SKU column in this file" };
  }

  // Preserve the order SKUs appear in the file (Set iteration = insertion order).
  // Do NOT sort — import order is persisted as `position` downstream.
  return { data: { skus: [...found], warnings, detected }, error: null };
}
