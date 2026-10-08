"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  TASK_COLORS,
  DEFAULT_TASK_COLOR,
  type TaskColorKey,
  type RepeatFreq,
  type RepeatRule,
} from "@/lib/calendar-constants";
import { getCalendarMembers, createTask, updateTask, copyTaskToDates } from "@/lib/actions/calendar";
import type { CalendarSummary, CalendarTask } from "@/lib/actions/calendar";
import { addDays } from "@/lib/calendar-date-utils";
import { describeRecurrence, weekdayIndex } from "@/lib/calendar-recurrence";
import { cn } from "@/lib/utils";

const WEEKDAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function TaskFormDialog({
  open,
  calendars,
  defaultCalendarId,
  defaultDate,
  task,
  onClose,
  onSaved,
}: {
  open: boolean;
  calendars: CalendarSummary[];
  defaultCalendarId?: string;
  defaultDate: string;
  task: CalendarTask | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [calendarId, setCalendarId] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [eventDate, setEventDate] = useState(defaultDate);
  const [hasDueDate, setHasDueDate] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [color, setColor] = useState<TaskColorKey>(DEFAULT_TASK_COLOR);
  const [assignees, setAssignees] = useState<Set<string>>(new Set());
  const [members, setMembers] = useState<{ username: string; label: string }[]>([]);
  const [allDay, setAllDay] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("");
  const [repeatFreq, setRepeatFreq] = useState<RepeatFreq | "none">("none");
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [repeatWeekdays, setRepeatWeekdays] = useState<number[]>([]);
  const [hasRepeatEnd, setHasRepeatEnd] = useState(false);
  const [repeatUntil, setRepeatUntil] = useState("");
  const [copyOpen, setCopyOpen] = useState(false);
  const [copyDays, setCopyDays] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  // Tracks the closed->open edge so the reset below (a render-time "adjusting
  // state when a prop changes" per the React docs) fires once per open, not on
  // every render, and re-fires even if the same task is reopened.
  const [wasOpen, setWasOpen] = useState(false);

  const isEdit = task !== null;

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setError(null);
      setAllDay(!task?.startTime);
      setStartTime(task?.startTime ?? "09:00");
      setEndTime(task?.endTime ?? "");
      setCopyOpen(false);
      setCopyDays(new Set());
      const rule = task?.repeat ?? null;
      setRepeatFreq(rule?.freq ?? "none");
      setRepeatInterval(rule?.interval ?? 1);
      setRepeatWeekdays(rule?.weekdays ?? []);
      setHasRepeatEnd(!!rule?.until);
      setRepeatUntil(rule?.until ?? "");
      if (task) {
        // Occurrences of a recurring task carry shifted dates; edit the series' own.
        const seriesEvent = task.seriesEventDate ?? task.eventDate;
        const seriesDue = task.seriesEventDate ? task.seriesDueDate ?? null : task.dueDate;
        setCalendarId(task.calendarId);
        setTitle(task.title);
        setNotes(task.notes ?? "");
        setEventDate(seriesEvent);
        setHasDueDate(!!seriesDue);
        setDueDate(seriesDue ?? "");
        setColor(task.color);
        setAssignees(new Set(task.assignees));
      } else {
        setCalendarId(defaultCalendarId ?? calendars[0]?.id ?? "");
        setTitle("");
        setNotes("");
        setEventDate(defaultDate);
        setHasDueDate(false);
        setDueDate("");
        setColor(DEFAULT_TASK_COLOR);
        setAssignees(new Set());
      }
    }
  }

  useEffect(() => {
    if (!open || !calendarId) {
      startTransition(() => setMembers([]));
      return;
    }
    const selectedCalendar = calendars.find((c) => c.id === calendarId);
    startTransition(async () => {
      const { data } = await getCalendarMembers(calendarId);
      const list: { username: string; label: string }[] = [];
      if (selectedCalendar) {
        list.push({ username: selectedCalendar.ownerUsername, label: `${selectedCalendar.ownerUsername} (owner)` });
      }
      (data ?? []).forEach((m) => list.push({ username: m.username, label: `${m.username} (${m.role})` }));
      setMembers(list);
    });
  }, [open, calendarId, calendars]);

  function toggleAssignee(username: string) {
    setAssignees((prev) => {
      const next = new Set(prev);
      if (next.has(username)) next.delete(username);
      else next.add(username);
      return next;
    });
  }

  function buildRepeat(): RepeatRule | null {
    if (repeatFreq === "none") return null;
    return {
      freq: repeatFreq,
      interval: Math.max(1, Math.floor(repeatInterval) || 1),
      weekdays: repeatFreq === "weekly" && repeatWeekdays.length > 0 ? repeatWeekdays : null,
      until: hasRepeatEnd && repeatUntil ? repeatUntil : null,
    };
  }

  function toggleRepeatWeekday(day: number) {
    setRepeatWeekdays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  }

  // The Monday of the week the task's date falls in; copy targets are that week's days.
  const copyBase = task?.occurrenceDate ?? eventDate;
  const weekStart = copyBase ? addDays(copyBase, -weekdayIndex(copyBase)) : "";
  const ownDay = copyBase ? weekdayIndex(copyBase) : -1;

  function toggleCopyDay(day: number) {
    setCopyDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  }

  function handleCopy() {
    if (!task || copyDays.size === 0) return;
    setError(null);
    startTransition(async () => {
      const dates = Array.from(copyDays).map((d) => addDays(weekStart, d));
      const { error } = await copyTaskToDates(task.id, dates);
      if (error) {
        setError(error);
        return;
      }
      setCopyOpen(false);
      onSaved();
    });
  }

  function handleSave() {
    setError(null);
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!calendarId) {
      setError("Choose a calendar");
      return;
    }
    if (hasDueDate && dueDate && dueDate < eventDate) {
      setError("Due date can't be before the pinned date");
      return;
    }

    if (!allDay && !startTime) {
      setError("Set a start time or choose all day");
      return;
    }
    const sameDay = !hasDueDate || !dueDate || dueDate === eventDate;
    if (!allDay && endTime && sameDay && endTime < startTime) {
      setError("End time can't be before the start time");
      return;
    }
    if (repeatFreq !== "none" && hasRepeatEnd && repeatUntil && repeatUntil < eventDate) {
      setError("Repeat end can't be before the start date");
      return;
    }

    const repeat = buildRepeat();

    startTransition(async () => {
      const result = isEdit
        ? await updateTask(task!.id, {
            title,
            notes,
            eventDate,
            dueDate: hasDueDate ? dueDate || null : null,
            color,
            assigneeUsernames: Array.from(assignees),
            repeat,
            startTime: allDay ? null : startTime,
            endTime: allDay ? null : endTime || null,
          })
        : await createTask({
            calendarId,
            title,
            notes,
            eventDate,
            dueDate: hasDueDate ? dueDate || null : null,
            color,
            assigneeUsernames: Array.from(assignees),
            repeat,
            startTime: allDay ? null : startTime,
            endTime: allDay ? null : endTime || null,
          });

      if (result.error) {
        setError(result.error);
        return;
      }
      onSaved();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit task" : "Add a task"}</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-4">
          {!isEdit && calendars.length > 1 && (
            <div>
              <Label className="mb-1">Calendar</Label>
              <select
                value={calendarId}
                onChange={(e) => setCalendarId(e.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {calendars.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <Label className="mb-1">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
          </div>

          <div>
            <Label className="mb-1">Notes (optional)</Label>
            <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1">Date</Label>
              <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-2 text-sm font-medium">
                <Checkbox checked={hasDueDate} onCheckedChange={() => setHasDueDate((v) => !v)} />
                Set a deadline
              </label>
              <Input
                type="date"
                value={dueDate}
                disabled={!hasDueDate}
                min={eventDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Checkbox checked={allDay} onCheckedChange={() => setAllDay((v) => !v)} />
              All day
            </label>
            {!allDay && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1">Start time</Label>
                  <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div>
                  <Label className="mb-1">End time (optional)</Label>
                  <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="mb-1">Repeat</Label>
            <div className="flex items-center gap-2">
              <select
                value={repeatFreq}
                onChange={(e) => {
                  const next = e.target.value as RepeatFreq | "none";
                  setRepeatFreq(next);
                  if (next === "weekly" && repeatWeekdays.length === 0 && eventDate) {
                    setRepeatWeekdays([weekdayIndex(eventDate)]);
                  }
                }}
                className="h-8 flex-1 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="none">Does not repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              {repeatFreq !== "none" && (
                <label className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  every
                  <Input
                    type="number"
                    min={1}
                    value={repeatInterval}
                    onChange={(e) => setRepeatInterval(Number(e.target.value))}
                    className="w-16"
                  />
                </label>
              )}
            </div>
            {repeatFreq === "weekly" && (
              <div className="flex flex-wrap gap-1.5">
                {WEEKDAY_SHORT.map((label, day) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleRepeatWeekday(day)}
                    className={cn(
                      "rounded-md border px-2 py-1 text-xs font-medium transition-colors",
                      repeatWeekdays.includes(day)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input hover:bg-accent"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
            {repeatFreq !== "none" && (
              <>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={hasRepeatEnd} onCheckedChange={() => setHasRepeatEnd((v) => !v)} />
                    Ends on
                  </label>
                  <Input
                    type="date"
                    value={repeatUntil}
                    disabled={!hasRepeatEnd}
                    min={eventDate}
                    onChange={(e) => setRepeatUntil(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {describeRecurrence(buildRepeat(), eventDate)}
                  {isEdit && task?.repeat ? " · Changes apply to the whole series." : ""}
                </p>
              </>
            )}
          </div>

          {isEdit && (
            <div className="space-y-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setCopyOpen((v) => !v)}>
                Copy to day
              </Button>
              {copyOpen && (
                <div className="rounded-md border border-border p-3">
                  <p className="mb-2 text-xs text-muted-foreground">
                    Copy this task to the selected days of the same week.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {WEEKDAY_SHORT.map((label, day) => (
                      <label
                        key={label}
                        className={cn(
                          "flex items-center gap-1.5 text-sm",
                          day === ownDay ? "opacity-50" : "cursor-pointer"
                        )}
                      >
                        <Checkbox
                          checked={copyDays.has(day)}
                          disabled={day === ownDay}
                          onCheckedChange={() => toggleCopyDay(day)}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="mt-3"
                    onClick={handleCopy}
                    disabled={copyDays.size === 0 || isPending}
                  >
                    Copy to {copyDays.size || ""} day{copyDays.size === 1 ? "" : "s"}
                  </Button>
                </div>
              )}
            </div>
          )}

          <div>
            <Label className="mb-1.5">Colour</Label>
            <div className="flex flex-wrap gap-2">
              {TASK_COLORS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  title={c.label}
                  onClick={() => setColor(c.key)}
                  className={cn(
                    "size-7 rounded-full transition-transform",
                    c.dot,
                    color === c.key ? "ring-2 ring-offset-2 ring-offset-background" : "opacity-70 hover:opacity-100"
                  )}
                  style={color === c.key ? { boxShadow: `0 0 0 2px ${c.hex}` } : undefined}
                />
              ))}
            </div>
          </div>

          {members.length > 0 && (
            <div>
              <Label className="mb-1.5">Assign to</Label>
              <div className="space-y-1.5">
                {members.map((m) => (
                  <label key={m.username} className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox
                      checked={assignees.has(m.username)}
                      onCheckedChange={() => toggleAssignee(m.username)}
                    />
                    {m.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving…" : isEdit ? "Save changes" : "Add task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
