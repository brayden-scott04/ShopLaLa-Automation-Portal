import { assertItemAccess } from "@/lib/permissions";

export default async function ListingScoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("visual", "listing-score");
  return <>{children}</>;
}
