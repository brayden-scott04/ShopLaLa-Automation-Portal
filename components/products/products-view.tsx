"use client";

import { Fragment, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Copy, ExternalLink, Factory, MoreHorizontal, Plus, Search, Trash2, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  addProductPrice,
  deleteProductPrice,
  importProductPrices,
  listProductPrices,
  parsePriceExcel,
  setProductDetails,
  setProductFactory,
  setProductPrice,
  type PriceImportPreview,
} from "@/lib/actions/product-prices";
import {
  commissionRmb,
  formatRmb,
  landedCostRmb,
  MATERIALS,
  parsePrice,
  TERMS,
  TIERS,
  type FactoryRef,
  type ProductDetails,
  type ProductPrice,
} from "@/lib/product-prices";

const inputClass =
  "w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
const primaryBtn =
  "inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50";
const secondaryBtn =
  "inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50";

const ALL = "all";
const UNASSIGNED = "unassigned";

export function ProductsView({
  initialFactory,
  initialSku,
}: {
  initialFactory: string | null;
  initialSku: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [prices, setPrices] = useState<ProductPrice[] | null>(null);
  const [factories, setFactories] = useState<FactoryRef[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>(ALL);
  const [search, setSearch] = useState("");
  const [highlight, setHighlight] = useState<string | null>(null);
  const [missingSku, setMissingSku] = useState<string | null>(null);
  const [addState, setAddState] = useState<{ sku: string } | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const deepLinked = useRef(false);

  function refresh() {
    return listProductPrices().then(({ data, error }) => {
      if (error) setError(error);
      else if (data) {
        setPrices(data.prices);
        setFactories(data.factories);
        setError(null);
        if (!deepLinked.current) {
          deepLinked.current = true;
          applyDeepLink(data.prices, data.factories);
        }
      }
    });
  }

  /** Resolves ?sku= (wins) or ?factory= against the first load. */
  function applyDeepLink(rows: ProductPrice[], list: FactoryRef[]) {
    if (initialSku) {
      const row =
        rows.find((p) => p.sku === initialSku) ??
        rows.find((p) => p.sku.toLowerCase() === initialSku.toLowerCase());
      if (row) {
        setSelected(row.partner_id ?? UNASSIGNED);
        setHighlight(row.id);
      } else setMissingSku(initialSku);
    } else if (initialFactory) {
      if (initialFactory.toLowerCase() === UNASSIGNED) setSelected(UNASSIGNED);
      else {
        const f = list.find((f) => f.short_name.toLowerCase() === initialFactory.toLowerCase());
        if (f) setSelected(f.id);
      }
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!highlight) return;
    const el = document.getElementById(`price-row-${highlight}`);
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
    const t = setTimeout(() => setHighlight(null), 3000);
    return () => clearTimeout(t);
  }, [highlight]);

  function select(next: string) {
    setSelected(next);
    const name =
      next === ALL ? null : next === UNASSIGNED ? UNASSIGNED : factories.find((f) => f.id === next)?.short_name;
    router.replace(name ? `${pathname}?factory=${encodeURIComponent(name)}` : pathname, { scroll: false });
  }

  const factoryName = useMemo(() => new Map(factories.map((f) => [f.id, f.short_name])), [factories]);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of prices ?? []) {
      const key = p.partner_id ?? UNASSIGNED;
      m.set(key, (m.get(key) ?? 0) + 1);
    }
    return m;
  }, [prices]);

  const query = search.trim().toLowerCase();
  const inScope = (prices ?? []).filter(
    (p) => selected === ALL || (p.partner_id ?? UNASSIGNED) === selected
  );
  const visible = inScope.filter((p) => p.sku.toLowerCase().includes(query));

  // "All factories" groups rows under each factory, in Partners order.
  const groups: { key: string; label: string; rows: ProductPrice[] }[] =
    selected !== ALL
      ? [{ key: selected, label: "", rows: visible }]
      : [...factories.map((f) => f.id), UNASSIGNED]
          .map((key) => ({
            key,
            label: key === UNASSIGNED ? "Unassigned" : factoryName.get(key) ?? "",
            rows: visible.filter((p) => (p.partner_id ?? UNASSIGNED) === key),
          }))
          .filter((g) => g.rows.length > 0);

  const priced = inScope.map((p) => p.price_rmb).filter((v): v is number => v !== null);
  const stats = priced.length
    ? {
        avg: priced.reduce((a, b) => a + b, 0) / priced.length,
        min: Math.min(...priced),
        max: Math.max(...priced),
      }
    : null;

  const title =
    selected === ALL ? "All factories" : selected === UNASSIGNED ? "Unassigned" : factoryName.get(selected) ?? "";

  function patch(id: string, changes: Partial<ProductPrice>) {
    setPrices((prev) => prev?.map((p) => (p.id === id ? { ...p, ...changes } : p)) ?? prev);
  }

  async function savePrice(row: ProductPrice, value: number | null) {
    if (value === row.price_rmb) return;
    patch(row.id, { price_rmb: value }); // optimistic
    const { error } = await setProductPrice(row.id, value);
    if (error) {
      patch(row.id, { price_rmb: row.price_rmb });
      setError(error);
    } else setError(null);
  }

  async function saveDetails(row: ProductPrice, changes: Partial<ProductDetails>) {
    patch(row.id, changes);
    const { error } = await setProductDetails(row.id, changes);
    if (error) {
      patch(row.id, row);
      setError(error);
    } else setError(null);
  }

  async function saveFactory(row: ProductPrice, partnerId: string | null) {
    patch(row.id, { partner_id: partnerId });
    const { error } = await setProductFactory(row.id, partnerId);
    if (error) {
      patch(row.id, { partner_id: row.partner_id });
      setError(error);
    } else setError(null);
  }

  async function handleDelete(row: ProductPrice) {
    if (!confirm(`Remove ${row.sku} from the price list?`)) return;
    const { error } = await deleteProductPrice(row.id);
    setError(error);
    refresh();
  }

  const railItems = [
    { key: ALL, label: "All factories", count: prices?.length ?? 0 },
    ...factories.map((f) => ({ key: f.id, label: f.short_name, count: counts.get(f.id) ?? 0 })),
    ...(counts.get(UNASSIGNED) ? [{ key: UNASSIGNED, label: "Unassigned", count: counts.get(UNASSIGNED)! }] : []),
  ];

  return (
    <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[13rem_1fr]">
      {/* Factory rail: chips on mobile, a vertical list from lg up. */}
      <nav aria-label="Factories" className="lg:sticky lg:top-6 lg:self-start">
        <p className="mb-2 hidden px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase lg:block">
          Factories
        </p>
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 lg:flex-col lg:overflow-visible">
          {prices === null
            ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-9 w-28 shrink-0 lg:w-full" />)
            : railItems.map((item) => {
                const active = selected === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => select(item.key)}
                    className={cn(
                      "flex shrink-0 items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                      active
                        ? "border-primary/40 bg-primary/10 font-semibold text-foreground"
                        : "border-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
                      item.key === UNASSIGNED && "italic"
                    )}
                  >
                    <span className="truncate">{item.label}</span>
                    <span
                      className={cn(
                        "rounded-full px-1.5 text-xs tabular-nums",
                        active ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}
                    >
                      {item.count}
                    </span>
                  </button>
                );
              })}
        </div>
      </nav>

      <div className="min-w-0 space-y-4">
        {missingSku && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
            <span>
              No price recorded for <span className="font-mono font-medium">{missingSku}</span>.
            </span>
            <button onClick={() => setAddState({ sku: missingSku })} className={secondaryBtn}>
              <Plus className="size-4" />
              Add it
            </button>
          </div>
        )}

        <Card>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Factory className="size-6" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold">{prices === null ? "Loading…" : title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {inScope.length} SKU{inScope.length === 1 ? "" : "s"} · per unit, in RMB
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selected !== ALL && selected !== UNASSIGNED && (
                  <Link href="/supply-chain/partners" className={secondaryBtn}>
                    <ExternalLink className="size-4" />
                    View in Partners
                  </Link>
                )}
                <button onClick={() => setImportOpen(true)} className={secondaryBtn}>
                  <Upload className="size-4" />
                  Import from Excel
                </button>
                <button onClick={() => setAddState({ sku: "" })} className={primaryBtn}>
                  <Plus className="size-4" />
                  Add SKU
                </button>
              </div>
            </div>

            {stats && (
              <dl className="grid grid-cols-3 gap-3">
                {[
                  { label: "Average", value: stats.avg },
                  { label: "Lowest", value: stats.min },
                  { label: "Highest", value: stats.max },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                    <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                      {s.label}
                    </dt>
                    <dd className="text-lg font-semibold tabular-nums">{formatRmb(s.value)}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className={cn(inputClass, "pl-8")}
                placeholder={selected === ALL ? "Search every SKU…" : `Search ${title} SKUs…`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            {prices === null ? (
              <div className="space-y-2">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            ) : visible.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {query
                  ? <>No SKUs match &quot;{search}&quot;.</>
                  : prices.length === 0
                    ? "No prices yet — import the price list from Excel to get started."
                    : "No SKUs for this factory yet."}
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[68rem] border-collapse text-sm">
                  <thead className="bg-muted/50 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    <tr>
                      <th className="px-3 py-2 font-medium">SKU</th>
                      <th className="hidden w-40 px-3 py-2 font-medium sm:table-cell">Factory</th>
                      <th className="w-20 px-3 py-2 font-medium" title="Unit per pack size: SS = standard size">
                        Tier
                      </th>
                      <th className="w-20 px-3 py-2 font-medium">Term</th>
                      <th className="w-24 px-3 py-2 font-medium">Type</th>
                      <th className="w-28 px-3 py-2 text-right font-medium">Price</th>
                      <th className="w-28 px-3 py-2 text-right font-medium" title="Factory to our Guangzhou warehouse">
                        Local delivery
                      </th>
                      <th className="w-28 px-3 py-2 text-right font-medium" title="Guangzhou to US Amazon FBA">
                        Shipping
                      </th>
                      <th className="w-32 px-3 py-2 text-right font-medium">Commission</th>
                      <th
                        className="w-28 px-3 py-2 text-right font-medium"
                        title="Price + local delivery + shipping + commission"
                      >
                        Total
                      </th>
                      <th className="w-24 px-3 py-2 font-medium" title="When the price last changed">
                        Updated
                      </th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((g) => (
                      <Fragment key={g.key}>
                        {selected === ALL && (
                          <tr className="bg-muted/40">
                            <td colSpan={12} className="border-t border-border px-3 py-1.5">
                              <button
                                onClick={() => select(g.key)}
                                className="text-xs font-semibold tracking-wide uppercase hover:underline"
                              >
                                {g.label}
                              </button>
                              <span className="ml-2 text-xs text-muted-foreground">{g.rows.length}</span>
                            </td>
                          </tr>
                        )}
                        {g.rows.map((row) => (
                          <PriceRow
                            key={row.id}
                            row={row}
                            factories={factories}
                            highlighted={highlight === row.id}
                            onPrice={(v) => savePrice(row, v)}
                            onFactory={(id) => saveFactory(row, id)}
                            onDetails={(changes) => saveDetails(row, changes)}
                            onDelete={() => handleDelete(row)}
                          />
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Click any amount to edit it. Enter or clicking away saves; Esc cancels. Type Supplier (or 0) in Local
              delivery when the supplier pays; FOB rows show it by default. Total is blank until a row has a shipping
              fee.
            </p>
          </CardContent>
        </Card>
      </div>

      <AddPriceDialog
        state={addState}
        factories={factories}
        defaultFactory={selected === ALL || selected === UNASSIGNED ? null : selected}
        onClose={() => setAddState(null)}
        onSaved={() => {
          setMissingSku(null);
          refresh();
        }}
      />
      <ImportPricesSheet open={importOpen} onOpenChange={setImportOpen} onApplied={refresh} />
    </div>
  );
}

function PriceRow({
  row,
  factories,
  highlighted,
  onPrice,
  onFactory,
  onDetails,
  onDelete,
}: {
  row: ProductPrice;
  factories: FactoryRef[];
  highlighted: boolean;
  onPrice: (value: number | null) => void;
  onFactory: (partnerId: string | null) => void;
  onDetails: (changes: Partial<ProductDetails>) => void;
  onDelete: () => void;
}) {
  const commission = commissionRmb(row);
  return (
    <tr
      id={`price-row-${row.id}`}
      className={cn(
        "border-t border-border transition-colors hover:bg-muted/30",
        highlighted && "bg-primary/10 ring-2 ring-primary ring-inset"
      )}
    >
      <td className="px-3 py-1.5 font-mono">{row.sku}</td>
      <td className="hidden px-3 py-1 sm:table-cell">
        <select
          value={row.partner_id ?? ""}
          onChange={(e) => onFactory(e.target.value || null)}
          aria-label={`Factory for ${row.sku}`}
          className="w-full rounded-md border border-transparent bg-transparent px-1.5 py-1 text-sm hover:border-input focus:border-input focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Unassigned</option>
          {factories.map((f) => (
            <option key={f.id} value={f.id}>
              {f.short_name}
            </option>
          ))}
        </select>
      </td>
      <td className="px-1 py-1">
        <DetailSelect label={`Tier for ${row.sku}`} value={row.tier} options={TIERS} onChange={(tier) => onDetails({ tier })} />
      </td>
      <td className="px-1 py-1">
        <DetailSelect label={`Term for ${row.sku}`} value={row.term} options={TERMS} onChange={(term) => onDetails({ term })} />
      </td>
      <td className="px-1 py-1">
        <DetailSelect
          label={`Type for ${row.sku}`}
          value={row.material}
          options={MATERIALS}
          onChange={(material) => onDetails({ material })}
        />
      </td>
      <td className="p-0 text-right">
        <PriceCell value={row.price_rmb} onSave={onPrice} />
      </td>
      <td className="p-0 text-right">
        <PriceCell
          value={row.local_delivery_rmb}
          decimals={4}
          empty={row.term === "FOB" ? "Supplier" : undefined}
          zeroWord="Supplier"
          onSave={(local_delivery_rmb) => onDetails({ local_delivery_rmb })}
        />
      </td>
      <td className="p-0 text-right">
        <PriceCell
          value={row.shipping_fee_rmb}
          decimals={4}
          onSave={(shipping_fee_rmb) => onDetails({ shipping_fee_rmb })}
        />
      </td>
      <td className="p-0 text-right">
        <PriceCell
          value={row.commission_rate === null ? null : Math.round(row.commission_rate * 10000) / 100}
          display={commission === null ? undefined : `${formatRmb(commission)} (${formatPercent(row.commission_rate)})`}
          ariaLabel={`Commission percent for ${row.sku}`}
          onSave={(percent) => onDetails({ commission_rate: percent === null ? null : percent / 100 })}
        />
      </td>
      <td className="px-3 py-1.5 text-right font-semibold tabular-nums">
        {formatRmb(landedCostRmb(row))}
      </td>
      <td className="px-3 py-1.5 text-xs whitespace-nowrap text-muted-foreground tabular-nums">
        {row.price_updated ?? "—"}
      </td>
      <td className="pr-2 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Actions for ${row.sku}`}
            className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.sku)}>
              <Copy />
              Copy SKU
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2 />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

function formatPercent(rate: number | null): string {
  return rate === null ? "" : `${Math.round(rate * 10000) / 100}%`;
}

function DetailSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | null;
  options: readonly string[];
  onChange: (value: string | null) => void;
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      aria-label={label}
      className="w-full rounded-md border border-transparent bg-transparent px-1 py-1 text-sm hover:border-input focus:border-input focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <option value="">—</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function PriceCell({
  value,
  onSave,
  decimals = 2,
  empty,
  zeroWord,
  display,
  ariaLabel,
}: {
  value: number | null;
  onSave: (value: number | null) => void;
  decimals?: number;
  /** Shown instead of a dash when there's no value. */
  empty?: string;
  /** A word that means 0: typing it saves 0, and 0 shows as this word, greyed. */
  zeroWord?: string;
  /** Shown instead of the formatted value, which is still what gets edited. */
  display?: string;
  ariaLabel?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [invalid, setInvalid] = useState(false);

  if (!editing) {
    return (
      <button
        aria-label={ariaLabel}
        onClick={() => {
          setDraft(value === null ? "" : value === 0 && zeroWord ? zeroWord : String(value));
          setInvalid(false);
          setEditing(true);
        }}
        className="block w-full px-3 py-1.5 text-right font-medium whitespace-nowrap tabular-nums hover:bg-accent/60"
      >
        {value === null ? (
          <span className="text-muted-foreground/50">{empty ?? "—"}</span>
        ) : value === 0 && zeroWord ? (
          <span className="text-muted-foreground/50">{zeroWord}</span>
        ) : (
          (display ?? formatRmb(value))
        )}
      </button>
    );
  }

  function commit() {
    const isZeroWord = !!zeroWord && draft.trim().toLowerCase() === zeroWord.toLowerCase();
    const parsed = isZeroWord ? 0 : parsePrice(draft, decimals);
    if (Number.isNaN(parsed)) {
      setInvalid(true);
      return;
    }
    setEditing(false);
    if (parsed !== value) onSave(parsed);
  }

  return (
    <input
      aria-label={ariaLabel}
      autoFocus
      inputMode="decimal"
      value={draft}
      onChange={(e) => {
        setDraft(e.target.value);
        setInvalid(false);
      }}
      onFocus={(e) => e.currentTarget.select()}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Escape") setEditing(false);
        else if (e.key === "Enter") e.currentTarget.blur();
      }}
      className={cn(
        "block w-full bg-background px-3 py-1.5 text-right text-sm tabular-nums ring-2 outline-none ring-inset",
        invalid ? "ring-destructive" : "ring-ring"
      )}
    />
  );
}

function AddPriceDialog({
  state,
  factories,
  defaultFactory,
  onClose,
  onSaved,
}: {
  state: { sku: string } | null;
  factories: FactoryRef[];
  defaultFactory: string | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [sku, setSku] = useState("");
  const [factory, setFactory] = useState("");
  const [price, setPrice] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openedFor, setOpenedFor] = useState(state);

  // Reset the form whenever the dialog is opened again (render-time, not an effect).
  if (state !== openedFor) {
    setOpenedFor(state);
    if (state) {
      setSku(state.sku);
      setFactory(defaultFactory ?? "");
      setPrice("");
      setError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parsePrice(price);
    if (Number.isNaN(parsed)) {
      setError("Enter a valid price");
      return;
    }
    setBusy(true);
    const { error } = await addProductPrice(sku, factory || null, parsed);
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
            <DialogTitle>Add SKU</DialogTitle>
            <DialogDescription>Add one SKU to the factory price list.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <label className="block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">SKU</span>
              <input
                autoFocus={!state?.sku}
                className={cn(inputClass, "font-mono")}
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Factory</span>
              <select className={inputClass} value={factory} onChange={(e) => setFactory(e.target.value)}>
                <option value="">Unassigned</option>
                {factories.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.short_name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Price (RMB)</span>
              <input
                autoFocus={!!state?.sku}
                inputMode="decimal"
                className={cn(inputClass, "tabular-nums")}
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </label>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <button type="submit" disabled={busy || !sku.trim()} className={primaryBtn}>
              {busy ? "Saving…" : "Add"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ImportPricesSheet({
  open,
  onOpenChange,
  onApplied,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplied: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<PriceImportPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function reset() {
    setIsDragging(false);
    setPreview(null);
    setError(null);
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  function handleFile(file: File) {
    reset();
    const formData = new FormData();
    formData.set("file", file);
    startTransition(async () => {
      const { data, error } = await parsePriceExcel(formData);
      if (error) setError(error);
      else setPreview(data);
    });
  }

  function handleApply() {
    if (!preview) return;
    startTransition(async () => {
      const { error } = await importProductPrices(preview.rows);
      if (error) {
        setError(error);
        return;
      }
      handleOpenChange(false);
      onApplied();
    });
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="flex flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Import price list</SheetTitle>
          <SheetDescription>
            Upload the Excel sheet with Factory, SKU and Price (RMB) columns, plus any of Tier, Term, Type, Com, Local
            Delivery, Shipping Fee and Up date. Existing SKUs are updated, new ones are added, and nothing is removed.
            Factories not yet in Partners are created there.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4">
          {!preview && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) handleFile(file);
              }}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-8 text-center text-sm transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-input"
              )}
            >
              <p className="text-muted-foreground">Drag an Excel file here, or</p>
              <button onClick={() => fileInputRef.current?.click()} disabled={isPending} className={primaryBtn}>
                Browse
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                  e.target.value = "";
                }}
              />
              {isPending && <p className="text-xs text-muted-foreground">Reading file…</p>}
            </div>
          )}

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {preview && (
            <>
              <dl className="grid grid-cols-3 gap-2">
                {[
                  { label: "New", value: preview.added },
                  { label: "Updated", value: preview.updated },
                  { label: "Unchanged", value: preview.unchanged },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                    <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                      {s.label}
                    </dt>
                    <dd className="text-lg font-semibold tabular-nums">{s.value}</dd>
                  </div>
                ))}
              </dl>

              {preview.newFactories.length > 0 && (
                <div className="rounded-md border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
                  <p className="font-medium">New factories to add to Partners</p>
                  <p className="mt-1 text-muted-foreground">{preview.newFactories.join(", ")}</p>
                </div>
              )}

              {preview.warnings.length > 0 && (
                <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-700 dark:text-amber-400">
                  {preview.warnings.map((w, i) => (
                    <p key={i}>{w}</p>
                  ))}
                </div>
              )}

              <div className="max-h-[45vh] overflow-y-auto rounded-md border border-border">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="px-3 py-1.5 font-medium">Factory</th>
                      <th className="px-3 py-1.5 font-medium">SKU</th>
                      <th className="px-3 py-1.5 text-right font-medium">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows.map((r) => (
                      <tr key={r.sku} className="border-t border-border">
                        <td className="px-3 py-1">{r.factory || <span className="italic text-muted-foreground">—</span>}</td>
                        <td className="px-3 py-1 font-mono">{r.sku}</td>
                        <td className="px-3 py-1 text-right tabular-nums">{formatRmb(r.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <SheetFooter className="flex-row flex-wrap justify-end gap-2">
          {preview && (
            <button onClick={reset} disabled={isPending} className={secondaryBtn}>
              Start Over
            </button>
          )}
          <button onClick={handleApply} disabled={!preview || isPending} className={primaryBtn}>
            {isPending && preview ? "Importing…" : `Import ${preview?.rows.length ?? ""} rows`}
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
