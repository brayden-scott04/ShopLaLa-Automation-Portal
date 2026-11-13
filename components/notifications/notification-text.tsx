"use client";

import { Fragment, type ReactNode } from "react";
import { useLocale, useT } from "@/lib/i18n/client";
import { formatDate } from "@/lib/i18n/format";
import { formatTime, todayKey, addDays } from "@/lib/calendar-date-utils";
import type { Translator } from "@/lib/i18n/translate";
import { LOCALE_TAGS, type Locale } from "@/lib/i18n/config";
import type { NotificationChange, PortalNotification } from "@/lib/notifications-constants";

const MARK = "\u0001";

/** Renders a translated template with `{title}` in bold. */
function withBoldTitle(text: string, title: string): ReactNode {
  const parts = text.split(MARK);
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && <strong className="font-semibold text-foreground">{title}</strong>}
    </Fragment>
  ));
}

export function useDayLabel() {
  const t = useT();
  const locale = useLocale();
  return (date: string, { relative = true }: { relative?: boolean } = {}) => dayLabel(t, locale, date, relative);
}

function dayLabel(t: Translator, locale: Locale, date: string, relative = true): string {
  if (relative) {
    const today = todayKey();
    if (date === today) return t("notifications.today");
    if (date === addDays(today, 1)) return t("notifications.tomorrow");
    if (date === addDays(today, -1)) return t("notifications.yesterday");
  }
  return formatDate(locale, date, { weekday: "short", day: "numeric", month: "short" });
}

/** "1pm" / "1pm – 2:30pm" from "HH:MM" or "HH:MM-HH:MM"; null = all day. */
function timeText(t: Translator, value: string | null | undefined): string {
  if (!value) return t("notifications.allDay");
  const [start, end] = value.split("-");
  return end ? `${formatTime(start)} – ${formatTime(end)}` : formatTime(start);
}

function changeLine(t: Translator, locale: Locale, c: NotificationChange): string {
  const date = (v: string | null | undefined) => (v ? dayLabel(t, locale, v, false) : t("notifications.none"));
  const plain = (v: string | null | undefined) => v || t("notifications.none");
  switch (c.field) {
    case "title":
      return t("notifications.changeTitle", { from: plain(c.from), to: plain(c.to) });
    case "date":
      return t("notifications.changeDate", { from: date(c.from), to: date(c.to) });
    case "dueDate":
      return t("notifications.changeDueDate", { from: date(c.from), to: date(c.to) });
    case "time":
      return t("notifications.changeTime", { from: timeText(t, c.from), to: timeText(t, c.to) });
    case "priority":
      return t("notifications.changePriority", { from: `P${plain(c.from)}`, to: `P${plain(c.to)}` });
    case "calendar":
      return t("notifications.changeCalendar", { from: plain(c.from), to: plain(c.to) });
    case "notes":
      return t("notifications.changeNotes");
    case "repeat":
      return t("notifications.changeRepeat");
    case "reset":
      return t("notifications.changeReset");
  }
}

export interface NotificationText {
  headline: ReactNode;
  /** Extra lines under the headline: what changed, when, the update text, … */
  details: string[];
}

export function useNotificationText(): (n: PortalNotification) => NotificationText {
  const t = useT();
  const locale = useLocale();

  return (n) => {
    const d = n.data;
    const title = d.title ?? "";
    const actor = n.actor ?? t("notifications.someone");
    const vars = { actor, title: MARK };
    const day = (v: string | null | undefined) => (v ? dayLabel(t, locale, v) : "");
    const when = () => {
      const dayText = d.date ? day(d.date) : "";
      const dayPhrase =
        d.date && d.date !== todayKey() && d.date !== addDays(todayKey(), 1)
          ? t("notifications.onDate", { date: dayText })
          : dayText;
      return d.startTime ? t("notifications.timeDay", { time: timeText(t, timeValue(d)), day: dayPhrase }) : dayPhrase;
    };
    const eventLine = () => [d.date ? `${day(d.date)} · ${timeText(t, timeValue(d))}` : "", d.calendarName ?? ""]
      .filter(Boolean)
      .join(" · ");
    const changes = (d.changes ?? []).map((c) => changeLine(t, locale, c));
    const due = d.dueDate ? [t("notifications.dueOn", { date: day(d.dueDate) })] : [];
    const h = (text: string) => withBoldTitle(text, title);

    switch (n.kind) {
      case "cal_assigned":
        return d.dates && d.dates.length > 1
          ? { headline: h(t("notifications.calAssignedDays", { ...vars, count: d.dates.length })), details: [eventLine()] }
          : { headline: h(t("notifications.calAssigned", vars)), details: [eventLine()] };
      case "cal_unassigned":
        return { headline: h(t("notifications.calUnassigned", vars)), details: [] };
      case "cal_updated":
        return d.scope === "occurrence"
          ? { headline: h(t("notifications.calUpdatedOccurrence", { ...vars, date: day(d.date) })), details: changes }
          : { headline: h(t("notifications.calUpdated", vars)), details: changes };
      case "cal_deleted":
        if (d.scope === "this") return { headline: h(t("notifications.calDeletedOne", { ...vars, date: day(d.date) })), details: [] };
        if (d.scope === "following")
          return { headline: h(t("notifications.calDeletedFollowing", { ...vars, date: day(d.date) })), details: [] };
        return { headline: h(t("notifications.calDeleted", vars)), details: [] };
      case "cal_ping": {
        const isMeeting = (d.calendarName ?? "").trim().toLowerCase() === "meeting";
        const key = isMeeting ? "notifications.pingMeeting" : "notifications.pingEvent";
        return {
          headline: t(key, { when: when() }),
          details: [`${title} · ${eventLine()}`, t("notifications.pingFrom", { actor })],
        };
      }
      case "task_assigned":
        return { headline: h(t("notifications.taskAssigned", vars)), details: due };
      case "task_unassigned":
        return { headline: h(t("notifications.taskUnassigned", vars)), details: [] };
      case "task_updated":
        return { headline: h(t("notifications.taskUpdated", vars)), details: changes };
      case "task_progress":
        return { headline: h(t("notifications.taskProgress", vars)), details: d.body ? [`“${d.body}”`] : [] };
      case "task_done":
        return { headline: h(t(d.done === false ? "notifications.taskReopened" : "notifications.taskDone", vars)), details: [] };
      case "task_ack":
        return { headline: h(t("notifications.taskAck", vars)), details: [] };
      case "task_deleted":
        return { headline: h(t("notifications.taskDeleted", vars)), details: [] };
      case "task_ping":
        return { headline: h(t("notifications.pingTask", { title: MARK })), details: [...due, t("notifications.pingFrom", { actor })] };
      default:
        return { headline: title, details: [] };
    }
  };
}

function timeValue(d: { startTime?: string | null; endTime?: string | null }): string | null {
  if (!d.startTime) return null;
  return d.endTime ? `${d.startTime}-${d.endTime}` : d.startTime;
}

/** "just now" / "5 min ago" / "yesterday" … in the reader's language. */
export function useRelativeTime() {
  const t = useT();
  const locale = useLocale();
  return (iso: string) => {
    const diffSec = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
    if (Math.abs(diffSec) < 45) return t("notifications.justNow");
    const rtf = new Intl.RelativeTimeFormat(LOCALE_TAGS[locale], { numeric: "auto" });
    const minutes = Math.round(diffSec / 60);
    if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
    const hours = Math.round(minutes / 60);
    if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
    const days = Math.round(hours / 24);
    if (Math.abs(days) < 7) return rtf.format(days, "day");
    return formatDate(locale, iso, { day: "numeric", month: "short" });
  };
}
