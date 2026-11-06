import { PageHeader } from "@/components/page-header";
import { WorkflowView } from "@/components/npl-workflow/workflow-view";
import { newProductLaunchWorkflow } from "@/lib/nav";

// Read-only for everyone with access to the page; admins and leaders get "Edit workflow"
// (and lib/actions/npl-workflow.ts + app/api/npl-workflow re-check that on every write).
export default function NewProductLaunchWorkflowPage() {
  return (
    <>
      <PageHeader
        icon={newProductLaunchWorkflow.icon}
        title={newProductLaunchWorkflow.name}
        description={newProductLaunchWorkflow.description}
      />
      <div className="p-4 md:p-6">
        <WorkflowView />
      </div>
    </>
  );
}
