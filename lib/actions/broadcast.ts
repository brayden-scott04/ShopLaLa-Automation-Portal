"use server";

import { randomUUID } from "node:crypto";
import { createServiceClient } from "@/lib/supabase/service";
import { getSession } from "@/lib/session";
import { getT } from "@/lib/i18n/server";
import { canManageProfiles, toRole } from "@/lib/roles";
import { notify } from "@/lib/notify";
import { MAX_BROADCAST_LENGTH } from "@/lib/notifications-constants";

/**
 * Leaders and admins: send a message to everyone (`usernames` null) or to the people picked. Each
 * recipient gets a "broadcast" notification in their Dashboard inbox; the sender doesn't get one.
 * All rows of one send share a source_id.
 *
 * The role is read from the staff table, not the session cookie, so someone demoted since they
 * logged in can't broadcast on a stale JWT.
 */
export async function sendBroadcast(
  message: string,
  usernames: string[] | null
): Promise<{ data: { sent: number } | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };
  const t = await getT();
  const db = createServiceClient();

  const { data: me, error: meError } = await db.from("staff").select("role").eq("username", session.username).maybeSingle();
  if (meError) return { data: null, error: meError.message };
  if (!me || !canManageProfiles(toRole(me.role))) return { data: null, error: "Forbidden" };

  const body = message.trim();
  if (!body) return { data: null, error: t("errors.broadcastEmpty") };
  if (body.length > MAX_BROADCAST_LENGTH) {
    return { data: null, error: t("errors.broadcastTooLong", { max: MAX_BROADCAST_LENGTH }) };
  }

  const { data: staff, error: staffError } = await db.from("staff").select("username");
  if (staffError) return { data: null, error: staffError.message };
  const everyone = new Set((staff ?? []).map((s) => s.username as string));
  everyone.delete(session.username);

  // Only real accounts: a name picked in a stale dialog that's since been deleted is dropped.
  const recipients = usernames === null ? [...everyone] : [...new Set(usernames)].filter((u) => everyone.has(u));
  if (recipients.length === 0) return { data: null, error: t("errors.broadcastNoRecipients") };

  const sent = await notify({
    recipients,
    actor: session.username,
    kind: "broadcast",
    sourceType: "broadcast",
    sourceId: randomUUID(),
    data: { body },
    link: null,
  });
  // notify() swallows insert failures (right for side-effect notifications); here the
  // notification IS the action, so a zero means it failed.
  if (sent === 0) return { data: null, error: t("errors.broadcastFailed") };
  return { data: { sent }, error: null };
}
