import { PageHeader } from "@/components/page-header";
import { listingScore } from "@/lib/nav";
import ListingScoreView from "./listing-score-view";

export default function ListingScorePage() {
  return (
    <>
      <PageHeader icon={listingScore.icon} title={listingScore.name} description={listingScore.description} />
      <ListingScoreView />
    </>
  );
}
