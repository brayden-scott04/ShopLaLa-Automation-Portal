import { assertItemAccess } from "@/lib/permissions";

export default async function AdvertisementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("marketOps", "advertisements");
  return <>{children}</>;
}
