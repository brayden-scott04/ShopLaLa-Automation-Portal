"use client";

import { Check, ImageOff, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { scoreBand, type ScoreBand } from "@/lib/listing-score";

export const BAND_TEXT: Record<ScoreBand, string> = {
  excellent: "text-emerald-600 dark:text-emerald-400",
  good: "text-sky-600 dark:text-sky-400",
  fair: "text-amber-600 dark:text-amber-400",
  poor: "text-red-600 dark:text-red-400",
};

export const BAND_BG: Record<ScoreBand, string> = {
  excellent: "bg-emerald-500",
  good: "bg-sky-500",
  fair: "bg-amber-500",
  poor: "bg-red-500",
};

export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return "never";
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

/** Circular 0-100 gauge, coloured by score band. */
export function ScoreRing({
  score,
  size = 56,
  stroke = 5,
  className,
}: {
  score: number | null;
  size?: number;
  stroke?: number;
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const band = score === null ? null : scoreBand(score);
  return (
    <div
      className={cn("relative grid shrink-0 place-items-center", band ? BAND_TEXT[band] : "text-muted-foreground", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-muted" />
        {score !== null && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            stroke="currentColor"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - Math.max(0, Math.min(100, score)) / 100)}
            className="transition-[stroke-dashoffset] duration-500"
          />
        )}
      </svg>
      <span
        className="absolute font-semibold tabular-nums text-foreground"
        style={{ fontSize: Math.round(size * 0.3) }}
      >
        {score ?? "–"}
      </span>
    </div>
  );
}

/**
 * "67 / 74" with a thin bar. `over` marks a value past the target that costs
 * points (a title of 75+ hiding the highlight).
 */
export function Meter({
  label,
  value,
  target,
  over,
  suffix,
}: {
  label: string;
  value: number;
  target: number;
  over?: boolean;
  suffix?: string;
}) {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  const full = !over && value >= target;
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-1 text-[11px]">
        <span className="truncate text-muted-foreground">{label}</span>
        <span
          className={cn(
            "shrink-0 font-medium tabular-nums",
            over ? "text-red-600 dark:text-red-400" : full ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
          )}
        >
          {value}
          <span className="text-muted-foreground">/{target}{suffix}</span>
        </span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", over ? "bg-red-500" : full ? "bg-emerald-500" : "bg-primary/70")}
          style={{ width: `${over ? 100 : pct}%` }}
        />
      </div>
    </div>
  );
}

/** Yes / no / unknown pill for the boolean checks (Video, A+, Brand Story). */
export function CheckChip({ label, value }: { label: string; value: boolean | null }) {
  const Icon = value === true ? Check : value === false ? X : Minus;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        value === true && "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
        value === false && "border-red-500/25 bg-red-500/5 text-red-700 dark:text-red-400",
        value === null && "border-border bg-muted/50 text-muted-foreground"
      )}
    >
      <Icon className="size-3" />
      {label}
    </span>
  );
}

/** Amazon CDN image (m.media-amazon.com). Plain <img>: no next/image remote config exists for it. */
export function AmazonImg({ src, alt, className }: { src: string | null | undefined; alt: string; className?: string }) {
  if (!src) {
    return (
      <div className={cn("grid place-items-center text-muted-foreground", className)}>
        <ImageOff className="size-6" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" className={cn("object-contain", className)} />;
}
