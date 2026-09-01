"use server";

import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/session";
import {
  PROFIT_COUNTRIES,
  getUsdRates,
  type ProfitCountry,
  type ProfitScope,
} from "@/lib/profit-analytics-constants";

/**
 * Read side of the Profit Analytics dashboard's "Sales" tile -- the gross, order-date
 * counterpart to profit-analytics.ts's settlement-based, net-of-refunds "Revenue". Populated
 * by LaLaGreen-Daily-Report's reportlib/sales_traffic_sync.py from Amazon's own
 * GET_SALES_AND_TRAFFIC_REPORT, on its own daily schedule -- separate from profit_sync.py's
 * settlement sync. See CLAUDE.md / the plan history for why these two numbers legitimately
 * differ (order-date vs settlement-date, gross vs net-of-refunds) rather than one being wrong.
 *
 * Kept entirely separate from lib/actions/profit-analytics.ts rather than adding exports to
 * it -- that file has already broken production twice this session from "use server"
 * export-boundary mistakes, so new surface area goes in its own file instead.
 */

export interface SalesTotals {
  ordered_product_sales: number;
  units_ordered: number;
  total_order_items: number;
  units_refunded: number;
}

export interface SalesOverview {
  /** Native currency for a single marketplace scope; already-USD sum for "ALL". */
  totals: SalesTotals;
  /** USD-equivalent of `totals`, for CA/MX's secondary "(~$X USD)" line. Null otherwise. */
  totalsUsd: SalesTotals | null;
  fxRate: number | null;
}

interface SalesRow {
  metric_date: string;
  country_code: string;
  ordered_product_sales: number | string;
  units_ordered: number;
  total_order_items: number;
  units_refunded: number;
}

const SALES_COLUMNS =
  "metric_date, country_code, ordered_product_sales, units_ordered, total_order_items, units_refunded";

// PostgREST silently caps a response at 1000 rows -- same paging guard as
// getProfitOverview()/fetchAllScheduleRows().
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

function emptyTotals(): SalesTotals {
  return { ordered_product_sales: 0, units_ordered: 0, total_order_items: 0, units_refunded: 0 };
}

export async function getSalesOverview(
  scope: ProfitScope,
  from: string,
  to: string
): Promise<{ data: SalesOverview | null; error: string | null }> {
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

  const rows: SalesRow[] = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    let query = client
      .from("profit_sales_daily")
      .select(SALES_COLUMNS)
      .gte("metric_date", from)
      .lte("metric_date", to)
      .range(offset, offset + PAGE_SIZE - 1);

    if (scope !== "ALL") query = query.eq("country_code", scope);

    const { data, error } = await query;
    if (error) return { data: null, error: error.message };

    const page = (data ?? []) as unknown as SalesRow[];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
  }

  // One row per (date, country) -- no multi-source fold needed (unlike profit_daily_metrics),
  // since GET_SALES_AND_TRAFFIC_REPORT is this metric's sole source.
  const usdRates = await getUsdRates();
  const totals = emptyTotals();

  for (const row of rows) {
    const rate = scope === "ALL" ? (usdRates[row.country_code as ProfitCountry] ?? 1) : 1;
    totals.ordered_product_sales += num(row.ordered_product_sales) * rate;
    totals.units_ordered += row.units_ordered ?? 0;
    totals.total_order_items += row.total_order_items ?? 0;
    totals.units_refunded += row.units_refunded ?? 0;
  }
  totals.ordered_product_sales = Math.round(totals.ordered_product_sales * 100) / 100;

  let totalsUsd: SalesTotals | null = null;
  let fxRate: number | null = null;
  if (scope === "CA" || scope === "MX") {
    fxRate = usdRates[scope];
    totalsUsd = {
      ...totals,
      ordered_product_sales: Math.round(totals.ordered_product_sales * fxRate * 100) / 100,
    };
  }

  return { data: { totals, totalsUsd, fxRate }, error: null };
}
