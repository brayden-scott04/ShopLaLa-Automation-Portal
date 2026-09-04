"use client";

import { Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { colorFor } from "@/lib/calendar-constants";
import { addDays, formatRelativeDay, todayKey } from "@/lib/calendar-date-utils";
import type { CalendarTask } from "@/lib/actions/calendar";

export function UpcomingPanel({ tasks }: { tasks: CalendarTask[] }) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
        Nothing due or on your calendars in the next 7 days.
      </div>
    );
  }

  const today = todayKey();
  const windowEnd = addDays(today, 7);

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {tasks.map((task) => {
        const color = colorFor(task.color);
        const isDueSoon = !!task.dueDate && task.dueDate >= today && task.dueDate <= windowEnd;
        const relevantKey = isDueSoon ? task.dueDate! : task.eventDate;
        const relative = formatRelativeDay(relevantKey);
        const urgent = relevantKey <= today;

        return (
          <div
            key={task.id}
            className="flex min-w-56 shrink-0 flex-col gap-1.5 rounded-lg border border-border bg-card p-3"
          >
            <div className="flex items-center gap-2">
              <span className={`size-2 shrink-0 rounded-full ${color.dot}`} />
              <span className="truncate text-sm font-medium text-foreground">{task.title}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant={urgent ? "destructive" : "outline"}>
                {task.dueDate && isDueSoon && <Flag className="size-3" />}
                {isDueSoon ? `Due · ${relative}` : relative}
              </Badge>
              <Badge variant="secondary">{task.calendarName}</Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}
