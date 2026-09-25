"use client";

import { useEffect, useState } from "react";
import { Download, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DeleteConfirm, labelClass } from "@/components/bulk-campaign/library-sections";
import { extractAssetId, extractBrandLogoId } from "@/lib/xlsx/assetId";
import type { Brand, VideoAsset, KeywordTheme } from "@/lib/actions/bulk-campaign";
import {
  savePdpPreset,
  deletePdpPreset,
  type BrandLogo,
  type StoreUrl,
  type PdpPreset,
} from "@/lib/actions/pdp-bulk-generator";
import ProductBlock, { newBlock, todayIso, toLines, type Block, type BlockMode } from "./product-block";

const DRAFT_KEY = "portal_pdp_bulk_generator_draft_v1";

function spreadBids(min: number, max: number, n: number): number[] {
  if (n <= 1) return [Number(min.toFixed(2))];
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const v = min + ((max - min) * i) / (n - 1);
    out.push(Number(v.toFixed(2)));
  }
  return out;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1));
    [a[i], a[r]] = [a[r], a[i]];
  }
  return a;
}

function distributeKeywords(
  all: string[],
  n: number,
  perCampaign: number,
  mode: "sequential" | "random"
): string[][] {
  if (!all.length) return Array.from({ length: n }, () => []);
  const k = perCampaign > 0 ? Math.min(perCampaign, all.length) : all.length;
  const result: string[][] = [];
  if (mode === "random") {
    for (let i = 0; i < n; i++) result.push(shuffle(all).slice(0, k));
    return result;
  }
  let p = 0;
  for (let i = 0; i < n; i++) {
    const slice: string[] = [];
    for (let c = 0; c < k; c++) {
      slice.push(all[p % all.length]);
      p++;
    }
    result.push(slice);
  }
  return result;
}

function buildName(
  template: string,
  vars: { n: number; bid: number; kw: number; asin: string; date: string }
): string {
  const t = (template || "").trim() || "Campaign {n}";
  return t
    .replaceAll("{n}", String(vars.n))
    .replaceAll("{bid}", vars.bid.toFixed(2))
    .replaceAll("{kw}", String(vars.kw))
    .replaceAll("{asin}", vars.asin)
    .replaceAll("{date}", vars.date);
}

// Brand (Product Collection) ads need at least 3 ASINs, so show 3 empty boxes.
function padBrandAsins(b: Block): Block {
  if (b.asins.length >= 3) return b;
  return { ...b, asins: [...b.asins, ...Array(3 - b.asins.length).fill("")] };
}

function readDraft(firstBrandId: string): {
  videoBlocks?: Block[];
  brandBlocks?: Block[];
  fileName?: string;
  campaignType?: "video" | "brand";
} {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return {};
    const draft = JSON.parse(raw);
    const load = (arr: unknown) =>
      Array.isArray(arr) && arr.length
        ? arr.map((b) => ({ ...newBlock(firstBrandId), ...(b as Block) }))
        : undefined;
    return {
      videoBlocks: load(draft.videoBlocks),
      brandBlocks: load(draft.brandBlocks)?.map(padBrandAsins),
      fileName: typeof draft.fileName === "string" ? draft.fileName : undefined,
      campaignType:
        draft.campaignType === "brand" || draft.campaignType === "video" ? draft.campaignType : undefined,
    };
  } catch {
    return {}; // ignore bad draft
  }
}

export default function GenerateForm({
  brands,
  assets,
  logos,
  storeUrls,
  themes,
  presets,
  onPresetsChanged,
}: {
  brands: Brand[];
  assets: VideoAsset[];
  logos: BrandLogo[];
  storeUrls: StoreUrl[];
  themes: KeywordTheme[];
  presets: PdpPreset[];
  onPresetsChanged: () => void;
}) {
  const firstBrandId = brands[0]?.id ?? "";

  // Video Ads and Brand Ads keep entirely separate boxes, so switching between
  // them never disturbs the other's settings.
  // Restored once on mount from an in-progress draft (e.g. after a reload).
  // This form only renders client-side, after the page's data has loaded.
  const [draft] = useState(() => readDraft(firstBrandId));
  const [videoBlocks, setVideoBlocks] = useState<Block[]>(
    () => draft.videoBlocks ?? [newBlock(firstBrandId)]
  );
  const [brandBlocks, setBrandBlocks] = useState<Block[]>(
    () => draft.brandBlocks ?? [padBrandAsins(newBlock(firstBrandId))]
  );
  const [campaignType, setCampaignType] = useState<"video" | "brand">(draft.campaignType ?? "video");
  const [fileName, setFileName] = useState(draft.fileName ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [presetBusy, setPresetBusy] = useState(false);
  const [pendingPresetDelete, setPendingPresetDelete] = useState<PdpPreset | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const isBrand = campaignType === "brand";
  const blocks = isBrand ? brandBlocks : videoBlocks;
  const setBlocks = isBrand ? setBrandBlocks : setVideoBlocks;

  // Each box picks its own destination, so mode is computed per box.
  const blockMode = (b: Block): BlockMode =>
    isBrand ? "brand" : b.videoTarget === "store" ? "store" : "video";

  // Auto-save the draft whenever the form changes.
  useEffect(() => {
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ videoBlocks, brandBlocks, fileName, campaignType })
      );
    } catch {
      // ignore
    }
  }, [videoBlocks, brandBlocks, fileName, campaignType]);

  function updateBlock(i: number, b: Block) {
    setBlocks(blocks.map((x, j) => (j === i ? b : x)));
  }
  function removeBlock(i: number) {
    setBlocks(blocks.filter((_, j) => j !== i));
  }
  function addBlock() {
    const nb = newBlock(firstBrandId);
    if (isBrand) setBrandBlocks([...brandBlocks, padBrandAsins(nb)]);
    else setVideoBlocks([...videoBlocks, nb]);
  }
  function clearForm() {
    const nb = newBlock(firstBrandId);
    setBlocks([isBrand ? padBrandAsins(nb) : nb]);
    setFileName("");
    setError(null);
  }

  async function handleSavePreset(sku: string, block: Block) {
    setError(null);
    setPresetBusy(true);
    const { error: e } = await savePdpPreset(sku, block as unknown as Record<string, unknown>);
    setPresetBusy(false);
    if (e) {
      setError(e);
      return;
    }
    onPresetsChanged();
  }

  async function handleDeletePreset(p: PdpPreset) {
    setPresetBusy(true);
    const { error: e } = await deletePdpPreset(p.id);
    setPresetBusy(false);
    if (e) setError(e);
    onPresetsChanged();
  }

  const totalCampaigns = blocks.reduce((sum, b) => {
    const n = Math.max(1, parseInt(b.numCampaigns || "1", 10) || 1);
    // PDP video: each ASIN gets its own batch of n campaigns. Store/Brand: the
    // ASINs form one collection (n campaigns).
    const asinCount = Math.max(1, b.asins.map((a) => a.trim()).filter(Boolean).length);
    return sum + (blockMode(b) === "video" ? n * asinCount : n);
  }, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const seen = new Map<string, number>();
    const payload: unknown[] = [];
    const today = todayIso();

    for (let bi = 0; bi < blocks.length; bi++) {
      const block = blocks[bi];
      const label = `Product ${bi + 1}`;
      const m = blockMode(block);
      const sheet: "video" | "brand" = m === "video" ? "video" : "brand";

      if (!block.brandId) {
        setError(`${label}: choose a Brand Profile.`);
        return;
      }
      if (block.startDate < today) {
        setError(`${label}: start date can't be before today (${today}).`);
        return;
      }

      const matchTypes = [
        block.matchExact && "exact",
        block.matchPhrase && "phrase",
        block.matchBroad && "broad",
      ].filter(Boolean) as ("exact" | "phrase" | "broad")[];
      if (!matchTypes.length) {
        setError(`${label}: select at least one match type.`);
        return;
      }

      const cleanAsins = block.asins.map((a) => a.trim()).filter(Boolean);
      if (!cleanAsins.length) {
        setError(`${label}: enter at least one ASIN.`);
        return;
      }

      let videoAssetId = "";
      let storeUrl = "";
      let brandLogoAssetId = "";

      // Video asset — needed by PDP video and Store video.
      if (m === "video" || m === "store") {
        videoAssetId =
          block.videoSource === "manual" ? extractAssetId(block.manualVideoAssetId) : block.videoAssetId;
        if (!videoAssetId) {
          setError(`${label}: select or enter a video asset.`);
          return;
        }
      }

      // Store creative — needed by Store video and Brand collection.
      // Brand collection can use a "Product List" landing page (no URL).
      const useProductList = m === "brand" && block.landingType === "productList";
      if (m === "store" || m === "brand") {
        storeUrl =
          block.urlSource === "manual"
            ? block.storeUrl.trim()
            : storeUrls.find((u) => u.id === block.storeUrlId)?.url.trim() ?? "";
        brandLogoAssetId =
          block.logoSource === "manual" ? extractBrandLogoId(block.brandLogoAssetId) : block.logoAssetId;
        if (!useProductList && !storeUrl) {
          setError(`${label}: enter the Store landing page URL.`);
          return;
        }
        if (!brandLogoAssetId) {
          setError(`${label}: select or enter a brand logo.`);
          return;
        }
      }

      // ASIN count rules per mode.
      if (m === "store" && cleanAsins.length !== 3) {
        setError(`${label}: a Store video needs exactly 3 ASINs.`);
        return;
      }
      if (m === "brand" && (cleanAsins.length < 3 || cleanAsins.length > 10)) {
        setError(`${label}: a Product Collection ad needs 3–10 ASINs.`);
        return;
      }

      const selectedTheme = themes.find((t) => t.id === block.keywordThemeId);
      if (block.keywordSource === "theme" && !selectedTheme) {
        setError(`${label}: select a keyword theme.`);
        return;
      }
      const kwList =
        block.keywordSource === "manual"
          ? toLines(block.manualKeywords)
          : selectedTheme
          ? toLines(selectedTheme.keywords)
          : [];
      const negatives =
        block.keywordSource === "manual"
          ? toLines(block.manualNegatives)
          : selectedTheme
          ? toLines(selectedTheme.negative_keywords)
          : [];
      if (!kwList.length) {
        setError(`${label}: add at least one keyword.`);
        return;
      }

      const n = Math.max(1, parseInt(block.numCampaigns || "1", 10) || 1);
      const perCamp = Math.max(0, parseInt(block.keywordsPerCampaign || "0", 10) || 0);
      let bids: number[];
      if (block.bidMode === "list") {
        const parsed = Array.from({ length: n }, (_, i) => parseFloat(block.bidValues[i] ?? ""));
        const missing = parsed.findIndex((v) => Number.isNaN(v) || v <= 0);
        if (missing !== -1) {
          setError(`${label}: enter a bid for campaign #${missing + 1}.`);
          return;
        }
        bids = parsed.map((v) => Number(v.toFixed(2)));
      } else if (block.bidMode === "fixed") {
        const bid = parseFloat(block.bidFixed || "0");
        if (!(bid > 0)) {
          setError(`${label}: enter a bid greater than 0.`);
          return;
        }
        bids = Array.from({ length: n }, () => Number(bid.toFixed(2)));
      } else {
        const min = parseFloat(block.bidMin || "0");
        const max = parseFloat(block.bidMax || "0");
        if (!(min > 0) || !(max > 0)) {
          setError(`${label}: enter a min and max bid greater than 0.`);
          return;
        }
        bids = spreadBids(min, max, n);
      }
      const dist = distributeKeywords(kwList, n, perCamp, block.keywordMode);
      const kwPerName = perCamp > 0 ? perCamp : kwList.length;
      const budgetOverride =
        block.budgetMode === "fixed" ? Number(parseFloat(block.budgetValue || "0")) : undefined;

      const uniqueName = (raw: string) => {
        const c = (seen.get(raw) ?? 0) + 1;
        seen.set(raw, c);
        return c > 1 ? `${raw} ${c}` : raw;
      };

      if (m === "brand" || m === "store") {
        // One ad per campaign; all ASINs shown together. Store video also
        // carries the video asset.
        for (let i = 0; i < n; i++) {
          const name = uniqueName(
            buildName(block.campaignName, {
              n: i + 1,
              bid: bids[i],
              kw: kwPerName,
              asin: cleanAsins[0] ?? "",
              date: block.startDate,
            })
          );
          payload.push({
            _sheet: sheet,
            brandId: block.brandId,
            campaignName: name,
            bid: bids[i],
            budget: budgetOverride,
            startDate: block.startDate,
            collectionAsins: cleanAsins,
            storeUrl,
            brandLogoAssetId,
            headline: block.headline,
            adType: m === "store" ? "storeVideo" : "collection",
            videoAssetId: m === "store" ? videoAssetId : undefined,
            landingPageType: useProductList ? "Product List" : "Store",
            keywords: dist[i],
            negativeKeywords: negatives,
            matchTypes,
          });
        }
      } else {
        for (const asinValue of cleanAsins) {
          for (let i = 0; i < n; i++) {
            const name = uniqueName(
              buildName(block.campaignName, {
                n: i + 1,
                bid: bids[i],
                kw: kwPerName,
                asin: asinValue,
                date: block.startDate,
              })
            );
            payload.push({
              _sheet: sheet,
              brandId: block.brandId,
              campaignName: name,
              asin: asinValue,
              bid: bids[i],
              budget: budgetOverride,
              startDate: block.startDate,
              videoAssetId,
              keywords: dist[i],
              negativeKeywords: negatives,
              matchTypes,
            });
          }
        }
      }
    }

    if (!payload.length) {
      setError("Nothing to generate.");
      return;
    }

    // Which sheets does this file span? Drives the default filename prefix.
    const modes = new Set(blocks.map(blockMode));
    const hasVideo = modes.has("video");
    const hasBrandSheet = modes.has("brand") || modes.has("store");

    setLoading(true);
    try {
      const res = await fetch("/api/tools/pdp-bulk-generator/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaigns: payload }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Generation failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const custom = fileName.trim().replace(/\.xlsx$/i, "").replace(/[\\/:*?"<>|]/g, "-");
      const prefix =
        hasVideo && hasBrandSheet
          ? "SB_Bulk"
          : hasBrandSheet
          ? modes.has("brand")
            ? "Brand_Bulk"
            : "StoreVideo_Bulk"
          : "Video_Bulk";
      a.download = custom ? `${custom}.xlsx` : `${prefix}_${payload.length}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="space-y-2">
          <label className={labelClass}>Campaign type</label>
          <SegmentedControl
            value={campaignType}
            onValueChange={setCampaignType}
            options={[
              { value: "video", label: "Video Ads" },
              { value: "brand", label: "Brand Ads" },
            ]}
          />
          <p className="text-xs text-muted-foreground">
            {isBrand
              ? "Sponsored Brands Product Collection — brand logo + 3–10 ASINs; each box links to a Store or a new landing page."
              : "Sponsored Brands Video — each box chooses PDP (1 ASIN) or Store (3 ASINs). Mixed boxes go into one file."}
          </p>
        </CardContent>
      </Card>

      {blocks.map((b, i) => (
        <ProductBlock
          key={b.id}
          block={b}
          index={i}
          total={blocks.length}
          mode={blockMode(b)}
          brands={brands}
          assets={assets}
          logos={logos}
          storeUrls={storeUrls}
          themes={themes}
          presets={presets}
          presetBusy={presetBusy}
          onChange={(nb) => updateBlock(i, nb)}
          onRemove={() => removeBlock(i)}
          onSavePreset={handleSavePreset}
          onDeletePreset={setPendingPresetDelete}
        />
      ))}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" onClick={addBlock}>
          <Plus />
          Add product
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => setConfirmClear(true)}
        >
          Clear form
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Will create <span className="font-medium text-foreground">{totalCampaigns}</span> campaign
            {totalCampaigns === 1 ? "" : "s"} across {blocks.length} product
            {blocks.length === 1 ? "" : "s"} in one file.
          </p>
          <div className="max-w-md">
            <label className={labelClass}>File name (optional)</label>
            <Input
              placeholder="Leave blank for the default name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
            <p className="mt-1 text-xs text-muted-foreground">&quot;.xlsx&quot; is added automatically.</p>
          </div>
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <Button type="submit" disabled={loading}>
            <Download />
            {loading ? "Generating…" : "Generate Bulk File"}
          </Button>
        </CardContent>
      </Card>

      <DeleteConfirm
        item={pendingPresetDelete}
        onCancel={() => setPendingPresetDelete(null)}
        onConfirm={(p) => handleDeletePreset(p)}
        title="Delete saved setting?"
        describe={(p) => (
          <>
            This deletes the saved setting <span className="font-medium text-foreground">{p.sku}</span>.
          </>
        )}
      />

      <AlertDialog open={confirmClear} onOpenChange={setConfirmClear}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear the form?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes every {isBrand ? "Brand Ads" : "Video Ads"} product box and starts over.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                clearForm();
                setConfirmClear(false);
              }}
            >
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
