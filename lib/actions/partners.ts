"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getSession } from "@/lib/session";
import { getMyPermissions } from "@/lib/permissions";
import { isAllowed } from "@/lib/roles";
import { SHORT_NAME_MAX, validFieldKeys, type PartnerKind } from "@/lib/partners-constants";

export interface Partner {
  id: string;
  kind: PartnerKind;
  short_name: string;
  sort_order: number;
  fields: Record<string, string>;
}

type Result<T> = { data: T | null; error: string | null };

/**
 * Server actions are independently callable POST endpoints, so each one re-checks the same
 * item access the page's layout.tsx guard enforces on navigation.
 */
async function requirePartnersAccess() {
  const session = await getSession();
  if (!session) return { session: null, error: "Unauthorized" as const };

  const { role, permissions } = await getMyPermissions();
  if (!isAllowed(role, permissions, "supplyChain", "partners")) {
    return { session: null, error: "Forbidden" as const };
  }
  return { session, error: null };
}

function cleanShortName(name: string): { name: string | null; error: string | null } {
  const trimmed = name.trim();
  if (!trimmed) return { name: null, error: "Enter a short name" };
  if (trimmed.length > SHORT_NAME_MAX) {
    return { name: null, error: `Short name must be ${SHORT_NAME_MAX} characters or fewer` };
  }
  return { name: trimmed, error: null };
}

function friendlyError(message: string, code?: string): string {
  return code === "23505" ? "A partner with that short name already exists" : message;
}

export async function listPartners(): Promise<Result<Partner[]>> {
  const { error } = await requirePartnersAccess();
  if (error) return { data: null, error };

  const client = await createClient();
  const [partnersRes, fieldsRes] = await Promise.all([
    client.from("supply_partners").select("id, kind, short_name, sort_order").order("sort_order"),
    client.from("supply_partner_fields").select("partner_id, field_key, value"),
  ]);
  if (partnersRes.error) return { data: null, error: partnersRes.error.message };
  if (fieldsRes.error) return { data: null, error: fieldsRes.error.message };

  const byId = new Map<string, Partner>();
  for (const p of partnersRes.data ?? []) {
    byId.set(p.id, { ...(p as Omit<Partner, "fields">), fields: {} });
  }
  for (const f of fieldsRes.data ?? []) {
    const partner = byId.get(f.partner_id);
    if (partner) partner.fields[f.field_key] = f.value;
  }
  return { data: [...byId.values()], error: null };
}

export async function createPartner(kind: PartnerKind, shortName: string): Promise<Result<null>> {
  const { session, error } = await requirePartnersAccess();
  if (error) return { data: null, error };
  if (kind !== "factory" && kind !== "forwarder") return { data: null, error: "Invalid partner type" };

  const { name, error: nameError } = cleanShortName(shortName);
  if (nameError) return { data: null, error: nameError };

  const service = createServiceClient();
  const { data: last } = await service
    .from("supply_partners")
    .select("sort_order")
    .eq("kind", kind)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error: dbError } = await service.from("supply_partners").insert({
    kind,
    short_name: name,
    sort_order: (last?.sort_order ?? -1) + 1,
    updated_by: session.username,
  });
  if (dbError) return { data: null, error: friendlyError(dbError.message, dbError.code) };
  return { data: null, error: null };
}

export async function renamePartner(id: string, shortName: string): Promise<Result<null>> {
  const { session, error } = await requirePartnersAccess();
  if (error) return { data: null, error };

  const { name, error: nameError } = cleanShortName(shortName);
  if (nameError) return { data: null, error: nameError };

  const service = createServiceClient();
  const { error: dbError } = await service
    .from("supply_partners")
    .update({ short_name: name, updated_at: new Date().toISOString(), updated_by: session.username })
    .eq("id", id);
  if (dbError) return { data: null, error: friendlyError(dbError.message, dbError.code) };
  return { data: null, error: null };
}

export async function deletePartner(id: string): Promise<Result<null>> {
  const { error } = await requirePartnersAccess();
  if (error) return { data: null, error };

  const service = createServiceClient();
  const { error: dbError } = await service.from("supply_partners").delete().eq("id", id);
  if (dbError) return { data: null, error: dbError.message };
  return { data: null, error: null };
}

/** Swaps sort_order with the neighbouring partner of the same kind. */
export async function movePartner(id: string, direction: "left" | "right"): Promise<Result<null>> {
  const { error } = await requirePartnersAccess();
  if (error) return { data: null, error };

  const service = createServiceClient();
  const { data: current, error: curError } = await service
    .from("supply_partners")
    .select("id, kind, sort_order")
    .eq("id", id)
    .single();
  if (curError || !current) return { data: null, error: curError?.message ?? "Partner not found" };

  const left = direction === "left";
  const { data: neighbour } = await service
    .from("supply_partners")
    .select("id, sort_order")
    .eq("kind", current.kind)
    [left ? "lt" : "gt"]("sort_order", current.sort_order)
    .order("sort_order", { ascending: !left })
    .limit(1)
    .maybeSingle();
  if (!neighbour) return { data: null, error: null };

  const [a, b] = await Promise.all([
    service.from("supply_partners").update({ sort_order: neighbour.sort_order }).eq("id", current.id),
    service.from("supply_partners").update({ sort_order: current.sort_order }).eq("id", neighbour.id),
  ]);
  const dbError = a.error ?? b.error;
  if (dbError) return { data: null, error: dbError.message };
  return { data: null, error: null };
}

/** Upserts one cell. An empty value deletes it, so blank cells never linger as "" rows. */
export async function setPartnerField(
  id: string,
  fieldKey: string,
  value: string
): Promise<Result<null>> {
  const { session, error } = await requirePartnersAccess();
  if (error) return { data: null, error };

  const service = createServiceClient();
  const { data: partner, error: pError } = await service
    .from("supply_partners")
    .select("kind")
    .eq("id", id)
    .single();
  if (pError || !partner) return { data: null, error: pError?.message ?? "Partner not found" };
  if (!validFieldKeys(partner.kind as PartnerKind).has(fieldKey)) {
    return { data: null, error: "Unknown field" };
  }

  const trimmed = value.trim();
  const { error: dbError } = trimmed
    ? await service.from("supply_partner_fields").upsert({
        partner_id: id,
        field_key: fieldKey,
        value: trimmed,
        updated_at: new Date().toISOString(),
        updated_by: session.username,
      })
    : await service
        .from("supply_partner_fields")
        .delete()
        .eq("partner_id", id)
        .eq("field_key", fieldKey);
  if (dbError) return { data: null, error: dbError.message };
  return { data: null, error: null };
}
