"use client";

import { useState, useTransition } from "react";
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
import { deleteTask, deleteOccurrences } from "@/lib/actions/calendar";
import type { CalendarTask, DeleteScope } from "@/lib/actions/calendar";
import { formatDayLabel } from "@/lib/calendar-date-utils";

const SCOPE_OPTIONS: { value: DeleteScope; label: string; hint: (date: string) => string }[] = [
  { value: "this", label: "This occurrence only", hint: (d) => `Removes ${formatDayLabel(d)} and keeps the rest.` },
  { value: "following", label: "This and following", hint: (d) => `Ends the series the day before ${formatDayLabel(d)}.` },
  { value: "all", label: "All occurrences", hint: () => "Deletes the whole series, past and future." },
];

/**
 * Confirms a delete. Repeating tasks get a scope choice (this day / this and
 * following / everything); anything else is a plain confirm.
 */
export function DeleteScopeDialog({
  task,
  onClose,
  onDeleted,
}: {
  task: CalendarTask | null;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [scope, setScope] = useState<DeleteScope>("this");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [lastTaskKey, setLastTaskKey] = useState<string | null>(null);

  const open = task !== null;
  const occurrenceDate = task?.occurrenceDate;
  const isSeries = !!task?.repeat && !!occurrenceDate;

  // Re-arm the default choice each time the dialog is opened for a task.
  const taskKey = task ? `${task.id}:${occurrenceDate ?? ""}` : null;
  if (taskKey !== lastTaskKey) {
    setLastTaskKey(taskKey);
    setScope("this");
    setError(null);
  }

  function handleDelete() {
    if (!task) return;
    setError(null);
    startTransition(async () => {
      const result =
        isSeries && occurrenceDate
          ? await deleteOccurrences(task.id, occurrenceDate, scope)
          : await deleteTask(task.id);
      if (result.error) {
        setError(result.error);
        return;
      }
      onDeleted();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isSeries ? "Delete repeating task" : "Delete task"}</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-3">
          <p className="text-sm text-foreground">
            {isSeries ? (
              <>
                <span className="font-medium">{task?.title}</span> repeats. What should be deleted?
              </>
            ) : (
              <>
                Delete <span className="font-medium">{task?.title}</span>? This can&apos;t be undone.
              </>
            )}
          </p>

          {isSeries && occurrenceDate && (
            <div className="space-y-2">
              {SCOPE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-start gap-2 rounded-md border border-border p-2.5 text-sm has-[:checked]:border-primary"
                >
                  <input
                    type="radio"
                    name="delete-scope"
                    className="mt-1"
                    checked={scope === opt.value}
                    onChange={() => setScope(opt.value)}
                  />
                  <span>
                    <span className="font-medium">{opt.label}</span>
                    <span className="block text-xs text-muted-foreground">{opt.hint(occurrenceDate)}</span>
                  </span>
                </label>
              ))}
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
