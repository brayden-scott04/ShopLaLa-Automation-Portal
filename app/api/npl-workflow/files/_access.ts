import { getSession } from "@/lib/session";
import { getMyPermissions } from "@/lib/permissions";
import { canManageProfiles, isAllowed } from "@/lib/roles";

/** Same rule as lib/actions/npl-workflow.ts: page access to view, plus admin/leader to edit. */
export async function workflowAccess(): Promise<
  { ok: true; username: string; canEdit: boolean } | { ok: false; status: 401 | 403 }
> {
  const session = await getSession();
  if (!session) return { ok: false, status: 401 };
  const { role, permissions } = await getMyPermissions();
  if (!isAllowed(role, permissions, "marketOps", "new-product-launch-workflow")) return { ok: false, status: 403 };
  return { ok: true, username: session.username, canEdit: canManageProfiles(role) };
}
