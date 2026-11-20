"use client";

import { AlertTriangle, ArrowDown, ArrowUp, Check, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BULLET_TARGET_COUNT,
  LISTING_STATUS_LABELS,
  TITLE_TARGET,
  bulletMax,
  imageTarget,
  limitsOf,
  listedDate,
  scoreBand,
  type ListingNotes,
  type ListingScore,
  type ListingSort,
  type ListingSummary,
  type SortDir,
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

/**
 * "5/10": bullets used / bullets the product type allows. Red under the 5 the
 * score needs, amber when there's room for more, green when every slot is used.
 */
export function BulletRatio({ count, max }: { count: number; max: number }) {
  const tone =
    count < BULLET_TARGET_COUNT
      ? "text-red-600 dark:text-red-400"
      : count < max
        ? "text-amber-700 dark:text-amber-400"
        : "text-emerald-600 dark:text-emerald-400";
  return (
    <span
      className={cn("tabular-nums", tone)}
      title={count < max ? `${max - count} more bullet${max - count === 1 ? "" : "s"} allowed for this product type` : undefined}
    >
      {count}
      <span className="text-muted-foreground">/{max}</span>
    </span>
  );
}

const TH = "px-3 py-2 text-left text-[11px] font-semibold tracking-wide text-muted-foreground uppercase whitespace-nowrap";
const TD = "px-3 py-2 whitespace-nowrap";

type Align = "left" | "right" | "center";

interface SortState {
  key: ListingSort;
  dir: SortDir;
  onSort: (key: ListingSort) => void;
}

/** A clickable header: sorts by `field`, again to flip the direction. */
function Th({
  field,
  sort,
  align = "left",
  title,
  children,
}: {
  field: ListingSort;
  sort: SortState;
  align?: Align;
  title?: string;
  children: React.ReactNode;
}) {
  const active = sort.key === field;
  const Arrow = sort.dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <th
      className={cn(TH, align === "right" && "text-right", align === "center" && "text-center")}
      aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
    >
      <button
        type="button"
        onClick={() => sort.onSort(field)}
        title={title}
        className={cn(
          "inline-flex items-center gap-1 uppercase transition-colors hover:text-foreground",
          align === "right" && "flex-row-reverse",
          active && "text-foreground"
        )}
      >
        {children}
        <Arrow className={cn("size-3", active ? "opacity-100" : "opacity-0")} />
      </button>
    </th>
  );
}

export function ListingTable({
  rows,
  onOpen,
  sortKey,
  sortDir,
  onSort,
}: {
  rows: ListingTableRow[];
  onOpen: (sku: string) => void;
  sortKey: ListingSort;
  sortDir: SortDir;
  onSort: (key: ListingSort) => void;
}) {
  const sort: SortState = { key: sortKey, dir: sortDir, onSort };

  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 border-b bg-muted/60 backdrop-blur">
          <tr>
            <Th sort={sort} field="master" align="right" title="Master List order">#</Th>
            <Th sort={sort} field="sku">SKU</Th>
            <Th sort={sort} field="status">Status</Th>
            <Th sort={sort} field="score" align="right">Score</Th>
            <Th sort={sort} field="images" align="right" title="Amazon displays / expected for this SKU">Images</Th>
            <Th sort={sort} field="submitted" align="right" title="Images we uploaded">Submitted</Th>
            <Th sort={sort} field="videos" align="center">Videos</Th>
            <Th sort={sort} field="related" align="center">Related</Th>
            <Th sort={sort} field="aplus" align="center">A+</Th>
            <Th sort={sort} field="brand_story" align="center">Brand Story</Th>
            <Th sort={sort} field="title" align="right">Title</Th>
            <Th sort={sort} field="highlight" align="right">Highlight</Th>
            <Th sort={sort} field="bullets" align="right" title="Bullets used / bullets this product type allows">Bullets</Th>
            <Th sort={sort} field="alerts" align="center">Alerts</Th>
            <Th sort={sort} field="listed" align="right" title="When Amazon created the listing">Listed</Th>
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
                  <BulletRatio count={l.bullet_lengths.length} max={bulletMax(l)} />
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
                <td className={cn(TD, "text-right text-xs tabular-nums text-muted-foreground")}>
                  {listedDate(l.listed_at) ?? "–"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
