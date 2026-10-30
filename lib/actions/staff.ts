"use server";

import bcrypt from "bcryptjs";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/session";
import { type Role, type PermissionSet, canManageUsers } from "@/lib/roles";
import { sanitizePermissions } from "@/lib/permissions";

import { getT, setLocaleCookie } from "@/lib/i18n/server";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import type { MessageKey, Vars } from "@/lib/i18n/translate";

/** Error text in the caller's language. */
async function tr(key: MessageKey, vars?: Vars): Promise<string> {
  return (await getT())(key, vars);
}

const USERNAME_PATTERN = /^[a-z0-9_-]{3,32}$/;

/** Applies to self-service changes only; createStaffMember still accepts any non-empty password. */
const MIN_PASSWORD_LENGTH = 8;

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { client: null, session: null, error: "Unauthorized" as const };
  }
  const client = await createClient();
  return { client, session, error: null };
}

/** Admins, leaders and moderators may create users and reset user passwords. */
async function requireAdminOrModerator() {
  const session = await getSession();
  if (!session || !canManageUsers(session.role)) {
    return { client: null, session: null, error: "Unauthorized" as const };
  }
  const client = await createClient();
  return { client, session, error: null };
}

export async function listStaff() {
  const { client, error } = await requireAdminOrModerator();
  if (error) return { data: null, error };

  const { data, error: dbError } = await client!
    .from("staff")
    .select("id, username, role, created_at, permissions")
    .order("created_at", { ascending: true });

  return { data, error: dbError?.message ?? null };
}

export async function getStaffDirectory() {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const client = await createClient();
  const { data, error: dbError } = await client
    .from("staff")
    .select("id, username, role, job_role")
    .order("role", { ascending: true })
    .order("username", { ascending: true });

  return { data, error: dbError?.message ?? null };
}

const MAX_JOB_ROLE_LENGTH = 60;

/** Admin-only: set the free-text job title shown on /team. Blank clears it. */
export async function updateJobRole(id: string, jobRole: string) {
  const { client, error } = await requireAdmin();
  if (error) return { data: null, error };

  const trimmed = jobRole.trim();
  if (trimmed.length > MAX_JOB_ROLE_LENGTH) {
    return { data: null, error: await tr("errors.jobRoleTooLong", { max: MAX_JOB_ROLE_LENGTH }) };
  }

  const { data, error: dbError } = await client!
    .from("staff")
    .update({ job_role: trimmed || null })
    .eq("id", id)
    .select("id, username, role, job_role")
    .single();

  return { data, error: dbError?.message ?? null };
}

export async function getCurrentUser() {
  const session = await getSession();
  return session ? { username: session.username, role: session.role } : null;
}

export async function createStaffMember(username: string, password: string) {
  const { client, error } = await requireAdminOrModerator();
  if (error) return { data: null, error };

  const normalized = username.toLowerCase();
  if (!USERNAME_PATTERN.test(normalized)) {
    return {
      data: null,
      error: await tr("errors.usernameFormat"),
    };
  }
  if (!password) {
    return { data: null, error: await tr("errors.passwordRequired") };
  }

  const password_hash = bcrypt.hashSync(password, 10);

  const { data, error: dbError } = await client!
    .from("staff")
    .insert({ username: normalized, password_hash, role: "user" })
    .select("id, username, role, created_at")
    .single();

  if (dbError) {
    const message = dbError.code === "23505" ? "Username already taken" : dbError.message;
    return { data: null, error: message };
  }

  return { data, error: null };
}

export async function updateStaffMember(
  id: string,
  updates: { role?: Role }
) {
  const { client, session, error } = await requireAdmin();
  if (error) return { data: null, error };

  // Admin tier is out-of-band only: admins can move users between user, moderator
  // and leader, never to admin.
  if (updates.role === "admin") {
    return { data: null, error: await tr("errors.adminOnlyInDb") };
  }

  if (updates.role !== undefined) {
    const { data: target } = await client!
      .from("staff")
      .select("username")
      .eq("id", id)
      .single();
    if (target?.username === session!.username) {
      return { data: null, error: await tr("errors.ownRole") };
    }
  }

  const { data, error: dbError } = await client!
    .from("staff")
    .update(updates)
    .eq("id", id)
    .select("id, username, role, created_at, permissions")
    .single();

  return { data, error: dbError?.message ?? null };
}

/**
 * Admin-only: rename a user or moderator. Admin accounts are managed directly
 * in the database, like their role and password.
 *
 * Rows that reference staff.username by foreign key (tasks, task assignees and
 * updates, calendars and their members/assignees/creators) follow the rename via
 * ON UPDATE CASCADE (see sql/staff_rename_cascade_migration.sql). Free-text
 * audit columns (e.g. price_change_plans.created_by, *_by_username) keep the
 * name that was current when the row was written.
 *
 * The renamed person's session still carries the old username, so the portal
 * layout signs them out and they log in again with the new one.
 */
export async function renameStaffMember(id: string, newUsername: string) {
  const { client, error } = await requireAdmin();
  if (error) return { data: null, error };

  const normalized = newUsername.trim().toLowerCase();
  if (!USERNAME_PATTERN.test(normalized)) {
    return {
      data: null,
      error: await tr("errors.usernameFormat"),
    };
  }

  const { data: target } = await client!
    .from("staff")
    .select("username, role")
    .eq("id", id)
    .single();
  if (!target) {
    return { data: null, error: await tr("errors.staffNotFound") };
  }
  if (target.role === "admin") {
    return { data: null, error: await tr("errors.adminRenameInDb") };
  }
  if (target.username === normalized) {
    return { data: null, error: await tr("errors.sameUsername") };
  }

  const { data, error: dbError } = await client!
    .from("staff")
    .update({ username: normalized })
    .eq("id", id)
    .select("id, username, role, created_at, permissions")
    .single();

  if (dbError) {
    const message =
      dbError.code === "23505"
        ? "Username already taken"
        : dbError.code === "23503"
          ? "Their calendar data blocks the rename. Apply sql/staff_rename_cascade_migration.sql first."
          : dbError.message;
    return { data: null, error: message };
  }

  return { data, error: null };
}

/** Admin-only: assign which section items a user or moderator may access. */
export async function updatePermissions(id: string, permissions: PermissionSet) {
  const { client, error } = await requireAdmin();
  if (error) return { data: null, error };

  const clean = sanitizePermissions(permissions);

  const { data, error: dbError } = await client!
    .from("staff")
    .update({ permissions: clean })
    .eq("id", id)
    .select("id, username, role, created_at, permissions")
    .single();

  return { data, error: dbError?.message ?? null };
}

export async function resetPassword(id: string, newPassword: string) {
  const { client, error } = await requireAdminOrModerator();
  if (error) return { data: null, error };

  // No one may change an admin's, leader's or moderator's password here
  // (those credentials are managed directly in the database). Only "user" accounts.
  const { data: target } = await client!
    .from("staff")
    .select("role")
    .eq("id", id)
    .single();
  if (!target) {
    return { data: null, error: await tr("errors.staffNotFound") };
  }
  if (target.role !== "user") {
    return { data: null, error: await tr("errors.resetOnlyUsers") };
  }

  const password_hash = bcrypt.hashSync(newPassword, 10);

  const { error: dbError } = await client!
    .from("staff")
    .update({ password_hash })
    .eq("id", id);

  return { data: { ok: true }, error: dbError?.message ?? null };
}

/**
 * Self-service password change for whoever is signed in.
 *
 * Deliberately takes no id or username: the row is resolved from the session,
 * so this can never be pointed at another account however it's called. That
 * also makes it the only path by which an admin or moderator can change their
 * own password -- resetPassword() above refuses any non-"user" account.
 *
 * Overwriting password_hash is what retires the old password: a row holds one
 * hash, so once it's replaced there is nothing left for the old password to
 * compare against.
 */
export async function changeOwnPassword(
  currentPassword: string,
  newPassword: string
) {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  if (!currentPassword) {
    return { data: null, error: await tr("errors.currentPasswordRequired") };
  }
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return {
      data: null,
      error: await tr("errors.newPasswordTooShort", { min: MIN_PASSWORD_LENGTH }),
    };
  }
  if (newPassword === currentPassword) {
    return { data: null, error: await tr("errors.newPasswordSame") };
  }

  const client = await createClient();
  const { data: me } = await client
    .from("staff")
    .select("id, password_hash")
    .eq("username", session.username)
    .single();

  // Same generic message whether the account vanished or the password is
  // wrong -- neither case should tell the caller which.
  if (!me || !bcrypt.compareSync(currentPassword, me.password_hash)) {
    return { data: null, error: await tr("errors.currentPasswordWrong") };
  }

  const { error: dbError } = await client
    .from("staff")
    .update({ password_hash: bcrypt.hashSync(newPassword, 10) })
    .eq("id", me.id);

  return { data: dbError ? null : { ok: true }, error: dbError?.message ?? null };
}

export async function deleteStaffMember(id: string) {
  const { client, session, error } = await requireAdmin();
  if (error) return { data: null, error };

  const { data: target } = await client!
    .from("staff")
    .select("username")
    .eq("id", id)
    .single();

  if (target?.username === session!.username) {
    return { data: null, error: await tr("errors.deleteSelf") };
  }

  const { error: dbError } = await client!.from("staff").delete().eq("id", id);

  return { data: { ok: true }, error: dbError?.message ?? null };
}

/**
 * Sets the signed-in person's own site language: saved to staff.language (so it follows them to
 * other devices at login) and to the portal_lang cookie (so this browser switches immediately).
 */
export async function setLanguage(locale: Locale) {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };
  if (!LOCALES.includes(locale)) return { data: null, error: await tr("errors.invalidLanguage") };

  await setLocaleCookie(locale);
  const client = await createClient();
  const { error: dbError } = await client
    .from("staff")
    .update({ language: locale })
    .eq("username", session.username);

  // The cookie is already set, so the switch works even before sql/staff_language_migration.sql
  // adds the column (42703 = undefined column); only the cross-device memory is missing until then.
  const error = dbError && dbError.code !== "42703" ? dbError.message : null;
  return { data: { locale }, error };
}
