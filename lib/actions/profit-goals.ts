"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getSession } from "@/lib/session";
import { todaySgt } from "@/lib/ppc-daily-cap-constants";
import { getStaffId } from "@/lib/actions/ppc-daily-cap";
import { PROFIT_COUNTRIES, type ProfitScope } from "@/lib/profit-analytics-constants";
import { GOAL_METRICS, type GoalMetric } from "@/lib/profit-goals-constants";

/**
 * Manually-set $ targets for Profit Analytics ("Goal vs Realtime"). Reads use
 * the RLS-client, writes use the service-role client -- same split as
 * ppc-acos-manual-topups.ts. Deliberately its own file, not folded into
 * lib/actions/profit-analytics.ts: that file has already broken production
 * twice this session over "use server" export rules, so goal-progress keeps
 * its own small copy of the settlement-over-estimate fold rather than sharing
 * code with it.
 */

const GOAL_SCOPES: ProfitScope[] = ["ALL", ...PROFIT_COUNTRIES];
const MAX_GOAL_AMOUNT = 100_000_000;

export interface ProfitGoal {
  id: string;
  country_code: ProfitScope;
  metric: GoalMetric;
  period_start: string;
  period_end: string;
  target_amount: number;
  created_by_username: string;
  created_at: string;
}

export interface GoalProgress {
  goal: ProfitGoal;
  actual: number;
  difference: number;
}

const GOAL_COLUMNS =
  "id, country_code, metric, period_start, period_end, target_amount, created_by_username, created_at";

interface MetricSumRow {
  metric_date: string;
  country_code: string;
  source: string;
  revenue: number | string;
  gross_margin: number | string;
}

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

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function listGoals(
  scope: ProfitScope
): Promise<{ data: ProfitGoal[] | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  if (!GOAL_SCOPES.includes(scope)) {
    return { data: null, error: `Invalid marketplace: ${scope}` };
  }

  const client = await createClient();
  const { data, error: dbError } = await client
    .from("profit_goals")
    .select(GOAL_COLUMNS)
    .eq("country_code", scope)
    .order("period_start", { ascending: false });

  return { data, error: dbError?.message ?? null };
}

export async function createGoal(
  scope: ProfitScope,
  metric: GoalMetric,
  periodStart: string,
  periodEnd: string,
  targetAmount: number
): Promise<{ data: ProfitGoal | null; error: string | null }> {
  const { session, error } = await requireStaff();
  if (error) return { data: null, error };

  if (!GOAL_SCOPES.includes(scope)) {
    return { data: null, error: `Invalid marketplace: ${scope}` };
  }
  if (!GOAL_METRICS.includes(metric)) {
    return { data: null, error: `Invalid metric: ${metric}` };
  }
  if (!isValidDate(periodStart) || !isValidDate(periodEnd)) {
    return { data: null, error: "Invalid date range" };
  }
  if (periodStart > periodEnd) {
    return { data: null, error: "Start date must be on or before end date" };
  }
  if (!Number.isFinite(targetAmount) || targetAmount <= 0 || targetAmount > MAX_GOAL_AMOUNT) {
    return { data: null, error: `Invalid target amount: ${targetAmount}` };
  }

  const service = createServiceClient();
  const createdBy = await getStaffId(session!.username);

  const { data, error: insertError } = await service
    .from("profit_goals")
    .insert({
      country_code: scope,
      metric,
      period_start: periodStart,
      period_end: periodEnd,
      target_amount: targetAmount,
      created_by: createdBy,
      created_by_username: session!.username,
    })
    .select(GOAL_COLUMNS)
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      return {
        data: null,
        error: "A goal already exists for this marketplace, metric, and period.",
      };
    }
    return { data: null, error: insertError.message };
  }

  return { data, error: null };
}

export async function updateGoal(
  id: string,
  targetAmount: number
): Promise<{ data: ProfitGoal | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  if (!Number.isFinite(targetAmount) || targetAmount <= 0 || targetAmount > MAX_GOAL_AMOUNT) {
    return { data: null, error: `Invalid target amount: ${targetAmount}` };
  }

  const service = createServiceClient();
  const { data, error: updateError } = await service
    .from("profit_goals")
    .update({ target_amount: targetAmount, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select(GOAL_COLUMNS)
    .maybeSingle();

  if (updateError) return { data: null, error: updateError.message };
  if (!data) return { data: null, error: "Goal not found" };

  return { data, error: null };
}

export async function deleteGoal(
  id: string
): Promise<{ data: { ok: true } | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const service = createServiceClient();
  const { data, error: deleteError } = await service
    .from("profit_goals")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (deleteError) return { data: null, error: deleteError.message };
  if (!data) return { data: null, error: "Goal not found" };

  return { data: { ok: true }, error: null };
}

/**
 * Actual-to-date is folded the same way getProfitOverview() folds
 * profit_daily_metrics: group by (date, country), and within a group prefer
 * the settlement bucket over the estimate bucket outright rather than summing
 * both -- a settled day's real figure must never be padded by a stale estimate.
 */
async function sumActualForMetric(
  scope: ProfitScope,
  metric: GoalMetric,
  from: string,
  to: string
): Promise<number> {
  const client = await createClient();

  const rows: MetricSumRow[] = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    let query = client
      .from("profit_daily_metrics")
      .select("metric_date, country_code, source, revenue, gross_margin")
      .gte("metric_date", from)
      .lte("metric_date", to)
      .range(offset, offset + PAGE_SIZE - 1);

    if (scope !== "ALL") query = query.eq("country_code", scope);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    const page = (data ?? []) as unknown as MetricSumRow[];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
  }

  const byDateCountry = new Map<string, { settlement: MetricSumRow[]; estimate: MetricSumRow[] }>();
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

  let total = 0;
  for (const bucket of byDateCountry.values()) {
    const effective = bucket.settlement.length > 0 ? bucket.settlement : bucket.estimate;
    for (const row of effective) {
      total += metric === "revenue" ? num(row.revenue) : num(row.gross_margin);
    }
  }
  return total;
}

export async function getGoalProgress(
  scope: ProfitScope
): Promise<{ data: GoalProgress[] | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  if (!GOAL_SCOPES.includes(scope)) {
    return { data: null, error: `Invalid marketplace: ${scope}` };
  }

  const today = todaySgt();
  const client = await createClient();
  const { data: goals, error: goalsError } = await client
    .from("profit_goals")
    .select(GOAL_COLUMNS)
    .eq("country_code", scope)
    .lte("period_start", today)
    .gte("period_end", today);

  if (goalsError) return { data: null, error: goalsError.message };
  if (!goals || goals.length === 0) return { data: [], error: null };

  try {
    const progress = await Promise.all(
      (goals as ProfitGoal[]).map(async (goal) => {
        const to = goal.period_end < today ? goal.period_end : today;
        const actual = await sumActualForMetric(scope, goal.metric, goal.period_start, to);
        return { goal, actual, difference: actual - goal.target_amount };
      })
    );
    return { data: progress, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : "Failed to compute goal progress" };
  }
}
