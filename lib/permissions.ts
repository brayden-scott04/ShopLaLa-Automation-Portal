import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import {
  type Role,
  type Section,
  type PermissionSet,
  EMPTY_PERMISSIONS,
  SECTIONS,
  toPermissionSet,
  isAllowed,
} from "@/lib/roles";
import { NAV_GROUPS } from "@/lib/nav";

/** Every grantable item id per section — the universe an admin can grant from. */
export const ALL_ITEM_IDS = Object.fromEntries(
  NAV_GROUPS.map((group) => [
    group.section,
    group.items.filter((item) => !item.ungated).map((item) => item.id),
  ])
) as PermissionSet;

/**
 * Strips any ids that don't correspond to a real item, so a stale or forged
 * grant can never widen access. Used when saving and when reading permissions.
 */
export function sanitizePermissions(input: unknown): PermissionSet {
  const parsed = toPermissionSet(input);
  const result = { ...EMPTY_PERMISSIONS };
  for (const section of SECTIONS) {
    result[section] = parsed[section].filter((id) => ALL_ITEM_IDS[section].includes(id));
  }
  return result;
}

/**
 * Reads the current session's role and access grants fresh from the DB (never
 * from the JWT), so an admin's grant/revoke takes effect immediately. Admins
 * report every known item id (implicit full access). Returns empty permissions
 * for a missing session so callers can gate safely.
 *
 * `accountExists` is false when the session's username no longer matches a
 * staff row (renamed or deleted since they logged in); the portal layout sends
 * them back to /login. Admin sessions skip the lookup, and admin accounts can't
 * be renamed from the portal.
 */
export async function getMyPermissions(): Promise<{
  role: Role;
  permissions: PermissionSet;
  accountExists: boolean;
}> {
  const session = await getSession();
  if (!session) return { role: "user", permissions: EMPTY_PERMISSIONS, accountExists: false };

  if (session.role === "admin") {
    return { role: "admin", permissions: { ...ALL_ITEM_IDS }, accountExists: true };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("staff")
    .select("permissions")
    .eq("username", session.username)
    .single();

  return {
    role: session.role,
    permissions: sanitizePermissions(data?.permissions),
    // PGRST116 = .single() matched zero rows. Any other error (network, etc.)
    // shouldn't sign someone out.
    accountExists: Boolean(data) || error?.code !== "PGRST116",
  };
}

/**
 * Server guard for an item page/route. Redirects to /dashboard when the current
 * user lacks access — this is the real gate against direct URLs, independent of
 * whether the sidebar link is hidden.
 */
export async function assertItemAccess(section: Section, id: string): Promise<void> {
  const { role, permissions } = await getMyPermissions();
  if (!isAllowed(role, permissions, section, id)) {
    redirect("/dashboard");
  }
}
