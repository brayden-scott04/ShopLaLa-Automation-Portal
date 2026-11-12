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
  "sku, asin, listing_status, title, title_len, highlight_len, bullet_lengths, image_count, main_thumb, aplus, brand_story, mismatch, limits, error_issues, checked_date";
const DETAIL_COLUMNS =
  "sku, asin, product_type, listing_status, title, highlight, bullets, images, issues, submitted, mismatch, aplus, brand_story, limits, checked_date, checked_at";
const NOTES_COLUMNS = "sku, comment, launch_by, launch_date, videos, related_videos, updated_by, updated_at";
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

  const [listings, notes, alerts, runRes, okRunRes, staffRes] = await Promise.all([
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
  ]);

  const err = listings.error ?? notes.error ?? alerts.error ?? staffRes.error?.message;
  if (err) return { data: null, error: err };

  return {
    data: {
      listings: listings.data,
      notes: notes.data,
      alerts: alerts.data,
      lastRun: (runRes.data as ListingSyncRun | null) ?? null,
      lastSuccessfulRun: (okRunRes.data as ListingSyncRun | null) ?? null,
      staff: (staffRes.data ?? []).map((s: { username: string }) => s.username),
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
}

function validCount(n: number | null): boolean {
  return n === null || (Number.isInteger(n) && n >= 0 && n <= 999);
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
