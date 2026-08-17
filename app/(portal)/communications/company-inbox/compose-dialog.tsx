"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendTitanEmail, type MailComposeMode, type MailDetail } from "@/lib/actions/mail";

const MODE_LABEL: Record<MailComposeMode, string> = {
  reply: "Reply",
  replyAll: "Reply All",
  forward: "Forward",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function splitAddresses(raw: string): string[] {
  return raw
    .split(/[,;]/)
    .map((a) => a.trim())
    .filter(Boolean);
}

interface ComposeDialogProps {
  mode: MailComposeMode | null;
  detail: MailDetail | null;
  onClose: () => void;
  onSent: (result: { savedToSent: boolean; warning: string | null }) => void;
}

export function ComposeDialog({ mode, detail, onClose, onSent }: ComposeDialogProps) {
  // Kept separate from the `mode`/`detail` props so dialog content stays populated
  // during the base-ui close transition instead of blanking out mid-animation.
  const [activeMode, setActiveMode] = useState<MailComposeMode>("reply");
  const [activeDetail, setActiveDetail] = useState<MailDetail | null>(null);
  // Tracks the closed->open edge so the reset below (a render-time "adjusting
  // state when a prop changes" per the React docs) fires once per open, not on
  // every render, and re-fires even if the same message is reopened.
  const [wasOpen, setWasOpen] = useState(false);

  const [body, setBody] = useState("");
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const open = mode !== null && detail !== null;

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setActiveMode(mode);
      setActiveDetail(detail);
      setBody("");
      setTo("");
      setCc("");
      setError(null);
    }
  }

  const isForward = activeMode === "forward";
  const toAddresses = isForward ? splitAddresses(to) : [];
  const ccAddresses = isForward ? splitAddresses(cc) : [];
  const hasInvalidRecipient = isForward && toAddresses.some((a) => !EMAIL_RE.test(a));
  const canSend =
    body.trim().length > 0 &&
    !isPending &&
    activeDetail !== null &&
    (!isForward || (toAddresses.length > 0 && !hasInvalidRecipient));

  const computedTo =
    activeMode === "reply"
      ? activeDetail?.fromAddress ?? ""
      : activeMode === "replyAll" && activeDetail
        ? [activeDetail.fromAddress, ...activeDetail.to.map((a) => a.address)]
            .filter(Boolean)
            .join(", ")
        : "";
  const computedCc =
    activeMode === "replyAll" && activeDetail ? activeDetail.cc.map((a) => a.address).join(", ") : "";

  function handleSend() {
    if (!activeDetail) return;
    setError(null);
    startTransition(async () => {
      const { data, error, warning } = await sendTitanEmail({
        uid: activeDetail.uid,
        mode: activeMode,
        body,
        to: isForward ? toAddresses : undefined,
        cc: isForward && ccAddresses.length ? ccAddresses : undefined,
      });
      if (error || !data) {
        setError(error ?? "Failed to send message");
        return;
      }
      onSent({ savedToSent: data.savedToSent, warning });
      onClose();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{MODE_LABEL[activeMode]}</DialogTitle>
          <DialogDescription className="truncate">{activeDetail?.subject}</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4">
          {isForward ? (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">To</label>
                <Input
                  placeholder="name@example.com, name2@example.com"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Cc (optional)
                </label>
                <Input value={cc} onChange={(e) => setCc(e.target.value)} />
              </div>
            </>
          ) : (
            <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
              <p>To: {computedTo || "—"}</p>
              {activeMode === "replyAll" && computedCc && <p>Cc: {computedCc}</p>}
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Message</label>
            <Textarea
              rows={8}
              placeholder="Type your message…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              The original message will be quoted automatically below your reply.
            </p>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button onClick={handleSend} disabled={!canSend}>
            {isPending ? "Sending…" : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
