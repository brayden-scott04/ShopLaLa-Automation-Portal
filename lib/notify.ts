// Server-only helpers for writing notifications from other server actions (calendar, tasks).
// Deliberately NOT a "use server" module: these must never be callable from the browser.
import { createServiceClient } from "@/lib/supabase/service";
import type {
  NotificationChange,
  NotificationData,
  NotificationKind,
  NotificationSource,
} from "@/lib/notifications-constants";

export interface NotifyInput {
  recipients: Iterable<string>;
  actor: string;
  kind: NotificationKind;
  sourceType: NotificationSource;
  sourceId: string | null;
  data: NotificationData;
  link: string | null;
}

/**
 * Writes one notification per recipient, never to the actor themself. A failure is logged and
 * swallowed: the change the person made has already been saved, and a missed notification must
 * not turn that into an error on screen.
 */
export async function notify(input: NotifyInput): Promise<number> {
  const recipients = Array.from(new Set(input.recipients)).filter((u) => u && u !== input.actor);
  if (recipients.length === 0) return 0;
  try {
    const { error } = await createServiceClient()
      .from("notifications")
      .insert(
        recipients.map((recipient) => ({
          recipient,
          actor: input.actor,
          kind: input.kind,
          source_type: input.sourceType,
          source_id: input.sourceId,
          data: input.data,
          link: input.link,
        }))
      );
    if (error) {
      console.error("[notify] insert failed:", error.message);
      return 0;
    }
    return recipients.length;
  } catch (err) {
    console.error("[notify] insert threw:", err);
    return 0;
  }
}

/** "HH:MM" / "HH:MM-HH:MM" / null (all day), the shape NotificationChange uses for times. */
export function timeValue(start: string | null | undefined, end: string | null | undefined): string | null {
  const s = start ? start.slice(0, 5) : null;
  if (!s) return null;
  const e = end ? end.slice(0, 5) : null;
  return e ? `${s}-${e}` : s;
}

/** Appends a change when `from` and `to` differ (null/undefined/"" all count as empty). */
export function pushChange(
  changes: NotificationChange[],
  field: NotificationChange["field"],
  from: string | null | undefined,
  to: string | null | undefined,
  { withValues = true }: { withValues?: boolean } = {}
) {
  const a = from || null;
  const b = to || null;
  if (a === b) return;
  changes.push(withValues ? { field, from: a, to: b } : { field });
}
