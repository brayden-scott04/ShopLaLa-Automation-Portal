import { assertItemAccess } from "@/lib/permissions";

export default async function PdpBulkGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("tools", "pdp-bulk-generator");
  return <>{children}</>;
}
