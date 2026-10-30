import { Hourglass } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getT } from "@/lib/i18n/server";
import type { NavItem } from "@/lib/nav";

/** Stand-in for a nav item whose page hasn't been built yet. */
export async function PlaceholderPage({ item }: { item: NavItem }) {
  const t = await getT();
  return (
    <>
      <PageHeader icon={item.icon} title={item.name} description={item.description} />
      <div className="px-6 pb-6 md:px-8 md:pb-8">
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-6 py-16 text-center">
          <Hourglass className="size-5 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">{t("placeholder.comingSoon")}</p>
          <p className="max-w-sm text-sm text-muted-foreground">{t("placeholder.notBuilt")}</p>
        </div>
      </div>
    </>
  );
}
