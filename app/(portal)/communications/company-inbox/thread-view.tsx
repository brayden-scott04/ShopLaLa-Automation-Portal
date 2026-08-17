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
    <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto">
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
          <div className="mb-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {item.outgoing ? "You" : item.from}
              {!item.outgoing && item.fromAddress && ` <${item.fromAddress}>`}
            </span>
            <span>{new Date(item.date).toLocaleString()}</span>
          </div>
          <p className="whitespace-pre-wrap text-sm text-foreground">{item.text || "(no content)"}</p>
        </div>
      ))}
    </div>
  );
}
