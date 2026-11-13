// Shared notification types. Plain module (not "use server") so client components can import it.

export const NOTIFICATION_KINDS = [
  "cal_assigned",
  "cal_unassigned",
  "cal_updated",
  "cal_deleted",
  "cal_ping",
  "task_assigned",
  "task_unassigned",
  "task_updated",
  "task_progress",
  "task_done",
  "task_ack",
  "task_deleted",
  "task_ping",
] as const;
export type NotificationKind = (typeof NOTIFICATION_KINDS)[number];

export type NotificationSource = "calendar_task" | "task";

/**
 * One changed field. Values are raw ("YYYY-MM-DD", "HH:MM" or "HH:MM-HH:MM" for a time range,
 * null = none / all day) and are formatted in the reader's language when rendered.
 */
export interface NotificationChange {
  field: "title" | "notes" | "date" | "dueDate" | "time" | "repeat" | "calendar" | "priority" | "reset";
  from?: string | null;
  to?: string | null;
}

/** The `data` jsonb. Every field is optional; each kind uses the ones it needs. */
export interface NotificationData {
  title?: string;
  /** Event date (calendar) or the occurrence the change/ping is about. */
  date?: string | null;
  /** Calendar copies: every date the person was added on. */
  dates?: string[];
  dueDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  calendarName?: string;
  /** Calendar: "series" = the whole event, "occurrence" = that one day only. Delete: this | following | all. */
  scope?: "series" | "occurrence" | "this" | "following" | "all";
  changes?: NotificationChange[];
  /** Progress update text (trimmed). */
  body?: string;
  done?: boolean;
  priority?: number;
}

export interface PortalNotification {
  id: string;
  kind: NotificationKind;
  actor: string | null;
  sourceType: NotificationSource;
  sourceId: string | null;
  data: NotificationData;
  link: string | null;
  readAt: string | null;
  createdAt: string;
}

export const isPingKind = (kind: NotificationKind) => kind === "cal_ping" || kind === "task_ping";

/** Fired on `window` after anything marks notifications read, so every badge/panel refetches. */
export const NOTIFICATIONS_CHANGED_EVENT = "portal:notifications-changed";

/** How often open pages poll for new notifications. */
export const NOTIFICATIONS_POLL_MS = 30_000;

/** One ping per recipient per event (occurrence) per this window. */
export const PING_COOLDOWN_MS = 60_000;

/** Read notifications older than this are deleted. */
export const NOTIFICATION_RETENTION_DAYS = 60;

/** Calendar names whose events can't be pinged (besides the virtual Shared/International calendars). */
export function isPingableCalendarName(name: string | null | undefined): boolean {
  return (name ?? "").trim().toLowerCase() !== "leave";
}

export function calendarLink(date: string): string {
  return `/others/calendar?date=${date}`;
}

export function taskLink(id: string): string {
  return `/others/tasks?task=${id}`;
}
