-- Personal, multi-calendar planner (Others > Calendar).
-- Run this by hand against the LaLaGreen Supabase project (fuynizhfhfnvbdzwihgp) --
-- this repo has no automated migration runner or Supabase CLI project wired up,
-- and the Supabase MCP connection available in this session is a different
-- account/project, so it could not be applied automatically. Apply via the
-- Supabase SQL editor.
--
-- Before running: this assumes staff.username already carries a UNIQUE
-- constraint (it's queried by username everywhere in lib/actions/staff.ts).
-- If `alter table calendars add constraint ... references staff(username)`
-- fails with "there is no unique constraint matching given keys", run
-- `alter table staff add constraint staff_username_key unique (username);`
-- first, then re-run this file.

create table if not exists calendars (
  id uuid primary key default gen_random_uuid(),
  owner_username text not null references staff(username) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create index if not exists calendars_owner_username_idx on calendars (owner_username);

create table if not exists calendar_members (
  calendar_id uuid not null references calendars(id) on delete cascade,
  username text not null references staff(username) on delete cascade,
  role text not null check (role in ('viewer', 'editor')),
  added_at timestamptz not null default now(),
  primary key (calendar_id, username)
);

create index if not exists calendar_members_username_idx on calendar_members (username);

create table if not exists calendar_tasks (
  id uuid primary key default gen_random_uuid(),
  calendar_id uuid not null references calendars(id) on delete cascade,
  title text not null,
  notes text,
  event_date date not null,
  due_date date,
  color text not null default 'blue' check (color in ('red', 'orange', 'yellow', 'green', 'blue', 'purple')),
  created_by text not null references staff(username),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint calendar_tasks_due_after_event check (due_date is null or due_date >= event_date)
);

create index if not exists calendar_tasks_calendar_id_idx on calendar_tasks (calendar_id);
create index if not exists calendar_tasks_event_date_idx on calendar_tasks (event_date);
create index if not exists calendar_tasks_due_date_idx on calendar_tasks (due_date);

create table if not exists calendar_task_assignees (
  task_id uuid not null references calendar_tasks(id) on delete cascade,
  username text not null references staff(username) on delete cascade,
  primary key (task_id, username)
);

create index if not exists calendar_task_assignees_username_idx on calendar_task_assignees (username);

-- RLS is enabled with permissive policies, matching the rest of this schema's
-- tables (e.g. ppc_acos_manual_topups): real access control is enforced in
-- lib/actions/calendar.ts (owner/member checks before every read and write),
-- not by Postgres row security.
alter table calendars enable row level security;
alter table calendar_members enable row level security;
alter table calendar_tasks enable row level security;
alter table calendar_task_assignees enable row level security;

create policy "calendars_all" on calendars for all using (true) with check (true);
create policy "calendar_members_all" on calendar_members for all using (true) with check (true);
create policy "calendar_tasks_all" on calendar_tasks for all using (true) with check (true);
create policy "calendar_task_assignees_all" on calendar_task_assignees for all using (true) with check (true);
