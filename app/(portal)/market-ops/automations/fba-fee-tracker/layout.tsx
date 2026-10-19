import { assertItemAccess } from "@/lib/permissions";

export default async function FbaFeeTrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("marketOps", "fba-fee-tracker");
  return <>{children}</>;
}
