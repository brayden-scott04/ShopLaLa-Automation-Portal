import type { LucideIcon } from "lucide-react";
import { ChartNoAxesCombined } from "lucide-react";

export interface SalesItem {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

interface SalesItemInput {
  name: string;
  description: string;
  icon: LucideIcon;
  href?: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function defineSalesItem(input: SalesItemInput): SalesItem {
  const id = slugify(input.name);
  return { ...input, id, href: input.href ?? `/sales/${id}` };
}

/**
 * Add a new sales item as a named `defineSalesItem(...)` export below, then
 * include it in the `salesItems` array (sidebar and dashboard read from that
 * list, so they stay in sync automatically). Finally, create
 * app/(portal)/sales/<id>/page.tsx yourself, plus a layout.tsx calling
 * assertItemAccess("sales", "<id>") — that guard is what stops a direct URL
 * visit, not the hidden sidebar link.
 */
export const profitAnalytics = defineSalesItem({
  name: "Profit Analytics",
  description: "Revenue, Amazon fees and gross margin per marketplace, from settlement data",
  icon: ChartNoAxesCombined,
});

export const salesItems: SalesItem[] = [profitAnalytics];
