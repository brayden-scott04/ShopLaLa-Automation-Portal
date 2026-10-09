"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChevronRight, CircleHelp, Settings } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { profitAnalytics } from "@/lib/sales";
import {
  getProfitOverview,
  getFeeBreakdown,
  type ProfitOverview,
  type FeeBreakdown,
} from "@/lib/actions/profit-analytics";
import { FEE_FAMILIES } from "@/lib/profit-fee-families";
import { getSalesOverview, type SalesOverview } from "@/lib/actions/sales-traffic";
import {
  getGoalProgress,
  listGoals,
  createGoal,
  deleteGoal,
  type ProfitGoal,
  type GoalProgress,
} from "@/lib/actions/profit-goals";
import { GOAL_METRICS, type GoalMetric } from "@/lib/profit-goals-constants";
// PROFIT_COUNTRIES and ProfitScope must come from the plain constants module,
// not the "use server" actions file -- every export of a "use server" file is
// rewritten into a server-action reference. That breaks a runtime constant
// outright (renders as undefined client-side), and even re-exporting just the
// *type* through that file tripped the same transform into referencing a
// value that doesn't exist at runtime. Import both directly from here instead.
import { PROFIT_COUNTRIES, type ProfitScope } from "@/lib/profit-analytics-constants";

const RANGES = [
  { key: "30", label: "30 days", days: 30 },
  { key: "90", label: "90 days", days: 90 },
  { key: "180", label: "6 months", days: 180 },
  { key: "365", label: "12 months", days: 365 },
] as const;

const SCOPES: { key: ProfitScope; label: string }[] = [
  { key: "ALL", label: "Consolidated" },
  ...PROFIT_COUNTRIES.map((c) => ({ key: c as ProfitScope, label: c })),
];

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--color-chart-1)" },
  fees: { label: "Amazon fees", color: "var(--color-chart-2)" },
  gross_margin: { label: "Gross margin", color: "var(--color-chart-3)" },
} satisfies ChartConfig;

/**
 * Dates are produced in SGT to match how profit_sync buckets metric_date. Using
 * the browser's local date would silently shift the window by a day for anyone
 * outside SGT and make the range quietly disagree with the stored data.
 */
function sgtDate(offsetDays = 0): string {
  const now = new Date();
  const sgt = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  sgt.setUTCDate(sgt.getUTCDate() + offsetDays);
  return sgt.toISOString().slice(0, 10);
}

function money(value: number): string {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

// "ALL" is already FX-converted to USD server-side (lib/actions/profit-analytics.ts) --
// never a raw cross-currency sum -- so it formats as USD same as "US".
const SCOPE_CURRENCY: Record<ProfitScope, string> = { ALL: "USD", US: "USD", CA: "CAD", MX: "MXN" };

function moneyIn(value: number, currency: string): string {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
}

function relativeTime(iso: string | null): string {
  if (!iso) return "never";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function ProfitAnalyticsPage() {
  const [scope, setScope] = useState<ProfitScope>("ALL");
  const [rangeKey, setRangeKey] = useState<(typeof RANGES)[number]["key"] | "custom">("90");
  const [overview, setOverview] = useState<ProfitOverview | null>(null);
  const [salesOverview, setSalesOverview] = useState<SalesOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, startTransition] = useTransition();

  const [customFrom, setCustomFrom] = useState(() => sgtDate(-30));
  const [customTo, setCustomTo] = useState(() => sgtDate());
  const isCustom = rangeKey === "custom";
  const rangeFrom = isCustom
    ? customFrom
    : sgtDate(-(RANGES.find((r) => r.key === rangeKey)?.days ?? 90));
  const rangeTo = isCustom ? customTo : sgtDate();
  const rangeValid = !!rangeFrom && !!rangeTo && rangeFrom <= rangeTo;

  useEffect(() => {
    if (!rangeValid) return;
    // Clicking through marketplaces faster than the queries return would
    // otherwise let a slow earlier response land last and overwrite the
    // current selection's data, so stale results are dropped on unmount/change.
    let cancelled = false;

    startTransition(async () => {
      setIsLoading(true);
      const [{ data, error: err }, { data: salesData }] = await Promise.all([
        getProfitOverview(scope, rangeFrom, rangeTo),
        getSalesOverview(scope, rangeFrom, rangeTo),
      ]);
      if (cancelled) return;
      if (err) {
        setError(err);
        setOverview(null);
      } else {
        setOverview(data);
        setError(null);
      }
      setSalesOverview(salesData);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [scope, rangeFrom, rangeTo, rangeValid]);

  const [feeDialogOpen, setFeeDialogOpen] = useState(false);
  const [feeBreakdown, setFeeBreakdown] = useState<FeeBreakdown | null>(null);
  const [feeError, setFeeError] = useState<string | null>(null);
  const [feeLoadedKey, setFeeLoadedKey] = useState("");
  const [feeShowAll, setFeeShowAll] = useState(false);

  // The dialog has its own range (starts as the dashboard's) so fees can be inspected for any
  // period, e.g. one settlement cycle, without moving the dashboard.
  const [feeFrom, setFeeFrom] = useState("");
  const [feeTo, setFeeTo] = useState("");
  const [feeTotal, setFeeTotal] = useState(0);

  function openFeeDialog() {
    setFeeFrom(rangeFrom);
    setFeeTo(rangeTo);
    setFeeDialogOpen(true);
  }

  const feeLoading =
    feeDialogOpen && !!feeFrom && feeFrom <= feeTo && feeLoadedKey !== `${scope}|${feeFrom}|${feeTo}`;

  useEffect(() => {
    if (!feeDialogOpen || !feeFrom || !feeTo || feeFrom > feeTo) return;
    let cancelled = false;
    const key = `${scope}|${feeFrom}|${feeTo}`;
    Promise.all([
      getFeeBreakdown(scope, feeFrom, feeTo),
      getProfitOverview(scope, feeFrom, feeTo),
    ]).then(([fees, ov]) => {
      if (cancelled) return;
      setFeeBreakdown(fees.data);
      setFeeTotal(ov.data?.totals.total_fees ?? 0);
      setFeeError(fees.error ?? ov.error);
      setFeeLoadedKey(key);
    });
    return () => {
      cancelled = true;
    };
  }, [feeDialogOpen, scope, feeFrom, feeTo]);

  const [goalProgress, setGoalProgress] = useState<GoalProgress[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [goalsDialogOpen, setGoalsDialogOpen] = useState(false);
  const [goalsList, setGoalsList] = useState<ProfitGoal[]>([]);
  const [goalForm, setGoalForm] = useState({
    metric: "revenue" as GoalMetric,
    periodStart: "",
    periodEnd: "",
    targetAmount: "",
  });
  const [goalError, setGoalError] = useState<string | null>(null);
  const [goalPending, startGoalTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    setGoalsLoading(true);
    getGoalProgress(scope).then(({ data, error: err }) => {
      if (cancelled) return;
      setGoalProgress(err ? [] : data ?? []);
      setGoalsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [scope]);

  function refreshGoals() {
    getGoalProgress(scope).then(({ data }) => setGoalProgress(data ?? []));
    listGoals(scope).then(({ data }) => setGoalsList(data ?? []));
  }

  function openGoalsDialog() {
    setGoalError(null);
    setGoalForm({ metric: "revenue", periodStart: "", periodEnd: "", targetAmount: "" });
    setGoalsDialogOpen(true);
    listGoals(scope).then(({ data }) => setGoalsList(data ?? []));
  }

  function saveGoal() {
    const targetAmount = parseFloat(goalForm.targetAmount);
    startGoalTransition(async () => {
      const { error: err } = await createGoal(
        scope,
        goalForm.metric,
        goalForm.periodStart,
        goalForm.periodEnd,
        targetAmount
      );
      if (err) {
        setGoalError(err);
        return;
      }
      setGoalError(null);
      setGoalForm({ metric: "revenue", periodStart: "", periodEnd: "", targetAmount: "" });
      refreshGoals();
    });
  }

  function removeGoal(id: string) {
    startGoalTransition(async () => {
      const { error: err } = await deleteGoal(id);
      if (err) {
        setGoalError(err);
        return;
      }
      refreshGoals();
    });
  }

  const chartData = useMemo(
    () =>
      (overview?.daily ?? []).map((d) => ({
        date: d.metric_date.slice(5),
        revenue: d.revenue,
        // Fees are stored negative, as Amazon reports them. Plotting them as a
        // positive magnitude keeps the three series readable on one axis.
        fees: Math.abs(d.total_fees),
        gross_margin: d.gross_margin,
      })),
    [overview]
  );

  const totals = overview?.totals;
  const totalsUsd = overview?.totalsUsd ?? null;
  const salesTotals = salesOverview?.totals;
  const salesTotalsUsd = salesOverview?.totalsUsd ?? null;
  const nativeCurrency = SCOPE_CURRENCY[scope];
  const marginPct =
    totals && totals.revenue > 0 ? (totals.gross_margin / totals.revenue) * 100 : null;

  return (
    <>
      <PageHeader
        icon={profitAnalytics.icon}
        title={profitAnalytics.name}
        description={profitAnalytics.description}
      />

      <div className="space-y-6 px-6 pb-6 md:px-8 md:pb-8">
        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {overview && overview.unreconciledReports > 0 && (
          <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
            {overview.unreconciledReports} settlement report
            {overview.unreconciledReports === 1 ? "" : "s"} did not reconcile against Amazon&apos;s
            own total — the figures below may be incomplete for the affected periods.
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs value={scope} onValueChange={(v) => setScope(v as ProfitScope)}>
            <TabsList>
              {SCOPES.map((s) => (
                <TabsTrigger key={s.key} value={s.key}>
                  {s.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex flex-wrap items-center gap-2">
            {isCustom && (
              <div className="flex items-center gap-1.5 text-sm">
                <input
                  type="date"
                  value={customFrom}
                  max={customTo || undefined}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="rounded-md border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <span className="text-muted-foreground">→</span>
                <input
                  type="date"
                  value={customTo}
                  min={customFrom || undefined}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="rounded-md border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            )}
            <Tabs value={rangeKey} onValueChange={(v) => setRangeKey(v as typeof rangeKey)}>
              <TabsList>
                {RANGES.map((r) => (
                  <TabsTrigger key={r.key} value={r.key}>
                    {r.label}
                  </TabsTrigger>
                ))}
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        {isCustom && !rangeValid && (
          <p className="text-xs text-destructive">Pick a start date on or before the end date.</p>
        )}

        {scope !== "US" && (
          <p className="text-xs text-muted-foreground">
            {scope === "ALL"
              ? "Consolidated is converted to USD at today's exchange rate before summing across marketplaces — not a historically exact per-transaction rate."
              : "USD figures below are converted at today's exchange rate — approximate, not the rate at the time of each transaction."}
          </p>
        )}

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <StatTile
              label="Sales"
              info="Ordered product sales, counted by ORDER date the moment an order is placed (from Amazon's Sales & Traffic data). Excludes shipping, tax and reimbursements, so it will not match Seller Central's Payments 'Sales'. Use 'Collected (shipped)' for that."
              value={moneyIn(salesTotals?.ordered_product_sales ?? 0, nativeCurrency)}
              usdValue={salesTotalsUsd ? money(salesTotalsUsd.ordered_product_sales) : undefined}
              sub="Ordered product sales, counted by order date when placed"
            />
            <StatTile
              label="Collected (shipped)"
              info="Same basis as Seller Central's Payments Dashboard 'Sales': the amount collected from shipped orders, including product price, shipping, gift wrap and taxes, before refunds (shown separately in the line below). Counted when Amazon posts the transaction, from settlement data. Dates are SGT; Seller Central uses Pacific, so edge days can differ slightly."
              value={moneyIn(totals?.sales_collected ?? 0, nativeCurrency)}
              usdValue={totalsUsd ? money(totalsUsd.sales_collected) : undefined}
              sub={
                totals
                  ? `Seller Central "Sales" basis: shipped orders incl. shipping & tax, before ${moneyIn(
                      Math.abs(totals.refunds),
                      nativeCurrency
                    )} refunds`
                  : undefined
              }
            />
            <StatTile
              label="Revenue"
              info="Collected sales net of refunds, from Amazon's settlement reports, counted once Amazon settles payment. Before Amazon fees, so it is not profit."
              value={moneyIn(totals?.revenue ?? 0, nativeCurrency)}
              usdValue={totalsUsd ? money(totalsUsd.revenue) : undefined}
              sub="Net of refunds, counted once Amazon settles payment"
            />
            <StatTile
              label="Amazon fees"
              info="All fees Amazon charged in the period (referral, FBA fulfillment, storage, AWD, returns, promo rebates, withheld tax, etc.), net of credits such as reimbursements. Click for the full breakdown by fee type. The latest open settlement period is an estimate from Amazon's Finances API until the settlement closes."
              onClick={openFeeDialog}
              value={moneyIn(Math.abs(totals?.total_fees ?? 0), nativeCurrency)}
              usdValue={totalsUsd ? money(Math.abs(totalsUsd.total_fees)) : undefined}
              sub={
                totals
                  ? `FBA ${moneyIn(Math.abs(totals.fba_fees), nativeCurrency)} · Referral ${moneyIn(
                      Math.abs(totals.referral_fees),
                      nativeCurrency
                    )} · Other ${moneyIn(Math.abs(totals.other_fees), nativeCurrency)}`
                  : undefined
              }
            />
            <StatTile
              label="Gross margin"
              info="Revenue minus Amazon fees. This is BEFORE product cost (COGS) and advertising, so it is not net profit."
              value={moneyIn(totals?.gross_margin ?? 0, nativeCurrency)}
              usdValue={totalsUsd ? money(totalsUsd.gross_margin) : undefined}
              sub={marginPct !== null ? `${marginPct.toFixed(1)}% of revenue` : undefined}
            />
            <StatTile
              label="Units / orders"
              info="Units and distinct orders shipped in the period, before returns. Counted once per order line, not once per fee line."
              value={`${(totals?.units ?? 0).toLocaleString()} / ${(
                totals?.orders ?? 0
              ).toLocaleString()}`}
              sub="Gross units sold, before returns"
            />
          </div>
        )}

        <Card>
          <CardHeader className="grid-cols-1! sm:grid-cols-[1fr_auto]!">
            <CardTitle>Goal vs Realtime</CardTitle>
            <CardDescription>Manually-set targets for the current period</CardDescription>
            <CardAction>
              <button
                onClick={openGoalsDialog}
                title="Manage goals"
                className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
              </button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {goalsLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : goalProgress.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No goal set for the current period.{" "}
                <button onClick={openGoalsDialog} className="text-primary underline">
                  Set one
                </button>
                .
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {goalProgress.map((gp) => (
                  <div key={gp.goal.id} className="rounded-md border border-border p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {gp.goal.metric === "revenue" ? "Revenue" : "Gross margin"} goal
                    </p>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="text-lg font-semibold tabular-nums">{money(gp.actual)}</span>
                      <span className="text-xs text-muted-foreground">
                        of {money(gp.goal.target_amount)}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-xs",
                        gp.difference >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
                      )}
                    >
                      {gp.difference >= 0 ? "+" : ""}
                      {money(gp.difference)} vs target
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="grid-cols-1! sm:grid-cols-[1fr_auto]!">
            <CardTitle>Revenue, fees and margin</CardTitle>
            <CardDescription>
              From Amazon settlement reports, bucketed by SGT date
              {overview && overview.countriesWithData.length > 0 && (
                <> · {overview.countriesWithData.join(", ")}</>
              )}
            </CardDescription>
            <CardAction>
              <Badge variant={overview?.lastSyncStatus === "error" ? "destructive" : "secondary"}>
                Synced {relativeTime(overview?.lastSyncedAt ?? null)}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : chartData.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No settlement data for this marketplace and date range yet. Amazon issues
                settlements roughly every 1–2 weeks; the sync picks each one up within ~2 hours
                of it being finalized.
              </p>
            ) : (
              <ChartContainer config={chartConfig} className="h-72 w-full">
                <LineChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={24} />
                  <YAxis tickLine={false} axisLine={false} width={56} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    dataKey="revenue"
                    type="monotone"
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    dataKey="fees"
                    type="monotone"
                    stroke="var(--color-fees)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    dataKey="gross_margin"
                    type="monotone"
                    stroke="var(--color-gross_margin)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={feeDialogOpen} onOpenChange={setFeeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Amazon fees · {SCOPES.find((s) => s.key === scope)?.label}
            </DialogTitle>
            <DialogDescription>
              {moneyIn(Math.abs(feeTotal), nativeCurrency)} total, itemized by Amazon fee type
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <div className="flex flex-wrap items-center gap-1.5 text-sm">
              <input
                type="date"
                value={feeFrom}
                max={feeTo || undefined}
                onChange={(e) => setFeeFrom(e.target.value)}
                className="rounded-md border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-muted-foreground">→</span>
              <input
                type="date"
                value={feeTo}
                min={feeFrom || undefined}
                onChange={(e) => setFeeTo(e.target.value)}
                className="rounded-md border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {feeFrom > feeTo ? (
              <p className="text-xs text-destructive">Pick a start date on or before the end date.</p>
            ) : feeLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : feeError ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {feeError}
              </div>
            ) : feeBreakdown ? (
              <>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={feeShowAll}
                    onChange={(e) => setFeeShowAll(e.target.checked)}
                  />
                  Show all fee types, including $0
                </label>
                <FeeBreakdownBody
                  breakdown={feeBreakdown}
                  totalFees={feeTotal}
                  currency={nativeCurrency}
                  showAll={feeShowAll}
                />
              </>
            ) : null}
          </DialogBody>
          <DialogFooter>
            <DialogClose className="rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent">
              Done
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={goalsDialogOpen} onOpenChange={setGoalsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Goals · {SCOPES.find((s) => s.key === scope)?.label}</DialogTitle>
            <DialogDescription>
              Manually-set revenue and gross margin targets for this marketplace.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            {goalError && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {goalError}
              </div>
            )}

            {goalsList.length > 0 && (
              <div className="overflow-x-auto rounded-md border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Metric</th>
                      <th className="px-3 py-2 text-left font-medium">Period</th>
                      <th className="px-3 py-2 text-right font-medium">Target</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {goalsList.map((g) => (
                      <tr key={g.id} className="border-t border-border">
                        <td className="px-3 py-2">
                          {g.metric === "revenue" ? "Revenue" : "Gross margin"}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {g.period_start} → {g.period_end}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">{money(g.target_amount)}</td>
                        <td className="px-3 py-2 text-right">
                          <button
                            onClick={() => removeGoal(g.id)}
                            disabled={goalPending}
                            className="text-xs text-destructive hover:underline disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="space-y-3 rounded-md border border-border p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Add a goal
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Metric</label>
                  <select
                    value={goalForm.metric}
                    onChange={(e) =>
                      setGoalForm((prev) => ({ ...prev, metric: e.target.value as GoalMetric }))
                    }
                    className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {GOAL_METRICS.map((m) => (
                      <option key={m} value={m}>
                        {m === "revenue" ? "Revenue" : "Gross margin"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Target ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={goalForm.targetAmount}
                    onChange={(e) =>
                      setGoalForm((prev) => ({ ...prev, targetAmount: e.target.value }))
                    }
                    className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Period start
                  </label>
                  <input
                    type="date"
                    value={goalForm.periodStart}
                    onChange={(e) =>
                      setGoalForm((prev) => ({ ...prev, periodStart: e.target.value }))
                    }
                    className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Period end
                  </label>
                  <input
                    type="date"
                    value={goalForm.periodEnd}
                    onChange={(e) =>
                      setGoalForm((prev) => ({ ...prev, periodEnd: e.target.value }))
                    }
                    className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <button
                onClick={saveGoal}
                disabled={goalPending}
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {goalPending ? "Saving…" : "Add goal"}
              </button>
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose className="rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent">
              Done
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** (?) icon with a hover/focus explanation. Portalled and fixed-positioned because the
 * stat cards clip overflow. */
function InfoTip({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  function show() {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const width = 288;
    const x = Math.min(Math.max(8, r.left + r.width / 2 - width / 2), window.innerWidth - width - 8);
    setPos({ x, y: r.bottom + 6 });
  }

  return (
    <>
      <span
        ref={ref}
        tabIndex={0}
        aria-label={text}
        onMouseEnter={show}
        onMouseLeave={() => setPos(null)}
        onFocus={show}
        onBlur={() => setPos(null)}
        onClick={(e) => e.stopPropagation()}
        className="inline-flex cursor-help rounded-full text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <CircleHelp className="h-3.5 w-3.5" />
      </span>
      {pos &&
        createPortal(
          <div
            role="tooltip"
            style={{ left: pos.x, top: pos.y, width: 288 }}
            className="pointer-events-none fixed z-50 rounded-md border border-border bg-popover px-3 py-2 text-xs font-normal normal-case leading-relaxed tracking-normal text-popover-foreground shadow-md"
          >
            {text}
          </div>,
          document.body
        )}
    </>
  );
}

function StatTile({
  label,
  value,
  sub,
  usdValue,
  onClick,
  info,
}: {
  info?: string;
  label: string;
  value: string;
  sub?: string;
  /** Secondary "(~$X USD)" line for a native-currency (CA/MX) figure. */
  usdValue?: string;
  /** When set the whole tile becomes a button (drill-down). */
  onClick?: () => void;
}) {
  const card = (
    <Card className={cn(onClick && "transition-colors group-hover:bg-accent/40")}>
      <CardContent className="space-y-1">
        <p className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <span className="flex items-center gap-1.5">
            {label}
            {info && <InfoTip text={info} />}
          </span>
          {onClick && <ChevronRight className="h-3.5 w-3.5" />}
        </p>
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
        {usdValue && <p className="text-xs text-muted-foreground">(~{usdValue} USD)</p>}
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        {onClick && <p className="text-xs text-primary">View breakdown</p>}
      </CardContent>
    </Card>
  );
  if (!onClick) return card;
  return (
    <button
      type="button"
      onClick={onClick}
      className="group block w-full rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {card}
    </button>
  );
}

function FeeBreakdownBody({
  breakdown,
  totalFees,
  currency,
  showAll,
}: {
  breakdown: FeeBreakdown;
  totalFees: number;
  currency: string;
  showAll: boolean;
}) {
  const fmt = (v: number) =>
    v.toLocaleString(undefined, { style: "currency", currency, maximumFractionDigits: 2 });
  // Seller Central convention: fees negative, credits (reimbursements) positive, as stored.
  const shown = (v: number) => fmt(v);
  const grand = Math.abs(totalFees) || 1;
  const notItemized = totalFees - breakdown.itemizedTotal;

  return (
    <div className="space-y-4">
      {breakdown.estimateFrom && (
        <div className="rounded-md border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs text-sky-700 dark:text-sky-400">
          Includes {shown(breakdown.estimateTotal)} from the open settlement period (since{" "}
          {breakdown.estimateFrom}), pulled live from Amazon&apos;s Finances API. Not yet settled, so
          figures can still change slightly.
        </div>
      )}
      {Math.abs(notItemized) >= 0.5 && (
        <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
          {shown(notItemized)} of this period&apos;s fees ({((Math.abs(notItemized) / grand) * 100).toFixed(1)}%)
          {breakdown.detailFrom
            ? ` pre-date itemized detail, which starts ${breakdown.detailFrom}.`
            : " has no itemized detail yet."}
        </div>
      )}
      {breakdown.families.map((fam) => {
        const defs = FEE_FAMILIES.find((f) => f.family === fam.family)?.types ?? [];
        const present = new Map(fam.types.map((t) => [t.fee_type, t.amount]));
        const names = showAll
          ? [...defs, ...fam.types.map((t) => t.fee_type).filter((n) => !defs.includes(n))]
          : fam.types.filter((t) => Math.abs(t.amount) >= 0.005).map((t) => t.fee_type);
        return (
          <div key={fam.family} className="overflow-hidden rounded-md border border-border">
            <div className="flex items-center justify-between bg-muted px-3 py-2 text-sm font-medium">
              <span>{fam.family}</span>
              <span className="tabular-nums">{shown(fam.total)}</span>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {names.map((name) => {
                  const amount = present.get(name) ?? 0;
                  return (
                    <tr key={name} className="border-t border-border">
                      <td className="px-3 py-1.5">{name}</td>
                      <td className="px-3 py-1.5 text-right text-xs text-muted-foreground tabular-nums">
                        {amount !== 0 ? `${((Math.abs(amount) / grand) * 100).toFixed(1)}%` : ""}
                      </td>
                      <td
                        className={cn(
                          "w-28 px-3 py-1.5 text-right tabular-nums",
                          amount > 0 && "text-emerald-600 dark:text-emerald-400"
                        )}
                      >
                        {shown(amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
      {breakdown.families.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No itemized fee detail for this marketplace and date range yet.
        </p>
      )}
    </div>
  );
}
