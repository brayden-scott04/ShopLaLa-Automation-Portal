"use client";

import { useEffect, useState } from "react";
import { Inbox, Mail, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { companyInbox } from "@/lib/communications";
import {
  listTitanEmails,
  getTitanEmail,
  type MailListItem,
  type MailDetail,
} from "@/lib/actions/mail";

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  return sameDay
    ? date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function CompanyInboxPage() {
  const [messages, setMessages] = useState<MailListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [selectedUid, setSelectedUid] = useState<number | null>(null);
  const [detail, setDetail] = useState<MailDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  function loadMessages() {
    setIsLoading(true);
    setListError(null);
    listTitanEmails().then(({ data, error }) => {
      if (error) setListError(error);
      else setMessages(data ?? []);
      setIsLoading(false);
    });
  }

  useEffect(loadMessages, []);

  function openMessage(uid: number) {
    setSelectedUid(uid);
    setDetail(null);
    setDetailError(null);
    setIsDetailLoading(true);
    getTitanEmail(uid).then(({ data, error }) => {
      if (error) setDetailError(error);
      else setDetail(data);
      setIsDetailLoading(false);
    });
  }

  return (
    <>
      <PageHeader
        icon={companyInbox.icon}
        title={companyInbox.name}
        description={companyInbox.description}
      />

      <div className="flex flex-col gap-4 p-6 md:p-8">
        <div className="flex items-center justify-end">
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
                    Nothing in the Titan inbox right now.
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
                          <span className="shrink-0 text-xs text-muted-foreground">
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
              ) : detail ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">
                      {detail.subject}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {detail.from}
                      {detail.fromAddress && ` <${detail.fromAddress}>`}
                      {" · "}
                      {new Date(detail.date).toLocaleString()}
                    </p>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-foreground">
                    {detail.text || "(no content)"}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
