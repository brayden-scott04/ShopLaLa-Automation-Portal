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
import { buildMonthGrid } from "@/lib/calendar-date-utils";
import { UpcomingPanel } from "./_components/upcoming-panel";
import { CalendarSidebar } from "./_components/calendar-sidebar";
import { MonthGrid } from "./_components/month-grid";
import { DayTasksDialog } from "./_components/day-tasks-dialog";
import { TaskFormDialog } from "./_components/task-form-dialog";
import { ManageAccessDialog } from "./_components/manage-access-dialog";
import { NameCalendarDialog } from "./_components/name-calendar-dialog";

export default function CalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

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
      const grid = buildMonthGrid(year, month);
      const start = grid[0];
      const end = grid[grid.length - 1];
      const { data } = await getTasksForRange(Array.from(selectedIds), start, end);
      setTasks(data ?? []);
    });
  }, [year, month, selectedIds]);

  useEffect(() => {
    loadCalendars();
    loadUpcoming();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectionReady) loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, selectedIds, selectionReady]);

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

  function goToMonth(delta: number) {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  function goToToday() {
    const today = new Date();
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  }

  const editableCalendarIds = new Set(
    calendars.filter((c) => c.myRole === "owner" || c.myRole === "editor").map((c) => c.id)
  );
  const editableCalendars = calendars.filter((c) => editableCalendarIds.has(c.id));

  const eventsByDate = new Map<string, CalendarTask[]>();
  const dueByDate = new Map<string, CalendarTask[]>();
  tasks.forEach((t) => {
    if (selectedIds.has(t.calendarId)) {
      const eventList = eventsByDate.get(t.eventDate) ?? [];
      eventList.push(t);
      eventsByDate.set(t.eventDate, eventList);
      if (t.dueDate) {
        const dueList = dueByDate.get(t.dueDate) ?? [];
        dueList.push(t);
        dueByDate.set(t.dueDate, dueList);
      }
    }
  });

  const dayTasks = dayDialogDate ? eventsByDate.get(dayDialogDate) ?? [] : [];
  const dayDueTasks = dayDialogDate ? dueByDate.get(dayDialogDate) ?? [] : [];

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

          <MonthGrid
            year={year}
            month={month}
            eventsByDate={eventsByDate}
            dueByDate={dueByDate}
            onPrevMonth={() => goToMonth(-1)}
            onNextMonth={() => goToMonth(1)}
            onToday={goToToday}
            onDayClick={(dateKey) => setDayDialogDate(dateKey)}
          />
        </div>
      </div>

      <DayTasksDialog
        date={dayDialogDate}
        tasks={dayTasks}
        dueTasks={dayDueTasks}
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
