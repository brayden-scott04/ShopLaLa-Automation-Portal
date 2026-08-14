"use server";

import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { getSession } from "@/lib/session";

const TITAN_HOST = "imap.secureserver.net";
const TITAN_PORT = 993;
const LIST_LIMIT = 30;

export interface MailListItem {
  uid: number;
  from: string;
  fromAddress: string;
  subject: string;
  date: string;
  seen: boolean;
}

export interface MailDetail {
  uid: number;
  from: string;
  fromAddress: string;
  subject: string;
  date: string;
  text: string;
}

/**
 * Emails are rendered as plain text only (never dangerouslySetInnerHTML) since
 * message HTML is attacker-controlled input. When a message has no text/plain
 * part, fall back to a crude tag-strip of the HTML — safe because it still
 * renders as an escaped text node, never as markup.
 */
function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function titanClient(): ImapFlow | null {
  const user = process.env.TITAN_IMAP_USER;
  const pass = process.env.TITAN_IMAP_PASSWORD;
  if (!user || !pass) return null;

  return new ImapFlow({
    host: TITAN_HOST,
    port: TITAN_PORT,
    secure: true,
    auth: { user, pass },
    logger: false,
  });
}

export async function listTitanEmails(): Promise<{
  data: MailListItem[] | null;
  error: string | null;
}> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const client = titanClient();
  if (!client) return { data: null, error: "Titan email is not configured" };

  try {
    await client.connect();
    const lock = await client.getMailboxLock("INBOX");
    try {
      const total = client.mailbox && typeof client.mailbox !== "boolean" ? client.mailbox.exists : 0;
      if (total === 0) return { data: [], error: null };

      const start = Math.max(1, total - LIST_LIMIT + 1);
      const items: MailListItem[] = [];

      for await (const msg of client.fetch(`${start}:${total}`, {
        envelope: true,
        flags: true,
      })) {
        const from = msg.envelope?.from?.[0];
        items.push({
          uid: msg.uid,
          from: from?.name || from?.address || "Unknown",
          fromAddress: from?.address ?? "",
          subject: msg.envelope?.subject || "(no subject)",
          date: (msg.envelope?.date ?? new Date()).toISOString(),
          seen: msg.flags?.has("\\Seen") ?? false,
        });
      }

      items.reverse();
      return { data: items, error: null };
    } finally {
      lock.release();
    }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Failed to connect to Titan mailbox",
    };
  } finally {
    await client.logout().catch(() => {});
  }
}

export async function getTitanEmail(uid: number): Promise<{
  data: MailDetail | null;
  error: string | null;
}> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const client = titanClient();
  if (!client) return { data: null, error: "Titan email is not configured" };

  try {
    await client.connect();
    const lock = await client.getMailboxLock("INBOX");
    try {
      const message = await client.fetchOne(String(uid), { source: true }, { uid: true });
      if (!message || !message.source) {
        return { data: null, error: "Message not found" };
      }

      const parsed = await simpleParser(message.source);
      const from = parsed.from?.value?.[0];
      const text =
        parsed.text || (typeof parsed.html === "string" ? htmlToPlainText(parsed.html) : "");

      return {
        data: {
          uid,
          from: from?.name || from?.address || "Unknown",
          fromAddress: from?.address ?? "",
          subject: parsed.subject || "(no subject)",
          date: (parsed.date ?? new Date()).toISOString(),
          text,
        },
        error: null,
      };
    } finally {
      lock.release();
    }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Failed to load message",
    };
  } finally {
    await client.logout().catch(() => {});
  }
}
