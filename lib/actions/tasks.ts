"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { getSession } from "@/lib/session";
import { MAX_TASK_TITLE_LENGTH, MAX_TASK_NOTES_LENGTH, MAX_TASK_UPDATE_LENGTH } from "@/lib/tasks-constants";
import { notify, pushChange } from "@/lib/notify";
import { PING_COOLDOWN_MS, taskLink, type NotificationChange, type NotificationKind } from "@/lib/notifications-constants";

export interface Task {
  id: string;
  title: string;
  notes: string | null;
  date: string | null;
  dueDate: string | null;
  priority: number;
  done: boolean;
  owner: string;
  assignees: string[];
  /** Progress log, newest first. */
  updates: TaskProgressUpdate[];
  /** One entry per assignee other than the owner (the owner never acknowledges their own task). */
  acknowledgements: TaskAcknowledgement[];
  createdAt: string;
  canEdit: boolean;
  /** Only the owner ticks a task done. */
  canMarkDone: boolean;
  canDelete: boolean;
}

export interface TaskAcknowledgement {
  username: string;
  /** null = not acknowledged yet. */
  acknowledgedAt: string | null;
}

export interface TaskProgressUpdate {
  id: string;
  username: string;
  body: string;
  createdAt: string;
}

export interface TrackedTaskInput {
  title: string;
  notes: string;
  date: string | null;
  dueDate: string | null;
  priority: number;
  assignees: string[];
}

type TaskRow = {
  id: string;
  title: string;
  notes: string | null;
  task_date: string | null;
  due_date: string | null;
  priority: number;
  done: boolean;
  owner_username: string;
  created_at: string;
};

const TASK_COLUMNS = "id, title, notes, task_date, due_date, priority, done, owner_username, created_at";
const UPDATE_COLUMNS = "id, username, body, created_at";
const ASSIGNEE_COLUMNS = "task_id, username, acknowledged_at";

type TaskUpdateRow = { id: string; username: string; body: string; created_at: string };

function toTaskUpdate(row: TaskUpdateRow): TaskProgressUpdate {
  return { id: row.id, username: row.username, body: row.body, createdAt: row.created_at };
}

function validate(input: TrackedTaskInput): string | null {
  const title = input.title.trim();
  if (!title) return "Title is required";
  if (title.length > MAX_TASK_TITLE_LENGTH) return `Title must be ${MAX_TASK_TITLE_LENGTH} characters or fewer`;
  if (input.notes.length > MAX_TASK_NOTES_LENGTH) return `Notes must be ${MAX_TASK_NOTES_LENGTH} characters or fewer`;
  if (!Number.isInteger(input.priority) || input.priority < 1 || input.priority > 5) return "Priority must be 1-5";
  const isoDate = /^\d{4}-\d{2}-\d{2}$/;
  if (input.date !== null && !isoDate.test(input.date)) return "Invalid date";
  if (input.dueDate !== null && !isoDate.test(input.dueDate)) return "Invalid due date";
  return null;
}

type AssigneeRow = { task_id: string; username: string; acknowledged_at: string | null };

function toTask(
  row: TaskRow,
  links: AssigneeRow[],
  updates: TaskProgressUpdate[],
  username: string
): Task {
  const isOwner = row.owner_username === username;
  const assignees = links.map((l) => l.username);
  return {
    id: row.id,
    title: row.title,
    notes: row.notes,
    date: row.task_date,
    dueDate: row.due_date,
    priority: row.priority,
    done: row.done,
    owner: row.owner_username,
    assignees,
    updates,
    acknowledgements: links
      .filter((l) => l.username !== row.owner_username)
      .map((l) => ({ username: l.username, acknowledgedAt: l.acknowledged_at })),
    createdAt: row.created_at,
    // Visible only to owner + assignees — admins included, no override — so "can see" == "can edit".
    canEdit: isOwner || assignees.includes(username),
    canMarkDone: isOwner,
    canDelete: isOwner,
  };
}

type AssigneeDiff = { error: string | null; added: string[]; removed: string[] };

/**
 * Replaces the assignee set, keeping only usernames that exist in `staff`. Only removed/added rows are
 * touched, so assignees who stay keep their acknowledgement. Reports who was added/removed.
 */
async function setAssignees(taskId: string, usernames: string[]): Promise<AssigneeDiff> {
  const fail = (error: string): AssigneeDiff => ({ error, added: [], removed: [] });
  const db = createServiceClient();
  const wanted = [...new Set(usernames.map((u) => u.toLowerCase()))];

  const { data: valid, error: staffError } = wanted.length
    ? await db.from("staff").select("username").in("username", wanted)
    : { data: [], error: null };
  if (staffError) return fail(staffError.message);
  const next = new Set((valid ?? []).map((s) => s.username as string));

  const { data: current, error: currentError } = await db
    .from("task_assignees")
    .select("username")
    .eq("task_id", taskId);
  if (currentError) return fail(currentError.message);
  const existing = new Set((current ?? []).map((r) => r.username as string));

  const removed = [...existing].filter((u) => !next.has(u));
  if (removed.length) {
    const { error } = await db.from("task_assignees").delete().eq("task_id", taskId).in("username", removed);
    if (error) return fail(error.message);
  }

  const added = [...next].filter((u) => !existing.has(u));
  if (added.length) {
    const { error } = await db.from("task_assignees").insert(added.map((username) => ({ task_id: taskId, username })));
    if (error) return fail(error.message);
  }
  return { error: null, added, removed };
}

/** Notifies the people on a task (default: owner + assignees) except the actor. */
function notifyTask(
  actor: string,
  task: { id: string; title: string; owner: string; assignees: string[] },
  kind: NotificationKind,
  data: Parameters<typeof notify>[0]["data"] = {},
  recipients: string[] = [task.owner, ...task.assignees]
) {
  return notify({
    recipients,
    actor,
    kind,
    sourceType: "task",
    sourceId: task.id,
    data: { title: task.title, ...data },
    link: kind === "task_deleted" ? null : taskLink(task.id),
  });
}

/** Loads one task from the caller's point of view; null if missing or not visible to them. */
async function loadVisible(taskId: string, username: string): Promise<Task | null> {
  const db = createServiceClient();
  const { data: row } = await db.from("tasks").select(TASK_COLUMNS).eq("id", taskId).maybeSingle();
  if (!row) return null;
  const { data: a } = await db.from("task_assignees").select(ASSIGNEE_COLUMNS).eq("task_id", taskId);
  const links = (a ?? []) as AssigneeRow[];
  const { data: u } = await db
    .from("task_updates")
    .select(UPDATE_COLUMNS)
    .eq("task_id", taskId)
    .order("created_at", { ascending: false });
  const updates = ((u ?? []) as TaskUpdateRow[]).map(toTaskUpdate);
  const task = toTask(row as TaskRow, links, updates, username);
  return task.canEdit ? task : null;
}

export async function listTasks(): Promise<{ data: Task[] | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };
  const db = createServiceClient();

  const { data: rows, error } = await db.from("tasks").select(TASK_COLUMNS);
  if (error) return { data: null, error: error.message };

  const { data: links, error: linkError } = await db.from("task_assignees").select(ASSIGNEE_COLUMNS);
  if (linkError) return { data: null, error: linkError.message };

  const byTask = new Map<string, AssigneeRow[]>();
  for (const l of (links ?? []) as AssigneeRow[]) {
    const list = byTask.get(l.task_id) ?? [];
    list.push(l);
    byTask.set(l.task_id, list);
  }

  const { data: updateRows, error: updateError } = await db
    .from("task_updates")
    .select(`task_id, ${UPDATE_COLUMNS}`)
    .order("created_at", { ascending: false });
  if (updateError) return { data: null, error: updateError.message };

  const updatesByTask = new Map<string, TaskProgressUpdate[]>();
  for (const u of (updateRows ?? []) as (TaskUpdateRow & { task_id: string })[]) {
    const list = updatesByTask.get(u.task_id) ?? [];
    list.push(toTaskUpdate(u));
    updatesByTask.set(u.task_id, list);
  }

  const tasks = (rows as TaskRow[])
    .map((r) => toTask(r, byTask.get(r.id) ?? [], updatesByTask.get(r.id) ?? [], session.username))
    .filter((t) => t.canEdit);
  return { data: tasks, error: null };
}

export async function createTrackedTask(input: TrackedTaskInput): Promise<{ data: Task | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };
  const invalid = validate(input);
  if (invalid) return { data: null, error: invalid };

  const db = createServiceClient();
  const { data: row, error } = await db
    .from("tasks")
    .insert({
      title: input.title.trim(),
      notes: input.notes.trim() || null,
      task_date: input.date,
      due_date: input.dueDate,
      priority: input.priority,
      owner_username: session.username,
    })
    .select(TASK_COLUMNS)
    .single();
  if (error || !row) return { data: null, error: error?.message ?? "Failed to create task" };

  const assigned = await setAssignees(row.id, input.assignees);
  if (assigned.error) return { data: null, error: assigned.error };

  await notifyTask(
    session.username,
    { id: row.id, title: row.title, owner: row.owner_username, assignees: assigned.added },
    "task_assigned",
    { dueDate: row.due_date, priority: row.priority },
    assigned.added
  );

  return { data: await loadVisible(row.id, session.username), error: null };
}

/** `data` is null on success when the editor removed their own access (task no longer visible). */
export async function updateTrackedTask(id: string, input: TrackedTaskInput): Promise<{ data: Task | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };
  const invalid = validate(input);
  if (invalid) return { data: null, error: invalid };
  const before = await loadVisible(id, session.username);
  if (!before) return { data: null, error: "Task not found" };

  const db = createServiceClient();
  const { error } = await db
    .from("tasks")
    .update({
      title: input.title.trim(),
      notes: input.notes.trim() || null,
      task_date: input.date,
      due_date: input.dueDate,
      priority: input.priority,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { data: null, error: error.message };

  const assigned = await setAssignees(id, input.assignees);
  if (assigned.error) return { data: null, error: assigned.error };

  const title = input.title.trim();
  const changes: NotificationChange[] = [];
  pushChange(changes, "title", before.title, title);
  pushChange(changes, "priority", String(before.priority), String(input.priority));
  pushChange(changes, "date", before.date, input.date);
  pushChange(changes, "dueDate", before.dueDate, input.dueDate);
  pushChange(changes, "notes", before.notes, input.notes.trim(), { withValues: false });

  const after = { id, title, owner: before.owner, assignees: input.assignees };
  const stayed = [before.owner, ...before.assignees].filter((u) => !assigned.removed.includes(u));
  await Promise.all([
    notifyTask(session.username, after, "task_assigned", { dueDate: input.dueDate, priority: input.priority }, assigned.added),
    notifyTask(session.username, after, "task_unassigned", {}, assigned.removed),
    changes.length > 0
      ? notifyTask(session.username, after, "task_updated", { changes, dueDate: input.dueDate }, stayed)
      : Promise.resolve(0),
  ]);

  return { data: await loadVisible(id, session.username), error: null };
}

export async function setTaskDone(id: string, done: boolean): Promise<{ error: string | null }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };
  const task = await loadVisible(id, session.username);
  if (!task) return { error: "Task not found" };
  if (!task.canMarkDone) return { error: "Only the owner can mark this task done" };

  const db = createServiceClient();
  const { error } = await db
    .from("tasks")
    .update({ done, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };
  if (task.done !== done) await notifyTask(session.username, task, "task_done", { done });
  return { error: null };
}

/** Newest first. Same visibility as the task itself. */
export async function listTaskUpdates(taskId: string): Promise<{ data: TaskProgressUpdate[] | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };
  if (!(await loadVisible(taskId, session.username))) return { data: null, error: "Task not found" };

  const db = createServiceClient();
  const { data, error } = await db
    .from("task_updates")
    .select(UPDATE_COLUMNS)
    .eq("task_id", taskId)
    .order("created_at", { ascending: false });
  if (error) return { data: null, error: error.message };
  return { data: (data as TaskUpdateRow[]).map(toTaskUpdate), error: null };
}

/** Append-only: updates are never edited or deleted, and don't touch the task's notes. */
export async function addTaskUpdate(taskId: string, body: string): Promise<{ data: TaskProgressUpdate | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };
  const text = body.trim();
  if (!text) return { data: null, error: "Update is empty" };
  if (text.length > MAX_TASK_UPDATE_LENGTH) return { data: null, error: `Update must be ${MAX_TASK_UPDATE_LENGTH} characters or fewer` };
  const task = await loadVisible(taskId, session.username);
  if (!task) return { data: null, error: "Task not found" };

  const db = createServiceClient();
  const { data, error } = await db
    .from("task_updates")
    .insert({ task_id: taskId, username: session.username, body: text })
    .select(UPDATE_COLUMNS)
    .single();
  if (error || !data) return { data: null, error: error?.message ?? "Failed to add update" };
  await notifyTask(session.username, task, "task_progress", {
    body: text.length > 200 ? `${text.slice(0, 199)}…` : text,
  });
  return { data: toTaskUpdate(data as TaskUpdateRow), error: null };
}

/** Ticks/unticks "Acknowledged" for the caller. Only assignees (other than the owner) can acknowledge. */
export async function setTaskAcknowledged(
  id: string,
  acknowledged: boolean
): Promise<{ data: string | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };
  const task = await loadVisible(id, session.username);
  if (!task) return { data: null, error: "Task not found" };
  if (!task.acknowledgements.some((a) => a.username === session.username)) {
    return { data: null, error: "Only assignees can acknowledge this task" };
  }

  const acknowledgedAt = acknowledged ? new Date().toISOString() : null;
  const db = createServiceClient();
  const { error } = await db
    .from("task_assignees")
    .update({ acknowledged_at: acknowledgedAt })
    .eq("task_id", id)
    .eq("username", session.username);
  if (error) return { data: null, error: error.message };
  if (acknowledged) await notifyTask(session.username, task, "task_ack", {}, [task.owner]);
  return { data: acknowledgedAt, error: null };
}

export async function deleteTrackedTask(id: string): Promise<{ error: string | null }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };
  const task = await loadVisible(id, session.username);
  if (!task) return { error: "Task not found" };
  if (!task.canDelete) return { error: "Only the owner can delete this task" };

  const db = createServiceClient();
  const { error } = await db.from("tasks").delete().eq("id", id);
  if (error) return { error: error.message };
  await notifyTask(session.username, task, "task_deleted");
  return { error: null };
}

/**
 * Sends a "REMINDER" about a task to the people on it (owner + assignees, minus the sender):
 * everyone, or just `usernames`. Anyone who can see the task may ping it. At most one ping per
 * person per task per PING_COOLDOWN_MS; those are counted in `skipped`.
 */
export async function pingTrackedTask(
  id: string,
  usernames: string[] | null
): Promise<{ data: { sent: number; skipped: number } | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };
  const task = await loadVisible(id, session.username);
  if (!task) return { data: null, error: "Task not found" };

  const pool = [...new Set([task.owner, ...task.assignees])].filter((u) => u !== session.username);
  const wanted = usernames === null ? pool : pool.filter((u) => usernames.includes(u));
  if (wanted.length === 0) return { data: null, error: "Pick at least one person to remind" };

  const db = createServiceClient();
  const { data: recent, error } = await db
    .from("notifications")
    .select("recipient")
    .eq("kind", "task_ping")
    .eq("source_id", id)
    .in("recipient", wanted)
    .gte("created_at", new Date(Date.now() - PING_COOLDOWN_MS).toISOString());
  if (error) return { data: null, error: error.message };
  const justPinged = new Set((recent ?? []).map((r) => r.recipient as string));
  const recipients = wanted.filter((u) => !justPinged.has(u));
  if (recipients.length === 0) return { data: null, error: "Already reminded in the last minute. Try again shortly." };

  const sent = await notifyTask(
    session.username,
    task,
    "task_ping",
    { dueDate: task.dueDate, date: task.date, priority: task.priority },
    recipients
  );
  if (sent === 0) return { data: null, error: "Couldn't send the reminder. Try again." };
  return { data: { sent, skipped: justPinged.size }, error: null };
}
