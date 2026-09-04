"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getSession } from "@/lib/session";
import { TASK_COLORS, type TaskColorKey, type CalendarRole, type CalendarMemberRole, CALENDAR_MEMBER_ROLES } from "@/lib/calendar-constants";

const MAX_NAME_LENGTH = 60;

export interface CalendarSummary {
  id: string;
  name: string;
  ownerUsername: string;
  myRole: CalendarRole;
  createdAt: string;
}

export interface CalendarMember {
  username: string;
  role: CalendarMemberRole;
  addedAt: string;
}

export interface CalendarTask {
  id: string;
  calendarId: string;
  calendarName: string;
  title: string;
  notes: string | null;
  eventDate: string;
  dueDate: string | null;
  color: TaskColorKey;
  createdBy: string;
  assignees: string[];
  createdAt: string;
}

export interface TaskInput {
  calendarId: string;
  title: string;
  notes?: string | null;
  eventDate: string;
  dueDate?: string | null;
  color: TaskColorKey;
  assigneeUsernames?: string[];
}

export interface TaskUpdate {
  title?: string;
  notes?: string | null;
  eventDate?: string;
  dueDate?: string | null;
  color?: TaskColorKey;
  assigneeUsernames?: string[];
}

type AccessResult = { role: CalendarRole; ownerUsername: string } | { error: string };

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

async function requireCalendarAccess(
  client: SupabaseServerClient,
  calendarId: string,
  username: string
): Promise<AccessResult> {
  const { data: cal, error } = await client
    .from("calendars")
    .select("owner_username")
    .eq("id", calendarId)
    .maybeSingle();
  if (error) return { error: error.message };
  if (!cal) return { error: "Calendar not found" };
  if (cal.owner_username === username) {
    return { role: "owner", ownerUsername: cal.owner_username };
  }

  const { data: member, error: memberError } = await client
    .from("calendar_members")
    .select("role")
    .eq("calendar_id", calendarId)
    .eq("username", username)
    .maybeSingle();
  if (memberError) return { error: memberError.message };
  if (!member) return { error: "You don't have access to this calendar" };

  return { role: member.role as CalendarRole, ownerUsername: cal.owner_username };
}

async function requireEditorAccess(
  client: SupabaseServerClient,
  calendarId: string,
  username: string
): Promise<AccessResult> {
  const access = await requireCalendarAccess(client, calendarId, username);
  if ("error" in access) return access;
  if (access.role === "viewer") return { error: "You only have view access to this calendar" };
  return access;
}

/** Every calendar the user can see (owned + shared-with-them), keyed by id. */
async function getAccessibleCalendarMap(
  client: SupabaseServerClient,
  username: string
): Promise<Map<string, { role: CalendarRole; name: string; ownerUsername: string }>> {
  const map = new Map<string, { role: CalendarRole; name: string; ownerUsername: string }>();

  const [{ data: owned }, { data: memberRows }] = await Promise.all([
    client.from("calendars").select("id, name, owner_username").eq("owner_username", username),
    client
      .from("calendar_members")
      .select("role, calendars(id, name, owner_username)")
      .eq("username", username),
  ]);

  (owned ?? []).forEach((c) => {
    map.set(c.id, { role: "owner", name: c.name, ownerUsername: c.owner_username });
  });
  (memberRows ?? []).forEach((r) => {
    const cal = Array.isArray(r.calendars) ? r.calendars[0] : r.calendars;
    if (cal) {
      map.set(cal.id, {
        role: r.role as CalendarRole,
        name: cal.name,
        ownerUsername: cal.owner_username,
      });
    }
  });

  return map;
}

async function loadAssignees(
  client: SupabaseServerClient,
  taskIds: string[]
): Promise<Map<string, string[]>> {
  const assigneesByTask = new Map<string, string[]>();
  if (taskIds.length === 0) return assigneesByTask;

  const { data } = await client
    .from("calendar_task_assignees")
    .select("task_id, username")
    .in("task_id", taskIds);

  (data ?? []).forEach((row) => {
    const list = assigneesByTask.get(row.task_id) ?? [];
    list.push(row.username);
    assigneesByTask.set(row.task_id, list);
  });

  return assigneesByTask;
}

// ---- Calendars ----

export async function getMyCalendars(): Promise<{ data: CalendarSummary[] | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const client = await createClient();
  const accessible = await getAccessibleCalendarMap(client, session.username);

  const data: CalendarSummary[] = Array.from(accessible.entries()).map(([id, c]) => ({
    id,
    name: c.name,
    ownerUsername: c.ownerUsername,
    myRole: c.role,
    createdAt: "",
  }));

  // Fetch created_at separately (kept out of the map above to avoid widening
  // its type for a field only this list needs) and merge, owned-first.
  const { data: rows } = await client
    .from("calendars")
    .select("id, created_at")
    .in("id", data.map((c) => c.id));
  const createdAtById = new Map((rows ?? []).map((r) => [r.id, r.created_at]));
  const withDates = data.map((c) => ({ ...c, createdAt: createdAtById.get(c.id) ?? "" }));
  withDates.sort((a, b) => {
    if (a.myRole === "owner" && b.myRole !== "owner") return -1;
    if (a.myRole !== "owner" && b.myRole === "owner") return 1;
    return a.createdAt.localeCompare(b.createdAt);
  });

  return { data: withDates, error: null };
}

export async function createCalendar(
  name: string
): Promise<{ data: CalendarSummary | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const trimmed = name.trim();
  if (!trimmed) return { data: null, error: "Calendar name is required" };
  if (trimmed.length > MAX_NAME_LENGTH) return { data: null, error: "Calendar name is too long" };

  const service = createServiceClient();
  const { data, error } = await service
    .from("calendars")
    .insert({ owner_username: session.username, name: trimmed })
    .select("id, name, owner_username, created_at")
    .single();
  if (error) return { data: null, error: error.message };

  return {
    data: {
      id: data.id,
      name: data.name,
      ownerUsername: data.owner_username,
      myRole: "owner",
      createdAt: data.created_at,
    },
    error: null,
  };
}

export async function renameCalendar(
  calendarId: string,
  name: string
): Promise<{ data: { ok: true } | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const trimmed = name.trim();
  if (!trimmed) return { data: null, error: "Calendar name is required" };
  if (trimmed.length > MAX_NAME_LENGTH) return { data: null, error: "Calendar name is too long" };

  const service = createServiceClient();
  const { data, error } = await service
    .from("calendars")
    .update({ name: trimmed })
    .eq("id", calendarId)
    .eq("owner_username", session.username)
    .select("id")
    .maybeSingle();
  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: "Only the calendar owner can rename it" };

  return { data: { ok: true }, error: null };
}

export async function deleteCalendar(
  calendarId: string
): Promise<{ data: { ok: true } | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const service = createServiceClient();
  const { data, error } = await service
    .from("calendars")
    .delete()
    .eq("id", calendarId)
    .eq("owner_username", session.username)
    .select("id")
    .maybeSingle();
  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: "Only the calendar owner can delete it" };

  return { data: { ok: true }, error: null };
}

// ---- Calendar members (per-calendar sharing) ----

export async function getCalendarMembers(
  calendarId: string
): Promise<{ data: CalendarMember[] | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const client = await createClient();
  const access = await requireCalendarAccess(client, calendarId, session.username);
  if ("error" in access) return { data: null, error: access.error };

  const { data, error } = await client
    .from("calendar_members")
    .select("username, role, added_at")
    .eq("calendar_id", calendarId)
    .order("added_at", { ascending: true });
  if (error) return { data: null, error: error.message };

  return {
    data: data.map((m) => ({
      username: m.username,
      role: m.role as CalendarMemberRole,
      addedAt: m.added_at,
    })),
    error: null,
  };
}

export async function addCalendarMember(
  calendarId: string,
  username: string,
  role: CalendarMemberRole
): Promise<{ data: { ok: true } | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const normalized = username.trim().toLowerCase();
  if (!normalized) return { data: null, error: "Username is required" };
  if (!CALENDAR_MEMBER_ROLES.includes(role)) return { data: null, error: "Invalid role" };
  if (normalized === session.username) {
    return { data: null, error: "You already own this calendar" };
  }

  const client = await createClient();
  const { data: cal, error: calError } = await client
    .from("calendars")
    .select("owner_username")
    .eq("id", calendarId)
    .maybeSingle();
  if (calError) return { data: null, error: calError.message };
  if (!cal) return { data: null, error: "Calendar not found" };
  if (cal.owner_username !== session.username) {
    return { data: null, error: "Only the calendar owner can manage access" };
  }

  const { data: staffRow, error: staffError } = await client
    .from("staff")
    .select("username")
    .eq("username", normalized)
    .maybeSingle();
  if (staffError) return { data: null, error: staffError.message };
  if (!staffRow) return { data: null, error: "No staff member with that username" };

  const service = createServiceClient();
  const { error: insertError } = await service
    .from("calendar_members")
    .insert({ calendar_id: calendarId, username: normalized, role });
  if (insertError) {
    if (insertError.code === "23505") return { data: null, error: "That person already has access" };
    return { data: null, error: insertError.message };
  }

  return { data: { ok: true }, error: null };
}

export async function updateCalendarMemberRole(
  calendarId: string,
  username: string,
  role: CalendarMemberRole
): Promise<{ data: { ok: true } | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };
  if (!CALENDAR_MEMBER_ROLES.includes(role)) return { data: null, error: "Invalid role" };

  const client = await createClient();
  const { data: cal, error: calError } = await client
    .from("calendars")
    .select("owner_username")
    .eq("id", calendarId)
    .maybeSingle();
  if (calError) return { data: null, error: calError.message };
  if (!cal || cal.owner_username !== session.username) {
    return { data: null, error: "Only the calendar owner can manage access" };
  }

  const service = createServiceClient();
  const { data, error } = await service
    .from("calendar_members")
    .update({ role })
    .eq("calendar_id", calendarId)
    .eq("username", username)
    .select("username")
    .maybeSingle();
  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: "That person doesn't have access to this calendar" };

  return { data: { ok: true }, error: null };
}

export async function removeCalendarMember(
  calendarId: string,
  username: string
): Promise<{ data: { ok: true } | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const client = await createClient();
  const { data: cal, error: calError } = await client
    .from("calendars")
    .select("owner_username")
    .eq("id", calendarId)
    .maybeSingle();
  if (calError) return { data: null, error: calError.message };
  if (!cal || cal.owner_username !== session.username) {
    return { data: null, error: "Only the calendar owner can manage access" };
  }

  const service = createServiceClient();
  const { error } = await service
    .from("calendar_members")
    .delete()
    .eq("calendar_id", calendarId)
    .eq("username", username);
  if (error) return { data: null, error: error.message };

  return { data: { ok: true }, error: null };
}

// ---- Tasks ----

function toCalendarTask(
  row: {
    id: string;
    calendar_id: string;
    title: string;
    notes: string | null;
    event_date: string;
    due_date: string | null;
    color: string;
    created_by: string;
    created_at: string;
  },
  calendarName: string,
  assignees: string[]
): CalendarTask {
  return {
    id: row.id,
    calendarId: row.calendar_id,
    calendarName,
    title: row.title,
    notes: row.notes,
    eventDate: row.event_date,
    dueDate: row.due_date,
    color: row.color as TaskColorKey,
    createdBy: row.created_by,
    assignees,
    createdAt: row.created_at,
  };
}

export async function getTasksForRange(
  calendarIds: string[],
  startDate: string,
  endDate: string
): Promise<{ data: CalendarTask[] | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const client = await createClient();
  const accessible = await getAccessibleCalendarMap(client, session.username);
  const targetIds = calendarIds.filter((id) => accessible.has(id));
  if (targetIds.length === 0) return { data: [], error: null };

  const { data: tasks, error } = await client
    .from("calendar_tasks")
    .select("id, calendar_id, title, notes, event_date, due_date, color, created_by, created_at")
    .in("calendar_id", targetIds)
    .or(
      `and(event_date.gte.${startDate},event_date.lte.${endDate}),and(due_date.gte.${startDate},due_date.lte.${endDate})`
    );
  if (error) return { data: null, error: error.message };

  const assigneesByTask = await loadAssignees(client, (tasks ?? []).map((t) => t.id));

  const result = (tasks ?? []).map((t) =>
    toCalendarTask(t, accessible.get(t.calendar_id)?.name ?? "", assigneesByTask.get(t.id) ?? [])
  );

  return { data: result, error: null };
}

/** Tasks in the next 7 days, either created by or assigned to the caller. */
export async function getUpcomingTasks(): Promise<{ data: CalendarTask[] | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const client = await createClient();
  const accessible = await getAccessibleCalendarMap(client, session.username);
  const calendarIds = Array.from(accessible.keys());
  if (calendarIds.length === 0) return { data: [], error: null };

  const now = new Date();
  const start = now.toISOString().slice(0, 10);
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + 7);
  const end = endDate.toISOString().slice(0, 10);

  const { data: tasks, error } = await client
    .from("calendar_tasks")
    .select("id, calendar_id, title, notes, event_date, due_date, color, created_by, created_at")
    .in("calendar_id", calendarIds)
    .or(`and(event_date.gte.${start},event_date.lte.${end}),and(due_date.gte.${start},due_date.lte.${end})`);
  if (error) return { data: null, error: error.message };

  const assigneesByTask = await loadAssignees(client, (tasks ?? []).map((t) => t.id));

  const relevant = (tasks ?? []).filter(
    (t) => t.created_by === session.username || (assigneesByTask.get(t.id) ?? []).includes(session.username)
  );

  const result = relevant.map((t) =>
    toCalendarTask(t, accessible.get(t.calendar_id)?.name ?? "", assigneesByTask.get(t.id) ?? [])
  );

  // Sort by whichever of the task's dates actually falls in the window (a
  // due date far past the window shouldn't out-rank a near-term event date).
  function relevantDate(t: CalendarTask): string {
    const candidates = [t.eventDate, t.dueDate].filter(
      (d): d is string => !!d && d >= start && d <= end
    );
    candidates.sort();
    return candidates[0] ?? t.eventDate;
  }
  result.sort((a, b) => relevantDate(a).localeCompare(relevantDate(b)));

  return { data: result, error: null };
}

async function assertAssigneesAllowed(
  client: SupabaseServerClient,
  calendarId: string,
  ownerUsername: string,
  assignees: string[]
): Promise<string | null> {
  if (assignees.length === 0) return null;
  const { data: members } = await client
    .from("calendar_members")
    .select("username")
    .eq("calendar_id", calendarId);
  const allowed = new Set([ownerUsername, ...(members ?? []).map((m) => m.username)]);
  if (assignees.some((u) => !allowed.has(u))) {
    return "Can only assign people with access to this calendar";
  }
  return null;
}

export async function createTask(
  input: TaskInput
): Promise<{ data: CalendarTask | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const title = input.title.trim();
  if (!title) return { data: null, error: "Title is required" };
  if (!input.eventDate) return { data: null, error: "Date is required" };
  if (!TASK_COLORS.some((c) => c.key === input.color)) return { data: null, error: "Invalid color" };
  if (input.dueDate && input.dueDate < input.eventDate) {
    return { data: null, error: "Due date can't be before the pinned date" };
  }

  const client = await createClient();
  const access = await requireEditorAccess(client, input.calendarId, session.username);
  if ("error" in access) return { data: null, error: access.error };

  const assignees = Array.from(new Set(input.assigneeUsernames ?? []));
  const assigneeError = await assertAssigneesAllowed(client, input.calendarId, access.ownerUsername, assignees);
  if (assigneeError) return { data: null, error: assigneeError };

  const service = createServiceClient();
  const { data: task, error } = await service
    .from("calendar_tasks")
    .insert({
      calendar_id: input.calendarId,
      title,
      notes: input.notes?.trim() || null,
      event_date: input.eventDate,
      due_date: input.dueDate || null,
      color: input.color,
      created_by: session.username,
    })
    .select("id, calendar_id, title, notes, event_date, due_date, color, created_by, created_at")
    .single();
  if (error) return { data: null, error: error.message };

  if (assignees.length > 0) {
    const { error: assigneeInsertError } = await service
      .from("calendar_task_assignees")
      .insert(assignees.map((username) => ({ task_id: task.id, username })));
    if (assigneeInsertError) return { data: null, error: assigneeInsertError.message };
  }

  return { data: toCalendarTask(task, "", assignees), error: null };
}

export async function updateTask(
  taskId: string,
  updates: TaskUpdate
): Promise<{ data: { ok: true } | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const client = await createClient();
  const { data: existing, error: fetchError } = await client
    .from("calendar_tasks")
    .select("id, calendar_id, event_date, due_date")
    .eq("id", taskId)
    .maybeSingle();
  if (fetchError) return { data: null, error: fetchError.message };
  if (!existing) return { data: null, error: "Task not found" };

  const access = await requireEditorAccess(client, existing.calendar_id, session.username);
  if ("error" in access) return { data: null, error: access.error };

  const nextEventDate = updates.eventDate ?? existing.event_date;
  const nextDueDate = updates.dueDate === undefined ? existing.due_date : updates.dueDate;
  if (nextDueDate && nextDueDate < nextEventDate) {
    return { data: null, error: "Due date can't be before the pinned date" };
  }
  if (updates.color !== undefined && !TASK_COLORS.some((c) => c.key === updates.color)) {
    return { data: null, error: "Invalid color" };
  }

  const patch: Record<string, unknown> = {};
  if (updates.title !== undefined) {
    const title = updates.title.trim();
    if (!title) return { data: null, error: "Title is required" };
    patch.title = title;
  }
  if (updates.notes !== undefined) patch.notes = updates.notes?.trim() || null;
  if (updates.eventDate !== undefined) patch.event_date = updates.eventDate;
  if (updates.dueDate !== undefined) patch.due_date = updates.dueDate || null;
  if (updates.color !== undefined) patch.color = updates.color;

  const service = createServiceClient();

  if (Object.keys(patch).length > 0) {
    const { error: updateError } = await service.from("calendar_tasks").update(patch).eq("id", taskId);
    if (updateError) return { data: null, error: updateError.message };
  }

  if (updates.assigneeUsernames !== undefined) {
    const assignees = Array.from(new Set(updates.assigneeUsernames));
    const assigneeError = await assertAssigneesAllowed(
      client,
      existing.calendar_id,
      access.ownerUsername,
      assignees
    );
    if (assigneeError) return { data: null, error: assigneeError };

    const { error: deleteError } = await service.from("calendar_task_assignees").delete().eq("task_id", taskId);
    if (deleteError) return { data: null, error: deleteError.message };
    if (assignees.length > 0) {
      const { error: insertError } = await service
        .from("calendar_task_assignees")
        .insert(assignees.map((username) => ({ task_id: taskId, username })));
      if (insertError) return { data: null, error: insertError.message };
    }
  }

  return { data: { ok: true }, error: null };
}

export async function deleteTask(
  taskId: string
): Promise<{ data: { ok: true } | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const client = await createClient();
  const { data: existing, error: fetchError } = await client
    .from("calendar_tasks")
    .select("calendar_id")
    .eq("id", taskId)
    .maybeSingle();
  if (fetchError) return { data: null, error: fetchError.message };
  if (!existing) return { data: null, error: "Task not found" };

  const access = await requireEditorAccess(client, existing.calendar_id, session.username);
  if ("error" in access) return { data: null, error: access.error };

  const service = createServiceClient();
  const { error } = await service.from("calendar_tasks").delete().eq("id", taskId);
  if (error) return { data: null, error: error.message };

  return { data: { ok: true }, error: null };
}
