import { Network } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { OrgChartView } from "@/components/org-chart/org-chart-view";
import { getT } from "@/lib/i18n/server";

// Every signed-in staff member can view the chart; only admins and leaders see the edit controls
// (and the server actions in lib/actions/org-chart.ts re-check that).
export default async function OrgChartPage() {
  const t = await getT();
  return (
    <>
      <PageHeader icon={Network} title={t("orgChart.title")} description={t("orgChart.description")} />
      <div className="p-6 md:p-8">
        <OrgChartView />
      </div>
    </>
  );
}
