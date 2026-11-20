"use client";

import { useState, useTransition } from "react";
import { Check, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { editTaskUpdate, type TaskProgressUpdate } from "@/lib/actions/tasks";
import { MAX_TASK_UPDATE_LENGTH } from "@/lib/tasks-constants";

/** "1,234 / 5,000" under a text box; shown once the text passes 80% of the limit. */
export function CharCount({ length, max }: { length: number; max: number }) {
  if (length < max * 0.8) return null;
  return (
    <p className={cn("text-right text-[11px] tabular-nums", length >= max ? "text-destructive" : "text-muted-foreground")}>
      {length.toLocaleString()} / {max.toLocaleString()}
    </p>
  );
}

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Progress log for an existing task. The draft box is owned by the dialog: its text is posted when the
 * dialog's Save is clicked. Your own updates can be edited in place (saved straight away). Updates new
 * to you since you last marked the task read are highlighted.
 */
export function TaskUpdates({
  updates,
  me,
  unreadIds,
  draft,
  onDraftChange,
  onEdited,
  onMarkRead,
}: {
  updates: TaskProgressUpdate[];
  me: string;
  unreadIds: string[];
  draft: string;
  onDraftChange: (value: string) => void;
  onEdited: (update: TaskProgressUpdate) => void;
  /** Shown as "Mark updates read" while there are new ones; omit when the viewer can't. */
  onMarkRead?: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const unread = new Set(unreadIds);

  function startEdit(u: TaskProgressUpdate) {
    setError(null);
    setEditingId(u.id);
    setEditText(u.body);
  }

  function saveEdit(id: string) {
    setError(null);
    startTransition(async () => {
      const result = await editTaskUpdate(id, editText);
      if (result.error || !result.data) {
        setError(result.error ?? "Failed to edit update");
        return;
      }
      onEdited(result.data);
      setEditingId(null);
    });
  }

  return (
    <div className="flex min-h-0 flex-col gap-1.5">
      <Label htmlFor="task-update">Add an update</Label>
      <Textarea
        id="task-update"
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        maxLength={MAX_TASK_UPDATE_LENGTH}
        placeholder="What's the latest on this task? It's posted when you click Save."
        // Drag the bottom-right corner to make it taller; it also grows with the text.
        className="field-sizing-content min-h-24 max-h-[60vh] resize-y"
      />
      <CharCount length={draft.length} max={MAX_TASK_UPDATE_LENGTH} />

      {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <div className="flex items-center justify-between gap-2 pt-2">
        <div className="flex items-center gap-2">
          <Label>Updates</Label>
          {unread.size > 0 && (
            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
              {unread.size} new
            </span>
          )}
        </div>
        {unread.size > 0 && onMarkRead && (
          <Button size="xs" className="bg-blue-600 text-white hover:bg-blue-700" onClick={onMarkRead}>
            <Check /> Mark updates read
          </Button>
        )}
      </div>
      {updates.length === 0 ? (
        <p className="text-xs text-muted-foreground">No updates yet.</p>
      ) : (
        <div className={cn("overflow-y-auto rounded-md border border-border", editingId === null && "max-h-[28rem]")}>
          <table className="w-full text-xs">
            <thead className="sticky top-0 z-10 border-b border-border bg-muted text-left">
              <tr>
                <th className="whitespace-nowrap px-2 py-1.5 font-medium text-muted-foreground">Date</th>
                <th className="px-2 py-1.5 font-medium text-muted-foreground">By</th>
                <th className="px-2 py-1.5 font-medium text-muted-foreground">Update</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {updates.map((u) => {
                const isNew = unread.has(u.id);
                const isEditing = editingId === u.id;
                return (
                  <tr
                    key={u.id}
                    className={cn(
                      "border-b border-border align-top last:border-0",
                      isNew && "bg-blue-50 dark:bg-blue-500/10"
                    )}
                  >
                    <td className="whitespace-nowrap px-2 py-1.5 text-muted-foreground">
                      {formatWhen(u.createdAt)}
                      {u.editedAt && (
                        <div className="italic" title={`Edited ${formatWhen(u.editedAt)}`}>
                          edited
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-1.5">{u.username}</td>
                    <td
                      className={cn(
                        "whitespace-pre-wrap break-words px-2 py-1.5",
                        isNew && "font-medium text-blue-700 dark:text-blue-300"
                      )}
                    >
                      {isEditing ? (
                        <div className="space-y-1.5">
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            maxLength={MAX_TASK_UPDATE_LENGTH}
                            // Sized to the whole update (up to 60% of the screen), and resizable.
                            className="field-sizing-content min-h-40 max-h-[60vh] resize-y text-sm"
                            autoFocus
                          />
                          <CharCount length={editText.length} max={MAX_TASK_UPDATE_LENGTH} />
                          <div className="flex justify-end gap-1">
                            <Button size="xs" variant="ghost" onClick={() => setEditingId(null)} disabled={isPending}>
                              <X /> Cancel
                            </Button>
                            <Button
                              size="xs"
                              onClick={() => saveEdit(u.id)}
                              disabled={isPending || !editText.trim() || editText.trim() === u.body}
                            >
                              <Check /> Save edit
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {isNew && (
                            <span className="mr-1.5 rounded bg-blue-600 px-1 py-px text-[10px] font-semibold uppercase text-white">
                              New
                            </span>
                          )}
                          {u.body}
                        </>
                      )}
                    </td>
                    <td className="px-1 py-1">
                      {u.username === me && !isEditing && (
                        <Button variant="ghost" size="icon-xs" onClick={() => startEdit(u)} aria-label="Edit update">
                          <Pencil />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
