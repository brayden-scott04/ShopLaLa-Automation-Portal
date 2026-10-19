"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { ThreadItem } from "@/lib/actions/mail";

interface ThreadViewProps {
  items: ThreadItem[];
  anchorUid: number | null;
}

export function ThreadView({ items, anchorUid }: ThreadViewProps) {
  const anchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    anchorRef.current?.scrollIntoView({ block: "nearest" });
  }, [items, anchorUid]);

  return (
    <div className="flex max-h-[60vh] min-w-0 flex-col gap-3 overflow-x-hidden overflow-y-auto">
      {items.map((item) => (
        <div
          key={`${item.folder}:${item.uid}`}
          ref={item.isAnchor ? anchorRef : undefined}
          className={cn(
            "rounded-lg border p-4",
            item.outgoing ? "ml-6 border-primary/20 bg-primary/5" : "mr-6 border-border bg-muted/30",
            item.isAnchor && "ring-1 ring-primary"
          )}
        >
          <div className="mb-1 flex min-w-0 flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="min-w-0 font-medium break-all text-foreground">
              {item.outgoing ? "You" : item.from}
              {!item.outgoing && item.fromAddress && ` <${item.fromAddress}>`}
            </span>
            <span>{new Date(item.date).toLocaleString()}</span>
          </div>
          <p className="text-sm whitespace-pre-wrap text-foreground [overflow-wrap:anywhere]">{item.text || "(no content)"}</p>
        </div>
      ))}
    </div>
  );
}
