import { assertItemAccess } from "@/lib/permissions";

export default async function ProfitAnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("sales", "profit-analytics");
  return <>{children}</>;
}
