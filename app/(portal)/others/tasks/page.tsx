"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCheck,
  ChevronUp,
  ChevronsUp,
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
  deleteTrackedTask,
  type Task,
  type TaskProgressUpdate,
  type TrackedTaskInput,
} from "@/lib/actions/tasks";
import { getCurrentUser, getStaffDirectory } from "@/lib/actions/staff";
import { PRIORITY_CLASSES, PRIORITY_LABELS } from "@/lib/tasks-constants";

const PRIORITY_ICONS: Record<number, LucideIcon> = { 4: ChevronUp, 5: ChevronsUp };

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
 * Assignees (other than the owner) get a tick box to say they've read the task; everyone else sees
 * how many have, with who/when on hover.
 */
function AcknowledgedCell({
  task,
  me,
  onToggle,
}: {
  task: Task;
  me: string;
  onToggle: (acknowledged: boolean) => void;
}) {
  const acks = task.acknowledgements;
  if (acks.length === 0) return <span className="text-muted-foreground">—</span>;

  const mine = acks.find((a) => a.username === me);
  const done = acks.filter((a) => a.acknowledgedAt).length;
  const all = done === acks.length;
  const detail = acks
    .map((a) => `${a.username} - ${a.acknowledgedAt ? `read ${formatDateTime(a.acknowledgedAt)}` : "not yet"}`)
    .join("\n");

  return (
    <div className="flex items-center gap-2" title={detail}>
      {mine && (
        <Checkbox
          checked={mine.acknowledgedAt !== null}
          onCheckedChange={(c) => onToggle(c === true)}
          aria-label="Mark as read"
        />
      )}
      <span
        className={cn(
          "inline-flex items-center gap-1 whitespace-nowrap text-xs",
          all ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
        )}
      >
        {all && <CheckCheck className="size-3.5" aria-hidden />}
        {done}/{acks.length} read
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
  const [sortKey, setSortKey] = useState<SortKey>("priority");
  const [sortDesc, setSortDesc] = useState(true);
  const [scope, setScope] = useState<Scope>("all");
  const [showDone, setShowDone] = useState(false);
  const [search, setSearch] = useState("");
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
    });
  }, []);

  function changeSort(key: SortKey) {
    if (key === sortKey) setSortDesc((d) => !d);
    else {
      setSortKey(key);
      // Highest priority first, soonest date first.
      setSortDesc(key === "priority");
    }
  }

  const today = todayIso();

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = tasks.filter((t) => {
      if (!showDone && t.done) return false;
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
      if (!av && !bv) return b.priority - a.priority;
      if (!av) return 1;
      if (!bv) return -1;
      return av.localeCompare(bv) * dir || b.priority - a.priority;
    });
  }, [tasks, scope, showDone, search, sortKey, sortDesc, me]);

  const stats = useMemo(() => {
    const open = tasks.filter((t) => !t.done);
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekIso = `${weekEnd.getFullYear()}-${String(weekEnd.getMonth() + 1).padStart(2, "0")}-${String(weekEnd.getDate()).padStart(2, "0")}`;
    return {
      open: open.length,
      top: open.filter((t) => t.priority === 5).length,
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

  function handleUpdatePosted(taskId: string, update: TaskProgressUpdate) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, updates: [update, ...t.updates] } : t)));
  }

  function handleToggleAcknowledged(task: Task, acknowledged: boolean) {
    const setMine = (acknowledgedAt: string | null) =>
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? { ...t, acknowledgements: t.acknowledgements.map((a) => (a.username === me ? { ...a, acknowledgedAt } : a)) }
            : t
        )
      );
    const previous = task.acknowledgements.find((a) => a.username === me)?.acknowledgedAt ?? null;
    setMine(acknowledged ? new Date().toISOString() : null);
    startTransition(async () => {
      const result = await setTaskAcknowledged(task.id, acknowledged);
      if (result.error) {
        setError(result.error);
        setMine(previous);
      } else {
        setMine(result.data);
      }
    });
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
            { label: "Priority 5", value: stats.top, tone: stats.top ? "text-red-600 dark:text-red-400" : "" },
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
                  return (
                    <tr key={t.id} className={cn("border-b border-border last:border-0", t.done && "opacity-50")}>
                      <td className="px-3 py-2">
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
                        {t.canEdit ? (
                          <button
                            type="button"
                            onClick={() => openEdit(t)}
                            className="text-left hover:underline focus-visible:underline focus-visible:outline-none"
                          >
                            {t.title}
                          </button>
                        ) : (
                          t.title
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2">{formatDate(t.date)}</td>
                      <td className={cn("whitespace-nowrap px-3 py-2", overdue && "font-medium text-red-600 dark:text-red-400")}>
                        {formatDate(t.dueDate)}
                      </td>
                      <td className="px-3 py-2">{t.owner}</td>
                      <td className="px-3 py-2">{t.assignees.length ? t.assignees.join(", ") : "—"}</td>
                      <td className="px-3 py-2">
                        <AcknowledgedCell task={t} me={me} onToggle={(a) => handleToggleAcknowledged(t, a)} />
                      </td>
                      <td
                        className={cn("truncate px-3 py-2 text-muted-foreground", !columns.widths && "max-w-xs")}
                        title={notesTooltip(t)}
                      >
                        {t.notes ?? "—"}
                      </td>
                      <td className={cn("px-3 py-2", !columns.widths && "max-w-xs")} title={updatesTooltip(t)}>
                        {t.updates[0] ? (
                          <>
                            <div className="truncate">{t.updates[0].body}</div>
                            <div className="truncate text-xs text-muted-foreground">
                              {t.updates[0].username} · {formatDateTime(t.updates[0].createdAt)}
                            </div>
                          </>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex justify-end gap-1">
                          {t.canEdit && (
                            <Button variant="ghost" size="icon-sm" onClick={() => openEdit(t)} aria-label="Edit task">
                              <Pencil />
                            </Button>
                          )}
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
        task={editing}
        currentUser={me}
        staff={staff}
        saving={isPending}
        error={formError}
        onSave={handleSave}
        onUpdatePosted={handleUpdatePosted}
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
