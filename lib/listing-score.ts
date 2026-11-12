/**
 * Listing Score (Visual → Listing Score): shared types, constants and the score
 * itself. Kept out of the "use server" actions file on purpose — see CLAUDE.md:
 * a runtime constant exported from a "use server" module renders as undefined
 * client-side.
 *
 * The data comes from the LaLaGreen-Daily-Report worker
 * (reportlib/listing_score_sync.py). The score is computed here, at read time,
 * because two of its inputs (videos) are typed in by staff.
 */

/**
 * Amazon only shows the Item Highlight line when the title is UNDER 75
 * characters (title_differentiation's schema description), so 74 is the
 * longest title that keeps it — the title target, not the 200-char limit.
 */
export const TITLE_TARGET = 74;
/** Gallery slots Amazon accepts: MAIN + PT01..PT08. */
export const IMAGE_TARGET = 9;
/**
 * Bullets shown on the detail page by default. The schema allows up to 10,
 * but the page shows 5 before "See more product details".
 */
export const BULLET_TARGET_COUNT = 5;

/** Fallback limits when the worker couldn't read the product type schema. */
export const DEFAULT_LIMITS: ListingLimits = { title: 200, highlight: 125, bullet: 700, bullets: 10 };

export interface ListingLimits {
  title: number;
  highlight: number;
  /** Max characters per bullet — varies by product type (500 for GARDEN_EDGING, 700 for PLANTER). */
  bullet: number;
  bullets: number;
}

export interface ListingMismatch {
  title?: boolean;
  highlight?: boolean;
  bullets?: boolean;
  images?: boolean;
}

export const LISTING_STATUSES = ["active", "not_buyable", "inactive", "not_listed"] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  active: "Active",
  not_buyable: "Not buyable",
  inactive: "Inactive",
  not_listed: "Not listed",
};

/** One row of the listing_score_summary view: everything the grid needs. */
export interface ListingSummary {
  sku: string;
  asin: string | null;
  listing_status: ListingStatus;
  title: string | null;
  title_len: number | null;
  highlight_len: number | null;
  bullet_lengths: number[];
  image_count: number;
  main_thumb: string | null;
  aplus: boolean | null;
  brand_story: boolean | null;
  mismatch: ListingMismatch;
  limits: Partial<ListingLimits>;
  error_issues: number;
  checked_date: string;
}

export interface ListingImage {
  slot: string;
  url: string;
  thumb?: string;
}

export interface ListingIssue {
  code: string | null;
  severity: string | null;
  message: string;
  attributes: string[];
}

/** The full listing_score_listings row, for the detail sheet. */
export interface ListingDetail extends Omit<ListingSummary, "title_len" | "highlight_len" | "bullet_lengths" | "image_count" | "main_thumb" | "error_issues"> {
  product_type: string | null;
  highlight: string | null;
  bullets: string[];
  images: ListingImage[];
  issues: ListingIssue[];
  submitted: {
    title: string | null;
    highlight: string | null;
    bullets: string[] | null;
    images: ListingImage[] | null;
  } | null;
  checked_at: string;
}

/** Staff-entered columns (listing_score_notes). */
export interface ListingNotes {
  sku: string;
  comment: string | null;
  launch_by: string | null;
  launch_date: string | null;
  videos: number | null;
  related_videos: number | null;
  updated_by: string | null;
  updated_at: string | null;
}

export const LISTING_ALERT_KINDS = [
  "status_changed",
  "listing_issue",
  "main_image_changed",
  "images_mismatch",
  "bullets_removed",
  "aplus_removed",
  "brand_story_removed",
  "title_changed",
  "highlight_changed",
  "bullets_changed",
  "images_changed",
  "images_reordered",
  "title_mismatch",
  "highlight_mismatch",
  "bullets_mismatch",
] as const;
export type ListingAlertKind = (typeof LISTING_ALERT_KINDS)[number];

export const LISTING_ALERT_KIND_LABELS: Record<ListingAlertKind, string> = {
  status_changed: "Listing status changed",
  listing_issue: "New listing issue",
  main_image_changed: "Main image changed",
  images_mismatch: "Images differ from what we submitted",
  bullets_removed: "Bullet points removed",
  aplus_removed: "A+ content removed",
  brand_story_removed: "Brand Story removed",
  title_changed: "Title changed",
  highlight_changed: "Highlight changed",
  bullets_changed: "Bullet points changed",
  images_changed: "Gallery images changed",
  images_reordered: "Image order changed",
  title_mismatch: "Title differs from what we submitted",
  highlight_mismatch: "Highlight differs from what we submitted",
  bullets_mismatch: "Bullets differ from what we submitted",
};

/** 2 = hurts sales now, 1 = worth a look, 0 = informational. Matches KIND_ORDER in the worker. */
export const LISTING_ALERT_SEVERITY: Record<ListingAlertKind, 0 | 1 | 2> = {
  status_changed: 2,
  listing_issue: 2,
  main_image_changed: 2,
  images_mismatch: 1,
  bullets_removed: 1,
  aplus_removed: 1,
  brand_story_removed: 1,
  title_changed: 1,
  highlight_changed: 1,
  bullets_changed: 1,
  images_changed: 0,
  images_reordered: 0,
  title_mismatch: 0,
  highlight_mismatch: 0,
  bullets_mismatch: 0,
};

/** The *_mismatch kinds store old_value = what we submitted, new_value = what Amazon shows. */
export function isMismatchKind(kind: ListingAlertKind): boolean {
  return kind.endsWith("_mismatch");
}

export interface ListingAlert {
  id: string;
  sku: string;
  asin: string | null;
  detected_date: string;
  kind: ListingAlertKind;
  old_value: unknown;
  new_value: unknown;
  status: "open" | "case_raised" | "resolved" | "dismissed";
  case_id: string | null;
  notes: string | null;
  updated_by: string | null;
  updated_at: string | null;
}

export interface ListingSyncRun {
  status: "ok" | "error";
  snapshot_date: string | null;
  skus_seen: number;
  skus_failed: number;
  alerts_created: number;
  error: string | null;
  created_at: string;
}

export const MAX_COMMENT_LENGTH = 2000;

// ── Score ────────────────────────────────────────────────────────────────────

export interface ScorePart {
  key: "title" | "highlight" | "bullets" | "images" | "video" | "aplus" | "brandStory";
  label: string;
  points: number;
  max: number;
  /** What to do to get the remaining points; null when maxed. */
  hint: string | null;
}

export interface ListingScore {
  /** 0-100, or null for a listing Amazon doesn't have (nothing to score). */
  total: number | null;
  parts: ScorePart[];
}

export function limitsOf(l: Partial<ListingLimits> | null | undefined): ListingLimits {
  return { ...DEFAULT_LIMITS, ...(l ?? {}) };
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/**
 * The aim is to use every limit Amazon gives us. 100 points:
 *   Title 20 — up to 74 chars (75+ hides the highlight, so it caps at 8)
 *   Highlight 15 — up to the highlight limit; 0 while the title hides it
 *   Bullets 25 — 10 for having 5, 15 for how much of each bullet's limit is used
 *   Images 20 — 9 gallery images
 *   Video 5, A+ 10, Brand Story 5
 */
export function scoreListing(
  s: Pick<ListingSummary, "listing_status" | "title_len" | "highlight_len" | "bullet_lengths" | "image_count" | "aplus" | "brand_story" | "limits">,
  notes: Pick<ListingNotes, "videos"> | null | undefined
): ListingScore {
  const limits = limitsOf(s.limits);
  const titleLen = s.title_len ?? 0;
  const hlLen = s.highlight_len ?? 0;
  const titleTooLong = titleLen > TITLE_TARGET;

  const parts: ScorePart[] = [];

  parts.push({
    key: "title",
    label: "Title",
    max: 20,
    points: titleTooLong ? 8 : 20 * clamp01(titleLen / TITLE_TARGET),
    hint: !titleLen
      ? "No title"
      : titleTooLong
        ? `${titleLen} chars hides the highlight. Cut to ${TITLE_TARGET} or less`
        : titleLen < TITLE_TARGET
          ? `${TITLE_TARGET - titleLen} chars left before the ${TITLE_TARGET}-char cut-off`
          : null,
  });

  parts.push({
    key: "highlight",
    label: "Highlight",
    max: 15,
    points: titleTooLong ? 0 : 15 * clamp01(hlLen / limits.highlight),
    hint: titleTooLong
      ? "Hidden by Amazon while the title is 75+ chars"
      : !hlLen
        ? `No highlight. Up to ${limits.highlight} chars available`
        : hlLen < limits.highlight
          ? `${limits.highlight - hlLen} chars left`
          : null,
  });

  const shown = s.bullet_lengths.slice(0, BULLET_TARGET_COUNT);
  const countPts = 10 * clamp01(s.bullet_lengths.length / BULLET_TARGET_COUNT);
  const fill =
    shown.reduce((sum, len) => sum + clamp01(len / limits.bullet), 0) / BULLET_TARGET_COUNT;
  const avgLen = shown.length ? Math.round(shown.reduce((a, b) => a + b, 0) / shown.length) : 0;
  parts.push({
    key: "bullets",
    label: "Bullet points",
    max: 25,
    points: countPts + 15 * fill,
    hint:
      s.bullet_lengths.length < BULLET_TARGET_COUNT
        ? `${s.bullet_lengths.length} of ${BULLET_TARGET_COUNT} bullets`
        : fill < 0.995
          ? `Bullets average ${avgLen} of ${limits.bullet} chars`
          : null,
  });

  parts.push({
    key: "images",
    label: "Images",
    max: 20,
    points: 20 * clamp01(s.image_count / IMAGE_TARGET),
    hint: s.image_count < IMAGE_TARGET ? `${s.image_count} of ${IMAGE_TARGET} image slots used` : null,
  });

  const videos = notes?.videos ?? null;
  parts.push({
    key: "video",
    label: "Video",
    max: 5,
    points: videos && videos > 0 ? 5 : 0,
    hint: videos === null ? "Video count not entered yet" : videos > 0 ? null : "No product video",
  });

  parts.push({
    key: "aplus",
    label: "A+ Content",
    max: 10,
    points: s.aplus ? 10 : 0,
    hint: s.aplus ? null : s.aplus === null ? "A+ status unknown" : "No A+ content",
  });

  parts.push({
    key: "brandStory",
    label: "Brand Story",
    max: 5,
    points: s.brand_story ? 5 : 0,
    hint: s.brand_story ? null : s.brand_story === null ? "Brand Story status unknown" : "No Brand Story",
  });

  if (s.listing_status === "not_listed") return { total: null, parts };
  const total = Math.round(parts.reduce((sum, p) => sum + p.points, 0));
  return { total, parts };
}

export type ScoreBand = "excellent" | "good" | "fair" | "poor";

export function scoreBand(total: number): ScoreBand {
  if (total >= 90) return "excellent";
  if (total >= 75) return "good";
  if (total >= 60) return "fair";
  return "poor";
}

export const SCORE_BAND_LABELS: Record<ScoreBand, string> = {
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
  poor: "Needs work",
};
