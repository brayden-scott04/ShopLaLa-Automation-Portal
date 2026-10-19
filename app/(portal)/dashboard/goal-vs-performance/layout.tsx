import { assertItemAccess } from "@/lib/permissions";

export default async function GoalVsPerformanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("dashboard", "goal-vs-performance");
  return <>{children}</>;
}
