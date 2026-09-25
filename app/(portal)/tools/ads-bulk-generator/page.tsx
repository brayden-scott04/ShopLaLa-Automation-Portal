"use client";

import { useEffect, useState, useTransition } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BrandsSection,
  AssetsSection,
  KeywordGarageSection,
} from "@/components/bulk-campaign/library-sections";
import { adsBulkGenerator } from "@/lib/tools";
import { extractBrandLogoId } from "@/lib/xlsx/assetId";
import {
  listBrands,
  listVideoAssets,
  listKeywordThemes,
  type Brand,
  type VideoAsset,
  type KeywordTheme,
} from "@/lib/actions/bulk-campaign";
import {
  listBrandLogos,
  createBrandLogo,
  updateBrandLogo,
  deleteBrandLogo,
  listStoreUrls,
  createStoreUrl,
  updateStoreUrl,
  deleteStoreUrl,
  listPdpPresets,
  type BrandLogo,
  type StoreUrl,
  type PdpPreset,
} from "@/lib/actions/pdp-bulk-generator";
import GenerateForm from "./generate-form";
import { BrandLibrarySection } from "./brand-library-section";

type Step = "generate" | "library";

export default function AdsBulkGeneratorPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [assets, setAssets] = useState<VideoAsset[]>([]);
  const [logos, setLogos] = useState<BrandLogo[]>([]);
  const [storeUrls, setStoreUrls] = useState<StoreUrl[]>([]);
  const [themes, setThemes] = useState<KeywordTheme[]>([]);
  const [presets, setPresets] = useState<PdpPreset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("generate");
  const [, startTransition] = useTransition();

  function reload() {
    startTransition(async () => {
      const [b, a, l, u, t, p] = await Promise.all([
        listBrands(),
        listVideoAssets(),
        listBrandLogos(),
        listStoreUrls(),
        listKeywordThemes(),
        listPdpPresets(),
      ]);
      const err = b.error ?? a.error ?? l.error ?? u.error ?? t.error ?? p.error;
      if (err) setError(err);
      else {
        setBrands(b.data ?? []);
        setAssets(a.data ?? []);
        setLogos(l.data ?? []);
        setStoreUrls(u.data ?? []);
        setThemes(t.data ?? []);
        setPresets(p.data ?? []);
        setError(null);
      }
      setIsLoading(false);
    });
  }

  useEffect(() => {
    reload();
  }, []);

  // With no brand profiles there's nothing to generate for, so start on Library.
  const [prevLoading, setPrevLoading] = useState(isLoading);
  if (isLoading !== prevLoading) {
    setPrevLoading(isLoading);
    if (!isLoading && brands.length === 0) setStep("library");
  }

  const libraryCount = brands.length + assets.length + logos.length + storeUrls.length + themes.length;

  return (
    <>
      <PageHeader
        icon={adsBulkGenerator.icon}
        title={adsBulkGenerator.name}
        description={adsBulkGenerator.description}
      />

      <div className="space-y-6 px-6 pb-6 md:px-8 md:pb-8">
        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {isLoading ? (
          <Card>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ) : (
          <>
            <Tabs value={step} onValueChange={(v) => setStep(v as Step)}>
              <TabsList>
                <TabsTrigger value="generate">Generate</TabsTrigger>
                <TabsTrigger value="library" className="gap-1.5">
                  Library
                  {libraryCount > 0 && <Badge variant="secondary">{libraryCount}</Badge>}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* GenerateForm stays mounted while hidden so its in-progress
                product boxes survive switching tabs. */}
            <div className={step === "generate" ? "" : "hidden"}>
              {brands.length === 0 ? (
                <Card>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Add a Brand Profile in the Library tab first.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <GenerateForm
                  brands={brands}
                  assets={assets}
                  logos={logos}
                  storeUrls={storeUrls}
                  themes={themes}
                  presets={presets}
                  onPresetsChanged={reload}
                />
              )}
            </div>

            <div className={step === "library" ? "space-y-6" : "hidden"}>
              <BrandsSection brands={brands} onChanged={reload} />
              <AssetsSection brands={brands} assets={assets} onChanged={reload} />
              <BrandLibrarySection
                title="Brand Logos"
                description="Saved brand logo asset IDs for Store video and Product Collection ads"
                noun="Logo"
                valueLabel="Logo asset ID or URL"
                valuePlaceholder="amzn1.assetlibrary.asset1.XXXXX:version_v1"
                brands={brands}
                items={logos.map((l) => ({ id: l.id, brand_id: l.brand_id, label: l.label, value: l.asset_id }))}
                normalize={extractBrandLogoId}
                onCreate={({ brandId, label, value }) => createBrandLogo({ brandId, label, assetId: value })}
                onUpdate={(id, { label, value }) => updateBrandLogo(id, { label, assetId: value })}
                onDelete={deleteBrandLogo}
                onChanged={reload}
              />
              <BrandLibrarySection
                title="Store URLs"
                description="Saved Store landing page URLs for Store video and Product Collection ads"
                noun="Store URL"
                valueLabel="Store page URL"
                valuePlaceholder="https://www.amazon.com/stores/page/…"
                brands={brands}
                items={storeUrls.map((u) => ({ id: u.id, brand_id: u.brand_id, label: u.label, value: u.url }))}
                onCreate={({ brandId, label, value }) => createStoreUrl({ brandId, label, url: value })}
                onUpdate={(id, { label, value }) => updateStoreUrl(id, { label, url: value })}
                onDelete={deleteStoreUrl}
                onChanged={reload}
              />
              <KeywordGarageSection brands={brands} themes={themes} onChanged={reload} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
