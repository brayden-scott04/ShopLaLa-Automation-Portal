import Link from "next/link";
import { NAV_GROUPS, ppcTopUp } from "@/lib/nav";
import { getSession } from "@/lib/session";
import { getMyPermissions } from "@/lib/permissions";
import { filterItems, isAllowed } from "@/lib/roles";
import PpcTopUpCharts from "@/components/ppc-top-up-chart";
import { DashboardAccessGrid } from "@/components/dashboard-access-grid";
import { CoreValues } from "@/components/core-values";
import { getT } from "@/lib/i18n/server";

export default async function DashboardPage() {
  const session = await getSession();
  const t = await getT();
  const firstName = session?.username ?? "";

  const { role, permissions } = await getMyPermissions();

  const accessGroups = NAV_GROUPS.map((group) => ({
    group: group.label,
    colorVar: group.colorVar,
    items: filterItems(group.section, group.items, role, permissions).filter((item) => !item.ungated),
  })).filter((group) => group.items.length > 0);

  const hasAnyAccess = accessGroups.length > 0;
  const canSeePpc = isAllowed(role, permissions, ppcTopUp.section, ppcTopUp.id);

  return (
    <div className="p-6 md:p-8">
      <h2 className="text-2xl font-semibold text-foreground">
        {t("dashboard.welcome", { name: firstName })}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("dashboard.subtitle")}
      </p>

      {/* Your access — shows every item across all sections the signed-in user
          may open. Admins see everything. */}
      <div className="mt-6">
        {hasAnyAccess ? (
          <DashboardAccessGrid
            username={session?.username ?? ""}
            hrefs={accessGroups.flatMap((g) => g.items.map((item) => item.href))}
            fullAccess={role === "admin"}
          />
        ) : (
          <>
            <h3 className="text-sm font-semibold text-foreground">{t("dashboard.yourAccess")}</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              {t("dashboard.noAccess")}
            </p>
          </>
        )}
      </div>

      {canSeePpc && (
        <>
          <div className="mt-8 flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">{t("dashboard.ppcTitle")}</h3>
            <Link href={ppcTopUp.href} className="text-xs font-medium text-primary hover:underline">
              {t("dashboard.viewAll")}
            </Link>
          </div>
          <div className="mt-3">
            <PpcTopUpCharts />
          </div>
        </>
      )}

      {/* Shown to everyone, whatever their access, so the values are always one click from login. */}
      <CoreValues />
    </div>
  );
}
