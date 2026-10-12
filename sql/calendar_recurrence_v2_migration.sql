-- Calendar: nth-weekday monthly recurrence + per-occurrence exceptions. Run by hand.

-- "First Monday of the month" etc. Both null = the original day-of-month behaviour.
-- repeat_month_week: 1..4, or -1 for "last". repeat_month_weekday: 0=Mon..6=Sun.
alter table calendar_tasks
  add column if not exists repeat_month_week smallint
    check (repeat_month_week in (1, 2, 3, 4, -1)),
  add column if not exists repeat_month_weekday smallint
    check (repeat_month_weekday between 0 and 6);

-- One row per edited / removed occurrence of a recurring task. A null title or
-- notes means "inherit from the series" (notes = '' means "cleared for this
-- occurrence"). start_time/end_time only replace the series' times when
-- time_overridden is true, so null can mean "all day" / "no end time" there.
create table if not exists calendar_task_exceptions (
  task_id uuid not null references calendar_tasks(id) on delete cascade,
  occurrence_date date not null,
  is_deleted boolean not null default false,
  title text,
  notes text,
  time_overridden boolean not null default false,
  start_time time,
  end_time time,
  created_at timestamptz not null default now(),
  primary key (task_id, occurrence_date)
);

alter table calendar_task_exceptions enable row level security;

drop policy if exists "calendar_task_exceptions read" on calendar_task_exceptions;
create policy "calendar_task_exceptions read" on calendar_task_exceptions
  for select using (true);
