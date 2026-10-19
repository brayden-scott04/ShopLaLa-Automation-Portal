import { assertItemAccess } from "@/lib/permissions";

export default async function MasterListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("marketOps", "master-list");
  return <>{children}</>;
}
