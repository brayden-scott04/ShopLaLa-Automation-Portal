import { PageHeader } from "@/components/page-header";
import { ProductsView } from "@/components/products/products-view";
import { products } from "@/lib/nav";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { factory, sku } = await searchParams;
  return (
    <>
      <PageHeader icon={products.icon} title={products.name} description={products.description} />
      <ProductsView
        initialFactory={typeof factory === "string" ? factory : null}
        initialSku={typeof sku === "string" ? sku : null}
      />
    </>
  );
}
