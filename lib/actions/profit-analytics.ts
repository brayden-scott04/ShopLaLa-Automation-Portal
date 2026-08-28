"use server";

import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/session";
import { PROFIT_COUNTRIES, type ProfitCountry, type ProfitScope } from "@/lib/profit-analytics-constants";

/**
 * Read side of the Profit Analytics dashboard. Everything here is populated by
 * LaLaGreen-Daily-Report's reportlib/profit_sync.py on its own ~2-hourly n8n
 * schedule -- this portal never calls Amazon for these numbers.
 *
 * Amounts are stored exactly as Amazon reports them in the settlement: revenue
 * positive, fees negative. So gross_margin is revenue + total_fees, and a "fees"
 * figure shown to staff is negated at the display layer, never in the data.
 *
 * PROFIT_COUNTRIES/ProfitCountry/ProfitScope live in lib/profit-analytics-constants.ts,
 * not here, and are used below only as type annotations -- never re-exported
 * from this file at all. Every export of a "use server" file is rewritten into
 * a server-action reference by Turbopack's per-file transform, which works
 * from syntax rather than full type information: a plain runtime constant
 * exported here would silently become unusable client-side, and even
 * `export type { X }` re-exporting a name that arrived via `import { type X }`
 * (rather than being declared locally) tripped the same transform into
 * emitting a reference to a value that doesn't exist at runtime ("X is not
 * defined"). Importers should get these from the constants module directly.
 */

export interface ProfitDailyPoint {
  metric_date: string;
  revenue: number;
  total_fees: number;
  fba_fees: number;
  referral_fees: number;
  other_fees: number;
  gross_margin: number;
  units: number;
  orders: number;
}

export interface ProfitTotals {
  revenue: number;
  total_fees: number;
  fba_fees: number;
  referral_fees: number;
  other_fees: number;
  gross_margin: number;
  units: number;
  orders: number;
}

export interface ProfitOverview {
  daily: ProfitDailyPoint[];
  /**
   * For "US": native currency (USD, so identical to totalsUsd). For "CA"/"MX": native
   * currency (CAD/MXN) -- the primary figure staff see for that marketplace. For "ALL":
   * already the properly FX-converted USD sum across all three marketplaces, never a raw
   * cross-currency addition.
   */
  totals: ProfitTotals;
  /**
   * USD-equivalent of `totals`, for display as a secondary "(~$X USD)" figure under a
   * native-currency scope. Null for "US" (would be identical to totals) and "ALL" (totals
   * is already USD -- a second copy would be redundant).
   */
  totalsUsd: ProfitTotals | null;
  /** 1 unit of the scope's currency = fxRate USD. Set whenever totalsUsd is, null otherwise. */
  fxRate: number | null;
  /** Marketplaces that actually have data in this range, for the selector's empty states. */
  countriesWithData: ProfitCountry[];
  lastSyncedAt: string | null;
  lastSyncStatus: "ok" | "error" | null;
  /** Reports whose day-level sums did not tie back to the settlement's own total. */
  unreconciledReports: number;
}

interface MetricRow {
  metric_date: string;
  country_code: string;
  source: string;
  source_ref: string;
  revenue: number | string;
  total_fees: number | string;
  fba_fees: number | string;
  referral_fees: number | string;
  other_fees: number | string;
  gross_margin: number | string;
  units: number;
  orders: number;
}

const METRIC_COLUMNS =
  "metric_date, country_code, source, source_ref, revenue, total_fees, fba_fees, " +
  "referral_fees, other_fees, gross_margin, units, orders";

// PostgREST silently caps a response at 1000 rows, and a short read here is
// indistinguishable from a quiet period -- it would just render as a smaller
// number, with nothing on screen to say revenue is missing. Same paging guard
// as fetchAllScheduleRows() in ppc-daily-cap.ts.
const PAGE_SIZE = 1000;

async function requireStaff() {
  const session = await getSession();
  if (!session) return { session: null, error: "Unauthorized" as const };
  return { session, error: null };
}

function num(value: number | string | null | undefined): number {
  const n = typeof value === "number" ? value : parseFloat(String(value ?? 0));
  return Number.isFinite(n) ? n : 0;
}

function emptyTotals(): ProfitTotals {
  return {
    revenue: 0,
    total_fees: 0,
    fba_fees: 0,
    referral_fees: 0,
    other_fees: 0,
    gross_margin: 0,
    units: 0,
    orders: 0,
  };
}

function addInto(target: ProfitTotals, row: MetricRow, rate = 1) {
  target.revenue += num(row.revenue) * rate;
  target.total_fees += num(row.total_fees) * rate;
  target.fba_fees += num(row.fba_fees) * rate;
  target.referral_fees += num(row.referral_fees) * rate;
  target.other_fees += num(row.other_fees) * rate;
  target.gross_margin += num(row.gross_margin) * rate;
  // Counts, not money -- never scaled by a currency rate.
  target.units += row.units ?? 0;
  target.orders += row.orders ?? 0;
}

function scaleTotals(totals: ProfitTotals, rate: number): ProfitTotals {
  return {
    ...totals,
    revenue: totals.revenue * rate,
    total_fees: totals.total_fees * rate,
    fba_fees: totals.fba_fees * rate,
    referral_fees: totals.referral_fees * rate,
    other_fees: totals.other_fees * rate,
    gross_margin: totals.gross_margin * rate,
  };
}

// Used only if the live rate fetch below fails -- approximate, kept as a resilience
// fallback so the dashboard degrades to a stale-but-plausible number instead of erroring
// or showing raw unconverted currency mixed into a "USD" figure.
const FALLBACK_USD_RATE: Record<ProfitCountry, number> = { US: 1, CA: 0.73, MX: 0.055 };

/**
 * 1 unit of each marketplace's currency, in USD, as of now. Not historically accurate per
 * transaction date -- this is a single current-rate approximation applied uniformly across
 * whatever date range is requested, which is why every USD-converted figure in this file is
 * presented as a secondary/approximate number, never the primary one for CA/MX.
 */
async function getUsdRates(): Promise<Record<ProfitCountry, number>> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`FX rate fetch failed: ${res.status}`);
    const json = (await res.json()) as { rates?: Record<string, number> };
    const cad = json.rates?.CAD;
    const mxn = json.rates?.MXN;
    if (!cad || !mxn) throw new Error("FX response missing CAD/MXN");
    return { US: 1, CA: 1 / cad, MX: 1 / mxn };
  } catch {
    return FALLBACK_USD_RATE;
  }
}

function round2(totals: ProfitTotals): ProfitTotals {
  return {
    ...totals,
    revenue: Math.round(totals.revenue * 100) / 100,
    total_fees: Math.round(totals.total_fees * 100) / 100,
    fba_fees: Math.round(totals.fba_fees * 100) / 100,
    referral_fees: Math.round(totals.referral_fees * 100) / 100,
    other_fees: Math.round(totals.other_fees * 100) / 100,
    gross_margin: Math.round(totals.gross_margin * 100) / 100,
  };
}

/**
 * Daily revenue/fee/margin series plus period totals for one marketplace, or for
 * all of them consolidated.
 *
 * Rows are summed rather than read one-per-day on purpose. Amazon can finalize
 * two settlements for the same marketplace with overlapping periods (this
 * account has a $647 secondary cycle sitting inside a $165k regular one), so a
 * single date can legitimately have a contribution from more than one report.
 * profit_sync writes each report's contribution under its own source_ref and
 * this is where they are added back together -- which is also why nothing here
 * can assume one row per (date, country).
 */
export async function getProfitOverview(
  scope: ProfitScope,
  from: string,
  to: string
): Promise<{ data: ProfitOverview | null; error: string | null }> {
  const { error: authError } = await requireStaff();
  if (authError) return { data: null, error: authError };

  if (scope !== "ALL" && !PROFIT_COUNTRIES.includes(scope as ProfitCountry)) {
    return { data: null, error: `Invalid marketplace: ${scope}` };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
    return { data: null, error: "Invalid date range" };
  }
  if (from > to) {
    return { data: null, error: "Start date must be on or before end date" };
  }

  const client = await createClient();

  const rows: MetricRow[] = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    let query = client
      .from("profit_daily_metrics")
      .select(METRIC_COLUMNS)
      .gte("metric_date", from)
      .lte("metric_date", to)
      .order("metric_date", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (scope !== "ALL") query = query.eq("country_code", scope);

    const { data, error } = await query;
    if (error) return { data: null, error: error.message };

    const page = (data ?? []) as unknown as MetricRow[];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
  }

  // Three sources can exist for the same (date, country), never summed together --
  // settlement (Amazon-reconciled) wins outright, then finances_backfill (the one-time
  // Finances-API-derived fill for the June 2025-June 2026 gap that Reports API's 90-day
  // createdSince ceiling can never reach), then estimate (Phase 2's near-real-time,
  // modeled-fees rows) as the last resort.
  const byDateCountry = new Map<
    string,
    { settlement: MetricRow[]; financesBackfill: MetricRow[]; estimate: MetricRow[] }
  >();
  for (const row of rows) {
    const key = `${row.metric_date}|${row.country_code}`;
    let bucket = byDateCountry.get(key);
    if (!bucket) {
      bucket = { settlement: [], financesBackfill: [], estimate: [] };
      byDateCountry.set(key, bucket);
    }
    if (row.source === "settlement") bucket.settlement.push(row);
    else if (row.source === "finances_backfill") bucket.financesBackfill.push(row);
    else bucket.estimate.push(row);
  }

  const usdRates = await getUsdRates();

  const perDate = new Map<string, ProfitTotals>();
  const totals = emptyTotals();
  const countriesWithData = new Set<ProfitCountry>();

  for (const [key, bucket] of byDateCountry) {
    const [metricDate, countryCode] = key.split("|");
    const effective =
      bucket.settlement.length > 0
        ? bucket.settlement
        : bucket.financesBackfill.length > 0
          ? bucket.financesBackfill
          : bucket.estimate;
    if (effective.length === 0) continue;

    countriesWithData.add(countryCode as ProfitCountry);

    // Consolidated must never add raw CAD/MXN numbers to a USD number -- convert each
    // row to USD before summing when every marketplace is being combined. A single-
    // marketplace scope stays in that marketplace's own native currency (rate 1).
    const rate = scope === "ALL" ? (usdRates[countryCode as ProfitCountry] ?? 1) : 1;

    let day = perDate.get(metricDate);
    if (!day) {
      day = emptyTotals();
      perDate.set(metricDate, day);
    }
    for (const row of effective) {
      addInto(day, row, rate);
      addInto(totals, row, rate);
    }
  }

  // For a single non-USD marketplace, offer a secondary "(~$X USD)" figure alongside the
  // native-currency primary one. Not applicable to "US" (would just repeat totals) or
  // "ALL" (totals is already the converted USD sum from the loop above).
  let totalsUsd: ProfitTotals | null = null;
  let fxRate: number | null = null;
  if (scope === "CA" || scope === "MX") {
    fxRate = usdRates[scope];
    totalsUsd = round2(scaleTotals(totals, fxRate));
  }

  const daily: ProfitDailyPoint[] = [...perDate.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([metric_date, t]) => ({ metric_date, ...round2(t) }));

  const { data: runRows, error: runError } = await client
    .from("profit_sync_runs")
    .select("run_at, status")
    .order("run_at", { ascending: false })
    .limit(1);
  if (runError) return { data: null, error: runError.message };
  const lastRun = runRows?.[0] as { run_at: string; status: "ok" | "error" } | undefined;

  const { count: unreconciled, error: reconError } = await client
    .from("profit_ingested_settlement_reports")
    .select("report_id", { count: "exact", head: true })
    .eq("reconciled", false);
  if (reconError) return { data: null, error: reconError.message };

  return {
    data: {
      daily,
      totals: round2(totals),
      totalsUsd,
      fxRate,
      countriesWithData: PROFIT_COUNTRIES.filter((c) => countriesWithData.has(c)),
      lastSyncedAt: lastRun?.run_at ?? null,
      lastSyncStatus: lastRun?.status ?? null,
      unreconciledReports: unreconciled ?? 0,
    },
    error: null,
  };
}
