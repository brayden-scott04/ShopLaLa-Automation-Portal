-- Calendar: optional time of day. Both null = all-day task.
alter table calendar_tasks
  add column if not exists start_time time,
  add column if not exists end_time time;
alter table calendar_tasks add constraint calendar_tasks_time_check
  check (end_time is null or (start_time is not null and (due_date is not null or end_time >= start_time)));
