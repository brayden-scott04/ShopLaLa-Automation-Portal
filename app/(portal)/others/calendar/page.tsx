"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import { CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { calendar as calendarItem } from "@/lib/others";
import {
  getMyCalendars,
  createCalendar,
  renameCalendar,
  deleteCalendar,
  getTasksForRange,
  getUpcomingTasks,
  deleteTask,
  type CalendarSummary,
  type CalendarTask,
} from "@/lib/actions/calendar";
import {
  addDays,
  addMonths,
  buildMonthGrid,
  buildWeek,
  compareByTime,
  eachDateKey,
  formatDayLabel,
  isSpanningTask,
  monthLabel,
  todayKey,
  weekLabel,
} from "@/lib/calendar-date-utils";
import { expandTask } from "@/lib/calendar-recurrence";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpcomingPanel } from "./_components/upcoming-panel";
import { CalendarSidebar } from "./_components/calendar-sidebar";
import { MonthGrid } from "./_components/month-grid";
import { WeekView } from "./_components/week-view";
import { DayView } from "./_components/day-view";
import { YearView } from "./_components/year-view";
import { DayTasksDialog } from "./_components/day-tasks-dialog";
import { TaskFormDialog } from "./_components/task-form-dialog";
import { ManageAccessDialog } from "./_components/manage-access-dialog";
import { NameCalendarDialog } from "./_components/name-calendar-dialog";

type ViewMode = "month" | "week" | "day" | "year";
const VIEW_OPTIONS: { key: ViewMode; label: string }[] = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
];

/** The inclusive date range a view needs tasks for. */
function rangeFor(view: ViewMode, anchor: string): [string, string] {
  const d = new Date(Number(anchor.slice(0, 4)), Number(anchor.slice(5, 7)) - 1, 1);
  if (view === "month") {
    const grid = buildMonthGrid(d.getFullYear(), d.getMonth());
    return [grid[0], grid[grid.length - 1]];
  }
  if (view === "week") {
    const week = buildWeek(anchor);
    return [week[0], week[6]];
  }
  if (view === "day") return [anchor, anchor];
  return [`${d.getFullYear()}-01-01`, `${d.getFullYear()}-12-31`];
}

export default function CalendarPage() {
  const [view, setView] = useState<ViewMode>("month");
  const [anchor, setAnchor] = useState(todayKey());
  const year = Number(anchor.slice(0, 4));
  const month = Number(anchor.slice(5, 7)) - 1;

  function changeView(next: ViewMode) {
    setView(next);
  }

  const [calendars, setCalendars] = useState<CalendarSummary[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectionReady, setSelectionReady] = useState(false);

  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [upcoming, setUpcoming] = useState<CalendarTask[]>([]);
  const [, startTransition] = useTransition();

  const [dayDialogDate, setDayDialogDate] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState<{ open: boolean; task: CalendarTask | null; date: string; calendarId?: string }>({
    open: false,
    task: null,
    date: "",
  });
  const [newCalendarOpen, setNewCalendarOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<CalendarSummary | null>(null);
  const [manageAccessTarget, setManageAccessTarget] = useState<CalendarSummary | null>(null);

  const loadCalendars = useCallback(() => {
    startTransition(async () => {
      const { data } = await getMyCalendars();
      const list = data ?? [];
      setCalendars(list);
      setSelectedIds((prev) => {
        if (selectionReady) {
          // Keep prior selection, but drop calendars that no longer exist and
          // include newly-created ones (they should show up immediately).
          const known = new Set(list.map((c) => c.id));
          const next = new Set(Array.from(prev).filter((id) => known.has(id)));
          list.forEach((c) => {
            if (!prev.has(c.id) && !next.has(c.id)) next.add(c.id);
          });
          return next;
        }
        return new Set(list.map((c) => c.id));
      });
      setSelectionReady(true);
    });
  }, [selectionReady]);

  const loadUpcoming = useCallback(() => {
    startTransition(async () => {
      const { data } = await getUpcomingTasks();
      setUpcoming(data ?? []);
    });
  }, []);

  const loadTasks = useCallback(() => {
    startTransition(async () => {
      if (selectedIds.size === 0) {
        setTasks([]);
        return;
      }
      const [start, end] = rangeFor(view, anchor);
      const { data } = await getTasksForRange(Array.from(selectedIds), start, end);
      setTasks(data ?? []);
    });
  }, [view, anchor, selectedIds]);

  useEffect(() => {
    loadCalendars();
    loadUpcoming();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectionReady) loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, anchor, selectedIds, selectionReady]);

  function refreshAfterMutation() {
    loadTasks();
    loadUpcoming();
  }

  function toggleCalendar(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function step(delta: number) {
    setAnchor((a) => {
      if (view === "month") return addMonths(a, delta);
      if (view === "week") return addDays(a, 7 * delta);
      if (view === "day") return addDays(a, delta);
      return addMonths(a, 12 * delta);
    });
  }

  const periodLabel =
    view === "month"
      ? monthLabel(year, month)
      : view === "week"
        ? weekLabel(anchor)
        : view === "day"
          ? formatDayLabel(anchor)
          : String(year);

  const editableCalendarIds = new Set(
    calendars.filter((c) => c.myRole === "owner" || c.myRole === "editor").map((c) => c.id)
  );
  const editableCalendars = calendars.filter((c) => editableCalendarIds.has(c.id));

  const [rangeStart, rangeEnd] = rangeFor(view, anchor);
  const selectedTasks = tasks
    .filter((t) => selectedIds.has(t.calendarId))
    .flatMap((t) => expandTask(t, rangeStart, rangeEnd))
    .sort(compareByTime);
  const spanningTasks = selectedTasks.filter(isSpanningTask);
  const singleDayTasks = selectedTasks.filter((t) => !isSpanningTask(t));

  const eventsByDate = new Map<string, CalendarTask[]>();
  const dueByDate = new Map<string, CalendarTask[]>();
  singleDayTasks.forEach((t) => {
    const eventList = eventsByDate.get(t.eventDate) ?? [];
    eventList.push(t);
    eventsByDate.set(t.eventDate, eventList);
    if (t.dueDate) {
      const dueList = dueByDate.get(t.dueDate) ?? [];
      dueList.push(t);
      dueByDate.set(t.dueDate, dueList);
    }
  });

  // Every date a task is "active" on — spanning tasks appear on every day
  // between eventDate and dueDate, not just the two endpoints.
  const activeByDate = new Map<string, CalendarTask[]>();
  selectedTasks.forEach((t) => {
    const keys = t.dueDate ? eachDateKey(t.eventDate, t.dueDate) : [t.eventDate];
    keys.forEach((key) => {
      const list = activeByDate.get(key) ?? [];
      list.push(t);
      activeByDate.set(key, list);
    });
  });

  const dayActiveTasks = dayDialogDate ? activeByDate.get(dayDialogDate) ?? [] : [];

  function handleDeleteCalendar(cal: CalendarSummary) {
    if (!window.confirm(`Delete "${cal.name}" and everything pinned to it? This can't be undone.`)) return;
    startTransition(async () => {
      await deleteCalendar(cal.id);
      loadCalendars();
      refreshAfterMutation();
    });
  }

  function handleDeleteTask(task: CalendarTask) {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    startTransition(async () => {
      await deleteTask(task.id);
      setDayDialogDate(null);
      refreshAfterMutation();
    });
  }

  return (
    <>
      <PageHeader
        icon={CalendarDays}
        title={calendarItem.name}
        description={calendarItem.description}
      />

      <div className="space-y-6 p-6 md:p-8">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground">Upcoming (next 7 days)</h3>
          <UpcomingPanel tasks={upcoming} />
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <CalendarSidebar
            calendars={calendars}
            selectedIds={selectedIds}
            onToggle={toggleCalendar}
            onCreateNew={() => setNewCalendarOpen(true)}
            onRename={(cal) => setRenameTarget(cal)}
            onDelete={handleDeleteCalendar}
            onManageAccess={(cal) => setManageAccessTarget(cal)}
          />

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-foreground">{periodLabel}</h3>
              <div className="flex flex-wrap items-center gap-1.5">
                <div className="flex overflow-hidden rounded-lg border border-border">
                  {VIEW_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => changeView(opt.key)}
                      className={`px-2.5 py-1 text-sm transition-colors ${
                        view === opt.key ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <Button size="sm" variant="outline" onClick={() => setAnchor(todayKey())}>
                  Today
                </Button>
                <Button size="icon-sm" variant="outline" onClick={() => step(-1)} title="Previous">
                  <ChevronLeft />
                </Button>
                <Button size="icon-sm" variant="outline" onClick={() => step(1)} title="Next">
                  <ChevronRight />
                </Button>
              </div>
            </div>

            {view === "month" && (
              <MonthGrid
                year={year}
                month={month}
                eventsByDate={eventsByDate}
                dueByDate={dueByDate}
                spanningTasks={spanningTasks}
                onDayClick={(dateKey) => setDayDialogDate(dateKey)}
                onEditTask={(task) => setTaskForm({ open: true, task, date: task.eventDate })}
              />
            )}
            {view === "week" && (
              <WeekView
                anchor={anchor}
                activeByDate={activeByDate}
                canAdd={editableCalendarIds.size > 0}
                onHeaderClick={(dateKey) => {
                  setAnchor(dateKey);
                  changeView("day");
                }}
                onAddTask={(dateKey) => setTaskForm({ open: true, task: null, date: dateKey })}
                onEditTask={(task) => setTaskForm({ open: true, task, date: task.eventDate })}
              />
            )}
            {view === "day" && (
              <DayView
                date={anchor}
                tasks={activeByDate.get(anchor) ?? []}
                canAdd={editableCalendarIds.size > 0}
                onAddTask={() => setTaskForm({ open: true, task: null, date: anchor })}
                onEditTask={(task) => setTaskForm({ open: true, task, date: task.eventDate })}
              />
            )}
            {view === "year" && (
              <YearView
                year={year}
                activeByDate={activeByDate}
                onPickMonth={(m) => {
                  setAnchor(`${year}-${String(m + 1).padStart(2, "0")}-01`);
                  changeView("month");
                }}
                onPickDay={(dateKey) => {
                  setAnchor(dateKey);
                  changeView("day");
                }}
              />
            )}
          </div>
        </div>
      </div>

      <DayTasksDialog
        date={dayDialogDate}
        activeTasks={dayActiveTasks}
        editableCalendarIds={editableCalendarIds}
        onClose={() => setDayDialogDate(null)}
        onAddTask={() =>
          setTaskForm({ open: true, task: null, date: dayDialogDate ?? "", calendarId: undefined })
        }
        onEditTask={(task) => setTaskForm({ open: true, task, date: task.eventDate })}
        onDeleteTask={handleDeleteTask}
      />

      <TaskFormDialog
        open={taskForm.open}
        calendars={editableCalendars}
        defaultCalendarId={taskForm.calendarId}
        defaultDate={taskForm.date}
        task={taskForm.task}
        onClose={() => setTaskForm((f) => ({ ...f, open: false }))}
        onSaved={() => {
          setTaskForm((f) => ({ ...f, open: false }));
          refreshAfterMutation();
        }}
      />

      <NameCalendarDialog
        open={newCalendarOpen}
        initialName=""
        title="New calendar"
        onClose={() => setNewCalendarOpen(false)}
        onSubmit={async (name) => {
          const { error } = await createCalendar(name);
          if (!error) loadCalendars();
          return { error };
        }}
      />

      <NameCalendarDialog
        open={renameTarget !== null}
        initialName={renameTarget?.name ?? ""}
        title="Rename calendar"
        onClose={() => setRenameTarget(null)}
        onSubmit={async (name) => {
          if (!renameTarget) return { error: "No calendar selected" };
          const { error } = await renameCalendar(renameTarget.id, name);
          if (!error) loadCalendars();
          return { error };
        }}
      />

      <ManageAccessDialog calendar={manageAccessTarget} onClose={() => setManageAccessTarget(null)} />
    </>
  );
}
