"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type Option = { value: string; label: string };

// A single control that acts like a <select> but with a built-in search box:
// click to open, type to filter, or just scroll the list.
export default function SearchableSelect({
  value,
  options,
  placeholder = "Select…",
  emptyText = "No matches.",
  onChange,
}: {
  value: string;
  options: Option[];
  placeholder?: string;
  emptyText?: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selected = options.find((o) => o.value === value);
  const q = query.trim().toLowerCase();
  const filtered = q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-full min-w-0 items-center justify-between rounded-lg border border-input bg-transparent px-2.5 py-1 text-left text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
      >
        <span className={cn("truncate", !selected && "text-muted-foreground")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className="ml-2 size-4 shrink-0 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-border bg-popover text-popover-foreground shadow-lg">
          <div className="p-2">
            <Input
              autoFocus
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="max-h-56 overflow-auto pb-1">
            {filtered.length ? (
              filtered.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "block w-full truncate px-3 py-2 text-left text-sm hover:bg-accent",
                    o.value === value && "bg-accent/60 font-medium"
                  )}
                >
                  {o.label}
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-muted-foreground">{emptyText}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
