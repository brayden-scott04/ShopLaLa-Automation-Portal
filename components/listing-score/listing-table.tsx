"use client";

import { AlertTriangle, Check, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BULLET_TARGET_COUNT,
  LISTING_STATUS_LABELS,
  TITLE_TARGET,
  imageTarget,
  limitsOf,
  scoreBand,
  type ListingNotes,
  type ListingScore,
  type ListingSummary,
} from "@/lib/listing-score";
import { AmazonImg, BAND_TEXT } from "./parts";

export interface ListingTableRow {
  listing: ListingSummary;
  notes: ListingNotes | undefined;
  score: ListingScore;
  alertCount: number;
  /** 1-based position in the Master List; null if the SKU isn't on it any more. */
  masterPos: number | null;
}

function YesNo({ value }: { value: boolean | null | undefined }) {
  if (value === true) return <Check className="mx-auto size-4 text-emerald-600 dark:text-emerald-400" aria-label="Yes" />;
  if (value === false) return <X className="mx-auto size-4 text-red-600 dark:text-red-400" aria-label="No" />;
  return <Minus className="mx-auto size-4 text-muted-foreground" aria-label="Unknown" />;
}

function Count({ value }: { value: number | null | undefined }) {
  if (value === null || value === undefined) return <span className="text-muted-foreground">–</span>;
  return <span className={cn("tabular-nums", value === 0 && "text-red-600 dark:text-red-400")}>{value}</span>;
}

/** value / target, red when short (or, for the title, when over the 74-char cut-off). */
function Ratio({ value, target, bad }: { value: number; target: number; bad: boolean }) {
  return (
    <span className={cn("tabular-nums", bad ? "text-red-600 dark:text-red-400" : value >= target && "text-emerald-600 dark:text-emerald-400")}>
      {value}
      <span className="text-muted-foreground">/{target}</span>
    </span>
  );
}

const TH = "px-3 py-2 text-left text-[11px] font-semibold tracking-wide text-muted-foreground uppercase whitespace-nowrap";
const TD = "px-3 py-2 whitespace-nowrap";

export function ListingTable({ rows, onOpen }: { rows: ListingTableRow[]; onOpen: (sku: string) => void }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 border-b bg-muted/60 backdrop-blur">
          <tr>
            <th className={cn(TH, "text-right")}>#</th>
            <th className={TH}>SKU</th>
            <th className={TH}>Status</th>
            <th className={cn(TH, "text-right")}>Score</th>
            <th className={cn(TH, "text-right")} title="Amazon displays / expected for this SKU">Images</th>
            <th className={cn(TH, "text-right")} title="Images we uploaded">Submitted</th>
            <th className={cn(TH, "text-center")}>Videos</th>
            <th className={cn(TH, "text-center")}>Related</th>
            <th className={cn(TH, "text-center")}>A+</th>
            <th className={cn(TH, "text-center")}>Brand Story</th>
            <th className={cn(TH, "text-right")}>Title</th>
            <th className={cn(TH, "text-right")}>Highlight</th>
            <th className={cn(TH, "text-right")}>Bullets</th>
            <th className={cn(TH, "text-center")}>Alerts</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map(({ listing: l, notes, score, alertCount, masterPos }) => {
            const limits = limitsOf(l.limits);
            const titleLen = l.title_len ?? 0;
            const titleOver = titleLen > TITLE_TARGET;
            const imgTarget = imageTarget(notes);
            const band = score.total !== null ? scoreBand(score.total) : null;
            return (
              <tr
                key={l.sku}
                onClick={() => onOpen(l.sku)}
                className={cn("cursor-pointer transition-colors hover:bg-muted/50", l.listing_status === "not_listed" && "opacity-60")}
              >
                <td className={cn(TD, "text-right text-xs text-muted-foreground tabular-nums")}>{masterPos ?? "–"}</td>
                <td className={TD}>
                  <div className="flex items-center gap-2.5">
                    <AmazonImg src={l.main_thumb} alt={l.sku} className="size-9 shrink-0 rounded border bg-white p-0.5" />
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-semibold">{l.sku}</p>
                      <p className="text-[11px] text-muted-foreground">{l.asin ?? "No ASIN"}</p>
                    </div>
                  </div>
                </td>
                <td className={cn(TD, "text-xs")}>
                  <span className={cn(l.listing_status !== "active" && "text-amber-700 dark:text-amber-400")}>
                    {LISTING_STATUS_LABELS[l.listing_status]}
                  </span>
                </td>
                <td className={cn(TD, "text-right font-semibold tabular-nums", band ? BAND_TEXT[band] : "text-muted-foreground")}>
                  {score.total ?? "–"}
                </td>
                <td className={cn(TD, "text-right")}>
                  <Ratio value={l.image_count} target={imgTarget} bad={l.image_count < imgTarget} />
                </td>
                <td
                  className={cn(
                    TD,
                    "text-right tabular-nums",
                    l.submitted_image_count !== null && l.submitted_image_count !== l.image_count
                      ? "text-amber-700 dark:text-amber-400"
                      : "text-muted-foreground"
                  )}
                >
                  {l.submitted_image_count ?? "–"}
                </td>
                <td className={cn(TD, "text-center")}>
                  <Count value={notes?.videos} />
                </td>
                <td className={cn(TD, "text-center")}>
                  <Count value={notes?.related_videos} />
                </td>
                <td className={TD}>
                  <YesNo value={l.aplus} />
                </td>
                <td className={TD}>
                  <YesNo value={l.brand_story} />
                </td>
                <td className={cn(TD, "text-right")}>
                  <Ratio value={titleLen} target={TITLE_TARGET} bad={titleOver} />
                </td>
                <td className={cn(TD, "text-right")}>
                  {titleOver ? (
                    <span className="text-xs text-red-600 dark:text-red-400">Hidden</span>
                  ) : (
                    <Ratio value={l.highlight_len ?? 0} target={limits.highlight} bad={false} />
                  )}
                </td>
                <td className={cn(TD, "text-right")}>
                  <Ratio
                    value={l.bullet_lengths.length}
                    target={BULLET_TARGET_COUNT}
                    bad={l.bullet_lengths.length < BULLET_TARGET_COUNT}
                  />
                </td>
                <td className={cn(TD, "text-center")}>
                  {alertCount > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                      <AlertTriangle className="size-3.5" />
                      {alertCount}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">–</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
