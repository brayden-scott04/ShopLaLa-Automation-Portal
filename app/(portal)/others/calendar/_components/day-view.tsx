"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { occurrenceKey } from "@/lib/calendar-recurrence";
import type { CalendarTask } from "@/lib/actions/calendar";
import { TaskCard } from "./task-card";

export function DayView({
  date,
  tasks,
  canAdd,
  onAddTask,
  onEditTask,
}: {
  date: string;
  tasks: CalendarTask[];
  canAdd: boolean;
  onAddTask: () => void;
  onEditTask: (task: CalendarTask) => void;
}) {
  return (
    <div className="min-w-0 flex-1 space-y-2 rounded-lg border border-border p-4">
      {tasks.length === 0 && <p className="text-sm text-muted-foreground">Nothing pinned to this day.</p>}
      {tasks.map((task) => (
        <TaskCard key={occurrenceKey(task)} task={task} date={date} showNotes onClick={() => onEditTask(task)} />
      ))}
      {canAdd && (
        <Button variant="outline" size="sm" onClick={onAddTask}>
          <Plus />
          Add a task
        </Button>
      )}
    </div>
  );
}
