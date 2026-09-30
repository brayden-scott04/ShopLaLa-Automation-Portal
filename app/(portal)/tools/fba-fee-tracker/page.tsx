import { PageHeader } from "@/components/page-header";
import { fbaFeeTracker } from "@/lib/tools";
import FbaFeeTrackerView from "./fba-fee-tracker-view";

export default function FbaFeeTrackerPage() {
  return (
    <>
      <PageHeader
        icon={fbaFeeTracker.icon}
        title={fbaFeeTracker.name}
        description={fbaFeeTracker.description}
      />
      <FbaFeeTrackerView />
    </>
  );
}
