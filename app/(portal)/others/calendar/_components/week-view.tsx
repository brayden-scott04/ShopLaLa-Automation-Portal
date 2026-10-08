"use client";

import { Plus } from "lucide-react";
import { buildWeek, fromDateKey, todayKey } from "@/lib/calendar-date-utils";
import { occurrenceKey } from "@/lib/calendar-recurrence";
import type { CalendarTask } from "@/lib/actions/calendar";
import { TaskCard } from "./task-card";

export function WeekView({
  anchor,
  activeByDate,
  canAdd,
  onHeaderClick,
  onAddTask,
  onEditTask,
}: {
  anchor: string;
  activeByDate: Map<string, CalendarTask[]>;
  canAdd: boolean;
  onHeaderClick: (dateKey: string) => void;
  onAddTask: (dateKey: string) => void;
  onEditTask: (task: CalendarTask) => void;
}) {
  const week = buildWeek(anchor);
  const today = todayKey();

  return (
    <div className="grid min-w-0 flex-1 grid-cols-1 overflow-hidden rounded-lg border border-border md:grid-cols-7">
      {week.map((dateKey, i) => {
        const date = fromDateKey(dateKey);
        const tasks = activeByDate.get(dateKey) ?? [];
        const isToday = dateKey === today;
        return (
          <div
            key={dateKey}
            className={`flex min-h-32 flex-col gap-1.5 border-b border-border p-2 md:min-h-96 md:border-r ${
              i === 6 ? "md:border-r-0" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => onHeaderClick(dateKey)}
              className="flex items-center gap-1.5 text-left text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {date.toLocaleDateString(undefined, { weekday: "short" })}
              <span
                className={`rounded-full px-1.5 py-0.5 text-sm ${
                  isToday ? "bg-primary font-semibold text-primary-foreground" : "text-foreground"
                }`}
              >
                {date.getDate()}
              </span>
            </button>
            {tasks.map((task) => (
              <TaskCard key={occurrenceKey(task)} task={task} date={dateKey} onClick={() => onEditTask(task)} />
            ))}
            {canAdd && (
              <button
                type="button"
                onClick={() => onAddTask(dateKey)}
                className="mt-auto flex items-center gap-1 self-start rounded px-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Plus className="size-3" />
                Add
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
