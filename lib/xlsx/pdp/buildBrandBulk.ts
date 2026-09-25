import ExcelJS from "exceljs";
import { Country } from "./buildVideoBulk";

// Sponsored Brands "Product Collection" (Manual Collection Ad) bulk file.
// Uses the 75-column "SB Multi Ad Group Campaigns" sheet, built fresh so Excel
// doesn't show a theme-repair warning (same approach as the video builder).

const SB_MAG_HEADER = [
  "Product", "Entity", "Operation", "Campaign ID", "Portfolio ID", "Ad Group ID", "Ad ID",
  "Keyword ID", "Product Targeting ID", "Campaign Name", "Ad Group Name", "Ad Name",
  "Campaign Name (Informational only)", "Ad Group Name (Informational only)",
  "Portfolio Name (Informational only)", "Start Date", "End Date", "State", "Brand Entity ID",
  "Campaign State (Informational only)", "Campaign Serving Status (Informational only)",
  "Campaign Serving Status Details (Informational only)",
  "Rule Based Budget Is Processing (Informational only)",
  "Rule Based Budget Name (Informational only)", "Rule Based Budget Value (Informational only)",
  "Rule Based Budget ID (Informational only)", "Ad Group Serving Status (Informational only)",
  "Ad Group Serving Status Details (Informational only)", "Budget Type", "Budget",
  "Bid Optimization", "Product Location", "Bid", "Placement", "Percentage", "Audience ID",
  "Shopper Cohort Percentage", "Shopper Cohort Type", "Segment Name (Informational only)",
  "Keyword Text", "Match Type", "Native Language Keyword", "Native Language Locale",
  "Product Targeting Expression", "Resolved Product Targeting Expression (Informational only)",
  "Ad Serving Status (Informational only)", "Ad Serving Status Details (Informational only)",
  "Landing Page URL", "Landing Page ASINs", "Landing Page Type", "Brand Name",
  "Consent To Translate", "Brand Logo Asset ID", "Brand Logo URL (Informational only)",
  "Brand Logo Crop", "Custom Images", "Creative Headline", "Creative ASINs", "Video Asset IDs",
  "Original Video Asset IDs (Informational only)", "Subpages", "Product Exclusions", "Ad Title",
  "Sites", "Impressions", "Clicks", "Click-through Rate", "Spend", "Sales", "Orders", "Units",
  "Conversion Rate", "ACOS", "CPC", "ROAS",
];

const SHEET_NAME = "SB Multi Ad Group Campaigns";

export interface BrandCampaignInput {
  campaignName: string;
  bid: number;
  budget?: number;
  startDate: string; // YYYY-MM-DD
  storeUrl: string;
  brandLogoAssetId: string;
  headline: string;
  collectionAsins: string[]; // products shown in one ad
  keywords: string[];
  matchTypes?: ("exact" | "phrase" | "broad")[];
  negativeKeywords?: string[];
  brandEntityId: string;
  brandName: string;
  // "storeVideo" adds a video that links to the Store (entity "Brand Video Ad");
  // otherwise it's a "Manual Collection Ad". Defaults to collection.
  adType?: "collection" | "storeVideo";
  videoAssetId?: string;
  // "Store" uses the storeUrl; "Product List" builds a landing page from the
  // ASINs and needs no URL. Defaults to Store.
  landingPageType?: "Store" | "Product List";
}

// 0-indexed column positions we write (header index minus 1).
const COL = {
  product: 0, entity: 1, operation: 2, campaignId: 3, adGroupId: 5, adName: 11,
  campaignName: 9, adGroupName: 10, startDate: 15, state: 17, brandEntityId: 18,
  budgetType: 28, budget: 29, bidOptimization: 30, bid: 32, keywordText: 39, matchType: 40,
  landingPageUrl: 47, landingPageType: 49, brandName: 50, brandLogoAssetId: 52,
  creativeHeadline: 56, creativeAsins: 57, videoAssetIds: 58,
};

const MATCH_LABEL: Record<string, string> = {
  exact: "Exact",
  phrase: "Phrase",
  broad: "Broad",
};

function toAmazonDate(dateStr: string): number {
  return Number(dateStr.replaceAll("-", ""));
}

function budgetFor(bid: number): number {
  return Math.max(2, Math.ceil(bid));
}

function emptyRow(): (string | number | null)[] {
  return new Array(SB_MAG_HEADER.length).fill(null);
}

function dedupeKeywords(
  keywords: string[],
  matchTypes: string[]
): { kw: string; match: string }[] {
  const seen = new Set<string>();
  const out: { kw: string; match: string }[] = [];
  for (const kw of keywords) {
    const trimmed = kw.trim();
    if (!trimmed) continue;
    for (const match of matchTypes) {
      const key = `${trimmed.toLowerCase()}|${match}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ kw: trimmed, match });
    }
  }
  return out;
}

// Writes the 75-column "SB Multi Ad Group Campaigns" sheet into an existing
// workbook, so it can share a file with the 32-column video sheet.
export function writeBrandSheet(
  workbook: ExcelJS.Workbook,
  country: Country,
  campaigns: BrandCampaignInput[]
): void {
  const sheet = workbook.addWorksheet(SHEET_NAME);
  sheet.getRow(1).values = SB_MAG_HEADER;
  void country; // sheet name is the same across marketplaces for this ad type

  let rowIndex = 2;

  for (const c of campaigns) {
    const isStoreVideo = c.adType === "storeVideo";
    const matchTypes = c.matchTypes ?? ["exact", "phrase", "broad"];
    const budget =
      c.budget != null && c.budget > 0 ? Math.max(1, c.budget) : budgetFor(c.bid);
    const adGroupName = `Ad group - ${c.campaignName}`;
    const adName = `${isStoreVideo ? "Video" : "Collection"} ad - ${c.campaignName}`;

    // Campaign row
    const campaign = emptyRow();
    campaign[COL.product] = "Sponsored Brands";
    campaign[COL.entity] = "Campaign";
    campaign[COL.operation] = "Create";
    campaign[COL.campaignId] = c.campaignName;
    campaign[COL.campaignName] = c.campaignName;
    campaign[COL.startDate] = toAmazonDate(c.startDate);
    campaign[COL.state] = "enabled";
    campaign[COL.brandEntityId] = c.brandEntityId;
    campaign[COL.budgetType] = "Daily";
    campaign[COL.budget] = budget;
    // Bid optimization must be "true" — with "false" Amazon requires manual
    // placement bid adjustments, which this file doesn't include.
    campaign[COL.bidOptimization] = "true";
    sheet.getRow(rowIndex++).values = campaign;

    // Ad Group row
    const adGroup = emptyRow();
    adGroup[COL.product] = "Sponsored Brands";
    adGroup[COL.entity] = "Ad Group";
    adGroup[COL.operation] = "Create";
    adGroup[COL.campaignId] = c.campaignName;
    adGroup[COL.adGroupId] = adGroupName;
    adGroup[COL.adGroupName] = adGroupName;
    adGroup[COL.state] = "enabled";
    sheet.getRow(rowIndex++).values = adGroup;

    // Ad row — "Brand Video Ad" (store video) or "Manual Collection Ad"
    const ad = emptyRow();
    ad[COL.product] = "Sponsored Brands";
    ad[COL.entity] = isStoreVideo ? "Brand Video Ad" : "Manual Collection Ad";
    ad[COL.operation] = "Create";
    ad[COL.campaignId] = c.campaignName;
    ad[COL.adGroupId] = adGroupName;
    ad[COL.adName] = adName;
    ad[COL.state] = "enabled";
    const landingPageType = c.landingPageType ?? "Store";
    ad[COL.landingPageType] = landingPageType;
    // "Product List" needs no URL — Amazon builds the page from the ASINs.
    if (landingPageType !== "Product List") ad[COL.landingPageUrl] = c.storeUrl;
    ad[COL.brandName] = c.brandName;
    ad[COL.brandLogoAssetId] = c.brandLogoAssetId;
    if (c.headline.trim()) ad[COL.creativeHeadline] = c.headline.trim();
    ad[COL.creativeAsins] = c.collectionAsins
      .map((a) => a.trim())
      .filter(Boolean)
      .join(", ");
    if (isStoreVideo && c.videoAssetId) ad[COL.videoAssetIds] = c.videoAssetId;
    sheet.getRow(rowIndex++).values = ad;

    // Keyword rows (deduped)
    for (const { kw, match } of dedupeKeywords(c.keywords, matchTypes)) {
      const row = emptyRow();
      row[COL.product] = "Sponsored Brands";
      row[COL.entity] = "Keyword";
      row[COL.operation] = "Create";
      row[COL.campaignId] = c.campaignName;
      row[COL.adGroupId] = adGroupName;
      row[COL.state] = "enabled";
      row[COL.bid] = c.bid;
      row[COL.keywordText] = kw;
      row[COL.matchType] = MATCH_LABEL[match] ?? match;
      sheet.getRow(rowIndex++).values = row;
    }

    // Negative keyword rows (optional)
    for (const negKw of c.negativeKeywords ?? []) {
      const trimmed = negKw.trim();
      if (!trimmed) continue;
      const row = emptyRow();
      row[COL.product] = "Sponsored Brands";
      row[COL.entity] = "Negative Keyword";
      row[COL.operation] = "Create";
      row[COL.campaignId] = c.campaignName;
      row[COL.adGroupId] = adGroupName;
      row[COL.state] = "enabled";
      row[COL.keywordText] = trimmed;
      row[COL.matchType] = "Negative Exact";
      sheet.getRow(rowIndex++).values = row;
    }
  }
}

export async function buildBrandBulk(
  country: Country,
  campaigns: BrandCampaignInput[]
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  writeBrandSheet(workbook, country, campaigns);
  return Buffer.from(await workbook.xlsx.writeBuffer());
}
