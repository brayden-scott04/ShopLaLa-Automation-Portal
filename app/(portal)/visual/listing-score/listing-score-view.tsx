"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { AlertTriangle, ArrowDownUp, Search, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import type { AlertStatus } from "@/lib/fba-fee-tracker-constants";
import {
  getListingScoreOverview,
  updateListingAlertStatus,
  type ListingScoreOverview,
} from "@/lib/actions/listing-score";
import {
  BULLET_TARGET_COUNT,
  IMAGE_TARGET,
  LISTING_ALERT_SEVERITY,
  SCORE_BAND_LABELS,
  TITLE_TARGET,
  scoreBand,
  scoreListing,
  type ListingAlert,
  type ListingNotes,
  type ListingScore,
  type ListingSummary,
  type ScoreBand,
} from "@/lib/listing-score";
import { ListingCard } from "@/components/listing-score/listing-card";
import { ListingSheet } from "@/components/listing-score/listing-sheet";
import { AlertActions, AlertChange, AlertHeading, SEVERITY_STYLES } from "@/components/listing-score/alert-change";
import { BAND_BG, BAND_TEXT, ScoreRing, relativeTime } from "@/components/listing-score/parts";

/** Page access (assertItemAccess in layout.tsx) is the edit permission; the actions re-check it. */
const CAN_EDIT = true;
const PAGE = 48;
const FEED_PREVIEW = 6;

type Filter =
  | "all"
  | "alerts"
  | ScoreBand
  | "titleOver"
  | "shortTitle"
  | "highlight"
  | "bullets"
  | "images"
  | "noAplus"
  | "noBrandStory"
  | "noVideo"
  | "issues"
  | "mismatch"
  | "notListed";

type SortKey = "score_asc" | "score_desc" | "sku" | "alerts" | "launch";

interface Row {
  listing: ListingSummary;
  notes: ListingNotes | undefined;
  score: ListingScore;
  alerts: ListingAlert[];
}

const OPPORTUNITIES: { key: Filter; label: string; test: (r: Row) => boolean }[] = [
  { key: "titleOver", label: "Title hides highlight (75+)", test: (r) => (r.listing.title_len ?? 0) > TITLE_TARGET },
  {
    key: "shortTitle",
    label: `Title under ${TITLE_TARGET - 9} chars`,
    test: (r) => (r.listing.title_len ?? 0) < TITLE_TARGET - 9,
  },
  {
    key: "highlight",
    label: "Highlight not maxed",
    test: (r) =>
      (r.listing.title_len ?? 0) <= TITLE_TARGET && (r.listing.highlight_len ?? 0) < (r.listing.limits.highlight ?? 125),
  },
  { key: "bullets", label: `Under ${BULLET_TARGET_COUNT} bullets`, test: (r) => r.listing.bullet_lengths.length < BULLET_TARGET_COUNT },
  { key: "images", label: `Under ${IMAGE_TARGET} images`, test: (r) => r.listing.image_count < IMAGE_TARGET },
  { key: "noAplus", label: "No A+", test: (r) => r.listing.aplus === false },
  { key: "noBrandStory", label: "No Brand Story", test: (r) => r.listing.brand_story === false },
  { key: "noVideo", label: "Video not entered / none", test: (r) => !r.notes?.videos },
  { key: "mismatch", label: "Differs from submitted", test: (r) => Object.values(r.listing.mismatch ?? {}).some(Boolean) },
  { key: "issues", label: "Listing issues", test: (r) => r.listing.error_issues > 0 },
  { key: "notListed", label: "Not listed", test: (r) => r.listing.listing_status === "not_listed" },
];

const BANDS: ScoreBand[] = ["excellent", "good", "fair", "poor"];

export default function ListingScoreView() {
  const [overview, setOverview] = useState<ListingScoreOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("score_asc");
  const [shown, setShown] = useState(PAGE);
  const [feedOpen, setFeedOpen] = useState(false);
  const [openSku, setOpenSku] = useState<string | null>(null);
  const [caseAlert, setCaseAlert] = useState<ListingAlert | null>(null);
  const [alertsVersion, setAlertsVersion] = useState(0);

  useEffect(() => {
    getListingScoreOverview().then(({ data, error }) => {
      if (error) setError(error);
      else setOverview(data);
      setIsLoading(false);
    });
  }, []);

  const rows = useMemo<Row[]>(() => {
    if (!overview) return [];
    const notesBySku = new Map(overview.notes.map((n) => [n.sku, n]));
    const alertsBySku = new Map<string, ListingAlert[]>();
    for (const a of overview.alerts) {
      const list = alertsBySku.get(a.sku) ?? [];
      list.push(a);
      alertsBySku.set(a.sku, list);
    }
    return overview.listings.map((listing) => {
      const notes = notesBySku.get(listing.sku);
      return { listing, notes, score: scoreListing(listing, notes), alerts: alertsBySku.get(listing.sku) ?? [] };
    });
  }, [overview]);

  const scored = useMemo(() => rows.filter((r) => r.score.total !== null), [rows]);

  const stats = useMemo(() => {
    const bands: Record<ScoreBand, number> = { excellent: 0, good: 0, fair: 0, poor: 0 };
    for (const r of scored) bands[scoreBand(r.score.total!)]++;
    const avg = scored.length ? Math.round(scored.reduce((s, r) => s + r.score.total!, 0) / scored.length) : null;
    return {
      avg,
      bands,
      openAlerts: overview?.alerts.filter((a) => a.status === "open").length ?? 0,
      caseRaised: overview?.alerts.filter((a) => a.status === "case_raised").length ?? 0,
      urgent: overview?.alerts.filter((a) => a.status === "open" && LISTING_ALERT_SEVERITY[a.kind] === 2).length ?? 0,
    };
  }, [scored, overview]);

  const opportunityCounts = useMemo(
    () => Object.fromEntries(OPPORTUNITIES.map((o) => [o.key, rows.filter(o.test).length])) as Record<string, number>,
    [rows]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const opp = OPPORTUNITIES.find((o) => o.key === filter);
    const filtered = rows.filter((r) => {
      if (filter === "alerts" && r.alerts.length === 0) return false;
      if ((BANDS as string[]).includes(filter) && (r.score.total === null || scoreBand(r.score.total) !== filter)) return false;
      if (opp && !opp.test(r)) return false;
      if (!q) return true;
      return (
        r.listing.sku.toLowerCase().includes(q) ||
        (r.listing.asin ?? "").toLowerCase().includes(q) ||
        (r.listing.title ?? "").toLowerCase().includes(q) ||
        (r.notes?.launch_by ?? "").toLowerCase().includes(q) ||
        (r.notes?.comment ?? "").toLowerCase().includes(q)
      );
    });
    const score = (r: Row) => r.score.total ?? 1000; // unscored (not listed) last when worst-first
    return [...filtered].sort((a, b) => {
      switch (sortKey) {
        case "score_asc":
          return score(a) - score(b) || a.listing.sku.localeCompare(b.listing.sku);
        case "score_desc":
          return (b.score.total ?? -1) - (a.score.total ?? -1) || a.listing.sku.localeCompare(b.listing.sku);
        case "alerts":
          return b.alerts.length - a.alerts.length || score(a) - score(b);
        case "launch":
          return (b.notes?.launch_date ?? "").localeCompare(a.notes?.launch_date ?? "") || a.listing.sku.localeCompare(b.listing.sku);
        case "sku":
          return a.listing.sku.localeCompare(b.listing.sku);
      }
    });
  }, [rows, query, filter, sortKey]);

  const feed = useMemo(
    () =>
      [...(overview?.alerts ?? [])].sort(
        (a, b) =>
          Number(a.status !== "open") - Number(b.status !== "open") ||
          LISTING_ALERT_SEVERITY[b.kind] - LISTING_ALERT_SEVERITY[a.kind] ||
          b.detected_date.localeCompare(a.detected_date) ||
          a.sku.localeCompare(b.sku)
      ),
    [overview]
  );

  function pickFilter(f: Filter) {
    setFilter((cur) => (cur === f ? "all" : f));
    setShown(PAGE);
  }

  function applyAlert(updated: ListingAlert) {
    setOverview((o) =>
      o && {
        ...o,
        alerts:
          updated.status === "open" || updated.status === "case_raised"
            ? o.alerts.map((a) => (a.id === updated.id ? updated : a))
            : o.alerts.filter((a) => a.id !== updated.id),
      }
    );
    setAlertsVersion((v) => v + 1);
  }

  async function setAlertStatus(alert: ListingAlert, status: AlertStatus): Promise<boolean> {
    const { data, error } = await updateListingAlertStatus(alert.id, status);
    if (error || !data) {
      setError(error ?? "Could not update the alert");
      return false;
    }
    applyAlert(data);
    return true;
  }

  function saveNotes(n: ListingNotes) {
    setOverview((o) => o && { ...o, notes: [...o.notes.filter((x) => x.sku !== n.sku), n] });
  }

  const openRow = openSku ? rows.find((r) => r.listing.sku === openSku) ?? null : null;
  const lastOk = overview?.lastSuccessfulRun;
  const lastRunFailed = overview?.lastRun?.status === "error";

  return (
    <div className="space-y-6 px-6 pb-6 md:px-8 md:pb-8">
      {error && (
        <div className="flex items-start justify-between gap-3 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
          <button onClick={() => setError(null)} aria-label="Dismiss">
            <X className="size-4" />
          </button>
        </div>
      )}

      {isLoading ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        </>
      ) : !overview || overview.listings.length === 0 ? (
        <Card>
          <CardContent>
            <p className="py-10 text-center text-sm text-muted-foreground">
              No listings checked yet. The daily sync (06:00 SGT) reads every NA SKU in the Master List from
              Amazon. Scores appear here after its first run, and change alerts from the second day on.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {lastRunFailed && (
            <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
              The latest sync failed ({relativeTime(overview.lastRun?.created_at)}). Listings show their last
              successful check. {overview.lastRun?.error}
            </div>
          )}

          {/* ── Overview ─────────────────────────────────────────────── */}
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <Card className="overflow-hidden">
              <CardContent className="flex items-center gap-5">
                <ScoreRing score={stats.avg} size={96} stroke={8} />
                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Average score</p>
                    <p className="text-sm text-muted-foreground">
                      {scored.length.toLocaleString()} listings scored
                      {rows.length > scored.length ? ` · ${rows.length - scored.length} not listed` : ""}
                    </p>
                  </div>
                  <div className="flex h-2.5 overflow-hidden rounded-full bg-muted">
                    {BANDS.map((b) =>
                      stats.bands[b] ? (
                        <button
                          key={b}
                          type="button"
                          onClick={() => pickFilter(b)}
                          title={`${SCORE_BAND_LABELS[b]}: ${stats.bands[b]}`}
                          className={cn(BAND_BG[b], "h-full transition-opacity hover:opacity-80", filter !== "all" && filter !== b && "opacity-30")}
                          style={{ width: `${(stats.bands[b] / scored.length) * 100}%` }}
                        />
                      ) : null
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {BANDS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => pickFilter(b)}
                        className={cn(
                          "inline-flex items-center gap-1.5 text-xs transition-opacity",
                          filter !== "all" && filter !== b && "opacity-50"
                        )}
                      >
                        <span className={cn("size-2 rounded-full", BAND_BG[b])} />
                        <span className="text-muted-foreground">{SCORE_BAND_LABELS[b]}</span>
                        <span className={cn("font-semibold tabular-nums", BAND_TEXT[b])}>{stats.bands[b]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <button type="button" onClick={() => pickFilter("alerts")} className="text-left">
              <Card className={cn("h-full transition hover:border-primary/40", stats.openAlerts > 0 && "border-red-500/40", filter === "alerts" && "ring-2 ring-primary/40")}>
                <CardContent className="space-y-1">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Open alerts</p>
                  <p className={cn("text-3xl font-semibold tabular-nums", stats.openAlerts > 0 && "text-red-600 dark:text-red-400")}>
                    {stats.openAlerts.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stats.urgent} urgent · {stats.caseRaised} with a case raised
                  </p>
                </CardContent>
              </Card>
            </button>

            <Card className={cn(lastOk?.skus_failed && "border-amber-500/50")}>
              <CardContent className="space-y-1">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Last checked</p>
                <p className="text-3xl font-semibold">{relativeTime(lastOk?.created_at)}</p>
                <p className="text-xs text-muted-foreground">
                  Daily at 06:00 SGT
                  {lastOk?.skus_failed ? ` · ${lastOk.skus_failed} SKUs failed to fetch` : ""}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* ── Opportunities ─────────────────────────────────────────── */}
          <div className="flex flex-wrap gap-2">
            {OPPORTUNITIES.filter((o) => opportunityCounts[o.key] > 0).map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => pickFilter(o.key)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs transition hover:border-primary/40",
                  filter === o.key && "border-primary bg-primary text-primary-foreground hover:border-primary"
                )}
              >
                {o.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 font-semibold tabular-nums",
                    filter === o.key ? "bg-primary-foreground/20" : "bg-muted"
                  )}
                >
                  {opportunityCounts[o.key]}
                </span>
              </button>
            ))}
          </div>

          {/* ── Alerts feed ───────────────────────────────────────────── */}
          {feed.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-red-500" />
                  Changes to review
                </CardTitle>
                <CardDescription>
                  What Amazon changed since the previous check, and where the live page no longer matches what we submitted.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {(feedOpen ? feed : feed.slice(0, FEED_PREVIEW)).map((a) => (
                    <div
                      key={a.id}
                      className={cn(
                        "flex flex-col gap-2.5 rounded-lg border border-l-4 bg-card p-3",
                        SEVERITY_STYLES[LISTING_ALERT_SEVERITY[a.kind]].border
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <AlertHeading alert={a} />
                          <button
                            type="button"
                            onClick={() => setOpenSku(a.sku)}
                            className="mt-0.5 truncate font-mono text-xs text-primary hover:underline"
                          >
                            {a.sku}
                          </button>
                        </div>
                        <span className="shrink-0 text-[11px] text-muted-foreground">{a.detected_date}</span>
                      </div>
                      <div className="flex-1">
                        <AlertChange alert={a} compact />
                      </div>
                      <AlertActions
                        alert={a}
                        canEdit={CAN_EDIT}
                        pending={pending}
                        onStatus={(s) => startTransition(async () => void (await setAlertStatus(a, s)))}
                        onCase={() => setCaseAlert(a)}
                      />
                    </div>
                  ))}
                </div>
                {feed.length > FEED_PREVIEW && (
                  <div className="mt-3 flex justify-center">
                    <Button variant="outline" size="sm" onClick={() => setFeedOpen((v) => !v)}>
                      {feedOpen ? "Show fewer" : `Show all ${feed.length} alerts`}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* ── Listings ──────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShown(PAGE);
                  }}
                  placeholder="Search SKU, ASIN, title, launch by or comment"
                  className="h-9 w-full rounded-md border border-input bg-background pr-3 pl-9 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <ArrowDownUp className="size-4 text-muted-foreground" />
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="h-9 rounded-md border border-input bg-background px-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                >
                  <option value="score_asc">Lowest score first</option>
                  <option value="score_desc">Highest score first</option>
                  <option value="alerts">Most alerts</option>
                  <option value="launch">Newest launch</option>
                  <option value="sku">SKU A–Z</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {visible.length.toLocaleString()} of {rows.length.toLocaleString()} listings
              </span>
              {filter !== "all" && (
                <button type="button" onClick={() => pickFilter("all")} className="inline-flex items-center gap-1 hover:text-foreground">
                  <X className="size-3" /> Clear filter
                </button>
              )}
            </div>

            {visible.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">No listings match.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {visible.slice(0, shown).map((r) => (
                  <ListingCard
                    key={r.listing.sku}
                    listing={r.listing}
                    notes={r.notes}
                    score={r.score}
                    alertCount={r.alerts.length}
                    onOpen={() => setOpenSku(r.listing.sku)}
                  />
                ))}
              </div>
            )}

            {visible.length > shown && (
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => setShown((n) => n + PAGE)}>
                  Show more ({(visible.length - shown).toLocaleString()} left)
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      <ListingSheet
        summary={openRow?.listing ?? null}
        notes={openRow?.notes}
        score={openRow?.score ?? null}
        staff={overview?.staff ?? []}
        canEdit={CAN_EDIT}
        onClose={() => setOpenSku(null)}
        onNotesSaved={saveNotes}
        onAlertStatus={setAlertStatus}
        onCase={setCaseAlert}
        alertsVersion={alertsVersion}
      />

      <CaseRaisedDialog alert={caseAlert} onClose={() => setCaseAlert(null)} onSaved={(a) => {
        applyAlert(a);
        setCaseAlert(null);
      }} />
    </div>
  );
}

function CaseRaisedDialog({
  alert,
  onClose,
  onSaved,
}: {
  alert: ListingAlert | null;
  onClose: () => void;
  onSaved: (alert: ListingAlert) => void;
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
      const { data, error } = await updateListingAlertStatus(alert.id, "case_raised", caseId, notes);
      if (error || !data) setError(error ?? "Could not save");
      else onSaved(data);
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
            Record the Seller Central case asking Amazon to restore this listing&apos;s content.
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
