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

// Used only if the live rate fetch below fails -- approximate, kept as a resilience
// fallback so the dashboard degrades to a stale-but-plausible number instead of erroring
// or showing raw unconverted currency mixed into a "USD" figure.
export const FALLBACK_USD_RATE: Record<ProfitCountry, number> = { US: 1, CA: 0.73, MX: 0.055 };

/**
 * 1 unit of each marketplace's currency, in USD, as of now. Not historically accurate per
 * transaction date -- this is a single current-rate approximation applied uniformly across
 * whatever date range is requested, which is why every USD-converted figure derived from
 * this is presented as a secondary/approximate number, never the primary one for CA/MX.
 * Shared between lib/actions/profit-analytics.ts and lib/actions/sales-traffic.ts so both
 * "use server" files get the same rate/fallback without duplicating the fetch -- this
 * module has no "use server" directive, so exporting a plain async function here (rather
 * than from either action file) is unaffected by the export-boundary issue documented above.
 */
export async function getUsdRates(): Promise<Record<ProfitCountry, number>> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`FX rate fetch failed: ${res.status}`);
    const json = (await res.json()) as { rates?: Record<string, number> };
    const cad = json.rates?.CAD;
    const mxn = json.rates?.MXN;
    if (!cad || !mxn) throw new Error("FX response missing CAD/MXN");
    return { US: 1, CA: 1 / cad, MX: 1 / mxn };
  } catch {
    return FALLBACK_USD_RATE;
  }
}
