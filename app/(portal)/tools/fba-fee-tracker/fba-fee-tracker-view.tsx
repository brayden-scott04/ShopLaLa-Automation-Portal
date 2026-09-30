"use client";

import { Fragment, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Download,
  Search,
  Upload,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import {
  bulkUpdateTrueDims,
  getFbaFeeOverview,
  getSkuFeeHistory,
  resetTrueDimsToAmazon,
  updateAlertStatus,
  updateTrueDims,
  type BulkDimsResult,
  type DimsJson,
  type FbaFeeOverview,
  type FeeAlert,
  type FeeSnapshot,
  type SkuHistory,
  type TrueDims,
} from "@/lib/actions/fba-fee-tracker";
import {
  ALERT_KIND_LABELS,
  ALERT_STATUS_LABELS,
  CALCULATOR_MATCH_TOLERANCE,
  EXPECTED_GAP_ALERT_PCT,
  FEE_CHANGE_ALERT_PCT,
  HISTORY_DAYS,
  type AlertStatus,
} from "@/lib/fba-fee-tracker-constants";
import {
  SIZE_TIER_LABELS,
  expectedFbaFee,
  isStandardTier,
  normalizeAmazonTier,
  type FeeResult,
} from "@/lib/fba-fee-calculator";

// ── Derived row ────────────────────────────────────────────────────────────

interface Row {
  snap: FeeSnapshot;
  price: number | null;
  baselineFee: number | null;
  baselineTier: string | null;
  deltaPct: number | null;
  tierChanged: boolean;
  /** Calculator run on Amazon's own dimensions — the self-check. */
  amazonCalc: FeeResult | null;
  calcMatches: boolean | null;
  trueDims: TrueDims | null;
  expected: FeeResult | null;
  gap: number | null;
  gapPct: number | null;
  alert: FeeAlert | null;
  /** 0 = fine, 1 = fee moved, 2 = overcharged vs expected, 3 = re-measured / tier change. */
  severity: number;
}

type SortKey = "severity" | "sku" | "fee" | "delta" | "expected" | "gap";
type Filter = "all" | "flagged";

const money = (v: number | null | undefined) => (v == null ? "—" : `$${v.toFixed(2)}`);
const pct = (v: number | null | undefined) =>
  v == null ? "—" : `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
const num = (v: number | null | undefined, digits = 2) =>
  v == null ? "—" : Number(v.toFixed(digits)).toString();

function dimsText(l: number | null, w: number | null, h: number | null, wt: number | null): string {
  if (l == null || w == null || h == null) return "—";
  return `${num(l)}×${num(w)}×${num(h)} in · ${num(wt, 3)} lb`;
}

function tierLabel(raw: string | null): string {
  if (!raw) return "—";
  const t = normalizeAmazonTier(raw);
  return t ? SIZE_TIER_LABELS[t] : raw;
}

function relativeTime(iso: string | null | undefined): string {
  if (!iso) return "never";
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 48) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

function buildRows(o: FbaFeeOverview): Row[] {
  const alertBySku = new Map<string, FeeAlert>();
  for (const a of o.alerts) if (!alertBySku.has(a.sku)) alertBySku.set(a.sku, a);

  return o.latest.map((snap) => {
    const price = snap.sales_price && snap.sales_price > 0 ? snap.sales_price : snap.your_price;
    const date = o.latestDate ?? undefined;
    const base = o.baseline[snap.sku];
    const baselineFee = base?.fee_per_unit ?? null;
    const baselineTier = base?.size_tier ?? null;
    const deltaPct =
      baselineFee && snap.fee_per_unit != null && baselineFee > 0
        ? ((snap.fee_per_unit - baselineFee) / baselineFee) * 100
        : null;
    const tierChanged =
      !!baselineTier &&
      !!snap.size_tier &&
      normalizeAmazonTier(baselineTier) !== normalizeAmazonTier(snap.size_tier);

    const amazonCalc =
      snap.longest_in != null && snap.median_in != null && snap.shortest_in != null && snap.weight_lb != null
        ? expectedFbaFee({
            sidesIn: [snap.longest_in, snap.median_in, snap.shortest_in],
            weightLb: snap.weight_lb,
            price,
            date,
          })
        : null;
    const calcMatches =
      amazonCalc && snap.fee_per_unit != null
        ? Math.abs(amazonCalc.fee - snap.fee_per_unit) <= CALCULATOR_MATCH_TOLERANCE
        : null;

    const td = o.trueDims[snap.sku] ?? null;
    const expected =
      td && td.length_in != null && td.width_in != null && td.height_in != null && td.weight_lb != null
        ? expectedFbaFee({
            sidesIn: [td.length_in, td.width_in, td.height_in],
            weightLb: td.weight_lb,
            price,
            date,
          })
        : null;
    const gap = expected && snap.fee_per_unit != null ? snap.fee_per_unit - expected.fee : null;
    const gapPct = gap != null && expected && expected.fee > 0 ? (gap / expected.fee) * 100 : null;

    const alert = alertBySku.get(snap.sku) ?? null;
    const reMeasured = alert?.cause === "dims_changed" || tierChanged;
    const severity = reMeasured
      ? 3
      : gapPct != null && gapPct >= EXPECTED_GAP_ALERT_PCT
        ? 2
        : (deltaPct != null && Math.abs(deltaPct) >= FEE_CHANGE_ALERT_PCT) || alert
          ? 1
          : 0;

    return {
      snap,
      price,
      baselineFee,
      baselineTier,
      deltaPct,
      tierChanged,
      amazonCalc,
      calcMatches,
      trueDims: td,
      expected,
      gap,
      gapPct,
      alert,
      severity,
    };
  });
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function FbaFeeTrackerView() {
  const [overview, setOverview] = useState<FbaFeeOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("severity");
  const [sortDesc, setSortDesc] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [caseAlert, setCaseAlert] = useState<FeeAlert | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  function reload() {
    startTransition(async () => {
      const { data, error } = await getFbaFeeOverview();
      if (error) setError(error);
      else {
        setOverview(data);
        setError(null);
      }
      setIsLoading(false);
    });
  }

  useEffect(() => {
    reload();
  }, []);

  const rows = useMemo(() => (overview ? buildRows(overview) : []), [overview]);

  const stats = useMemo(() => {
    const checked = rows.filter((r) => r.calcMatches !== null);
    return {
      tracked: rows.length,
      openAlerts: overview?.alerts.filter((a) => a.status === "open").length ?? 0,
      caseRaised: overview?.alerts.filter((a) => a.status === "case_raised").length ?? 0,
      overcharged: rows.filter((r) => r.gapPct != null && r.gapPct >= EXPECTED_GAP_ALERT_PCT).length,
      oversize: rows.filter((r) => !isStandardTier(normalizeAmazonTier(r.snap.size_tier))).length,
      matched: checked.filter((r) => r.calcMatches).length,
      checked: checked.length,
    };
  }, [rows, overview]);

  const matchRate = stats.checked > 0 ? (stats.matched / stats.checked) * 100 : null;

  const visibleRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = rows.filter(
      (r) =>
        (filter === "all" || r.severity > 0) &&
        (!q ||
          r.snap.sku.toLowerCase().includes(q) ||
          (r.snap.asin ?? "").toLowerCase().includes(q) ||
          (r.snap.product_name ?? "").toLowerCase().includes(q))
    );
    const val = (r: Row): number | string => {
      switch (sortKey) {
        case "severity":
          return r.severity * 1e6 + (r.gapPct ?? 0) + Math.abs(r.deltaPct ?? 0) / 1000;
        case "sku":
          return r.snap.sku.toLowerCase();
        case "fee":
          return r.snap.fee_per_unit ?? -Infinity;
        case "delta":
          return r.deltaPct ?? -Infinity;
        case "expected":
          return r.expected?.fee ?? -Infinity;
        case "gap":
          return r.gapPct ?? -Infinity;
      }
    };
    return [...filtered].sort((a, b) => {
      const va = val(a);
      const vb = val(b);
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDesc ? -cmp : cmp;
    });
  }, [rows, query, filter, sortKey, sortDesc]);

  const sortedAlerts = useMemo(
    () =>
      [...(overview?.alerts ?? [])].sort(
        (a, b) =>
          Number(a.status !== "open") - Number(b.status !== "open") ||
          Number(a.kind !== "tier_change") - Number(b.kind !== "tier_change") ||
          Number(a.cause !== "dims_changed") - Number(b.cause !== "dims_changed") ||
          Math.abs(b.pct_change ?? 0) - Math.abs(a.pct_change ?? 0)
      ),
    [overview]
  );

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDesc((d) => !d);
    else {
      setSortKey(key);
      setSortDesc(key !== "sku");
    }
  }

  function setAlertStatus(alert: FeeAlert, status: AlertStatus) {
    startTransition(async () => {
      const { error } = await updateAlertStatus(alert.id, status);
      if (error) setError(error);
      else reload();
    });
  }

  function exportCsv() {
    const header = [
      "SKU",
      "ASIN",
      "Product",
      "Amazon L (in)",
      "Amazon W (in)",
      "Amazon H (in)",
      "Amazon weight (lb)",
      "Amazon size tier",
      "Amazon FBA fee",
      `Fee ${overview?.baselineDate ?? ""}`,
      "Change %",
      "True L (in)",
      "True W (in)",
      "True H (in)",
      "True weight (lb)",
      "True dims source",
      "Expected tier",
      "Expected fee",
      "Gap $",
      "Gap %",
    ];
    const cell = (v: unknown) => {
      const s = v == null ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = visibleRows.map((r) =>
      [
        r.snap.sku,
        r.snap.asin,
        r.snap.product_name,
        r.snap.longest_in,
        r.snap.median_in,
        r.snap.shortest_in,
        r.snap.weight_lb,
        r.snap.size_tier,
        r.snap.fee_per_unit,
        r.baselineFee,
        r.deltaPct?.toFixed(1),
        r.trueDims?.length_in,
        r.trueDims?.width_in,
        r.trueDims?.height_in,
        r.trueDims?.weight_lb,
        r.trueDims?.source,
        r.expected ? SIZE_TIER_LABELS[r.expected.sizeTier] : null,
        r.expected?.fee,
        r.gap?.toFixed(2),
        r.gapPct?.toFixed(1),
      ]
        .map(cell)
        .join(",")
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fba-fees-${overview?.latestDate ?? "export"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const lastOk = overview?.lastSuccessfulRun;
  const lastRunFailed = overview?.lastRun?.status === "error";

  return (
    <div className="space-y-6 px-6 pb-6 md:px-8 md:pb-8">
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !overview?.latestDate ? (
        <Card>
          <CardContent>
            <p className="py-10 text-center text-sm text-muted-foreground">
              No FBA fee snapshots yet. The daily sync (04:30 SGT) records every SKU&apos;s
              dimensions, size tier and fee. Changes show up here from the second day onwards.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {lastRunFailed && (
            <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
              The latest sync failed ({relativeTime(overview.lastRun?.created_at)}). Figures below
              are from {overview.latestDate}. {overview.lastRun?.error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatTile
              label="SKUs tracked"
              value={stats.tracked.toLocaleString()}
              sub={`${stats.oversize} currently outside standard size`}
            />
            <StatTile
              label="Open alerts"
              value={stats.openAlerts.toLocaleString()}
              sub={`${stats.caseRaised} with a case raised`}
              tone={stats.openAlerts > 0 ? "bad" : undefined}
            />
            <StatTile
              label="Overcharged vs expected"
              value={stats.overcharged.toLocaleString()}
              sub={`Amazon fee ≥${EXPECTED_GAP_ALERT_PCT}% above our dimensions' fee`}
              tone={stats.overcharged > 0 ? "warn" : undefined}
            />
            <StatTile
              label="Calculator check"
              value={matchRate == null ? "—" : `${matchRate.toFixed(0)}%`}
              sub={`Matches Amazon on ${stats.matched}/${stats.checked} SKUs (Amazon's own dims)`}
              tone={matchRate != null && matchRate < 80 ? "warn" : undefined}
            />
            <StatTile
              label="Last synced"
              value={relativeTime(lastOk?.created_at)}
              sub={`Snapshot ${overview.latestDate}${
                overview.baselineDate ? ` · compared with ${overview.baselineDate}` : ""
              }`}
            />
          </div>

          {matchRate != null && matchRate < 80 && (
            <div className="flex gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>
                Run on Amazon&apos;s own dimensions, the calculator only matches Amazon&apos;s fee
                for {matchRate.toFixed(0)}% of SKUs. The rate card in
                <code className="mx-1">lib/fba-fee-calculator.ts</code>
                may be out of date: Amazon publishes a new card every Jan 15 and a peak card
                each autumn. Treat &quot;Expected fee&quot; as approximate until this is fixed.
              </span>
            </div>
          )}

          {sortedAlerts.length > 0 && (
            <Card className="border-destructive/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-destructive" />
                  Needs attention
                </CardTitle>
                <CardDescription>
                  Size-tier changes and fee moves of ±{FEE_CHANGE_ALERT_PCT}% or more between
                  daily snapshots. <span className="font-medium text-destructive">Re-measured</span>{" "}
                  means Amazon changed the dimensions or weight, so it may be worth a remeasure /
                  reimbursement case. <span className="font-medium">Rate change</span> means the
                  dimensions are unchanged and Amazon changed its prices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-md border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">SKU</th>
                        <th className="px-3 py-2 text-left font-medium">What changed</th>
                        <th className="px-3 py-2 text-left font-medium">Size tier</th>
                        <th className="px-3 py-2 text-right font-medium">FBA fee</th>
                        <th className="px-3 py-2 text-left font-medium">Amazon dimensions</th>
                        <th className="px-3 py-2 text-left font-medium">Status</th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedAlerts.map((a) => (
                        <tr
                          key={a.id}
                          className={cn(
                            "border-t border-border align-top",
                            a.status === "open" && a.cause === "dims_changed" && "bg-destructive/5"
                          )}
                        >
                          <td className="px-3 py-2">
                            <div className="font-medium">{a.sku}</div>
                            <div className="max-w-56 truncate text-xs text-muted-foreground">
                              {a.asin} {a.product_name && `· ${a.product_name}`}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex flex-wrap gap-1">
                              <Badge variant={a.kind === "tier_change" ? "destructive" : "secondary"}>
                                {ALERT_KIND_LABELS[a.kind]}
                              </Badge>
                              <Badge variant={a.cause === "dims_changed" ? "destructive" : "outline"}>
                                {a.cause === "dims_changed" ? "Re-measured" : "Rate change"}
                              </Badge>
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {a.previous_snapshot_date} → {a.detected_date}
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {tierLabel(a.old_tier)} → <span className="font-medium">{tierLabel(a.new_tier)}</span>
                          </td>
                          <td className="px-3 py-2 text-right whitespace-nowrap tabular-nums">
                            {money(a.old_fee)} → <span className="font-medium">{money(a.new_fee)}</span>
                            <div
                              className={cn(
                                "text-xs",
                                (a.pct_change ?? 0) > 0 ? "text-destructive" : "text-emerald-600"
                              )}
                            >
                              {pct(a.pct_change)}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-xs whitespace-nowrap">
                            <DimsDiff before={a.old_dims} after={a.new_dims} />
                          </td>
                          <td className="px-3 py-2">
                            <Badge variant={a.status === "open" ? "destructive" : "secondary"}>
                              {ALERT_STATUS_LABELS[a.status]}
                            </Badge>
                            {a.case_id && (
                              <div className="mt-1 text-xs text-muted-foreground">Case {a.case_id}</div>
                            )}
                            {a.notes && (
                              <div className="mt-1 max-w-48 text-xs text-muted-foreground">{a.notes}</div>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex flex-wrap justify-end gap-1">
                              {a.status === "open" && (
                                <Button size="xs" variant="outline" onClick={() => setCaseAlert(a)}>
                                  Case raised
                                </Button>
                              )}
                              <Button size="xs" variant="outline" onClick={() => setAlertStatus(a, "resolved")}>
                                Resolved
                              </Button>
                              <Button size="xs" variant="ghost" onClick={() => setAlertStatus(a, "dismissed")}>
                                Dismiss
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>All SKUs</CardTitle>
              <CardDescription>
                Amazon&apos;s current dimensions and fee, the change since{" "}
                {overview.baselineDate ?? "the first snapshot"} (up to {HISTORY_DAYS} days), and
                the fee our own dimensions should cost. Click a row for the fee history, or to edit
                its true dimensions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full max-w-xs">
                  <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search SKU, ASIN or name"
                    className="w-full rounded-md border border-input bg-background py-1.5 pr-2 pl-8 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                  />
                </div>
                <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="flagged" className="gap-1.5">
                      Flagged
                      <Badge variant="secondary">{rows.filter((r) => r.severity > 0).length}</Badge>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="ml-auto flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setUploadOpen(true)}>
                    <Upload /> Upload true dimensions
                  </Button>
                  <Button size="sm" variant="outline" onClick={exportCsv}>
                    <Download /> Export CSV
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-md border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="w-6 px-2 py-2"></th>
                      <SortTh label="SKU" k="sku" {...{ sortKey, sortDesc, toggleSort }} />
                      <th className="px-3 py-2 text-left font-medium">Amazon dimensions</th>
                      <th className="px-3 py-2 text-left font-medium">Size tier</th>
                      <SortTh label="FBA fee" k="fee" align="right" {...{ sortKey, sortDesc, toggleSort }} />
                      <SortTh label="Change" k="delta" align="right" {...{ sortKey, sortDesc, toggleSort }} />
                      <th className="px-3 py-2 text-left font-medium">True dimensions</th>
                      <SortTh label="Expected" k="expected" align="right" {...{ sortKey, sortDesc, toggleSort }} />
                      <SortTh label="Gap" k="gap" align="right" {...{ sortKey, sortDesc, toggleSort }} />
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-3 py-8 text-center text-muted-foreground">
                          No SKUs match.
                        </td>
                      </tr>
                    )}
                    {visibleRows.map((r) => {
                      const open = expanded === r.snap.sku;
                      return (
                        <Fragment key={r.snap.sku}>
                          <tr
                            onClick={() => setExpanded(open ? null : r.snap.sku)}
                            className={cn(
                              "cursor-pointer border-t border-border hover:bg-muted/50",
                              r.severity === 3 && "bg-destructive/10",
                              r.severity === 2 && "bg-amber-500/10",
                              r.severity === 1 && "bg-amber-500/5"
                            )}
                          >
                            <td className="px-2 py-2 text-muted-foreground">
                              {open ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                            </td>
                            <td className="px-3 py-2">
                              <div className="font-medium">{r.snap.sku}</div>
                              <div className="max-w-52 truncate text-xs text-muted-foreground">
                                {r.snap.asin} {r.snap.product_name && `· ${r.snap.product_name}`}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-xs whitespace-nowrap">
                              {dimsText(r.snap.longest_in, r.snap.median_in, r.snap.shortest_in, r.snap.weight_lb)}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <TierBadge raw={r.snap.size_tier} changed={r.tierChanged} />
                              {r.tierChanged && (
                                <div className="mt-0.5 text-xs text-muted-foreground">
                                  was {tierLabel(r.baselineTier)}
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-2 text-right tabular-nums">
                              <div className="font-medium">{money(r.snap.fee_per_unit)}</div>
                              {r.baselineFee != null && (
                                <div className="text-xs text-muted-foreground">was {money(r.baselineFee)}</div>
                              )}
                            </td>
                            <td
                              className={cn(
                                "px-3 py-2 text-right tabular-nums",
                                r.deltaPct != null && r.deltaPct >= FEE_CHANGE_ALERT_PCT && "font-semibold text-destructive",
                                r.deltaPct != null && r.deltaPct <= -FEE_CHANGE_ALERT_PCT && "text-emerald-600"
                              )}
                            >
                              {pct(r.deltaPct)}
                            </td>
                            <td className="px-3 py-2 text-xs whitespace-nowrap">
                              {r.trueDims ? (
                                <>
                                  {dimsText(
                                    r.trueDims.length_in,
                                    r.trueDims.width_in,
                                    r.trueDims.height_in,
                                    r.trueDims.weight_lb
                                  )}
                                  <div className="mt-0.5">
                                    <Badge variant={r.trueDims.source === "manual" ? "default" : "outline"}>
                                      {r.trueDims.source === "manual" ? "Manual" : "Amazon first-seen"}
                                    </Badge>
                                  </div>
                                </>
                              ) : (
                                <span className="text-muted-foreground">Not set</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-right tabular-nums">
                              <div>{money(r.expected?.fee)}</div>
                              {r.expected && (
                                <div className="text-xs text-muted-foreground">
                                  {SIZE_TIER_LABELS[r.expected.sizeTier]}
                                </div>
                              )}
                            </td>
                            <td
                              className={cn(
                                "px-3 py-2 text-right tabular-nums",
                                r.gapPct != null && r.gapPct >= EXPECTED_GAP_ALERT_PCT && "font-semibold text-destructive"
                              )}
                            >
                              {r.gap == null ? "—" : `${r.gap > 0 ? "+" : ""}${money(r.gap)}`}
                              {r.gapPct != null && <div className="text-xs">{pct(r.gapPct)}</div>}
                            </td>
                          </tr>
                          {open && (
                            <tr className="border-t border-border bg-muted/30">
                              <td colSpan={9} className="px-4 py-4">
                                <SkuDetail row={r} onSaved={reload} onError={setError} />
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground">
                Expected fee uses Amazon&apos;s official 2026 US rate card (non-apparel): peak rates
                from Oct 15 to Jan 14 and non-peak rates otherwise. It adds the 3.5% fuel surcharge
                and uses the price band of the current selling price and our true dimensions.
              </p>
            </CardContent>
          </Card>
        </>
      )}

      <CaseRaisedDialog
        alert={caseAlert}
        onClose={() => setCaseAlert(null)}
        onSaved={() => {
          setCaseAlert(null);
          reload();
        }}
      />
      <UploadDimsDialog open={uploadOpen} onOpenChange={setUploadOpen} onUploaded={reload} />
    </div>
  );
}

// ── Pieces ─────────────────────────────────────────────────────────────────

function StatTile({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "bad" | "warn";
}) {
  return (
    <Card
      className={cn(
        tone === "bad" && "border-destructive/50",
        tone === "warn" && "border-amber-500/50"
      )}
    >
      <CardContent className="space-y-1">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
        <p
          className={cn(
            "text-2xl font-semibold tabular-nums",
            tone === "bad" && "text-destructive",
            tone === "warn" && "text-amber-600 dark:text-amber-400"
          )}
        >
          {value}
        </p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function SortTh({
  label,
  k,
  align = "left",
  sortKey,
  sortDesc,
  toggleSort,
}: {
  label: string;
  k: SortKey;
  align?: "left" | "right";
  sortKey: SortKey;
  sortDesc: boolean;
  toggleSort: (k: SortKey) => void;
}) {
  const active = sortKey === k;
  return (
    <th className={cn("px-3 py-2 font-medium", align === "right" ? "text-right" : "text-left")}>
      <button
        onClick={() => toggleSort(k)}
        className={cn("inline-flex items-center gap-1 hover:text-foreground", active ? "text-foreground" : "")}
      >
        {label}
        {active && (sortDesc ? <ArrowDown className="size-3" /> : <ArrowUp className="size-3" />)}
      </button>
    </th>
  );
}

function TierBadge({ raw, changed }: { raw: string | null; changed: boolean }) {
  const tier = normalizeAmazonTier(raw);
  const standard = isStandardTier(tier);
  return (
    <Badge variant={changed ? "destructive" : standard ? "secondary" : "outline"}>
      {tierLabel(raw)}
    </Badge>
  );
}

function DimsDiff({ before, after }: { before: DimsJson | null; after: DimsJson | null }) {
  if (!before || !after) return <span className="text-muted-foreground">—</span>;
  const fields: [keyof DimsJson, string][] = [
    ["longest_in", "L"],
    ["median_in", "W"],
    ["shortest_in", "H"],
    ["weight_lb", "lb"],
  ];
  return (
    <div className="space-y-0.5">
      {fields.map(([k, label]) => {
        const a = before[k];
        const b = after[k];
        const moved = a != null && b != null && Math.abs(a - b) > (k === "weight_lb" ? 0.01 : 0.05);
        return (
          <div key={k} className={cn(moved && "font-medium text-destructive")}>
            {label}: {num(a, 3)} {moved && <>→ {num(b, 3)}</>}
          </div>
        );
      })}
    </div>
  );
}

const historyChartConfig = {
  fee: { label: "FBA fee", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

function SkuDetail({
  row,
  onSaved,
  onError,
}: {
  row: Row;
  onSaved: () => void;
  onError: (e: string) => void;
}) {
  const [history, setHistory] = useState<SkuHistory | null>(null);
  const [pending, startTransition] = useTransition();
  const td = row.trueDims;
  const [form, setForm] = useState({
    length_in: td?.length_in?.toString() ?? "",
    width_in: td?.width_in?.toString() ?? "",
    height_in: td?.height_in?.toString() ?? "",
    weight_lb: td?.weight_lb?.toString() ?? "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getSkuFeeHistory(row.snap.sku).then(({ data, error }) => {
      if (cancelled) return;
      if (error) onError(error);
      else setHistory(data);
    });
    return () => {
      cancelled = true;
    };
  }, [row.snap.sku, onError]);

  // Live preview of the expected fee for what's typed in the form.
  const preview = useMemo(() => {
    const v = [form.length_in, form.width_in, form.height_in, form.weight_lb].map(Number);
    if (v.some((n) => !Number.isFinite(n) || n <= 0)) return null;
    return expectedFbaFee({ sidesIn: [v[0], v[1], v[2]], weightLb: v[3], price: row.price });
  }, [form, row.price]);

  const dimChanges = useMemo(() => {
    const snaps = history?.snapshots ?? [];
    const out: { date: string; text: string }[] = [];
    for (let i = 1; i < snaps.length; i++) {
      const a = snaps[i - 1];
      const b = snaps[i];
      const moved =
        a.longest_in !== b.longest_in ||
        a.median_in !== b.median_in ||
        a.shortest_in !== b.shortest_in ||
        a.weight_lb !== b.weight_lb ||
        a.size_tier !== b.size_tier;
      if (moved) {
        out.push({
          date: b.snapshot_date,
          text: `${dimsText(a.longest_in, a.median_in, a.shortest_in, a.weight_lb)} (${tierLabel(
            a.size_tier
          )}) → ${dimsText(b.longest_in, b.median_in, b.shortest_in, b.weight_lb)} (${tierLabel(b.size_tier)})`,
        });
      }
    }
    return out;
  }, [history]);

  function save() {
    setFormError(null);
    startTransition(async () => {
      const { error } = await updateTrueDims(row.snap.sku, {
        length_in: Number(form.length_in),
        width_in: Number(form.width_in),
        height_in: Number(form.height_in),
        weight_lb: Number(form.weight_lb),
      });
      if (error) setFormError(error);
      else onSaved();
    });
  }

  function resetToAmazon() {
    setFormError(null);
    startTransition(async () => {
      const { error } = await resetTrueDimsToAmazon(row.snap.sku);
      if (error) setFormError(error);
      else onSaved();
    });
  }

  const chartData = (history?.snapshots ?? []).map((s) => ({
    date: s.snapshot_date.slice(5),
    fee: s.fee_per_unit,
  }));

  const inputCls =
    "w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:ring-2 focus:ring-ring focus:outline-none";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Amazon FBA fee, last {HISTORY_DAYS} days
        </p>
        {!history ? (
          <Skeleton className="h-48 w-full" />
        ) : chartData.length < 2 ? (
          <p className="text-sm text-muted-foreground">Not enough history yet.</p>
        ) : (
          <ChartContainer config={historyChartConfig} className="h-48 w-full">
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis tickLine={false} axisLine={false} width={48} domain={["auto", "auto"]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line dataKey="fee" type="stepAfter" stroke="var(--color-fee)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        )}
        <div>
          <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Dimension / tier changes by Amazon
          </p>
          {dimChanges.length === 0 ? (
            <p className="text-sm text-muted-foreground">None recorded.</p>
          ) : (
            <ul className="space-y-1 text-xs">
              {dimChanges.map((c) => (
                <li key={c.date}>
                  <span className="font-medium">{c.date}</span>: {c.text}
                </li>
              ))}
            </ul>
          )}
        </div>
        {row.amazonCalc && (
          <p className="text-xs text-muted-foreground">
            Calculator on Amazon&apos;s dimensions: {money(row.amazonCalc.fee)} (
            {SIZE_TIER_LABELS[row.amazonCalc.sizeTier]}, shipping weight {row.amazonCalc.shippingWeightLb} lb) vs.
            Amazon {money(row.snap.fee_per_unit)}
            {row.calcMatches ? " ✓" : ". Doesn't match, so treat this SKU's expected fee with caution."}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          True package dimensions (our measurement)
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              ["length_in", "Length (in)"],
              ["width_in", "Width (in)"],
              ["height_in", "Height (in)"],
              ["weight_lb", "Weight (lb)"],
            ] as const
          ).map(([k, label]) => (
            <div key={k}>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form[k]}
                onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
                className={inputCls}
              />
            </div>
          ))}
        </div>
        {preview && (
          <div className="rounded-md border border-border bg-background p-3 text-sm">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <span>
                Tier: <span className="font-medium">{SIZE_TIER_LABELS[preview.sizeTier]}</span>
              </span>
              <span>Dim. weight: {preview.dimensionalWeightLb} lb</span>
              <span>Shipping weight: {preview.shippingWeightLb} lb</span>
              <span>
                Price band:{" "}
                {["< $10", "$10–$50", "> $50"][preview.priceBand]}
                {preview.priceBandAssumed && " (price unknown, assumed)"}
              </span>
              {preview.isPeak && <span>Peak-season rates</span>}
            </div>
            <div className="mt-2">
              Expected fee <span className="text-lg font-semibold">{money(preview.fee)}</span>{" "}
              <span className="text-muted-foreground">vs. Amazon {money(row.snap.fee_per_unit)}</span>
            </div>
          </div>
        )}
        {formError && <p className="text-sm text-destructive">{formError}</p>}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={save} disabled={pending}>
            {pending ? "Saving…" : "Save true dimensions"}
          </Button>
          <Button size="sm" variant="ghost" onClick={resetToAmazon} disabled={pending}>
            Reset to Amazon&apos;s first reading
          </Button>
        </div>
        {td && (
          <p className="text-xs text-muted-foreground">
            {td.source === "manual" ? `Entered by ${td.updated_by ?? "staff"}` : "Taken from Amazon's first reading"} ·{" "}
            {new Date(td.updated_at).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}

function CaseRaisedDialog({
  alert,
  onClose,
  onSaved,
}: {
  alert: FeeAlert | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [caseId, setCaseId] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const [prevAlert, setPrevAlert] = useState(alert);
  if (alert !== prevAlert) {
    setPrevAlert(alert);
    setCaseId(alert?.case_id ?? "");
    setNotes(alert?.notes ?? "");
    setError(null);
  }

  function save() {
    if (!alert) return;
    startTransition(async () => {
      const { error } = await updateAlertStatus(alert.id, "case_raised", caseId, notes);
      if (error) setError(error);
      else onSaved();
    });
  }

  const inputCls =
    "w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:ring-2 focus:ring-ring focus:outline-none";

  return (
    <Dialog open={!!alert} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Case raised · {alert?.sku}</DialogTitle>
          <DialogDescription>
            Record the Seller Central case asking Amazon to remeasure this SKU and reimburse the
            overcharge.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-3">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Case ID</label>
            <input value={caseId} onChange={(e) => setCaseId(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={inputCls} />
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose className="rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent">Cancel</DialogClose>
          <Button size="sm" onClick={save} disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UploadDimsDialog({
  open,
  onOpenChange,
  onUploaded,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onUploaded: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<BulkDimsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function upload() {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Choose a file first");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    setError(null);
    setResult(null);
    startTransition(async () => {
      const { data, error } = await bulkUpdateTrueDims(fd);
      if (error) setError(error);
      else {
        setResult(data);
        if (data && data.updated > 0) onUploaded();
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) {
          setResult(null);
          setError(null);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload true dimensions</DialogTitle>
          <DialogDescription>
            An Excel or CSV file with a header row of <b>SKU</b>, <b>Length</b>, <b>Width</b>,{" "}
            <b>Height</b> and <b>Weight</b>. Units are inches and pounds unless the header says
            otherwise, e.g. &quot;Length (cm)&quot; or &quot;Weight (kg)&quot;. Every row replaces
            that SKU&apos;s true dimensions and marks them Manual.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-3">
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="text-sm" />
          {error && <p className="text-sm text-destructive">{error}</p>}
          {result && (
            <div className="space-y-2 text-sm">
              <p>
                Updated <span className="font-medium">{result.updated}</span> SKU(s).
                {result.skipped.length > 0 && ` Skipped ${result.skipped.length}:`}
              </p>
              {result.skipped.length > 0 && (
                <ul className="max-h-40 space-y-0.5 overflow-y-auto text-xs text-muted-foreground">
                  {result.skipped.map((s, i) => (
                    <li key={i}>
                      Row {s.row}
                      {s.sku && ` (${s.sku})`}: {s.reason}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <DialogClose className="rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent">Close</DialogClose>
          <Button size="sm" onClick={upload} disabled={pending}>
            {pending ? "Uploading…" : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
