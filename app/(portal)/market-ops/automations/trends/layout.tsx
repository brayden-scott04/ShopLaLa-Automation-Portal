import { assertItemAccess } from "@/lib/permissions";

export default async function TrendsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("marketOps", "trends");
  return <>{children}</>;
}
