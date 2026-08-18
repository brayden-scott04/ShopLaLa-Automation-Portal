"use client";

import { useEffect, useState } from "react";
import { CircleCheck, Forward, Inbox, Mail, RefreshCw, Reply, ReplyAll } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { cn } from "@/lib/utils";
import { companyInbox } from "@/lib/communications";
import {
  listTitanEmails,
  getTitanThread,
  sendTitanEmail,
  listYahooEmails,
  getYahooThread,
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
    thread: typeof getTitanThread;
    send: typeof sendTitanEmail;
  }
> = {
  titan: { list: listTitanEmails, thread: getTitanThread, send: sendTitanEmail },
  yahoo: { list: listYahooEmails, thread: getYahooThread, send: sendYahooEmail },
};

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
  const [listError, setListError] = useState<string | null>(null);

  const [selectedUid, setSelectedUid] = useState<number | null>(null);
  const [thread, setThread] = useState<ThreadItem[] | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [composeMode, setComposeMode] = useState<MailComposeMode | null>(null);
  const [sentNotice, setSentNotice] = useState<string | null>(null);

  const anchor = thread?.find((item) => item.isAnchor) ?? null;
  const activeLabel = accounts.find((a) => a.id === activeAccount)?.label ?? "mailbox";

  useEffect(() => {
    listMailAccounts().then(({ data }) => {
      if (data) setAccounts(data);
    });
  }, []);

  function loadMessages() {
    setIsLoading(true);
    setListError(null);
    MAIL_ACTIONS[activeAccount].list().then(({ data, error }) => {
      if (error) setListError(error);
      else setMessages(data ?? []);
      setIsLoading(false);
    });
  }

  useEffect(loadMessages, [activeAccount]);

  function openMessage(uid: number) {
    setSelectedUid(uid);
    setThread(null);
    setDetailError(null);
    setIsDetailLoading(true);
    MAIL_ACTIONS[activeAccount].thread(uid).then(({ data, error }) => {
      if (error) setDetailError(error);
      else setThread(data?.items ?? null);
      setIsDetailLoading(false);
    });
  }

  function handleAccountChange(id: MailAccountId) {
    if (id === activeAccount) return;
    setActiveAccount(id);
    setMessages([]);
    setListError(null);
    setSelectedUid(null);
    setThread(null);
    setDetailError(null);
    setIsDetailLoading(false);
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
            disabled={isLoading}
          >
            <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {listError && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {listError}
          </div>
        )}

        {!listError && (
          <div className="grid gap-4 md:grid-cols-[minmax(0,320px)_1fr]">
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

            <div className="rounded-lg border border-border p-6">
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
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-base font-semibold text-foreground">
                        {anchor.subject}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
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
