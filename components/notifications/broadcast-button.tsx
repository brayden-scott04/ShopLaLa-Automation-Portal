"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { Megaphone, Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useT } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";
import { sendBroadcast } from "@/lib/actions/broadcast";
import { MAX_BROADCAST_LENGTH } from "@/lib/notifications-constants";
import { announceNotificationsChanged } from "./use-notifications";

export interface BroadcastCandidate {
  username: string;
  role: string;
}

/**
 * Dashboard "Broadcast message" button, for leaders and admins (the page decides who sees it;
 * sendBroadcast re-checks). `candidates` is every other staff member.
 */
export function BroadcastButton({ candidates }: { candidates: BroadcastCandidate[] }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? candidates.filter((c) => c.username.toLowerCase().includes(q)) : candidates;
  }, [candidates, query]);

  if (candidates.length === 0) return null;

  const allPicked = picked.size === candidates.length;

  function openDialog() {
    // Starts with everyone ticked: "send to all" is the common case. Untick to narrow it down.
    setPicked(new Set(candidates.map((c) => c.username)));
    setQuery("");
    setError(null);
    setOpen(true);
  }

  function toggle(username: string, on: boolean) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (on) next.add(username);
      else next.delete(username);
      return next;
    });
  }

  function send() {
    setError(null);
    startTransition(async () => {
      // null = everyone, so someone added after the dialog opened still gets it.
      const { data, error } = await sendBroadcast(message, allPicked ? null : [...picked]);
      if (error || !data) {
        setError(error ?? t("broadcast.failed"));
        return;
      }
      setOpen(false);
      setMessage("");
      announceNotificationsChanged();
      setToast(t("broadcast.sent", { count: data.sent }));
    });
  }

  const nearLimit = message.length >= MAX_BROADCAST_LENGTH * 0.8;

  return (
    <>
      <Button onClick={openDialog} className="shrink-0">
        <Megaphone />
        {t("broadcast.button")}
      </Button>

      <Dialog open={open} onOpenChange={(o) => !isPending && setOpen(o)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="size-4" />
              {t("broadcast.title")}
            </DialogTitle>
            <DialogDescription>{t("broadcast.description")}</DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="broadcast-message">{t("broadcast.message")}</Label>
              <Textarea
                id="broadcast-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={MAX_BROADCAST_LENGTH}
                placeholder={t("broadcast.placeholder")}
                className="field-sizing-content min-h-32 max-h-[45vh] resize-y"
                autoFocus
              />
              {nearLimit && (
                <p
                  className={cn(
                    "text-right text-[11px] tabular-nums",
                    message.length >= MAX_BROADCAST_LENGTH ? "text-destructive" : "text-muted-foreground"
                  )}
                >
                  {message.length.toLocaleString()} / {MAX_BROADCAST_LENGTH.toLocaleString()}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <Label>{t("broadcast.recipients")}</Label>
                <span className="text-xs text-muted-foreground">
                  {t("broadcast.selectedCount", { count: picked.size, total: candidates.length })}
                </span>
              </div>
              <div className="rounded-md border border-border">
                <label className="flex items-center gap-2.5 border-b border-border px-3 py-2 text-sm font-medium hover:bg-accent/60">
                  <Checkbox
                    checked={allPicked}
                    indeterminate={!allPicked && picked.size > 0}
                    onCheckedChange={(checked) =>
                      setPicked(checked ? new Set(candidates.map((c) => c.username)) : new Set())
                    }
                  />
                  {t("broadcast.everyone", { count: candidates.length })}
                </label>
                <div className="relative border-b border-border">
                  <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("broadcast.search")}
                    aria-label={t("broadcast.search")}
                    className="h-8 w-full bg-transparent pr-3 pl-8 text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
                <div className="max-h-56 overflow-y-auto p-1">
                  {shown.length === 0 ? (
                    <p className="px-2 py-3 text-center text-xs text-muted-foreground">{t("broadcast.noMatch")}</p>
                  ) : (
                    shown.map((c) => (
                      <label
                        key={c.username}
                        className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-accent/60"
                      >
                        <Checkbox checked={picked.has(c.username)} onCheckedChange={(on) => toggle(c.username, !!on)} />
                        <span className="text-foreground">{c.username}</span>
                        <span className="text-xs text-muted-foreground">· {t.dynamic(`roles.${c.role}`, c.role)}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>

            {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              {t("broadcast.cancel")}
            </Button>
            <Button onClick={send} disabled={isPending || !message.trim() || picked.size === 0}>
              <Send />
              {isPending
                ? t("broadcast.sending")
                : allPicked
                  ? t("broadcast.sendEveryone")
                  : t("broadcast.sendTo", { count: picked.size })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {toast &&
        createPortal(
          <div
            role="status"
            className="fixed right-4 bottom-4 z-[100] max-w-xs rounded-lg bg-foreground px-4 py-2.5 text-sm text-background shadow-lg"
          >
            {toast}
          </div>,
          document.body
        )}
    </>
  );
}
