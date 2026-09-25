"use client";

import { useEffect, useRef, useState } from "react";
import { CircleCheck, Forward, Inbox, Mail, RefreshCw, Reply, ReplyAll } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { cn } from "@/lib/utils";
import { companyInbox } from "@/lib/communications";
import {
  listTitanEmails,
  getTitanEmail,
  getTitanThread,
  getTitanRepliedUids,
  sendTitanEmail,
  listYahooEmails,
  getYahooEmail,
  getYahooThread,
  getYahooRepliedUids,
  sendYahooEmail,
  listMailAccounts,
  type MailAccountId,
  type MailAccountOption,
  type MailComposeMode,
  type MailListItem,
  type ThreadItem,
} from "@/lib/actions/mail";
import { ComposeDialog } from "./compose-dialog";
import { ThreadView } from "./thread-view";

const MAIL_ACTIONS: Record<
  MailAccountId,
  {
    list: typeof listTitanEmails;
    message: typeof getTitanEmail;
    thread: typeof getTitanThread;
    replied: typeof getTitanRepliedUids;
    send: typeof sendTitanEmail;
  }
> = {
  titan: {
    list: listTitanEmails,
    message: getTitanEmail,
    thread: getTitanThread,
    replied: getTitanRepliedUids,
    send: sendTitanEmail,
  },
  yahoo: {
    list: listYahooEmails,
    message: getYahooEmail,
    thread: getYahooThread,
    replied: getYahooRepliedUids,
    send: sendYahooEmail,
  },
};

const threadKey = (account: MailAccountId, uid: number) => `${account}:${uid}`;

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  return sameDay
    ? date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function CompanyInboxPage() {
  const [accounts, setAccounts] = useState<MailAccountOption[]>([]);
  const [activeAccount, setActiveAccount] = useState<MailAccountId>("titan");

  const [messages, setMessages] = useState<MailListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  const [selectedUid, setSelectedUid] = useState<number | null>(null);
  const [thread, setThread] = useState<ThreadItem[] | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isThreadLoading, setIsThreadLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [composeMode, setComposeMode] = useState<MailComposeMode | null>(null);
  const [sentNotice, setSentNotice] = useState<string | null>(null);

  // In-memory caches so switching accounts or re-opening an email is instant;
  // each cached view is still refreshed in the background.
  const listCache = useRef(new Map<MailAccountId, MailListItem[]>());
  const threadCache = useRef(new Map<string, ThreadItem[]>());
  // Which account / email the latest request is for, so a slow response for
  // something the user has already moved away from is ignored.
  const currentAccount = useRef(activeAccount);
  const currentThreadKey = useRef<string | null>(null);

  const anchor = thread?.find((item) => item.isAnchor) ?? null;
  const activeLabel = accounts.find((a) => a.id === activeAccount)?.label ?? "mailbox";

  useEffect(() => {
    listMailAccounts().then(({ data }) => {
      if (data) setAccounts(data);
    });
  }, []);

  function loadMessages() {
    const account = activeAccount;
    currentAccount.current = account;
    const cached = listCache.current.get(account);
    if (cached) {
      setMessages(cached);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
    setIsRefreshing(true);
    setListError(null);

    MAIL_ACTIONS[account].list().then(({ data, error }) => {
      if (currentAccount.current !== account) return;
      setIsLoading(false);
      setIsRefreshing(false);
      if (error) {
        if (!cached) setListError(error);
        return;
      }
      const items = data ?? [];
      // Keep the replied badges we already know about until the fresh scan lands.
      const knownReplied = new Set((cached ?? []).filter((m) => m.replied).map((m) => m.uid));
      const merged = items.map((m) => (knownReplied.has(m.uid) ? { ...m, replied: true } : m));
      listCache.current.set(account, merged);
      setMessages(merged);

      // "Replied" badges load separately so the list never waits on the Sent scan.
      MAIL_ACTIONS[account]
        .replied(items.map((m) => ({ uid: m.uid, messageId: m.messageId })))
        .then(({ data: repliedUids }) => {
          const replied = new Set(repliedUids);
          const withBadges = (listCache.current.get(account) ?? []).map((m) => ({
            ...m,
            replied: replied.has(m.uid),
          }));
          listCache.current.set(account, withBadges);
          if (currentAccount.current === account) setMessages(withBadges);
        });
    });
  }

  useEffect(loadMessages, [activeAccount]);

  function openMessage(uid: number) {
    const account = activeAccount;
    const key = threadKey(account, uid);
    currentThreadKey.current = key;
    setSelectedUid(uid);
    setDetailError(null);

    const cached = threadCache.current.get(key);
    setThread(cached ?? null);
    setIsDetailLoading(!cached);
    setIsThreadLoading(true);

    // Fast path: the clicked email alone, shown as soon as it arrives.
    let shown = !!cached;
    let threadDone = false;
    if (!cached) {
      MAIL_ACTIONS[account].message(uid).then(({ data }) => {
        if (currentThreadKey.current !== key || !data || threadDone) return;
        shown = true;
        setThread([{ ...data, folder: "inbox", outgoing: false, isAnchor: true }]);
        setDetailError(null);
        setIsDetailLoading(false);
      });
    }

    // Full conversation — replaces the single email when it's ready.
    MAIL_ACTIONS[account].thread(uid).then(({ data, error }) => {
      if (currentThreadKey.current !== key) return;
      setIsThreadLoading(false);
      if (error || !data) {
        // Keep showing the single email (or the cached thread) if we have one.
        if (!shown) {
          setDetailError(error ?? "Failed to load message");
          setIsDetailLoading(false);
        }
        return;
      }
      threadDone = true;
      setIsDetailLoading(false);
      threadCache.current.set(key, data.items);
      setThread(data.items);
      setDetailError(null);
    });
  }

  function handleAccountChange(id: MailAccountId) {
    if (id === activeAccount) return;
    setActiveAccount(id);
    setMessages(listCache.current.get(id) ?? []);
    setListError(null);
    currentThreadKey.current = null;
    setSelectedUid(null);
    setThread(null);
    setDetailError(null);
    setIsDetailLoading(false);
    setIsThreadLoading(false);
    setComposeMode(null);
    setSentNotice(null);
  }

  function handleSent({ warning }: { savedToSent: boolean; warning: string | null }) {
    setSentNotice(warning ?? "Message sent.");
    setTimeout(() => setSentNotice(null), 6000);
    // Pull the just-appended Sent copy into the thread and refresh the list's
    // "replied" badge, instead of waiting for a manual Refresh click.
    if (selectedUid !== null) openMessage(selectedUid);
    loadMessages();
  }

  return (
    <>
      <PageHeader
        icon={companyInbox.icon}
        title={companyInbox.name}
        description={companyInbox.description}
      />

      <div className="flex flex-col gap-4 p-6 md:p-8">
        <div className="flex items-center justify-between gap-4">
          {accounts.length > 0 && (
            <SegmentedControl
              value={activeAccount}
              onValueChange={handleAccountChange}
              options={accounts.map((a) => ({ value: a.id, label: a.label }))}
            />
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={loadMessages}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("size-4", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {listError && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {listError}
          </div>
        )}

        {!listError && (
          <div className="grid gap-4 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
            <div className="rounded-lg border border-border">
              {isLoading ? (
                <div className="flex flex-col gap-3 p-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <Inbox className="size-8 text-muted-foreground" />
                  <p className="mt-4 text-sm font-medium text-foreground">
                    No messages
                  </p>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Nothing in the {activeLabel} inbox right now.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {messages.map((msg) => (
                    <li key={msg.uid}>
                      <button
                        type="button"
                        onClick={() => openMessage(msg.uid)}
                        className={cn(
                          "flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                          selectedUid === msg.uid && "bg-muted",
                          !msg.seen && "font-semibold"
                        )}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm text-foreground">
                            {msg.from}
                          </span>
                          <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                            {msg.replied && (
                              <span title="Replied">
                                <CircleCheck className="size-3.5 text-primary" />
                              </span>
                            )}
                            {formatDate(msg.date)}
                          </span>
                        </span>
                        <span className="truncate text-sm text-muted-foreground">
                          {msg.subject}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="min-w-0 overflow-hidden rounded-lg border border-border p-6">
              {!selectedUid ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                  <Mail className="size-8" />
                  <p className="mt-4 text-sm">Select a message to read it</p>
                </div>
              ) : isDetailLoading ? (
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="mt-4 h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : detailError ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {detailError}
                </div>
              ) : anchor && thread ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-base font-semibold break-words text-foreground">
                        {anchor.subject}
                      </h2>
                      <p className="mt-1 text-sm break-words text-muted-foreground">
                        {anchor.from}
                        {anchor.fromAddress && ` <${anchor.fromAddress}>`}
                        {" · "}
                        {new Date(anchor.date).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!anchor.fromAddress}
                        onClick={() => setComposeMode("reply")}
                      >
                        <Reply className="size-4" />
                        Reply
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!anchor.fromAddress}
                        onClick={() => setComposeMode("replyAll")}
                      >
                        <ReplyAll className="size-4" />
                        Reply All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setComposeMode("forward")}
                      >
                        <Forward className="size-4" />
                        Forward
                      </Button>
                    </div>
                  </div>

                  {sentNotice && (
                    <div className="rounded-md border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
                      {sentNotice}
                    </div>
                  )}

                  <ThreadView items={thread} anchorUid={selectedUid} />
                  {isThreadLoading && (
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <RefreshCw className="size-3 animate-spin" />
                      Loading conversation…
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <ComposeDialog
        send={MAIL_ACTIONS[activeAccount].send}
        mode={composeMode}
        detail={anchor}
        onClose={() => setComposeMode(null)}
        onSent={handleSent}
      />
    </>
  );
}
