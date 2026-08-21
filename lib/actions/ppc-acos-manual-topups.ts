"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getSession } from "@/lib/session";
import { CANONICAL_SLOTS, todaySgt, currentSlotSgt } from "@/lib/ppc-daily-cap-constants";
import {
  ACOS_BAND_KEYS,
  ACOS_METRIC_KEYS,
  MAX_BAND_TOPUP_AMOUNT,
  type AcosBandKey,
  type AcosMetric,
} from "@/lib/ppc-acos-topup-constants";
import { assertCountryExists, getStaffId } from "@/lib/actions/ppc-daily-cap";

/**
 * One-off staff top-ups for the ACOS (Individual Campaign) section —
 * ppc_acos_manual_topups, the ACOS grids' analogue of ppc_manual_topups
 * (see ppc-manual-topups.ts, which this file mirrors action-for-action).
 *
 * Semantics differ from the daily-cap manual top-ups in one crucial way:
 * a row is ONE SHOT. Only the backend run whose 10-minute slot equals
 * slot_time (same marketplace target_date) consumes it — paying every
 * out-of-budget campaign whose ACOS falls in the chosen band the full
 * amount, on top of the recurring grid and deliberately past the band's
 * max-campaign-budget cap. Missed tick or no matching campaign ⇒ the
 * backend flips it to `expired`; it never carries forward.
 */
export interface AcosManualTopUp {
  id: string;
  country_code: string;
  acos_metric: AcosMetric;
  band_key: AcosBandKey;
  target_date: string;
  slot_time: string;
  amount: number;
  status: "pending" | "applied" | "expired" | "cancelled";
  created_by_username: string;
  created_at: string;
  applied_at: string | null;
}

const SELECT_COLUMNS =
  "id, country_code, acos_metric, band_key, target_date, slot_time, amount, status, created_by_username, created_at, applied_at";

async function requireStaff() {
  const session = await getSession();
  if (!session) return { session: null, error: "Unauthorized" as const };
  return { session, error: null };
}

export async function listAcosManualTopUps(
  countryCode: string,
  metric: AcosMetric
): Promise<{ data: AcosManualTopUp[] | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();
  const { data, error: dbError } = await client
    .from("ppc_acos_manual_topups")
    .select(SELECT_COLUMNS)
    .eq("country_code", countryCode)
    .eq("acos_metric", metric)
    .order("target_date", { ascending: true })
    .order("slot_time", { ascending: true });

  return { data, error: dbError?.message ?? null };
}

export async function createAcosManualTopUp(
  countryCode: string,
  metric: AcosMetric,
  bandKey: AcosBandKey,
  targetDate: string,
  slotTime: string,
  amount: number
): Promise<{ data: AcosManualTopUp | null; error: string | null }> {
  const { session, error } = await requireStaff();
  if (error) return { data: null, error };

  if (!ACOS_METRIC_KEYS.includes(metric)) {
    return { data: null, error: `Invalid metric: ${metric}` };
  }
  if (!ACOS_BAND_KEYS.includes(bandKey)) {
    return { data: null, error: `Invalid band: ${bandKey}` };
  }
  // All 144 ten-minute slots are legal — unlike the grids' half-hour rows.
  // Paying between the half-hour head slots is the whole point of a manual
  // top-up.
  if (!CANONICAL_SLOTS.includes(slotTime)) {
    return { data: null, error: `Invalid slot time: ${slotTime}` };
  }
  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_BAND_TOPUP_AMOUNT) {
    return { data: null, error: `Invalid amount: ${amount}` };
  }
  if (targetDate < todaySgt()) {
    return { data: null, error: "Target date can't be in the past" };
  }
  if (targetDate === todaySgt() && slotTime <= currentSlotSgt()) {
    return { data: null, error: "That slot isn't in the future anymore" };
  }

  const existsError = await assertCountryExists(countryCode);
  if (existsError) return { data: null, error: existsError };

  // A disabled band can never match a campaign's ACOS, so a row on one is
  // guaranteed to die as `expired` — refuse it with a clear message instead.
  const client = await createClient();
  const { data: bandSettings, error: bandError } = await client
    .from("ppc_acos_topup_band_settings")
    .select("enabled")
    .eq("country_code", countryCode)
    .eq("acos_metric", metric)
    .eq("band_key", bandKey)
    .maybeSingle();
  if (bandError) return { data: null, error: bandError.message };
  if (!bandSettings) {
    return { data: null, error: "This band isn't configured for this marketplace yet." };
  }
  if (!bandSettings.enabled) {
    return {
      data: null,
      error: "This band is currently disabled — a top-up on it would never fire.",
    };
  }

  const service = createServiceClient();
  const changedBy = await getStaffId(session!.username);

  const { data, error: insertError } = await service
    .from("ppc_acos_manual_topups")
    .insert({
      country_code: countryCode,
      acos_metric: metric,
      band_key: bandKey,
      target_date: targetDate,
      slot_time: slotTime,
      amount,
      created_by: changedBy,
      created_by_username: session!.username,
    })
    .select(SELECT_COLUMNS)
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      return {
        data: null,
        error:
          "A manual top-up is already scheduled for this band and slot — cancel it first.",
      };
    }
    return { data: null, error: insertError.message };
  }

  return { data, error: null };
}

export async function cancelAcosManualTopUp(
  id: string
): Promise<{ data: { ok: true } | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const service = createServiceClient();

  const { data: existing, error: fetchError } = await service
    .from("ppc_acos_manual_topups")
    .select("target_date, slot_time, status")
    .eq("id", id)
    .maybeSingle();
  if (fetchError) return { data: null, error: fetchError.message };
  if (!existing) return { data: null, error: "Top-up not found" };
  if (existing.status !== "pending") {
    return { data: null, error: "Only pending top-ups can be cancelled." };
  }
  const today = todaySgt();
  const isFuture =
    existing.target_date > today ||
    (existing.target_date === today && existing.slot_time > currentSlotSgt());
  if (!isFuture) {
    return { data: null, error: "This slot has already started — it can no longer be cancelled." };
  }

  const { data, error: deleteError } = await service
    .from("ppc_acos_manual_topups")
    .delete()
    .eq("id", id)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (deleteError) return { data: null, error: deleteError.message };
  if (!data) return { data: null, error: "Only pending top-ups can be cancelled." };

  return { data: { ok: true }, error: null };
}
