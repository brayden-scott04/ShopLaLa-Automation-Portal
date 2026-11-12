"use client";

import { AlertTriangle, CalendarDays, MessageSquare, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BULLET_TARGET_COUNT,
  IMAGE_TARGET,
  LISTING_STATUS_LABELS,
  TITLE_TARGET,
  limitsOf,
  type ListingNotes,
  type ListingScore,
  type ListingSummary,
} from "@/lib/listing-score";
import { AmazonImg, CheckChip, Meter, ScoreRing } from "./parts";

export function ListingCard({
  listing: l,
  notes,
  score,
  alertCount,
  onOpen,
}: {
  listing: ListingSummary;
  notes: ListingNotes | undefined;
  score: ListingScore;
  alertCount: number;
  onOpen: () => void;
}) {
  const limits = limitsOf(l.limits);
  const titleLen = l.title_len ?? 0;
  const titleOver = titleLen > TITLE_TARGET;
  const notListed = l.listing_status === "not_listed";

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border bg-card text-left shadow-xs transition",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        notListed && "opacity-70"
      )}
    >
      <div className="relative aspect-[4/3] border-b bg-white">
        <AmazonImg src={l.main_thumb} alt={l.sku} className="size-full p-3" />
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
          {l.listing_status !== "active" && (
            <span className="rounded-full bg-zinc-900/80 px-2 py-0.5 text-[10px] font-medium text-white">
              {LISTING_STATUS_LABELS[l.listing_status]}
            </span>
          )}
          {alertCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-medium text-white">
              <AlertTriangle className="size-3" />
              {alertCount} alert{alertCount === 1 ? "" : "s"}
            </span>
          )}
          {l.error_issues > 0 && (
            <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-medium text-white">
              {l.error_issues} listing issue{l.error_issues === 1 ? "" : "s"}
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2 rounded-full bg-background/95 p-0.5 shadow-sm">
          <ScoreRing score={score.total} size={48} stroke={4.5} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3.5">
        <div className="min-w-0">
          <p className="truncate font-mono text-sm font-semibold">{l.sku}</p>
          <p className="text-[11px] text-muted-foreground">{l.asin ?? "No ASIN"}</p>
          <p className="mt-1.5 line-clamp-2 min-h-[2lh] text-xs leading-snug text-muted-foreground">
            {l.title ?? "—"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          <Meter label="Title" value={titleLen} target={TITLE_TARGET} over={titleOver} />
          <Meter
            label={titleOver ? "Highlight (hidden)" : "Highlight"}
            value={l.highlight_len ?? 0}
            target={limits.highlight}
            over={titleOver && (l.highlight_len ?? 0) > 0}
          />
          <Meter label="Bullets" value={l.bullet_lengths.length} target={BULLET_TARGET_COUNT} />
          <Meter label="Images" value={l.image_count} target={IMAGE_TARGET} />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <CheckChip label="Video" value={notes?.videos == null ? null : notes.videos > 0} />
          <CheckChip label="A+" value={l.aplus} />
          <CheckChip label="Brand Story" value={l.brand_story} />
        </div>

        {(notes?.launch_by || notes?.launch_date || notes?.comment) && (
          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 border-t pt-2.5 text-[11px] text-muted-foreground">
            {notes.launch_by && (
              <span className="inline-flex items-center gap-1">
                <UserRound className="size-3" />
                {notes.launch_by}
              </span>
            )}
            {notes.launch_date && (
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="size-3" />
                {notes.launch_date}
              </span>
            )}
            {notes.comment && (
              <span className="inline-flex min-w-0 items-center gap-1">
                <MessageSquare className="size-3 shrink-0" />
                <span className="truncate">{notes.comment}</span>
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
