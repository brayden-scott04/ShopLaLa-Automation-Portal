"use server";

import * as XLSX from "xlsx";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
  ALERT_STATUSES,
  HISTORY_DAYS,
  MAX_SIDE_IN,
  MAX_WEIGHT_LB,
  type AlertCause,
  type AlertKind,
  type AlertStatus,
} from "@/lib/fba-fee-tracker-constants";

/**
 * FBA Fee Tracker (Tools → FBA Fee Tracker). Snapshots, alerts and run rows
 * are written daily by the LaLaGreen-Daily-Report worker
 * (reportlib/fba_fee_sync.py); this file only reads them, plus the two things
 * staff edit here: true package dimensions and alert status. Reads go through
 * the RLS client, writes through the service client after a session check.
 *
 * Expected fees are NOT computed here — the page runs lib/fba-fee-calculator.ts
 * itself so an edited dimension updates the expected fee instantly.
 */

const COUNTRY = "US";
const PAGE_SIZE = 1000; // PostgREST's default row cap

export interface FeeSnapshot {
  snapshot_date: string;
  sku: string;
  asin: string | null;
  product_name: string | null;
  longest_in: number | null;
  median_in: number | null;
  shortest_in: number | null;
  length_girth_in: number | null;
  weight_lb: number | null;
  size_tier: string | null;
  fee_per_unit: number | null;
  your_price: number | null;
  sales_price: number | null;
}

export interface TrueDims {
  sku: string;
  length_in: number | null;
  width_in: number | null;
  height_in: number | null;
  weight_lb: number | null;
  source: "amazon_first_seen" | "manual";
  updated_by: string | null;
  updated_at: string;
}

export interface FeeAlert {
  id: string;
  sku: string;
  asin: string | null;
  product_name: string | null;
  detected_date: string;
  previous_snapshot_date: string | null;
  kind: AlertKind;
  cause: AlertCause;
  old_fee: number | null;
  new_fee: number | null;
  pct_change: number | null;
  old_tier: string | null;
  new_tier: string | null;
  old_dims: DimsJson | null;
  new_dims: DimsJson | null;
  status: AlertStatus;
  case_id: string | null;
  notes: string | null;
  updated_by: string | null;
  updated_at: string | null;
}

export interface DimsJson {
  longest_in: number | null;
  median_in: number | null;
  shortest_in: number | null;
  weight_lb: number | null;
}

export interface SyncRun {
  status: "ok" | "error";
  snapshot_date: string | null;
  skus_seen: number;
  alerts_created: number;
  error: string | null;
  created_at: string;
}

export interface FbaFeeOverview {
  latestDate: string | null;
  baselineDate: string | null;
  latest: FeeSnapshot[];
  /** Fee/tier per SKU on baselineDate (oldest snapshot within HISTORY_DAYS). */
  baseline: Record<string, { fee_per_unit: number | null; size_tier: string | null }>;
  trueDims: Record<string, TrueDims>;
  /** Alerts still needing attention: open or case_raised. */
  alerts: FeeAlert[];
  lastRun: SyncRun | null;
  lastSuccessfulRun: SyncRun | null;
}

const SNAPSHOT_COLUMNS =
  "snapshot_date, sku, asin, product_name, longest_in, median_in, shortest_in, length_girth_in, weight_lb, size_tier, fee_per_unit, your_price, sales_price";
const ALERT_COLUMNS =
  "id, sku, asin, product_name, detected_date, previous_snapshot_date, kind, cause, old_fee, new_fee, pct_change, old_tier, new_tier, old_dims, new_dims, status, case_id, notes, updated_by, updated_at";
const RUN_COLUMNS = "status, snapshot_date, skus_seen, alerts_created, error, created_at";

async function requireStaff() {
  const session = await getSession();
  if (!session) return { session: null, error: "Unauthorized" as const };
  return { session, error: null };
}

/** Page through a select past PostgREST's 1000-row cap. */
async function selectAll<T>(
  build: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>
): Promise<{ data: T[]; error: string | null }> {
  const out: T[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await build(from, from + PAGE_SIZE - 1);
    if (error) return { data: [], error: error.message };
    out.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) return { data: out, error: null };
  }
}

function snapshotsOn(client: SupabaseClient, date: string, columns: string) {
  return selectAll<FeeSnapshot>((from, to) =>
    client
      .from("fba_fee_snapshots")
      .select(columns)
      .eq("country_code", COUNTRY)
      .eq("snapshot_date", date)
      .order("sku")
      .range(from, to)
      .returns<FeeSnapshot[]>()
  );
}

function daysBefore(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

export async function getFbaFeeOverview(): Promise<{ data: FbaFeeOverview | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();

  const [latestRes, runRes, okRunRes] = await Promise.all([
    client
      .from("fba_fee_snapshots")
      .select("snapshot_date")
      .eq("country_code", COUNTRY)
      .order("snapshot_date", { ascending: false })
      .limit(1)
      .maybeSingle(),
    client.from("fba_fee_sync_runs").select(RUN_COLUMNS).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    client
      .from("fba_fee_sync_runs")
      .select(RUN_COLUMNS)
      .eq("status", "ok")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);
  if (latestRes.error) return { data: null, error: latestRes.error.message };

  const latestDate: string | null = latestRes.data?.snapshot_date ?? null;
  const lastRun = (runRes.data as SyncRun | null) ?? null;
  const lastSuccessfulRun = (okRunRes.data as SyncRun | null) ?? null;

  if (!latestDate) {
    return {
      data: {
        latestDate: null,
        baselineDate: null,
        latest: [],
        baseline: {},
        trueDims: {},
        alerts: [],
        lastRun,
        lastSuccessfulRun,
      },
      error: null,
    };
  }

  // Baseline = the oldest snapshot inside the history window, so "Δ" reads as
  // "change over (up to) the last 90 days" even while history is still short.
  const baselineRes = await client
    .from("fba_fee_snapshots")
    .select("snapshot_date")
    .eq("country_code", COUNTRY)
    .gte("snapshot_date", daysBefore(latestDate, HISTORY_DAYS))
    .order("snapshot_date", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (baselineRes.error) return { data: null, error: baselineRes.error.message };
  const baselineDate: string | null = baselineRes.data?.snapshot_date ?? null;

  const [latest, baselineRows, dims, alerts] = await Promise.all([
    snapshotsOn(client, latestDate, SNAPSHOT_COLUMNS),
    baselineDate && baselineDate !== latestDate
      ? snapshotsOn(client, baselineDate, "sku, fee_per_unit, size_tier")
      : Promise.resolve({ data: [] as FeeSnapshot[], error: null }),
    selectAll<TrueDims>((from, to) =>
      client
        .from("fba_fee_true_dims")
        .select("sku, length_in, width_in, height_in, weight_lb, source, updated_by, updated_at")
        .eq("country_code", COUNTRY)
        .order("sku")
        .range(from, to)
        .returns<TrueDims[]>()
    ),
    selectAll<FeeAlert>((from, to) =>
      client
        .from("fba_fee_alerts")
        .select(ALERT_COLUMNS)
        .eq("country_code", COUNTRY)
        .in("status", ["open", "case_raised"])
        .order("detected_date", { ascending: false })
        .range(from, to)
        .returns<FeeAlert[]>()
    ),
  ]);
  const err = latest.error ?? baselineRows.error ?? dims.error ?? alerts.error;
  if (err) return { data: null, error: err };

  return {
    data: {
      latestDate,
      baselineDate: baselineDate !== latestDate ? baselineDate : null,
      latest: latest.data,
      baseline: Object.fromEntries(
        baselineRows.data.map((r) => [r.sku, { fee_per_unit: r.fee_per_unit, size_tier: r.size_tier }])
      ),
      trueDims: Object.fromEntries(dims.data.map((d) => [d.sku, d])),
      alerts: alerts.data,
      lastRun,
      lastSuccessfulRun,
    },
    error: null,
  };
}

export interface SkuHistory {
  snapshots: Pick<
    FeeSnapshot,
    "snapshot_date" | "fee_per_unit" | "size_tier" | "longest_in" | "median_in" | "shortest_in" | "weight_lb"
  >[];
  alerts: FeeAlert[];
}

export async function getSkuFeeHistory(sku: string): Promise<{ data: SkuHistory | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();
  const since = daysBefore(new Date().toISOString().slice(0, 10), HISTORY_DAYS);

  const [snaps, alerts] = await Promise.all([
    client
      .from("fba_fee_snapshots")
      .select("snapshot_date, fee_per_unit, size_tier, longest_in, median_in, shortest_in, weight_lb")
      .eq("country_code", COUNTRY)
      .eq("sku", sku)
      .gte("snapshot_date", since)
      .order("snapshot_date", { ascending: true }),
    client
      .from("fba_fee_alerts")
      .select(ALERT_COLUMNS)
      .eq("country_code", COUNTRY)
      .eq("sku", sku)
      .order("detected_date", { ascending: false })
      .limit(50),
  ]);
  const err = snaps.error ?? alerts.error;
  if (err) return { data: null, error: err.message };

  return {
    data: { snapshots: snaps.data ?? [], alerts: (alerts.data as FeeAlert[]) ?? [] },
    error: null,
  };
}

export interface DimsInput {
  length_in: number;
  width_in: number;
  height_in: number;
  weight_lb: number;
}

function validateDims(d: DimsInput): string | null {
  for (const [k, v] of Object.entries(d)) {
    if (!Number.isFinite(v) || v <= 0) return `${k.replace("_", " ")} must be a positive number`;
  }
  if (Math.max(d.length_in, d.width_in, d.height_in) > MAX_SIDE_IN) return `A side over ${MAX_SIDE_IN} in looks like a typo`;
  if (d.weight_lb > MAX_WEIGHT_LB) return `Weight over ${MAX_WEIGHT_LB} lb looks like a typo`;
  return null;
}

export async function updateTrueDims(
  sku: string,
  dims: DimsInput
): Promise<{ data: TrueDims | null; error: string | null }> {
  const { session, error } = await requireStaff();
  if (error) return { data: null, error };
  if (!sku.trim()) return { data: null, error: "SKU is required" };
  const invalid = validateDims(dims);
  if (invalid) return { data: null, error: invalid };

  const service = createServiceClient();
  const { data, error: dbError } = await service
    .from("fba_fee_true_dims")
    .upsert(
      {
        country_code: COUNTRY,
        sku: sku.trim(),
        ...dims,
        source: "manual",
        updated_by: session!.username,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "country_code,sku" }
    )
    .select("sku, length_in, width_in, height_in, weight_lb, source, updated_by, updated_at")
    .single();

  return { data: (data as TrueDims | null) ?? null, error: dbError?.message ?? null };
}

/** Revert a SKU's true dimensions to Amazon's earliest reading on record. */
export async function resetTrueDimsToAmazon(sku: string): Promise<{ data: TrueDims | null; error: string | null }> {
  const { session, error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();
  const { data: first, error: fetchError } = await client
    .from("fba_fee_snapshots")
    .select("longest_in, median_in, shortest_in, weight_lb")
    .eq("country_code", COUNTRY)
    .eq("sku", sku)
    .order("snapshot_date", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (fetchError) return { data: null, error: fetchError.message };
  if (!first) return { data: null, error: "No Amazon reading on record for this SKU" };

  const service = createServiceClient();
  const { data, error: dbError } = await service
    .from("fba_fee_true_dims")
    .upsert(
      {
        country_code: COUNTRY,
        sku,
        length_in: first.longest_in,
        width_in: first.median_in,
        height_in: first.shortest_in,
        weight_lb: first.weight_lb,
        source: "amazon_first_seen",
        updated_by: session!.username,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "country_code,sku" }
    )
    .select("sku, length_in, width_in, height_in, weight_lb, source, updated_by, updated_at")
    .single();

  return { data: (data as TrueDims | null) ?? null, error: dbError?.message ?? null };
}

export interface BulkDimsResult {
  updated: number;
  skipped: { row: number; sku: string | null; reason: string }[];
}

/**
 * Excel/CSV upload of true dimensions. Expects a header row with a SKU column
 * and length / width / height / weight columns (any order, any case). Units
 * default to inches and pounds; a header mentioning cm / kg / oz / g is
 * converted.
 */
export async function bulkUpdateTrueDims(
  formData: FormData
): Promise<{ data: BulkDimsResult | null; error: string | null }> {
  const { session, error } = await requireStaff();
  if (error) return { data: null, error };

  const file = formData.get("file");
  if (!(file instanceof File)) return { data: null, error: "No file provided" };
  if (file.size > 2_000_000) return { data: null, error: "File too large (max 2MB)" };

  let matrix: unknown[][];
  try {
    const workbook = XLSX.read(Buffer.from(await file.arrayBuffer()), { type: "buffer" });
    matrix = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
      header: 1,
      raw: true,
      defval: null,
    }) as unknown[][];
  } catch {
    return { data: null, error: "Couldn't read this file — make sure it's a valid Excel or CSV file" };
  }

  // Find the header row in the first 10 rows: needs SKU plus all four measurements.
  const find = (headers: string[], re: RegExp) => headers.findIndex((h) => re.test(h));
  let headerRow = -1;
  let cols: { sku: number; l: number; w: number; h: number; wt: number } | null = null;
  let headers: string[] = [];
  for (let i = 0; i < Math.min(10, matrix.length); i++) {
    headers = (matrix[i] ?? []).map((c) => String(c ?? "").trim().toLowerCase());
    const c = {
      sku: find(headers, /^(seller[\s_-]?)?sku$/),
      l: find(headers, /^(length|longest)/),
      w: find(headers, /^(width|median)/),
      h: find(headers, /^(height|shortest|depth)/),
      wt: find(headers, /^weight/),
    };
    if (Object.values(c).every((v) => v >= 0)) {
      headerRow = i;
      cols = c;
      break;
    }
  }
  if (!cols) {
    return {
      data: null,
      error: "Couldn't find the header row — it needs columns named SKU, Length, Width, Height and Weight",
    };
  }

  const lenFactor = (h: string) => (/\bcm\b|\(cm\)|centimet/.test(h) ? 1 / 2.54 : /\bmm\b|\(mm\)/.test(h) ? 1 / 25.4 : 1);
  const wtFactor = (h: string) =>
    /\bkg\b|\(kg\)|kilo/.test(h) ? 2.20462 : /\boz\b|\(oz\)|ounce/.test(h) ? 1 / 16 : /\bg\b|\(g\)|gram/.test(h) ? 1 / 453.592 : 1;
  const lf = { l: lenFactor(headers[cols.l]), w: lenFactor(headers[cols.w]), h: lenFactor(headers[cols.h]) };
  const wf = wtFactor(headers[cols.wt]);

  const skipped: BulkDimsResult["skipped"] = [];
  const rows: Record<string, unknown>[] = [];
  const seen = new Set<string>();
  const now = new Date().toISOString();
  const round = (n: number, p: number) => Math.round(n * 10 ** p) / 10 ** p;

  for (let i = headerRow + 1; i < matrix.length; i++) {
    const r = matrix[i] ?? [];
    const sku = String(r[cols.sku] ?? "").trim();
    if (!sku && r.every((c) => c == null || String(c).trim() === "")) continue;
    if (!sku) {
      skipped.push({ row: i + 1, sku: null, reason: "Missing SKU" });
      continue;
    }
    const dims: DimsInput = {
      length_in: round(Number(r[cols.l]) * lf.l, 2),
      width_in: round(Number(r[cols.w]) * lf.w, 2),
      height_in: round(Number(r[cols.h]) * lf.h, 2),
      weight_lb: round(Number(r[cols.wt]) * wf, 3),
    };
    const invalid = validateDims(dims);
    if (invalid) {
      skipped.push({ row: i + 1, sku, reason: invalid });
      continue;
    }
    if (seen.has(sku)) {
      skipped.push({ row: i + 1, sku, reason: "Duplicate SKU in file — first row kept" });
      continue;
    }
    seen.add(sku);
    rows.push({
      country_code: COUNTRY,
      sku,
      ...dims,
      source: "manual",
      updated_by: session!.username,
      updated_at: now,
    });
  }

  if (rows.length === 0) return { data: { updated: 0, skipped }, error: null };

  const service = createServiceClient();
  for (let i = 0; i < rows.length; i += 500) {
    const { error: dbError } = await service
      .from("fba_fee_true_dims")
      .upsert(rows.slice(i, i + 500), { onConflict: "country_code,sku" });
    if (dbError) return { data: null, error: dbError.message };
  }

  return { data: { updated: rows.length, skipped }, error: null };
}

export async function updateAlertStatus(
  id: string,
  status: AlertStatus,
  caseId?: string | null,
  notes?: string | null
): Promise<{ data: FeeAlert | null; error: string | null }> {
  const { session, error } = await requireStaff();
  if (error) return { data: null, error };
  if (!ALERT_STATUSES.includes(status)) return { data: null, error: `Invalid status: ${status}` };
  if (status === "case_raised" && !caseId?.trim()) {
    return { data: null, error: "Enter the Seller Central case ID" };
  }

  const patch: Record<string, unknown> = {
    status,
    updated_by: session!.username,
    updated_at: new Date().toISOString(),
  };
  if (caseId !== undefined) patch.case_id = caseId?.trim() || null;
  if (notes !== undefined) patch.notes = notes?.trim() || null;

  const service = createServiceClient();
  const { data, error: dbError } = await service
    .from("fba_fee_alerts")
    .update(patch)
    .eq("id", id)
    .select(ALERT_COLUMNS)
    .maybeSingle();

  if (dbError) return { data: null, error: dbError.message };
  if (!data) return { data: null, error: "Alert not found" };
  return { data: data as FeeAlert, error: null };
}
