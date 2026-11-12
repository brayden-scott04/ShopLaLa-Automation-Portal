import { assertItemAccess } from "@/lib/permissions";

// "Pull from Amazon" walks every listing in a marketplace (~40s for US when functions ran in
// iad1). Functions now run in Tokyo (hnd1, next to Supabase -- see vercel.json), so each of its
// sequential SP-API calls to the US endpoint pays ~150ms more; 300s leaves room for that plus
// retry backoff. 300 is the same ceiling the Sponsored Brands upload route already deploys with.
export const maxDuration = 300;

export default async function MasterListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertItemAccess("marketOps", "master-list");
  return <>{children}</>;
}
