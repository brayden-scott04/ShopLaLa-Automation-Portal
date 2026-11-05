"use client";

import { Repeat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { colorFor } from "@/lib/calendar-constants";
import { addDays, formatTimeRange, fromDateKey, todayKey } from "@/lib/calendar-date-utils";
import { describeRecurrence, expandTask, occurrenceKey } from "@/lib/calendar-recurrence";
import type { CalendarTask } from "@/lib/actions/calendar";
import { cn } from "@/lib/utils";

interface Result {
  /** What to open on click: the series row, or for a repeating task its next (or last) occurrence. */
  task: CalendarTask;
  /** The date the row is listed under. */
  date: string;
  endDate: string | null;
  recurrence: string | null;
}

function formatDate(key: string): string {
  return fromDateKey(key).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Repeating tasks are listed once, at their next occurrence from today (or their last, if ended). */
function toResult(task: CalendarTask, today: string): Result {
  if (!task.repeat) return { task, date: task.eventDate, endDate: task.dueDate, recurrence: null };
  const recurrence = describeRecurrence(task.repeat, task.eventDate);
  const next = expandTask(task, today, addDays(today, 3660))[0];
  const occurrence =
    next ?? (task.eventDate < today ? expandTask(task, task.eventDate, addDays(today, -1)).at(-1) : undefined);
  if (!occurrence) return { task, date: task.eventDate, endDate: task.dueDate, recurrence };
  return { task: occurrence, date: occurrence.eventDate, endDate: occurrence.dueDate, recurrence };
}

export function SearchResults({
  query,
  tasks,
  loading,
  onPick,
}: {
  query: string;
  tasks: CalendarTask[];
  loading: boolean;
  onPick: (task: CalendarTask, date: string) => void;
}) {
  const today = todayKey();
  const results = tasks.map((t) => toResult(t, today));
  // Coming up first (soonest first), then past events (most recent first). Multi-day events still
  // running today count as coming up.
  const upcoming = results
    .filter((r) => (r.endDate ?? r.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = results
    .filter((r) => (r.endDate ?? r.date) < today)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (tasks.length === 0) {
    return (
      <div className="mb-4 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
        {loading ? "Searching…" : `No events match "${query}" in the ticked calendars.`}
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-lg border border-border">
      <div className="border-b border-border px-3 py-2 text-xs text-muted-foreground">
        {results.length} {results.length === 1 ? "event matches" : "events match"} &quot;{query}&quot;
        {loading && " · updating…"}
      </div>
      <div className="max-h-[50vh] overflow-y-auto">
        <Section title="Coming up" results={upcoming} onPick={onPick} />
        <Section title="Past" results={past} onPick={onPick} muted />
      </div>
    </div>
  );
}

function Section({
  title,
  results,
  muted,
  onPick,
}: {
  title: string;
  results: Result[];
  muted?: boolean;
  onPick: (task: CalendarTask, date: string) => void;
}) {
  if (results.length === 0) return null;
  return (
    <div>
      <div className="sticky top-0 bg-muted/80 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur">
        {title}
      </div>
      <ul className="divide-y divide-border">
        {results.map((r) => {
          const color = colorFor(r.task.color);
          return (
            <li key={occurrenceKey(r.task)}>
              <button
                type="button"
                onClick={() => onPick(r.task, r.date)}
                className={cn(
                  "flex w-full flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 text-left hover:bg-accent",
                  muted && "opacity-70"
                )}
              >
                <span className="w-40 shrink-0 text-sm text-foreground tabular-nums">
                  {formatDate(r.date)}
                  {r.endDate && r.endDate !== r.date && (
                    <span className="block text-xs text-muted-foreground">to {formatDate(r.endDate)}</span>
                  )}
                </span>
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <span className={`size-2 shrink-0 rounded-full ${color.dot}`} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground">{r.task.title}</span>
                    {r.task.notes && (
                      <span className="block truncate text-xs text-muted-foreground">{r.task.notes}</span>
                    )}
                  </span>
                </span>
                <span className="flex flex-wrap items-center gap-1.5">
                  {r.task.startTime && <Badge variant="outline">{formatTimeRange(r.task)}</Badge>}
                  {r.recurrence && (
                    <Badge variant="outline" title={r.recurrence}>
                      <Repeat className="size-3" />
                      {r.recurrence}
                    </Badge>
                  )}
                  {r.task.assignees.length > 0 && (
                    <Badge variant="outline">{r.task.assignees.join(", ")}</Badge>
                  )}
                  <Badge variant="secondary">{r.task.calendarName}</Badge>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
