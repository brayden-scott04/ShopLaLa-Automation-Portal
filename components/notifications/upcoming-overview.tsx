"use client";

import Link from "next/link";
import { CalendarDays, Flag, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/client";
import { addDays, formatTimeRange, todayKey } from "@/lib/calendar-date-utils";
import { colorFor } from "@/lib/calendar-constants";
import { PRIORITY_CLASSES } from "@/lib/tasks-constants";
import { calendarLink, taskLink } from "@/lib/notifications-constants";
import { useDayLabel } from "./notification-text";

export interface UpcomingTask {
  id: string;
  title: string;
  date: string | null;
  dueDate: string | null;
  priority: number;
}

export interface UpcomingEvent {
  key: string;
  title: string;
  /** The day it's on (an occurrence's own date for repeating events). */
  date: string;
  startTime: string | null;
  endTime: string | null;
  calendarName: string;
  color: string;
}

const TODO_LIMIT = 6;
const EVENT_LIMIT = 8;

function SectionTitle({ icon: Icon, children, href, linkText }: {
  icon: typeof ListChecks;
  children: React.ReactNode;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <h4 className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        <Icon className="size-3.5" />
        {children}
      </h4>
      {href && (
        <Link href={href} className="text-xs font-medium text-primary hover:underline">
          {linkText}
        </Link>
      )}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">{children}</p>;
}

function PriorityChip({ level }: { level: number }) {
  const t = useT();
  return (
    <span className={cn("shrink-0 rounded px-1.5 py-0.5 text-[10px] leading-none", PRIORITY_CLASSES[level])}>
      {t("upcoming.priority", { level })}
    </span>
  );
}

export function UpcomingOverview({
  tasks,
  events,
  showTasks,
  showCalendar,
  className,
}: {
  tasks: UpcomingTask[];
  events: UpcomingEvent[];
  showTasks: boolean;
  showCalendar: boolean;
  className?: string;
}) {
  const t = useT();
  const day = useDayLabel();
  const today = todayKey();
  const weekOut = addDays(today, 7);

  const dueSoon = tasks
    .filter((task) => task.dueDate && task.dueDate <= weekOut)
    .sort((a, b) => a.dueDate!.localeCompare(b.dueDate!) || a.priority - b.priority);
  const dueIds = new Set(dueSoon.map((task) => task.id));
  const toDo = tasks
    .filter((task) => !dueIds.has(task.id))
    .sort((a, b) => a.priority - b.priority || (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999"));

  function dueText(due: string) {
    if (due < today) return `${t("upcoming.overdue")} · ${day(due, { relative: false })}`;
    if (due === today) return t("upcoming.dueToday");
    return t("upcoming.dueOn", { date: day(due) });
  }

  return (
    <section className={cn("space-y-5 rounded-xl border border-border bg-card p-4", className)}>
      <h3 className="text-sm font-semibold text-foreground">{t("upcoming.title")}</h3>

      {showTasks && (
        <div>
          <SectionTitle icon={Flag} href="/others/tasks" linkText={t("upcoming.viewTasks")}>
            {t("upcoming.dueSoon")}
          </SectionTitle>
          {dueSoon.length === 0 ? (
            <Empty>{t("upcoming.noDue")}</Empty>
          ) : (
            <ul className="space-y-1">
              {dueSoon.map((task) => {
                const overdue = task.dueDate! < today;
                return (
                  <li key={task.id}>
                    <Link
                      href={taskLink(task.id)}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent/60"
                    >
                      <PriorityChip level={task.priority} />
                      <span className="min-w-0 flex-1 truncate text-foreground">{task.title}</span>
                      <span
                        className={cn(
                          "shrink-0 text-xs",
                          overdue ? "font-semibold text-destructive" : task.dueDate === today ? "font-medium text-amber-700 dark:text-amber-400" : "text-muted-foreground"
                        )}
                      >
                        {dueText(task.dueDate!)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {showTasks && (
        <div>
          <SectionTitle icon={ListChecks}>{t("upcoming.toDo")}</SectionTitle>
          {toDo.length === 0 ? (
            <Empty>{t("upcoming.noTodo")}</Empty>
          ) : (
            <ul className="space-y-1">
              {toDo.slice(0, TODO_LIMIT).map((task) => (
                <li key={task.id}>
                  <Link
                    href={taskLink(task.id)}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent/60"
                  >
                    <PriorityChip level={task.priority} />
                    <span className="min-w-0 flex-1 truncate text-foreground">{task.title}</span>
                    {task.dueDate && <span className="shrink-0 text-xs text-muted-foreground">{dueText(task.dueDate)}</span>}
                  </Link>
                </li>
              ))}
              {toDo.length > TODO_LIMIT && (
                <li>
                  <Link href="/others/tasks" className="block px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
                    {t("upcoming.more", { count: toDo.length - TODO_LIMIT })}
                  </Link>
                </li>
              )}
            </ul>
          )}
        </div>
      )}

      {showCalendar && (
        <div>
          <SectionTitle icon={CalendarDays} href="/others/calendar" linkText={t("upcoming.viewCalendar")}>
            {t("upcoming.events")}
          </SectionTitle>
          {events.length === 0 ? (
            <Empty>{t("upcoming.noEvents")}</Empty>
          ) : (
            <ul className="space-y-1">
              {events.slice(0, EVENT_LIMIT).map((event) => (
                <li key={event.key}>
                  <Link
                    href={calendarLink(event.date)}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent/60"
                  >
                    <span className={cn("size-2.5 shrink-0 rounded-full", colorFor(event.color).dot)} />
                    <span className="w-20 shrink-0 text-xs font-medium text-muted-foreground">{day(event.date)}</span>
                    <span className="min-w-0 flex-1 truncate text-foreground">{event.title}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {event.startTime ? formatTimeRange(event) : t("upcoming.allDay")}
                    </span>
                  </Link>
                </li>
              ))}
              {events.length > EVENT_LIMIT && (
                <li>
                  <Link href="/others/calendar" className="block px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
                    {t("upcoming.more", { count: events.length - EVENT_LIMIT })}
                  </Link>
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
