"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { getSession } from "@/lib/session";
import { MAX_TASK_TITLE_LENGTH, MAX_TASK_NOTES_LENGTH, MAX_TASK_UPDATE_LENGTH } from "@/lib/tasks-constants";

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

/**
 * Replaces the assignee set, keeping only usernames that exist in `staff`. Only removed/added rows are
 * touched, so assignees who stay keep their acknowledgement.
 */
async function setAssignees(taskId: string, usernames: string[]): Promise<string | null> {
  const db = createServiceClient();
  const wanted = [...new Set(usernames.map((u) => u.toLowerCase()))];

  const { data: valid, error: staffError } = wanted.length
    ? await db.from("staff").select("username").in("username", wanted)
    : { data: [], error: null };
  if (staffError) return staffError.message;
  const next = new Set((valid ?? []).map((s) => s.username as string));

  const { data: current, error: currentError } = await db
    .from("task_assignees")
    .select("username")
    .eq("task_id", taskId);
  if (currentError) return currentError.message;
  const existing = new Set((current ?? []).map((r) => r.username as string));

  const removed = [...existing].filter((u) => !next.has(u));
  if (removed.length) {
    const { error } = await db.from("task_assignees").delete().eq("task_id", taskId).in("username", removed);
    if (error) return error.message;
  }

  const added = [...next].filter((u) => !existing.has(u)).map((username) => ({ task_id: taskId, username }));
  if (added.length) {
    const { error } = await db.from("task_assignees").insert(added);
    if (error) return error.message;
  }
  return null;
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

  const assignError = await setAssignees(row.id, input.assignees);
  if (assignError) return { data: null, error: assignError };

  return { data: await loadVisible(row.id, session.username), error: null };
}

/** `data` is null on success when the editor removed their own access (task no longer visible). */
export async function updateTrackedTask(id: string, input: TrackedTaskInput): Promise<{ data: Task | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };
  const invalid = validate(input);
  if (invalid) return { data: null, error: invalid };
  if (!(await loadVisible(id, session.username))) return { data: null, error: "Task not found" };

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

  const assignError = await setAssignees(id, input.assignees);
  if (assignError) return { data: null, error: assignError };

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
  return { error: error?.message ?? null };
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
  if (!(await loadVisible(taskId, session.username))) return { data: null, error: "Task not found" };

  const db = createServiceClient();
  const { data, error } = await db
    .from("task_updates")
    .insert({ task_id: taskId, username: session.username, body: text })
    .select(UPDATE_COLUMNS)
    .single();
  if (error || !data) return { data: null, error: error?.message ?? "Failed to add update" };
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
  return { error: error?.message ?? null };
}
