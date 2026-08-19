import { CANONICAL_SLOTS } from "@/lib/ppc-daily-cap-constants";

/**
 * The four ACOS bands, in the fixed order that decides everything ordinal
 * about them: chart colour, column order, and — since staff can configure
 * overlapping ranges — which band an ACOS matching more than one resolves to
 * (the first). The ranges themselves are NOT here; they're staff-editable per
 * (country, metric, band) and live in ppc_acos_topup_band_settings (min_acos /
 * max_acos / enabled), fetched alongside the caps. sp_account_budget.py's
 * ACOS_BANDS tuple mirrors this same order — keep the two aligned.
 */
export const ACOS_BANDS = [
  { key: "0-10", chartColor: "var(--color-chart-1)" },
  { key: "10-20", chartColor: "var(--color-chart-2)" },
  { key: "20-30", chartColor: "var(--color-chart-3)" },
  { key: "30-plus", chartColor: "var(--color-chart-4)" },
] as const;

export type AcosBandKey = (typeof ACOS_BANDS)[number]["key"];

export const ACOS_BAND_KEYS: readonly AcosBandKey[] = ACOS_BANDS.map((b) => b.key);

/**
 * The two ACOS figures a campaign is measured against. Each gets its own full
 * slot × band schedule, and both run every tick — an out-of-budget campaign can
 * be topped up by the "today" schedule and the "14d" schedule independently.
 */
export const ACOS_METRICS = [
  { key: "today", label: "Today's ACOS" },
  { key: "14d", label: "14-Day ACOS" },
] as const;

export type AcosMetric = (typeof ACOS_METRICS)[number]["key"];

export const ACOS_METRIC_KEYS: readonly AcosMetric[] = ACOS_METRICS.map((m) => m.key);

/** Rows one (country, metric) schedule must have: every canonical slot × every band. */
export const EXPECTED_SCHEDULE_ROWS = CANONICAL_SLOTS.length * ACOS_BAND_KEYS.length;

/** Rows one country's band-cap settings must have: one per band, per metric. */
export const EXPECTED_BAND_SETTINGS_ROWS = ACOS_BAND_KEYS.length * ACOS_METRIC_KEYS.length;

export const MAX_BAND_TOPUP_AMOUNT = 1000;
/** Ceiling on one band's "max top-up per day" — total $ across all campaigns in that band, per marketplace. */
export const MAX_DAILY_TOPUP_TOTAL = 100000;
/** Ceiling on one band's "max individual campaign budget" — the highest daily budget one campaign in that band may be raised to. */
export const MAX_CAMPAIGN_BUDGET = 10000;
/** Sanity ceiling on an editable ACOS cut-off. ACOS is a percentage but can legitimately exceed 100% (spend > sales), so this is a bound against typos, not a real-world limit. */
export const MAX_ACOS_PERCENT = 1000;

function trimPercent(n: number): string {
  return String(Number(n.toFixed(2)));
}

/**
 * A band's display label, derived from its live DB bounds rather than stored.
 * Ranges are half-open [min, max) — a campaign at exactly `max` belongs to the
 * next band. The first band always renders "< x%" and the last "> a%" because
 * their open ends are structurally pinned (min 0 / max null); printing
 * "0% – 10%" or "30% – ∞" would wrongly imply those edges are editable too.
 */
export function formatBandLabel(minAcos: number, maxAcos: number | null): string {
  if (maxAcos === null) return `> ${trimPercent(minAcos)}%`;
  if (minAcos === 0) return `< ${trimPercent(maxAcos)}%`;
  return `${trimPercent(minAcos)}% – ${trimPercent(maxAcos)}%`;
}

/**
 * The 48 half-hour labels the ACOS grids render: "00:00", "00:30" .. "23:30".
 * Derived from CANONICAL_SLOTS (rather than generated separately) so the two
 * can never drift apart.
 */
export const HALF_HOUR_SLOTS: readonly string[] = CANONICAL_SLOTS.filter(
  (s) => s.endsWith(":00") || s.endsWith(":30")
);

/**
 * The three canonical ten-minute rows one half-hour row owns, head slot
 * first. The schedule table and the Python top-up job both still run on
 * 10-minute slots — current_slot() in sp_account_budget.py must not change —
 * so a half-hour amount is stored as [amount, 0, 0] across these three
 * sub-slots. That's what makes the job's three ticks inside that half hour
 * pay out exactly once, with zero backend change.
 */
export function subSlotsFor(headSlot: string): readonly string[] {
  const i = CANONICAL_SLOTS.indexOf(headSlot);
  return i < 0 ? [] : CANONICAL_SLOTS.slice(i, i + 3);
}

/** Singapore wall clock — same convention as ppc-daily-cap-constants' nowSgt(). */
function nowSgt(): Date {
  return new Date(Date.now() + 8 * 60 * 60 * 1000);
}

/**
 * The half-hour slot bucket "now" currently falls in, in Singapore time — the
 * ACOS grids' equivalent of currentSlotSgt(). Needed because the chart's
 * ReferenceLine is plotted against HALF_HOUR_SLOTS; currentSlotSgt()'s raw
 * ten-minute value (e.g. "10:20") would match none of the 48 categories and
 * the line would silently fail to render.
 */
export function currentHalfHourSlotSgt(): string {
  const d = nowSgt();
  const mins = d.getUTCHours() * 60 + Math.floor(d.getUTCMinutes() / 30) * 30;
  return `${String(Math.floor(mins / 60) % 24).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
}
