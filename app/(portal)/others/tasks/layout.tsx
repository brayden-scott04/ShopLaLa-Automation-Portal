import { assertItemAccess } from "@/lib/permissions";

export default async function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("others", "tasks");
  return <>{children}</>;
}
