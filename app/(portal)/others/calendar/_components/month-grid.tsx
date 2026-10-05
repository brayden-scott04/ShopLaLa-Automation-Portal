"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { colorFor } from "@/lib/calendar-constants";
import { buildMonthGrid, diffDays, monthLabel, todayKey } from "@/lib/calendar-date-utils";
import type { CalendarTask } from "@/lib/actions/calendar";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// Rows a day cell shows while its week is collapsed — ribbons and chips share the budget.
const MAX_ROWS_PER_DAY = 3;

type RibbonCell = { task: CalendarTask; isStart: boolean; isEnd: boolean };

/**
 * Lays spanning tasks that touch this week into lanes so overlapping ranges
 * never collide. Returns one array per lane, each with 7 slots (one per day
 * of the week, null where that lane has nothing that day).
 */
function layoutWeekRibbons(week: string[], spanningTasks: CalendarTask[]): (RibbonCell | null)[][] {
  const weekStart = week[0];
  const weekEnd = week[6];
  const overlapping = spanningTasks
    .filter((t) => t.eventDate <= weekEnd && (t.dueDate as string) >= weekStart)
    .map((task) => ({
      task,
      startCol: Math.min(6, Math.max(0, diffDays(weekStart, task.eventDate))),
      endCol: Math.min(6, Math.max(0, diffDays(weekStart, task.dueDate as string))),
    }))
    .sort((a, b) => a.startCol - b.startCol);

  const lanes: (RibbonCell | null)[][] = [];
  const laneEnds: number[] = [];

  overlapping.forEach(({ task, startCol, endCol }) => {
    let lane = laneEnds.findIndex((end) => end < startCol);
    if (lane === -1) {
      lane = lanes.length;
      lanes.push(Array(7).fill(null));
      laneEnds.push(-1);
    }
    laneEnds[lane] = endCol;
    for (let col = startCol; col <= endCol; col++) {
      // isStart/isEnd compare against the task's real dates, not the row-clipped
      // column bounds, so a ribbon that merely wraps into the next week (rather
      // than truly starting/ending there) doesn't get a rounded cap or the flag.
      const date = week[col];
      const isStart = date === task.eventDate;
      const isEnd = date === task.dueDate;
      lanes[lane][col] = { task, isStart, isEnd };
    }
  });

  return lanes;
}

export function MonthGrid({
  year,
  month,
  eventsByDate,
  dueByDate,
  spanningTasks,
  onPrevMonth,
  onNextMonth,
  onToday,
  onDayClick,
  onEditTask,
}: {
  year: number;
  month: number;
  eventsByDate: Map<string, CalendarTask[]>;
  dueByDate: Map<string, CalendarTask[]>;
  spanningTasks: CalendarTask[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onDayClick: (dateKey: string) => void;
  onEditTask: (task: CalendarTask) => void;
}) {
  const days = buildMonthGrid(year, month);
  const today = todayKey();
  const weeks: string[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  // Keyed by the week's Monday. A whole week expands at once so its cells stay
  // the same height and its ribbons stay continuous.
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());

  function setWeekExpanded(weekKey: string, expanded: boolean) {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (expanded) next.add(weekKey);
      else next.delete(weekKey);
      return next;
    });
  }

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

      <div className="overflow-hidden rounded-lg border border-border">
        <div className="grid grid-cols-7">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="border-b border-border bg-muted/50 px-2 py-1.5 text-center text-xs font-medium text-muted-foreground"
            >
              {label}
            </div>
          ))}
        </div>

        {weeks.map((week) => {
          const lanes = layoutWeekRibbons(week, spanningTasks);
          const expanded = expandedWeeks.has(week[0]);

          return (
            <div key={week[0]} className="grid grid-cols-7">
              {week.map((dateKey, colIndex) => {
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

                // Collapsed budget: ribbons keep their lane (so they line up across
                // the week), chips take whatever rows are left below this day's
                // last visible ribbon.
                const collapsedLanes = lanes.slice(0, MAX_ROWS_PER_DAY);
                const collapsedLaneRows =
                  collapsedLanes.reduce((last, lane, i) => (lane[colIndex] ? i : last), -1) + 1;
                const collapsedChipSlots = MAX_ROWS_PER_DAY - collapsedLaneRows;
                const hiddenCount =
                  lanes.slice(MAX_ROWS_PER_DAY).filter((lane) => lane[colIndex]).length +
                  Math.max(0, entries.length - collapsedChipSlots);

                const dayLanes = expanded
                  ? lanes.slice(0, lanes.reduce((last, lane, i) => (lane[colIndex] ? i : last), -1) + 1)
                  : collapsedLanes.slice(0, collapsedLaneRows);
                const chips = expanded ? entries : entries.slice(0, collapsedChipSlots);

                return (
                  <div
                    key={dateKey}
                    role="button"
                    tabIndex={0}
                    onClick={() => onDayClick(dateKey)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onDayClick(dateKey);
                      }
                    }}
                    className={`flex min-h-24 cursor-pointer flex-col items-stretch gap-1 border-b border-r border-border p-1.5 text-left align-top hover:bg-accent ${
                      colIndex === 6 ? "border-r-0" : ""
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

                    {dayLanes.map((lane, laneIndex) => {
                      const cell = lane[colIndex];
                      if (!cell) return <div key={laneIndex} className="h-4" />;
                      const color = colorFor(cell.task.color);
                      return (
                        <button
                          key={laneIndex}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditTask(cell.task);
                          }}
                          title={cell.task.title}
                          className={`flex h-4 min-w-0 shrink-0 items-center gap-0.5 pl-1 text-left text-[10px] font-medium leading-4 text-white ${
                            cell.isStart ? "-ml-1.5 rounded-l" : "-ml-px"
                          } ${cell.isEnd ? "-mr-1.5 rounded-r pr-1" : "-mr-px"}`}
                          style={{ backgroundColor: color.hex }}
                        >
                          {cell.isEnd && <Flag className="size-2.5 shrink-0" />}
                          <span className="truncate">{cell.task.title}</span>
                        </button>
                      );
                    })}

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
                      {hiddenCount > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setWeekExpanded(week[0], !expanded);
                          }}
                          className="self-start rounded px-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          {expanded ? "Show less" : `+${hiddenCount} more`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
