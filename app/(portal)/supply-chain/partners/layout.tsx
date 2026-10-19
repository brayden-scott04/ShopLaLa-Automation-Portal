import { assertItemAccess } from "@/lib/permissions";

export default async function PartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("supplyChain", "partners");
  return <>{children}</>;
}
