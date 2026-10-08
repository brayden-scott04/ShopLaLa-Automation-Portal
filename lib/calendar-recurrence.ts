import type { CalendarTask } from "@/lib/actions/calendar";
import type { RepeatRule } from "@/lib/calendar-constants";
import { addDays, diffDays, fromDateKey, toDateKey } from "@/lib/calendar-date-utils";

const MAX_ITERATIONS = 2000;
const WEEKDAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** 0=Mon..6=Sun for a date key. */
export function weekdayIndex(key: string): number {
  return (fromDateKey(key).getDay() + 6) % 7;
}

function clampedDate(year: number, month: number, day: number): string {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return toDateKey(new Date(year, month, Math.min(day, lastDay)));
}

/** Start dates of every occurrence of `rule` (anchored at `anchor`) that could touch [start, end]. */
function occurrenceStarts(anchor: string, rule: RepeatRule, span: number, start: string, end: string): string[] {
  const out: string[] = [];
  const lowerBound = addDays(start, -span); // earliest start whose span can still reach `start`
  const last = rule.until && rule.until < end ? rule.until : end;
  const interval = Math.max(1, rule.interval);
  const anchorDate = fromDateKey(anchor);

  if (rule.freq === "daily") {
    const k0 = Math.max(0, Math.floor(diffDays(anchor, lowerBound) / interval));
    for (let k = k0, i = 0; i < MAX_ITERATIONS; k++, i++) {
      const d = addDays(anchor, k * interval);
      if (d > last) break;
      if (d >= lowerBound) out.push(d);
    }
  } else if (rule.freq === "weekly") {
    const weekdays = rule.weekdays?.length ? [...rule.weekdays].sort((a, b) => a - b) : [weekdayIndex(anchor)];
    const weekStart = addDays(anchor, -weekdayIndex(anchor));
    const k0 = Math.max(0, Math.floor(diffDays(weekStart, lowerBound) / (7 * interval)));
    for (let k = k0, i = 0; i < MAX_ITERATIONS; k++, i++) {
      const base = addDays(weekStart, k * 7 * interval);
      if (base > last) break;
      for (const wd of weekdays) {
        const d = addDays(base, wd);
        if (d >= anchor && d <= last && d >= lowerBound) out.push(d);
      }
    }
  } else if (rule.freq === "monthly") {
    const lower = fromDateKey(lowerBound);
    const monthsDiff = (lower.getFullYear() - anchorDate.getFullYear()) * 12 + lower.getMonth() - anchorDate.getMonth();
    const k0 = Math.max(0, Math.floor(monthsDiff / interval) - 1);
    for (let k = k0, i = 0; i < MAX_ITERATIONS; k++, i++) {
      const total = anchorDate.getMonth() + k * interval;
      const d = clampedDate(anchorDate.getFullYear() + Math.floor(total / 12), ((total % 12) + 12) % 12, anchorDate.getDate());
      if (d > last) break;
      if (d >= anchor && d >= lowerBound) out.push(d);
    }
  } else {
    const k0 = Math.max(0, Math.floor((fromDateKey(lowerBound).getFullYear() - anchorDate.getFullYear()) / interval) - 1);
    for (let k = k0, i = 0; i < MAX_ITERATIONS; k++, i++) {
      const d = clampedDate(anchorDate.getFullYear() + k * interval, anchorDate.getMonth(), anchorDate.getDate());
      if (d > last) break;
      if (d >= anchor && d >= lowerBound) out.push(d);
    }
  }
  return out;
}

/**
 * Expands a recurring task into the occurrences that touch [startKey, endKey].
 * Non-recurring tasks are returned unchanged. Occurrences keep the series' `id`
 * and carry `occurrenceDate`; use `occurrenceKey` for React/Map keys.
 */
export function expandTask(task: CalendarTask, startKey: string, endKey: string): CalendarTask[] {
  if (!task.repeat) return [task];
  const span = task.dueDate ? diffDays(task.eventDate, task.dueDate) : 0;
  return occurrenceStarts(task.eventDate, task.repeat, span, startKey, endKey).map((d) => ({
    ...task,
    eventDate: d,
    dueDate: task.dueDate ? addDays(d, span) : null,
    occurrenceDate: d,
    seriesEventDate: task.eventDate,
    seriesDueDate: task.dueDate,
  }));
}

export function occurrenceKey(task: CalendarTask): string {
  return `${task.id}:${task.occurrenceDate ?? task.eventDate}`;
}

export function describeRecurrence(repeat: RepeatRule | null, eventDate: string): string {
  if (!repeat) return "Does not repeat";
  const n = repeat.interval;
  let base: string;
  if (repeat.freq === "daily") base = n === 1 ? "Every day" : `Every ${n} days`;
  else if (repeat.freq === "weekly") {
    const days = (repeat.weekdays?.length ? [...repeat.weekdays].sort() : [weekdayIndex(eventDate)]).map(
      (d) => WEEKDAY_NAMES[d]
    );
    base = n === 1 ? `Every ${days.join(", ")}` : `Every ${n} weeks on ${days.join(", ")}`;
  } else if (repeat.freq === "monthly") {
    const day = fromDateKey(eventDate).getDate();
    base = n === 1 ? `Monthly on day ${day}` : `Every ${n} months on day ${day}`;
  } else {
    base = n === 1 ? "Every year" : `Every ${n} years`;
  }
  return repeat.until ? `${base}, until ${repeat.until}` : base;
}
