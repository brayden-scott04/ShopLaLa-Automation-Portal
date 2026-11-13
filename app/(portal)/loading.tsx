import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shown the moment a sidebar link is clicked, while the next page's server work
 * (permission check + its Supabase queries) runs. Sits inside the portal layout,
 * so the sidebar and topbar stay put and only the main area swaps to this.
 *
 * Shaped like <PageHeader> plus a generic content block, using the same
 * padding as most pages (`px-6 pb-6 md:px-8 md:pb-8`) so the swap doesn't jump.
 * Deliberately static and text-free: no cookies/translations, so Next.js can
 * prefetch it along with the link.
 */
export default function PortalLoading() {
  return (
    <div aria-busy="true">
      {/* Page header: icon tile, title, description */}
      <div className="flex items-center gap-6 p-6 md:p-8">
        <Skeleton className="size-10 shrink-0 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72 max-w-[60vw]" />
        </div>
      </div>

      <div className="space-y-6 px-6 pb-6 md:px-8 md:pb-8">
        {/* Toolbar / filter row */}
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="ml-auto h-9 w-24" />
        </div>

        {/* Main card: a header strip and a few table-like rows */}
        <div className="rounded-xl border border-border p-6">
          <Skeleton className="mb-6 h-5 w-40" />
          <div className="space-y-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
