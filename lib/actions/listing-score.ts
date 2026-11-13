"use server";

import { getSession } from "@/lib/session";
import { getMyPermissions } from "@/lib/permissions";
import { isAllowed } from "@/lib/roles";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { ALERT_STATUSES, type AlertStatus } from "@/lib/fba-fee-tracker-constants";
import {
  MAX_COMMENT_LENGTH,
  type ListingAlert,
  type ListingDetail,
  type ListingNotes,
  type ListingSummary,
  type ListingSyncRun,
} from "@/lib/listing-score";

/**
 * Listing Score (Visual → Listing Score). Listing state, alerts and run rows
 * are written by the LaLaGreen-Daily-Report worker
 * (reportlib/listing_score_sync.py); this file reads them, and writes only
 * alert status and the staff-entered notes. Reads go through the RLS client,
 * writes through the service client after a page-access check.
 */

const COUNTRY = "US";
const PAGE_SIZE = 1000; // PostgREST's default row cap

const SUMMARY_COLUMNS =
  "sku, asin, listing_status, title, title_len, highlight_len, bullet_lengths, image_count, main_thumb, aplus, brand_story, mismatch, limits, error_issues, checked_date, submitted_image_count";
const DETAIL_COLUMNS =
  "sku, asin, product_type, listing_status, title, highlight, bullets, images, issues, submitted, mismatch, aplus, brand_story, limits, checked_date, checked_at";
const NOTES_COLUMNS =
  "sku, comment, launch_by, launch_date, videos, related_videos, expected_images, updated_by, updated_at";
const ALERT_COLUMNS =
  "id, sku, asin, detected_date, kind, old_value, new_value, status, case_id, notes, updated_by, updated_at";
const RUN_COLUMNS = "status, snapshot_date, skus_seen, skus_failed, alerts_created, error, created_at";

export interface ListingScoreOverview {
  listings: ListingSummary[];
  notes: ListingNotes[];
  /** Alerts still needing attention: open or case_raised. */
  alerts: ListingAlert[];
  lastRun: ListingSyncRun | null;
  lastSuccessfulRun: ListingSyncRun | null;
  /** Usernames for the "Launch by" picker. */
  staff: string[];
  /** Every Master List SKU in its hand-set order, for the "Master List order" sort. */
  masterOrder: string[];
}

async function requireStaff() {
  const session = await getSession();
  if (!session) return { session: null, error: "Unauthorized" as const };
  return { session, error: null };
}

async function requireEditor() {
  const session = await getSession();
  if (!session) return { session: null, error: "Unauthorized" as const };
  const { role, permissions } = await getMyPermissions();
  if (!isAllowed(role, permissions, "visual", "listing-score")) return { session: null, error: "Forbidden" as const };
  return { session, error: null };
}

/** Page through a select past PostgREST's 1000-row cap. */
async function selectAll<T>(
  build: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>
): Promise<{ data: T[]; error: string | null }> {
  const out: T[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await build(from, from + PAGE_SIZE - 1);
    if (error) return { data: [], error: error.message };
    out.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) return { data: out, error: null };
  }
}

export async function getListingScoreOverview(): Promise<{ data: ListingScoreOverview | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();

  const [listings, notes, alerts, runRes, okRunRes, staffRes, master] = await Promise.all([
    selectAll<ListingSummary>((from, to) =>
      client
        .from("listing_score_summary")
        .select(SUMMARY_COLUMNS)
        .eq("country_code", COUNTRY)
        .order("sku")
        .range(from, to)
        .returns<ListingSummary[]>()
    ),
    selectAll<ListingNotes>((from, to) =>
      client
        .from("listing_score_notes")
        .select(NOTES_COLUMNS)
        .eq("country_code", COUNTRY)
        .order("sku")
        .range(from, to)
        .returns<ListingNotes[]>()
    ),
    selectAll<ListingAlert>((from, to) =>
      client
        .from("listing_score_alerts")
        .select(ALERT_COLUMNS)
        .eq("country_code", COUNTRY)
        .in("status", ["open", "case_raised"])
        .order("detected_date", { ascending: false })
        .order("sku")
        .range(from, to)
        .returns<ListingAlert[]>()
    ),
    client.from("listing_score_sync_runs").select(RUN_COLUMNS).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    client
      .from("listing_score_sync_runs")
      .select(RUN_COLUMNS)
      .eq("status", "ok")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    client.from("staff").select("username").order("username"),
    selectAll<{ sku: string }>((from, to) =>
      client
        .from("sku_master_list")
        .select("sku")
        .order("position")
        .order("sku")
        .range(from, to)
        .returns<{ sku: string }[]>()
    ),
  ]);

  const err = listings.error ?? notes.error ?? alerts.error ?? staffRes.error?.message ?? master.error;
  if (err) return { data: null, error: err };

  return {
    data: {
      listings: listings.data,
      notes: notes.data,
      alerts: alerts.data,
      lastRun: (runRes.data as ListingSyncRun | null) ?? null,
      lastSuccessfulRun: (okRunRes.data as ListingSyncRun | null) ?? null,
      staff: (staffRes.data ?? []).map((s: { username: string }) => s.username),
      masterOrder: master.data.map((m) => m.sku),
    },
    error: null,
  };
}

export async function getListingDetail(
  sku: string
): Promise<{ data: { listing: ListingDetail | null; alerts: ListingAlert[] } | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();
  const [listingRes, alertsRes] = await Promise.all([
    client.from("listing_score_listings").select(DETAIL_COLUMNS).eq("country_code", COUNTRY).eq("sku", sku).maybeSingle(),
    client
      .from("listing_score_alerts")
      .select(ALERT_COLUMNS)
      .eq("country_code", COUNTRY)
      .eq("sku", sku)
      .order("detected_date", { ascending: false })
      .limit(50),
  ]);
  if (listingRes.error) return { data: null, error: listingRes.error.message };
  if (alertsRes.error) return { data: null, error: alertsRes.error.message };

  return {
    data: {
      listing: (listingRes.data as ListingDetail | null) ?? null,
      alerts: (alertsRes.data as ListingAlert[]) ?? [],
    },
    error: null,
  };
}

export interface ListingNotesInput {
  comment: string;
  launchBy: string | null;
  launchDate: string | null;
  videos: number | null;
  relatedVideos: number | null;
  expectedImages: number | null;
}

function validCount(n: number | null): boolean {
  return n === null || (Number.isInteger(n) && n >= 0 && n <= 999);
}

/** Matches the CHECK on listing_score_notes.expected_images: 1-9 gallery slots. */
function validExpectedImages(n: number | null): boolean {
  return n === null || (Number.isInteger(n) && n >= 1 && n <= 9);
}

export async function saveListingNotes(
  sku: string,
  input: ListingNotesInput
): Promise<{ data: ListingNotes | null; error: string | null }> {
  const { session, error } = await requireEditor();
  if (error) return { data: null, error };

  const comment = input.comment.trim();
  if (comment.length > MAX_COMMENT_LENGTH) {
    return { data: null, error: `Comment is too long (max ${MAX_COMMENT_LENGTH} characters)` };
  }
  if (!validCount(input.videos) || !validCount(input.relatedVideos)) {
    return { data: null, error: "Video counts must be whole numbers from 0 to 999" };
  }
  if (!validExpectedImages(input.expectedImages)) {
    return { data: null, error: "Expected images must be a whole number from 1 to 9" };
  }
  if (input.launchDate && !/^\d{4}-\d{2}-\d{2}$/.test(input.launchDate)) {
    return { data: null, error: "Launch date must be a date" };
  }

  const service = createServiceClient();
  const { data, error: dbError } = await service
    .from("listing_score_notes")
    .upsert(
      {
        country_code: COUNTRY,
        sku,
        comment: comment || null,
        launch_by: input.launchBy || null,
        launch_date: input.launchDate || null,
        videos: input.videos,
        related_videos: input.relatedVideos,
        expected_images: input.expectedImages,
        updated_by: session!.username,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "country_code,sku" }
    )
    .select(NOTES_COLUMNS)
    .maybeSingle();

  if (dbError) return { data: null, error: dbError.message };
  return { data: data as ListingNotes, error: null };
}

export async function updateListingAlertStatus(
  id: string,
  status: AlertStatus,
  caseId?: string | null,
  notes?: string | null
): Promise<{ data: ListingAlert | null; error: string | null }> {
  const { session, error } = await requireEditor();
  if (error) return { data: null, error };
  if (!ALERT_STATUSES.includes(status)) return { data: null, error: `Invalid status: ${status}` };
  if (status === "case_raised" && !caseId?.trim()) {
    return { data: null, error: "Enter the Seller Central case ID" };
  }

  const patch: Record<string, unknown> = {
    status,
    updated_by: session!.username,
    updated_at: new Date().toISOString(),
  };
  if (caseId !== undefined) patch.case_id = caseId?.trim() || null;
  if (notes !== undefined) patch.notes = notes?.trim() || null;

  const service = createServiceClient();
  const { data, error: dbError } = await service
    .from("listing_score_alerts")
    .update(patch)
    .eq("id", id)
    .select(ALERT_COLUMNS)
    .maybeSingle();

  if (dbError) return { data: null, error: dbError.message };
  if (!data) return { data: null, error: "Alert not found" };
  return { data: data as ListingAlert, error: null };
}

export interface BulkNotesResult {
  /** SKUs whose notes were written. */
  updated: number;
  /** Which of Videos / Related videos / Expected images the file had. */
  columns: string[];
  /** SKUs in the file that Listing Score doesn't track (not an NA Master List SKU, or not synced yet). */
  unknownSkus: string[];
  /** Rows skipped for a bad value, as "SKU: reason". */
  invalid: string[];
}

type NoteColumn = "videos" | "related_videos" | "expected_images";

const NOTE_COLUMN_LABELS: Record<NoteColumn, string> = {
  videos: "Videos",
  related_videos: "Related videos",
  expected_images: "Expected images",
};

/** Which notes column a header names, if any. "Related videos" must win over plain "Videos". */
function noteColumnFor(header: string): NoteColumn | "sku" | null {
  const h = header.trim().toLowerCase();
  if (h === "sku" || h === "seller sku" || h === "seller-sku") return "sku";
  if (/related/.test(h) && /video/.test(h)) return "related_videos";
  if (/video/.test(h)) return "videos";
  if (/expected/.test(h) && /image/.test(h)) return "expected_images";
  return null;
}

/**
 * Bulk-set Videos / Related videos / Expected images from an Excel/CSV upload
 * (formData "file") or a block pasted from a spreadsheet (formData "text").
 * Needs a header row with SKU and at least one of those columns, in any order;
 * the Listing Score Excel export already has them. Only the columns present
 * are written: a file with just SKU + Videos leaves expected images and every
 * other note alone. A blank cell under a present column clears that value.
 */
export async function bulkImportListingNotes(
  formData: FormData
): Promise<{ data: BulkNotesResult | null; error: string | null }> {
  const { session, error } = await requireEditor();
  if (error) return { data: null, error };

  const XLSX = await import("xlsx");
  const file = formData.get("file");
  const text = formData.get("text");

  let matrix: unknown[][];
  try {
    let workbook;
    if (file instanceof File && file.size > 0) {
      if (file.size > 2_000_000) return { data: null, error: "File too large (max 2MB)" };
      workbook = XLSX.read(Buffer.from(await file.arrayBuffer()), { type: "buffer" });
    } else if (typeof text === "string" && text.trim()) {
      // A spreadsheet paste is tab-separated; SheetJS reads it like a CSV.
      workbook = XLSX.read(text.trim(), { type: "string", raw: true });
    } else {
      return { data: null, error: "Upload a file or paste some rows first" };
    }
    matrix = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
      header: 1,
      raw: true,
      defval: null,
    }) as unknown[][];
  } catch {
    return { data: null, error: "Couldn't read this — make sure it's a valid Excel/CSV file or a pasted table" };
  }

  // Header row: the first of the top 10 rows with a SKU column and at least one notes column.
  let headerRow = -1;
  let skuCol = -1;
  let cols: { col: NoteColumn; idx: number }[] = [];
  for (let i = 0; i < Math.min(10, matrix.length); i++) {
    const mapped = (matrix[i] ?? []).map((c) => noteColumnFor(String(c ?? "")));
    const sku = mapped.indexOf("sku");
    const found = mapped
      .map((col, idx) => ({ col, idx }))
      .filter((m): m is { col: NoteColumn; idx: number } => m.col !== null && m.col !== "sku");
    // First column wins if a header repeats.
    const unique = found.filter((m, n) => found.findIndex((o) => o.col === m.col) === n);
    if (sku >= 0 && unique.length > 0) {
      headerRow = i;
      skuCol = sku;
      cols = unique;
      break;
    }
  }
  if (headerRow < 0) {
    return {
      data: null,
      error: "No header row found. It needs a SKU column plus Videos, Related videos and/or Expected images",
    };
  }

  const client = await createClient();
  const known = await selectAll<{ sku: string }>((from, to) =>
    client
      .from("listing_score_listings")
      .select("sku")
      .eq("country_code", COUNTRY)
      .order("sku")
      .range(from, to)
      .returns<{ sku: string }[]>()
  );
  if (known.error) return { data: null, error: known.error };
  const knownSkus = new Set(known.data.map((k) => k.sku));

  const unknownSkus: string[] = [];
  const invalid: string[] = [];
  const bySku = new Map<string, Record<string, unknown>>();
  const now = new Date().toISOString();

  for (const row of matrix.slice(headerRow + 1)) {
    const sku = String(row?.[skuCol] ?? "").trim();
    if (!sku) continue;
    if (!knownSkus.has(sku)) {
      unknownSkus.push(sku);
      continue;
    }
    const record: Record<string, unknown> = {
      country_code: COUNTRY,
      sku,
      updated_by: session!.username,
      updated_at: now,
    };
    let bad: string | null = null;
    for (const { col, idx } of cols) {
      const raw = row?.[idx];
      if (raw === null || raw === undefined || String(raw).trim() === "") {
        record[col] = null;
        continue;
      }
      const n = Number(String(raw).trim());
      const ok = col === "expected_images" ? validExpectedImages(n) : validCount(n);
      if (!ok) {
        bad = `${NOTE_COLUMN_LABELS[col]} "${String(raw).trim()}" ${
          col === "expected_images" ? "must be 1 to 9" : "must be a whole number from 0"
        }`;
        break;
      }
      record[col] = n;
    }
    if (bad) invalid.push(`${sku}: ${bad}`);
    else bySku.set(sku, record); // A SKU listed twice: the last row wins.
  }

  // Every record has the same keys, so PostgREST's upsert updates only these columns
  // on existing rows and leaves comment / launch by / launch date untouched.
  const rows = [...bySku.values()];
  const service = createServiceClient();
  for (let i = 0; i < rows.length; i += 500) {
    const { error: dbError } = await service
      .from("listing_score_notes")
      .upsert(rows.slice(i, i + 500), { onConflict: "country_code,sku" });
    if (dbError) return { data: null, error: dbError.message };
  }

  return {
    data: {
      updated: rows.length,
      columns: cols.map((c) => NOTE_COLUMN_LABELS[c.col]),
      unknownSkus,
      invalid,
    },
    error: null,
  };
}
