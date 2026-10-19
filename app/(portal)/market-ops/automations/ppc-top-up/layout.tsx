import { assertItemAccess } from "@/lib/permissions";

export default async function PpcTopUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("marketOps", "ppc-top-up");
  return <>{children}</>;
}
