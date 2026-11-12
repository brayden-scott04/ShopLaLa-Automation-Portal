"use client";

import { ArrowRight, Ban, CheckCircle2, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ALERT_STATUS_LABELS, type AlertStatus } from "@/lib/fba-fee-tracker-constants";
import {
  LISTING_ALERT_KIND_LABELS,
  LISTING_ALERT_SEVERITY,
  LISTING_STATUS_LABELS,
  isMismatchKind,
  type ListingAlert,
  type ListingImage,
  type ListingIssue,
  type ListingStatus,
} from "@/lib/listing-score";
import { AmazonImg } from "./parts";

// Same rule as _norm() in the worker: whitespace- and case-insensitive.
const norm = (s: unknown) => (typeof s === "string" ? s.split(/\s+/).filter(Boolean).join(" ").toLowerCase() : "");
const imageId = (url: string | undefined) => url?.split("/").pop()?.split(".")[0] ?? "";

function asStrings(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}
function asImages(v: unknown): ListingImage[] {
  return Array.isArray(v) ? (v as ListingImage[]).filter((x) => x && typeof x.url === "string") : [];
}

export const SEVERITY_STYLES = {
  2: { dot: "bg-red-500", border: "border-l-red-500" },
  1: { dot: "bg-amber-500", border: "border-l-amber-500" },
  0: { dot: "bg-sky-500", border: "border-l-sky-500" },
} as const;

function TextPair({ before, after, labels, compact }: { before: string | null; after: string | null; labels: [string, string]; compact?: boolean }) {
  return (
    <div className="grid gap-1.5">
      {[
        { label: labels[0], text: before, cls: "bg-red-500/5 border-red-500/20" },
        { label: labels[1], text: after, cls: "bg-emerald-500/5 border-emerald-500/20" },
      ].map((row) => (
        <div key={row.label} className={cn("rounded-md border px-2.5 py-1.5", row.cls)}>
          <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            {row.label}
            {row.text ? ` · ${row.text.length} chars` : ""}
          </p>
          <p className={cn("text-xs leading-snug", compact && "line-clamp-2", !row.text && "text-muted-foreground italic")}>
            {row.text || "(none)"}
          </p>
        </div>
      ))}
    </div>
  );
}

function BulletDiff({ before, after, labels, compact }: { before: string[]; after: string[]; labels: [string, string]; compact?: boolean }) {
  const n = Math.max(before.length, after.length);
  const changed = Array.from({ length: n }, (_, i) => i).filter((i) => norm(before[i]) !== norm(after[i]));
  const shown = compact ? changed.slice(0, 1) : changed;
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        {before.length} → {after.length} bullets · {changed.length} changed
      </p>
      {shown.map((i) => (
        <div key={i} className="space-y-1">
          <p className="text-[11px] font-medium">Bullet {i + 1}</p>
          <TextPair before={before[i] ?? null} after={after[i] ?? null} labels={labels} compact={compact} />
        </div>
      ))}
      {compact && changed.length > 1 && (
        <p className="text-[11px] text-muted-foreground">+{changed.length - 1} more, open the listing to see all</p>
      )}
    </div>
  );
}

function ImageRow({ label, images, other }: { label: string; images: ListingImage[]; other: ListingImage[] }) {
  const otherIds = other.map((i) => imageId(i.url));
  return (
    <div>
      <p className="mb-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {images.length === 0 && <span className="text-xs text-muted-foreground italic">(none)</span>}
        {images.map((img, i) => {
          const id = imageId(img.url);
          const moved = otherIds[i] !== id;
          const isNew = !otherIds.includes(id);
          return (
            <div key={`${img.slot}-${id}`} className="relative">
              <AmazonImg
                src={img.thumb ?? img.url}
                alt={img.slot}
                className={cn(
                  "size-12 rounded border bg-white p-0.5",
                  isNew ? "ring-2 ring-red-500" : moved && "ring-2 ring-amber-400"
                )}
              />
              <span className="absolute right-0 bottom-0 rounded-tl bg-zinc-900/75 px-1 text-[9px] text-white">
                {img.slot === "MAIN" ? "M" : img.slot.slice(-1)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** The before/after of one alert. For *_mismatch kinds, "before" is ours and "after" is Amazon's. */
export function AlertChange({ alert: a, compact }: { alert: ListingAlert; compact?: boolean }) {
  const labels: [string, string] = isMismatchKind(a.kind) ? ["We submitted", "Amazon shows"] : ["Before", "Now"];

  switch (a.kind) {
    case "title_changed":
    case "highlight_changed":
    case "title_mismatch":
    case "highlight_mismatch":
      return (
        <TextPair
          before={typeof a.old_value === "string" ? a.old_value : null}
          after={typeof a.new_value === "string" ? a.new_value : null}
          labels={labels}
          compact={compact}
        />
      );
    case "bullets_changed":
    case "bullets_removed":
    case "bullets_mismatch":
      return <BulletDiff before={asStrings(a.old_value)} after={asStrings(a.new_value)} labels={labels} compact={compact} />;
    case "main_image_changed":
    case "images_changed":
    case "images_reordered":
    case "images_mismatch": {
      const before = asImages(a.old_value);
      const after = asImages(a.new_value);
      return (
        <div className="space-y-2">
          <ImageRow label={labels[0]} images={before} other={after} />
          <ImageRow label={labels[1]} images={after} other={before} />
          {!compact && (
            <p className="text-[11px] text-muted-foreground">
              Red ring = image not in the other row · amber = same image, different position.
            </p>
          )}
        </div>
      );
    }
    case "status_changed":
      return (
        <p className="flex items-center gap-2 text-sm">
          {LISTING_STATUS_LABELS[a.old_value as ListingStatus] ?? String(a.old_value)}
          <ArrowRight className="size-3.5 text-muted-foreground" />
          <span className="font-medium">{LISTING_STATUS_LABELS[a.new_value as ListingStatus] ?? String(a.new_value)}</span>
        </p>
      );
    case "listing_issue": {
      const issues = (Array.isArray(a.new_value) ? a.new_value : []) as ListingIssue[];
      return (
        <ul className="space-y-1 text-xs">
          {issues.slice(0, compact ? 1 : undefined).map((i, n) => (
            <li key={n} className={cn("rounded-md border border-red-500/20 bg-red-500/5 px-2.5 py-1.5", compact && "line-clamp-3")}>
              {i.attributes?.length ? <span className="font-medium">{i.attributes.join(", ")}: </span> : null}
              {i.message}
            </li>
          ))}
        </ul>
      );
    }
    case "aplus_removed":
    case "brand_story_removed":
      return <p className="text-sm text-muted-foreground">Amazon no longer reports it as published for this ASIN.</p>;
  }
}

export function AlertActions({
  alert: a,
  canEdit,
  pending,
  onStatus,
  onCase,
}: {
  alert: ListingAlert;
  canEdit: boolean;
  pending: boolean;
  onStatus: (status: AlertStatus) => void;
  onCase: () => void;
}) {
  if (!canEdit) return <span className="text-xs text-muted-foreground">{ALERT_STATUS_LABELS[a.status]}</span>;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {a.status === "case_raised" && (
        <span className="mr-1 text-xs text-muted-foreground">Case {a.case_id}</span>
      )}
      <Button size="xs" variant="outline" disabled={pending} onClick={() => onStatus("resolved")}>
        <CheckCircle2 /> Resolved
      </Button>
      {a.status !== "case_raised" && (
        <Button size="xs" variant="outline" disabled={pending} onClick={onCase}>
          <ClipboardList /> Case raised
        </Button>
      )}
      <Button size="xs" variant="ghost" disabled={pending} onClick={() => onStatus("dismissed")}>
        <Ban /> Dismiss
      </Button>
    </div>
  );
}

export function AlertHeading({ alert: a }: { alert: ListingAlert }) {
  const sev = SEVERITY_STYLES[LISTING_ALERT_SEVERITY[a.kind]];
  return (
    <div className="flex items-center gap-2">
      <span className={cn("size-2 shrink-0 rounded-full", sev.dot)} />
      <span className="text-sm font-medium">{LISTING_ALERT_KIND_LABELS[a.kind]}</span>
    </div>
  );
}
