import ExcelJS from "exceljs";

export type Country = "US" | "CA" | "MX" | "AU" | "EU" | "UK" | "JP";

// Header row for the Sponsored Brands campaigns sheet (32 columns), taken
// verbatim from the official Amazon bulk templates. We build the workbook
// fresh rather than reading the template: reading + rewriting the template
// via exceljs corrupts the theme part and makes Excel show a repair warning.
// US-style header. MX / AU / EU currently reuse this layout until we have
// their real localized templates to copy exact headers/sheet names from.
const US_HEADER = [
  "Product", "Entity", "Operation", "Campaign ID", "Draft campaign ID", "Portfolio ID",
  "Ad Group ID", "Keyword ID", "Product Targeting ID", "Campaign name", "Start date",
  "End date", "State", "Budget type", "Budget", "Bid optimization", "Bid Multiplier",
  "Bid", "Keyword text", "Match type", "Product targeting expression", "Ad format",
  "Landing page URL", "Landing page ASINs", "Brand Entity ID", "Brand name",
  "Brand logo asset ID", "Custom image asset ID", "Creative headline", "Creative ASINs",
  "Video media IDs", "Creative Type",
];

const HEADER: Record<Country, string[]> = {
  US: US_HEADER,
  MX: US_HEADER,
  AU: US_HEADER,
  EU: US_HEADER,
  UK: US_HEADER,
  JP: US_HEADER,
  CA: [
    "Product", "Entity", "Operation", "Campaign ID", "Draft Campaign ID", "Portfolio ID",
    "Ad Group ID", "Keyword ID", "Product Targeting ID", "Campaign Name", "Start Date",
    "End Date", "State", "Budget Type", "Budget", "Bid Optimization", "Bid Multiplier",
    "Bid", "Keyword Text", "Match Type", "Product Targeting Expression", "Ad Format",
    "Landing Page URL", "Landing Page ASINs", "Brand Entity ID", "Brand Name",
    "Brand Logo Asset ID", "Custom Image Asset ID", "Creative Headline", "Creative ASINs",
    "Video Media IDs", "Creative Type",
  ],
};

export interface BrandProfile {
  country: Country;
  brandEntityId: string;
  brandName: string;
}

export interface CampaignInput {
  campaignName: string;
  asin: string;
  bid: number;
  budget?: number; // daily budget; defaults to max(2, ceil(bid)) when omitted
  startDate: string; // YYYY-MM-DD
  videoAssetId: string; // amzn1.assetlibrary.asset1.XXXXX
  keywords: string[];
  matchTypes?: ("exact" | "phrase" | "broad")[]; // default all 3
  negativeKeywords?: string[];
  brandEntityId: string;
  brandName: string;
}

const SHEET_NAME: Record<Country, string> = {
  US: "Sponsored Brands campaigns",
  MX: "Sponsored Brands campaigns",
  AU: "Sponsored Brands campaigns",
  EU: "Sponsored Brands campaigns",
  UK: "Sponsored Brands campaigns",
  JP: "Sponsored Brands campaigns",
  CA: "Sponsored Brands Campaigns",
};

function toAmazonDate(dateStr: string): number {
  return Number(dateStr.replaceAll("-", ""));
}

function budgetFor(bid: number): number {
  return Math.max(2, Math.ceil(bid));
}

// 32 columns per the Sponsored Brands campaigns sheet
function emptyRow(): (string | number | null)[] {
  return new Array(32).fill(null);
}

function dedupeKeywords(
  keywords: string[],
  matchTypes: string[]
): { kw: string; match: string }[] {
  const seen = new Set<string>();
  const result: { kw: string; match: string }[] = [];
  for (const kw of keywords) {
    const trimmed = kw.trim();
    if (!trimmed) continue;
    for (const match of matchTypes) {
      const key = `${trimmed.toLowerCase()}|${match}`;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push({ kw: trimmed, match });
    }
  }
  return result;
}

// Writes the 32-column "Sponsored Brands campaigns" sheet into an existing
// workbook, so a single file can also carry the 75-column Store/Brand sheet.
export function writeVideoSheet(
  workbook: ExcelJS.Workbook,
  country: Country,
  campaigns: CampaignInput[]
): void {
  const sheet = workbook.addWorksheet(SHEET_NAME[country]);
  sheet.getRow(1).values = HEADER[country];

  let rowIndex = 2; // row 1 = header

  for (const campaign of campaigns) {
    const matchTypes = campaign.matchTypes ?? ["exact", "phrase", "broad"];
    const budget =
      campaign.budget != null && campaign.budget > 0
        ? Math.max(1, campaign.budget)
        : budgetFor(campaign.bid);

    // Campaign row
    const campaignRow = emptyRow();
    campaignRow[0] = "Sponsored Brands"; // Product
    campaignRow[1] = "Campaign"; // Entity
    campaignRow[2] = "Create"; // Operation
    campaignRow[3] = campaign.campaignName; // Campaign ID
    campaignRow[9] = campaign.campaignName; // Campaign name
    campaignRow[10] = toAmazonDate(campaign.startDate); // Start date
    campaignRow[12] = "enabled"; // State
    campaignRow[13] = "daily"; // Budget type
    campaignRow[14] = budget; // Budget
    campaignRow[21] = "video"; // Ad format
    campaignRow[24] = campaign.brandEntityId; // Brand Entity ID
    campaignRow[25] = campaign.brandName; // Brand name
    campaignRow[29] = campaign.asin; // Creative ASINs
    campaignRow[30] = campaign.videoAssetId; // Video media IDs
    campaignRow[31] = "video"; // Creative Type
    sheet.getRow(rowIndex).values = campaignRow;
    rowIndex++;

    // Keyword rows (deduped)
    const kwRows = dedupeKeywords(campaign.keywords, matchTypes);
    for (const { kw, match } of kwRows) {
      const row = emptyRow();
      row[0] = "Sponsored Brands";
      row[1] = "Keyword";
      row[2] = "Create";
      row[3] = campaign.campaignName; // Campaign ID
      row[12] = "enabled"; // State
      row[17] = campaign.bid; // Bid
      row[18] = kw; // Keyword text
      row[19] = match; // Match type
      sheet.getRow(rowIndex).values = row;
      rowIndex++;
    }

    // Negative keyword rows
    for (const negKw of campaign.negativeKeywords ?? []) {
      const trimmed = negKw.trim();
      if (!trimmed) continue;
      const row = emptyRow();
      row[0] = "Sponsored Brands";
      row[1] = "Negative keyword";
      row[2] = "Create";
      row[3] = campaign.campaignName;
      row[12] = "enabled";
      row[18] = trimmed; // Keyword text
      row[19] = "negativeExact"; // Match type
      sheet.getRow(rowIndex).values = row;
      rowIndex++;
    }
  }
}

export async function buildVideoBulk(
  country: Country,
  campaigns: CampaignInput[]
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  writeVideoSheet(workbook, country, campaigns);
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
