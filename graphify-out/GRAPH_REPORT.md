# Graph Report - LaLaGreen-Automation-Portal  (2026-10-29)

## Corpus Check
- 193 files · ~140,294 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1457 nodes · 4405 edges · 70 communities (47 shown, 23 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5359a1a9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- calendar.ts
- PPC Top-Up Automation
- Auth & Staff Management
- Package Dependencies (package.json)
- Sponsored Brands Upload - Campaign Data
- shadcn/ui Component Registry Config
- PPC Schedule AI Import
- TypeScript Config
- product-block.tsx
- monday.com Dashboards — Comprehensive Reference
- utils.ts
- Sponsored Brands Bulk XLSX Builder
- Project Docs & External References
- Root Layout
- ESLint Config
- Next.js Config
- PostCSS Config
- File Icon Asset
- Globe Icon Asset
- Next.js Logo Asset
- Vercel Logo Asset
- Window Icon Asset
- LaLaGreen Automation Portal — Developer Guide
- sp-api.ts
- projects.ts
- chart.tsx
- README.md
- AGENTS.md
- Next.js Breaking Changes Notice
- Admin Role Restriction Policy
- portal_session JWT Cookie
- LaLaGreen Automation Portal (Project Overview)
- No Self-Service Signup Policy
- Server Actions {data, error} Return Shape Convention
- Supabase staff Table
- Geist Font (next/font)
- Next.js Documentation
- create-next-app Bootstrapped Project
- Vercel Platform
- build.ts
- projects.ts
- tabs.tsx
- page-header.tsx
- mail.ts
- buildVideoBulk.ts
- skeleton.tsx
- fba-fee-tracker.ts
- product-block.tsx
- fba-fee-calculator.ts
- server.ts
- permissions.ts
- fba-fee-calculator.ts
- getStaffDirectory
- credentials.ts
- hash-password.ts
- page.tsx
- fba-fee-tracker-constants.ts
- page-header.tsx
- dashboard-access-grid.tsx
- marketplaces.ts
- page.tsx
- page.tsx
- session.ts
- page.tsx
- page.tsx
- layout.tsx
- task-form-dialog.tsx
- partners.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 143 edges
2. `createServiceClient()` - 108 edges
3. `getSession()` - 99 edges
4. `createClient()` - 82 edges
5. `assertItemAccess()` - 47 edges
6. `Button()` - 32 edges
7. `requireStaff()` - 24 edges
8. `Skeleton()` - 21 edges
9. `getMyPermissions()` - 21 edges
10. `PageHeader()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/dashboard/profit-analytics/page.tsx → lib/utils.ts
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/market-ops/automations/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts
- `SortTh()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/market-ops/automations/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/market-ops/automations/trends/trends-view.tsx → lib/utils.ts
- `SortTh()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/market-ops/automations/trends/trends-view.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (70 total, 23 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.05
Nodes (122): CalendarSidebar(), DayTasksDialog(), DayView(), DeleteScopeDialog(), SCOPE_OPTIONS, ManageAccessDialog(), layoutWeekRibbons(), MonthGrid() (+114 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.07
Nodes (75): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+67 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.13
Nodes (27): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, SettingsPage(), DirectoryEntry, TeamPage(), createStaffMember() (+19 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.19
Nodes (13): distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), Block, BlockMode, newBlock() (+5 more)

### Community 5 - "shadcn/ui Component Registry Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 6 - "PPC Schedule AI Import"
Cohesion: 0.18
Nodes (21): AMOUNT_HINTS, analyzeScheduleImport(), ColumnDetectSchema, ColumnMapping, COUNTRY_ALIASES, COUNTRY_HINTS, detectColumnBlocks(), detectColumnsWithAi() (+13 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "product-block.tsx"
Cohesion: 0.09
Nodes (20): PlaceholderPage(), adsBulkGenerator, advertisements, BASE_PATHS, bulkCampaignUpload, calendar, defineNavItem(), finance (+12 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.10
Nodes (34): fetchSkuPricing(), requireStaff(), marketplace, MARKETPLACE_CODES, MARKETPLACE_IDS, Region, REGION_HOSTS, REGION_LABELS (+26 more)

### Community 10 - "utils.ts"
Cohesion: 0.20
Nodes (13): PartnerGrid(), PartnersView(), pricesHref(), Row, withField(), FACTORY_FIELDS, FORWARDER_FIELDS, FORWARDER_LANES (+5 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.10
Nodes (33): POST(), POST(), AddSkillDialog(), LevelBadge(), LevelFilter, LevelPicker(), StaffSkillsView(), SummaryTile() (+25 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.06
Nodes (34): Adding a Layer-1 group, Adding a new staff member, Adding a page to an existing group, Adding an API route, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+26 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.40
Nodes (5): AccessItem, NavGroup, NavItem, NavItemInput, Section

### Community 25 - "projects.ts"
Cohesion: 0.08
Nodes (45): POST(), BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor(), POST() (+37 more)

### Community 26 - "chart.tsx"
Cohesion: 0.33
Nodes (6): sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), SUBGROUP_LABELS

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.11
Nodes (33): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+25 more)

### Community 42 - "projects.ts"
Cohesion: 0.11
Nodes (31): AlertRankCell(), AsinDetail(), buildRows(), CategoryRank, Delta(), Filter, KIND_SEVERITY, rankText() (+23 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.13
Nodes (25): foldKey(), foldListeners, initials(), isActive(), memoryPins, NavGroupSection(), NavLeaf(), parseFolds() (+17 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (58): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES (+50 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (66): ComposeDialogProps, CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps, RFC-5322, buildRawMessage() (+58 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.12
Nodes (24): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), NewPricePlanSheet(), nextStepPrice() (+16 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.19
Nodes (18): BulkDimsResult, bulkUpdateTrueDims(), daysBefore(), DimsInput, DimsJson, FbaFeeOverview, getFbaFeeOverview(), getSkuFeeHistory() (+10 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.16
Nodes (21): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+13 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.06
Nodes (59): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), notesTooltip(), PRIORITY_ICONS, PriorityPill(), Scope (+51 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.15
Nodes (15): STEPS, WizardStep, Preset, AssetsSection(), BrandsSection(), KeywordGarageSection(), LoginForm(), Card() (+7 more)

### Community 51 - "server.ts"
Cohesion: 0.12
Nodes (23): IncomingCampaign, BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL (+15 more)

### Community 52 - "permissions.ts"
Cohesion: 0.07
Nodes (23): GoalVsPerformanceLayout(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout(), PpcTopUpLayout(), PriceChangePlansLayout(), SponsoredBrandsUploadLayout() (+15 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.16
Nodes (17): Banded, expectedFbaFee(), FeeInput, fromRows(), incremental(), IncrementalRate, priceBandOf(), RateTables (+9 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.11
Nodes (45): BrandLibrarySection(), AdsBulkGeneratorPage(), Step, CampaignProduct, createBrand(), createKeywordTheme(), createVideoAsset(), deleteBrand() (+37 more)

### Community 56 - "hash-password.ts"
Cohesion: 0.17
Nodes (13): ActionResult, BrandLibraryItem, DeleteConfirm(), CardAction(), Sheet(), SheetClose(), SheetContent(), SheetDescription() (+5 more)

### Community 57 - "page.tsx"
Cohesion: 0.17
Nodes (5): PageHeader(), fbaFeeTracker, partners, products, trends

### Community 58 - "fba-fee-tracker-constants.ts"
Cohesion: 0.28
Nodes (8): FeeAlert, ALERT_CAUSES, ALERT_KIND_LABELS, ALERT_KINDS, ALERT_STATUS_LABELS, AlertCause, AlertKind, AlertStatus

### Community 59 - "page-header.tsx"
Cohesion: 0.10
Nodes (30): SearchableSelect(), AddPriceDialog(), ImportPricesSheet(), PriceCell(), PriceRow(), ProductsView(), AlertDialogMedia(), AlertDialogOverlay() (+22 more)

### Community 60 - "dashboard-access-grid.tsx"
Cohesion: 0.23
Nodes (11): DashboardAccessGrid(), Layout, layoutKey(), layoutListeners, memoryLayouts, parseLayout(), readLayout(), SortableTile() (+3 more)

### Community 61 - "marketplaces.ts"
Cohesion: 0.21
Nodes (15): ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedSkuSheet, detectStatusColumnHeuristically(), extractSkusFromSheet(), findColumn() (+7 more)

### Community 62 - "page.tsx"
Cohesion: 0.20
Nodes (19): addProductPrice(), cleanPrice(), deleteProductPrice(), getPriceForSku(), importProductPrices(), listFactories(), listProductPrices(), parsePriceExcel() (+11 more)

### Community 63 - "page.tsx"
Cohesion: 0.14
Nodes (18): MarketplaceOptions(), formatPrice(), MasterListPage(), matchesRegion(), PullFromAmazonSheet(), PullResult, RegionFilter, SkuDetailDialog() (+10 more)

### Community 64 - "session.ts"
Cohesion: 0.26
Nodes (15): RegionPicker(), RegionTag(), addRegionsTo(), addSkus(), addSkusGrouped(), deleteSku(), fetchAmazonMissingSkus(), readAllSkusOrdered() (+7 more)

### Community 65 - "page.tsx"
Cohesion: 0.29
Nodes (11): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PricePlan, PriceType, requirePlanAccess() (+3 more)

### Community 66 - "page.tsx"
Cohesion: 0.47
Nodes (4): InsertionPlan, naturalCompare(), planInsertions(), skuPrefix()

### Community 67 - "layout.tsx"
Cohesion: 0.24
Nodes (10): POST(), DashboardPage(), PortalLayout(), DashboardLink(), Sidebar(), Topbar(), NAV_GROUPS, ALL_ITEM_IDS (+2 more)

### Community 69 - "task-form-dialog.tsx"
Cohesion: 0.18
Nodes (14): Option, ChatPanel(), markdownComponents, TaskFormInner(), todayLocal(), formatWhen(), TaskUpdates(), Button() (+6 more)

### Community 70 - "partners.ts"
Cohesion: 0.27
Nodes (13): cleanShortName(), createPartner(), deletePartner(), friendlyError(), listPartners(), movePartner(), Partner, renamePartner() (+5 more)

## Knowledge Gaps
- **295 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem` (+290 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `product-block.tsx` to `calendar.ts`, `PPC Top-Up Automation`, `Auth & Staff Management`, `PPC Schedule AI Import`, `monday.com Dashboards — Comprehensive Reference`, `Sponsored Brands Bulk XLSX Builder`, `projects.ts`, `chart.tsx`, `projects.ts`, `page-header.tsx`, `mail.ts`, `skeleton.tsx`, `server.ts`, `getStaffDirectory`, `marketplaces.ts`, `page.tsx`, `session.ts`, `page.tsx`, `layout.tsx`, `partners.ts`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **Why does `cn()` connect `page-header.tsx` to `calendar.ts`, `PPC Top-Up Automation`, `Auth & Staff Management`, `Sponsored Brands Upload - Campaign Data`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `build.ts`, `projects.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `hash-password.ts`, `dashboard-access-grid.tsx`, `layout.tsx`, `task-form-dialog.tsx`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `createClient()` connect `calendar.ts` to `PPC Top-Up Automation`, `page.tsx`, `layout.tsx`, `Auth & Staff Management`, `partners.ts`, `PPC Schedule AI Import`, `projects.ts`, `Sponsored Brands Bulk XLSX Builder`, `page-header.tsx`, `buildVideoBulk.ts`, `skeleton.tsx`, `product-block.tsx`, `server.ts`, `getStaffDirectory`, `projects.ts`, `marketplaces.ts`, `page.tsx`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `SCOPE_CURRENCY` to the rest of the system?**
  _298 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05274198381780042 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.07066167290886392 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.12834224598930483 - nodes in this community are weakly interconnected._