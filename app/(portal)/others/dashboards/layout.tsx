import { assertItemAccess } from "@/lib/permissions";

export default async function DashboardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("others", "dashboards");
  return <>{children}</>;
}
