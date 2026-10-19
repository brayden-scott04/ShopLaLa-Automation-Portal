import { assertItemAccess } from "@/lib/permissions";

export default async function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("marketOps", "products");
  return <>{children}</>;
}
