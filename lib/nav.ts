import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  CalendarDays,
  ChartNoAxesCombined,
  Clapperboard,
  ClipboardList,
  Factory,
  FileSpreadsheet,
  Gauge,
  Handshake,
  Inbox,
  Landmark,
  ListChecks,
  Megaphone,
  Package,
  PackageSearch,
  Tag,
  Target,
  TrendingUp,
  Truck,
  Wallet,
  Workflow,
} from "lucide-react";
import type { Section } from "@/lib/roles";

/**
 * Single source of truth for the portal's navigation (sidebar, dashboard
 * "Your access" grid, admin access editor, permission universe).
 *
 * Layer 1 = a {@link NavGroup} (Dashboard, Supply Chain, …), which is also a
 * permission {@link Section}. Layer 2 = a {@link NavItem}, a clickable page.
 *
 * To add a page: define it with `defineNavItem(...)` below, add it to its
 * group's `items`, then create app/(portal)/<route prefix>/<id>/page.tsx plus a
 * layout.tsx calling assertItemAccess("<section>", "<id>") — that guard is what
 * stops a direct URL visit, not the hidden sidebar link.
 */

/** A nested fold inside a Layer-1 group (currently only Market Ops › Automations & Tools). */
export type NavSubgroup = "automations";

export const SUBGROUP_LABELS: Record<NavSubgroup, string> = {
  automations: "Automations & Tools",
};

export interface NavItem {
  id: string;
  name: string;
  description: string;
  /** Used by page headers and dashboard cards — the sidebar renders no icons. */
  icon: LucideIcon;
  href: string;
  section: Section;
  subgroup?: NavSubgroup;
  /** Visible to everyone and not part of the permission model. */
  ungated?: boolean;
}

export interface NavGroup {
  section: Section;
  label: string;
  /** Route prefix, e.g. "/market-ops". */
  basePath: string;
  /** CSS custom property holding this group's pin colour (see app/globals.css). */
  colorVar: string;
  items: NavItem[];
}

const BASE_PATHS: Record<Section, string> = {
  dashboard: "/dashboard",
  supplyChain: "/supply-chain",
  marketOps: "/market-ops",
  visual: "/visual",
  others: "/others",
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface NavItemInput {
  name: string;
  description: string;
  icon: LucideIcon;
  section: Section;
  subgroup?: NavSubgroup;
  id?: string;
  href?: string;
  ungated?: boolean;
}

function defineNavItem(input: NavItemInput): NavItem {
  const id = input.id ?? slugify(input.name);
  const sub = input.subgroup ? `/${input.subgroup}` : "";
  return {
    ...input,
    id,
    href: input.href ?? `${BASE_PATHS[input.section]}${sub}/${id}`,
  };
}

// ── Dashboard ────────────────────────────────────────────────────────────────
export const goalVsPerformance = defineNavItem({
  name: "Goal vs Performance",
  description: "Track performance against goals",
  icon: Target,
  section: "dashboard",
});

export const profitAnalytics = defineNavItem({
  name: "Profit Analytics",
  description: "Revenue, Amazon fees and gross margin per marketplace, from settlement data",
  icon: ChartNoAxesCombined,
  section: "dashboard",
});

// ── Supply Chain ─────────────────────────────────────────────────────────────
export const partners = defineNavItem({
  name: "Partners",
  description: "Suppliers, manufacturers and logistics partners",
  icon: Handshake,
  section: "supplyChain",
});

export const sourcing = defineNavItem({
  name: "Sourcing",
  description: "Product sourcing and supplier quotes",
  icon: Factory,
  section: "supplyChain",
});

export const orders = defineNavItem({
  name: "Orders",
  description: "Purchase orders placed with suppliers",
  icon: ClipboardList,
  section: "supplyChain",
});

export const shipments = defineNavItem({
  name: "Shipments",
  description: "Inbound shipments and their status",
  icon: Truck,
  section: "supplyChain",
});

export const supplyChainAutomations = defineNavItem({
  name: "Automations",
  description: "Supply chain automations",
  icon: Workflow,
  section: "supplyChain",
});

// ── Market Ops ───────────────────────────────────────────────────────────────
export const products = defineNavItem({
  name: "Products",
  description: "Product catalogue across marketplaces",
  icon: Package,
  section: "marketOps",
});

export const inventory = defineNavItem({
  name: "Inventory",
  description: "Stock levels across marketplaces",
  icon: Boxes,
  section: "marketOps",
});

export const advertisements = defineNavItem({
  name: "Advertisements",
  description: "Advertising performance and campaigns",
  icon: Megaphone,
  section: "marketOps",
});

export const masterList = defineNavItem({
  name: "Master List",
  description: "Manage the SKUs included in the master list report",
  icon: ListChecks,
  section: "marketOps",
});

export const ppcTopUp = defineNavItem({
  name: "PPC Top Up",
  description: "Amazon Sponsored Products daily budget cap schedule",
  icon: Wallet,
  section: "marketOps",
  subgroup: "automations",
});

export const priceChangePlans = defineNavItem({
  name: "Price Change Plans",
  description: "Plan gradual Amazon sales price changes, executed step-by-step by n8n",
  icon: Tag,
  section: "marketOps",
  subgroup: "automations",
});

export const bulkCampaignUpload = defineNavItem({
  name: "Sponsored Brands Upload",
  description: "Generate Amazon Sponsored Brands Video bulk upload files",
  icon: FileSpreadsheet,
  section: "marketOps",
  subgroup: "automations",
});

export const adsBulkGenerator = defineNavItem({
  name: "Ads Bulk Generator",
  description: "Generate Sponsored Brands Video, Store and Product Collection bulk files",
  icon: Clapperboard,
  section: "marketOps",
  subgroup: "automations",
});

export const fbaFeeTracker = defineNavItem({
  name: "FBA Fee Tracker",
  description: "Daily per-SKU FBA fee history, size-tier change alerts and expected fees",
  icon: PackageSearch,
  section: "marketOps",
  subgroup: "automations",
});

export const trends = defineNavItem({
  name: "Trends",
  description: "Daily Best Sellers Rank per ASIN, with alerts when Amazon changes a product's category or its rank drops sharply",
  icon: TrendingUp,
  section: "marketOps",
  subgroup: "automations",
});

// ── Visual ───────────────────────────────────────────────────────────────────
export const listingScore = defineNavItem({
  name: "Listing Score",
  description: "Score listing content and imagery quality",
  icon: Gauge,
  section: "visual",
});

// ── Others ───────────────────────────────────────────────────────────────────
export const calendar = defineNavItem({
  name: "Calendar",
  description: "Personal calendars for tasks, deadlines, and reminders",
  icon: CalendarDays,
  section: "others",
});

export const finance = defineNavItem({
  name: "Finance",
  description: "Company finance overview",
  icon: Landmark,
  section: "others",
});

export const tasks = defineNavItem({
  name: "Tasks",
  description: "Track tasks and projects with owners, assignees, and priority",
  icon: ListChecks,
  section: "others",
});

export const companyInbox = defineNavItem({
  name: "Company Inbox",
  description: "View email sent to the company address",
  icon: Inbox,
  section: "others",
});

export const NAV_GROUPS: NavGroup[] = [
  {
    section: "dashboard",
    label: "Dashboard",
    basePath: BASE_PATHS.dashboard,
    colorVar: "--nav-dashboard",
    items: [goalVsPerformance, profitAnalytics],
  },
  {
    section: "supplyChain",
    label: "Supply Chain",
    basePath: BASE_PATHS.supplyChain,
    colorVar: "--nav-supply-chain",
    items: [partners, sourcing, orders, shipments, supplyChainAutomations],
  },
  {
    section: "marketOps",
    label: "Market Ops",
    basePath: BASE_PATHS.marketOps,
    colorVar: "--nav-market-ops",
    items: [
      products,
      inventory,
      advertisements,
      masterList,
      ppcTopUp,
      priceChangePlans,
      bulkCampaignUpload,
      adsBulkGenerator,
      fbaFeeTracker,
      trends,
    ],
  },
  {
    section: "visual",
    label: "Visual",
    basePath: BASE_PATHS.visual,
    colorVar: "--nav-visual",
    items: [listingScore],
  },
  {
    section: "others",
    label: "Others",
    basePath: BASE_PATHS.others,
    colorVar: "--nav-others",
    items: [calendar, finance, tasks, companyInbox],
  },
];
