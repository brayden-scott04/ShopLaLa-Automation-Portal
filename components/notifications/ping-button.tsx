"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { BellRing, Users, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useT } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";
import { announceNotificationsChanged } from "./use-notifications";

export interface PingCandidate {
  username: string;
  /** Tagged "Owner" in the picker. */
  isOwner?: boolean;
}

type PingResult = { data: { sent: number; skipped: number } | null; error: string | null };

/**
 * Bell next to an event's / task's edit pencil: "Ping all" or "Ping selected…" (a checklist of the
 * people on it). `candidates` must already exclude the viewer. Renders nothing when empty.
 */
export function PingButton({
  title,
  candidates,
  onPing,
  className,
}: {
  title: string;
  candidates: PingCandidate[];
  onPing: (usernames: string[] | null) => Promise<PingResult>;
  className?: string;
}) {
  const t = useT();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (!status) return;
    const timer = window.setTimeout(() => setStatus(null), 4500);
    return () => window.clearTimeout(timer);
  }, [status]);

  if (candidates.length === 0) return null;

  function send(usernames: string[] | null) {
    startTransition(async () => {
      const { data, error } = await onPing(usernames);
      if (error || !data) {
        setStatus({ ok: false, text: error ?? "Error" });
        return;
      }
      setPickerOpen(false);
      announceNotificationsChanged();
      setStatus({
        ok: true,
        text: data.skipped
          ? t("ping.sentSkipped", { count: data.sent, skipped: data.skipped })
          : t("ping.sent", { count: data.sent }),
      });
    });
  }

  function openPicker() {
    setPicked(new Set(candidates.map((c) => c.username)));
    setPickerOpen(true);
  }

  const allPicked = picked.size === candidates.length;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button size="icon-sm" variant="ghost" className={className} disabled={isPending} />}
          title={t("ping.button")}
          aria-label={t("ping.button")}
        >
          <BellRing />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => send(null)}>
            <Users />
            {t("ping.pingAll", { count: candidates.length })}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openPicker}>
            <UserCheck />
            {t("ping.pingSelected")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("ping.dialogTitle")}</DialogTitle>
            <DialogDescription>{t("ping.dialogDescription", { title })}</DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-1">
            <label className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent/60">
              <Checkbox
                checked={allPicked}
                indeterminate={!allPicked && picked.size > 0}
                onCheckedChange={(checked) => setPicked(checked ? new Set(candidates.map((c) => c.username)) : new Set())}
              />
              {t("ping.selectAll")}
            </label>
            <div className="border-t border-border pt-1">
              {candidates.map((c) => (
                <label
                  key={c.username}
                  className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-accent/60"
                >
                  <Checkbox
                    checked={picked.has(c.username)}
                    onCheckedChange={(checked) =>
                      setPicked((prev) => {
                        const next = new Set(prev);
                        if (checked) next.add(c.username);
                        else next.delete(c.username);
                        return next;
                      })
                    }
                  />
                  <span className="text-foreground">{c.username}</span>
                  {c.isOwner && <span className="text-xs text-muted-foreground">· {t("ping.owner")}</span>}
                </label>
              ))}
            </div>
            {status && !status.ok && <p className="pt-1 text-sm text-destructive">{status.text}</p>}
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPickerOpen(false)}>
              {t("ping.cancel")}
            </Button>
            <Button disabled={picked.size === 0 || isPending} onClick={() => send([...picked])}>
              <BellRing />
              {isPending ? t("ping.sending") : t("ping.send")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {status &&
        !pickerOpen &&
        createPortal(
          <div
            role="status"
            className={cn(
              "fixed right-4 bottom-4 z-[100] max-w-xs rounded-lg px-4 py-2.5 text-sm shadow-lg",
              status.ok ? "bg-foreground text-background" : "bg-destructive text-white"
            )}
          >
            {status.text}
          </div>,
          document.body
        )}
    </>
  );
}
