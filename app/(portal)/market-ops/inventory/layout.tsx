import { assertItemAccess } from "@/lib/permissions";

export default async function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("marketOps", "inventory");
  return <>{children}</>;
}
