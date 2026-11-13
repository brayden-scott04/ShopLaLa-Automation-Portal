"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { getSession } from "@/lib/session";
import {
  NOTIFICATION_RETENTION_DAYS,
  type NotificationData,
  type NotificationKind,
  type NotificationSource,
  type PortalNotification,
} from "@/lib/notifications-constants";

// The table has RLS on with no policies: everything goes through the service client, always
// filtered to the signed-in person's own rows.

const COLUMNS = "id, kind, actor, source_type, source_id, data, link, read_at, created_at";
const LIST_LIMIT = 50;

type Row = {
  id: string;
  kind: string;
  actor: string | null;
  source_type: string;
  source_id: string | null;
  data: NotificationData | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
};

function toNotification(r: Row): PortalNotification {
  return {
    id: r.id,
    kind: r.kind as NotificationKind,
    actor: r.actor,
    sourceType: r.source_type as NotificationSource,
    sourceId: r.source_id,
    data: r.data ?? {},
    link: r.link,
    readAt: r.read_at,
    createdAt: r.created_at,
  };
}

/** Newest first, plus the total unread count (which may exceed what's listed). */
export async function listNotifications(): Promise<{
  data: { items: PortalNotification[]; unread: number } | null;
  error: string | null;
}> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };
  const db = createServiceClient();

  // Retention: read notifications older than the cutoff go. Cheap (indexed on recipient), and
  // doing it here means nothing needs a scheduled job.
  const cutoff = new Date(Date.now() - NOTIFICATION_RETENTION_DAYS * 86_400_000).toISOString();
  await db.from("notifications").delete().eq("recipient", session.username).not("read_at", "is", null).lt("created_at", cutoff);

  const [{ data, error }, unread] = await Promise.all([
    db
      .from("notifications")
      .select(COLUMNS)
      .eq("recipient", session.username)
      .order("created_at", { ascending: false })
      .limit(LIST_LIMIT),
    countUnread(session.username),
  ]);
  if (error) return { data: null, error: error.message };
  if (unread.error) return { data: null, error: unread.error };
  return { data: { items: (data as Row[]).map(toNotification), unread: unread.count }, error: null };
}

async function countUnread(username: string): Promise<{ count: number; error: string | null }> {
  const { count, error } = await createServiceClient()
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("recipient", username)
    .is("read_at", null);
  return { count: count ?? 0, error: error?.message ?? null };
}

export async function getUnreadNotificationCount(): Promise<{ data: number | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };
  const { count, error } = await countUnread(session.username);
  return error ? { data: null, error } : { data: count, error: null };
}

export async function markNotificationRead(id: string): Promise<{ error: string | null }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };
  const { error } = await createServiceClient()
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id)
    .eq("recipient", session.username)
    .is("read_at", null);
  return { error: error?.message ?? null };
}

export async function markAllNotificationsRead(): Promise<{ error: string | null }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };
  const { error } = await createServiceClient()
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("recipient", session.username)
    .is("read_at", null);
  return { error: error?.message ?? null };
}
