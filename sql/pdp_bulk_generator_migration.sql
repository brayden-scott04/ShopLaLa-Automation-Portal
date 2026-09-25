-- PDP Bulk Generator (Tools > PDP Bulk Generator).
-- Run by hand against the LaLaGreen Supabase project — this repo has no
-- migration runner. Brands, video assets and keyword themes are shared with
-- Sponsored Brands Upload (bulk_campaign_brands / _video_assets /
-- _keyword_themes); only the libraries that tool doesn't have are added here.
-- Reads go through the anon client (select-only policy); every write goes
-- through the service-role client in lib/actions/pdp-bulk-generator.ts after a
-- getSession() check, so no insert/update/delete policy is granted.

-- Brand Logos: saved brand logo asset IDs, several per brand.
create table if not exists bulk_campaign_brand_logos (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references bulk_campaign_brands(id) on delete cascade,
  label text not null,
  asset_id text not null,
  created_at timestamptz not null default now()
);

-- Store URLs: saved Store landing page URLs, several per brand.
create table if not exists bulk_campaign_store_urls (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references bulk_campaign_brands(id) on delete cascade,
  label text not null,
  url text not null,
  created_at timestamptz not null default now()
);

-- Saved per-product settings, searchable by SKU. Kept separate from
-- bulk_campaign_presets because the config shape (a PDP generator Block) is
-- different from Sponsored Brands Upload's, and loading one into the other
-- would silently produce a half-filled form.
create table if not exists bulk_campaign_pdp_presets (
  id uuid primary key default gen_random_uuid(),
  sku text not null,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists bulk_campaign_pdp_presets_sku_idx
  on bulk_campaign_pdp_presets (lower(sku));

alter table bulk_campaign_brand_logos enable row level security;
alter table bulk_campaign_store_urls enable row level security;
alter table bulk_campaign_pdp_presets enable row level security;

create policy "bulk_campaign_brand_logos_read" on bulk_campaign_brand_logos
  for select using (true);
create policy "bulk_campaign_store_urls_read" on bulk_campaign_store_urls
  for select using (true);
create policy "bulk_campaign_pdp_presets_read" on bulk_campaign_pdp_presets
  for select using (true);

-- Backfill: carry each brand's single legacy logo / store URL into the new
-- libraries so they're selectable straight away.
insert into bulk_campaign_brand_logos (brand_id, label, asset_id)
select id, name || ' logo', brand_logo_asset_id
from bulk_campaign_brands
where coalesce(trim(brand_logo_asset_id), '') <> ''
  and not exists (select 1 from bulk_campaign_brand_logos l where l.brand_id = bulk_campaign_brands.id);

insert into bulk_campaign_store_urls (brand_id, label, url)
select id, name || ' store', store_page_url
from bulk_campaign_brands
where coalesce(trim(store_page_url), '') <> ''
  and not exists (select 1 from bulk_campaign_store_urls u where u.brand_id = bulk_campaign_brands.id);
