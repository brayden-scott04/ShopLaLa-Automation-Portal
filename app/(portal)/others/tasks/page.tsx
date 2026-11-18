"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCheck,
  ChevronUp,
  ChevronsUp,
  Eye,
  ListChecks,
  Pencil,
  Plus,
  Search,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { ColumnResizeHandle, useResizableColumns } from "@/components/resizable-columns";
import { tasks as tasksItem } from "@/lib/nav";
import { cn } from "@/lib/utils";
import {
  listTasks,
  createTrackedTask,
  updateTrackedTask,
  setTaskDone,
  setTaskAcknowledged,
  setTaskUpdatesRead,
  addTaskUpdate,
  deleteTrackedTask,
  type Task,
  type TaskProgressUpdate,
  type TrackedTaskInput,
} from "@/lib/actions/tasks";
import { getCurrentUser, getStaffDirectory } from "@/lib/actions/staff";
import { pingTrackedTask } from "@/lib/actions/tasks";
import { PingButton } from "@/components/notifications/ping-button";
import { HIGHEST_PRIORITY, PRIORITY_CLASSES, PRIORITY_LABELS } from "@/lib/tasks-constants";
import { usePersistedState } from "@/lib/use-persisted-state";

const PRIORITY_ICONS: Record<number, LucideIcon> = { 1: ChevronsUp, 2: ChevronUp };

function PriorityPill({ priority }: { priority: number }) {
  const Icon = PRIORITY_ICONS[priority];
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1 whitespace-nowrap rounded-md px-2 text-xs",
        PRIORITY_CLASSES[priority]
      )}
    >
      {Icon && <Icon className="size-3.5" aria-hidden />}
      {priority} · {PRIORITY_LABELS[priority]}
    </span>
  );
}

type SortKey = "priority" | "date" | "dueDate";

/** Table columns in display order. `className` only shapes the default (auto) layout. */
const COLUMNS: { label: string; sort?: SortKey; className?: string }[] = [
  { label: "Done", className: "w-14" },
  { label: "Priority", sort: "priority" },
  { label: "Task / project" },
  { label: "Date", sort: "date" },
  { label: "Due date", sort: "dueDate" },
  { label: "Owner" },
  { label: "Assignees" },
  { label: "Acknowledged" },
  { label: "Notes" },
  { label: "Update" },
  { label: "", className: "w-20" },
];
type Scope = "all" | "mine" | "assigned";

// Guards for the view settings remembered in localStorage (sort, scope, show done).
const isSortKey = (v: unknown): v is SortKey => v === "priority" || v === "date" || v === "dueDate";
const isScope = (v: unknown): v is Scope => v === "all" || v === "mine" || v === "assigned";
const isBoolean = (v: unknown): v is boolean => typeof v === "boolean";

function todayIso(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** Hover text for the Notes cell: the notes, then every update as "user - text", newest first. */
function notesTooltip(task: Task): string | undefined {
  const parts: string[] = [];
  if (task.notes) parts.push(task.notes);
  if (task.updates.length) {
    parts.push(["Updates:", ...task.updates.map((u) => `${u.username} - ${u.body}`)].join("\n"));
  }
  return parts.length ? parts.join("\n\n") : undefined;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

/** Hover text for the Update cell: every update as "user (when) - text", newest first. */
function updatesTooltip(task: Task): string | undefined {
  if (!task.updates.length) return undefined;
  return task.updates.map((u) => `${u.username} (${formatDateTime(u.createdAt)}) - ${u.body}`).join("\n");
}

/**
 * Acknowledging the task itself (assignees only): a loud amber "Acknowledge task" button until they
 * have, then a green chip. Below it, how many assignees have acknowledged, with who/when on hover.
 * Reading updates is a separate button, in the Update column.
 */
function AcknowledgedCell({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: (acknowledged: boolean) => void;
}) {
  const acks = task.acknowledgements;
  const done = acks.filter((a) => a.acknowledgedAt).length;
  const all = acks.length > 0 && done === acks.length;
  const detail = acks
    .map((a) => {
      const ack = a.acknowledgedAt ? `acknowledged ${formatDateTime(a.acknowledgedAt)}` : "not acknowledged yet";
      const updates = a.unreadUpdates > 0 ? `, ${a.unreadUpdates} unread update${a.unreadUpdates === 1 ? "" : "s"}` : "";
      return `${a.username} - ${ack}${updates}`;
    })
    .join("\n");

  if (acks.length === 0) return <span className="text-muted-foreground">—</span>;

  return (
    <div className="flex flex-col items-start gap-1">
      {task.canAcknowledge &&
        (task.needsAck ? (
          <button
            type="button"
            onClick={() => onToggle(true)}
            title="Click once you've read this task."
            className="inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-amber-500 px-2 py-1 text-xs font-semibold text-white shadow-sm ring-2 ring-amber-300 hover:bg-amber-600 dark:ring-amber-500/40"
          >
            <AlertTriangle className="size-3.5" aria-hidden />
            Acknowledge task
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onToggle(false)}
            title="You've acknowledged this task. Click to undo."
            className="inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800 hover:bg-green-200 dark:bg-green-500/20 dark:text-green-200"
          >
            <CheckCheck className="size-3.5" aria-hidden />
            Acknowledged
          </button>
        ))}
      <span
        title={detail}
        className={cn(
          "inline-flex items-center gap-1 whitespace-nowrap text-xs",
          all ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
        )}
      >
        {all && <CheckCheck className="size-3.5" aria-hidden />}
        {done}/{acks.length} acknowledged
      </span>
    </div>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [staff, setStaff] = useState<string[]>([]);
  const [me, setMe] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  // The page reopens with the sort and filters the person last used.
  const [sortKey, setSortKey] = usePersistedState<SortKey>("tasks.sortKey", "priority", isSortKey);
  // Key renamed when 1 became the highest priority, so stale "descending" settings don't put 5s first.
  const [sortDesc, setSortDesc] = usePersistedState("tasks.sortDesc.v2", false, isBoolean);
  const [scope, setScope] = usePersistedState<Scope>("tasks.scope", "all", isScope);
  const [showDone, setShowDone] = usePersistedState("tasks.showDone", false, isBoolean);
  const [search, setSearch] = useState("");
  const [attentionOnly, setAttentionOnly] = useState(false);
  const [isPending, startTransition] = useTransition();
  const columns = useResizableColumns("tasks.columnWidths", COLUMNS.length);

  useEffect(() => {
    startTransition(async () => {
      const [list, user, directory] = await Promise.all([listTasks(), getCurrentUser(), getStaffDirectory()]);
      if (list.error) setError(list.error);
      setTasks(list.data ?? []);
      setMe(user?.username ?? "");
      setStaff((directory.data ?? []).map((s) => s.username));
      setIsLoading(false);
      // Deep link from a Dashboard notification / upcoming item: ?task=<id> opens that task.
      const linked = new URLSearchParams(window.location.search).get("task");
      const target = linked ? (list.data ?? []).find((task) => task.id === linked) : undefined;
      if (linked) window.history.replaceState(null, "", window.location.pathname);
      if (target) {
        setEditing(target);
        setFormError(null);
        setFormOpen(true);
      }
    });
  }, []);

  function changeSort(key: SortKey) {
    if (key === sortKey) setSortDesc((d) => !d);
    else {
      setSortKey(key);
      // Highest priority (1) first, soonest date first: ascending for every key.
      setSortDesc(false);
    }
  }

  const today = todayIso();

  /** Open tasks where I still have to acknowledge, or have unread updates. */
  const needsAttention = useMemo(() => tasks.filter((t) => !t.done && t.needsAttention).length, [tasks]);
  // Once nothing is left to look at, the filter switches itself off so the list isn't stuck empty.
  const onlyAttention = attentionOnly && needsAttention > 0;

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = tasks.filter((t) => {
      if (!showDone && t.done) return false;
      if (onlyAttention && !t.needsAttention) return false;
      // Matches the task name, its owner, or any assignee (case-insensitive).
      if (
        query &&
        !t.title.toLowerCase().includes(query) &&
        !t.owner.toLowerCase().includes(query) &&
        !t.assignees.some((a) => a.toLowerCase().includes(query))
      ) {
        return false;
      }
      if (scope === "mine") return t.owner === me;
      if (scope === "assigned") return t.assignees.includes(me);
      return true;
    });
    const dir = sortDesc ? -1 : 1;
    return filtered.sort((a, b) => {
      if (sortKey === "priority") {
        return (a.priority - b.priority) * dir || (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999");
      }
      const av = a[sortKey];
      const bv = b[sortKey];
      // Tasks with no value always sort last.
      if (!av && !bv) return a.priority - b.priority;
      if (!av) return 1;
      if (!bv) return -1;
      return av.localeCompare(bv) * dir || a.priority - b.priority;
    });
  }, [tasks, scope, showDone, onlyAttention, search, sortKey, sortDesc, me]);

  const stats = useMemo(() => {
    const open = tasks.filter((t) => !t.done);
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekIso = `${weekEnd.getFullYear()}-${String(weekEnd.getMonth() + 1).padStart(2, "0")}-${String(weekEnd.getDate()).padStart(2, "0")}`;
    return {
      open: open.length,
      top: open.filter((t) => t.priority === HIGHEST_PRIORITY).length,
      overdue: open.filter((t) => t.dueDate && t.dueDate < today).length,
      week: open.filter((t) => t.dueDate && t.dueDate >= today && t.dueDate <= weekIso).length,
    };
  }, [tasks, today]);

  function openCreate() {
    setEditing(null);
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(task: Task) {
    setEditing(task);
    setFormError(null);
    setFormOpen(true);
  }

  function handleSave(input: TrackedTaskInput) {
    setFormError(null);
    startTransition(async () => {
      // View-only assignees can't change the task; their Save just posts the update.
      if (editing && !editing.canEdit) {
        const posted = await addTaskUpdate(editing.id, input.update ?? "");
        if (posted.error || !posted.data) {
          setFormError(posted.error ?? "Failed to add update");
          return;
        }
        const update = posted.data;
        setTasks((prev) => prev.map((t) => (t.id === editing.id ? { ...t, updates: [update, ...t.updates] } : t)));
        setFormOpen(false);
        return;
      }
      const result = editing ? await updateTrackedTask(editing.id, input) : await createTrackedTask(input);
      if (result.error) {
        setFormError(result.error);
        return;
      }
      const saved = result.data;
      setTasks((prev) => {
        if (editing) {
          // saved is null if the editor removed their own access.
          return saved ? prev.map((t) => (t.id === saved.id ? saved : t)) : prev.filter((t) => t.id !== editing.id);
        }
        return saved ? [...prev, saved] : prev;
      });
      setFormOpen(false);
    });
  }

  function handleUpdateEdited(taskId: string, update: TaskProgressUpdate) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, updates: t.updates.map((u) => (u.id === update.id ? update : u)) } : t))
    );
  }

  /**
   * Shows `optimistic` straight away, then swaps in the server's copy of the task (or rolls back on
   * error). Used by both "Acknowledge task" and "Mark updates read".
   */
  function applyReadChange(task: Task, optimistic: Task | null, run: () => Promise<{ data: Task | null; error: string | null }>) {
    const replace = (next: Task) => setTasks((prev) => prev.map((t) => (t.id === next.id ? next : t)));
    const previous = tasks.find((t) => t.id === task.id) ?? task;
    if (optimistic) replace(optimistic);
    startTransition(async () => {
      const result = await run();
      if (result.error) {
        setError(result.error);
        replace(previous);
      } else if (result.data) {
        replace(result.data);
      }
    });
  }

  function handleToggleAcknowledged(task: Task, acknowledged: boolean) {
    const now = new Date().toISOString();
    const optimistic = acknowledged
      ? {
          ...task,
          needsAck: false,
          needsAttention: task.unreadUpdateIds.length > 0,
          acknowledgements: task.acknowledgements.map((a) => (a.username === me ? { ...a, acknowledgedAt: now } : a)),
        }
      : null;
    applyReadChange(task, optimistic, () => setTaskAcknowledged(task.id, acknowledged));
  }

  function handleToggleUpdatesRead(task: Task, read: boolean) {
    const optimistic = read ? { ...task, unreadUpdateIds: [], needsAttention: task.needsAck } : null;
    applyReadChange(task, optimistic, () => setTaskUpdatesRead(task.id, read));
  }

  function handleToggleDone(task: Task, done: boolean) {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, done } : t)));
    startTransition(async () => {
      const result = await setTaskDone(task.id, done);
      if (result.error) {
        setError(result.error);
        setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, done: !done } : t)));
      }
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    startTransition(async () => {
      const result = await deleteTrackedTask(target.id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setTasks((prev) => prev.filter((t) => t.id !== target.id));
    });
  }

  function sortHeader(label: string, k: SortKey) {
    const active = sortKey === k;
    const Icon = sortDesc ? ArrowDown : ArrowUp;
    return (
      <button
        type="button"
        onClick={() => changeSort(k)}
        className={cn("inline-flex items-center gap-1 font-medium", active ? "text-foreground" : "text-muted-foreground")}
      >
        {label}
        {active && <Icon className="size-3.5" />}
      </button>
    );
  }

  return (
    <>
      <PageHeader icon={tasksItem.icon} title={tasksItem.name} description={tasksItem.description} />
      <div className="space-y-4 p-6 md:p-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Open", value: stats.open, tone: "" },
            { label: `Priority ${HIGHEST_PRIORITY}`, value: stats.top, tone: stats.top ? "text-red-600 dark:text-red-400" : "" },
            { label: "Overdue", value: stats.overdue, tone: stats.overdue ? "text-red-600 dark:text-red-400" : "" },
            { label: "Due in 7 days", value: stats.week, tone: "" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border px-4 py-3">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className={cn("text-2xl font-semibold", s.tone)}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search task or assignee"
                aria-label="Search tasks by name, owner or assignee"
                className="w-full rounded-md border border-input bg-background py-1.5 pr-2 pl-8 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
              />
            </div>
            <SegmentedControl
              value={scope}
              onValueChange={(v) => setScope(v as Scope)}
              options={[
                { value: "all", label: "All" },
                { value: "mine", label: "I own" },
                { value: "assigned", label: "Assigned to me" },
              ]}
            />
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
              <Checkbox checked={showDone} onCheckedChange={(c) => setShowDone(c === true)} />
              Show done
            </label>
            <div className="hidden items-center gap-1.5 xl:flex" aria-label="Priority key">
              <span className="text-xs text-muted-foreground">Priority:</span>
              {[1, 2, 3, 4, 5].map((p) => (
                <PriorityPill key={p} priority={p} />
              ))}
            </div>
          </div>
          <Button size="sm" onClick={openCreate}>
            <Plus /> New task
          </Button>
        </div>

        {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

        {needsAttention > 0 && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border-2 border-amber-400 bg-amber-50 px-4 py-3 dark:border-amber-500/60 dark:bg-amber-500/10">
            <AlertTriangle className="size-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
            <p className="min-w-0 flex-1 text-sm font-medium text-amber-900 dark:text-amber-100">
              {needsAttention === 1 ? "1 task needs" : `${needsAttention} tasks need`} your attention: not yet
              acknowledged, or new updates to read.
            </p>
            <Button size="sm" variant="outline" onClick={() => setAttentionOnly(!onlyAttention)}>
              {onlyAttention ? "Show all tasks" : "Show only these"}
            </Button>
          </div>
        )}

        {isLoading ? (
          <Skeleton className="h-64" />
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
            <ListChecks className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {search.trim() ? `No tasks match "${search.trim()}".` : "No tasks here. Create one to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table
              style={columns.tableStyle}
              className={cn("text-sm", columns.widths ? "[&_td]:overflow-hidden [&_td]:text-ellipsis" : "w-full")}
            >
              {columns.widths && (
                <colgroup>
                  {columns.widths.map((w, i) => (
                    <col key={i} style={{ width: w }} />
                  ))}
                </colgroup>
              )}
              <thead className="border-b border-border bg-muted/40 text-left text-xs">
                <tr>
                  {COLUMNS.map((col, i) => (
                    <th
                      key={i}
                      className={cn(
                        "relative px-3 py-2 font-medium text-muted-foreground",
                        !columns.widths && col.className
                      )}
                    >
                      {col.sort ? sortHeader(col.label, col.sort) : col.label}
                      {col.label && (
                        <ColumnResizeHandle
                          onPointerDown={(e) => columns.startResize(i, e)}
                          onReset={columns.reset}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((t) => {
                  const overdue = !t.done && t.dueDate !== null && t.dueDate < today;
                  const latest = t.updates[0];
                  const latestIsNew = latest !== undefined && t.unreadUpdateIds.includes(latest.id);
                  return (
                    <tr
                      key={t.id}
                      className={cn(
                        "border-b border-border last:border-0",
                        t.done && "opacity-50",
                        t.needsAttention && !t.done && "bg-amber-50/70 dark:bg-amber-500/5"
                      )}
                    >
                      <td
                        className={cn(
                          "px-3 py-2",
                          t.needsAttention && !t.done && "shadow-[inset_3px_0_0_var(--color-amber-500)]"
                        )}
                      >
                        <Checkbox
                          checked={t.done}
                          disabled={!t.canMarkDone}
                          onCheckedChange={(c) => handleToggleDone(t, c === true)}
                          aria-label="Mark done"
                          title={t.canMarkDone ? undefined : `Only ${t.owner} can mark this done`}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <PriorityPill priority={t.priority} />

                      </td>
                      <td className={cn("px-3 py-2 font-medium", t.done && "line-through")}>
                        <button
                          type="button"
                          onClick={() => openEdit(t)}
                          className="text-left hover:underline focus-visible:underline focus-visible:outline-none"
                        >
                          {t.title}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2">{formatDate(t.date)}</td>
                      <td className={cn("whitespace-nowrap px-3 py-2", overdue && "font-medium text-red-600 dark:text-red-400")}>
                        {formatDate(t.dueDate)}
                      </td>
                      <td className="px-3 py-2">{t.owner}</td>
                      <td className="px-3 py-2">{t.assignees.length ? t.assignees.join(", ") : "—"}</td>
                      <td className="px-3 py-2">
                        <AcknowledgedCell task={t} onToggle={(a) => handleToggleAcknowledged(t, a)} />
                      </td>
                      <td
                        className={cn("truncate px-3 py-2 text-muted-foreground", !columns.widths && "max-w-xs")}
                        title={notesTooltip(t)}
                      >
                        {t.notes ?? "—"}
                      </td>
                      <td className={cn("px-3 py-2", !columns.widths && "max-w-xs")} title={updatesTooltip(t)}>
                        {latest ? (
                          <>
                            <div className={cn("truncate", latestIsNew && "font-semibold text-blue-700 dark:text-blue-300")}>
                              {t.unreadUpdateIds.length > 0 && (
                                <span className="mr-1.5 rounded bg-blue-600 px-1 py-px text-[10px] font-semibold uppercase text-white">
                                  {t.unreadUpdateIds.length} new
                                </span>
                              )}
                              {latest.body}
                            </div>
                            <div className="truncate text-xs text-muted-foreground">
                              {latest.username} · {formatDateTime(latest.createdAt)}
                              {latest.editedAt && " · edited"}
                            </div>
                            {t.unreadUpdateIds.length > 0 && t.canReadUpdates && (
                              <button
                                type="button"
                                onClick={() => handleToggleUpdatesRead(t, true)}
                                title="Click once you've read the new updates."
                                className="mt-1 inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                              >
                                <CheckCheck className="size-3.5" aria-hidden />
                                Mark updates read
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex justify-end gap-1">
                          {!t.done && (
                            <PingButton
                              title={t.title}
                              candidates={[...new Set([t.owner, ...t.assignees])]
                                .filter((u) => u !== me)
                                .map((username) => ({ username, isOwner: username === t.owner }))}
                              onPing={(usernames) => pingTrackedTask(t.id, usernames)}
                            />
                          )}
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEdit(t)}
                            aria-label={t.canEdit ? "Edit task" : "View task"}
                            title={t.canEdit ? undefined : "View only. You can still add updates."}
                          >
                            {t.canEdit ? <Pencil /> : <Eye />}
                          </Button>
                          {t.canDelete && (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setDeleteTarget(t)}
                              aria-label="Delete task"
                            >
                              <Trash2 />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        // The live copy, so acknowledging or editing an update inside the dialog shows straight away.
        task={editing ? (tasks.find((t) => t.id === editing.id) ?? editing) : null}
        currentUser={me}
        staff={staff}
        saving={isPending}
        error={formError}
        onSave={handleSave}
        onUpdateEdited={handleUpdateEdited}
        onAcknowledge={handleToggleAcknowledged}
        onUpdatesRead={handleToggleUpdatesRead}
      />

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{deleteTarget?.title}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>This permanently deletes the task. This can&apos;t be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
