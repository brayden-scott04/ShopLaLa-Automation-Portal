export interface TaskColorOption {
  key: string;
  label: string;
  hex: string;
  dot: string;
  ring: string;
  chip: string;
}

/** Fixed 6-colour palette for task pins, Apple-Reminders style. */
export const TASK_COLORS: TaskColorOption[] = [
  { key: "red", label: "Red", hex: "#ef4444", dot: "bg-red-500", ring: "ring-red-500", chip: "bg-red-500/15 text-red-600 dark:text-red-400" },
  { key: "orange", label: "Orange", hex: "#f97316", dot: "bg-orange-500", ring: "ring-orange-500", chip: "bg-orange-500/15 text-orange-600 dark:text-orange-400" },
  { key: "yellow", label: "Yellow", hex: "#eab308", dot: "bg-yellow-500", ring: "ring-yellow-500", chip: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400" },
  { key: "green", label: "Green", hex: "#22c55e", dot: "bg-green-500", ring: "ring-green-500", chip: "bg-green-500/15 text-green-600 dark:text-green-400" },
  { key: "blue", label: "Blue", hex: "#3b82f6", dot: "bg-blue-500", ring: "ring-blue-500", chip: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
  { key: "purple", label: "Purple", hex: "#a855f7", dot: "bg-purple-500", ring: "ring-purple-500", chip: "bg-purple-500/15 text-purple-600 dark:text-purple-400" },
];

export type TaskColorKey = (typeof TASK_COLORS)[number]["key"];
export const DEFAULT_TASK_COLOR: TaskColorKey = "blue";

export function colorFor(key: string): TaskColorOption {
  return TASK_COLORS.find((c) => c.key === key) ?? TASK_COLORS[TASK_COLORS.length - 1];
}

export const CALENDAR_MEMBER_ROLES = ["editor", "viewer"] as const;
export type CalendarMemberRole = (typeof CALENDAR_MEMBER_ROLES)[number];
export type CalendarRole = "owner" | CalendarMemberRole;
