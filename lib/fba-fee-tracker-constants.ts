/**
 * Shared constants/types for the FBA Fee Tracker. Kept out of the "use server"
 * actions file on purpose — see CLAUDE.md: a runtime constant exported from a
 * "use server" module renders as undefined client-side.
 */

/** A fee move of this % or more (either direction) is flagged. Matches ALERT_PCT in fba_fee_sync.py. */
export const FEE_CHANGE_ALERT_PCT = 15;

/** Amazon's fee this % or more above our expected fee ⇒ worth a remeasure case. */
export const EXPECTED_GAP_ALERT_PCT = 15;

/** Calculator vs. Amazon (on Amazon's own dimensions) within this many dollars counts as a match. */
export const CALCULATOR_MATCH_TOLERANCE = 0.05;

/** How far back the "fee N days ago" comparison and history chart look. */
export const HISTORY_DAYS = 90;

export const ALERT_KINDS = ["tier_change", "fee_increase", "fee_decrease"] as const;
export type AlertKind = (typeof ALERT_KINDS)[number];

export const ALERT_CAUSES = ["dims_changed", "rate_change"] as const;
export type AlertCause = (typeof ALERT_CAUSES)[number];

export const ALERT_STATUSES = ["open", "case_raised", "resolved", "dismissed"] as const;
export type AlertStatus = (typeof ALERT_STATUSES)[number];

export const ALERT_KIND_LABELS: Record<AlertKind, string> = {
  tier_change: "Size tier changed",
  fee_increase: "Fee increased",
  fee_decrease: "Fee decreased",
};

export const ALERT_STATUS_LABELS: Record<AlertStatus, string> = {
  open: "Open",
  case_raised: "Case raised",
  resolved: "Resolved",
  dismissed: "Dismissed",
};

/** Upper bounds for manual true-dimension entry — anything past these is a typo. */
export const MAX_SIDE_IN = 200;
export const MAX_WEIGHT_LB = 500;
