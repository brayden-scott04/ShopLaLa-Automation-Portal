import { assertItemAccess } from "@/lib/permissions";

export default async function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("others", "finance");
  return <>{children}</>;
}
