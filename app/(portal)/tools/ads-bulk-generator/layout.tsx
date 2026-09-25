import { assertItemAccess } from "@/lib/permissions";

export default async function AdsBulkGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("tools", "ads-bulk-generator");
  return <>{children}</>;
}
