"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getSession } from "@/lib/session";
import { canAdminister } from "@/lib/roles";
import {
  ORG_LOCATION_MAX,
  ORG_NAME_MAX,
  ORG_NODE_KINDS,
  type OrgChart,
  type OrgNodeInput,
} from "@/lib/org-chart-constants";
import { getT } from "@/lib/i18n/server";
import type { MessageKey, Vars } from "@/lib/i18n/translate";

// Organization Chart. Everyone signed in can read it; only admins can change it. Reads use the RLS
// client, writes the service client after the role check below.

type Result<T> = { data: T | null; error: string | null };

async function tr(key: MessageKey, vars?: Vars): Promise<string> {
  return (await getT())(key, vars);
}

/** Server actions are callable POST endpoints, so every write re-checks the role here. */
async function requireAdmin() {
  const session = await getSession();
  if (!session) return { session: null, error: "Unauthorized" as const };
  if (!canAdminister(session.role)) return { session: null, error: "Forbidden" as const };
  return { session, error: null };
}

/** Records the edit for the chart's "As of" date. */
async function touch(username: string) {
  await createServiceClient()
    .from("org_chart_meta")
    .upsert({ id: 1, updated_at: new Date().toISOString(), updated_by: username });
}

/** Trimmed text, or null when blank. Errors when longer than `max`. */
async function cleanText(value: string | undefined | null, max: number): Promise<{ value: string | null } | { error: string }> {
  const v = (value ?? "").trim().replace(/\s+/g, " ");
  if (!v) return { value: null };
  if (v.length > max) return { error: await tr("errors.orgTextTooLong", { max }) };
  return { value: v };
}

export async function getOrgChart(): Promise<Result<OrgChart>> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const client = await createClient();
  const [deptRes, peopleRes, nodesRes, metaRes] = await Promise.all([
    client.from("org_chart_departments").select("id, name, position").order("position"),
    client.from("org_chart_people").select("id, name, location, part_time").order("name"),
    client
      .from("org_chart_nodes")
      .select("id, department_id, person_id, kind, title, note, position")
      .order("position"),
    client.from("org_chart_meta").select("updated_at").eq("id", 1).maybeSingle(),
  ]);
  const error = deptRes.error ?? peopleRes.error ?? nodesRes.error ?? metaRes.error;
  if (error) return { data: null, error: error.message };

  return {
    data: {
      departments: deptRes.data ?? [],
      people: (peopleRes.data ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        location: p.location,
        partTime: p.part_time,
      })),
      nodes: (nodesRes.data ?? []).map((n) => ({
        id: n.id,
        departmentId: n.department_id,
        personId: n.person_id,
        kind: n.kind,
        title: n.title,
        note: n.note,
        position: n.position,
      })),
      updatedAt: metaRes.data?.updated_at ?? null,
      canEdit: canAdminister(session.role),
    },
    error: null,
  };
}

// ---- Departments ----

export async function saveOrgDepartment(input: { id?: string; name: string }): Promise<Result<true>> {
  const { session, error } = await requireAdmin();
  if (!session) return { data: null, error };

  const name = await cleanText(input.name, ORG_NAME_MAX);
  if ("error" in name) return { data: null, error: name.error };
  if (!name.value) return { data: null, error: await tr("errors.orgNameRequired") };

  const db = createServiceClient();
  if (input.id) {
    const { error: e } = await db.from("org_chart_departments").update({ name: name.value }).eq("id", input.id);
    if (e) return { data: null, error: e.message };
  } else {
    const { data: last } = await db
      .from("org_chart_departments")
      .select("position")
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();
    const { error: e } = await db
      .from("org_chart_departments")
      .insert({ name: name.value, position: (last?.position ?? -1) + 1 });
    if (e) return { data: null, error: e.message };
  }
  await touch(session.username);
  return { data: true, error: null };
}

/** Deletes the column and every box in it (people stay, for other columns). */
export async function deleteOrgDepartment(id: string): Promise<Result<true>> {
  const { session, error } = await requireAdmin();
  if (!session) return { data: null, error };
  const { error: e } = await createServiceClient().from("org_chart_departments").delete().eq("id", id);
  if (e) return { data: null, error: e.message };
  await touch(session.username);
  return { data: true, error: null };
}

/** Swaps a column with its left (-1) or right (+1) neighbour. */
export async function moveOrgDepartment(id: string, direction: -1 | 1): Promise<Result<true>> {
  const { session, error } = await requireAdmin();
  if (!session) return { data: null, error };

  const db = createServiceClient();
  const { data: rows, error: e } = await db.from("org_chart_departments").select("id, position").order("position");
  if (e) return { data: null, error: e.message };
  const moved = await swapPositions(db, "org_chart_departments", rows ?? [], id, direction);
  if (moved) return { data: null, error: moved };
  await touch(session.username);
  return { data: true, error: null };
}

// ---- Boxes ----

/** Finds a person by name (case-insensitive) or creates them, then saves their location/part-time. */
async function upsertPerson(
  db: ReturnType<typeof createServiceClient>,
  name: string,
  location: string | null,
  partTime: boolean
): Promise<{ id: string } | { error: string }> {
  const { data: existing, error: findError } = await db
    .from("org_chart_people")
    .select("id")
    .ilike("name", name.replace(/[\\%_]/g, (c) => `\\${c}`))
    .maybeSingle();
  if (findError) return { error: findError.message };

  if (existing) {
    const { error } = await db
      .from("org_chart_people")
      .update({ name, location, part_time: partTime })
      .eq("id", existing.id);
    return error ? { error: error.message } : { id: existing.id };
  }
  const { data, error } = await db
    .from("org_chart_people")
    .insert({ name, location, part_time: partTime })
    .select("id")
    .single();
  return error ? { error: error.message } : { id: data.id };
}

export async function saveOrgNode(input: OrgNodeInput): Promise<Result<true>> {
  const { session, error } = await requireAdmin();
  if (!session) return { data: null, error };
  if (!ORG_NODE_KINDS.includes(input.kind)) return { data: null, error: "Forbidden" };

  const note = await cleanText(input.note, ORG_NAME_MAX);
  if ("error" in note) return { data: null, error: note.error };

  const db = createServiceClient();
  let personId: string | null = null;
  let title: string | null = null;

  if (input.kind === "open") {
    const t = await cleanText(input.title, ORG_NAME_MAX);
    if ("error" in t) return { data: null, error: t.error };
    if (!t.value) return { data: null, error: await tr("errors.orgTitleRequired") };
    title = t.value;
  } else {
    const name = await cleanText(input.personName, ORG_NAME_MAX);
    if ("error" in name) return { data: null, error: name.error };
    if (!name.value) return { data: null, error: await tr("errors.orgNameRequired") };
    const location = await cleanText(input.location, ORG_LOCATION_MAX);
    if ("error" in location) return { data: null, error: location.error };
    const person = await upsertPerson(db, name.value, location.value, !!input.partTime);
    if ("error" in person) return { data: null, error: person.error };
    personId = person.id;
  }

  const row = { department_id: input.departmentId, person_id: personId, kind: input.kind, title, note: note.value };
  if (input.id) {
    const { error: e } = await db.from("org_chart_nodes").update(row).eq("id", input.id);
    if (e) return { data: null, error: e.message };
  } else {
    const { data: last } = await db
      .from("org_chart_nodes")
      .select("position")
      .eq("department_id", input.departmentId)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();
    const { error: e } = await db.from("org_chart_nodes").insert({ ...row, position: (last?.position ?? -1) + 1 });
    if (e) return { data: null, error: e.message };
  }
  await touch(session.username);
  return { data: true, error: null };
}

export async function deleteOrgNode(id: string): Promise<Result<true>> {
  const { session, error } = await requireAdmin();
  if (!session) return { data: null, error };
  const { error: e } = await createServiceClient().from("org_chart_nodes").delete().eq("id", id);
  if (e) return { data: null, error: e.message };
  await touch(session.username);
  return { data: true, error: null };
}

/** Swaps a box with the one above (-1) or below (+1) it in the same column. */
export async function moveOrgNode(id: string, direction: -1 | 1): Promise<Result<true>> {
  const { session, error } = await requireAdmin();
  if (!session) return { data: null, error };

  const db = createServiceClient();
  const { data: node } = await db.from("org_chart_nodes").select("department_id").eq("id", id).maybeSingle();
  if (!node) return { data: null, error: "Not found" };
  const { data: rows, error: e } = await db
    .from("org_chart_nodes")
    .select("id, position")
    .eq("department_id", node.department_id)
    .order("position");
  if (e) return { data: null, error: e.message };
  const moved = await swapPositions(db, "org_chart_nodes", rows ?? [], id, direction);
  if (moved) return { data: null, error: moved };
  await touch(session.username);
  return { data: true, error: null };
}

// ---- People ----

export async function updateOrgPerson(input: {
  id: string;
  name: string;
  location: string;
  partTime: boolean;
}): Promise<Result<true>> {
  const { session, error } = await requireAdmin();
  if (!session) return { data: null, error };

  const name = await cleanText(input.name, ORG_NAME_MAX);
  if ("error" in name) return { data: null, error: name.error };
  if (!name.value) return { data: null, error: await tr("errors.orgNameRequired") };
  const location = await cleanText(input.location, ORG_LOCATION_MAX);
  if ("error" in location) return { data: null, error: location.error };

  const { error: e } = await createServiceClient()
    .from("org_chart_people")
    .update({ name: name.value, location: location.value, part_time: input.partTime })
    .eq("id", input.id);
  if (e?.code === "23505") return { data: null, error: await tr("errors.orgPersonExists") };
  if (e) return { data: null, error: e.message };
  await touch(session.username);
  return { data: true, error: null };
}

/** Removes the person and every box they're in. */
export async function deleteOrgPerson(id: string): Promise<Result<true>> {
  const { session, error } = await requireAdmin();
  if (!session) return { data: null, error };
  const { error: e } = await createServiceClient().from("org_chart_people").delete().eq("id", id);
  if (e) return { data: null, error: e.message };
  await touch(session.username);
  return { data: true, error: null };
}

// ---- Helpers ----

/** Swaps `id`'s position with its neighbour in `rows` (already sorted). Returns an error message or null. */
async function swapPositions(
  db: ReturnType<typeof createServiceClient>,
  table: "org_chart_departments" | "org_chart_nodes",
  rows: { id: string; position: number }[],
  id: string,
  direction: -1 | 1
): Promise<string | null> {
  const index = rows.findIndex((r) => r.id === id);
  const other = rows[index + direction];
  if (index === -1 || !other) return null;
  // Re-number by index first, so equal or gapped positions still swap cleanly.
  const a = index;
  const b = index + direction;
  const results = await Promise.all([
    db.from(table).update({ position: b }).eq("id", id),
    db.from(table).update({ position: a }).eq("id", other.id),
    ...rows
      .map((r, i) => ({ r, i }))
      .filter(({ r, i }) => i !== a && i !== b && r.position !== i)
      .map(({ r, i }) => db.from(table).update({ position: i }).eq("id", r.id)),
  ]);
  return results.find((r) => r.error)?.error?.message ?? null;
}
