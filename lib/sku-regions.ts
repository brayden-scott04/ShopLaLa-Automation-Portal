import { MARKETPLACES, type MarketplaceCode } from "@/lib/amazon/marketplaces";

/**
 * Master List regions (`sku_master_list.regions`). A SKU can be in both; an empty array is
 * "Uncategorised". Keys must match the CHECK in sql/sku_regions_migration.sql.
 * Plain module (not "use server") so client components can import the constants.
 */
export const SKU_REGIONS = [
  { key: "na", label: "US/CA/MX" },
  { key: "apac_eu", label: "AU/EU/UK" },
] as const;

export type SkuRegion = (typeof SKU_REGIONS)[number]["key"];

export const SKU_REGION_LABELS: Record<SkuRegion, string> = Object.fromEntries(
  SKU_REGIONS.map((r) => [r.key, r.label])
) as Record<SkuRegion, string>;

/** The NA SP-API region is US/CA/MX; EU (incl. UK and the Middle East) and FE (AU) are AU/EU/UK. */
export function regionForMarketplace(code: MarketplaceCode): SkuRegion {
  return MARKETPLACES[code].region === "NA" ? "na" : "apac_eu";
}

/** Known keys only, deduped, in SKU_REGIONS order — anything else would fail the DB CHECK. */
export function cleanRegions(input: readonly string[] | null | undefined): SkuRegion[] {
  const set = new Set(input ?? []);
  return SKU_REGIONS.map((r) => r.key).filter((k) => set.has(k));
}
