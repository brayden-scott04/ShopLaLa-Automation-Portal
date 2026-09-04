import { assertItemAccess } from "@/lib/permissions";

export default async function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("others", "calendar");
  return <>{children}</>;
}
