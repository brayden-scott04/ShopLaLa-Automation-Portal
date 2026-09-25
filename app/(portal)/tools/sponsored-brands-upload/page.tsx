"use client";

import { useEffect, useState, useTransition } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BrandsSection,
  AssetsSection,
  KeywordGarageSection,
} from "@/components/bulk-campaign/library-sections";
import { bulkCampaignUpload } from "@/lib/tools";
import {
  listBrands,
  listVideoAssets,
  listKeywordThemes,
  listPresets,
  listProducts,
  type Brand,
  type VideoAsset,
  type KeywordTheme,
  type Preset as ActionPreset,
  type CampaignProduct,
} from "@/lib/actions/bulk-campaign";
import GenerateForm from "./generate-form";
import type { Preset } from "./product-block";

type WizardStep = "library" | "build";
const STEPS: { key: WizardStep; label: string }[] = [
  { key: "library", label: "Library" },
  { key: "build", label: "Build Ads" },
];

export default function BulkCampaignUploadPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [assets, setAssets] = useState<VideoAsset[]>([]);
  const [themes, setThemes] = useState<KeywordTheme[]>([]);
  const [presets, setPresets] = useState<ActionPreset[]>([]);
  const [products, setProducts] = useState<CampaignProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<WizardStep>("library");
  const [, startTransition] = useTransition();

  function reload() {
    startTransition(async () => {
      const [b, a, t, p, pr] = await Promise.all([
        listBrands(),
        listVideoAssets(),
        listKeywordThemes(),
        listPresets(),
        listProducts(),
      ]);
      const err = b.error ?? a.error ?? t.error ?? p.error ?? pr.error;
      if (err) setError(err);
      else {
        setBrands(b.data ?? []);
        setAssets(a.data ?? []);
        setThemes(t.data ?? []);
        setPresets(p.data ?? []);
        setProducts(pr.data ?? []);
        setError(null);
      }
      setIsLoading(false);
    });
  }

  useEffect(() => {
    reload();
  }, []);

  const presetsForForm: Preset[] = presets.map((p) => ({
    id: p.id,
    sku: p.sku,
    config: p.config as never,
  }));

  const libraryCount = brands.length + assets.length + themes.length;

  return (
    <>
      <PageHeader
        icon={bulkCampaignUpload.icon}
        title={bulkCampaignUpload.name}
        description={bulkCampaignUpload.description}
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
            <Tabs value={step} onValueChange={(v) => setStep(v as WizardStep)}>
              <TabsList>
                {STEPS.map((s) => (
                  <TabsTrigger key={s.key} value={s.key} className="gap-1.5">
                    {s.label}
                    {s.key === "library" && libraryCount > 0 && (
                      <Badge variant="secondary">{libraryCount}</Badge>
                    )}
                    {s.key === "build" && products.length > 0 && (
                      <Badge variant="secondary">{products.length}</Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Library content — GenerateForm stays mounted below so its
                in-progress product config survives switching tabs. */}
            <div className={step === "library" ? "space-y-6" : "hidden"}>
              <BrandsSection brands={brands} onChanged={reload} />
              <AssetsSection brands={brands} assets={assets} onChanged={reload} />
              <KeywordGarageSection brands={brands} themes={themes} onChanged={reload} />
            </div>

            <div className={step === "library" ? "hidden" : ""}>
              <Card>
                <CardHeader>
                  <CardTitle>Build Ads</CardTitle>
                  <CardDescription>
                    Configure one or more ads, then Review &amp; generate to download the bulk
                    file or upload straight to Amazon.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GenerateForm
                    brands={brands}
                    assets={assets}
                    themes={themes}
                    presets={presetsForForm}
                    products={products}
                    onPresetsChanged={reload}
                    onProductsChanged={reload}
                  />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
}
