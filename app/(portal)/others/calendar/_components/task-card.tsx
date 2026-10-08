"use client";

import { Flag, Repeat } from "lucide-react";
import { colorFor } from "@/lib/calendar-constants";
import type { CalendarTask } from "@/lib/actions/calendar";

/** Full-text task card used by the week and day views. */
export function TaskCard({
  task,
  date,
  showNotes,
  onClick,
}: {
  task: CalendarTask;
  date: string;
  showNotes?: boolean;
  onClick: () => void;
}) {
  const color = colorFor(task.color);
  const isDue = !!task.dueDate && task.dueDate !== task.eventDate && task.dueDate === date;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full flex-col items-start gap-0.5 rounded-md px-2 py-1.5 text-left text-sm font-medium ${color.chip} ${
        isDue ? `ring-1 ${color.ring}` : ""
      }`}
    >
      <span className="flex w-full items-start gap-1">
        {isDue && <Flag className="mt-0.5 size-3 shrink-0" />}
        <span className="min-w-0 flex-1 break-words">{task.title}</span>
        {task.repeat && <Repeat className="mt-0.5 size-3 shrink-0 opacity-70" />}
      </span>
      {showNotes && task.notes && (
        <span className="line-clamp-3 text-xs font-normal opacity-80">{task.notes}</span>
      )}
      {showNotes && (
        <span className="text-[10px] font-normal opacity-70">
          {task.calendarName}
          {task.assignees.length > 0 ? ` · ${task.assignees.join(", ")}` : ""}
        </span>
      )}
    </button>
  );
}
