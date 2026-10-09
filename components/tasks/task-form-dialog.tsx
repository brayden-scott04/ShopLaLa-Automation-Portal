"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Task, TrackedTaskInput } from "@/lib/actions/tasks";
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
  onSave: (input: TrackedTaskInput) => void;
}

export function TaskFormDialog(props: TaskFormDialogProps) {
  // Remount the form on every open so its state re-initializes from `task`.
  return props.open ? <TaskFormInner key={props.task?.id ?? "new"} {...props} /> : null;
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
}: TaskFormDialogProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [notes, setNotes] = useState(task?.notes ?? "");
  const [date, setDate] = useState(task?.date ?? "");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [priority, setPriority] = useState(task?.priority ?? 3);
  const [assignees, setAssignees] = useState<string[]>(task?.assignees ?? [currentUser]);

  function toggleAssignee(username: string) {
    setAssignees((prev) => (prev.includes(username) ? prev.filter((u) => u !== username) : [...prev, username]));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Edit task" : "New task"}</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">Task / project</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={MAX_TASK_TITLE_LENGTH}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label>Priority (5 = highest)</Label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  title={PRIORITY_LABELS[p]}
                  className={cn(
                    "size-9 rounded-md border text-sm transition-colors",
                    priority === p
                      ? cn(PRIORITY_CLASSES[p], "border-foreground/40")
                      : "border-border text-muted-foreground hover:bg-muted"
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
              <Input id="task-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-due">Due date</Label>
              <Input id="task-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Assignees</Label>
            <p className="text-xs text-muted-foreground">
              Owner: {task?.owner ?? currentUser}. Only the owner and assignees can see this task.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {staff.map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => toggleAssignee(u)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs transition-colors",
                    assignees.includes(u)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-notes">Notes</Label>
            <Textarea
              id="task-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={MAX_TASK_NOTES_LENGTH}
            />
          </div>

          {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={saving || !title.trim()}
            onClick={() => onSave({ title, notes, date: date || null, dueDate: dueDate || null, priority, assignees })}
          >
            {task ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
