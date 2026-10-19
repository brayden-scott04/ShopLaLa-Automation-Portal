import { assertItemAccess } from "@/lib/permissions";

export default async function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("supplyChain", "orders");
  return <>{children}</>;
}
