/**
 * Plain runtime constants for the Profit Analytics dashboard, kept out of
 * lib/actions/profit-analytics.ts on purpose: that file is "use server", and
 * every export from a "use server" module is transformed into a server-action
 * reference rather than a plain value. That transform only knows how to proxy
 * async functions — a runtime constant like PROFIT_COUNTRIES would silently
 * become unusable (undefined) once imported into a client component, since
 * there is no server action for the client to call to "fetch" a constant
 * array. Client components must import PROFIT_COUNTRIES from here directly,
 * never through the action file.
 */

export const PROFIT_COUNTRIES = ["US", "CA", "MX"] as const;
export type ProfitCountry = (typeof PROFIT_COUNTRIES)[number];

/** The marketplace selector's value: a single marketplace, or the consolidated roll-up. */
export type ProfitScope = ProfitCountry | "ALL";
