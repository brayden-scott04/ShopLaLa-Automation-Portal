/** Local-time "YYYY-MM-DD" helpers — deliberately avoid toISOString() (UTC), which can shift the day. */

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function addDays(key: string, days: number): string {
  const d = fromDateKey(key);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

export function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

/** A 6-week (42-day) grid starting on the Monday on/before the 1st of the month. */
export function buildMonthGrid(year: number, month: number): string[] {
  const first = new Date(year, month, 1);
  const jsDay = first.getDay(); // 0=Sun..6=Sat
  const mondayOffset = (jsDay + 6) % 7; // days since the most recent Monday
  const gridStart = new Date(year, month, 1 - mondayOffset);
  const days: string[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push(toDateKey(d));
  }
  return days;
}

export function formatRelativeDay(key: string): string {
  const diff = Math.round(
    (fromDateKey(key).getTime() - fromDateKey(todayKey()).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  return `In ${diff}d`;
}

export function formatDayLabel(key: string): string {
  return fromDateKey(key).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/** True when a task has a due date distinct from its event (start) date — i.e. it spans multiple days. */
export function isSpanningTask(task: { eventDate: string; dueDate: string | null }): boolean {
  return !!task.dueDate && task.dueDate !== task.eventDate;
}

/** Inclusive list of date keys from `startKey` to `endKey`. */
export function eachDateKey(startKey: string, endKey: string): string[] {
  const keys: string[] = [];
  let cur = startKey;
  while (cur <= endKey) {
    keys.push(cur);
    cur = addDays(cur, 1);
  }
  return keys;
}

/** Day count from `fromKey` to `toKey` (positive when `toKey` is later). */
export function diffDays(fromKey: string, toKey: string): number {
  const ms = fromDateKey(toKey).getTime() - fromDateKey(fromKey).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}
