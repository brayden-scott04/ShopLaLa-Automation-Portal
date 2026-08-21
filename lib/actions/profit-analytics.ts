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
  totals: ProfitTotals;
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

function addInto(target: ProfitTotals, row: MetricRow) {
  target.revenue += num(row.revenue);
  target.total_fees += num(row.total_fees);
  target.fba_fees += num(row.fba_fees);
  target.referral_fees += num(row.referral_fees);
  target.other_fees += num(row.other_fees);
  target.gross_margin += num(row.gross_margin);
  target.units += row.units ?? 0;
  target.orders += row.orders ?? 0;
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

  // Phase 1 only ever writes source='settlement'. Phase 2 adds 'estimate' rows,
  // which must never be added on top of settled figures for the same day -- so
  // fold per (date, country) and let settlement win outright where both exist,
  // rather than summing everything indiscriminately.
  const byDateCountry = new Map<string, { settlement: MetricRow[]; estimate: MetricRow[] }>();
  for (const row of rows) {
    const key = `${row.metric_date}|${row.country_code}`;
    let bucket = byDateCountry.get(key);
    if (!bucket) {
      bucket = { settlement: [], estimate: [] };
      byDateCountry.set(key, bucket);
    }
    if (row.source === "settlement") bucket.settlement.push(row);
    else bucket.estimate.push(row);
  }

  const perDate = new Map<string, ProfitTotals>();
  const totals = emptyTotals();
  const countriesWithData = new Set<ProfitCountry>();

  for (const [key, bucket] of byDateCountry) {
    const [metricDate, countryCode] = key.split("|");
    const effective = bucket.settlement.length > 0 ? bucket.settlement : bucket.estimate;
    if (effective.length === 0) continue;

    countriesWithData.add(countryCode as ProfitCountry);

    let day = perDate.get(metricDate);
    if (!day) {
      day = emptyTotals();
      perDate.set(metricDate, day);
    }
    for (const row of effective) {
      addInto(day, row);
      addInto(totals, row);
    }
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
      countriesWithData: PROFIT_COUNTRIES.filter((c) => countriesWithData.has(c)),
      lastSyncedAt: lastRun?.run_at ?? null,
      lastSyncStatus: lastRun?.status ?? null,
      unreconciledReports: unreconciled ?? 0,
    },
    error: null,
  };
}
