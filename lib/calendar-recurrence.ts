import type { CalendarTask } from "@/lib/actions/calendar";
import { MONTH_WEEK_OPTIONS, type RepeatRule } from "@/lib/calendar-constants";
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

/**
 * The `week`th (1-4) or last (-1) `weekday` (0=Mon..6=Sun) of a month, as a date key.
 * `month` is 0-based.
 */
export function nthWeekdayOfMonth(year: number, month: number, week: number, weekday: number): string {
  if (week > 0) {
    const firstIdx = (new Date(year, month, 1).getDay() + 6) % 7;
    const offset = (weekday - firstIdx + 7) % 7;
    return toDateKey(new Date(year, month, 1 + offset + (week - 1) * 7));
  }
  const lastDate = new Date(year, month + 1, 0);
  const lastIdx = (lastDate.getDay() + 6) % 7;
  const offset = (lastIdx - weekday + 7) % 7;
  return toDateKey(new Date(year, month, lastDate.getDate() - offset));
}

/** Which "Nth weekday of the month" a date is: weeks 1-4 by position; a 5th occurrence counts as "last". */
export function nthWeekOfMonth(key: string): number {
  const n = Math.ceil(fromDateKey(key).getDate() / 7);
  return n >= 5 ? -1 : n;
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
    const nth = rule.monthWeek != null && rule.monthWeekday != null;
    for (let k = k0, i = 0; i < MAX_ITERATIONS; k++, i++) {
      const total = anchorDate.getMonth() + k * interval;
      const year = anchorDate.getFullYear() + Math.floor(total / 12);
      const monthIdx = ((total % 12) + 12) % 12;
      const d = nth
        ? nthWeekdayOfMonth(year, monthIdx, rule.monthWeek!, rule.monthWeekday!)
        : clampedDate(year, monthIdx, anchorDate.getDate());
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
  const out: CalendarTask[] = [];
  for (const d of occurrenceStarts(task.eventDate, task.repeat, span, startKey, endKey)) {
    const exception = task.exceptions?.[d];
    if (exception?.isDeleted) continue;
    const occurrence: CalendarTask = {
      ...task,
      eventDate: d,
      dueDate: task.dueDate ? addDays(d, span) : null,
      occurrenceDate: d,
      seriesEventDate: task.eventDate,
      seriesDueDate: task.dueDate,
    };
    if (exception) {
      occurrence.isException = true;
      if (exception.title) occurrence.title = exception.title;
      if (exception.notes !== null) occurrence.notes = exception.notes || null;
      if (exception.timeOverridden) {
        occurrence.startTime = exception.startTime;
        occurrence.endTime = exception.endTime;
      }
    }
    out.push(occurrence);
  }
  return out;
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
    if (repeat.monthWeek != null && repeat.monthWeekday != null) {
      const week = (MONTH_WEEK_OPTIONS.find((o) => o.value === repeat.monthWeek)?.label ?? "").toLowerCase();
      const when = `the ${week} ${WEEKDAY_NAMES[repeat.monthWeekday]}`;
      base = n === 1 ? `Monthly on ${when}` : `Every ${n} months on ${when}`;
    } else {
      const day = fromDateKey(eventDate).getDate();
      base = n === 1 ? `Monthly on day ${day}` : `Every ${n} months on day ${day}`;
    }
  } else {
    base = n === 1 ? "Every year" : `Every ${n} years`;
  }
  return repeat.until ? `${base}, until ${repeat.until}` : base;
}
