import { assertItemAccess } from "@/lib/permissions";

export default async function PriceChangePlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("marketOps", "price-change-plans");
  return <>{children}</>;
}
