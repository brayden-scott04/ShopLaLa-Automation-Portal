-- Tasks: per-assignee "Acknowledged" tick (the assignee has read the task).
-- null = not acknowledged yet. The task owner is never asked to acknowledge their own task.
-- Run by hand in the Supabase SQL editor.

alter table task_assignees add column if not exists acknowledged_at timestamptz;
