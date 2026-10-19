import { assertItemAccess } from "@/lib/permissions";

export default async function SourcingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("supplyChain", "sourcing");
  return <>{children}</>;
}
