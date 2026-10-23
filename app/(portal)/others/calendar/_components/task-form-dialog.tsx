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
import { Trash2 } from "lucide-react";
import {
  TASK_COLORS,
  DEFAULT_TASK_COLOR,
  MONTH_WEEK_OPTIONS,
  type TaskColorKey,
  type RepeatFreq,
  type RepeatRule,
} from "@/lib/calendar-constants";
import {
  getCalendarMembers,
  createTask,
  updateTask,
  updateOccurrence,
  resetOccurrence,
  copyTaskToDates,
} from "@/lib/actions/calendar";
import { getStaffDirectory } from "@/lib/actions/staff";
import type { CalendarSummary, CalendarTask } from "@/lib/actions/calendar";
import { addDays, formatDayLabel } from "@/lib/calendar-date-utils";
import { describeRecurrence, nthWeekOfMonth, weekdayIndex } from "@/lib/calendar-recurrence";
import { cn } from "@/lib/utils";

const WEEKDAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKDAY_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function TaskFormDialog({
  open,
  calendars,
  defaultCalendarId,
  defaultDate,
  task,
  onClose,
  onSaved,
  onDelete,
}: {
  open: boolean;
  calendars: CalendarSummary[];
  defaultCalendarId?: string;
  defaultDate: string;
  task: CalendarTask | null;
  onClose: () => void;
  onSaved: () => void;
  /** Called when the user asks to delete the task being edited; the parent shows the confirm. */
  onDelete: (task: CalendarTask) => void;
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
  const [sharedWith, setSharedWith] = useState<Set<string>>(new Set());
  const [staffUsernames, setStaffUsernames] = useState<string[]>([]);
  const [allDay, setAllDay] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("");
  const [repeatFreq, setRepeatFreq] = useState<RepeatFreq | "none">("none");
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [repeatWeekdays, setRepeatWeekdays] = useState<number[]>([]);
  const [hasRepeatEnd, setHasRepeatEnd] = useState(false);
  const [repeatUntil, setRepeatUntil] = useState("");
  const [monthMode, setMonthMode] = useState<"day" | "nth">("day");
  const [monthWeek, setMonthWeek] = useState(1);
  const [monthWeekday, setMonthWeekday] = useState(0);
  // Only meaningful when editing one occurrence of a recurring task: checked = edit the whole series.
  const [applyToAll, setApplyToAll] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);
  const [copyDays, setCopyDays] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  // Tracks the closed->open edge so the reset below (a render-time "adjusting
  // state when a prop changes" per the React docs) fires once per open, not on
  // every render, and re-fires even if the same task is reopened.
  const [wasOpen, setWasOpen] = useState(false);

  const isEdit = task !== null;
  // Editing one dated occurrence of a repeating task, with "apply to all" unticked:
  // only title/notes/times can change, and only for that date.
  const isOccurrence = isEdit && !!task?.repeat && !!task?.occurrenceDate;
  const occurrenceOnly = isOccurrence && !applyToAll;

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setError(null);
      setApplyToAll(false);
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
      const seed = task?.seriesEventDate ?? task?.eventDate ?? defaultDate;
      const hasNth = rule?.monthWeek != null && rule?.monthWeekday != null;
      setMonthMode(hasNth ? "nth" : "day");
      setMonthWeek(hasNth ? rule!.monthWeek! : seed ? nthWeekOfMonth(seed) : 1);
      setMonthWeekday(hasNth ? rule!.monthWeekday! : seed ? weekdayIndex(seed) : 0);
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
        setSharedWith(new Set(task.sharedWith));
      } else {
        setCalendarId(defaultCalendarId ?? calendars[0]?.id ?? "");
        setTitle("");
        setNotes("");
        setEventDate(defaultDate);
        setHasDueDate(false);
        setDueDate("");
        setColor(DEFAULT_TASK_COLOR);
        setAssignees(new Set());
        setSharedWith(new Set());
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
      // After switching calendars, only people with access to the new one can stay assigned.
      if (data) {
        const allowed = new Set(list.map((m) => m.username));
        setAssignees((prev) => new Set(Array.from(prev).filter((u) => allowed.has(u))));
      }
    });
  }, [open, calendarId, calendars]);

  useEffect(() => {
    if (!open) return;
    startTransition(async () => {
      const { data } = await getStaffDirectory();
      setStaffUsernames((data ?? []).map((s) => s.username).sort());
    });
  }, [open]);

  // Sharing is for people outside the calendar; members (you included) already see the task.
  const memberUsernames = new Set(members.map((m) => m.username));
  const shareCandidates = staffUsernames.filter((u) => !memberUsernames.has(u));

  function toggleShare(username: string) {
    setSharedWith((prev) => {
      const next = new Set(prev);
      if (next.has(username)) next.delete(username);
      else next.add(username);
      return next;
    });
  }

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
      monthWeek: repeatFreq === "monthly" && monthMode === "nth" ? monthWeek : null,
      monthWeekday: repeatFreq === "monthly" && monthMode === "nth" ? monthWeekday : null,
    };
  }

  /** The "Nth weekday" pickers follow the date field, so the first occurrence is the picked date. */
  function syncMonthPickerToDate(date: string) {
    if (!date) return;
    setMonthWeek(nthWeekOfMonth(date));
    setMonthWeekday(weekdayIndex(date));
  }

  function handleEventDateChange(next: string) {
    setEventDate(next);
    if (repeatFreq === "monthly" && monthMode === "nth") syncMonthPickerToDate(next);
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

  function handleResetOccurrence() {
    if (!task?.occurrenceDate) return;
    setError(null);
    startTransition(async () => {
      const { error } = await resetOccurrence(task.id, task.occurrenceDate!);
      if (error) {
        setError(error);
        return;
      }
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

    if (occurrenceOnly) {
      startTransition(async () => {
        const result = await updateOccurrence(task!.id, task!.occurrenceDate!, {
          title,
          notes,
          startTime: allDay ? null : startTime,
          endTime: allDay ? null : endTime || null,
        });
        if (result.error) {
          setError(result.error);
          return;
        }
        onSaved();
      });
      return;
    }

    if (repeatFreq !== "none" && hasRepeatEnd && repeatUntil && repeatUntil < eventDate) {
      setError("Repeat end can't be before the start date");
      return;
    }

    const repeat = buildRepeat();

    startTransition(async () => {
      const shares = Array.from(sharedWith).filter((u) => !memberUsernames.has(u));
      const result = isEdit
        ? await updateTask(task!.id, {
            calendarId,
            title,
            notes,
            eventDate,
            dueDate: hasDueDate ? dueDate || null : null,
            color,
            assigneeUsernames: Array.from(assignees),
            sharedWithUsernames: shares,
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
            sharedWithUsernames: shares,
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
          {isOccurrence && (
            <div className="rounded-md border border-border bg-muted/40 p-3">
              <label className="flex cursor-pointer items-start gap-2 text-sm font-medium">
                <Checkbox
                  className="mt-0.5"
                  checked={applyToAll}
                  onCheckedChange={() => setApplyToAll((v) => !v)}
                />
                <span>
                  Apply to all occurrences
                  <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                    {applyToAll
                      ? "Changes update every day in this repeating series."
                      : `Only changes ${formatDayLabel(task!.occurrenceDate!)}. Title, notes and time can be edited; tick the box to change anything else.`}
                  </span>
                </span>
              </label>
              {occurrenceOnly && task?.isException && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="mt-1 h-auto p-0 text-xs"
                  onClick={handleResetOccurrence}
                  disabled={isPending}
                >
                  Reset this day to the series
                </Button>
              )}
            </div>
          )}

          {calendars.length > 1 && (
            <div>
              <Label className="mb-1">Calendar</Label>
              <select
                value={calendarId}
                disabled={occurrenceOnly}
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
              <Input
                type="date"
                value={occurrenceOnly ? task!.occurrenceDate! : eventDate}
                disabled={occurrenceOnly}
                onChange={(e) => handleEventDateChange(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-2 text-sm font-medium">
                <Checkbox
                  checked={hasDueDate}
                  disabled={occurrenceOnly}
                  onCheckedChange={() => setHasDueDate((v) => !v)}
                />
                Set a deadline
              </label>
              <Input
                type="date"
                value={occurrenceOnly ? task!.dueDate ?? "" : dueDate}
                disabled={!hasDueDate || occurrenceOnly}
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
                disabled={occurrenceOnly}
                onChange={(e) => {
                  const next = e.target.value as RepeatFreq | "none";
                  setRepeatFreq(next);
                  if (next === "monthly" && eventDate) syncMonthPickerToDate(eventDate);
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
                    disabled={occurrenceOnly}
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
                    disabled={occurrenceOnly}
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
            {repeatFreq === "monthly" && (
              <div className="space-y-2">
                <select
                  value={monthMode}
                  disabled={occurrenceOnly}
                  onChange={(e) => {
                    const next = e.target.value as "day" | "nth";
                    setMonthMode(next);
                    if (next === "nth" && eventDate) syncMonthPickerToDate(eventDate);
                  }}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="day">
                    {`On day ${eventDate ? Number(eventDate.slice(8, 10)) : "…"} of the month`}
                  </option>
                  <option value="nth">On a specific weekday (e.g. first Monday)</option>
                </select>
                {monthMode === "nth" && (
                  <div className="flex items-center gap-2">
                    <select
                      value={monthWeek}
                      disabled={occurrenceOnly}
                      onChange={(e) => setMonthWeek(Number(e.target.value))}
                      className="h-8 flex-1 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {MONTH_WEEK_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={monthWeekday}
                      disabled={occurrenceOnly}
                      onChange={(e) => setMonthWeekday(Number(e.target.value))}
                      className="h-8 flex-1 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {WEEKDAY_FULL.map((label, day) => (
                        <option key={label} value={day}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
            {repeatFreq !== "none" && (
              <>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={hasRepeatEnd}
                      disabled={occurrenceOnly}
                      onCheckedChange={() => setHasRepeatEnd((v) => !v)}
                    />
                    Ends on
                  </label>
                  <Input
                    type="date"
                    value={repeatUntil}
                    disabled={!hasRepeatEnd || occurrenceOnly}
                    min={eventDate}
                    onChange={(e) => setRepeatUntil(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {describeRecurrence(buildRepeat(), eventDate)}
                  {isOccurrence && applyToAll ? " · Changes apply to the whole series." : ""}
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
                  disabled={occurrenceOnly}
                  className={cn(
                    "size-7 rounded-full transition-transform disabled:cursor-not-allowed disabled:opacity-40",
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
                      disabled={occurrenceOnly}
                      onCheckedChange={() => toggleAssignee(m.username)}
                    />
                    {m.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {shareCandidates.length > 0 && (
            <div>
              <Label className="mb-0.5">Also share with</Label>
              <p className="mb-1.5 text-xs text-muted-foreground">
                People outside this calendar. They see only this task, read-only, under
                &ldquo;Shared with me&rdquo;.
              </p>
              <div className="max-h-36 space-y-1.5 overflow-y-auto rounded-md border border-border p-2">
                {shareCandidates.map((username) => (
                  <label key={username} className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox
                      checked={sharedWith.has(username)}
                      disabled={occurrenceOnly}
                      onCheckedChange={() => toggleShare(username)}
                    />
                    {username}
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </DialogBody>
        <DialogFooter className={isEdit ? "sm:justify-between" : undefined}>
          {isEdit && (
            <Button
              type="button"
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => task && onDelete(task)}
              disabled={isPending}
            >
              <Trash2 />
              Delete
            </Button>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "Saving…" : isEdit ? "Save changes" : "Add task"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
