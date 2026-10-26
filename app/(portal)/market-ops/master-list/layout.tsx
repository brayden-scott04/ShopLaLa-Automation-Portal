import { assertItemAccess } from "@/lib/permissions";

// "Pull from Amazon" walks every listing in a marketplace (~40s for US), longer than the default.
export const maxDuration = 120;

export default async function MasterListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("marketOps", "master-list");
  return <>{children}</>;
}
