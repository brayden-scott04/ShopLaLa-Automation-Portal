"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { addTaskUpdate, listTaskUpdates, type TaskProgressUpdate } from "@/lib/actions/tasks";
import { MAX_TASK_UPDATE_LENGTH } from "@/lib/tasks-constants";

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Progress log for an existing task. Posting saves immediately, independent of the dialog's Save button. */
export function TaskUpdates({ taskId }: { taskId: string }) {
  const [updates, setUpdates] = useState<TaskProgressUpdate[]>([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const result = await listTaskUpdates(taskId);
      if (result.error) setError(result.error);
      setUpdates(result.data ?? []);
      setIsLoading(false);
    });
  }, [taskId]);

  function handlePost() {
    setError(null);
    startTransition(async () => {
      const result = await addTaskUpdate(taskId, draft);
      if (result.error || !result.data) {
        setError(result.error ?? "Failed to add update");
        return;
      }
      setUpdates((prev) => [result.data!, ...prev]);
      setDraft("");
    });
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor="task-update">Updates</Label>
      <Textarea
        id="task-update"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        maxLength={MAX_TASK_UPDATE_LENGTH}
        placeholder="What's the latest on this task?"
        className="min-h-16"
      />
      <div className="flex justify-end">
        <Button size="sm" variant="outline" disabled={isPending || !draft.trim()} onClick={handlePost}>
          Post update
        </Button>
      </div>

      {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      {isLoading ? (
        <Skeleton className="h-20" />
      ) : updates.length === 0 ? (
        <p className="text-xs text-muted-foreground">No updates yet.</p>
      ) : (
        <div className="max-h-48 overflow-y-auto rounded-md border border-border">
          <table className="w-full text-xs">
            <thead className="sticky top-0 border-b border-border bg-muted text-left">
              <tr>
                <th className="whitespace-nowrap px-2 py-1.5 font-medium text-muted-foreground">Date</th>
                <th className="px-2 py-1.5 font-medium text-muted-foreground">By</th>
                <th className="px-2 py-1.5 font-medium text-muted-foreground">Update</th>
              </tr>
            </thead>
            <tbody>
              {updates.map((u) => (
                <tr key={u.id} className="border-b border-border align-top last:border-0">
                  <td className="whitespace-nowrap px-2 py-1.5 text-muted-foreground">{formatWhen(u.createdAt)}</td>
                  <td className="px-2 py-1.5">{u.username}</td>
                  <td className="whitespace-pre-wrap break-words px-2 py-1.5">{u.body}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
