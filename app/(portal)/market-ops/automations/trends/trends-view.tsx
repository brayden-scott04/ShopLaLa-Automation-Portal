"use client";

import { Fragment, useEffect, useMemo, useState, useTransition } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { AlertTriangle, ArrowDown, ArrowUp, ChevronDown, ChevronRight, ExternalLink, Search } from "lucide-react";
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
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import {
  getAsinBsrHistory,
  getTrendsOverview,
  updateBsrAlertStatus,
  type AsinBsrHistory,
  type BsrAlert,
  type BsrSnapshot,
  type TrendsOverview,
} from "@/lib/actions/trends";
import { ALERT_STATUS_LABELS, type AlertStatus } from "@/lib/fba-fee-tracker-constants";
import {
  BSR_ALERT_KIND_LABELS,
  HISTORY_DAYS,
  RANK_DROP_MIN_POSITIONS,
  RANK_DROP_PCT,
  type BsrAlertKind,
} from "@/lib/trends-constants";

// ── Derived row ────────────────────────────────────────────────────────────

interface CategoryRank {
  classificationId: string;
  title: string;
  rank: number | null;
  link: string | null;
  /** Previous rank − current rank: positive = moved up (better). Null if no previous reading. */
  delta: number | null;
  /** Present today, absent from the previous snapshot of an ASIN that had one. */
  isNew: boolean;
}

interface Row {
  asin: string;
  sku: string | null;
  productName: string | null;
  top: CategoryRank | null;
  subs: CategoryRank[];
  /** Categories in the previous snapshot that are gone today. */
  removed: { title: string; rank: number | null }[];
  noRank: boolean;
  alerts: BsrAlert[];
  /** 0 = fine, 1 = rank drop, 2 = category added, 3 = category removed / ranks lost. */
  severity: number;
}

type SortKey = "severity" | "asin" | "top" | "best";
type Filter = "all" | "flagged";

const KIND_SEVERITY: Record<BsrAlertKind, number> = {
  category_removed: 3,
  ranks_lost: 3,
  category_added: 2,
  rank_drop: 1,
};

const rankText = (v: number | null | undefined) => (v == null ? "—" : `#${v.toLocaleString()}`);

function relativeTime(iso: string | null | undefined): string {
  if (!iso) return "never";
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 48) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

function buildRows(o: TrendsOverview): Row[] {
  const prevByAsin = new Map<string, TrendsOverview["previous"]>();
  for (const p of o.previous) {
    const list = prevByAsin.get(p.asin) ?? [];
    list.push(p);
    prevByAsin.set(p.asin, list);
  }
  const alertsByAsin = new Map<string, BsrAlert[]>();
  for (const a of o.alerts) {
    const list = alertsByAsin.get(a.asin) ?? [];
    list.push(a);
    alertsByAsin.set(a.asin, list);
  }
  const latestByAsin = new Map<string, BsrSnapshot[]>();
  for (const s of o.latest) {
    const list = latestByAsin.get(s.asin) ?? [];
    list.push(s);
    latestByAsin.set(s.asin, list);
  }

  return [...latestByAsin.entries()].map(([asin, snaps]) => {
    const prev = prevByAsin.get(asin) ?? [];
    const prevRank = new Map(prev.map((p) => [p.classification_id, p.rank]));
    const toCategory = (s: BsrSnapshot): CategoryRank => {
      const before = prevRank.get(s.classification_id);
      return {
        classificationId: s.classification_id,
        title: s.title ?? s.classification_id,
        rank: s.rank,
        link: s.link,
        delta: before != null && s.rank != null ? before - s.rank : null,
        isNew: prev.length > 0 && !prevRank.has(s.classification_id),
      };
    };
    const topSnap = snaps.find((s) => s.rank_type === "display_group");
    const subs = snaps
      .filter((s) => s.rank_type === "classification")
      .map(toCategory)
      .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity));
    const today = new Set(snaps.map((s) => s.classification_id));
    const removed = prev
      .filter((p) => p.rank_type !== "none" && !today.has(p.classification_id))
      .map((p) => ({ title: p.title ?? p.classification_id, rank: p.rank }));
    const alerts = alertsByAsin.get(asin) ?? [];
    const first = snaps[0];
    return {
      asin,
      sku: first.sku,
      productName: first.product_name,
      top: topSnap ? toCategory(topSnap) : null,
      subs,
      removed,
      noRank: snaps.every((s) => s.rank_type === "none"),
      alerts,
      severity: Math.max(0, ...alerts.filter((a) => a.status === "open").map((a) => KIND_SEVERITY[a.kind])),
    };
  });
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function TrendsView() {
  const [overview, setOverview] = useState<TrendsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("severity");
  const [sortDesc, setSortDesc] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [caseAlert, setCaseAlert] = useState<BsrAlert | null>(null);

  function reload() {
    startTransition(async () => {
      const { data, error } = await getTrendsOverview();
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

  const stats = useMemo(
    () => ({
      tracked: rows.length,
      categories: rows.reduce((n, r) => n + r.subs.length, 0),
      noRank: rows.filter((r) => r.noRank).length,
      openAlerts: overview?.alerts.filter((a) => a.status === "open").length ?? 0,
      caseRaised: overview?.alerts.filter((a) => a.status === "case_raised").length ?? 0,
      categoryChanges:
        overview?.alerts.filter(
          (a) => a.status === "open" && (a.kind === "category_removed" || a.kind === "category_added")
        ).length ?? 0,
    }),
    [rows, overview]
  );

  const visibleRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = rows.filter(
      (r) =>
        (filter === "all" || r.severity > 0 || r.alerts.length > 0) &&
        (!q ||
          r.asin.toLowerCase().includes(q) ||
          (r.sku ?? "").toLowerCase().includes(q) ||
          (r.productName ?? "").toLowerCase().includes(q) ||
          r.subs.some((s) => s.title.toLowerCase().includes(q)))
    );
    const val = (r: Row): number | string => {
      switch (sortKey) {
        case "severity":
          return r.severity * 1e9 - (r.subs[0]?.rank ?? 1e8);
        case "asin":
          return r.asin;
        case "top":
          return r.top?.rank ?? Infinity;
        case "best":
          return r.subs[0]?.rank ?? Infinity;
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
          KIND_SEVERITY[b.kind] - KIND_SEVERITY[a.kind] ||
          b.detected_date.localeCompare(a.detected_date) ||
          (b.pct_change ?? 0) - (a.pct_change ?? 0)
      ),
    [overview]
  );

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDesc((d) => !d);
    else {
      setSortKey(key);
      // Ranks read best-first (ascending); severity reads worst-first.
      setSortDesc(key === "severity");
    }
  }

  function setAlertStatus(alert: BsrAlert, status: AlertStatus) {
    startTransition(async () => {
      const { error } = await updateBsrAlertStatus(alert.id, status);
      if (error) setError(error);
      else reload();
    });
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
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
              No Best Sellers Rank snapshots yet. The daily sync (05:00 SGT) records every
              ASIN&apos;s top-level and subcategory ranks. Changes show up here from the second day
              onwards.
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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile
              label="ASINs tracked"
              value={stats.tracked.toLocaleString()}
              sub={`${stats.categories} subcategory ranks${stats.noRank ? ` · ${stats.noRank} with no rank` : ""}`}
              tone={stats.noRank > 0 ? "warn" : undefined}
            />
            <StatTile
              label="Open alerts"
              value={stats.openAlerts.toLocaleString()}
              sub={`${stats.caseRaised} with a case raised`}
              tone={stats.openAlerts > 0 ? "bad" : undefined}
            />
            <StatTile
              label="Category changes"
              value={stats.categoryChanges.toLocaleString()}
              sub="Open alerts where Amazon added or removed a category"
              tone={stats.categoryChanges > 0 ? "bad" : undefined}
            />
            <StatTile
              label="Last synced"
              value={relativeTime(lastOk?.created_at)}
              sub={`Snapshot ${overview.latestDate}${
                overview.previousDate ? ` · compared with ${overview.previousDate}` : ""
              }${lastOk?.asins_failed ? ` · ${lastOk.asins_failed} ASINs failed to fetch` : ""}`}
              tone={lastOk?.asins_failed ? "warn" : undefined}
            />
          </div>

          {sortedAlerts.length > 0 && (
            <Card className="border-destructive/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-destructive" />
                  Needs attention
                </CardTitle>
                <CardDescription>
                  Changes between daily snapshots. A{" "}
                  <span className="font-medium text-destructive">removed category</span> or{" "}
                  <span className="font-medium text-destructive">all ranks lost</span> usually means
                  Amazon re-categorised or suppressed the listing, and is worth a Seller Central case.
                  Rank drops are flagged at {RANK_DROP_PCT}% or more and at least{" "}
                  {RANK_DROP_MIN_POSITIONS} places worse.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-md border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">ASIN</th>
                        <th className="px-3 py-2 text-left font-medium">What changed</th>
                        <th className="px-3 py-2 text-left font-medium">Category</th>
                        <th className="px-3 py-2 text-right font-medium">Top-level rank</th>
                        <th className="px-3 py-2 text-right font-medium">Subcategory rank</th>
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
                            a.status === "open" && KIND_SEVERITY[a.kind] === 3 && "bg-destructive/5"
                          )}
                        >
                          <td className="px-3 py-2">
                            <div className="font-medium">{a.asin}</div>
                            <div className="max-w-56 truncate text-xs text-muted-foreground">
                              {a.sku} {a.product_name && `· ${a.product_name}`}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <Badge variant={KIND_SEVERITY[a.kind] === 3 ? "destructive" : "secondary"}>
                              {BSR_ALERT_KIND_LABELS[a.kind]}
                            </Badge>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {a.previous_snapshot_date} → {a.detected_date}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            {a.category_title ?? (a.kind === "ranks_lost" ? "Every category" : "—")}
                            {a.rank_type === "display_group" && (
                              <div className="text-xs text-muted-foreground">Top-level</div>
                            )}
                          </td>
                          <AlertRankCell alert={a} level="top" />
                          <AlertRankCell alert={a} level="sub" />
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
              <CardTitle>All ASINs</CardTitle>
              <CardDescription>
                Each ASIN&apos;s Best Sellers Rank on {overview.latestDate}: the top-level category
                and every subcategory Amazon lists it in, with the change since{" "}
                {overview.previousDate ?? "the previous snapshot"}. A lower rank is better. Click a row
                for the last {HISTORY_DAYS} days.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full max-w-xs">
                  <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search ASIN, SKU, name or category"
                    className="w-full rounded-md border border-input bg-background py-1.5 pr-2 pl-8 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                  />
                </div>
                <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="flagged" className="gap-1.5">
                      Flagged
                      <Badge variant="secondary">
                        {rows.filter((r) => r.severity > 0 || r.alerts.length > 0).length}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="overflow-x-auto rounded-md border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="w-6 px-2 py-2"></th>
                      <SortTh label="ASIN" k="asin" {...{ sortKey, sortDesc, toggleSort }} />
                      <SortTh label="Top-level rank" k="top" {...{ sortKey, sortDesc, toggleSort }} />
                      <SortTh label="Subcategory ranks" k="best" {...{ sortKey, sortDesc, toggleSort }} />
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-3 py-8 text-center text-muted-foreground">
                          No ASINs match.
                        </td>
                      </tr>
                    )}
                    {visibleRows.map((r) => {
                      const open = expanded === r.asin;
                      return (
                        <Fragment key={r.asin}>
                          <tr
                            onClick={() => setExpanded(open ? null : r.asin)}
                            className={cn(
                              "cursor-pointer border-t border-border align-top hover:bg-muted/50",
                              r.severity === 3 && "bg-destructive/10",
                              r.severity === 2 && "bg-amber-500/10",
                              r.severity === 1 && "bg-amber-500/5"
                            )}
                          >
                            <td className="px-2 py-2 text-muted-foreground">
                              {open ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                            </td>
                            <td className="px-3 py-2">
                              <div className="font-medium">{r.asin}</div>
                              <div className="max-w-60 truncate text-xs text-muted-foreground">
                                {r.sku} {r.productName && `· ${r.productName}`}
                              </div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {r.top ? (
                                <>
                                  <div className="tabular-nums">
                                    <span className="font-medium">{rankText(r.top.rank)}</span>{" "}
                                    <Delta delta={r.top.delta} />
                                  </div>
                                  <div className="text-xs text-muted-foreground">{r.top.title}</div>
                                </>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              {r.noRank ? (
                                <Badge variant="destructive">No rank on Amazon</Badge>
                              ) : (
                                <div className="flex flex-wrap gap-1.5">
                                  {r.subs.map((c) => (
                                    <span
                                      key={c.classificationId}
                                      className={cn(
                                        "inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-xs",
                                        c.isNew && "border-amber-500/60 bg-amber-500/10"
                                      )}
                                      title={c.isNew ? "New category since the previous snapshot" : undefined}
                                    >
                                      <span className="font-medium tabular-nums">{rankText(c.rank)}</span>
                                      <span>{c.title}</span>
                                      <Delta delta={c.delta} />
                                    </span>
                                  ))}
                                  {r.removed.map((c) => (
                                    <span
                                      key={`removed-${c.title}`}
                                      className="inline-flex items-center gap-1 rounded-md border border-destructive/50 bg-destructive/10 px-2 py-0.5 text-xs text-destructive line-through"
                                      title="In the previous snapshot, gone today"
                                    >
                                      {rankText(c.rank)} {c.title}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </td>
                          </tr>
                          {open && (
                            <tr className="border-t border-border bg-muted/30">
                              <td colSpan={4} className="px-4 py-4">
                                <AsinDetail asin={r.asin} onError={setError} />
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
                Amazon recalculates Best Sellers Rank roughly hourly from recent sales. This page shows
                one reading per day, so day-to-day moves are noisy. Look at the trend, not one reading.
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
    </div>
  );
}

// ── Pieces ─────────────────────────────────────────────────────────────────

/** One of the alert table's two rank columns. The column the alert is about gets the bold
 *  value and the drop %; alerts from before the rank-context columns fall back to the
 *  alert's own old/new rank in whichever column matches its rank_type. */
function AlertRankCell({ alert: a, level }: { alert: BsrAlert; level: "top" | "sub" }) {
  const hasContext = a.top_title != null || a.sub_title != null;
  const isSubject =
    level === "top" ? a.rank_type === "display_group" : a.rank_type === "classification";
  const title = level === "top" ? a.top_title : a.sub_title;
  let oldRank = level === "top" ? a.top_old_rank : a.sub_old_rank;
  let newRank = level === "top" ? a.top_new_rank : a.sub_new_rank;
  if (!hasContext) {
    if (!isSubject) return <td className="px-3 py-2 text-right text-muted-foreground">—</td>;
    oldRank = a.old_rank;
    newRank = a.new_rank;
  }

  return (
    <td className="px-3 py-2 text-right whitespace-nowrap tabular-nums">
      {rankText(oldRank)} → <span className={cn(isSubject && "font-medium")}>{rankText(newRank)}</span>
      {title && <div className="max-w-40 truncate text-xs text-muted-foreground ml-auto">{title}</div>}
      {isSubject && a.kind === "rank_drop" && a.pct_change != null && (
        <div className="text-xs text-destructive">{a.pct_change.toFixed(0)}% worse</div>
      )}
    </td>
  );
}

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
    <Card className={cn(tone === "bad" && "border-destructive/50", tone === "warn" && "border-amber-500/50")}>
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
  sortKey,
  sortDesc,
  toggleSort,
}: {
  label: string;
  k: SortKey;
  sortKey: SortKey;
  sortDesc: boolean;
  toggleSort: (k: SortKey) => void;
}) {
  const active = sortKey === k;
  return (
    <th className="px-3 py-2 text-left font-medium">
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

/** Rank movement vs the previous snapshot. Positive delta = moved up (better). */
function Delta({ delta }: { delta: number | null }) {
  if (delta == null || delta === 0) return null;
  const up = delta > 0;
  return (
    <span className={cn("text-xs tabular-nums", up ? "text-emerald-600" : "text-destructive")}>
      {up ? "▲" : "▼"}
      {Math.abs(delta).toLocaleString()}
    </span>
  );
}

const rankChartConfig = {
  rank: { label: "Rank", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

function AsinDetail({ asin, onError }: { asin: string; onError: (e: string) => void }) {
  const [history, setHistory] = useState<AsinBsrHistory | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAsinBsrHistory(asin).then(({ data, error }) => {
      if (cancelled) return;
      if (error) onError(error);
      else setHistory(data);
    });
    return () => {
      cancelled = true;
    };
  }, [asin, onError]);

  // One small chart per category: top-level and subcategory ranks differ by
  // orders of magnitude, so they can't share a y-axis.
  const series = useMemo(() => {
    const byId = new Map<
      string,
      { title: string; topLevel: boolean; points: { date: string; rank: number }[]; lastRank: number }
    >();
    for (const s of history?.snapshots ?? []) {
      if (s.rank_type === "none" || s.rank == null) continue;
      const entry = byId.get(s.classification_id) ?? {
        title: s.title ?? s.classification_id,
        topLevel: s.rank_type === "display_group",
        points: [],
        lastRank: s.rank,
      };
      entry.title = s.title ?? entry.title;
      entry.points.push({ date: s.snapshot_date.slice(5), rank: s.rank });
      entry.lastRank = s.rank;
      byId.set(s.classification_id, entry);
    }
    return [...byId.entries()]
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => Number(b.topLevel) - Number(a.topLevel) || a.lastRank - b.lastRank);
  }, [history]);

  const categoryHistory = useMemo(() => {
    const snaps = history?.snapshots ?? [];
    const dates = [...new Set(snaps.map((s) => s.snapshot_date))];
    const out: { date: string; text: string }[] = [];
    for (let i = 1; i < dates.length; i++) {
      const before = snaps.filter((s) => s.snapshot_date === dates[i - 1] && s.rank_type !== "none");
      const after = snaps.filter((s) => s.snapshot_date === dates[i] && s.rank_type !== "none");
      const beforeIds = new Set(before.map((s) => s.classification_id));
      const afterIds = new Set(after.map((s) => s.classification_id));
      const added = after.filter((s) => !beforeIds.has(s.classification_id)).map((s) => s.title);
      const removed = before.filter((s) => !afterIds.has(s.classification_id)).map((s) => s.title);
      if (added.length || removed.length) {
        out.push({
          date: dates[i],
          text: [
            removed.length ? `Removed from ${removed.join(", ")}` : null,
            added.length ? `Added to ${added.join(", ")}` : null,
          ]
            .filter(Boolean)
            .join(" · "),
        });
      }
    }
    return out.reverse();
  }, [history]);

  if (!history) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Rank, last {HISTORY_DAYS} days (higher on the chart = better)
        </p>
        {series.length === 0 ? (
          <p className="text-sm text-muted-foreground">No ranks recorded in this window.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {series.map((s) => (
              <div key={s.id} className="rounded-md border border-border bg-background p-3">
                <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                  <span className="truncate font-medium">
                    {s.title}
                    {s.topLevel && <span className="ml-1 text-xs text-muted-foreground">(top-level)</span>}
                  </span>
                  <span className="tabular-nums">{rankText(s.lastRank)}</span>
                </div>
                {s.points.length < 2 ? (
                  <p className="py-6 text-center text-xs text-muted-foreground">Not enough history yet.</p>
                ) : (
                  <ChartContainer config={rankChartConfig} className="h-36 w-full">
                    <LineChart data={s.points}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={24} />
                      <YAxis
                        reversed
                        tickLine={false}
                        axisLine={false}
                        width={56}
                        domain={["auto", "auto"]}
                        allowDecimals={false}
                        tickFormatter={(v: number) => `#${v.toLocaleString()}`}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line dataKey="rank" type="monotone" stroke="var(--color-rank)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ChartContainer>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Category changes
          </p>
          {categoryHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No category changes in this window.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {categoryHistory.map((c) => (
                <li key={c.date}>
                  <span className="text-muted-foreground tabular-nums">{c.date}</span> · {c.text}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Alerts</p>
          {history.alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No alerts for this ASIN.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {history.alerts.map((a) => (
                <li key={a.id}>
                  <span className="text-muted-foreground tabular-nums">{a.detected_date}</span> ·{" "}
                  {BSR_ALERT_KIND_LABELS[a.kind]}
                  {a.category_title && ` · ${a.category_title}`} · {rankText(a.old_rank)} → {rankText(a.new_rank)}{" "}
                  <Badge variant="outline">{ALERT_STATUS_LABELS[a.status]}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <a
        href={`https://www.amazon.com/dp/${asin}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
      >
        View on Amazon <ExternalLink className="size-3" />
      </a>
    </div>
  );
}

function CaseRaisedDialog({
  alert,
  onClose,
  onSaved,
}: {
  alert: BsrAlert | null;
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
      const { error } = await updateBsrAlertStatus(alert.id, "case_raised", caseId, notes);
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
          <DialogTitle>Case raised · {alert?.asin}</DialogTitle>
          <DialogDescription>
            Record the Seller Central case asking Amazon to restore this ASIN&apos;s category or
            investigate the rank change.
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
