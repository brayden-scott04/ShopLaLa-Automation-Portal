"use server";

import { randomUUID } from "node:crypto";
import { ImapFlow } from "imapflow";
import { simpleParser, type AddressObject, type ParsedMail } from "mailparser";
import nodemailer from "nodemailer";
import { getSession } from "@/lib/session";

const TITAN_HOST = "imap.secureserver.net";
const TITAN_PORT = 993;
const TITAN_SMTP_HOST = "smtpout.secureserver.net";
const TITAN_SMTP_PORT = 465;
const LIST_LIMIT = 30;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface MailListItem {
  uid: number;
  from: string;
  fromAddress: string;
  subject: string;
  date: string;
  seen: boolean;
}

export interface MailAddress {
  name: string;
  address: string;
}

export interface MailDetail {
  uid: number;
  from: string;
  fromAddress: string;
  to: MailAddress[];
  cc: MailAddress[];
  subject: string;
  date: string;
  text: string;
  messageId: string | null;
  inReplyTo: string | null;
  references: string[];
}

export type MailComposeMode = "reply" | "replyAll" | "forward";

export interface SendMailInput {
  uid: number;
  mode: MailComposeMode;
  body: string;
  /** Forward only — required. Ignored for reply/replyAll (computed server-side). */
  to?: string[];
  /** Forward only, optional. */
  cc?: string[];
}

/**
 * Emails are rendered as plain text only (never dangerouslySetInnerHTML) since
 * message HTML is attacker-controlled input. When a message has no text/plain
 * part, fall back to a crude tag-strip of the HTML — safe because it still
 * renders as an escaped text node, never as markup. Replies/forwards compose
 * the same way — plain text only, no rich text editor.
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

function extractText(parsed: ParsedMail): string {
  return parsed.text || (typeof parsed.html === "string" ? htmlToPlainText(parsed.html) : "");
}

function flattenAddresses(addr: AddressObject | AddressObject[] | undefined): MailAddress[] {
  if (!addr) return [];
  const objects = Array.isArray(addr) ? addr : [addr];
  const out: MailAddress[] = [];
  for (const obj of objects) {
    for (const entry of obj.value) {
      if (entry.address) out.push({ name: entry.name || entry.address, address: entry.address });
    }
  }
  return out;
}

function referencesOf(parsed: ParsedMail): string[] {
  if (Array.isArray(parsed.references)) return parsed.references;
  return parsed.references ? [parsed.references] : [];
}

function titanAuth(): { user: string; pass: string } | null {
  const user = process.env.TITAN_IMAP_USER;
  const pass = process.env.TITAN_IMAP_PASSWORD;
  if (!user || !pass) return null;
  return { user, pass };
}

function titanClient(): ImapFlow | null {
  const auth = titanAuth();
  if (!auth) return null;

  return new ImapFlow({
    host: TITAN_HOST,
    port: TITAN_PORT,
    secure: true,
    auth,
    logger: false,
  });
}

async function fetchAndParseTitanMessage(client: ImapFlow, uid: number): Promise<ParsedMail | null> {
  const message = await client.fetchOne(String(uid), { source: true }, { uid: true });
  if (!message || !message.source) return null;
  return simpleParser(message.source);
}

async function findSentMailbox(client: ImapFlow): Promise<string | null> {
  const mailboxes = await client.list();
  const bySpecialUse = mailboxes.find((mb) => mb.specialUse === "\\Sent");
  if (bySpecialUse) return bySpecialUse.path;

  const byName = mailboxes.find((mb) => /^sent( items| mail)?$/i.test(mb.name));
  return byName?.path ?? null;
}

function encodeHeaderText(value: string): string {
  if (/^[\x20-\x7e]*$/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, "utf-8").toString("base64")}?=`;
}

/**
 * Hand-built RFC 5322 message for the Sent-folder copy — deliberately avoids
 * nodemailer's internal mail-composer module, which ships no type declarations.
 * Plain text only, so a minimal MIME structure is sufficient (no attachments/HTML).
 */
function buildRawMessage(opts: {
  from: string;
  to: string[];
  cc: string[];
  subject: string;
  text: string;
  messageId: string;
  inReplyTo?: string;
  references?: string[];
}): Buffer {
  const headers = [
    `Message-ID: ${opts.messageId}`,
    `Date: ${new Date().toUTCString()}`,
    `From: ${opts.from}`,
    `To: ${opts.to.join(", ")}`,
  ];
  if (opts.cc.length) headers.push(`Cc: ${opts.cc.join(", ")}`);
  headers.push(`Subject: ${encodeHeaderText(opts.subject)}`);
  if (opts.inReplyTo) headers.push(`In-Reply-To: ${opts.inReplyTo}`);
  if (opts.references?.length) headers.push(`References: ${opts.references.join(" ")}`);
  headers.push("MIME-Version: 1.0");
  headers.push("Content-Type: text/plain; charset=UTF-8");
  headers.push("Content-Transfer-Encoding: base64");

  const bodyBase64 = Buffer.from(opts.text, "utf-8")
    .toString("base64")
    .replace(/(.{76})/g, "$1\r\n");

  return Buffer.from(`${headers.join("\r\n")}\r\n\r\n${bodyBase64}\r\n`, "utf-8");
}

function dedupeAddresses(addresses: string[], exclude: string): string[] {
  const excludeLower = exclude.toLowerCase();
  const seen = new Set<string>();
  const out: string[] = [];
  for (const addr of addresses) {
    if (!addr) continue;
    const lower = addr.toLowerCase();
    if (lower === excludeLower || seen.has(lower)) continue;
    seen.add(lower);
    out.push(addr);
  }
  return out;
}

function parseAddressList(raw: string[] | undefined): string[] {
  return (raw ?? []).map((a) => a.trim()).filter(Boolean);
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
    let parsed: ParsedMail | null;
    try {
      parsed = await fetchAndParseTitanMessage(client, uid);
    } finally {
      lock.release();
    }
    if (!parsed) return { data: null, error: "Message not found" };

    const from = parsed.from?.value?.[0];

    return {
      data: {
        uid,
        from: from?.name || from?.address || "Unknown",
        fromAddress: from?.address ?? "",
        to: flattenAddresses(parsed.to),
        cc: flattenAddresses(parsed.cc),
        subject: parsed.subject || "(no subject)",
        date: (parsed.date ?? new Date()).toISOString(),
        text: extractText(parsed),
        messageId: parsed.messageId ?? null,
        inReplyTo: parsed.inReplyTo ?? null,
        references: referencesOf(parsed),
      },
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Failed to load message",
    };
  } finally {
    await client.logout().catch(() => {});
  }
}

export async function sendTitanEmail(input: SendMailInput): Promise<{
  data: { ok: true; savedToSent: boolean } | null;
  error: string | null;
  warning: string | null;
}> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized", warning: null };

  const auth = titanAuth();
  if (!auth) return { data: null, error: "Titan email is not configured", warning: null };

  const body = input.body.trim();
  if (!body) return { data: null, error: "Message body cannot be empty", warning: null };

  let forwardTo: string[] = [];
  let forwardCc: string[] = [];
  if (input.mode === "forward") {
    forwardTo = parseAddressList(input.to);
    if (forwardTo.length === 0) {
      return { data: null, error: "Enter at least one recipient to forward to", warning: null };
    }
    const invalid = forwardTo.find((a) => !EMAIL_RE.test(a));
    if (invalid) {
      return {
        data: null,
        error: `"${invalid}" doesn't look like a valid email address`,
        warning: null,
      };
    }
    forwardCc = parseAddressList(input.cc).filter((a) => EMAIL_RE.test(a));
  }

  const client = titanClient();
  if (!client) return { data: null, error: "Titan email is not configured", warning: null };

  try {
    await client.connect();

    const lock = await client.getMailboxLock("INBOX");
    let parsed: ParsedMail | null;
    try {
      parsed = await fetchAndParseTitanMessage(client, input.uid);
    } finally {
      lock.release();
    }
    if (!parsed) return { data: null, error: "Original message not found", warning: null };

    const originalFrom = parsed.from?.value?.[0];
    const originalSubject = parsed.subject || "(no subject)";
    const originalDate = parsed.date ? parsed.date.toLocaleString() : "";
    const originalFromLabel = originalFrom
      ? `${originalFrom.name || originalFrom.address} <${originalFrom.address}>`
      : "Unknown sender";
    const originalText = extractText(parsed);

    let to: string[];
    let cc: string[];
    if (input.mode === "forward") {
      to = forwardTo;
      cc = forwardCc;
    } else if (input.mode === "reply") {
      to = originalFrom?.address ? dedupeAddresses([originalFrom.address], auth.user) : [];
      cc = [];
    } else {
      const originalTo = flattenAddresses(parsed.to).map((a) => a.address);
      const originalCc = flattenAddresses(parsed.cc).map((a) => a.address);
      to = dedupeAddresses(
        [...(originalFrom?.address ? [originalFrom.address] : []), ...originalTo],
        auth.user
      );
      cc = dedupeAddresses(originalCc, auth.user);
    }

    if (to.length === 0) {
      return { data: null, error: "Could not determine a recipient for this message", warning: null };
    }

    const subject =
      input.mode === "forward"
        ? /^fwd:/i.test(originalSubject)
          ? originalSubject
          : `Fwd: ${originalSubject}`
        : /^re:/i.test(originalSubject)
          ? originalSubject
          : `Re: ${originalSubject}`;

    const quoted =
      input.mode === "forward"
        ? [
            "---------- Forwarded message ----------",
            `From: ${originalFromLabel}`,
            `Date: ${originalDate}`,
            `Subject: ${originalSubject}`,
            `To: ${flattenAddresses(parsed.to)
              .map((a) => `${a.name} <${a.address}>`)
              .join(", ")}`,
            "",
            originalText,
          ].join("\n")
        : [`On ${originalDate}, ${originalFromLabel} wrote:`, ...originalText.split("\n").map((l) => `> ${l}`)].join(
            "\n"
          );

    const text = `${body}\n\n${quoted}`;
    const messageId = `<${randomUUID()}@lalagreen.com>`;

    // Forwards start a new thread by convention — no In-Reply-To/References.
    // Never fabricate a Message-ID when the original lacks one.
    const threading =
      input.mode !== "forward" && parsed.messageId
        ? { inReplyTo: parsed.messageId, references: [...referencesOf(parsed), parsed.messageId] }
        : { inReplyTo: undefined, references: undefined };

    const transporter = nodemailer.createTransport({
      host: TITAN_SMTP_HOST,
      port: TITAN_SMTP_PORT,
      secure: true,
      auth,
    });

    try {
      await transporter.sendMail({
        from: auth.user,
        to,
        cc: cc.length ? cc : undefined,
        subject,
        text,
        messageId,
        inReplyTo: threading.inReplyTo,
        references: threading.references,
      });
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : "Failed to send message",
        warning: null,
      };
    }

    // Best-effort — the send already succeeded, so a failure here is a
    // warning, not an error: the message went out regardless.
    let savedToSent = false;
    let warning: string | null = null;
    try {
      const sentPath = await findSentMailbox(client);
      if (!sentPath) {
        warning = "Message sent, but no Sent folder was found to save a copy in";
      } else {
        const raw = buildRawMessage({
          from: auth.user,
          to,
          cc,
          subject,
          text,
          messageId,
          inReplyTo: threading.inReplyTo,
          references: threading.references,
        });
        await client.append(sentPath, raw, ["\\Seen"]);
        savedToSent = true;
      }
    } catch {
      warning = "Message sent, but saving a copy to Sent failed";
    }

    return { data: { ok: true, savedToSent }, error: null, warning };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Failed to send message",
      warning: null,
    };
  } finally {
    await client.logout().catch(() => {});
  }
}
