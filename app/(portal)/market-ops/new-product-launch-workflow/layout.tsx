import { assertItemAccess } from "@/lib/permissions";

export default async function NewProductLaunchWorkflowLayout({ children }: { children: React.ReactNode }) {
  await assertItemAccess("marketOps", "new-product-launch-workflow");
  return <>{children}</>;
}
