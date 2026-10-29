import { Suspense } from "react";
import { StaffDrilldown } from "@/components/team/staff-drilldown";

export default async function StaffPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  // StaffDrilldown reads ?tab with useSearchParams, which needs a Suspense boundary.
  return (
    <Suspense>
      <StaffDrilldown username={decodeURIComponent(username)} />
    </Suspense>
  );
}
