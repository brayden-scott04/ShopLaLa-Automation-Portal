import { assertItemAccess } from "@/lib/permissions";

export default async function ShipmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("supplyChain", "shipments");
  return <>{children}</>;
}
