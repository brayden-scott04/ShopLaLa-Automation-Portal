/**
 * Shared constants/types for Trends (daily Best Sellers Rank). Kept out of the
 * "use server" actions file on purpose — see CLAUDE.md: a runtime constant
 * exported from a "use server" module renders as undefined client-side.
 */

/**
 * A subcategory/top-level rank that worsens by at least this % AND at least
 * RANK_DROP_MIN_POSITIONS places day-over-day is flagged. Matches the
 * constants of the same name in the Daily-Report repo's reportlib/bsr_sync.py.
 */
export const RANK_DROP_PCT = 50;
/** Stops #3 → #5 (a 67% "drop") from alerting. */
export const RANK_DROP_MIN_POSITIONS = 20;

/** How far back the per-ASIN rank charts look. */
export const HISTORY_DAYS = 90;

export const BSR_ALERT_KINDS = ["category_removed", "ranks_lost", "category_added", "rank_drop"] as const;
export type BsrAlertKind = (typeof BSR_ALERT_KINDS)[number];

export const BSR_ALERT_KIND_LABELS: Record<BsrAlertKind, string> = {
  category_removed: "Category removed",
  ranks_lost: "All ranks lost",
  category_added: "Category added",
  rank_drop: "Rank dropped",
};

export type BsrRankType = "display_group" | "classification" | "none";
