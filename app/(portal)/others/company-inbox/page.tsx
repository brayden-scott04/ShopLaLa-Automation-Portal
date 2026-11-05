"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArchiveRestore,
  CircleCheck,
  Forward,
  Inbox,
  Mail,
  RefreshCw,
  Reply,
  ReplyAll,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { cn } from "@/lib/utils";
import { companyInbox } from "@/lib/nav";
import {
  listTitanEmails,
  getTitanEmail,
  getTitanThread,
  getTitanRepliedUids,
  sendTitanEmail,
  trashTitanEmail,
  restoreTitanEmail,
  listYahooEmails,
  getYahooEmail,
  getYahooThread,
  getYahooRepliedUids,
  sendYahooEmail,
  trashYahooEmail,
  restoreYahooEmail,
  listMailAccounts,
  type MailAccountId,
  type MailAccountOption,
  type MailComposeMode,
  type MailFolder,
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
    trash: typeof trashTitanEmail;
    restore: typeof restoreTitanEmail;
  }
> = {
  titan: {
    list: listTitanEmails,
    message: getTitanEmail,
    thread: getTitanThread,
    replied: getTitanRepliedUids,
    send: sendTitanEmail,
    trash: trashTitanEmail,
    restore: restoreTitanEmail,
  },
  yahoo: {
    list: listYahooEmails,
    message: getYahooEmail,
    thread: getYahooThread,
    replied: getYahooRepliedUids,
    send: sendYahooEmail,
    trash: trashYahooEmail,
    restore: restoreYahooEmail,
  },
};

const FOLDER_OPTIONS: { value: MailFolder; label: string }[] = [
  { value: "inbox", label: "Inbox" },
  { value: "trash", label: "Trash" },
];

/** One list per account + folder. */
const viewKey = (account: MailAccountId, folder: MailFolder) => `${account}:${folder}`;
const threadKey = (account: MailAccountId, folder: MailFolder, uid: number) =>
  `${account}:${folder}:${uid}`;

interface Notice {
  text: string;
  error: boolean;
  /** Set after a successful trash: the message's UID in Trash, for Undo. */
  undo?: { account: MailAccountId; trashUid: number };
}

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
  const [activeFolder, setActiveFolder] = useState<MailFolder>("inbox");

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

  const [isMoving, setIsMoving] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // In-memory caches so switching accounts/folders or re-opening an email is
  // instant; each cached view is still refreshed in the background.
  const listCache = useRef(new Map<string, MailListItem[]>());
  const threadCache = useRef(new Map<string, ThreadItem[]>());
  // Which list / email the latest request is for, so a slow response for
  // something the user has already moved away from is ignored.
  const currentView = useRef(viewKey(activeAccount, activeFolder));
  const currentThreadKey = useRef<string | null>(null);

  const anchor = thread?.find((item) => item.isAnchor) ?? null;
  const activeLabel = accounts.find((a) => a.id === activeAccount)?.label ?? "mailbox";
  const inTrash = activeFolder === "trash";

  useEffect(() => {
    listMailAccounts().then(({ data }) => {
      if (data) setAccounts(data);
    });
  }, []);

  function showNotice(next: Notice) {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    setNotice(next);
    // Leave Undo up a little longer than a plain message.
    noticeTimer.current = setTimeout(() => setNotice(null), next.undo ? 10000 : 6000);
  }

  function loadMessages(account = activeAccount, folder = activeFolder) {
    const key = viewKey(account, folder);
    currentView.current = key;
    const cached = listCache.current.get(key);
    if (cached) {
      setMessages(cached);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
    setIsRefreshing(true);
    setListError(null);

    MAIL_ACTIONS[account].list(folder).then(({ data, error }) => {
      if (currentView.current !== key) return;
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
      listCache.current.set(key, merged);
      setMessages(merged);

      // "Replied" badges only make sense for the inbox, and load separately so
      // the list never waits on the Sent scan.
      if (folder !== "inbox") return;
      MAIL_ACTIONS[account]
        .replied(items.map((m) => ({ uid: m.uid, messageId: m.messageId })))
        .then(({ data: repliedUids }) => {
          const replied = new Set(repliedUids);
          const withBadges = (listCache.current.get(key) ?? []).map((m) => ({
            ...m,
            replied: replied.has(m.uid),
          }));
          listCache.current.set(key, withBadges);
          if (currentView.current === key) setMessages(withBadges);
        });
    });
  }

  // Reload only when the account or folder changes, not on every render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => loadMessages(), [activeAccount, activeFolder]);

  function openMessage(uid: number) {
    const account = activeAccount;
    const folder = activeFolder;
    const key = threadKey(account, folder, uid);
    currentThreadKey.current = key;
    setSelectedUid(uid);
    setDetailError(null);

    const cached = threadCache.current.get(key);
    setThread(cached ?? null);
    setIsDetailLoading(!cached);

    // Trash shows just the email itself: replies to it are still in the inbox
    // and Sent, and it can't be replied to from here anyway.
    if (folder === "trash") {
      setIsThreadLoading(false);
      MAIL_ACTIONS[account].message(uid, "trash").then(({ data, error }) => {
        if (currentThreadKey.current !== key) return;
        setIsDetailLoading(false);
        if (error || !data) {
          if (!cached) setDetailError(error ?? "Failed to load message");
          return;
        }
        const items: ThreadItem[] = [{ ...data, folder: "inbox", outgoing: false, isAnchor: true }];
        threadCache.current.set(key, items);
        setThread(items);
      });
      return;
    }

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

  function clearSelection() {
    currentThreadKey.current = null;
    setSelectedUid(null);
    setThread(null);
    setDetailError(null);
    setIsDetailLoading(false);
    setIsThreadLoading(false);
    setComposeMode(null);
    setSentNotice(null);
  }

  function switchView(account: MailAccountId, folder: MailFolder) {
    setActiveAccount(account);
    setActiveFolder(folder);
    setMessages(listCache.current.get(viewKey(account, folder)) ?? []);
    setListError(null);
    clearSelection();
  }

  function handleAccountChange(id: MailAccountId) {
    if (id === activeAccount) return;
    switchView(id, activeFolder);
    setNotice(null);
  }

  function handleFolderChange(folder: MailFolder) {
    if (folder === activeFolder) return;
    switchView(activeAccount, folder);
  }

  /** Takes a message out of a cached list (and closes it if it's open) after it moved folders. */
  function removeFromView(account: MailAccountId, folder: MailFolder, uid: number) {
    const key = viewKey(account, folder);
    const remaining = (listCache.current.get(key) ?? []).filter((m) => m.uid !== uid);
    listCache.current.set(key, remaining);
    threadCache.current.delete(threadKey(account, folder, uid));
    if (currentView.current !== key) return;
    setMessages(remaining);
    if (currentThreadKey.current === threadKey(account, folder, uid)) clearSelection();
  }

  function handleTrash() {
    if (selectedUid === null) return;
    const account = activeAccount;
    const uid = selectedUid;
    setIsMoving(true);

    MAIL_ACTIONS[account].trash(uid).then(({ data, error }) => {
      setIsMoving(false);
      if (error || !data) {
        if (currentView.current === viewKey(account, "inbox")) {
          showNotice({ text: error ?? "Failed to move to Trash", error: true });
        }
        return;
      }
      removeFromView(account, "inbox", uid);
      // The Trash list is now out of date; it reloads when next opened.
      listCache.current.delete(viewKey(account, "trash"));
      showNotice({
        text: "Moved to Trash.",
        error: false,
        undo: data.trashUid !== null ? { account, trashUid: data.trashUid } : undefined,
      });
    });
  }

  /** Moves a Trash message back to the inbox, from the Trash view's Restore button or Undo. */
  function handleRestore(account: MailAccountId, trashUid: number) {
    setIsMoving(true);
    setNotice(null);

    MAIL_ACTIONS[account].restore(trashUid).then(({ error }) => {
      setIsMoving(false);
      if (error) {
        showNotice({ text: error, error: true });
        return;
      }
      removeFromView(account, "trash", trashUid);
      showNotice({ text: "Restored to Inbox.", error: false });
      // Restored mail gets a new inbox UID, so refetch rather than patching the cache.
      listCache.current.delete(viewKey(account, "inbox"));
      if (currentView.current === viewKey(account, "inbox")) loadMessages(account, "inbox");
    });
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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {accounts.length > 0 && (
              <SegmentedControl
                value={activeAccount}
                onValueChange={handleAccountChange}
                options={accounts.map((a) => ({ value: a.id, label: a.label }))}
              />
            )}
            <SegmentedControl
              value={activeFolder}
              onValueChange={handleFolderChange}
              options={FOLDER_OPTIONS}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadMessages()}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("size-4", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {notice && (
          <div
            className={cn(
              "flex items-center justify-between gap-4 rounded-md border px-4 py-3 text-sm",
              notice.error
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : "border-primary/30 bg-primary/10 text-primary"
            )}
          >
            <span>{notice.text}</span>
            {notice.undo && (
              <Button
                variant="outline"
                size="sm"
                disabled={isMoving}
                onClick={() => handleRestore(notice.undo!.account, notice.undo!.trashUid)}
              >
                Undo
              </Button>
            )}
          </div>
        )}

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
                  {inTrash ? (
                    <Trash2 className="size-8 text-muted-foreground" />
                  ) : (
                    <Inbox className="size-8 text-muted-foreground" />
                  )}
                  <p className="mt-4 text-sm font-medium text-foreground">
                    No messages
                  </p>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Nothing in the {activeLabel} {inTrash ? "Trash" : "inbox"} right now.
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
                          !msg.seen && !inTrash && "font-semibold"
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
                      {inTrash ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isMoving}
                          onClick={() => handleRestore(activeAccount, selectedUid)}
                        >
                          <ArchiveRestore className="size-4" />
                          {isMoving ? "Restoring…" : "Restore to Inbox"}
                        </Button>
                      ) : (
                        <>
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
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isMoving}
                            onClick={handleTrash}
                            title="Move to Trash"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                            {isMoving ? "Moving…" : "Trash"}
                          </Button>
                        </>
                      )}
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

      {!inTrash && (
        <ComposeDialog
          send={MAIL_ACTIONS[activeAccount].send}
          mode={composeMode}
          detail={anchor}
          onClose={() => setComposeMode(null)}
          onSent={handleSent}
        />
      )}
    </>
  );
}
