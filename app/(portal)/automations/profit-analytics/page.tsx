"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { profitAnalytics } from "@/lib/projects";
import { getProfitOverview, type ProfitOverview } from "@/lib/actions/profit-analytics";
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
  const [rangeKey, setRangeKey] = useState<(typeof RANGES)[number]["key"]>("90");
  const [overview, setOverview] = useState<ProfitOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const days = RANGES.find((r) => r.key === rangeKey)?.days ?? 90;
    // Clicking through marketplaces faster than the queries return would
    // otherwise let a slow earlier response land last and overwrite the
    // current selection's data, so stale results are dropped on unmount/change.
    let cancelled = false;

    startTransition(async () => {
      setIsLoading(true);
      const { data, error: err } = await getProfitOverview(scope, sgtDate(-days), sgtDate());
      if (cancelled) return;
      if (err) {
        setError(err);
        setOverview(null);
      } else {
        setOverview(data);
        setError(null);
      }
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [scope, rangeKey]);

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
          <Tabs value={rangeKey} onValueChange={(v) => setRangeKey(v as typeof rangeKey)}>
            <TabsList>
              {RANGES.map((r) => (
                <TabsTrigger key={r.key} value={r.key}>
                  {r.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile label="Revenue" value={money(totals?.revenue ?? 0)} />
            <StatTile
              label="Amazon fees"
              value={money(Math.abs(totals?.total_fees ?? 0))}
              sub={
                totals
                  ? `FBA ${money(Math.abs(totals.fba_fees))} · Referral ${money(
                      Math.abs(totals.referral_fees)
                    )} · Other ${money(Math.abs(totals.other_fees))}`
                  : undefined
              }
            />
            <StatTile
              label="Gross margin"
              value={money(totals?.gross_margin ?? 0)}
              sub={marginPct !== null ? `${marginPct.toFixed(1)}% of revenue` : undefined}
            />
            <StatTile
              label="Units / orders"
              value={`${(totals?.units ?? 0).toLocaleString()} / ${(
                totals?.orders ?? 0
              ).toLocaleString()}`}
              sub="Gross units sold, before returns"
            />
          </div>
        )}

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
    </>
  );
}

function StatTile({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}
