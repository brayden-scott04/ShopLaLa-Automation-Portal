-- Tasks: replaces Boards + Dashboards. Run by hand in the Supabase SQL editor.

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  notes text,
  task_date date,
  due_date date,
  priority smallint not null default 3 check (priority between 1 and 5),
  done boolean not null default false,
  owner_username text not null references staff(username) on update cascade on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists task_assignees (
  task_id uuid not null references tasks(id) on delete cascade,
  username text not null references staff(username) on update cascade on delete cascade,
  primary key (task_id, username)
);

-- If tasks was already created before task_date existed:
alter table tasks add column if not exists task_date date;

create index if not exists task_assignees_username_idx on task_assignees (username);

alter table tasks enable row level security;
alter table task_assignees enable row level security;
create policy "tasks all" on tasks for all using (true) with check (true);
create policy "task_assignees all" on task_assignees for all using (true) with check (true);

-- Drop the old Boards / Dashboards feature (data intentionally discarded).
drop table if exists dashboard_widgets;
drop table if exists dashboard_boards;
drop table if exists dashboards;
drop table if exists board_item_values;
drop table if exists board_items;
drop table if exists board_columns;
drop table if exists boards;
