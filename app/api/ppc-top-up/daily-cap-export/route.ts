import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getDailyCapConfig } from "@/lib/actions/ppc-daily-cap";
import { todaySgt } from "@/lib/ppc-daily-cap-constants";
import { buildDailyCapExport } from "@/lib/xlsx/buildDailyCapExport";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const countryCode = req.nextUrl.searchParams.get("country");
  if (!countryCode) {
    return NextResponse.json({ error: "Missing country query param" }, { status: 400 });
  }

  const { data, error } = await getDailyCapConfig();
  if (error || !data) {
    return NextResponse.json({ error: error ?? "Failed to load schedule" }, { status: 500 });
  }

  const country = data.countries.find((c) => c.country_code === countryCode);
  if (!country) {
    return NextResponse.json({ error: `Unknown country: ${countryCode}` }, { status: 404 });
  }

  const rows = data.schedule
    .filter((r) => r.country_code === countryCode)
    .map((r) => ({ slot_time: r.slot_time, amount: r.amount }));

  const buffer = await buildDailyCapExport(countryCode, country.reset_time, rows);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="Daily_Budget_Cap_${countryCode}_${todaySgt()}.xlsx"`,
    },
  });
}
