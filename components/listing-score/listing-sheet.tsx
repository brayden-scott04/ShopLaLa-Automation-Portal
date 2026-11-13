"use client";

import { useEffect, useState, useTransition } from "react";
import { AlertTriangle, ExternalLink, Save } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ALERT_STATUS_LABELS, type AlertStatus } from "@/lib/fba-fee-tracker-constants";
import { getListingDetail, saveListingNotes } from "@/lib/actions/listing-score";
import {
  BULLET_TARGET_COUNT,
  IMAGE_TARGET,
  imageTarget,
  LISTING_STATUS_LABELS,
  MAX_COMMENT_LENGTH,
  TITLE_TARGET,
  limitsOf,
  scoreBand,
  type ListingAlert,
  type ListingDetail,
  type ListingNotes,
  type ListingScore,
  type ListingSummary,
} from "@/lib/listing-score";
import { AlertActions, AlertChange, AlertHeading } from "./alert-change";
import { AmazonImg, BAND_BG, BAND_TEXT, CheckChip, ScoreRing } from "./parts";
import { SCORE_BAND_LABELS } from "@/lib/listing-score";

const inputCls =
  "w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-ring focus:outline-none disabled:opacity-60";

function Section({ title, aside, children }: { title: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="space-y-2.5 border-t px-5 py-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

function LengthBar({ len, target, over }: { len: number; target: number; over?: boolean }) {
  const pct = Math.min(100, (len / target) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", over ? "bg-red-500" : len >= target ? "bg-emerald-500" : "bg-primary/70")}
          style={{ width: `${over ? 100 : pct}%` }}
        />
      </div>
      <span className={cn("w-16 shrink-0 text-right text-[11px] tabular-nums", over ? "text-red-600" : "text-muted-foreground")}>
        {len} / {target}
      </span>
    </div>
  );
}

function MismatchNote({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="rounded-md border border-amber-500/30 bg-amber-500/5 px-2.5 py-1.5 text-xs">
      <p className="mb-0.5 font-medium text-amber-700 dark:text-amber-400">{label}</p>
      <p className="leading-snug">{value || <span className="italic text-muted-foreground">(none)</span>}</p>
    </div>
  );
}

export function ListingSheet({
  summary,
  notes,
  score,
  staff,
  canEdit,
  onClose,
  onNotesSaved,
  onAlertStatus,
  onCase,
  alertsVersion,
}: {
  summary: ListingSummary | null;
  notes: ListingNotes | undefined;
  score: ListingScore | null;
  staff: string[];
  canEdit: boolean;
  onClose: () => void;
  onNotesSaved: (notes: ListingNotes) => void;
  onAlertStatus: (alert: ListingAlert, status: AlertStatus) => Promise<boolean>;
  onCase: (alert: ListingAlert) => void;
  /** Bumped by the parent after an alert status change, to reload this sheet's alert list. */
  alertsVersion: number;
}) {
  const sku = summary?.sku ?? null;
  const [detail, setDetail] = useState<ListingDetail | null>(null);
  const [alerts, setAlerts] = useState<ListingAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Notes form
  const [comment, setComment] = useState("");
  const [launchBy, setLaunchBy] = useState("");
  const [launchDate, setLaunchDate] = useState("");
  const [videos, setVideos] = useState("");
  const [relatedVideos, setRelatedVideos] = useState("");
  const [expectedImages, setExpectedImages] = useState("");
  const [saved, setSaved] = useState(false);

  const [prevSku, setPrevSku] = useState<string | null>(null);
  if (sku !== prevSku) {
    setPrevSku(sku);
    setDetail(null);
    setAlerts([]);
    setError(null);
    setSaved(false);
    setLoading(!!sku);
    setComment(notes?.comment ?? "");
    setLaunchBy(notes?.launch_by ?? "");
    setLaunchDate(notes?.launch_date ?? "");
    setVideos(notes?.videos?.toString() ?? "");
    setRelatedVideos(notes?.related_videos?.toString() ?? "");
    setExpectedImages(notes?.expected_images?.toString() ?? "");
  }

  useEffect(() => {
    if (!sku) return;
    let cancelled = false;
    getListingDetail(sku).then(({ data, error }) => {
      if (cancelled) return;
      if (error) setError(error);
      else {
        setDetail(data?.listing ?? null);
        setAlerts(data?.alerts ?? []);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [sku, alertsVersion]);

  function parseCount(v: string): number | null {
    return v.trim() === "" ? null : Number(v);
  }

  function saveNotes() {
    if (!sku) return;
    setSaved(false);
    startTransition(async () => {
      const { data, error } = await saveListingNotes(sku, {
        comment,
        launchBy: launchBy || null,
        launchDate: launchDate || null,
        videos: parseCount(videos),
        relatedVideos: parseCount(relatedVideos),
        expectedImages: parseCount(expectedImages),
      });
      if (error) setError(error);
      else if (data) {
        setError(null);
        setSaved(true);
        onNotesSaved(data);
      }
    });
  }

  const limits = limitsOf(detail?.limits ?? summary?.limits);
  const titleLen = detail?.title?.length ?? 0;
  const titleOver = titleLen > TITLE_TARGET;
  const band = score?.total != null ? scoreBand(score.total) : null;

  return (
    <Sheet open={!!summary} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-2xl">
        {summary && (
          <>
            <SheetHeader className="flex-row items-start gap-4 p-5 pr-12">
              <AmazonImg src={summary.main_thumb} alt={summary.sku} className="size-24 shrink-0 rounded-lg border bg-white p-1.5" />
              <div className="min-w-0 flex-1 space-y-1">
                <SheetTitle className="font-mono text-base">{summary.sku}</SheetTitle>
                <SheetDescription className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  {summary.asin ? (
                    <a
                      href={`https://www.amazon.com/dp/${summary.asin}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      {summary.asin} <ExternalLink className="size-3" />
                    </a>
                  ) : (
                    <span>No ASIN</span>
                  )}
                  <span>{LISTING_STATUS_LABELS[summary.listing_status]}</span>
                  {detail?.product_type && <span>{detail.product_type}</span>}
                  <span>Checked {summary.checked_date}</span>
                </SheetDescription>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <CheckChip label="Video" value={notes?.videos == null ? null : notes.videos > 0} />
                  <CheckChip label="A+" value={summary.aplus} />
                  <CheckChip label="Brand Story" value={summary.brand_story} />
                </div>
              </div>
            </SheetHeader>

            {error && (
              <div className="mx-5 mb-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Score */}
            {score && (
              <Section title="Listing score">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex flex-col items-center gap-1">
                    <ScoreRing score={score.total} size={104} stroke={9} />
                    {band && <span className={cn("text-xs font-semibold", BAND_TEXT[band])}>{SCORE_BAND_LABELS[band]}</span>}
                  </div>
                  <div className="flex-1 space-y-2">
                    {score.parts.map((p) => (
                      <div key={p.key} className="grid grid-cols-[6.5rem_1fr_3rem] items-center gap-2 text-xs">
                        <span className="text-muted-foreground">{p.label}</span>
                        <div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn("h-full rounded-full", band ? BAND_BG[scoreBand((p.points / p.max) * 100)] : "bg-muted-foreground")}
                              style={{ width: `${(p.points / p.max) * 100}%` }}
                            />
                          </div>
                          {p.hint && <p className="mt-0.5 text-[11px] text-muted-foreground">{p.hint}</p>}
                        </div>
                        <span className="text-right font-medium tabular-nums">
                          {Math.round(p.points)}
                          <span className="text-muted-foreground">/{p.max}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>
            )}

            {/* Team notes */}
            <Section
              title="Team notes"
              aside={
                notes?.updated_by && (
                  <span className="text-[11px] text-muted-foreground">
                    Last edited by {notes.updated_by}
                    {notes.updated_at ? ` · ${notes.updated_at.slice(0, 10)}` : ""}
                  </span>
                )
              }
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Launch by</label>
                  <select value={launchBy} onChange={(e) => setLaunchBy(e.target.value)} disabled={!canEdit} className={inputCls}>
                    <option value="">Not set</option>
                    {staff.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Launch date</label>
                  <input type="date" value={launchDate} onChange={(e) => setLaunchDate(e.target.value)} disabled={!canEdit} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Videos for this product</label>
                  <input type="number" min={0} max={999} value={videos} onChange={(e) => setVideos(e.target.value)} disabled={!canEdit} placeholder="Not entered" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Related videos</label>
                  <input type="number" min={0} max={999} value={relatedVideos} onChange={(e) => setRelatedVideos(e.target.value)} disabled={!canEdit} placeholder="Not entered" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Expected images</label>
                  <input
                    type="number"
                    min={1}
                    max={IMAGE_TARGET}
                    value={expectedImages}
                    onChange={(e) => setExpectedImages(e.target.value)}
                    disabled={!canEdit}
                    placeholder={`${IMAGE_TARGET} (default)`}
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={!canEdit}
                    maxLength={MAX_COMMENT_LENGTH}
                    rows={3}
                    className={inputCls}
                  />
                </div>
              </div>
              {canEdit && (
                <div className="flex items-center justify-end gap-3">
                  {saved && <span className="text-xs text-emerald-600">Saved</span>}
                  <Button size="sm" onClick={saveNotes} disabled={pending}>
                    <Save /> {pending ? "Saving…" : "Save notes"}
                  </Button>
                </div>
              )}
            </Section>

            {loading ? (
              <div className="space-y-3 border-t px-5 py-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : detail ? (
              <>
                {detail.issues.length > 0 && (
                  <Section title={`Listing issues (${detail.issues.length})`}>
                    <ul className="space-y-1.5">
                      {detail.issues.map((i, n) => (
                        <li
                          key={n}
                          className={cn(
                            "rounded-md border px-2.5 py-1.5 text-xs",
                            i.severity === "ERROR" ? "border-red-500/25 bg-red-500/5" : "border-amber-500/25 bg-amber-500/5"
                          )}
                        >
                          <span className="font-medium">{i.severity}</span>
                          {i.attributes.length ? ` · ${i.attributes.join(", ")}` : ""}: {i.message}
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

                <Section title="Title">
                  <p className="text-sm leading-snug">{detail.title ?? <span className="italic text-muted-foreground">No title</span>}</p>
                  <LengthBar len={titleLen} target={TITLE_TARGET} over={titleOver} />
                  {titleOver && (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      Titles of 75+ characters hide the highlight line. The schema limit is {limits.title}, but {TITLE_TARGET} is the most that keeps it.
                    </p>
                  )}
                  {detail.mismatch.title && <MismatchNote label="We submitted a different title" value={detail.submitted?.title} />}
                </Section>

                <Section title="Highlight">
                  <p className={cn("text-sm leading-snug", titleOver && "text-muted-foreground line-through")}>
                    {detail.highlight ?? <span className="italic text-muted-foreground no-underline">No highlight</span>}
                  </p>
                  <LengthBar len={detail.highlight?.length ?? 0} target={limits.highlight} />
                  {detail.mismatch.highlight && <MismatchNote label="We submitted a different highlight" value={detail.submitted?.highlight} />}
                </Section>

                <Section title={`Bullet points (${detail.bullets.length} of ${BULLET_TARGET_COUNT})`}>
                  <ol className="space-y-3">
                    {detail.bullets.map((b, i) => (
                      <li key={i} className="space-y-1">
                        <p className="text-xs leading-relaxed">
                          <span className="mr-1.5 font-semibold text-muted-foreground">{i + 1}.</span>
                          {b}
                        </p>
                        <LengthBar len={b.length} target={limits.bullet} />
                      </li>
                    ))}
                  </ol>
                  {detail.mismatch.bullets && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                        Amazon is not showing the bullets we submitted:
                      </p>
                      {(detail.submitted?.bullets ?? []).map((b, i) => (
                        <MismatchNote key={i} label={`Submitted bullet ${i + 1}`} value={b} />
                      ))}
                    </div>
                  )}
                </Section>

                <Section
                  title={`Images (${detail.images.length} of ${imageTarget(notes)} expected)`}
                  aside={
                    detail.submitted?.images && (
                      <span className="text-[11px] text-muted-foreground">
                        We submitted {detail.submitted.images.length} · Amazon shows {detail.images.length}
                      </span>
                    )
                  }
                >
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {detail.images.map((img) => (
                      <a key={img.slot} href={img.url} target="_blank" rel="noreferrer" className="group relative">
                        <AmazonImg
                          src={img.thumb ?? img.url}
                          alt={img.slot}
                          className="aspect-square w-full rounded-md border bg-white p-1 transition group-hover:border-primary/50"
                        />
                        <span className="absolute bottom-1 left-1 rounded bg-zinc-900/70 px-1 text-[10px] text-white">
                          {img.slot === "MAIN" ? "Main" : img.slot}
                        </span>
                      </a>
                    ))}
                  </div>
                  {detail.mismatch.images && (
                    <div className="space-y-2 rounded-md border border-amber-500/30 bg-amber-500/5 p-2.5">
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                        The gallery doesn&apos;t match what we submitted. Amazon may have added, replaced or moved an image.
                      </p>
                      <AlertChange
                        alert={{
                          id: "mismatch",
                          sku: detail.sku,
                          asin: detail.asin,
                          detected_date: detail.checked_date,
                          kind: "images_mismatch",
                          old_value: detail.submitted?.images ?? [],
                          new_value: detail.images,
                          status: "open",
                          case_id: null,
                          notes: null,
                          updated_by: null,
                          updated_at: null,
                        }}
                      />
                    </div>
                  )}
                </Section>
              </>
            ) : (
              !error && (
                <p className="border-t px-5 py-6 text-sm text-muted-foreground">No content recorded for this SKU yet.</p>
              )
            )}

            <Section title={`Change history (${alerts.length})`}>
              {alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No changes detected since tracking started.</p>
              ) : (
                <ul className="space-y-3">
                  {alerts.map((a) => (
                    <li key={a.id} className="space-y-2 rounded-lg border p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <AlertHeading alert={a} />
                        <span className="text-[11px] text-muted-foreground">
                          {a.detected_date} · {ALERT_STATUS_LABELS[a.status]}
                          {a.updated_by ? ` by ${a.updated_by}` : ""}
                        </span>
                      </div>
                      <AlertChange alert={a} />
                      {(a.status === "open" || a.status === "case_raised") && (
                        <AlertActions
                          alert={a}
                          canEdit={canEdit}
                          pending={pending}
                          onStatus={(s) => startTransition(async () => void (await onAlertStatus(a, s)))}
                          onCase={() => onCase(a)}
                        />
                      )}
                      {a.notes && <p className="text-xs text-muted-foreground">Note: {a.notes}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            {summary.listing_status === "not_listed" && (
              <div className="mx-5 mb-5 flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                Amazon has no US listing for this SKU. Content above is the last version seen, if any.
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
