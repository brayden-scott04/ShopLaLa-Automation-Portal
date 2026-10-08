-- Calendar: recurring tasks. Anchor is event_date; all-null repeat_freq = non-recurring.
alter table calendar_tasks
  add column if not exists repeat_freq text
    check (repeat_freq in ('daily','weekly','monthly','yearly')),
  add column if not exists repeat_interval int not null default 1
    check (repeat_interval >= 1),
  add column if not exists repeat_weekdays smallint[],
  add column if not exists repeat_until date;
