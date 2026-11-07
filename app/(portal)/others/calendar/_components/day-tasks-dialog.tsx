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
import { colorFor, isUninvolved, UNINVOLVED_CLASS } from "@/lib/calendar-constants";
import { formatDayLabel, formatTimeRange } from "@/lib/calendar-date-utils";
import { occurrenceKey } from "@/lib/calendar-recurrence";
import type { CalendarTask } from "@/lib/actions/calendar";

export function DayTasksDialog({
  date,
  activeTasks,
  me,
  editableCalendarIds,
  onClose,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: {
  date: string | null;
  activeTasks: CalendarTask[];
  me: string | null;
  editableCalendarIds: Set<string>;
  onClose: () => void;
  onAddTask: () => void;
  onEditTask: (task: CalendarTask) => void;
  onDeleteTask: (task: CalendarTask) => void;
}) {
  const open = date !== null;
  const rows = activeTasks.map((task) => ({ task, isDue: task.dueDate === date }));
  const canAdd = editableCalendarIds.size > 0;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{date ? formatDayLabel(date) : ""}</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-3">
          {rows.length === 0 && (
            <p className="text-base text-muted-foreground">Nothing pinned to this day yet.</p>
          )}
          {rows.map(({ task, isDue }) => {
            const color = colorFor(task.color);
            const canEdit = editableCalendarIds.has(task.calendarId);
            return (
              <div
                key={occurrenceKey(task)}
                className={`flex items-start gap-3 rounded-lg border border-border p-4 ${
                  isUninvolved(task, me) ? UNINVOLVED_CLASS : ""
                }`}
              >
                <span className={`mt-2 size-3 shrink-0 rounded-full ${color.dot}`} />
                <div className="min-w-0 flex-1">
                  <p className="break-words text-base font-semibold text-foreground">{task.title}</p>
                  {task.notes && (
                    <p className="mt-1 line-clamp-4 text-sm whitespace-pre-line text-muted-foreground">{task.notes}</p>
                  )}
                  {task.startTime && (
                    <p className="mt-0.5 text-sm text-muted-foreground">{formatTimeRange(task)}</p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {task.calendarName}
                    </Badge>
                    {isDue && (
                      <Badge variant="destructive" className="text-xs">
                        <Flag className="size-3" />
                        Due
                      </Badge>
                    )}
                    {task.assignees.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {task.assignees.join(", ")}
                      </span>
                    )}
                    {task.createdBy && (
                      <span className="text-sm text-muted-foreground">Created by {task.createdBy}</span>
                    )}
                  </div>
                </div>
                {canEdit && (
                  <div className="flex shrink-0 items-center gap-1">
                    <Button size="icon-sm" variant="ghost" onClick={() => onEditTask(task)} title="Edit">
                      <Pencil />
                    </Button>
                    <Button
                      size="icon-sm"
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
