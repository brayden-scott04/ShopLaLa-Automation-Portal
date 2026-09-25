"use server";

import { randomUUID } from "node:crypto";
import { ImapFlow, type FetchMessageObject, type MessageStructureObject } from "imapflow";
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
// the "replied" badge scan look, in each of INBOX/Sent. Envelope-only, but every
// extra envelope is still transferred on each thread open, so keep it modest.
const THREAD_SCAN_LIMIT = 100;
const MAX_THREAD_ITEMS = 100;

export type MailAccountId = "titan" | "yahoo";

interface MailAccountConfig {
  id: MailAccountId;
  /** Short name for error text — preserves the Titan path's existing exact wording. */
  name: string;
  /** Full email address — shown in the UI account toggle. */
  label: string;
  imapHost: string;
  imapPort: number;
  smtpHost: string;
  smtpPort: number;
  userEnvVar: string;
  passEnvVar: string;
  /**
   * True if this provider's SMTP server itself saves a copy of outgoing mail to
   * Sent (as Yahoo's does, being tied to its own webmail — any authenticated
   * send gets auto-saved server-side, regardless of client). When true, we must
   * NOT also append our own copy, or the same reply ends up duplicated in Sent
   * (and therefore duplicated in the reconstructed thread).
   */
  autoSavesSent: boolean;
}

const MAIL_ACCOUNTS: Record<MailAccountId, MailAccountConfig> = {
  titan: {
    id: "titan",
    name: "Titan",
    label: "info@lalagreen.com",
    imapHost: TITAN_HOST,
    imapPort: TITAN_PORT,
    smtpHost: TITAN_SMTP_HOST,
    smtpPort: TITAN_SMTP_PORT,
    userEnvVar: "TITAN_IMAP_USER",
    passEnvVar: "TITAN_IMAP_PASSWORD",
    autoSavesSent: false,
  },
  yahoo: {
    id: "yahoo",
    name: "Yahoo",
    label: "cs_shoplala@yahoo.com",
    imapHost: "imap.mail.yahoo.com",
    imapPort: 993,
    smtpHost: "smtp.mail.yahoo.com",
    smtpPort: 465,
    userEnvVar: "YAHOO_IMAP_USER",
    passEnvVar: "YAHOO_IMAP_PASSWORD",
    autoSavesSent: true,
  },
};

const MAIL_ACCOUNT_ORDER: MailAccountId[] = ["titan", "yahoo"];

export interface MailListItem {
  uid: number;
  from: string;
  fromAddress: string;
  subject: string;
  date: string;
  seen: boolean;
  /**
   * True if a direct reply to this message was found in the Sent folder. Always
   * false from the list action — filled in afterwards by getTitanRepliedUids /
   * getYahooRepliedUids so the list never waits on the Sent scan.
   */
  replied: boolean;
  messageId: string | null;
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

/** Account-generic auth/client helpers. */
function mailAuthFor(accountId: MailAccountId): { user: string; pass: string } | null {
  const config = MAIL_ACCOUNTS[accountId];
  const user = process.env[config.userEnvVar];
  const pass = process.env[config.passEnvVar];
  if (!user || !pass) return null;
  return { user, pass };
}

function mailClientFor(accountId: MailAccountId): ImapFlow | null {
  const auth = mailAuthFor(accountId);
  if (!auth) return null;

  const config = MAIL_ACCOUNTS[accountId];
  return new ImapFlow({
    host: config.imapHost,
    port: config.imapPort,
    secure: true,
    auth,
    logger: false,
  });
}

// Long-lived IMAP connections, reused across requests instead of a fresh
// connect/login/logout per action. Measured on Yahoo: login ~5 s and each
// switch of the selected mailbox (INBOX <-> Sent) ~1.7 s, versus under 1 s to
// fetch 30 envelopes — so setup, not work, was most of every click. Each
// account therefore keeps TWO connections: one that only ever uses INBOX and
// one that only ever uses Sent, so no request pays for a mailbox switch and
// INBOX/Sent work can run in parallel. Kept on globalThis so dev hot-reloads
// don't strand old connections; imapflow's mailbox locks serialize concurrent
// users of one connection.
type MailRole = "inbox" | "sent";
type PoolKey = `${MailAccountId}:${MailRole}`;

const poolSymbol = Symbol.for("portal.mailClientPool");
const clientPool: Map<PoolKey, Promise<ImapFlow>> =
  ((globalThis as Record<symbol, unknown>)[poolSymbol] as Map<PoolKey, Promise<ImapFlow>>) ??
  ((globalThis as Record<symbol, unknown>)[poolSymbol] = new Map<PoolKey, Promise<ImapFlow>>());

function dropPooled(key: PoolKey, entry: Promise<ImapFlow>) {
  if (clientPool.get(key) === entry) clientPool.delete(key);
}

async function pooledClient(accountId: MailAccountId, role: MailRole): Promise<ImapFlow> {
  const key: PoolKey = `${accountId}:${role}`;
  const existing = clientPool.get(key);
  if (existing) {
    const client = await existing.catch(() => null);
    if (client?.usable) return client;
    dropPooled(key, existing);
  }

  const client = mailClientFor(accountId);
  if (!client) throw new Error(`${MAIL_ACCOUNTS[accountId].name} email is not configured`);

  const entry = client.connect().then(() => client);
  clientPool.set(key, entry);
  // Without an 'error' listener a dropped socket would crash the server process.
  client.on("error", () => dropPooled(key, entry));
  client.on("close", () => dropPooled(key, entry));
  entry.catch(() => dropPooled(key, entry));
  return entry;
}

/**
 * Runs `fn` on the account's pooled connection for `role` ("inbox" for INBOX
 * work, "sent" for anything touching the Sent folder). If the connection turns
 * out to have died (server idle timeout, a frozen serverless instance),
 * reconnects and retries once — so only pass read-only or idempotent work,
 * never an SMTP send.
 */
async function withMailClient<T>(
  accountId: MailAccountId,
  role: MailRole,
  fn: (client: ImapFlow) => Promise<T>
): Promise<T> {
  const client = await pooledClient(accountId, role);
  try {
    return await fn(client);
  } catch (err) {
    if (client.usable) throw err;
    return fn(await pooledClient(accountId, role));
  }
}

/** The parts of a message every consumer reads — see fetchMessages. */
interface LoadedMessage {
  from: MailAddress | null;
  to: MailAddress[];
  cc: MailAddress[];
  subject: string;
  date: Date | null;
  messageId: string | null;
  inReplyTo: string | null;
  references: string[];
  text: string;
}

const CRLF = Buffer.from("\r\n");

/** The body part to render: the first inline text/plain part, else the first inline text/html. */
function findTextPart(root: MessageStructureObject): MessageStructureObject | null {
  const candidates: MessageStructureObject[] = [];
  const walk = (node: MessageStructureObject) => {
    if (node.childNodes?.length) {
      node.childNodes.forEach(walk);
      return;
    }
    if (node.disposition === "attachment") return;
    if (node.type === "text/plain" || node.type === "text/html") candidates.push(node);
  };
  walk(root);
  return (
    candidates.find((n) => n.type === "text/plain") ??
    candidates.find((n) => n.type === "text/html") ??
    null
  );
}

/**
 * Loads messages by UID from the currently locked mailbox WITHOUT downloading
 * attachments: one batched fetch for headers + BODYSTRUCTURE, then only each
 * message's text part (plus that part's MIME headers, so mailparser can still
 * handle charset / transfer-encoding / HTML-to-text exactly as before).
 * Single-part messages have no attachments to skip, so those fetch their
 * (small) full source when they're text, or just headers otherwise.
 */
async function fetchMessages(client: ImapFlow, uids: number[]): Promise<Map<number, LoadedMessage>> {
  const out = new Map<number, LoadedMessage>();
  if (uids.length === 0) return out;

  const metas: { uid: number; headers: Buffer; part: string | null; wholeSource: boolean }[] = [];
  for await (const msg of client.fetch(
    uids.join(","),
    { uid: true, headers: true, bodyStructure: true },
    { uid: true }
  )) {
    const root = msg.bodyStructure;
    const singlePart = !!root && !root.childNodes?.length;
    metas.push({
      uid: msg.uid,
      headers: msg.headers ?? Buffer.alloc(0),
      part: root && !singlePart ? (findTextPart(root)?.part ?? null) : null,
      wholeSource: singlePart && root.type.startsWith("text/"),
    });
  }

  // Body entities to hand to mailparser, keyed by UID. Messages sharing a part
  // number (usually "1" or "1.1") are fetched together in one round trip.
  const bodies = new Map<number, Buffer>();
  const byPart = new Map<string, number[]>();
  const sourceUids: number[] = [];
  for (const m of metas) {
    if (m.wholeSource) sourceUids.push(m.uid);
    else if (m.part) byPart.set(m.part, [...(byPart.get(m.part) ?? []), m.uid]);
  }

  for (const [part, group] of byPart) {
    try {
      for await (const msg of client.fetch(
        group.join(","),
        { uid: true, bodyParts: [`${part}.mime`, part] },
        { uid: true }
      )) {
        const mime = msg.bodyParts?.get(`${part}.mime`);
        const body = msg.bodyParts?.get(part);
        if (mime && body) {
          // BODY[n.MIME] normally ends with the header/body blank line already.
          const sep = mime.subarray(-4).toString() === "\r\n\r\n" ? Buffer.alloc(0) : CRLF;
          bodies.set(msg.uid, Buffer.concat([mime, sep, body]));
        }
      }
    } catch {
      // Server rejected the part fetch — the fallback below covers these UIDs.
    }
    // Anything the part fetch didn't return falls back to the full source, so
    // the worst case is the old (slower) behaviour, never a missing body.
    for (const uid of group) if (!bodies.has(uid)) sourceUids.push(uid);
  }

  if (sourceUids.length > 0) {
    for await (const msg of client.fetch(sourceUids.join(","), { uid: true, source: true }, { uid: true })) {
      if (msg.source) bodies.set(msg.uid, msg.source);
    }
  }

  for (const m of metas) {
    const head = await simpleParser(Buffer.concat([m.headers, CRLF]));
    const body = bodies.get(m.uid);
    let text = "";
    if (body) {
      const parsedBody = await simpleParser(body);
      // A lone HTML part gets mailparser's own HTML-to-text (which keeps link
      // URLs etc.); use the same converter a full-message parse falls back to,
      // so the text matches what the inbox showed before.
      text =
        !sourceUids.includes(m.uid) && typeof parsedBody.html === "string"
          ? htmlToPlainText(parsedBody.html)
          : extractText(parsedBody);
    }
    const from = head.from?.value?.[0];
    out.set(m.uid, {
      from: from?.address ? { name: from.name || from.address, address: from.address } : null,
      to: flattenAddresses(head.to),
      cc: flattenAddresses(head.cc),
      subject: head.subject || "(no subject)",
      date: head.date ?? null,
      messageId: head.messageId ?? null,
      inReplyTo: head.inReplyTo ?? null,
      references: referencesOf(head),
      text,
    });
  }

  return out;
}

// A message's content never changes for a given UID, so loaded messages are
// kept (bounded) — opening an email and then its conversation, or re-opening
// it later, doesn't download the same body twice.
const MESSAGE_CACHE_MAX = 500;
const messageCache = new Map<string, LoadedMessage>();

/** fetchMessages, reusing already-loaded messages; call while holding that folder's lock. */
async function cachedFetchMessages(
  client: ImapFlow,
  accountId: MailAccountId,
  role: MailRole,
  uids: number[]
): Promise<Map<number, LoadedMessage>> {
  const out = new Map<number, LoadedMessage>();
  const missing: number[] = [];
  for (const uid of uids) {
    const hit = messageCache.get(`${accountId}:${role}:${uid}`);
    if (hit) out.set(uid, hit);
    else missing.push(uid);
  }
  for (const [uid, msg] of await fetchMessages(client, missing)) {
    out.set(uid, msg);
    messageCache.set(`${accountId}:${role}:${uid}`, msg);
  }
  // Evict oldest entries (Map keeps insertion order).
  for (const key of messageCache.keys()) {
    if (messageCache.size <= MESSAGE_CACHE_MAX) break;
    messageCache.delete(key);
  }
  return out;
}

function toMailDetail(uid: number, msg: LoadedMessage): MailDetail {
  return {
    uid,
    from: msg.from?.name || msg.from?.address || "Unknown",
    fromAddress: msg.from?.address ?? "",
    to: msg.to,
    cc: msg.cc,
    subject: msg.subject,
    date: (msg.date ?? new Date()).toISOString(),
    text: msg.text,
    messageId: msg.messageId,
    inReplyTo: msg.inReplyTo,
    references: msg.references,
  };
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

// The Sent folder's path never changes in practice, so remember it per account
// for the life of the server instance instead of LISTing every mailbox per call.
const sentPathCache = new Map<MailAccountId, string>();

// Recent-envelope scans (the thread correlation window and the "replied"
// badge) are the slowest part of opening an email, and barely change between
// clicks, so they're cached briefly per account + folder. A list refresh drops
// the INBOX scan and sending a reply drops the Sent scan, so new mail and just-
// sent replies still show up.
const SCAN_TTL_MS = 2 * 60 * 1000;
const scanCache = new Map<`${MailAccountId}:${MailRole}`, { at: number; msgs: FetchMessageObject[] }>();

/** scanRecentEnvelopes with the cache above; call while holding that folder's lock. */
async function cachedRecentEnvelopes(
  client: ImapFlow,
  accountId: MailAccountId,
  role: MailRole
): Promise<FetchMessageObject[]> {
  const key = `${accountId}:${role}` as const;
  const hit = scanCache.get(key);
  if (hit && Date.now() - hit.at < SCAN_TTL_MS) return hit.msgs;
  const msgs = await scanRecentEnvelopes(client, THREAD_SCAN_LIMIT);
  scanCache.set(key, { at: Date.now(), msgs });
  return msgs;
}

async function findSentMailbox(client: ImapFlow, accountId: MailAccountId): Promise<string | null> {
  const cached = sentPathCache.get(accountId);
  if (cached) return cached;

  const mailboxes = await client.list();
  const bySpecialUse = mailboxes.find((mb) => mb.specialUse === "\\Sent");
  const byName = mailboxes.find((mb) => /^sent( items| mail)?$/i.test(mb.name));
  const path = bySpecialUse?.path ?? byName?.path ?? null;
  if (path) sentPathCache.set(accountId, path);
  return path;
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

/**
 * imapflow reports a rejected login as a bare "Command failed"; say which
 * credentials to check instead.
 */
function connectionErrorMessage(err: unknown, accountId: MailAccountId): string {
  const config = MAIL_ACCOUNTS[accountId];
  if ((err as { authenticationFailed?: boolean })?.authenticationFailed) {
    return `${config.name} login failed — check ${config.userEnvVar} / ${config.passEnvVar} (for Yahoo, use an app password).`;
  }
  return err instanceof Error ? err.message : `Failed to connect to ${config.name} mailbox`;
}

async function listMailEmailsImpl(accountId: MailAccountId): Promise<{
  data: MailListItem[] | null;
  error: string | null;
}> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const config = MAIL_ACCOUNTS[accountId];
  if (!mailAuthFor(accountId)) return { data: null, error: `${config.name} email is not configured` };

  // A (re)loaded list means "show me what's new" — drop the cached INBOX scan.
  scanCache.delete(`${accountId}:inbox`);
  // Log in the Sent connection in the background now, so the "replied" badge
  // scan that follows doesn't pay for a second ~5 s login on its own.
  pooledClient(accountId, "sent").catch(() => {});

  try {
    return await withMailClient(accountId, "inbox", async (client) => {
      const items: MailListItem[] = [];
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
              messageId: msg.envelope?.messageId ?? null,
            });
          }

          // Don't rely on the server returning FETCH results in ascending sequence
          // order — IMAP doesn't guarantee that, and some servers (Yahoo observed)
          // don't reliably honor it. Sort explicitly by date, newest first.
          items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
      } finally {
        lock.release();
      }

      return { data: items, error: null };
    });
  } catch (err) {
    return { data: null, error: connectionErrorMessage(err, accountId) };
  }
}

export async function listTitanEmails() {
  return listMailEmailsImpl("titan");
}

export async function listYahooEmails() {
  return listMailEmailsImpl("yahoo");
}

/**
 * Best-effort "replied" badge, split out of the list so the list renders
 * without waiting on the Sent scan: returns the UIDs (from `items`) that have a
 * direct reply among the most recent Sent messages. Never errors — a failure
 * just means no badges.
 */
async function getRepliedUidsImpl(
  accountId: MailAccountId,
  items: { uid: number; messageId: string | null }[]
): Promise<{ data: number[]; error: string | null }> {
  const session = await getSession();
  if (!session) return { data: [], error: "Unauthorized" };

  const messageIdToUid = new Map<string, number>();
  for (const item of items) if (item.messageId) messageIdToUid.set(item.messageId, item.uid);
  if (messageIdToUid.size === 0) return { data: [], error: null };

  if (!mailAuthFor(accountId)) return { data: [], error: null };

  try {
    return await withMailClient(accountId, "sent", async (client) => {
      const sentPath = await findSentMailbox(client, accountId);
      if (!sentPath) return { data: [], error: null };

      const repliedUids = new Set<number>();
      const lock = await client.getMailboxLock(sentPath);
      try {
        for (const msg of await cachedRecentEnvelopes(client, accountId, "sent")) {
          const inReplyTo = msg.envelope?.inReplyTo;
          const uid = inReplyTo ? messageIdToUid.get(inReplyTo) : undefined;
          if (uid !== undefined) repliedUids.add(uid);
        }
      } finally {
        lock.release();
      }
      return { data: [...repliedUids], error: null };
    });
  } catch {
    return { data: [], error: null };
  }
}

export async function getTitanRepliedUids(items: { uid: number; messageId: string | null }[]) {
  return getRepliedUidsImpl("titan", items);
}

export async function getYahooRepliedUids(items: { uid: number; messageId: string | null }[]) {
  return getRepliedUidsImpl("yahoo", items);
}

/**
 * A single INBOX message — the fast path for opening an email: the page shows
 * this immediately while the full conversation (getMailThreadImpl) loads.
 */
async function getMailMessageImpl(accountId: MailAccountId, uid: number): Promise<{
  data: MailDetail | null;
  error: string | null;
}> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const config = MAIL_ACCOUNTS[accountId];
  if (!mailAuthFor(accountId)) return { data: null, error: `${config.name} email is not configured` };

  try {
    return await withMailClient(accountId, "inbox", async (client) => {
      const lock = await client.getMailboxLock("INBOX");
      let message: LoadedMessage | undefined;
      try {
        message = (await cachedFetchMessages(client, accountId, "inbox", [uid])).get(uid);
      } finally {
        lock.release();
      }
      if (!message) return { data: null, error: "Message not found" };

      return { data: toMailDetail(uid, message), error: null };
    });
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Failed to load message",
    };
  }
}

export async function getTitanEmail(uid: number) {
  return getMailMessageImpl("titan", uid);
}

export async function getYahooEmail(uid: number) {
  return getMailMessageImpl("yahoo", uid);
}

/**
 * Reconstructs the conversation containing `uid` by correlating Message-ID /
 * In-Reply-To across INBOX and Sent (bounded, envelope-only scan — see
 * THREAD_SCAN_LIMIT), then fetches full bodies only for the resolved members.
 * The originally-requested message is always included and marked `isAnchor`,
 * regardless of whether it falls inside the scan window.
 */
async function getMailThreadImpl(accountId: MailAccountId, uid: number): Promise<{
  data: { items: ThreadItem[] } | null;
  error: string | null;
}> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const config = MAIL_ACCOUNTS[accountId];
  if (!mailAuthFor(accountId)) return { data: null, error: `${config.name} email is not configured` };

  try {
    const nodes = new Map<string, ThreadNode>();

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

    // Phases 1 + 2 run in parallel on the INBOX and Sent connections.
    // Phase 1 — INBOX: the anchor (unconditionally, regardless of scan window)
    // plus a bounded envelope scan for correlation candidates.
    const inboxScan = withMailClient(accountId, "inbox", async (client) => {
      const lock = await client.getMailboxLock("INBOX");
      try {
        const anchor = await client.fetchOne(String(uid), { envelope: true }, { uid: true });
        return { anchor: anchor || null, recent: await cachedRecentEnvelopes(client, accountId, "inbox") };
      } finally {
        lock.release();
      }
    });
    // Phase 2 — Sent, best-effort. A failure here degrades to INBOX-only
    // correlation rather than failing the whole request.
    const sentScan = withMailClient(accountId, "sent", async (client) => {
      const path = await findSentMailbox(client, accountId);
      if (!path) return { path: null, recent: [] as FetchMessageObject[] };
      const lock = await client.getMailboxLock(path);
      try {
        return { path, recent: await cachedRecentEnvelopes(client, accountId, "sent") };
      } finally {
        lock.release();
      }
    }).catch(() => ({ path: null, recent: [] as FetchMessageObject[] }));

    const [inbox, sent] = await Promise.all([inboxScan, sentScan]);
    if (!inbox.anchor) return { data: null, error: "Message not found" };
    const anchorKey = addNode(inbox.anchor, "inbox");
    for (const msg of inbox.recent) addNode(msg, "inbox");
    for (const msg of sent.recent) addNode(msg, "sent");
    const sentPath = sent.path;

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

    // Phase 4 — fetch bodies (text part only), only for resolved members, with
    // the INBOX and Sent batches running in parallel.
    const members = [...visited].map((k) => nodes.get(k)!);
    const inboxUids = members.filter((n) => n.folder === "inbox").map((n) => n.uid);
    const sentUids = members.filter((n) => n.folder === "sent").map((n) => n.uid);

    const [inboxLoaded, sentLoaded] = await Promise.all([
      inboxUids.length === 0
        ? new Map<number, LoadedMessage>()
        : withMailClient(accountId, "inbox", async (client) => {
            const lock = await client.getMailboxLock("INBOX");
            try {
              return await cachedFetchMessages(client, accountId, "inbox", inboxUids);
            } finally {
              lock.release();
            }
          }),
      sentUids.length === 0 || !sentPath
        ? new Map<number, LoadedMessage>()
        : withMailClient(accountId, "sent", async (client) => {
            const lock = await client.getMailboxLock(sentPath);
            try {
              return await cachedFetchMessages(client, accountId, "sent", sentUids);
            } finally {
              lock.release();
            }
          }),
    ]);

    // Phase 5 — assemble ThreadItems for whichever members actually loaded.
    const items: ThreadItem[] = [];
    for (const key of visited) {
      const node = nodes.get(key);
      const loaded = node && (node.folder === "inbox" ? inboxLoaded : sentLoaded).get(node.uid);
      if (!node || !loaded) continue;

      items.push({
        ...toMailDetail(node.uid, loaded),
        folder: node.folder,
        outgoing: node.folder === "sent",
        isAnchor: key === anchorKey,
      });
    }

    if (items.length === 0) return { data: null, error: "Message not found" };

    items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return { data: { items }, error: null };
  } catch (err) {
    return { data: null, error: connectionErrorMessage(err, accountId) };
  }
}

export async function getTitanThread(uid: number) {
  return getMailThreadImpl("titan", uid);
}

export async function getYahooThread(uid: number) {
  return getMailThreadImpl("yahoo", uid);
}

async function sendMailReplyImpl(accountId: MailAccountId, input: SendMailInput): Promise<{
  data: { ok: true; savedToSent: boolean } | null;
  error: string | null;
  warning: string | null;
}> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized", warning: null };

  const config = MAIL_ACCOUNTS[accountId];
  const auth = mailAuthFor(accountId);
  if (!auth) return { data: null, error: `${config.name} email is not configured`, warning: null };

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

  try {
    const original = await withMailClient(accountId, "inbox", async (client) => {
      const lock = await client.getMailboxLock("INBOX");
      try {
        return (await fetchMessages(client, [input.uid])).get(input.uid);
      } finally {
        lock.release();
      }
    });
    if (!original) return { data: null, error: "Original message not found", warning: null };

    const originalFrom = original.from;
    const originalSubject = original.subject;
    const originalDate = original.date ? original.date.toLocaleString() : "";
    const originalFromLabel = originalFrom
      ? `${originalFrom.name || originalFrom.address} <${originalFrom.address}>`
      : "Unknown sender";
    const originalText = original.text;

    let to: string[];
    let cc: string[];
    if (input.mode === "forward") {
      to = forwardTo;
      cc = forwardCc;
    } else if (input.mode === "reply") {
      to = originalFrom?.address ? dedupeAddresses([originalFrom.address], auth.user) : [];
      cc = [];
    } else {
      const originalTo = original.to.map((a) => a.address);
      const originalCc = original.cc.map((a) => a.address);
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
            `To: ${original.to.map((a) => `${a.name} <${a.address}>`).join(", ")}`,
            "",
            originalText,
          ].join("\n")
        : [`On ${originalDate}, ${originalFromLabel} wrote:`, ...originalText.split("\n").map((l) => `> ${l}`)].join(
            "\n"
          );

    const text = `${body}\n\n${quoted}`;
    const messageIdDomain = auth.user.split("@")[1] || "lalagreen.com";
    const messageId = `<${randomUUID()}@${messageIdDomain}>`;

    // Forwards start a new thread by convention — no In-Reply-To/References.
    // Never fabricate a Message-ID when the original lacks one.
    const threading =
      input.mode !== "forward" && original.messageId
        ? { inReplyTo: original.messageId, references: [...original.references, original.messageId] }
        : { inReplyTo: undefined, references: undefined };

    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
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

    // The reply now lives in Sent (ours or the provider's auto-saved copy), so
    // the cached Sent scan is stale — drop it so the thread shows the reply.
    scanCache.delete(`${accountId}:sent`);

    // Best-effort — the send already succeeded, so a failure here is a
    // warning, not an error: the message went out regardless. Skipped
    // entirely for providers that already auto-save a Sent copy themselves
    // (see autoSavesSent) — appending our own copy on top of that would
    // duplicate the message in Sent and therefore in the reconstructed thread.
    let savedToSent = config.autoSavesSent;
    let warning: string | null = null;
    if (!config.autoSavesSent) {
      try {
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
        const sentPath = await withMailClient(accountId, "sent", async (client) => {
          const path = await findSentMailbox(client, accountId);
          if (path) await client.append(path, raw, ["\\Seen"]);
          return path;
        });
        if (sentPath) savedToSent = true;
        else warning = "Message sent, but no Sent folder was found to save a copy in";
      } catch {
        warning = "Message sent, but saving a copy to Sent failed";
      }
    }

    return { data: { ok: true, savedToSent }, error: null, warning };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Failed to send message",
      warning: null,
    };
  }
}

export async function sendTitanEmail(input: SendMailInput) {
  return sendMailReplyImpl("titan", input);
}

export async function sendYahooEmail(input: SendMailInput) {
  return sendMailReplyImpl("yahoo", input);
}

export interface MailAccountOption {
  id: MailAccountId;
  label: string;
}

export async function listMailAccounts(): Promise<{
  data: MailAccountOption[] | null;
  error: string | null;
}> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  return {
    data: MAIL_ACCOUNT_ORDER.map((id) => ({ id, label: MAIL_ACCOUNTS[id].label })),
    error: null,
  };
}
