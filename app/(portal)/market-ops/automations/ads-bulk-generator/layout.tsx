import { assertItemAccess } from "@/lib/permissions";

export default async function AdsBulkGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("marketOps", "ads-bulk-generator");
  return <>{children}</>;
}
