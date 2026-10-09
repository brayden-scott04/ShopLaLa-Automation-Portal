"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, ListChecks, Pencil, Plus, Trash2 } from "lucide-react";
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
import { tasks as tasksItem } from "@/lib/others";
import { cn } from "@/lib/utils";
import {
  listTasks,
  createTrackedTask,
  updateTrackedTask,
  setTaskDone,
  deleteTrackedTask,
  type Task,
  type TrackedTaskInput,
} from "@/lib/actions/tasks";
import { getCurrentUser, getStaffDirectory } from "@/lib/actions/staff";
import { PRIORITY_CLASSES, PRIORITY_LABELS } from "@/lib/tasks-constants";

type SortKey = "priority" | "date" | "dueDate";
type Scope = "all" | "mine" | "assigned";

function todayIso(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
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
  const [isPending, startTransition] = useTransition();

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
    const filtered = tasks.filter((t) => {
      if (!showDone && t.done) return false;
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
  }, [tasks, scope, showDone, sortKey, sortDesc, me]);

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
            <p className="text-sm text-muted-foreground">No tasks here. Create one to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-xs">
                <tr>
                  <th className="w-10 px-3 py-2" />
                  <th className="px-3 py-2">
                    {sortHeader("Priority", "priority")}
                  </th>
                  <th className="px-3 py-2 font-medium text-muted-foreground">Task / project</th>
                  <th className="px-3 py-2">
                    {sortHeader("Date", "date")}
                  </th>
                  <th className="px-3 py-2">
                    {sortHeader("Due date", "dueDate")}
                  </th>
                  <th className="px-3 py-2 font-medium text-muted-foreground">Owner</th>
                  <th className="px-3 py-2 font-medium text-muted-foreground">Assignees</th>
                  <th className="px-3 py-2 font-medium text-muted-foreground">Notes</th>
                  <th className="w-20 px-3 py-2" />
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
                          disabled={!t.canEdit}
                          onCheckedChange={(c) => handleToggleDone(t, c === true)}
                          aria-label="Mark done"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={cn(
                            "inline-flex size-7 items-center justify-center rounded-md text-xs",
                            PRIORITY_CLASSES[t.priority]
                          )}
                          title={PRIORITY_LABELS[t.priority]}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className={cn("px-3 py-2 font-medium", t.done && "line-through")}>{t.title}</td>
                      <td className="whitespace-nowrap px-3 py-2">{formatDate(t.date)}</td>
                      <td className={cn("whitespace-nowrap px-3 py-2", overdue && "font-medium text-red-600 dark:text-red-400")}>
                        {formatDate(t.dueDate)}
                      </td>
                      <td className="px-3 py-2">{t.owner}</td>
                      <td className="px-3 py-2">{t.assignees.length ? t.assignees.join(", ") : "—"}</td>
                      <td className="max-w-xs truncate px-3 py-2 text-muted-foreground" title={t.notes ?? undefined}>
                        {t.notes ?? "—"}
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
