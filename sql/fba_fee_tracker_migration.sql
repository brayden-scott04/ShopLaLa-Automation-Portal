-- FBA Fee Tracker (Tools > FBA Fee Tracker).
-- Run by hand against the LaLaGreen Supabase project — this repo has no
-- migration runner.
--
-- Snapshots, alerts and run rows are written by the sibling LaLaGreen-Daily-Report
-- worker (reportlib/fba_fee_sync.py, daily via n8n/fba-fee-sync.json) using the
-- service-role key. The portal reads through the anon client (select-only
-- policy below) and makes its few writes (true dimensions, alert status)
-- through the service-role client in lib/actions/fba-fee-tracker.ts after a
-- getSession() check, so no insert/update/delete policy is granted.
--
-- Dimensions are normalized to inches and pounds by the worker, whatever
-- units Amazon's report used. US only today; country_code is there so CA can
-- be added without a schema change.

-- One row per SKU per SGT day: what Amazon had on file that day.
create table if not exists fba_fee_snapshots (
  snapshot_date   date        not null,
  country_code    text        not null default 'US',
  sku             text        not null,
  asin            text,
  product_name    text,
  longest_in      numeric,
  median_in       numeric,
  shortest_in     numeric,
  length_girth_in numeric,
  weight_lb       numeric,
  size_tier       text,
  fee_per_unit    numeric,              -- Amazon's expected-fulfillment-fee-per-unit
  your_price      numeric,
  sales_price     numeric,
  created_at      timestamptz not null default now(),
  primary key (snapshot_date, country_code, sku)
);
create index if not exists fba_fee_snapshots_sku_idx
  on fba_fee_snapshots (country_code, sku, snapshot_date desc);

-- Our own "true" package dimensions, which drive the portal's expected fee.
-- Seeded by the worker from the first Amazon reading it sees for a SKU
-- (source = 'amazon_first_seen') and never overwritten by it; staff edits
-- set source = 'manual'.
create table if not exists fba_fee_true_dims (
  country_code text        not null default 'US',
  sku          text        not null,
  length_in    numeric,
  width_in     numeric,
  height_in    numeric,
  weight_lb    numeric,
  source       text        not null default 'amazon_first_seen'
                           check (source in ('amazon_first_seen', 'manual')),
  updated_by   text,
  updated_at   timestamptz not null default now(),
  primary key (country_code, sku)
);

-- A size-tier change or a >=15% fee move between two consecutive snapshots.
create table if not exists fba_fee_alerts (
  id                     uuid        primary key default gen_random_uuid(),
  country_code           text        not null default 'US',
  sku                    text        not null,
  asin                   text,
  product_name           text,
  detected_date          date        not null,
  previous_snapshot_date date,
  kind                   text        not null
                                     check (kind in ('tier_change', 'fee_increase', 'fee_decrease')),
  cause                  text        not null
                                     check (cause in ('dims_changed', 'rate_change')),
  old_fee                numeric,
  new_fee                numeric,
  pct_change             numeric,
  old_tier               text,
  new_tier               text,
  old_dims               jsonb,
  new_dims               jsonb,
  status                 text        not null default 'open'
                                     check (status in ('open', 'case_raised', 'resolved', 'dismissed')),
  case_id                text,
  notes                  text,
  updated_by             text,
  updated_at             timestamptz,
  created_at             timestamptz not null default now(),
  unique (country_code, sku, detected_date, kind)
);
create index if not exists fba_fee_alerts_status_idx on fba_fee_alerts (status, detected_date desc);

-- Append-only run log; powers the "Synced Xh ago" badge.
create table if not exists fba_fee_sync_runs (
  id             uuid        primary key default gen_random_uuid(),
  trigger        text        not null check (trigger in ('scheduled', 'manual')),
  status         text        not null check (status in ('ok', 'error')),
  snapshot_date  date,
  skus_seen      integer     not null default 0,
  alerts_created integer     not null default 0,
  error          text,
  duration_ms    integer,
  created_at     timestamptz not null default now()
);

alter table fba_fee_snapshots enable row level security;
alter table fba_fee_true_dims  enable row level security;
alter table fba_fee_alerts     enable row level security;
alter table fba_fee_sync_runs  enable row level security;

drop policy if exists fba_fee_snapshots_read on fba_fee_snapshots;
create policy fba_fee_snapshots_read on fba_fee_snapshots
  for select to anon, authenticated using (true);

drop policy if exists fba_fee_true_dims_read on fba_fee_true_dims;
create policy fba_fee_true_dims_read on fba_fee_true_dims
  for select to anon, authenticated using (true);

drop policy if exists fba_fee_alerts_read on fba_fee_alerts;
create policy fba_fee_alerts_read on fba_fee_alerts
  for select to anon, authenticated using (true);

drop policy if exists fba_fee_sync_runs_read on fba_fee_sync_runs;
create policy fba_fee_sync_runs_read on fba_fee_sync_runs
  for select to anon, authenticated using (true);
