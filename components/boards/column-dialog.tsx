"use client";

import { useState, useTransition } from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { createColumn, updateColumn, type BoardColumn, type StatusOption } from "@/lib/actions/boards";
import {
  BOARD_COLUMN_TYPES,
  BOARD_COLUMN_TYPE_LABELS,
  STATUS_COLOR_SWATCHES,
  DEFAULT_STATUS_COLOR,
  MAX_STATUS_OPTIONS,
  type BoardColumnType,
} from "@/lib/boards-constants";

const SELECT_CLASSNAME =
  "w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50";

export function ColumnDialog({
  open,
  onOpenChange,
  boardId,
  column,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardId: string;
  column: BoardColumn | null;
  onSaved: (column: BoardColumn) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<BoardColumnType>("text");
  const [options, setOptions] = useState<StatusOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  // Tracks the closed->open edge so the reset below (a render-time "adjusting
  // state when a prop changes" per the React docs) fires once per open.
  const [wasOpen, setWasOpen] = useState(false);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setName(column?.name ?? "");
      setType(column?.type ?? "text");
      setOptions(column?.options ?? []);
      setError(null);
    }
  }

  function addOption() {
    if (options.length >= MAX_STATUS_OPTIONS) return;
    setOptions((prev) => [...prev, { key: crypto.randomUUID(), label: "", color: DEFAULT_STATUS_COLOR }]);
  }

  function updateOption(index: number, patch: Partial<StatusOption>) {
    setOptions((prev) => prev.map((o, i) => (i === index ? { ...o, ...patch } : o)));
  }

  function removeOption(index: number) {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = column
        ? await updateColumn(column.id, { name, ...(type === "status" ? { options } : {}) })
        : await createColumn(boardId, { name, type, options: type === "status" ? options : undefined });
      if (result.error || !result.data) {
        setError(result.error ?? "Something went wrong");
        return;
      }
      onSaved(result.data);
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{column ? "Edit column" : "Add column"}</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="column-name">Name</Label>
            <Input id="column-name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="column-type">Type</Label>
            <select
              id="column-type"
              value={type}
              disabled={!!column}
              onChange={(e) => setType(e.target.value as BoardColumnType)}
              className={SELECT_CLASSNAME}
            >
              {BOARD_COLUMN_TYPES.map((t) => (
                <option key={t} value={t}>
                  {BOARD_COLUMN_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
            {column && <p className="text-xs text-muted-foreground">Type can&apos;t be changed after creation.</p>}
          </div>

          {type === "status" && (
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={option.key} className="flex items-center gap-2">
                    <select
                      value={option.color}
                      onChange={(e) => updateOption(index, { color: e.target.value })}
                      className="w-28 shrink-0 rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {STATUS_COLOR_SWATCHES.map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <Input
                      value={option.label}
                      onChange={(e) => updateOption(index, { label: e.target.value })}
                      placeholder="Option label"
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon-sm" onClick={() => removeOption(index)}>
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={addOption} disabled={options.length >= MAX_STATUS_OPTIONS}>
                <Plus /> Add option
              </Button>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending || !name.trim()}>
            {column ? "Save" : "Add column"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
