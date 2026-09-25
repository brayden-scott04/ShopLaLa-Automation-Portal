"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { DeleteConfirm, labelClass, selectClass } from "@/components/bulk-campaign/library-sections";
import type { Brand } from "@/lib/actions/bulk-campaign";

type ActionResult = { error: string | null };

/** A per-brand library item: one label plus one value (logo asset ID or store URL). */
export interface BrandLibraryItem {
  id: string;
  brand_id: string;
  label: string;
  value: string;
}

/**
 * Brand-scoped library list with add / edit / delete, used for Brand Logos and
 * Store URLs (same shape: brand + label + one value).
 */
export function BrandLibrarySection({
  title,
  description,
  noun,
  valueLabel,
  valuePlaceholder,
  brands,
  items,
  normalize,
  onCreate,
  onUpdate,
  onDelete,
  onChanged,
}: {
  title: string;
  description: string;
  noun: string;
  valueLabel: string;
  valuePlaceholder: string;
  brands: Brand[];
  items: BrandLibraryItem[];
  normalize?: (value: string) => string;
  onCreate: (input: { brandId: string; label: string; value: string }) => Promise<ActionResult>;
  onUpdate: (id: string, input: { label: string; value: string }) => Promise<ActionResult>;
  onDelete: (id: string) => Promise<ActionResult>;
  onChanged: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BrandLibraryItem | null>(null);
  const [brandId, setBrandId] = useState(brands[0]?.id ?? "");
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<BrandLibraryItem | null>(null);

  function openAdd() {
    setEditing(null);
    setBrandId(brands[0]?.id ?? "");
    setLabel("");
    setValue("");
    setFormError(null);
    setOpen(true);
  }

  function openEdit(item: BrandLibraryItem) {
    setEditing(item);
    setBrandId(item.brand_id);
    setLabel(item.label);
    setValue(item.value);
    setFormError(null);
    setOpen(true);
  }

  async function handleSave() {
    setBusy(true);
    setFormError(null);
    const clean = normalize ? normalize(value) : value.trim();
    const { error } = editing
      ? await onUpdate(editing.id, { label, value: clean })
      : await onCreate({ brandId, label, value: clean });
    setBusy(false);
    if (error) {
      setFormError(error);
      return;
    }
    setOpen(false);
    onChanged();
  }

  async function handleDelete(item: BrandLibraryItem) {
    await onDelete(item.id);
    onChanged();
  }

  function brandName(id: string) {
    return brands.find((b) => b.id === id)?.name ?? "Unknown brand";
  }

  return (
    <Card>
      <CardHeader className="grid-cols-1! sm:grid-cols-[1fr_auto]!">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Button
            variant="outline"
            size="sm"
            onClick={openAdd}
            disabled={brands.length === 0}
            title={brands.length === 0 ? "Add a Brand Profile first" : undefined}
          >
            + Add {noun}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No {title.toLowerCase()} yet.</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate font-medium">{item.label}</span>
                  <Badge variant="outline">{brandName(item.brand_id)}</Badge>
                  <span className="truncate font-mono text-xs text-muted-foreground">{item.value}</span>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="xs" onClick={() => openEdit(item)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setPendingDelete(item)}
                    className="text-destructive hover:text-destructive"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>
              {editing ? "Edit" : "Add"} {noun}
            </SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4">
            {!editing && (
              <div>
                <label className={labelClass}>Brand Profile</label>
                <select className={selectClass} value={brandId} onChange={(e) => setBrandId(e.target.value)}>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.country})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className={labelClass}>Label</label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>{valueLabel}</label>
              <Input
                className="font-mono text-xs"
                placeholder={valuePlaceholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
          </div>
          <SheetFooter className="flex-row justify-end gap-2">
            <Button onClick={handleSave} disabled={busy}>
              {busy ? "Saving…" : "Save"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <DeleteConfirm
        item={pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={(item) => handleDelete(item)}
        title={`Delete ${noun.toLowerCase()}?`}
        describe={(item) => (
          <>
            This deletes <span className="font-medium text-foreground">{item.label}</span>.
          </>
        )}
      />
    </Card>
  );
}
