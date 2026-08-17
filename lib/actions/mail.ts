"use server";

import { randomUUID } from "node:crypto";
import { ImapFlow, type FetchMessageObject } from "imapflow";
import { simpleParser, type AddressObject, type ParsedMail } from "mailparser";
import nodemailer from "nodemailer";
import { getSession } from "@/lib/session";

const TITAN_HOST = "imap.secureserver.net";
const TITAN_PORT = 993;
const TITAN_SMTP_HOST = "smtpout.secureserver.net";
const TITAN_SMTP_PORT = 465;
const LIST_LIMIT = 30;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Bounds how far back thread correlation (Message-ID/In-Reply-To matching) and
// the "replied" badge scan look, in each of INBOX/Sent. Envelope-only, so cheap.
const THREAD_SCAN_LIMIT = 200;
const MAX_THREAD_ITEMS = 100;

export interface MailListItem {
  uid: number;
  from: string;
  fromAddress: string;
  subject: string;
  date: string;
  seen: boolean;
  /** True if a direct reply to this message was found in the Sent folder. */
  replied: boolean;
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
 * One message in a reconstructed conversation. A superset of MailDetail so a
 * ThreadItem can be passed anywhere a MailDetail is expected (e.g. ComposeDialog).
 */
export interface ThreadItem extends MailDetail {
  folder: "inbox" | "sent";
  outgoing: boolean;
  isAnchor: boolean;
}

interface ThreadNode {
  uid: number;
  folder: "inbox" | "sent";
  messageId: string | null;
  inReplyTo: string | null;
  date: string;
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

/**
 * Envelope-only fetch of the most recent `limit` messages in whichever mailbox
 * is currently locked/selected on `client`. Used for thread correlation and the
 * "replied" badge scan — cheap (no bodies), bounded, never fetches full messages.
 */
async function scanRecentEnvelopes(client: ImapFlow, limit: number): Promise<FetchMessageObject[]> {
  const total = client.mailbox && typeof client.mailbox !== "boolean" ? client.mailbox.exists : 0;
  if (total === 0) return [];

  const start = Math.max(1, total - limit + 1);
  const out: FetchMessageObject[] = [];
  for await (const msg of client.fetch(`${start}:${total}`, { envelope: true })) {
    out.push(msg);
  }
  return out;
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

    const items: MailListItem[] = [];
    const messageIdToUid = new Map<string, number>();

    const lock = await client.getMailboxLock("INBOX");
    try {
      const total = client.mailbox && typeof client.mailbox !== "boolean" ? client.mailbox.exists : 0;
      if (total > 0) {
        const start = Math.max(1, total - LIST_LIMIT + 1);

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
            replied: false,
          });
          if (msg.envelope?.messageId) messageIdToUid.set(msg.envelope.messageId, msg.uid);
        }

        items.reverse();
      }
    } finally {
      lock.release();
    }

    // Best-effort "replied" badge: scan Sent for direct replies to the messages
    // above. A failure here must never affect the list itself.
    if (items.length > 0) {
      try {
        const sentPath = await findSentMailbox(client);
        if (sentPath) {
          const sentLock = await client.getMailboxLock(sentPath);
          try {
            const sentMessages = await scanRecentEnvelopes(client, THREAD_SCAN_LIMIT);
            const repliedUids = new Set<number>();
            for (const msg of sentMessages) {
              const inReplyTo = msg.envelope?.inReplyTo;
              if (!inReplyTo) continue;
              const uid = messageIdToUid.get(inReplyTo);
              if (uid !== undefined) repliedUids.add(uid);
            }
            for (const item of items) {
              if (repliedUids.has(item.uid)) item.replied = true;
            }
          } finally {
            sentLock.release();
          }
        }
      } catch {
        // Non-fatal — list still renders, just without the "replied" badge.
      }
    }

    return { data: items, error: null };
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

/**
 * Reconstructs the conversation containing `uid` by correlating Message-ID /
 * In-Reply-To across INBOX and Sent (bounded, envelope-only scan — see
 * THREAD_SCAN_LIMIT), then fetches full bodies only for the resolved members.
 * The originally-requested message is always included and marked `isAnchor`,
 * regardless of whether it falls inside the scan window.
 */
export async function getTitanThread(uid: number): Promise<{
  data: { items: ThreadItem[] } | null;
  error: string | null;
}> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const auth = titanAuth();
  if (!auth) return { data: null, error: "Titan email is not configured" };

  const client = titanClient();
  if (!client) return { data: null, error: "Titan email is not configured" };

  try {
    await client.connect();

    const nodes = new Map<string, ThreadNode>();
    let sentPath: string | null = null;

    function addNode(msg: FetchMessageObject, folder: "inbox" | "sent"): string {
      const key = `${folder}:${msg.uid}`;
      if (!nodes.has(key)) {
        nodes.set(key, {
          uid: msg.uid,
          folder,
          messageId: msg.envelope?.messageId ?? null,
          inReplyTo: msg.envelope?.inReplyTo ?? null,
          date: (msg.envelope?.date ?? new Date()).toISOString(),
        });
      }
      return key;
    }

    // Phase 1 — INBOX: the anchor (unconditionally, regardless of scan window)
    // plus a bounded envelope scan for correlation candidates.
    const inboxLock = await client.getMailboxLock("INBOX");
    let anchorKey: string;
    try {
      const anchorMsg = await client.fetchOne(String(uid), { envelope: true }, { uid: true });
      if (!anchorMsg) return { data: null, error: "Message not found" };
      anchorKey = addNode(anchorMsg, "inbox");

      for (const msg of await scanRecentEnvelopes(client, THREAD_SCAN_LIMIT)) {
        addNode(msg, "inbox");
      }
    } finally {
      inboxLock.release();
    }

    // Phase 2 — Sent, best-effort. A failure here degrades to INBOX-only
    // correlation rather than failing the whole request.
    try {
      sentPath = await findSentMailbox(client);
      if (sentPath) {
        const sentLock = await client.getMailboxLock(sentPath);
        try {
          for (const msg of await scanRecentEnvelopes(client, THREAD_SCAN_LIMIT)) {
            addNode(msg, "sent");
          }
        } finally {
          sentLock.release();
        }
      }
    } catch {
      sentPath = null;
    }

    // Phase 3 — transitive closure over Message-ID / In-Reply-To (pure in-memory).
    const visited = new Set<string>([anchorKey]);
    let changed = true;
    while (changed && visited.size < MAX_THREAD_ITEMS) {
      changed = false;
      for (const [key, node] of nodes) {
        if (visited.has(key)) continue;
        const linksToVisited = [...visited].some((vKey) => {
          const vNode = nodes.get(vKey);
          if (!vNode) return false;
          return (
            (node.inReplyTo && vNode.messageId === node.inReplyTo) ||
            (node.messageId && vNode.inReplyTo === node.messageId)
          );
        });
        if (linksToVisited) {
          visited.add(key);
          changed = true;
        }
      }
    }

    // Phase 4 — fetch full bodies, but only for resolved members.
    const parsedByKey = new Map<string, ParsedMail>();

    const inboxUids = [...visited].map((k) => nodes.get(k)!).filter((n) => n.folder === "inbox");
    if (inboxUids.length > 0) {
      const lock = await client.getMailboxLock("INBOX");
      try {
        for (const node of inboxUids) {
          const parsed = await fetchAndParseTitanMessage(client, node.uid);
          if (parsed) parsedByKey.set(`inbox:${node.uid}`, parsed);
        }
      } finally {
        lock.release();
      }
    }

    const sentUids = [...visited].map((k) => nodes.get(k)!).filter((n) => n.folder === "sent");
    if (sentUids.length > 0 && sentPath) {
      const lock = await client.getMailboxLock(sentPath);
      try {
        for (const node of sentUids) {
          const parsed = await fetchAndParseTitanMessage(client, node.uid);
          if (parsed) parsedByKey.set(`sent:${node.uid}`, parsed);
        }
      } finally {
        lock.release();
      }
    }

    // Phase 5 — assemble ThreadItems for whichever members actually parsed.
    const items: ThreadItem[] = [];
    for (const key of visited) {
      const node = nodes.get(key);
      const parsed = parsedByKey.get(key);
      if (!node || !parsed) continue;

      const from = parsed.from?.value?.[0];
      items.push({
        uid: node.uid,
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
        folder: node.folder,
        outgoing: node.folder === "sent",
        isAnchor: key === anchorKey,
      });
    }

    if (items.length === 0) return { data: null, error: "Message not found" };

    items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return { data: { items }, error: null };
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
