"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { ALERT_STATUSES, type AlertStatus } from "@/lib/fba-fee-tracker-constants";
import { HISTORY_DAYS, type BsrAlertKind, type BsrRankType } from "@/lib/trends-constants";

/**
 * Trends (Market Ops → Automations & Tools → Trends). Daily Best Sellers Rank
 * snapshots, alerts and run rows are written by the LaLaGreen-Daily-Report
 * worker (reportlib/bsr_sync.py); this file only reads them, plus alert
 * status, which staff edit here. Reads go through the RLS client, writes
 * through the service client after a session check.
 */

const COUNTRY = "US";
const PAGE_SIZE = 1000; // PostgREST's default row cap

export interface BsrSnapshot {
  snapshot_date: string;
  asin: string;
  classification_id: string;
  rank_type: BsrRankType;
  title: string | null;
  rank: number | null;
  link: string | null;
  sku: string | null;
  product_name: string | null;
}

export interface BsrAlert {
  id: string;
  asin: string;
  sku: string | null;
  product_name: string | null;
  detected_date: string;
  previous_snapshot_date: string | null;
  kind: BsrAlertKind;
  rank_type: BsrRankType | null;
  classification_id: string;
  category_title: string | null;
  old_rank: number | null;
  new_rank: number | null;
  pct_change: number | null;
  /** The product's top-level rank, previous → current. Null on alerts before the context migration. */
  top_title: string | null;
  top_old_rank: number | null;
  top_new_rank: number | null;
  /** The alert's own subcategory, else the product's best-ranked one, previous → current. */
  sub_title: string | null;
  sub_old_rank: number | null;
  sub_new_rank: number | null;
  status: AlertStatus;
  case_id: string | null;
  notes: string | null;
  updated_by: string | null;
  updated_at: string | null;
}

export interface BsrSyncRun {
  status: "ok" | "error";
  snapshot_date: string | null;
  asins_seen: number;
  asins_failed: number;
  alerts_created: number;
  error: string | null;
  created_at: string;
}

export interface TrendsOverview {
  latestDate: string | null;
  /** The snapshot before latestDate — what the "vs yesterday" deltas compare with. */
  previousDate: string | null;
  latest: BsrSnapshot[];
  previous: Pick<BsrSnapshot, "asin" | "classification_id" | "rank_type" | "title" | "rank">[];
  /** Alerts still needing attention: open or case_raised. */
  alerts: BsrAlert[];
  lastRun: BsrSyncRun | null;
  lastSuccessfulRun: BsrSyncRun | null;
}

const SNAPSHOT_COLUMNS = "snapshot_date, asin, classification_id, rank_type, title, rank, link, sku, product_name";
const ALERT_COLUMNS =
  "id, asin, sku, product_name, detected_date, previous_snapshot_date, kind, rank_type, classification_id, category_title, old_rank, new_rank, pct_change, top_title, top_old_rank, top_new_rank, sub_title, sub_old_rank, sub_new_rank, status, case_id, notes, updated_by, updated_at";
const RUN_COLUMNS = "status, snapshot_date, asins_seen, asins_failed, alerts_created, error, created_at";

async function requireStaff() {
  const session = await getSession();
  if (!session) return { session: null, error: "Unauthorized" as const };
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

function snapshotsOn<T>(client: SupabaseClient, date: string, columns: string) {
  return selectAll<T>((from, to) =>
    client
      .from("bsr_snapshots")
      .select(columns)
      .eq("country_code", COUNTRY)
      .eq("snapshot_date", date)
      .order("asin")
      .order("classification_id")
      .range(from, to)
      .returns<T[]>()
  );
}

function daysBefore(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

export async function getTrendsOverview(): Promise<{ data: TrendsOverview | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();

  const [latestRes, runRes, okRunRes] = await Promise.all([
    client
      .from("bsr_snapshots")
      .select("snapshot_date")
      .eq("country_code", COUNTRY)
      .order("snapshot_date", { ascending: false })
      .limit(1)
      .maybeSingle(),
    client.from("bsr_sync_runs").select(RUN_COLUMNS).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    client
      .from("bsr_sync_runs")
      .select(RUN_COLUMNS)
      .eq("status", "ok")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);
  if (latestRes.error) return { data: null, error: latestRes.error.message };

  const latestDate: string | null = latestRes.data?.snapshot_date ?? null;
  const lastRun = (runRes.data as BsrSyncRun | null) ?? null;
  const lastSuccessfulRun = (okRunRes.data as BsrSyncRun | null) ?? null;

  if (!latestDate) {
    return {
      data: { latestDate: null, previousDate: null, latest: [], previous: [], alerts: [], lastRun, lastSuccessfulRun },
      error: null,
    };
  }

  const prevRes = await client
    .from("bsr_snapshots")
    .select("snapshot_date")
    .eq("country_code", COUNTRY)
    .lt("snapshot_date", latestDate)
    .order("snapshot_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (prevRes.error) return { data: null, error: prevRes.error.message };
  const previousDate: string | null = prevRes.data?.snapshot_date ?? null;

  const [latest, previous, alerts] = await Promise.all([
    snapshotsOn<BsrSnapshot>(client, latestDate, SNAPSHOT_COLUMNS),
    previousDate
      ? snapshotsOn<TrendsOverview["previous"][number]>(client, previousDate, "asin, classification_id, rank_type, title, rank")
      : Promise.resolve({ data: [], error: null }),
    selectAll<BsrAlert>((from, to) =>
      client
        .from("bsr_alerts")
        .select(ALERT_COLUMNS)
        .eq("country_code", COUNTRY)
        .in("status", ["open", "case_raised"])
        .order("detected_date", { ascending: false })
        .range(from, to)
        .returns<BsrAlert[]>()
    ),
  ]);
  const err = latest.error ?? previous.error ?? alerts.error;
  if (err) return { data: null, error: err };

  return {
    data: {
      latestDate,
      previousDate,
      latest: latest.data,
      previous: previous.data,
      alerts: alerts.data,
      lastRun,
      lastSuccessfulRun,
    },
    error: null,
  };
}

export interface AsinBsrHistory {
  snapshots: Pick<BsrSnapshot, "snapshot_date" | "classification_id" | "rank_type" | "title" | "rank">[];
  alerts: BsrAlert[];
}

export async function getAsinBsrHistory(asin: string): Promise<{ data: AsinBsrHistory | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();
  const since = daysBefore(new Date().toISOString().slice(0, 10), HISTORY_DAYS);

  const [snaps, alerts] = await Promise.all([
    selectAll<AsinBsrHistory["snapshots"][number]>((from, to) =>
      client
        .from("bsr_snapshots")
        .select("snapshot_date, classification_id, rank_type, title, rank")
        .eq("country_code", COUNTRY)
        .eq("asin", asin)
        .gte("snapshot_date", since)
        .order("snapshot_date", { ascending: true })
        .order("classification_id")
        .range(from, to)
        .returns<AsinBsrHistory["snapshots"]>()
    ),
    client
      .from("bsr_alerts")
      .select(ALERT_COLUMNS)
      .eq("country_code", COUNTRY)
      .eq("asin", asin)
      .order("detected_date", { ascending: false })
      .limit(50),
  ]);
  if (snaps.error) return { data: null, error: snaps.error };
  if (alerts.error) return { data: null, error: alerts.error.message };

  return {
    data: { snapshots: snaps.data, alerts: (alerts.data as BsrAlert[]) ?? [] },
    error: null,
  };
}

export async function updateBsrAlertStatus(
  id: string,
  status: AlertStatus,
  caseId?: string | null,
  notes?: string | null
): Promise<{ data: BsrAlert | null; error: string | null }> {
  const { session, error } = await requireStaff();
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
    .from("bsr_alerts")
    .update(patch)
    .eq("id", id)
    .select(ALERT_COLUMNS)
    .maybeSingle();

  if (dbError) return { data: null, error: dbError.message };
  if (!data) return { data: null, error: "Alert not found" };
  return { data: data as BsrAlert, error: null };
}
