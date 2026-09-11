-- Boards + Dashboards (Others > Boards, Others > Dashboards).
-- Run by hand against the LaLaGreen Supabase project — this repo has no
-- migration runner. Single shared workspace: anyone granted the "boards" or
-- "dashboards" item permission can view AND edit everything, so RLS below is
-- permissive; real authorization is enforced in lib/actions/boards.ts and
-- lib/actions/dashboards.ts (session presence only — item-level gating
-- already happens in each route's layout.tsx via assertItemAccess).

create table if not exists boards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_by text not null references staff(username),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists board_columns (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references boards(id) on delete cascade,
  name text not null,
  type text not null check (type in ('text', 'number', 'status', 'date', 'checkbox')),
  position int not null default 0,
  -- Only meaningful for type = 'status': [{ "key": "...", "label": "...", "color": "..." }, ...]
  options jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists board_columns_board_id_idx on board_columns (board_id, position);

create table if not exists board_items (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references boards(id) on delete cascade,
  name text not null,
  position int not null default 0,
  created_by text not null references staff(username),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists board_items_board_id_idx on board_items (board_id, position);

create table if not exists board_item_values (
  item_id uuid not null references board_items(id) on delete cascade,
  column_id uuid not null references board_columns(id) on delete cascade,
  -- Shape depends on the column's type: text -> string, number -> number,
  -- status -> option key (string), date -> "YYYY-MM-DD" string, checkbox -> boolean.
  -- null means "unset" for every type.
  value jsonb,
  updated_at timestamptz not null default now(),
  primary key (item_id, column_id)
);

create index if not exists board_item_values_column_id_idx on board_item_values (column_id);

create table if not exists dashboards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_by text not null references staff(username),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists dashboard_boards (
  dashboard_id uuid not null references dashboards(id) on delete cascade,
  board_id uuid not null references boards(id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (dashboard_id, board_id)
);

create index if not exists dashboard_boards_board_id_idx on dashboard_boards (board_id);

create table if not exists dashboard_widgets (
  id uuid primary key default gen_random_uuid(),
  dashboard_id uuid not null references dashboards(id) on delete cascade,
  type text not null check (type in ('number', 'chart', 'table')),
  title text not null,
  position int not null default 0,
  -- Shape depends on type — see the WidgetConfig union in lib/actions/dashboards.ts.
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists dashboard_widgets_dashboard_id_idx on dashboard_widgets (dashboard_id, position);

alter table boards enable row level security;
alter table board_columns enable row level security;
alter table board_items enable row level security;
alter table board_item_values enable row level security;
alter table dashboards enable row level security;
alter table dashboard_boards enable row level security;
alter table dashboard_widgets enable row level security;

create policy "boards_all" on boards for all using (true) with check (true);
create policy "board_columns_all" on board_columns for all using (true) with check (true);
create policy "board_items_all" on board_items for all using (true) with check (true);
create policy "board_item_values_all" on board_item_values for all using (true) with check (true);
create policy "dashboards_all" on dashboards for all using (true) with check (true);
create policy "dashboard_boards_all" on dashboard_boards for all using (true) with check (true);
create policy "dashboard_widgets_all" on dashboard_widgets for all using (true) with check (true);
