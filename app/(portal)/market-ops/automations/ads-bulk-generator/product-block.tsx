"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { labelClass, selectClass } from "@/components/bulk-campaign/library-sections";
import { cn } from "@/lib/utils";
import type { Brand, VideoAsset, KeywordTheme } from "@/lib/actions/bulk-campaign";
import type { BrandLogo, StoreUrl, PdpPreset } from "@/lib/actions/pdp-bulk-generator";
import SearchableSelect from "./searchable-select";

export type BlockMode = "video" | "store" | "brand";

// One fully independent product box: brand + name/date + ASIN(s) + creative +
// keywords + spread. A saved setting stores exactly one of these.
export type Block = {
  id: string;
  brandId: string;
  campaignName: string;
  startDate: string;
  asins: string[];
  // Video campaigns only: does the video link to the product page (PDP, 1 ASIN)
  // or to the Store (3 ASINs)? Chosen per box.
  videoTarget: "pdp" | "store";
  videoSource: "saved" | "manual";
  videoAssetId: string;
  manualVideoAssetId: string;
  // Store creative — used by Store video and Brand (Product Collection).
  landingType: "store" | "productList";
  urlSource: "saved" | "manual";
  storeUrlId: string; // chosen from the Store URLs library
  storeUrl: string; // manual entry
  logoSource: "saved" | "manual";
  logoAssetId: string; // chosen from the Brand Logos library
  brandLogoAssetId: string; // manual entry
  headline: string;
  keywordSource: "theme" | "manual";
  keywordThemeId: string;
  manualKeywords: string;
  manualNegatives: string;
  numCampaigns: string;
  keywordsPerCampaign: string;
  keywordMode: "sequential" | "random";
  bidMode: "fixed" | "range" | "list";
  bidFixed: string;
  bidMin: string;
  bidMax: string;
  bidValues: string[]; // custom list mode: one bid per campaign
  budgetMode: "auto" | "fixed";
  budgetValue: string;
  matchExact: boolean;
  matchPhrase: boolean;
  matchBroad: boolean;
};

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

let blockSeq = 0;
export function newBlock(brandId = ""): Block {
  blockSeq += 1;
  return {
    id: `blk_${Date.now()}_${blockSeq}`,
    brandId,
    campaignName: "",
    startDate: todayIso(),
    asins: [""],
    videoTarget: "pdp",
    videoSource: "saved",
    videoAssetId: "",
    manualVideoAssetId: "",
    landingType: "store",
    urlSource: "saved",
    storeUrlId: "",
    storeUrl: "",
    logoSource: "saved",
    logoAssetId: "",
    brandLogoAssetId: "",
    headline: "",
    keywordSource: "theme",
    keywordThemeId: "",
    manualKeywords: "",
    manualNegatives: "",
    numCampaigns: "10",
    keywordsPerCampaign: "10",
    keywordMode: "sequential",
    bidMode: "fixed",
    bidFixed: "0.37",
    bidMin: "0.33",
    bidMax: "0.71",
    bidValues: [],
    budgetMode: "auto",
    budgetValue: "10",
    matchExact: true,
    matchPhrase: true,
    matchBroad: true,
  };
}

export function toLines(text: string) {
  return text.split("\n").map((k) => k.trim()).filter(Boolean);
}

function Field({ label, hint, children }: { label: string; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function ProductBlock({
  block,
  index,
  total,
  mode,
  brands,
  assets,
  logos,
  storeUrls,
  themes,
  presets,
  presetBusy,
  onChange,
  onRemove,
  onSavePreset,
  onDeletePreset,
}: {
  block: Block;
  index: number;
  total: number;
  mode: BlockMode;
  brands: Brand[];
  assets: VideoAsset[];
  logos: BrandLogo[];
  storeUrls: StoreUrl[];
  themes: KeywordTheme[];
  presets: PdpPreset[];
  presetBusy: boolean;
  onChange: (b: Block) => void;
  onRemove: () => void;
  onSavePreset: (sku: string, block: Block) => void;
  onDeletePreset: (p: PdpPreset) => void;
}) {
  const isBrand = mode === "brand";
  const isStore = mode === "store";
  const needsVideo = mode === "video" || mode === "store";
  const needsStoreCreative = mode === "store" || mode === "brand";
  const set = (patch: Partial<Block>) => onChange({ ...block, ...patch });

  const [skuSearch, setSkuSearch] = useState("");
  const [skuName, setSkuName] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const brandAssets = assets.filter((a) => a.brand_id === block.brandId);
  const brandLogos = logos.filter((l) => l.brand_id === block.brandId);
  const brandUrls = storeUrls.filter((u) => u.brand_id === block.brandId);
  const brandThemes = themes.filter((t) => t.brand_id === null || t.brand_id === block.brandId);
  const effectiveLogo =
    block.logoSource === "manual" ? block.brandLogoAssetId.trim() : block.logoAssetId;
  const effectiveStoreUrl =
    block.urlSource === "manual"
      ? block.storeUrl.trim()
      : storeUrls.find((u) => u.id === block.storeUrlId)?.url.trim() ?? "";

  const filteredPresets = skuSearch.trim()
    ? presets.filter((p) => p.sku.toLowerCase().includes(skuSearch.trim().toLowerCase()))
    : presets;

  // How many bid boxes to show in "Custom list" mode.
  const campaignCount = Math.max(1, parseInt(block.numCampaigns || "1", 10) || 1);

  const selectedTheme = themes.find((t) => t.id === block.keywordThemeId);
  const kwCount =
    block.keywordSource === "manual"
      ? toLines(block.manualKeywords).length
      : selectedTheme
      ? toLines(selectedTheme.keywords).length
      : 0;

  // Everything this box needs before it can generate. Drives the ✓ badge.
  const cleanAsins = block.asins.map((a) => a.trim()).filter(Boolean);
  const videoOk =
    block.videoSource === "manual" ? !!block.manualVideoAssetId.trim() : !!block.videoAssetId;
  const bidsOk =
    block.bidMode === "list"
      ? Array.from({ length: campaignCount }, (_, i) => parseFloat(block.bidValues[i] ?? "")).every(
          (v) => !Number.isNaN(v) && v > 0
        )
      : block.bidMode === "fixed"
      ? parseFloat(block.bidFixed || "0") > 0
      : parseFloat(block.bidMin || "0") > 0 && parseFloat(block.bidMax || "0") > 0;
  // Brand collection can use a Product List landing page (no URL needed).
  const usesProductList = isBrand && block.landingType === "productList";
  const storeCreativeOk = !!effectiveLogo && (usesProductList || !!effectiveStoreUrl);
  const creativeOk = (!needsVideo || videoOk) && (!needsStoreCreative || storeCreativeOk);
  const asinsOk = isStore
    ? cleanAsins.length === 3
    : isBrand
    ? cleanAsins.length >= 3 && cleanAsins.length <= 10
    : cleanAsins.length > 0;
  const isComplete =
    !!block.brandId &&
    !!block.campaignName.trim() &&
    asinsOk &&
    creativeOk &&
    kwCount > 0 &&
    bidsOk &&
    (block.matchExact || block.matchPhrase || block.matchBroad);

  // Short label shown when the box is collapsed: campaign name, trimmed to 25 chars.
  const nameSource = block.campaignName.trim() || cleanAsins[0] || "";
  const shortName = !nameSource
    ? "untitled"
    : nameSource.length > 25
    ? `${nameSource.slice(0, 25)}…`
    : nameSource;

  function loadPreset(p: PdpPreset) {
    // Keep this box's id; fill from saved setting on top of defaults so older
    // presets that are missing newer fields still load cleanly. Start date is
    // always reset to today so old saved dates never carry over.
    onChange({
      ...newBlock(block.brandId),
      ...(p.config as Partial<Block>),
      id: block.id,
      startDate: todayIso(),
    });
    setSkuName(p.sku);
  }

  return (
    <Card>
      <CardHeader className="grid-cols-1! sm:grid-cols-[1fr_auto]!">
        <CardTitle className="flex min-w-0 items-center gap-2">
          <span>Product {index + 1}</span>
          <span
            title={isComplete ? "All required fields filled" : "Some fields still missing"}
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-full border",
              isComplete ? "border-primary bg-primary text-primary-foreground" : "border-border text-transparent"
            )}
          >
            <Check className="size-3" />
          </span>
          {collapsed && (
            <span className="truncate text-sm font-normal text-muted-foreground">
              {shortName} · {campaignCount} campaign{campaignCount === 1 ? "" : "s"}
            </span>
          )}
        </CardTitle>
        <CardAction className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={() => setCollapsed((v) => !v)}>
            {collapsed ? <ChevronDown /> : <ChevronUp />}
            {collapsed ? "Show" : "Hide"}
          </Button>
          {total > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-destructive hover:text-destructive"
            >
              Remove
            </Button>
          )}
        </CardAction>
      </CardHeader>

      {!collapsed && (
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Brand Profile">
              <select
                className={selectClass}
                value={block.brandId}
                onChange={(e) => set({ brandId: e.target.value })}
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.country})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Start date">
              <Input
                type="date"
                min={todayIso()}
                value={block.startDate}
                onChange={(e) => set({ startDate: e.target.value })}
              />
            </Field>
          </div>

          <Field
            label="Campaign name template"
            hint={
              <>
                Tokens: <code>{"{bid}"}</code> bid, <code>{"{n}"}</code> campaign #,{" "}
                <code>{"{kw}"}</code> keywords, <code>{"{asin}"}</code>, <code>{"{date}"}</code>.
              </>
            }
          >
            <Input
              placeholder="e.g. Sponsor Brand xxx Bid {bid}"
              value={block.campaignName}
              onChange={(e) => set({ campaignName: e.target.value })}
            />
          </Field>

          {/* Video destination (per box): PDP video vs Store video */}
          {!isBrand && (
            <Field
              label="Video links to"
              hint={
                isStore
                  ? "Video → Store: brand logo + headline + exactly 3 ASINs."
                  : "Video → product page: one video + one ASIN per campaign."
              }
            >
              <SegmentedControl
                value={block.videoTarget}
                onValueChange={(v) => {
                  if (v === "store") {
                    const next = block.asins.slice(0, 3);
                    while (next.length < 3) next.push("");
                    set({ videoTarget: "store", asins: next });
                  } else {
                    set({ videoTarget: "pdp" });
                  }
                }}
                options={[
                  { value: "pdp", label: "PDP (1 ASIN)" },
                  { value: "store", label: "Store (3 ASINs)" },
                ]}
              />
            </Field>
          )}

          {/* ASINs */}
          <Field
            label={
              isStore
                ? "ASINs (exactly 3)"
                : isBrand
                ? "Collection ASINs (3–10)"
                : `ASIN${block.asins.length > 1 ? "s" : ""}`
            }
            hint={
              isStore
                ? "A Store video shows exactly 3 products."
                : isBrand
                ? "These products appear together in one Product Collection ad (3–10 products)."
                : block.asins.length > 1
                ? `Each ASIN gets its own ${campaignCount} campaign${campaignCount === 1 ? "" : "s"} in the file.`
                : undefined
            }
          >
            <div className="space-y-2">
              {block.asins.map((a, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    placeholder={`ASIN ${i + 1}`}
                    value={a}
                    onChange={(e) =>
                      set({ asins: block.asins.map((v, j) => (j === i ? e.target.value : v)) })
                    }
                  />
                  {!isStore && block.asins.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      title="Remove this ASIN"
                      onClick={() => set({ asins: block.asins.filter((_, j) => j !== i) })}
                    >
                      <X />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {!isStore && !(isBrand && block.asins.length >= 10) && (
              <Button
                type="button"
                variant="link"
                size="sm"
                className="mt-1 px-0"
                onClick={() => set({ asins: [...block.asins, ""] })}
              >
                + Add ASIN
              </Button>
            )}
          </Field>

          {needsStoreCreative && (
            <>
              {isBrand && (
                <Field
                  label="Landing page"
                  hint={usesProductList ? "Amazon builds the landing page from your ASINs — no URL needed." : undefined}
                >
                  <SegmentedControl
                    value={block.landingType}
                    onValueChange={(v) => set({ landingType: v })}
                    options={[
                      { value: "store", label: "Store URL" },
                      { value: "productList", label: "New Landing Page" },
                    ]}
                  />
                </Field>
              )}
              {!usesProductList && (
                <Field label="Store landing page URL" hint="The Store page the ad links to.">
                  <SegmentedControl
                    className="mb-2"
                    value={block.urlSource}
                    onValueChange={(v) => set({ urlSource: v })}
                    options={[
                      { value: "saved", label: "From Store URLs" },
                      { value: "manual", label: "Type manually" },
                    ]}
                  />
                  {block.urlSource === "saved" ? (
                    <SearchableSelect
                      value={block.storeUrlId}
                      placeholder={brandUrls.length ? "Select store URL" : "No store URLs for this brand yet"}
                      emptyText="No store URLs match."
                      options={brandUrls.map((u) => ({ value: u.id, label: u.label }))}
                      onChange={(v) => set({ storeUrlId: v })}
                    />
                  ) : (
                    <Input
                      className="font-mono text-xs"
                      placeholder="https://www.amazon.com/stores/page/XXXXXXXX"
                      value={block.storeUrl}
                      onChange={(e) => set({ storeUrl: e.target.value })}
                    />
                  )}
                </Field>
              )}
              <Field label="Brand logo">
                <SegmentedControl
                  className="mb-2"
                  value={block.logoSource}
                  onValueChange={(v) => set({ logoSource: v })}
                  options={[
                    { value: "saved", label: "From Brand Logos" },
                    { value: "manual", label: "Type manually" },
                  ]}
                />
                {block.logoSource === "saved" ? (
                  <SearchableSelect
                    value={block.logoAssetId}
                    placeholder={brandLogos.length ? "Select brand logo" : "No brand logos for this brand yet"}
                    emptyText="No brand logos match."
                    options={brandLogos.map((l) => ({ value: l.asset_id, label: l.label }))}
                    onChange={(v) => set({ logoAssetId: v })}
                  />
                ) : (
                  <Input
                    className="font-mono text-xs"
                    placeholder="amzn1.assetlibrary.asset1.XXXXXXXX:version_v1"
                    value={block.brandLogoAssetId}
                    onChange={(e) => set({ brandLogoAssetId: e.target.value })}
                  />
                )}
              </Field>
              <Field label="Creative headline">
                <Input
                  placeholder="e.g. Shop LaLaGreen wall planters"
                  value={block.headline}
                  onChange={(e) => set({ headline: e.target.value })}
                />
              </Field>
            </>
          )}

          {needsVideo && (
            <Field label="Video asset">
              <SegmentedControl
                className="mb-2"
                value={block.videoSource}
                onValueChange={(v) => set({ videoSource: v })}
                options={[
                  { value: "saved", label: "From Video Assets" },
                  { value: "manual", label: "Type manually" },
                ]}
              />
              {block.videoSource === "saved" ? (
                <SearchableSelect
                  value={block.videoAssetId}
                  placeholder={brandAssets.length ? "Select video asset" : "No video assets for this brand yet"}
                  emptyText="No assets match."
                  options={brandAssets.map((a) => ({ value: a.asset_id, label: a.label }))}
                  onChange={(v) => set({ videoAssetId: v })}
                />
              ) : (
                <Input
                  className="font-mono text-xs"
                  placeholder="amzn1.assetlibrary.asset1.XXXXXXXXXXXXXXXXXXXX"
                  value={block.manualVideoAssetId}
                  onChange={(e) => set({ manualVideoAssetId: e.target.value })}
                />
              )}
            </Field>
          )}

          {/* Keywords */}
          <Field label="Keywords">
            <SegmentedControl
              className="mb-2"
              value={block.keywordSource}
              onValueChange={(v) => set({ keywordSource: v })}
              options={[
                { value: "theme", label: "From Keyword Garage" },
                { value: "manual", label: "Type manually" },
              ]}
            />
            {block.keywordSource === "theme" ? (
              <>
                {brandThemes.length ? (
                  <SearchableSelect
                    value={block.keywordThemeId}
                    placeholder="Select a keyword theme"
                    emptyText="No themes match."
                    options={brandThemes.map((t) => ({
                      value: t.id,
                      label: t.name + (t.brand_id === null ? " (all brands)" : ""),
                    }))}
                    onChange={(v) => set({ keywordThemeId: v })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No themes for this brand yet — create one in the Library tab.
                  </p>
                )}
                {selectedTheme && (
                  <p className="mt-1 text-xs text-muted-foreground">{kwCount} keywords in this theme.</p>
                )}
              </>
            ) : (
              <div className="space-y-3">
                <div>
                  <span className="mb-1 block text-xs text-muted-foreground">Keywords (one per line)</span>
                  <Textarea
                    className="min-h-[120px] font-mono text-xs"
                    placeholder={"outdoor wall planter\nvertical garden\nhanging plant holder"}
                    value={block.manualKeywords}
                    onChange={(e) => set({ manualKeywords: e.target.value })}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">{kwCount} keywords entered.</p>
                </div>
                <div>
                  <span className="mb-1 block text-xs text-muted-foreground">
                    Negative keywords (optional, one per line)
                  </span>
                  <Textarea
                    className="min-h-[70px] font-mono text-xs"
                    placeholder={"cheap\nused"}
                    value={block.manualNegatives}
                    onChange={(e) => set({ manualNegatives: e.target.value })}
                  />
                </div>
              </div>
            )}
          </Field>

          {/* Spread */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Number of campaigns">
              <Input
                type="number"
                min={1}
                value={block.numCampaigns}
                onChange={(e) => set({ numCampaigns: e.target.value })}
              />
            </Field>
            <Field label="Keywords per campaign" hint="0 or blank = all keywords each.">
              <Input
                type="number"
                min={0}
                placeholder="All"
                value={block.keywordsPerCampaign}
                onChange={(e) => set({ keywordsPerCampaign: e.target.value })}
              />
            </Field>
          </div>

          <Field label="Distribute keywords">
            <SegmentedControl
              value={block.keywordMode}
              onValueChange={(v) => set({ keywordMode: v })}
              options={[
                { value: "sequential", label: "Sequential (1–10, 11–20, … wraps)" },
                { value: "random", label: "Random" },
              ]}
            />
          </Field>

          <Field label="Bid">
            <SegmentedControl
              className="mb-2"
              value={block.bidMode}
              onValueChange={(v) => set({ bidMode: v })}
              options={[
                { value: "fixed", label: "Fixed" },
                { value: "range", label: "Range (spread across campaigns)" },
                { value: "list", label: "Custom list" },
              ]}
            />
            {block.bidMode === "fixed" && (
              <Input
                type="number"
                step="0.01"
                className="max-w-40"
                value={block.bidFixed}
                onChange={(e) => set({ bidFixed: e.target.value })}
              />
            )}
            {block.bidMode === "range" && (
              <div className="flex items-end gap-3">
                <div className="max-w-32">
                  <span className="mb-1 block text-xs text-muted-foreground">Min ($)</span>
                  <Input
                    type="number"
                    step="0.01"
                    value={block.bidMin}
                    onChange={(e) => set({ bidMin: e.target.value })}
                  />
                </div>
                <div className="max-w-32">
                  <span className="mb-1 block text-xs text-muted-foreground">Max ($)</span>
                  <Input
                    type="number"
                    step="0.01"
                    value={block.bidMax}
                    onChange={(e) => set({ bidMax: e.target.value })}
                  />
                </div>
              </div>
            )}
            {block.bidMode === "list" && (
              <div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: campaignCount }, (_, i) => (
                    <div key={i} className="w-26">
                      <span className="mb-1 block text-xs text-muted-foreground">#{i + 1}</span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={block.bidValues[i] ?? ""}
                        onChange={(e) => {
                          const next = Array.from(
                            { length: campaignCount },
                            (_, j) => block.bidValues[j] ?? ""
                          );
                          next[i] = e.target.value;
                          set({ bidValues: next });
                        }}
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  One bid per campaign. Change &quot;Number of campaigns&quot; above to add or
                  remove boxes.
                </p>
              </div>
            )}
          </Field>

          <Field label="Daily budget">
            <SegmentedControl
              className="mb-2"
              value={block.budgetMode}
              onValueChange={(v) => set({ budgetMode: v })}
              options={[
                { value: "auto", label: "Auto (from bid, min $2)" },
                { value: "fixed", label: "Fixed amount" },
              ]}
            />
            {block.budgetMode === "fixed" && (
              <Input
                type="number"
                step="0.01"
                min="1"
                className="max-w-40"
                value={block.budgetValue}
                onChange={(e) => set({ budgetValue: e.target.value })}
              />
            )}
          </Field>

          <Field label="Match types">
            <div className="flex gap-4 text-sm">
              {(
                [
                  ["matchExact", "Exact"],
                  ["matchPhrase", "Phrase"],
                  ["matchBroad", "Broad"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-1.5">
                  <Checkbox
                    checked={block[key]}
                    onCheckedChange={(v) => set({ [key]: v === true } as Partial<Block>)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </Field>

          {/* Saved settings (apply only to this box) */}
          <div className="space-y-2 rounded-lg border border-border p-3">
            <button
              type="button"
              onClick={() => setShowSaved((v) => !v)}
              className="flex w-full items-center justify-between text-sm font-medium"
            >
              <span>Saved settings (by SKU)</span>
              <span className="flex items-center gap-1 text-muted-foreground">
                {showSaved ? "Hide" : "Show"}
                {showSaved ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </span>
            </button>

            {showSaved && (
              <>
                <Input
                  placeholder="Search SKU (e.g. WPCT24)"
                  className="max-w-md"
                  value={skuSearch}
                  onChange={(e) => setSkuSearch(e.target.value)}
                />
                {presets.length > 0 && (
                  <div className="max-h-40 space-y-1 overflow-auto">
                    {filteredPresets.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between rounded-lg border border-border px-3 py-1.5"
                      >
                        <span className="font-mono text-sm">{p.sku}</span>
                        <span className="flex gap-1">
                          <Button type="button" variant="ghost" size="xs" onClick={() => loadPreset(p)}>
                            Load
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="xs"
                            disabled={presetBusy}
                            onClick={() => onDeletePreset(p)}
                            className="text-destructive hover:text-destructive"
                          >
                            Delete
                          </Button>
                        </span>
                      </div>
                    ))}
                    {!filteredPresets.length && (
                      <p className="text-sm text-muted-foreground">
                        No SKUs match &quot;{skuSearch}&quot;.
                      </p>
                    )}
                  </div>
                )}
                <div className="flex flex-wrap items-end gap-2">
                  <div className="max-w-xs flex-1">
                    <span className="mb-1 block text-xs text-muted-foreground">Save this box as SKU</span>
                    <Input
                      placeholder="e.g. WPCT24x4-0221"
                      value={skuName}
                      onChange={(e) => setSkuName(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={presetBusy}
                    onClick={() => onSavePreset(skuName.trim(), block)}
                  >
                    {presetBusy ? "Saving…" : "Save settings"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Loading a SKU fills this box only. Start date always resets to today.
                </p>
              </>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
