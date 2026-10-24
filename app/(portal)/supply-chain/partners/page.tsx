import { PageHeader } from "@/components/page-header";
import { PartnersView } from "@/components/partners/partners-view";
import { partners } from "@/lib/nav";

export default async function PartnersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { view } = await searchParams;
  return (
    <>
      <PageHeader icon={partners.icon} title={partners.name} description={partners.description} />
      <PartnersView initialView={view === "forwarders" ? "forwarder" : "factory"} />
    </>
  );
}
