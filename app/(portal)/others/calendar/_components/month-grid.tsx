"use client";

import { ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { colorFor } from "@/lib/calendar-constants";
import { buildMonthGrid, monthLabel, todayKey } from "@/lib/calendar-date-utils";
import type { CalendarTask } from "@/lib/actions/calendar";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_CHIPS_PER_DAY = 3;

export function MonthGrid({
  year,
  month,
  eventsByDate,
  dueByDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  onDayClick,
}: {
  year: number;
  month: number;
  eventsByDate: Map<string, CalendarTask[]>;
  dueByDate: Map<string, CalendarTask[]>;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onDayClick: (dateKey: string) => void;
}) {
  const days = buildMonthGrid(year, month);
  const today = todayKey();

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">{monthLabel(year, month)}</h3>
        <div className="flex items-center gap-1.5">
          <Button size="sm" variant="outline" onClick={onToday}>
            Today
          </Button>
          <Button size="icon-sm" variant="outline" onClick={onPrevMonth} title="Previous month">
            <ChevronLeft />
          </Button>
          <Button size="icon-sm" variant="outline" onClick={onNextMonth} title="Next month">
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 overflow-hidden rounded-lg border border-border">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="border-b border-border bg-muted/50 px-2 py-1.5 text-center text-xs font-medium text-muted-foreground"
          >
            {label}
          </div>
        ))}

        {days.map((dateKey, i) => {
          const inMonth = Number(dateKey.slice(5, 7)) - 1 === month;
          const isToday = dateKey === today;
          const events = eventsByDate.get(dateKey) ?? [];
          const dues = dueByDate.get(dateKey) ?? [];
          const dayNum = Number(dateKey.slice(8, 10));

          // De-duped per task: a task due on the same day it's pinned shows
          // once, as the flagged "due" chip.
          const merged = new Map<string, { task: CalendarTask; isDuePin: boolean }>();
          events.forEach((t) => merged.set(t.id, { task: t, isDuePin: false }));
          dues.forEach((t) => merged.set(t.id, { task: t, isDuePin: true }));
          const entries = Array.from(merged.values());
          const chips = entries.slice(0, MAX_CHIPS_PER_DAY);
          const overflow = entries.length - chips.length;

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onDayClick(dateKey)}
              className={`flex min-h-24 flex-col items-stretch gap-1 border-b border-r border-border p-1.5 text-left align-top hover:bg-accent ${
                (i + 1) % 7 === 0 ? "border-r-0" : ""
              } ${inMonth ? "" : "bg-muted/20"}`}
            >
              <span
                className={`self-start rounded-full px-1.5 text-xs ${
                  isToday
                    ? "bg-primary font-semibold text-primary-foreground"
                    : inMonth
                      ? "text-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {dayNum}
              </span>

              <div className="flex flex-1 flex-col gap-1">
                {chips.map(({ task, isDuePin }) => {
                  const color = colorFor(task.color);
                  return (
                    <span
                      key={task.id}
                      className={`flex items-center gap-1 truncate rounded px-1 py-0.5 text-[11px] font-medium ${color.chip} ${
                        isDuePin ? `ring-1 ${color.ring}` : ""
                      }`}
                    >
                      {isDuePin && <Flag className="size-2.5 shrink-0" />}
                      <span className="truncate">{task.title}</span>
                    </span>
                  );
                })}
                {overflow > 0 && (
                  <span className="text-[11px] text-muted-foreground">+{overflow} more</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
