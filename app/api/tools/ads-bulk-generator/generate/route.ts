import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getSession } from "@/lib/session";
import { getMyPermissions } from "@/lib/permissions";
import { isAllowed } from "@/lib/roles";
import { createClient } from "@/lib/supabase/server";
import { writeVideoSheet, type CampaignInput, type Country } from "@/lib/xlsx/pdp/buildVideoBulk";
import { writeBrandSheet, type BrandCampaignInput } from "@/lib/xlsx/pdp/buildBrandBulk";

// Each campaign carries its own brandId (product boxes can use different brand
// profiles) plus a `_sheet` tag telling us which Amazon sheet it belongs to:
// "video" (32-col PDP video) or "brand" (75-col Store video / Product
// Collection). A single file can contain both sheets.
type IncomingCampaign = (
  | Omit<CampaignInput, "brandEntityId" | "brandName">
  | Omit<BrandCampaignInput, "brandEntityId" | "brandName">
) & {
  brandId: string;
  _sheet: "video" | "brand";
};

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role, permissions } = await getMyPermissions();
  if (!isAllowed(role, permissions, "tools", "ads-bulk-generator")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { campaigns } = body as { campaigns: IncomingCampaign[] };
  if (!campaigns?.length) {
    return NextResponse.json({ error: "No campaigns to generate" }, { status: 400 });
  }

  const client = await createClient();
  const { data: brands, error } = await client
    .from("bulk_campaign_brands")
    .select("id, country, brand_entity_id, brand_name");
  if (error || !brands?.length) {
    return NextResponse.json({ error: "Brand profiles not found" }, { status: 404 });
  }
  const byId = new Map(brands.map((b) => [b.id as string, b]));

  // A bulk file targets one marketplace, so every product box must use a
  // brand profile from the same country.
  const countries = new Set<string>();
  for (const c of campaigns) {
    const brand = byId.get(c.brandId);
    if (!brand) {
      return NextResponse.json(
        { error: "A campaign references an unknown brand profile" },
        { status: 400 }
      );
    }
    countries.add(brand.country);
  }
  if (countries.size > 1) {
    return NextResponse.json(
      {
        error: `All product boxes must use brand profiles from the same marketplace. Found: ${[
          ...countries,
        ].join(", ")}.`,
      },
      { status: 400 }
    );
  }
  const country = [...countries][0] as Country;

  // Split into the two sheets, stamping each row with its brand's entity/name.
  const videoCampaigns: CampaignInput[] = [];
  const brandCampaigns: BrandCampaignInput[] = [];
  for (const c of campaigns) {
    const brand = byId.get(c.brandId)!;
    const { brandId: _omit, _sheet, ...rest } = c;
    void _omit;
    const enriched = {
      ...rest,
      brandEntityId: brand.brand_entity_id,
      brandName: brand.brand_name,
    };
    if (_sheet === "brand") brandCampaigns.push(enriched as BrandCampaignInput);
    else videoCampaigns.push(enriched as CampaignInput);
  }

  const workbook = new ExcelJS.Workbook();
  if (videoCampaigns.length) writeVideoSheet(workbook, country, videoCampaigns);
  if (brandCampaigns.length) writeBrandSheet(workbook, country, brandCampaigns);
  const buffer = Buffer.from(await workbook.xlsx.writeBuffer());

  const prefix =
    videoCampaigns.length && brandCampaigns.length
      ? "SB_Bulk"
      : brandCampaigns.length
      ? "Brand_Bulk"
      : "Video_Bulk";
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${prefix}_${campaigns.length}.xlsx"`,
    },
  });
}
