"use client";

import { Flag, Pencil, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { colorFor } from "@/lib/calendar-constants";
import { formatDayLabel } from "@/lib/calendar-date-utils";
import type { CalendarTask } from "@/lib/actions/calendar";

export function DayTasksDialog({
  date,
  tasks,
  dueTasks,
  editableCalendarIds,
  onClose,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: {
  date: string | null;
  tasks: CalendarTask[];
  dueTasks: CalendarTask[];
  editableCalendarIds: Set<string>;
  onClose: () => void;
  onAddTask: () => void;
  onEditTask: (task: CalendarTask) => void;
  onDeleteTask: (task: CalendarTask) => void;
}) {
  const open = date !== null;
  // A task can appear twice (pinned here, and due here) — de-dupe for the list view.
  const combined = new Map<string, { task: CalendarTask; isDue: boolean; isEvent: boolean }>();
  tasks.forEach((t) => combined.set(t.id, { task: t, isDue: false, isEvent: true }));
  dueTasks.forEach((t) => {
    const existing = combined.get(t.id);
    combined.set(t.id, { task: t, isDue: true, isEvent: existing?.isEvent ?? false });
  });
  const rows = Array.from(combined.values());
  const canAdd = editableCalendarIds.size > 0;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{date ? formatDayLabel(date) : ""}</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-2">
          {rows.length === 0 && (
            <p className="text-sm text-muted-foreground">Nothing pinned to this day yet.</p>
          )}
          {rows.map(({ task, isDue }) => {
            const color = colorFor(task.color);
            const canEdit = editableCalendarIds.has(task.calendarId);
            return (
              <div
                key={task.id}
                className="flex items-start gap-2 rounded-md border border-border p-2.5"
              >
                <span className={`mt-1 size-2 shrink-0 rounded-full ${color.dot}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{task.title}</p>
                  {task.notes && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{task.notes}</p>
                  )}
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary" className="text-[10px]">
                      {task.calendarName}
                    </Badge>
                    {isDue && (
                      <Badge variant="destructive" className="text-[10px]">
                        <Flag className="size-2.5" />
                        Due
                      </Badge>
                    )}
                    {task.assignees.length > 0 && (
                      <span className="text-[10px] text-muted-foreground">
                        {task.assignees.join(", ")}
                      </span>
                    )}
                  </div>
                </div>
                {canEdit && (
                  <div className="flex shrink-0 items-center gap-1">
                    <Button size="icon-xs" variant="ghost" onClick={() => onEditTask(task)} title="Edit">
                      <Pencil />
                    </Button>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => onDeleteTask(task)}
                      title="Delete"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </DialogBody>
        <DialogFooter className="sm:justify-between">
          <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
          {canAdd && (
            <Button onClick={onAddTask}>
              <Plus />
              Add a task
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
