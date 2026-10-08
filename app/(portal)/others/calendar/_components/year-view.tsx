"use client";

import { buildMonthGrid, todayKey } from "@/lib/calendar-date-utils";
import { colorFor } from "@/lib/calendar-constants";
import type { CalendarTask } from "@/lib/actions/calendar";

const WEEKDAY_INITIALS = ["M", "T", "W", "T", "F", "S", "S"];

export function YearView({
  year,
  activeByDate,
  onPickMonth,
  onPickDay,
}: {
  year: number;
  activeByDate: Map<string, CalendarTask[]>;
  onPickMonth: (month: number) => void;
  onPickDay: (dateKey: string) => void;
}) {
  const today = todayKey();

  return (
    <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 12 }, (_, month) => {
        const days = buildMonthGrid(year, month);
        // Drop a trailing all-outside-month row so short months don't show an empty week.
        const rows = days.slice(35).some((d) => Number(d.slice(5, 7)) - 1 === month) ? 42 : 35;
        return (
          <div key={month} className="rounded-lg border border-border p-3">
            <button
              type="button"
              onClick={() => onPickMonth(month)}
              className="mb-2 text-sm font-semibold text-foreground hover:underline"
            >
              {new Date(year, month, 1).toLocaleDateString(undefined, { month: "long" })}
            </button>
            <div className="grid grid-cols-7 gap-y-0.5 text-center text-[10px] text-muted-foreground">
              {WEEKDAY_INITIALS.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
              {days.slice(0, rows).map((dateKey) => {
                const inMonth = Number(dateKey.slice(5, 7)) - 1 === month;
                if (!inMonth) return <span key={dateKey} />;
                const tasks = activeByDate.get(dateKey) ?? [];
                const isToday = dateKey === today;
                return (
                  <button
                    key={dateKey}
                    type="button"
                    onClick={() => onPickDay(dateKey)}
                    title={tasks.length ? tasks.map((t) => t.title).join("\n") : undefined}
                    className={`mx-auto flex size-7 flex-col items-center justify-center rounded-md text-xs hover:bg-accent ${
                      isToday ? "bg-primary font-semibold text-primary-foreground hover:bg-primary" : "text-foreground"
                    }`}
                  >
                    {Number(dateKey.slice(8, 10))}
                    <span className="flex h-1 gap-px">
                      {tasks.slice(0, 3).map((t, i) => (
                        <span key={i} className="size-1 rounded-full" style={{ backgroundColor: colorFor(t.color).hex }} />
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
