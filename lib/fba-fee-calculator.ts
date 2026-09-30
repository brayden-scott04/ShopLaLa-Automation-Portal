/**
 * Expected US FBA fulfillment fee from package dimensions — our own
 * implementation of Amazon's published rate card, since Amazon's revenue
 * calculator (sellercentral.amazon.com/revcal) has no API and the Product Fees
 * API only ever uses the dimensions Amazon already has on file (which is
 * exactly what we're trying to second-guess).
 *
 * Plain module (not "use server"), so both the client page and server actions
 * can import it.
 *
 * Scope: US, non-apparel, non-dangerous-goods. Non-peak rates apply
 * Jan 15 – Oct 14; the separate peak card (Oct 15 – Jan 14) is picked by date.
 * Amazon's fuel & logistics surcharge is NOT part of either table — it's added
 * on top, exactly as Amazon's fee page footnotes it.
 *
 * Source: Amazon's official "FBA fulfillment fees (excluding apparel)" page in
 * Seller Central, pasted by staff and checked number-for-number on 2026-10-01
 * (non-peak 2026 + peak 2026/27).
 *
 * UPDATE EVERY YEAR: each January 15 Amazon publishes a new non-peak card —
 * edit US_RATE_CARD and bump `effective`. Each autumn, replace `peak` with the
 * coming season's card and dates. The page's "calculator check" tile drops when
 * either is stale.
 */

export type SizeTier =
  | "small_standard"
  | "large_standard"
  | "small_bulky"
  | "large_bulky"
  | "extra_large_0_50"
  | "extra_large_50_70"
  | "extra_large_70_150"
  | "extra_large_150_plus";

export const SIZE_TIER_LABELS: Record<SizeTier, string> = {
  small_standard: "Small standard",
  large_standard: "Large standard",
  small_bulky: "Small bulky",
  large_bulky: "Large bulky",
  extra_large_0_50: "Extra-large 0–50 lb",
  extra_large_50_70: "Extra-large 50–70 lb",
  extra_large_70_150: "Extra-large 70–150 lb",
  extra_large_150_plus: "Extra-large 150+ lb",
};

/** Price bands introduced with the 2026 rate card: [<$10, $10–$50, >$50]. */
type Banded = readonly [number, number, number];

interface WeightRow {
  /** Upper bound of the row, inclusive, in ounces. */
  maxOz: number;
  fee: Banded;
}

interface IncrementalRate {
  base: Banded;
  /** Fee added per `stepLb` (or part thereof) above `aboveLb`. */
  perStep: number;
  stepLb: number;
  aboveLb: number;
}

/** One season's fee tables (non-peak or peak) — same shape, different numbers. */
interface RateTables {
  smallStandard: WeightRow[];
  largeStandard: WeightRow[];
  largeStandardOver3Lb: IncrementalRate;
  smallBulky: IncrementalRate;
  largeBulky: IncrementalRate;
  extraLarge0to50: IncrementalRate;
  extraLarge50to70: IncrementalRate;
  extraLarge70to150: IncrementalRate;
  extraLarge150Plus: IncrementalRate;
}

/** 2026/27 peak season card, Oct 15, 2026 – Jan 14, 2027 (fuel surcharge not included). */
const US_PEAK_2026: RateTables & { from: string; to: string } = {
  from: "2026-10-15",
  to: "2027-01-14",
  smallStandard: [
    { maxOz: 2, fee: [2.62, 3.51, 3.77] },
    { maxOz: 4, fee: [2.68, 3.61, 3.87] },
    { maxOz: 6, fee: [2.76, 3.65, 3.91] },
    { maxOz: 8, fee: [2.86, 3.74, 4.0] },
    { maxOz: 10, fee: [2.98, 3.89, 4.15] },
    { maxOz: 12, fee: [3.03, 3.99, 4.25] },
    { maxOz: 14, fee: [3.14, 4.13, 4.39] },
    { maxOz: 16, fee: [3.17, 4.18, 4.44] },
  ],
  largeStandard: [
    { maxOz: 4, fee: [3.15, 3.97, 4.23] },
    { maxOz: 8, fee: [3.39, 4.21, 4.47] },
    { maxOz: 12, fee: [3.66, 4.48, 4.74] },
    { maxOz: 16, fee: [4.07, 4.89, 5.15] },
    { maxOz: 20, fee: [4.52, 5.34, 5.6] },
    { maxOz: 24, fee: [4.91, 5.73, 5.99] },
    { maxOz: 28, fee: [5.07, 5.89, 6.15] },
    { maxOz: 32, fee: [5.33, 6.15, 6.41] },
    { maxOz: 36, fee: [5.47, 6.29, 6.55] },
    { maxOz: 40, fee: [5.67, 6.49, 6.75] },
    { maxOz: 44, fee: [5.84, 6.66, 6.92] },
    { maxOz: 48, fee: [6.26, 7.08, 7.34] },
  ],
  largeStandardOver3Lb: { base: [6.69, 7.51, 7.77], perStep: 0.08, stepLb: 0.25, aboveLb: 3 },
  smallBulky: { base: [7.82, 8.59, 8.59], perStep: 0.38, stepLb: 1, aboveLb: 1 },
  largeBulky: { base: [9.62, 10.39, 10.39], perStep: 0.38, stepLb: 1, aboveLb: 1 },
  extraLarge0to50: { base: [28.29, 29.06, 29.06], perStep: 0.38, stepLb: 1, aboveLb: 1 },
  extraLarge50to70: { base: [39.36, 40.13, 40.13], perStep: 0.75, stepLb: 1, aboveLb: 51 },
  extraLarge70to150: { base: [54.97, 55.74, 55.74], perStep: 0.75, stepLb: 1, aboveLb: 71 },
  extraLarge150Plus: { base: [202.69, 203.46, 203.46], perStep: 0.19, stepLb: 1, aboveLb: 151 },
};

export const US_RATE_CARD = {
  effective: "2026-01-15",
  /** 3.5% fuel & logistics surcharge on every fulfillment fee, from 2026-04-17. */
  fuelSurcharge: { rate: 0.035, from: "2026-04-17" },
  dimDivisor: 139,
  dimMinSideIn: 2,
  peak: US_PEAK_2026,

  // Non-peak tables (Jan 15 – Oct 14) below.

  smallStandard: [
    { maxOz: 2, fee: [2.43, 3.32, 3.58] },
    { maxOz: 4, fee: [2.49, 3.42, 3.68] },
    { maxOz: 6, fee: [2.56, 3.45, 3.71] },
    { maxOz: 8, fee: [2.66, 3.54, 3.8] },
    { maxOz: 10, fee: [2.77, 3.68, 3.94] },
    { maxOz: 12, fee: [2.82, 3.78, 4.04] },
    { maxOz: 14, fee: [2.92, 3.91, 4.17] },
    { maxOz: 16, fee: [2.95, 3.96, 4.22] },
  ] as WeightRow[],

  largeStandard: [
    { maxOz: 4, fee: [2.91, 3.73, 3.99] },
    { maxOz: 8, fee: [3.13, 3.95, 4.21] },
    { maxOz: 12, fee: [3.38, 4.2, 4.46] },
    { maxOz: 16, fee: [3.78, 4.6, 4.86] },
    { maxOz: 20, fee: [4.22, 5.04, 5.3] },
    { maxOz: 24, fee: [4.6, 5.42, 5.68] },
    { maxOz: 28, fee: [4.75, 5.57, 5.83] },
    { maxOz: 32, fee: [5.0, 5.82, 6.08] },
    { maxOz: 36, fee: [5.1, 5.92, 6.18] },
    { maxOz: 40, fee: [5.28, 6.1, 6.36] },
    { maxOz: 44, fee: [5.44, 6.26, 6.52] },
    { maxOz: 48, fee: [5.85, 6.67, 6.93] },
  ] as WeightRow[],
  /** Large standard above 3 lb (to 20 lb): base + $0.08 per 4 oz above 3 lb. */
  largeStandardOver3Lb: { base: [6.15, 6.97, 7.23], perStep: 0.08, stepLb: 0.25, aboveLb: 3 } as IncrementalRate,

  smallBulky: { base: [6.78, 7.55, 7.55], perStep: 0.38, stepLb: 1, aboveLb: 1 } as IncrementalRate,
  largeBulky: { base: [8.58, 9.35, 9.35], perStep: 0.38, stepLb: 1, aboveLb: 1 } as IncrementalRate,
  extraLarge0to50: { base: [25.56, 26.33, 26.33], perStep: 0.38, stepLb: 1, aboveLb: 1 } as IncrementalRate,
  extraLarge50to70: { base: [36.55, 37.32, 37.32], perStep: 0.75, stepLb: 1, aboveLb: 51 } as IncrementalRate,
  extraLarge70to150: { base: [50.55, 51.32, 51.32], perStep: 0.75, stepLb: 1, aboveLb: 71 } as IncrementalRate,
  extraLarge150Plus: { base: [194.18, 194.95, 194.95], perStep: 0.19, stepLb: 1, aboveLb: 151 } as IncrementalRate,
} as const;

/** Size tier limits (inches / pounds of unit weight). Length + girth = longest + 2 × (median + shortest). */
const TIER_LIMITS = {
  small_standard: { maxLb: 1, longest: 15, median: 12, shortest: 0.75 },
  large_standard: { maxLb: 20, longest: 18, median: 14, shortest: 8 },
  small_bulky: { maxLb: 50, longest: 37, median: 28, shortest: 20, lengthGirth: 130 },
  large_bulky: { maxLb: 50, longest: 59, median: 33, shortest: 33, lengthGirth: 130 },
} as const;

export interface FeeInput {
  /** Any order — sorted internally into longest / median / shortest. */
  sidesIn: [number, number, number];
  weightLb: number;
  /** Selling price, used for the price band. Unknown → $10–$50 band. */
  price?: number | null;
  /** ISO date the fee applies to (fuel surcharge cut-over). Defaults to today. */
  date?: string;
}

export interface FeeResult {
  sizeTier: SizeTier;
  dimensionalWeightLb: number;
  shippingWeightLb: number;
  priceBand: 0 | 1 | 2;
  priceBandAssumed: boolean;
  /** Priced with the peak-season card (Oct 15 – Jan 14). */
  isPeak: boolean;
  baseFee: number;
  fee: number;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function priceBandOf(price: number | null | undefined): { band: 0 | 1 | 2; assumed: boolean } {
  if (price == null || !Number.isFinite(price) || price <= 0) return { band: 1, assumed: true };
  if (price < 10) return { band: 0, assumed: false };
  if (price <= 50) return { band: 1, assumed: false };
  return { band: 2, assumed: false };
}

function sortSides(sides: [number, number, number]): [number, number, number] {
  const s = [...sides].sort((a, b) => b - a);
  return [s[0], s[1], s[2]];
}

export function sizeTierFor(sidesIn: [number, number, number], weightLb: number): SizeTier {
  const [l, m, s] = sortSides(sidesIn);
  const girth = l + 2 * (m + s);
  const fits = (t: { maxLb: number; longest: number; median: number; shortest: number; lengthGirth?: number }) =>
    weightLb <= t.maxLb &&
    l <= t.longest &&
    m <= t.median &&
    s <= t.shortest &&
    (t.lengthGirth === undefined || girth <= t.lengthGirth);

  if (fits(TIER_LIMITS.small_standard)) return "small_standard";
  if (fits(TIER_LIMITS.large_standard)) return "large_standard";
  if (fits(TIER_LIMITS.small_bulky)) return "small_bulky";
  if (fits(TIER_LIMITS.large_bulky)) return "large_bulky";
  if (weightLb <= 50) return "extra_large_0_50";
  if (weightLb <= 70) return "extra_large_50_70";
  if (weightLb <= 150) return "extra_large_70_150";
  return "extra_large_150_plus";
}

function incremental(rate: IncrementalRate, band: 0 | 1 | 2, shippingLb: number): number {
  const over = Math.max(0, shippingLb - rate.aboveLb);
  // Tiny epsilon so 3.2500000001 lb (float noise from unit conversion) isn't billed an extra step.
  const steps = Math.ceil(over / rate.stepLb - 1e-9);
  return rate.base[band] + steps * rate.perStep;
}

function fromRows(rows: WeightRow[], band: 0 | 1 | 2, shippingLb: number): number | null {
  const oz = shippingLb * 16;
  const row = rows.find((r) => oz <= r.maxOz + 1e-9);
  return row ? row.fee[band] : null;
}

export function expectedFbaFee(input: FeeInput): FeeResult {
  const card = US_RATE_CARD;
  const [l, m, s] = sortSides(input.sidesIn);
  const weightLb = input.weightLb;
  const tier = sizeTierFor([l, m, s], weightLb);

  const dimWeight =
    (l * Math.max(m, card.dimMinSideIn) * Math.max(s, card.dimMinSideIn)) / card.dimDivisor;
  // Small standard and XL 150+ bill on unit weight only; every other tier on the greater of the two.
  const shippingLb =
    tier === "small_standard" || tier === "extra_large_150_plus" ? weightLb : Math.max(weightLb, dimWeight);

  const { band, assumed } = priceBandOf(input.price);

  const date = input.date ?? new Date().toISOString().slice(0, 10);
  const isPeak = date >= card.peak.from && date <= card.peak.to;
  const rates: RateTables = isPeak ? card.peak : card;

  let base: number;
  switch (tier) {
    case "small_standard":
      base = fromRows(rates.smallStandard, band, shippingLb) ?? rates.smallStandard.at(-1)!.fee[band];
      break;
    case "large_standard":
      base =
        fromRows(rates.largeStandard, band, shippingLb) ?? incremental(rates.largeStandardOver3Lb, band, shippingLb);
      break;
    case "small_bulky":
      base = incremental(rates.smallBulky, band, shippingLb);
      break;
    case "large_bulky":
      base = incremental(rates.largeBulky, band, shippingLb);
      break;
    case "extra_large_0_50":
      base = incremental(rates.extraLarge0to50, band, shippingLb);
      break;
    case "extra_large_50_70":
      base = incremental(rates.extraLarge50to70, band, shippingLb);
      break;
    case "extra_large_70_150":
      base = incremental(rates.extraLarge70to150, band, shippingLb);
      break;
    case "extra_large_150_plus":
      base = incremental(rates.extraLarge150Plus, band, shippingLb);
      break;
  }

  const fee = date >= card.fuelSurcharge.from ? base * (1 + card.fuelSurcharge.rate) : base;

  return {
    sizeTier: tier,
    dimensionalWeightLb: round2(dimWeight),
    shippingWeightLb: round2(shippingLb),
    priceBand: band,
    priceBandAssumed: assumed,
    isPeak,
    baseFee: round2(base),
    fee: round2(fee),
  };
}

/**
 * Map Amazon's free-text product-size-tier (e.g. "Large Standard-Size",
 * "Small Bulky", "Extra-Large 50 to 70 lb") onto our SizeTier, for comparing
 * Amazon's tier with the one our dimensions imply. null = unrecognized.
 */
export function normalizeAmazonTier(raw: string | null | undefined): SizeTier | null {
  if (!raw) return null;
  const t = raw.toLowerCase().replace(/[^a-z0-9+]+/g, " ").trim();
  if (t.includes("small") && t.includes("standard")) return "small_standard";
  if (t.includes("large") && t.includes("standard")) return "large_standard";
  if (t.includes("small") && t.includes("bulky")) return "small_bulky";
  if (t.includes("large") && t.includes("bulky")) return "large_bulky";
  if (t.includes("small oversize")) return "large_bulky"; // pre-2024 naming
  if (t.includes("extra") || t.includes("oversize") || t.includes("special")) {
    const nums = new Set((t.match(/\d+/g) ?? []).map(Number));
    if (nums.has(70) && nums.has(150)) return "extra_large_70_150";
    if (nums.has(150)) return "extra_large_150_plus";
    if (nums.has(50) && nums.has(70)) return "extra_large_50_70";
    return "extra_large_0_50";
  }
  return null;
}

/** Standard vs. bulky/oversize — the jump staff care most about. */
export function isStandardTier(tier: SizeTier | null): boolean {
  return tier === "small_standard" || tier === "large_standard";
}
