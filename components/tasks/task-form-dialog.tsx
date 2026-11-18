"use client";

import { useState } from "react";
import { AlertTriangle, CheckCheck, Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TaskUpdates } from "@/components/tasks/task-updates";
import type { Task, TaskProgressUpdate, TrackedTaskInput } from "@/lib/actions/tasks";
import {
  MAX_TASK_TITLE_LENGTH,
  MAX_TASK_NOTES_LENGTH,
  PRIORITIES,
  PRIORITY_LABELS,
  PRIORITY_CLASSES,
} from "@/lib/tasks-constants";

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** null = create a new task */
  task: Task | null;
  currentUser: string;
  staff: string[];
  saving: boolean;
  error: string | null;
  /** `input.update` carries the draft update, posted as part of the save. */
  onSave: (input: TrackedTaskInput) => void;
  /** Fired when one of your updates is edited in place, so the list can refresh without a reload. */
  onUpdateEdited?: (taskId: string, update: TaskProgressUpdate) => void;
  /** "Acknowledge task" for the current user. */
  onAcknowledge?: (task: Task, acknowledged: boolean) => void;
  /** "Mark updates read" for the current user. */
  onUpdatesRead?: (task: Task, read: boolean) => void;
}

/** Today's date as YYYY-MM-DD in the browser's timezone (not UTC, which would be yesterday before 08:00 SGT). */
function todayLocal(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function TaskFormDialog(props: TaskFormDialogProps) {
  // Remount the form on every open so its state re-initializes from `task`.
  return props.open ? <TaskFormInner key={props.task?.id ?? "new"} {...props} /> : null;
}

/** Assignees only: asks them to acknowledge the task itself. Reading updates is separate (Updates section). */
function AcknowledgeBanner({ task, onAcknowledge }: { task: Task; onAcknowledge?: TaskFormDialogProps["onAcknowledge"] }) {
  if (!task.canAcknowledge) return null;

  if (task.needsAck) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-lg border-2 border-amber-400 bg-amber-50 px-3 py-2.5 dark:border-amber-500/60 dark:bg-amber-500/10">
        <AlertTriangle className="size-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
        <div className="min-w-0 flex-1 text-sm text-amber-900 dark:text-amber-100">
          <div className="font-semibold">You haven&apos;t acknowledged this task yet</div>
          <div className="text-xs opacity-80">Read it through, then confirm so {task.owner} knows you&apos;ve seen it.</div>
        </div>
        <Button size="sm" className="bg-amber-500 text-white hover:bg-amber-600" onClick={() => onAcknowledge?.(task, true)}>
          <CheckCheck /> Acknowledge task
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-200">
      <CheckCheck className="size-4" aria-hidden />
      <span className="flex-1">You&apos;ve acknowledged this task.</span>
      <button type="button" className="text-xs underline opacity-70 hover:opacity-100" onClick={() => onAcknowledge?.(task, false)}>
        Undo
      </button>
    </div>
  );
}

function TaskFormInner({
  open,
  onOpenChange,
  task,
  currentUser,
  staff,
  saving,
  error,
  onSave,
  onUpdateEdited,
  onAcknowledge,
  onUpdatesRead,
}: TaskFormDialogProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [notes, setNotes] = useState(task?.notes ?? "");
  // New tasks default to today (local date); existing tasks keep whatever they have, even if blank.
  const [date, setDate] = useState(task ? (task.date ?? "") : todayLocal());
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [priority, setPriority] = useState(task?.priority ?? 3);
  const [assignees, setAssignees] = useState<string[]>(task?.assignees ?? [currentUser]);
  const [editors, setEditors] = useState<string[]>(task?.editors ?? []);
  const [draft, setDraft] = useState("");

  const owner = task?.owner ?? currentUser;
  const canEdit = task ? task.canEdit : true;
  const canManageEditors = task ? task.canManageEditors : true;
  const others = assignees.filter((u) => u !== owner);

  function toggleAssignee(username: string) {
    const adding = !assignees.includes(username);
    setAssignees((prev) => (adding ? [...prev, username] : prev.filter((u) => u !== username)));
    // People added by the owner can edit by default (the owner can switch it off below).
    if (adding && canManageEditors) setEditors((prev) => [...new Set([...prev, username])]);
    if (!adding) setEditors((prev) => prev.filter((u) => u !== username));
  }

  function toggleEditor(username: string) {
    setEditors((prev) => (prev.includes(username) ? prev.filter((u) => u !== username) : [...prev, username]));
  }

  function handleSave() {
    onSave({
      title,
      notes,
      date: date || null,
      dueDate: dueDate || null,
      priority,
      assignees,
      editors: editors.filter((u) => assignees.includes(u) && u !== owner),
      update: draft,
    });
  }

  const saveDisabled = saving || (canEdit ? !title.trim() : !draft.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(task && "h-[94vh] max-h-[94vh] max-w-3xl")}>
        <DialogHeader>
          <DialogTitle>{task ? (canEdit ? "Edit task" : "View task") : "New task"}</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-4">
          {task && <AcknowledgeBanner task={task} onAcknowledge={onAcknowledge} />}

          {!canEdit && (
            <p className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
              <Eye className="size-4 shrink-0" aria-hidden />
              View only: {owner} hasn&apos;t given you edit access. You can still add updates and acknowledge.
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="task-title">Task / project</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={MAX_TASK_TITLE_LENGTH}
              disabled={!canEdit}
              autoFocus={canEdit}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Priority (1 = highest)</Label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  disabled={!canEdit}
                  onClick={() => setPriority(p)}
                  title={PRIORITY_LABELS[p]}
                  className={cn(
                    "size-9 rounded-md border text-sm transition-colors disabled:cursor-not-allowed",
                    priority === p
                      ? cn(PRIORITY_CLASSES[p], "border-foreground/40")
                      : "border-border text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:hover:bg-transparent"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="task-date">Date</Label>
              <Input id="task-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={!canEdit} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-due">Due date</Label>
              <Input id="task-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} disabled={!canEdit} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Assignees</Label>
            <p className="text-xs text-muted-foreground">
              Owner: {owner}. Only the owner and assignees can see this task.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {staff.map((u) => (
                <button
                  key={u}
                  type="button"
                  disabled={!canEdit}
                  onClick={() => toggleAssignee(u)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs transition-colors disabled:cursor-not-allowed",
                    assignees.includes(u)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:bg-muted disabled:opacity-50"
                  )}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Who can edit</Label>
            {canManageEditors ? (
              others.length === 0 ? (
                <p className="text-xs text-muted-foreground">Only you. Add assignees above to give them edit access.</p>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{owner} (owner) can always edit. Click a name to switch it.</span>
                    <Button size="xs" variant="outline" onClick={() => setEditors(others)}>
                      All assignees
                    </Button>
                    <Button size="xs" variant="outline" onClick={() => setEditors([])}>
                      Only me
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {others.map((u) => {
                      const can = editors.includes(u);
                      const Icon = can ? Pencil : Eye;
                      return (
                        <button
                          key={u}
                          type="button"
                          onClick={() => toggleEditor(u)}
                          title={can ? `${u} can edit. Click to make view only.` : `${u} can only view. Click to allow editing.`}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors",
                            can
                              ? "border-green-600 bg-green-600 text-white"
                              : "border-border text-muted-foreground hover:bg-muted"
                          )}
                        >
                          <Icon className="size-3" aria-hidden />
                          {u} · {can ? "can edit" : "view only"}
                        </button>
                      );
                    })}
                  </div>
                </>
              )
            ) : (
              <p className="text-xs text-muted-foreground">
                {[`${owner} (owner)`, ...(task?.editors ?? [])].join(", ")}. Only {owner} can change this; people
                you add can view until {owner} allows them to edit.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-notes">Notes</Label>
            <Textarea
              id="task-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={MAX_TASK_NOTES_LENGTH}
              disabled={!canEdit}
            />
          </div>

          {task && (
            <TaskUpdates
              updates={task.updates}
              me={currentUser}
              unreadIds={task.unreadUpdateIds}
              draft={draft}
              onDraftChange={setDraft}
              onEdited={(u) => onUpdateEdited?.(task.id, u)}
              onMarkRead={task.canReadUpdates ? () => onUpdatesRead?.(task, true) : undefined}
            />
          )}

          {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={saveDisabled} onClick={handleSave}>
            {task ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
