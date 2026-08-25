/**
 * Plain runtime constants for the Goals widget, kept out of
 * lib/actions/profit-goals.ts on purpose -- that file is "use server", and
 * every export from a "use server" module is transformed into a server-action
 * reference rather than a plain value. See lib/profit-analytics-constants.ts
 * for the same pattern (and the bug it was created to fix).
 */

export type GoalMetric = "revenue" | "gross_margin";
export const GOAL_METRICS: GoalMetric[] = ["revenue", "gross_margin"];
