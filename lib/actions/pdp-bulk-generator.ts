"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getSession } from "@/lib/session";

// Brands, video assets and keyword themes are shared with Sponsored Brands
// Upload — use the actions in ./bulk-campaign for those. This file only covers
// the Ads Bulk Generator's own libraries.

async function requireStaff() {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" as const };
  return { error: null };
}

export interface BrandLogo {
  id: string;
  brand_id: string;
  label: string;
  asset_id: string;
  created_at: string;
}

export interface StoreUrl {
  id: string;
  brand_id: string;
  label: string;
  url: string;
  created_at: string;
}

export interface PdpPreset {
  id: string;
  sku: string;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

const LOGO_COLUMNS = "id, brand_id, label, asset_id, created_at";
const URL_COLUMNS = "id, brand_id, label, url, created_at";
const PRESET_COLUMNS = "id, sku, config, created_at, updated_at";

// --- Brand logos ---

export async function listBrandLogos() {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();
  const { data, error: dbError } = await client
    .from("bulk_campaign_brand_logos")
    .select(LOGO_COLUMNS)
    .order("created_at", { ascending: true });

  return { data: data as BrandLogo[] | null, error: dbError?.message ?? null };
}

export async function createBrandLogo(input: { brandId: string; label: string; assetId: string }) {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  if (!input.brandId || !input.label.trim() || !input.assetId.trim()) {
    return { data: null, error: "Brand, label and asset ID are required" };
  }

  const service = createServiceClient();
  const { data, error: dbError } = await service
    .from("bulk_campaign_brand_logos")
    .insert({ brand_id: input.brandId, label: input.label.trim(), asset_id: input.assetId.trim() })
    .select(LOGO_COLUMNS)
    .single();

  return { data: data as BrandLogo | null, error: dbError?.message ?? null };
}

export async function updateBrandLogo(id: string, updates: { label?: string; assetId?: string }) {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const dbUpdates: Record<string, unknown> = {};
  if (updates.label !== undefined) dbUpdates.label = updates.label.trim();
  if (updates.assetId !== undefined) dbUpdates.asset_id = updates.assetId.trim();

  const service = createServiceClient();
  const { data, error: dbError } = await service
    .from("bulk_campaign_brand_logos")
    .update(dbUpdates)
    .eq("id", id)
    .select(LOGO_COLUMNS)
    .single();

  return { data: data as BrandLogo | null, error: dbError?.message ?? null };
}

export async function deleteBrandLogo(id: string) {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const service = createServiceClient();
  const { error: dbError } = await service.from("bulk_campaign_brand_logos").delete().eq("id", id);

  return { data: dbError ? null : { ok: true }, error: dbError?.message ?? null };
}

// --- Store URLs ---

export async function listStoreUrls() {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();
  const { data, error: dbError } = await client
    .from("bulk_campaign_store_urls")
    .select(URL_COLUMNS)
    .order("created_at", { ascending: true });

  return { data: data as StoreUrl[] | null, error: dbError?.message ?? null };
}

export async function createStoreUrl(input: { brandId: string; label: string; url: string }) {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  if (!input.brandId || !input.label.trim() || !input.url.trim()) {
    return { data: null, error: "Brand, label and URL are required" };
  }

  const service = createServiceClient();
  const { data, error: dbError } = await service
    .from("bulk_campaign_store_urls")
    .insert({ brand_id: input.brandId, label: input.label.trim(), url: input.url.trim() })
    .select(URL_COLUMNS)
    .single();

  return { data: data as StoreUrl | null, error: dbError?.message ?? null };
}

export async function updateStoreUrl(id: string, updates: { label?: string; url?: string }) {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const dbUpdates: Record<string, unknown> = {};
  if (updates.label !== undefined) dbUpdates.label = updates.label.trim();
  if (updates.url !== undefined) dbUpdates.url = updates.url.trim();

  const service = createServiceClient();
  const { data, error: dbError } = await service
    .from("bulk_campaign_store_urls")
    .update(dbUpdates)
    .eq("id", id)
    .select(URL_COLUMNS)
    .single();

  return { data: data as StoreUrl | null, error: dbError?.message ?? null };
}

export async function deleteStoreUrl(id: string) {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const service = createServiceClient();
  const { error: dbError } = await service.from("bulk_campaign_store_urls").delete().eq("id", id);

  return { data: dbError ? null : { ok: true }, error: dbError?.message ?? null };
}

// --- Presets (one saved product box per SKU) ---

export async function listPdpPresets() {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();
  const { data, error: dbError } = await client
    .from("bulk_campaign_pdp_presets")
    .select(PRESET_COLUMNS)
    .order("sku", { ascending: true });

  return { data: data as PdpPreset[] | null, error: dbError?.message ?? null };
}

export async function savePdpPreset(sku: string, config: Record<string, unknown>) {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const trimmedSku = sku.trim();
  if (!trimmedSku) return { data: null, error: "Enter a SKU name to save." };

  const service = createServiceClient();
  const { data: existing } = await service
    .from("bulk_campaign_pdp_presets")
    .select("id")
    .ilike("sku", trimmedSku)
    .maybeSingle();

  const payload = { sku: trimmedSku, config, updated_at: new Date().toISOString() };

  const { data, error: dbError } = existing
    ? await service
        .from("bulk_campaign_pdp_presets")
        .update(payload)
        .eq("id", existing.id)
        .select(PRESET_COLUMNS)
        .single()
    : await service.from("bulk_campaign_pdp_presets").insert(payload).select(PRESET_COLUMNS).single();

  return { data: data as PdpPreset | null, error: dbError?.message ?? null };
}

export async function deletePdpPreset(id: string) {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const service = createServiceClient();
  const { error: dbError } = await service.from("bulk_campaign_pdp_presets").delete().eq("id", id);

  return { data: dbError ? null : { ok: true }, error: dbError?.message ?? null };
}
