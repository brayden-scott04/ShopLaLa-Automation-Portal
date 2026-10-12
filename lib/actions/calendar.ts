"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getSession } from "@/lib/session";
import {
  TASK_COLORS,
  REPEAT_FREQS,
  type TaskColorKey,
  type CalendarRole,
  type CalendarMemberRole,
  type RepeatRule,
  type TaskException,
  CALENDAR_MEMBER_ROLES,
} from "@/lib/calendar-constants";
import { addDays, diffDays } from "@/lib/calendar-date-utils";
import { expandTask } from "@/lib/calendar-recurrence";

const TASK_COLUMNS =
  "id, calendar_id, title, notes, event_date, due_date, color, created_by, created_at, repeat_freq, repeat_interval, repeat_weekdays, repeat_until, repeat_month_week, repeat_month_weekday, start_time, end_time";

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
  repeat: RepeatRule | null;
  /** "HH:MM"; null start = all-day. End time is only ever set alongside a start time. */
  startTime: string | null;
  endTime: string | null;
  /** Set on expanded occurrences of a recurring task: the occurrence's own start date. */
  occurrenceDate?: string;
  /** On occurrences: the series' own anchor dates (what the edit form must show). */
  seriesEventDate?: string;
  seriesDueDate?: string | null;
  /** On a series row: per-occurrence edits/removals keyed by occurrence date. */
  exceptions?: Record<string, TaskException>;
  /** On an occurrence: it carries edits that differ from the series. */
  isException?: boolean;
}

export type DeleteScope = "this" | "following" | "all";

export interface OccurrenceUpdate {
  title: string;
  notes: string | null;
  startTime: string | null;
  endTime: string | null;
}

export interface TaskInput {
  calendarId: string;
  title: string;
  notes?: string | null;
  eventDate: string;
  dueDate?: string | null;
  color: TaskColorKey;
  assigneeUsernames?: string[];
  repeat?: RepeatRule | null;
  startTime?: string | null;
  endTime?: string | null;
}

export interface TaskUpdate {
  title?: string;
  notes?: string | null;
  eventDate?: string;
  dueDate?: string | null;
  color?: TaskColorKey;
  assigneeUsernames?: string[];
  repeat?: RepeatRule | null;
  startTime?: string | null;
  endTime?: string | null;
}

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

function validateTimes(
  startTime: string | null | undefined,
  endTime: string | null | undefined,
  eventDate: string,
  dueDate: string | null | undefined
): string | null {
  if (startTime && !TIME_RE.test(startTime)) return "Invalid start time";
  if (endTime && !TIME_RE.test(endTime)) return "Invalid end time";
  if (endTime && !startTime) return "Set a start time before an end time";
  const sameDay = !dueDate || dueDate === eventDate;
  if (startTime && endTime && sameDay && endTime < startTime) return "End time can't be before the start time";
  return null;
}

function validateRepeat(repeat: RepeatRule | null | undefined, eventDate: string): string | null {
  if (!repeat) return null;
  if (!REPEAT_FREQS.includes(repeat.freq)) return "Invalid repeat frequency";
  if (!Number.isInteger(repeat.interval) || repeat.interval < 1 || repeat.interval > 999) {
    return "Repeat interval must be at least 1";
  }
  if (repeat.weekdays && repeat.weekdays.some((d) => !Number.isInteger(d) || d < 0 || d > 6)) {
    return "Invalid repeat weekdays";
  }
  if (repeat.until && repeat.until < eventDate) return "Repeat end can't be before the start date";
  if (repeat.monthWeek != null || repeat.monthWeekday != null) {
    if (repeat.freq !== "monthly") return "Nth-weekday only applies to monthly repeats";
    if (repeat.monthWeek == null || ![1, 2, 3, 4, -1].includes(repeat.monthWeek)) return "Invalid week of month";
    if (repeat.monthWeekday == null || !Number.isInteger(repeat.monthWeekday) || repeat.monthWeekday < 0 || repeat.monthWeekday > 6) {
      return "Invalid weekday";
    }
  }
  return null;
}

function repeatColumns(repeat: RepeatRule | null | undefined) {
  if (!repeat) {
    return {
      repeat_freq: null,
      repeat_interval: 1,
      repeat_weekdays: null,
      repeat_until: null,
      repeat_month_week: null,
      repeat_month_weekday: null,
    };
  }
  const nth = repeat.freq === "monthly" && repeat.monthWeek != null && repeat.monthWeekday != null;
  return {
    repeat_freq: repeat.freq,
    repeat_interval: repeat.interval,
    repeat_weekdays: repeat.freq === "weekly" && repeat.weekdays?.length ? repeat.weekdays : null,
    repeat_until: repeat.until || null,
    repeat_month_week: nth ? repeat.monthWeek : null,
    repeat_month_weekday: nth ? repeat.monthWeekday : null,
  };
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

interface AccessibleCalendar {
  role: CalendarRole;
  name: string;
  ownerUsername: string;
  createdAt: string;
}

/** Every calendar the user can see (owned + shared-with-them), keyed by id. */
async function getAccessibleCalendarMap(
  client: SupabaseServerClient,
  username: string
): Promise<Map<string, AccessibleCalendar>> {
  const map = new Map<string, AccessibleCalendar>();

  const [{ data: owned }, { data: memberRows }] = await Promise.all([
    client.from("calendars").select("id, name, owner_username, created_at").eq("owner_username", username),
    client
      .from("calendar_members")
      .select("role, calendars(id, name, owner_username, created_at)")
      .eq("username", username),
  ]);

  (owned ?? []).forEach((c) => {
    map.set(c.id, { role: "owner", name: c.name, ownerUsername: c.owner_username, createdAt: c.created_at });
  });
  (memberRows ?? []).forEach((r) => {
    const cal = Array.isArray(r.calendars) ? r.calendars[0] : r.calendars;
    if (cal) {
      map.set(cal.id, {
        role: r.role as CalendarRole,
        name: cal.name,
        ownerUsername: cal.owner_username,
        createdAt: cal.created_at,
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

/** Per-occurrence edits/removals for the given series, keyed by task id then occurrence date. */
async function loadExceptions(
  client: SupabaseServerClient,
  taskIds: string[]
): Promise<Map<string, Record<string, TaskException>>> {
  const byTask = new Map<string, Record<string, TaskException>>();
  if (taskIds.length === 0) return byTask;

  const { data } = await client
    .from("calendar_task_exceptions")
    .select("task_id, occurrence_date, is_deleted, title, notes, time_overridden, start_time, end_time")
    .in("task_id", taskIds);

  (data ?? []).forEach((row) => {
    const map = byTask.get(row.task_id) ?? {};
    map[row.occurrence_date] = {
      isDeleted: row.is_deleted,
      title: row.title,
      notes: row.notes,
      timeOverridden: row.time_overridden,
      startTime: row.start_time ? row.start_time.slice(0, 5) : null,
      endTime: row.end_time ? row.end_time.slice(0, 5) : null,
    };
    byTask.set(row.task_id, map);
  });

  return byTask;
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
    createdAt: c.createdAt,
  }));

  data.sort((a, b) => {
    if (a.myRole === "owner" && b.myRole !== "owner") return -1;
    if (a.myRole !== "owner" && b.myRole === "owner") return 1;
    return a.createdAt.localeCompare(b.createdAt);
  });

  return { data, error: null };
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

export async function addCalendarMembers(
  calendarId: string,
  usernames: string[],
  role: CalendarMemberRole
): Promise<{ data: { added: number } | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };
  if (!CALENDAR_MEMBER_ROLES.includes(role)) return { data: null, error: "Invalid role" };

  const normalized = Array.from(new Set(usernames.map((u) => u.trim().toLowerCase()).filter(Boolean))).filter(
    (u) => u !== session.username
  );
  if (normalized.length === 0) return { data: null, error: "Select at least one person" };

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

  const { data: staffRows, error: staffError } = await client
    .from("staff")
    .select("username")
    .in("username", normalized);
  if (staffError) return { data: null, error: staffError.message };
  const valid = (staffRows ?? []).map((s) => s.username);
  if (valid.length === 0) return { data: null, error: "No matching staff members" };

  const service = createServiceClient();
  const { error: insertError } = await service
    .from("calendar_members")
    .upsert(
      valid.map((username) => ({ calendar_id: calendarId, username, role })),
      { onConflict: "calendar_id,username", ignoreDuplicates: true }
    );
  if (insertError) return { data: null, error: insertError.message };

  return { data: { added: valid.length }, error: null };
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
    repeat_freq: string | null;
    repeat_interval: number | null;
    repeat_weekdays: number[] | null;
    repeat_until: string | null;
    repeat_month_week: number | null;
    repeat_month_weekday: number | null;
    start_time: string | null;
    end_time: string | null;
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
    startTime: row.start_time ? row.start_time.slice(0, 5) : null,
    endTime: row.end_time ? row.end_time.slice(0, 5) : null,
    repeat: row.repeat_freq
      ? {
          freq: row.repeat_freq as RepeatRule["freq"],
          interval: row.repeat_interval ?? 1,
          weekdays: row.repeat_weekdays,
          until: row.repeat_until,
          monthWeek: row.repeat_month_week,
          monthWeekday: row.repeat_month_weekday,
        }
      : null,
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
    .select(TASK_COLUMNS)
    .in("calendar_id", targetIds)
    .or(
      `and(event_date.gte.${startDate},event_date.lte.${endDate}),and(event_date.lte.${endDate},due_date.gte.${startDate}),and(repeat_freq.not.is.null,event_date.lte.${endDate})`
    );
  if (error) return { data: null, error: error.message };

  const rows = (tasks ?? []).filter((t) => !t.repeat_freq || !t.repeat_until || t.repeat_until >= startDate);
  const assigneesByTask = await loadAssignees(client, rows.map((t) => t.id));
  const exceptionsByTask = await loadExceptions(
    client,
    rows.filter((t) => t.repeat_freq).map((t) => t.id)
  );

  const result = rows.map((t) => {
    const task = toCalendarTask(t, accessible.get(t.calendar_id)?.name ?? "", assigneesByTask.get(t.id) ?? []);
    const exceptions = exceptionsByTask.get(t.id);
    return exceptions ? { ...task, exceptions } : task;
  });

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
    .select(TASK_COLUMNS)
    .in("calendar_id", calendarIds)
    .or(
      `and(event_date.gte.${start},event_date.lte.${end}),and(due_date.gte.${start},due_date.lte.${end}),and(repeat_freq.not.is.null,event_date.lte.${end})`
    );
  if (error) return { data: null, error: error.message };

  const assigneesByTask = await loadAssignees(client, (tasks ?? []).map((t) => t.id));

  const relevant = (tasks ?? []).filter(
    (t) => t.created_by === session.username || (assigneesByTask.get(t.id) ?? []).includes(session.username)
  );

  const exceptionsByTask = await loadExceptions(
    client,
    relevant.filter((t) => t.repeat_freq).map((t) => t.id)
  );

  const result = relevant
    .map((t) => {
      const task = toCalendarTask(t, accessible.get(t.calendar_id)?.name ?? "", assigneesByTask.get(t.id) ?? []);
      const exceptions = exceptionsByTask.get(t.id);
      return exceptions ? { ...task, exceptions } : task;
    })
    .flatMap((t) => expandTask(t, start, end))
    .filter((t) => (t.dueDate ?? t.eventDate) >= start && t.eventDate <= end);

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

  const repeatError = validateRepeat(input.repeat, input.eventDate);
  if (repeatError) return { data: null, error: repeatError };
  const timeError = validateTimes(input.startTime, input.endTime, input.eventDate, input.dueDate);
  if (timeError) return { data: null, error: timeError };

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
      start_time: input.startTime || null,
      end_time: input.startTime ? input.endTime || null : null,
      ...repeatColumns(input.repeat),
    })
    .select(TASK_COLUMNS)
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
    .select("id, calendar_id, event_date, due_date, start_time, end_time")
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
  if (updates.repeat !== undefined) {
    const repeatError = validateRepeat(updates.repeat, nextEventDate);
    if (repeatError) return { data: null, error: repeatError };
  }
  const nextStart = updates.startTime === undefined ? existing.start_time?.slice(0, 5) ?? null : updates.startTime;
  const nextEnd = updates.endTime === undefined ? existing.end_time?.slice(0, 5) ?? null : updates.endTime;
  const timeError = validateTimes(nextStart, nextEnd, nextEventDate, nextDueDate);
  if (timeError) return { data: null, error: timeError };

  const patch: Record<string, unknown> = {};
  if (updates.startTime !== undefined || updates.endTime !== undefined) {
    patch.start_time = nextStart || null;
    patch.end_time = nextStart ? nextEnd || null : null;
  }
  if (updates.repeat !== undefined) Object.assign(patch, repeatColumns(updates.repeat));
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

/** Copies a task (non-recurring copies, same span length and assignees) onto each of the given dates. */
export async function copyTaskToDates(
  taskId: string,
  dates: string[]
): Promise<{ data: { copied: number } | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const targets = Array.from(new Set(dates)).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));
  if (targets.length === 0) return { data: null, error: "Pick at least one day" };
  if (targets.length > 31) return { data: null, error: "Too many days selected" };

  const client = await createClient();
  const { data: source, error: fetchError } = await client
    .from("calendar_tasks")
    .select(TASK_COLUMNS)
    .eq("id", taskId)
    .maybeSingle();
  if (fetchError) return { data: null, error: fetchError.message };
  if (!source) return { data: null, error: "Task not found" };

  const access = await requireEditorAccess(client, source.calendar_id, session.username);
  if ("error" in access) return { data: null, error: access.error };

  const span = source.due_date ? diffDays(source.event_date, source.due_date) : null;
  const assigneesByTask = await loadAssignees(client, [taskId]);
  const assignees = assigneesByTask.get(taskId) ?? [];

  const service = createServiceClient();
  const { data: inserted, error } = await service
    .from("calendar_tasks")
    .insert(
      targets.map((date) => ({
        calendar_id: source.calendar_id,
        title: source.title,
        notes: source.notes,
        event_date: date,
        due_date: span === null ? null : addDays(date, span),
        color: source.color,
        start_time: source.start_time,
        end_time: source.end_time,
        created_by: session.username,
      }))
    )
    .select("id");
  if (error) return { data: null, error: error.message };

  if (assignees.length > 0 && inserted?.length) {
    const { error: assigneeError } = await service
      .from("calendar_task_assignees")
      .insert(inserted.flatMap((t) => assignees.map((username) => ({ task_id: t.id, username }))));
    if (assigneeError) return { data: null, error: assigneeError.message };
  }

  return { data: { copied: inserted?.length ?? 0 }, error: null };
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

/** Loads a recurring series and confirms `occurrenceDate` is one of its occurrences. */
async function loadOccurrenceTarget(
  client: SupabaseServerClient,
  taskId: string,
  occurrenceDate: string,
  username: string
) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(occurrenceDate)) return { error: "Invalid occurrence date" } as const;

  const { data: row, error } = await client
    .from("calendar_tasks")
    .select(TASK_COLUMNS)
    .eq("id", taskId)
    .maybeSingle();
  if (error) return { error: error.message } as const;
  if (!row) return { error: "Task not found" } as const;
  if (!row.repeat_freq) return { error: "This task doesn't repeat" } as const;

  const access = await requireEditorAccess(client, row.calendar_id, username);
  if ("error" in access) return { error: access.error } as const;

  const series = toCalendarTask(row, "", []);
  if (!expandTask(series, occurrenceDate, occurrenceDate).some((t) => t.occurrenceDate === occurrenceDate)) {
    return { error: "That date isn't part of this repeating task" } as const;
  }
  return { row, series } as const;
}

/** Edits one occurrence of a recurring task without touching the rest of the series. */
export async function updateOccurrence(
  taskId: string,
  occurrenceDate: string,
  updates: OccurrenceUpdate
): Promise<{ data: { ok: true } | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const title = updates.title.trim();
  if (!title) return { data: null, error: "Title is required" };

  const client = await createClient();
  const target = await loadOccurrenceTarget(client, taskId, occurrenceDate, session.username);
  if (target.error !== undefined) return { data: null, error: target.error };
  const { row } = target;

  const timeError = validateTimes(
    updates.startTime,
    updates.endTime,
    occurrenceDate,
    row.due_date && row.due_date !== row.event_date ? row.due_date : null
  );
  if (timeError) return { data: null, error: timeError };

  const startTime = updates.startTime || null;
  const endTime = startTime ? updates.endTime || null : null;
  const seriesStart = row.start_time ? row.start_time.slice(0, 5) : null;
  const seriesEnd = row.end_time ? row.end_time.slice(0, 5) : null;
  const seriesNotes = row.notes ?? "";
  const nextNotes = updates.notes?.trim() ?? "";

  const timeOverridden = startTime !== seriesStart || endTime !== seriesEnd;
  const titleOverride = title !== row.title ? title : null;
  const notesOverride = nextNotes !== seriesNotes ? nextNotes : null;

  const service = createServiceClient();

  // Nothing differs from the series: drop any previous edit instead of storing a no-op row.
  if (!timeOverridden && titleOverride === null && notesOverride === null) {
    const { error } = await service
      .from("calendar_task_exceptions")
      .delete()
      .eq("task_id", taskId)
      .eq("occurrence_date", occurrenceDate);
    if (error) return { data: null, error: error.message };
    return { data: { ok: true }, error: null };
  }

  const { error } = await service.from("calendar_task_exceptions").upsert(
    {
      task_id: taskId,
      occurrence_date: occurrenceDate,
      is_deleted: false,
      title: titleOverride,
      notes: notesOverride,
      time_overridden: timeOverridden,
      start_time: timeOverridden ? startTime : null,
      end_time: timeOverridden ? endTime : null,
    },
    { onConflict: "task_id,occurrence_date" }
  );
  if (error) return { data: null, error: error.message };

  return { data: { ok: true }, error: null };
}

/** Puts one occurrence back to the series' title, notes and times (also undoes a removal). */
export async function resetOccurrence(
  taskId: string,
  occurrenceDate: string
): Promise<{ data: { ok: true } | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const client = await createClient();
  const target = await loadOccurrenceTarget(client, taskId, occurrenceDate, session.username);
  if (target.error !== undefined) return { data: null, error: target.error };

  const service = createServiceClient();
  const { error } = await service
    .from("calendar_task_exceptions")
    .delete()
    .eq("task_id", taskId)
    .eq("occurrence_date", occurrenceDate);
  if (error) return { data: null, error: error.message };

  return { data: { ok: true }, error: null };
}

/**
 * Deletes part of a recurring series. `this` hides one occurrence, `following` ends
 * the series the day before it, `all` removes the whole task.
 */
export async function deleteOccurrences(
  taskId: string,
  occurrenceDate: string,
  scope: DeleteScope
): Promise<{ data: { ok: true } | null; error: string | null }> {
  if (scope === "all") return deleteTask(taskId);
  if (scope !== "this" && scope !== "following") return { data: null, error: "Invalid delete scope" };

  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const client = await createClient();
  const target = await loadOccurrenceTarget(client, taskId, occurrenceDate, session.username);
  if (target.error !== undefined) return { data: null, error: target.error };

  const service = createServiceClient();

  if (scope === "this") {
    const { error } = await service.from("calendar_task_exceptions").upsert(
      {
        task_id: taskId,
        occurrence_date: occurrenceDate,
        is_deleted: true,
        title: null,
        notes: null,
        time_overridden: false,
        start_time: null,
        end_time: null,
      },
      { onConflict: "task_id,occurrence_date" }
    );
    if (error) return { data: null, error: error.message };
    return { data: { ok: true }, error: null };
  }

  // "following": nothing left before this occurrence means the whole series goes.
  const lastKept = addDays(occurrenceDate, -1);
  if (lastKept < target.row.event_date) return deleteTask(taskId);

  const { error: updateError } = await service
    .from("calendar_tasks")
    .update({ repeat_until: lastKept })
    .eq("id", taskId);
  if (updateError) return { data: null, error: updateError.message };

  // Edits past the new end date can never show again; don't leave them behind.
  const { error: cleanupError } = await service
    .from("calendar_task_exceptions")
    .delete()
    .eq("task_id", taskId)
    .gte("occurrence_date", occurrenceDate);
  if (cleanupError) return { data: null, error: cleanupError.message };

  return { data: { ok: true }, error: null };
}
