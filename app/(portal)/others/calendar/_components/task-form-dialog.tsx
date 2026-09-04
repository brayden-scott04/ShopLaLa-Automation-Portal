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
import { TASK_COLORS, DEFAULT_TASK_COLOR, type TaskColorKey } from "@/lib/calendar-constants";
import { getCalendarMembers, createTask, updateTask } from "@/lib/actions/calendar";
import type { CalendarSummary, CalendarTask } from "@/lib/actions/calendar";
import { cn } from "@/lib/utils";

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
      if (task) {
        setCalendarId(task.calendarId);
        setTitle(task.title);
        setNotes(task.notes ?? "");
        setEventDate(task.eventDate);
        setHasDueDate(!!task.dueDate);
        setDueDate(task.dueDate ?? "");
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

    startTransition(async () => {
      const result = isEdit
        ? await updateTask(task!.id, {
            title,
            notes,
            eventDate,
            dueDate: hasDueDate ? dueDate || null : null,
            color,
            assigneeUsernames: Array.from(assignees),
          })
        : await createTask({
            calendarId,
            title,
            notes,
            eventDate,
            dueDate: hasDueDate ? dueDate || null : null,
            color,
            assigneeUsernames: Array.from(assignees),
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

          <div>
            <Label className="mb-1.5">Colour</Label>
            <div className="flex gap-2">
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
