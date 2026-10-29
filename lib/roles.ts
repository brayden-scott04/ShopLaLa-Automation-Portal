/**
 * Single source of truth for staff roles and the per-account access model.
 *
 * There are four roles:
 *  - "admin"     — full access to everything; the only role that can promote/
 *                  demote, delete accounts, and assign per-user access. Admin
 *                  accounts can only be created/edited directly in the database.
 *  - "leader"    — everything a moderator can do, plus editing staff profiles
 *                  (reporting lines, teams, responsibilities) and skills on /team.
 *                  Stored as "manager" before sql/staff_profiles_migration.sql.
 *  - "moderator" — can create regular users and reset their passwords, and has
 *                  whatever section access an admin granted.
 *  - "user"      — has only the section access an admin granted.
 *
 * Non-admin access is stored per-account in the `staff.permissions` jsonb column,
 * shaped as {@link PermissionSet}. Admins bypass it entirely (implicit full access).
 */

export type Role = "admin" | "leader" | "moderator" | "user";

export const ROLES: Role[] = ["admin", "leader", "moderator", "user"];

/** Display labels for each role. */
export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  leader: "Leader",
  moderator: "Moderator",
  user: "User",
};

/**
 * The gated navigation sections — the sidebar's Layer-1 groups (see lib/nav.ts,
 * which maps each to its label, route prefix and colour). Keys are permission keys.
 */
export type Section = "dashboard" | "supplyChain" | "marketOps" | "visual" | "others";

export const SECTIONS: Section[] = ["dashboard", "supplyChain", "marketOps", "visual", "others"];

/** Per-account access grants: arrays of item slug ids per section. */
export type PermissionSet = Record<Section, string[]>;

export const EMPTY_PERMISSIONS: PermissionSet = {
  dashboard: [],
  supplyChain: [],
  marketOps: [],
  visual: [],
  others: [],
};

/**
 * Pre-2026-10 section keys, before the nav was regrouped. Item ids didn't
 * change, only the section they live in, so a stored grant under an old key is
 * folded into its new section on read (see {@link toPermissionSet}).
 */
const LEGACY_SECTIONS: Record<string, Section> = {
  sales: "dashboard",
  automations: "marketOps",
  tools: "marketOps",
  configuration: "marketOps",
  communications: "others",
};

/** Admins, leaders and moderators can create users and reset user passwords. */
export function canManageUsers(role: Role): boolean {
  return role !== "user";
}

/**
 * Admins and leaders edit everything on /team/<username>: reporting lines, teams,
 * responsibilities, priority levels and skills.
 */
export function canManageProfiles(role: Role): boolean {
  return role === "admin" || role === "leader";
}

/** Only admins can promote/demote, delete accounts, and assign per-user access. */
export function canAdminister(role: Role): boolean {
  return role === "admin";
}

/**
 * Normalizes an unknown value (e.g. from a JWT claim or DB row) to a valid Role.
 * "manager" is the pre-rename spelling of "leader", still present in older session cookies.
 */
export function toRole(value: unknown): Role {
  if (value === "manager") return "leader";
  return value === "admin" || value === "leader" || value === "moderator" ? value : "user";
}

/** Admins are always allowed; otherwise the id must be in the granted set. */
export function isAllowed(
  role: Role,
  permissions: PermissionSet,
  section: Section,
  id: string
): boolean {
  return role === "admin" || permissions[section].includes(id);
}

/** Returns the subset of `items` the given user may access (admins: all). */
export function filterItems<T extends { id: string; ungated?: boolean }>(
  section: Section,
  items: T[],
  role: Role,
  permissions: PermissionSet
): T[] {
  if (role === "admin") return items;
  return items.filter((item) => item.ungated || permissions[section].includes(item.id));
}

/**
 * Coerces an arbitrary value (jsonb column, form payload) into a valid
 * PermissionSet, folding any legacy section keys into their new section.
 */
export function toPermissionSet(value: unknown): PermissionSet {
  const source = (value ?? {}) as Record<string, unknown>;
  const result: PermissionSet = {
    dashboard: [],
    supplyChain: [],
    marketOps: [],
    visual: [],
    others: [],
  };
  for (const [key, ids] of Object.entries(source)) {
    const section = (SECTIONS as string[]).includes(key)
      ? (key as Section)
      : LEGACY_SECTIONS[key];
    if (!section || !Array.isArray(ids)) continue;
    for (const id of ids) {
      if (typeof id === "string" && !result[section].includes(id)) result[section].push(id);
    }
  }
  return result;
}
