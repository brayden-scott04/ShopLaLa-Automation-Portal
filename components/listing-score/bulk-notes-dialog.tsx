"use client";

import { useRef, useState, useTransition } from "react";
import { CheckCircle2, FileSpreadsheet, Upload } from "lucide-react";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { bulkImportListingNotes, type BulkNotesResult } from "@/lib/actions/listing-score";
import { BULK_NOTE_COLUMNS } from "@/lib/listing-score";

const EXAMPLE = "SKU\tVideos\tRelated videos\tExpected images\nWPCSet3A-B-0226US\t1\t1\t9";

export function BulkNotesDialog({
  open,
  onClose,
  onImported,
}: {
  open: boolean;
  onClose: () => void;
  /** Called after a successful import so the page can reload its notes. */
  onImported: () => void;
}) {
  const [mode, setMode] = useState<"paste" | "file">("paste");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<BulkNotesResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function reset() {
    setText("");
    setFile(null);
    setResult(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function run() {
    const form = new FormData();
    if (mode === "file") {
      if (!file) return setError("Choose a file first");
      form.set("file", file);
    } else {
      form.set("text", text);
    }
    setError(null);
    startTransition(async () => {
      const { data, error } = await bulkImportListingNotes(form);
      if (error || !data) {
        setError(error ?? "Import failed");
        return;
      }
      setResult(data);
      if (data.updated > 0) onImported();
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Bulk update videos &amp; expected images</DialogTitle>
          <DialogDescription>
            Needs a header row with <b>SKU</b> plus any of: {BULK_NOTE_COLUMNS.join(", ")}. Only the columns you include
            are changed. A blank cell clears that value. Tip: export to Excel, fill in the columns, then upload the file here.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-3">
          {result ? (
            <div className="space-y-3">
              <div className="flex items-start gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                <span>
                  Updated <b>{result.updated}</b> SKU{result.updated === 1 ? "" : "s"} ({result.columns.join(", ")}).
                </span>
              </div>
              {result.invalid.length > 0 && (
                <div className="rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs">
                  <p className="mb-1 font-medium text-red-700 dark:text-red-400">
                    {result.invalid.length} row{result.invalid.length === 1 ? "" : "s"} skipped for a bad value:
                  </p>
                  <ul className="max-h-32 list-disc space-y-0.5 overflow-y-auto pl-4">
                    {result.invalid.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.unknownSkus.length > 0 && (
                <div className="rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs">
                  <p className="mb-1 font-medium text-amber-700 dark:text-amber-400">
                    {result.unknownSkus.length} SKU{result.unknownSkus.length === 1 ? "" : "s"} not tracked by Listing Score
                    (not an NA Master List SKU, or not synced yet):
                  </p>
                  <p className="max-h-24 overflow-y-auto font-mono break-all">{result.unknownSkus.join(", ")}</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <SegmentedControl
                value={mode}
                onValueChange={(v) => {
                  setMode(v);
                  setError(null);
                }}
                options={[
                  { value: "paste", label: "Paste from Excel" },
                  { value: "file", label: "Upload file" },
                ]}
              />
              {mode === "paste" ? (
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={9}
                  placeholder={EXAMPLE}
                  className="w-full rounded-md border border-input bg-background px-2.5 py-2 font-mono text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                />
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center text-sm text-muted-foreground transition hover:border-primary/40">
                  <FileSpreadsheet className="size-7" />
                  {file ? <span className="font-medium text-foreground">{file.name}</span> : <span>Choose an .xlsx or .csv file</span>}
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
            </>
          )}
        </DialogBody>

        <DialogFooter>
          {result ? (
            <>
              <Button variant="ghost" size="sm" onClick={reset}>
                Import more
              </Button>
              <DialogClose render={<Button size="sm" />}>Done</DialogClose>
            </>
          ) : (
            <>
              <DialogClose className="rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent">Cancel</DialogClose>
              <Button size="sm" onClick={run} disabled={pending || (mode === "paste" ? !text.trim() : !file)}>
                <Upload /> {pending ? "Importing…" : "Import"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
