import { assertItemAccess } from "@/lib/permissions";

export default async function CompanyInboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("others", "company-inbox");
  return <>{children}</>;
}
