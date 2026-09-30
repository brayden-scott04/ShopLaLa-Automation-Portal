import { assertItemAccess } from "@/lib/permissions";

export default async function FbaFeeTrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("tools", "fba-fee-tracker");
  return <>{children}</>;
}
