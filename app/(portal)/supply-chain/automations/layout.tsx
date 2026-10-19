import { assertItemAccess } from "@/lib/permissions";

export default async function SupplyChainAutomationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("supplyChain", "automations");
  return <>{children}</>;
}
