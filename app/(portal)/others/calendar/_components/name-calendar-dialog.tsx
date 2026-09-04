"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NameCalendarDialog({
  open,
  initialName,
  title,
  onClose,
  onSubmit,
}: {
  open: boolean;
  initialName: string;
  title: string;
  onClose: () => void;
  onSubmit: (name: string) => Promise<{ error: string | null }>;
}) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  // Tracks the closed->open edge so the reset below (a render-time "adjusting
  // state when a prop changes" per the React docs) fires once per open.
  const [wasOpen, setWasOpen] = useState(false);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setName(initialName);
      setError(null);
    }
  }

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const { error } = await onSubmit(name);
      if (error) setError(error);
      else onClose();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-2">
          <Label className="mb-1">Calendar name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My Tasks, Appointments"
            autoFocus
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button onClick={handleSubmit} disabled={isPending || !name.trim()}>
            {isPending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
