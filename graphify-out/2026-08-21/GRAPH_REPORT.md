# Graph Report - automation-portal  (2026-07-31)

## Corpus Check
- 91 files · ~50,239 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 672 nodes · 1676 edges · 45 communities (23 shown, 22 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7a3c4dc8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Shared UI Components & Layout Shell|Shared UI Components & Layout Shell]]
- [[_COMMUNITY_PPC Top-Up Automation|PPC Top-Up Automation]]
- [[_COMMUNITY_Auth & Staff Management|Auth & Staff Management]]
- [[_COMMUNITY_Package Dependencies (package.json)|Package Dependencies (package.json)]]
- [[_COMMUNITY_Sponsored Brands Upload - Campaign Data|Sponsored Brands Upload - Campaign Data]]
- [[_COMMUNITY_shadcnui Component Registry Config|shadcn/ui Component Registry Config]]
- [[_COMMUNITY_PPC Schedule AI Import|PPC Schedule AI Import]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_product-block.tsx|product-block.tsx]]
- [[_COMMUNITY_Dashboard, Projects & Tools Registry|Dashboard, Projects & Tools Registry]]
- [[_COMMUNITY_utils.ts|utils.ts]]
- [[_COMMUNITY_Sponsored Brands Bulk XLSX Builder|Sponsored Brands Bulk XLSX Builder]]
- [[_COMMUNITY_Project Docs & External References|Project Docs & External References]]
- [[_COMMUNITY_Root Layout|Root Layout]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_File Icon Asset|File Icon Asset]]
- [[_COMMUNITY_Globe Icon Asset|Globe Icon Asset]]
- [[_COMMUNITY_Next.js Logo Asset|Next.js Logo Asset]]
- [[_COMMUNITY_Vercel Logo Asset|Vercel Logo Asset]]
- [[_COMMUNITY_Window Icon Asset|Window Icon Asset]]
- [[_COMMUNITY_LaLaGreen Automation Portal — Developer Guide|LaLaGreen Automation Portal — Developer Guide]]
- [[_COMMUNITY_sp-api.ts|sp-api.ts]]
- [[_COMMUNITY_projects.ts|projects.ts]]
- [[_COMMUNITY_chart.tsx|chart.tsx]]
- [[_COMMUNITY_README|README.md]]
- [[_COMMUNITY_AGENTS|AGENTS.md]]
- [[_COMMUNITY_Next.js Breaking Changes Notice|Next.js Breaking Changes Notice]]
- [[_COMMUNITY_Admin Role Restriction Policy|Admin Role Restriction Policy]]
- [[_COMMUNITY_portal_session JWT Cookie|portal_session JWT Cookie]]
- [[_COMMUNITY_LaLaGreen Automation Portal (Project Overview)|LaLaGreen Automation Portal (Project Overview)]]
- [[_COMMUNITY_No Self-Service Signup Policy|No Self-Service Signup Policy]]
- [[_COMMUNITY_Server Actions {data, error} Return Shape Convention|Server Actions {data, error} Return Shape Convention]]
- [[_COMMUNITY_Supabase staff Table|Supabase staff Table]]
- [[_COMMUNITY_Geist Font (nextfont)|Geist Font (next/font)]]
- [[_COMMUNITY_Next.js Documentation|Next.js Documentation]]
- [[_COMMUNITY_create-next-app Bootstrapped Project|create-next-app Bootstrapped Project]]
- [[_COMMUNITY_Vercel Platform|Vercel Platform]]
- [[_COMMUNITY_build.ts|build.ts]]
- [[_COMMUNITY_sku-list.ts|sku-list.ts]]
- [[_COMMUNITY_tabs.tsx|tabs.tsx]]
- [[_COMMUNITY_page-header.tsx|page-header.tsx]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 88 edges
2. `getSession()` - 37 edges
3. `createServiceClient()` - 36 edges
4. `createClient()` - 33 edges
5. `requireStaff()` - 21 edges
6. `compilerOptions` - 16 edges
7. `Button()` - 13 edges
8. `getMyPermissions()` - 13 edges
9. `CANONICAL_SLOTS` - 13 edges
10. `LaLaGreen Automation Portal — Developer Guide` - 12 edges

## Surprising Connections (you probably didn't know these)
- `AlertDialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `AlertDialogMedia()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dialog.tsx → lib/utils.ts
- `SheetOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/sheet.tsx → lib/utils.ts
- `PpcTopUpLayout()` --calls--> `assertItemAccess()`  [EXTRACTED]
  app/(portal)/automations/ppc-top-up/layout.tsx → lib/permissions.ts

## Import Cycles
- None detected.

## Communities (45 total, 22 thin omitted)

### Community 0 - "Shared UI Components & Layout Shell"
Cohesion: 0.12
Nodes (21): UPLOADABLE_COUNTRIES, UploadResponse, Button(), buttonVariants, Dialog(), DialogBody(), DialogClose(), DialogContent() (+13 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.07
Nodes (65): AcosScheduleCard(), AcosTopupCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+57 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.07
Nodes (46): POST(), BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor(), POST() (+38 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.05
Nodes (41): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+33 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.09
Nodes (51): createBrand(), createKeywordTheme(), createVideoAsset(), deleteBrand(), deleteKeywordTheme(), deletePreset(), deleteProduct(), deleteVideoAsset() (+43 more)

### Community 5 - "shadcn/ui Component Registry Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 6 - "PPC Schedule AI Import"
Cohesion: 0.17
Nodes (22): AMOUNT_HINTS, analyzeScheduleImport(), ColumnDetectSchema, ColumnMapping, COUNTRY_ALIASES, COUNTRY_HINTS, detectColumnBlocks(), detectColumnsWithAi() (+14 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "product-block.tsx"
Cohesion: 0.09
Nodes (23): COUNTRIES, STEPS, WizardStep, Asset, Block, Brand, newBlock(), Preset (+15 more)

### Community 9 - "Dashboard, Projects & Tools Registry"
Cohesion: 0.06
Nodes (65): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, PpcTopUpLayout(), PriceChangePlansLayout(), MasterListLayout(), DashboardPage() (+57 more)

### Community 10 - "utils.ts"
Cohesion: 0.18
Nodes (17): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), NewPricePlanSheet(), PlanCard() (+9 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.11
Nodes (28): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), DropdownMenu(), DropdownMenuCheckboxItem() (+20 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.07
Nodes (27): Adding a New Project, Adding a new staff member, Adding a New Tool, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System, Database (Supabase), Environment variables (+19 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.16
Nodes (23): fetchSkuDetail(), fetchSkuPricing(), requireStaff(), asNumber(), callSpApi(), callSpApiJson(), chunk(), extractFeaturedPricing() (+15 more)

### Community 25 - "projects.ts"
Cohesion: 0.25
Nodes (13): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+5 more)

### Community 26 - "chart.tsx"
Cohesion: 0.26
Nodes (11): POST(), POST(), toRole(), clearSessionCookie(), getSecretKey(), SessionPayload, setSessionCookie(), signSession() (+3 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.23
Nodes (14): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+6 more)

### Community 42 - "sku-list.ts"
Cohesion: 0.16
Nodes (8): formatPrice(), SkuDetailDialog(), AlertDialogTitle(), CardAction(), CardDescription(), Checkbox(), Sku, SkuDetail

### Community 43 - "tabs.tsx"
Cohesion: 0.23
Nodes (5): ChatPanel(), markdownComponents, PageHeader(), Skeleton(), Textarea()

### Community 44 - "page-header.tsx"
Cohesion: 0.47
Nodes (3): LoginForm(), Input(), Label()

## Knowledge Gaps
- **178 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES`, `PriceTypeOption`, `DirectoryEntry` (+173 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Sponsored Brands Bulk XLSX Builder` to `Shared UI Components & Layout Shell`, `PPC Top-Up Automation`, `product-block.tsx`, `Dashboard, Projects & Tools Registry`, `sku-list.ts`, `tabs.tsx`, `page-header.tsx`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `PPC Top-Up Automation`, `PPC Schedule AI Import`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Why does `getSession()` connect `Dashboard, Projects & Tools Registry` to `PPC Top-Up Automation`, `Auth & Staff Management`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `build.ts`, `sp-api.ts`, `chart.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES` to the rest of the system?**
  _181 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Shared UI Components & Layout Shell` be split into smaller, more focused modules?**
  _Cohesion score 0.1206896551724138 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.07392607392607392 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.07450980392156863 - nodes in this community are weakly interconnected._