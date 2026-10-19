"use client";

import { useCallback, useState, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/lib/utils";

const MIN_WIDTH = 48;

function readStored(storageKey: string, count: number): number[] | null {
  if (typeof window === "undefined") return null;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? "null");
    if (Array.isArray(parsed) && parsed.length === count && parsed.every((n) => typeof n === "number" && n > 0)) {
      return parsed;
    }
  } catch {
    // Unavailable storage or bad JSON — fall back to the default layout.
  }
  return null;
}

function writeStored(storageKey: string, widths: number[] | null) {
  try {
    if (widths) window.localStorage.setItem(storageKey, JSON.stringify(widths));
    else window.localStorage.removeItem(storageKey);
  } catch {
    // Not persisting is fine; the widths still apply for this visit.
  }
}

/**
 * Excel-style column resizing. Until the user drags a handle the table keeps its normal auto layout;
 * the first drag snapshots every header's rendered width and switches to fixed widths from then on.
 * Widths are remembered per browser under `storageKey`.
 */
export function useResizableColumns(storageKey: string, columnCount: number) {
  const [widths, setWidths] = useState<number[] | null>(() => readStored(storageKey, columnCount));

  const startResize = useCallback(
    (index: number, e: ReactPointerEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const headers = e.currentTarget.closest("table")?.querySelectorAll<HTMLTableCellElement>("thead th");
      if (!headers || headers.length !== columnCount) return;

      const start = widths ?? Array.from(headers, (th) => Math.round(th.getBoundingClientRect().width));
      const startX = e.clientX;
      let latest = start;
      const handle = e.currentTarget;
      handle.setPointerCapture(e.pointerId);

      const onMove = (ev: PointerEvent) => {
        latest = start.map((w, i) => (i === index ? Math.max(MIN_WIDTH, Math.round(w + ev.clientX - startX)) : w));
        setWidths(latest);
      };
      const onUp = () => {
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
        handle.removeEventListener("pointercancel", onUp);
        writeStored(storageKey, latest);
      };
      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);
      handle.addEventListener("pointercancel", onUp);
      setWidths(start);
    },
    [columnCount, storageKey, widths]
  );

  const reset = useCallback(() => {
    setWidths(null);
    writeStored(storageKey, null);
  }, [storageKey]);

  const tableStyle = widths
    ? { tableLayout: "fixed" as const, width: widths.reduce((sum, w) => sum + w, 0) }
    : undefined;

  return { widths, tableStyle, startResize, reset };
}

/** Drag handle on a header's right edge. The header cell needs `relative`. Double-click resets all columns. */
export function ColumnResizeHandle({
  onPointerDown,
  onReset,
}: {
  onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void;
  onReset: () => void;
}) {
  return (
    <span
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize column"
      title="Drag to resize · double-click to reset all columns"
      onPointerDown={onPointerDown}
      onDoubleClick={onReset}
      className={cn(
        "absolute top-0 right-0 z-10 h-full w-2 cursor-col-resize touch-none select-none",
        "after:absolute after:top-1/4 after:right-0 after:h-1/2 after:w-px after:bg-border hover:after:bg-primary"
      )}
    />
  );
}
