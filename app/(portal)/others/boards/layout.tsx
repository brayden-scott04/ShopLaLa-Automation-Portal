import { assertItemAccess } from "@/lib/permissions";

export default async function BoardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("others", "boards");
  return <>{children}</>;
}
