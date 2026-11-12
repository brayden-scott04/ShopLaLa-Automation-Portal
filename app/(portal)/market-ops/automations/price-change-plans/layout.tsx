import { assertItemAccess } from "@/lib/permissions";

// The page's server actions call SP-API directly (getSkuPricing / getSkuDetail: batched pricing
// calls plus one Listings call per SKU). Functions run in Tokyo (hnd1, see vercel.json) and the
// SP-API NA endpoint is in the US, so big SKU batches take longer than they used to.
export const maxDuration = 300;

export default async function PriceChangePlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("marketOps", "price-change-plans");
  return <>{children}</>;
}
