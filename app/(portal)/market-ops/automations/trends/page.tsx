import { PageHeader } from "@/components/page-header";
import { trends } from "@/lib/nav";
import TrendsView from "./trends-view";

export default function TrendsPage() {
  return (
    <>
      <PageHeader icon={trends.icon} title={trends.name} description={trends.description} />
      <TrendsView />
    </>
  );
}
