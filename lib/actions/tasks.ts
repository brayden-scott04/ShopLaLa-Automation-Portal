"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { getSession } from "@/lib/session";
import { MAX_TASK_TITLE_LENGTH, MAX_TASK_NOTES_LENGTH } from "@/lib/tasks-constants";

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
  createdAt: string;
  canEdit: boolean;
  canDelete: boolean;
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

function toTask(row: TaskRow, assignees: string[], username: string, isAdmin: boolean): Task {
  const isOwner = row.owner_username === username;
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
    createdAt: row.created_at,
    // Visible only to owner + assignees (admins see everything), so "can see" == "can edit".
    canEdit: isAdmin || isOwner || assignees.includes(username),
    canDelete: isAdmin || isOwner,
  };
}

/** Replaces the assignee set, keeping only usernames that exist in `staff`. */
async function setAssignees(taskId: string, usernames: string[]): Promise<string | null> {
  const db = createServiceClient();
  const wanted = [...new Set(usernames.map((u) => u.toLowerCase()))];

  const { data: valid, error: staffError } = wanted.length
    ? await db.from("staff").select("username").in("username", wanted)
    : { data: [], error: null };
  if (staffError) return staffError.message;

  const { error: delError } = await db.from("task_assignees").delete().eq("task_id", taskId);
  if (delError) return delError.message;

  const rows = (valid ?? []).map((s) => ({ task_id: taskId, username: s.username as string }));
  if (rows.length) {
    const { error } = await db.from("task_assignees").insert(rows);
    if (error) return error.message;
  }
  return null;
}

/** Loads one task from the caller's point of view; null if missing or not visible to them. */
async function loadVisible(taskId: string, username: string, isAdmin: boolean): Promise<Task | null> {
  const db = createServiceClient();
  const { data: row } = await db.from("tasks").select(TASK_COLUMNS).eq("id", taskId).maybeSingle();
  if (!row) return null;
  const { data: a } = await db.from("task_assignees").select("username").eq("task_id", taskId);
  const assignees = (a ?? []).map((r) => r.username as string);
  const task = toTask(row as TaskRow, assignees, username, isAdmin);
  return task.canEdit ? task : null;
}

export async function listTasks(): Promise<{ data: Task[] | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };
  const isAdmin = session.role === "admin";
  const db = createServiceClient();

  const { data: rows, error } = await db.from("tasks").select(TASK_COLUMNS);
  if (error) return { data: null, error: error.message };

  const { data: links, error: linkError } = await db.from("task_assignees").select("task_id, username");
  if (linkError) return { data: null, error: linkError.message };

  const byTask = new Map<string, string[]>();
  for (const l of links ?? []) {
    const list = byTask.get(l.task_id as string) ?? [];
    list.push(l.username as string);
    byTask.set(l.task_id as string, list);
  }

  const tasks = (rows as TaskRow[])
    .map((r) => toTask(r, byTask.get(r.id) ?? [], session.username, isAdmin))
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

  return { data: await loadVisible(row.id, session.username, session.role === "admin"), error: null };
}

/** `data` is null on success when the editor removed their own access (task no longer visible). */
export async function updateTrackedTask(id: string, input: TrackedTaskInput): Promise<{ data: Task | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };
  const isAdmin = session.role === "admin";
  const invalid = validate(input);
  if (invalid) return { data: null, error: invalid };
  if (!(await loadVisible(id, session.username, isAdmin))) return { data: null, error: "Task not found" };

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

  return { data: await loadVisible(id, session.username, isAdmin), error: null };
}

export async function setTaskDone(id: string, done: boolean): Promise<{ error: string | null }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };
  if (!(await loadVisible(id, session.username, session.role === "admin"))) return { error: "Task not found" };

  const db = createServiceClient();
  const { error } = await db
    .from("tasks")
    .update({ done, updated_at: new Date().toISOString() })
    .eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteTrackedTask(id: string): Promise<{ error: string | null }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };
  const task = await loadVisible(id, session.username, session.role === "admin");
  if (!task) return { error: "Task not found" };
  if (!task.canDelete) return { error: "Only the owner can delete this task" };

  const db = createServiceClient();
  const { error } = await db.from("tasks").delete().eq("id", id);
  return { error: error?.message ?? null };
}
