"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, MoreHorizontal, Pencil, Plus, Tags, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
  createPartner,
  deletePartner,
  listPartners,
  movePartner,
  renamePartner,
  setPartnerField,
  type Partner,
} from "@/lib/actions/partners";
import {
  FACTORY_FIELDS,
  FORWARDER_FIELDS,
  FORWARDER_LANES,
  LANE_FIELDS,
  PARTNER_VIEWS,
  SHORT_NAME_MAX,
  laneFieldKey,
  type ForwarderLane,
  type PartnerKind,
} from "@/lib/partners-constants";

const inputClass =
  "w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
const primaryBtn =
  "rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50";
const destructiveBtn =
  "rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-white hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50";

type Row = { kind: "field"; key: string; label: string } | { kind: "section"; label: string };

export function PartnersView({ initialView }: { initialView: PartnerKind }) {
  const router = useRouter();
  const pathname = usePathname();
  const [view, setView] = useState<PartnerKind>(initialView);
  const [partners, setPartners] = useState<Partner[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lane, setLane] = useState<ForwarderLane>("us");

  function refresh() {
    return listPartners().then(({ data, error }) => {
      if (error) setError(error);
      else {
        setPartners(data ?? []);
        setError(null);
      }
    });
  }

  useEffect(() => {
    refresh();
  }, []);

  function switchView(next: PartnerKind) {
    setView(next);
    router.replace(next === "forwarder" ? `${pathname}?view=forwarders` : pathname, { scroll: false });
  }

  const visible = (partners ?? []).filter((p) => p.kind === view);
  const rows: Row[] =
    view === "factory"
      ? FACTORY_FIELDS.map((f) => ({ kind: "field", ...f }))
      : [
          ...FORWARDER_FIELDS.map((f): Row => ({ kind: "field", ...f })),
          { kind: "section", label: FORWARDER_LANES.find((l) => l.key === lane)!.label },
          ...LANE_FIELDS.map((f): Row => ({ kind: "field", key: laneFieldKey(lane, f.key), label: f.label })),
        ];
  const config = PARTNER_VIEWS[view];

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div className="grid gap-3 sm:grid-cols-2" role="tablist" aria-label="Partner type">
        {(Object.keys(PARTNER_VIEWS) as PartnerKind[]).map((kind) => {
          const v = PARTNER_VIEWS[kind];
          const Icon = v.icon;
          const active = view === kind;
          const count = partners?.filter((p) => p.kind === kind).length;
          return (
            <button
              key={kind}
              role="tab"
              aria-selected={active}
              onClick={() => switchView(kind)}
              className={cn(
                "flex items-center gap-4 rounded-xl border p-4 text-left transition-all",
                active ? v.activeTile : "border-border bg-card opacity-70 hover:bg-accent hover:opacity-100"
              )}
            >
              <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-lg", v.iconWrap)}>
                <Icon className="size-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold">{v.title}</span>
                <span className="block truncate text-sm text-muted-foreground">{v.description}</span>
              </span>
              <span className="text-2xl font-semibold tabular-nums">{count ?? "–"}</span>
            </button>
          );
        })}
      </div>

      <Card key={view} className={cn("animate-in border-t-4 fade-in duration-300", config.accentBorder)}>
        <CardContent className="space-y-4">
          {view === "forwarder" && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Destination</span>
              <SegmentedControl
                value={lane}
                onValueChange={setLane}
                options={FORWARDER_LANES.map((l) => ({ value: l.key, label: l.label }))}
              />
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          {partners === null ? (
            <div className="space-y-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : (
            <PartnerGrid
              kind={view}
              partners={visible}
              rows={rows}
              onError={setError}
              onChanged={refresh}
              onCellSaved={(id, key, value) =>
                setPartners((prev) =>
                  prev?.map((p) => (p.id === id ? { ...p, fields: withField(p.fields, key, value) } : p)) ?? prev
                )
              }
            />
          )}
          <p className="text-xs text-muted-foreground">
            Click any cell to edit. Ctrl+Enter or clicking away saves; Esc cancels.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/** A factory's prices on /market-ops/products, which resolves the name case-insensitively. */
function pricesHref(partner: Partner) {
  return `/market-ops/products?factory=${encodeURIComponent(partner.short_name)}`;
}

function withField(fields: Record<string, string>, key: string, value: string) {
  const next = { ...fields };
  if (value) next[key] = value;
  else delete next[key];
  return next;
}

function PartnerGrid({
  kind,
  partners,
  rows,
  onError,
  onChanged,
  onCellSaved,
}: {
  kind: PartnerKind;
  partners: Partner[];
  rows: Row[];
  onError: (error: string | null) => void;
  onChanged: () => void;
  onCellSaved: (id: string, key: string, value: string) => void;
}) {
  const router = useRouter();
  const [nameDialog, setNameDialog] = useState<{ mode: "add" } | { mode: "rename"; partner: Partner } | null>(null);
  const [toDelete, setToDelete] = useState<Partner | null>(null);
  const [busy, setBusy] = useState(false);
  const singular = PARTNER_VIEWS[kind].singular;

  async function saveCell(partner: Partner, key: string, value: string) {
    const trimmed = value.trim();
    const previous = partner.fields[key] ?? "";
    if (trimmed === previous) return;
    onCellSaved(partner.id, key, trimmed); // optimistic
    const { error } = await setPartnerField(partner.id, key, trimmed);
    if (error) {
      onCellSaved(partner.id, key, previous); // revert
      onError(error);
    } else onError(null);
  }

  async function handleMove(partner: Partner, direction: "left" | "right") {
    const { error } = await movePartner(partner.id, direction);
    onError(error);
    onChanged();
  }

  async function handleDelete() {
    if (!toDelete) return;
    setBusy(true);
    const { error } = await deletePartner(toDelete.id);
    setBusy(false);
    setToDelete(null);
    onError(error);
    onChanged();
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-max min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="sticky left-0 z-10 w-56 min-w-56 border-r border-b border-border bg-muted px-3 py-2 text-left font-medium text-muted-foreground">
                Short Form
              </th>
              {partners.map((p, i) => (
                <th key={p.id} className="min-w-44 border-r border-b border-border px-2 py-1.5">
                  <div className="flex items-center justify-center gap-1">
                    {kind === "factory" ? (
                      <Link
                        href={pricesHref(p)}
                        title={`View ${p.short_name} prices`}
                        className="truncate text-base font-semibold underline-offset-4 hover:text-primary hover:underline"
                      >
                        {p.short_name}
                      </Link>
                    ) : (
                      <span className="truncate text-base font-semibold">{p.short_name}</span>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        aria-label={`Actions for ${p.short_name}`}
                        className="rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        {kind === "factory" && (
                          <>
                            <DropdownMenuItem onClick={() => router.push(pricesHref(p))}>
                              <Tags />
                              View prices
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        <DropdownMenuItem onClick={() => setNameDialog({ mode: "rename", partner: p })}>
                          <Pencil />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={i === 0} onClick={() => handleMove(p, "left")}>
                          <ArrowLeft />
                          Move left
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={i === partners.length - 1}
                          onClick={() => handleMove(p, "right")}
                        >
                          <ArrowRight />
                          Move right
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => setToDelete(p)}>
                          <Trash2 />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </th>
              ))}
              <th className="border-b border-border px-2 py-1.5">
                <button
                  onClick={() => setNameDialog({ mode: "add" })}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <Plus className="size-4" />
                  Add {singular}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) =>
              row.kind === "section" ? (
                <tr key={`section-${row.label}`} className="bg-muted/40">
                  <td className="sticky left-0 z-10 border-r border-b border-border bg-muted px-3 py-1.5 text-xs font-semibold tracking-wide uppercase">
                    {row.label}
                  </td>
                  <td colSpan={partners.length + 1} className="border-b border-border" />
                </tr>
              ) : (
                <tr key={row.key} className="hover:bg-muted/30">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-r border-b border-border bg-card px-3 py-1.5 text-left font-normal"
                  >
                    {row.label}
                  </th>
                  {partners.map((p) => (
                    <td key={p.id} className="border-r border-b border-border p-0 align-top">
                      <EditableCell
                        value={p.fields[row.key] ?? ""}
                        onSave={(v) => saveCell(p, row.key, v)}
                      />
                    </td>
                  ))}
                  <td className="border-b border-border" />
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <PartnerNameDialog
        state={nameDialog}
        kind={kind}
        onClose={() => setNameDialog(null)}
        onSaved={onChanged}
      />

      <AlertDialog open={toDelete !== null} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {toDelete?.short_name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the {singular} and every detail recorded for it. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <button onClick={handleDelete} disabled={busy} className={destructiveBtn}>
              {busy ? "Deleting…" : "Delete"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function EditableCell({ value, onSave }: { value: string; onSave: (value: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!editing) return;
    const el = ref.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, [editing]);

  // Grow with the content so multi-line notes stay readable while typing.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [draft, editing]);

  if (!editing) {
    return (
      <button
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
        className="block min-h-8 w-full px-2.5 py-1.5 text-left whitespace-pre-wrap hover:bg-accent/60"
      >
        {value || <span className="text-muted-foreground/40">—</span>}
      </button>
    );
  }

  return (
    <textarea
      ref={ref}
      rows={1}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        setEditing(false);
        onSave(draft);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setDraft(value);
          setEditing(false);
        } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
          e.currentTarget.blur();
        }
      }}
      className="block w-full resize-none bg-background px-2.5 py-1.5 text-sm ring-2 ring-ring outline-none ring-inset"
    />
  );
}

function PartnerNameDialog({
  state,
  kind,
  onClose,
  onSaved,
}: {
  state: { mode: "add" } | { mode: "rename"; partner: Partner } | null;
  kind: PartnerKind;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openedFor, setOpenedFor] = useState(state);
  const singular = PARTNER_VIEWS[kind].singular;

  // Reset the form whenever the dialog is opened for a different target (render-time, not an effect).
  if (state !== openedFor) {
    setOpenedFor(state);
    if (state) {
      setName(state.mode === "rename" ? state.partner.short_name : "");
      setError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state) return;
    setBusy(true);
    const { error } =
      state.mode === "add" ? await createPartner(kind, name) : await renamePartner(state.partner.id, name);
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    onClose();
    onSaved();
  }

  return (
    <Dialog open={state !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{state?.mode === "rename" ? `Rename ${state.partner.short_name}` : `Add ${singular}`}</DialogTitle>
            <DialogDescription>
              The short form used as the column heading, e.g. {kind === "factory" ? "CH" : "Du"}. Fill in the
              rest of the details in the grid.
            </DialogDescription>
          </DialogHeader>
          <input
            autoFocus
            className={inputClass}
            placeholder="Short name"
            maxLength={SHORT_NAME_MAX}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <button type="submit" disabled={busy || !name.trim()} className={primaryBtn}>
              {busy ? "Saving…" : state?.mode === "rename" ? "Rename" : "Add"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
