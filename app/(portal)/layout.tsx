import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMyPermissions } from "@/lib/permissions";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { DashboardLink } from "@/components/dashboard-link";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { role, permissions, accountExists } = await getMyPermissions();

  // Their username was changed (or account deleted) since they logged in —
  // logging in again replaces the stale session cookie.
  if (!accountExists) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        username={session.username}
        role={role}
        permissions={permissions}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          username={session.username}
          role={role}
          permissions={permissions}
        />
        <main className="flex-1 bg-background">
          <DashboardLink />
          {children}
        </main>
      </div>
    </div>
  );
}
