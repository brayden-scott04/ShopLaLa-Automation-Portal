-- Task updates: append-only progress log per task. Run by hand in the Supabase SQL editor.

create table if not exists task_updates (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  username text not null references staff(username) on update cascade on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists task_updates_task_idx on task_updates (task_id, created_at desc);

alter table task_updates enable row level security;
create policy "task_updates all" on task_updates for all using (true) with check (true);
