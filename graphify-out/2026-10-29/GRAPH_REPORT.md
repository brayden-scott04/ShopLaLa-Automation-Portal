# Graph Report - LaLaGreen-Automation-Portal  (2026-10-28)

## Corpus Check
- 189 files · ~137,891 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1429 nodes · 4304 edges · 75 communities (49 shown, 26 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c31383eb`
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
- price-plan-import.ts
- task-form-dialog.tsx
- partners.ts
- utils.ts
- input.tsx
- page.tsx
- page.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 137 edges
2. `createServiceClient()` - 105 edges
3. `getSession()` - 96 edges
4. `createClient()` - 80 edges
5. `assertItemAccess()` - 47 edges
6. `Button()` - 32 edges
7. `requireStaff()` - 24 edges
8. `getMyPermissions()` - 21 edges
9. `Skeleton()` - 20 edges
10. `SupabaseServerClient` - 20 edges

## Surprising Connections (you probably didn't know these)
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/dashboard/profit-analytics/page.tsx → lib/utils.ts
- `SearchableSelect()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/market-ops/automations/ads-bulk-generator/searchable-select.tsx → lib/utils.ts
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/market-ops/automations/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts
- `SortTh()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/market-ops/automations/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/market-ops/automations/trends/trends-view.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (75 total, 26 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.10
Nodes (56): CalendarSidebar(), DayTasksDialog(), DayView(), DeleteScopeDialog(), layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS (+48 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.07
Nodes (77): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+69 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.18
Nodes (19): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, SettingsPage(), DirectoryEntry, createStaffMember(), deleteStaffMember() (+11 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.16
Nodes (18): distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), Block, BlockMode, newBlock() (+10 more)

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
Cohesion: 0.15
Nodes (6): PlaceholderPage(), advertisements, finance, goalVsPerformance, inventory, supplyChainAutomations

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.06
Nodes (66): RegionPicker(), RegionTag(), addRegionsTo(), addSkus(), addSkusGrouped(), ColumnDetectSchema, ColumnMapping, deleteSku() (+58 more)

### Community 10 - "utils.ts"
Cohesion: 0.16
Nodes (15): PartnerGrid(), PartnersView(), pricesHref(), Row, withField(), Partner, FACTORY_FIELDS, FORWARDER_FIELDS (+7 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.29
Nodes (10): POST(), POST(), toRole(), clearSessionCookie(), getSecretKey(), setSessionCookie(), signSession(), verifySessionToken() (+2 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.06
Nodes (33): Adding a Layer-1 group, Adding a new staff member, Adding a page to an existing group, Adding an API route, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+25 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.14
Nodes (15): adsBulkGenerator, BASE_PATHS, calendar, defineNavItem(), masterList, NavGroup, NavItemInput, NavSubgroup (+7 more)

### Community 25 - "projects.ts"
Cohesion: 0.13
Nodes (28): budgetFor(), POST(), AD_GROUP_MEDIA, AD_MEDIA, AdsCountry, adsHeaders(), adsPost(), AdsProfile (+20 more)

### Community 26 - "chart.tsx"
Cohesion: 0.33
Nodes (6): sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), SUBGROUP_LABELS

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.12
Nodes (26): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+18 more)

### Community 42 - "projects.ts"
Cohesion: 0.11
Nodes (31): AlertRankCell(), AsinDetail(), buildRows(), CategoryRank, Delta(), Filter, KIND_SEVERITY, rankText() (+23 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.14
Nodes (24): foldKey(), foldListeners, initials(), isActive(), memoryPins, NavGroupSection(), NavLeaf(), parseFolds() (+16 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (57): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES (+49 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (66): ComposeDialogProps, CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps, RFC-5322, buildRawMessage() (+58 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.13
Nodes (23): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), NewPricePlanSheet(), nextStepPrice() (+15 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.19
Nodes (18): BulkDimsResult, bulkUpdateTrueDims(), daysBefore(), DimsInput, DimsJson, FbaFeeOverview, getFbaFeeOverview(), getSkuFeeHistory() (+10 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.16
Nodes (21): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+13 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.13
Nodes (20): ManageAccessDialog(), AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), notesTooltip(), PRIORITY_ICONS, PriorityPill() (+12 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.15
Nodes (20): ActionResult, BrandLibraryItem, STEPS, WizardStep, Preset, AssetsSection(), BrandsSection(), COUNTRIES (+12 more)

### Community 51 - "server.ts"
Cohesion: 0.13
Nodes (24): IncomingCampaign, POST(), BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow() (+16 more)

### Community 52 - "permissions.ts"
Cohesion: 0.07
Nodes (30): GoalVsPerformanceLayout(), DashboardPage(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout(), PpcTopUpLayout(), PriceChangePlansLayout() (+22 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.16
Nodes (17): Banded, expectedFbaFee(), FeeInput, fromRows(), incremental(), IncrementalRate, priceBandOf(), RateTables (+9 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.06
Nodes (100): createBrand(), createKeywordTheme(), createVideoAsset(), deleteBrand(), deleteKeywordTheme(), deleteKeywordThemes(), deletePreset(), deleteProduct() (+92 more)

### Community 56 - "hash-password.ts"
Cohesion: 0.17
Nodes (17): POST(), BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, BaseCampaignInput, budgetFor() (+9 more)

### Community 57 - "page.tsx"
Cohesion: 0.27
Nodes (3): PageHeader(), fbaFeeTracker, trends

### Community 58 - "fba-fee-tracker-constants.ts"
Cohesion: 0.28
Nodes (8): FeeAlert, ALERT_CAUSES, ALERT_KIND_LABELS, ALERT_KINDS, ALERT_STATUS_LABELS, AlertCause, AlertKind, AlertStatus

### Community 59 - "page-header.tsx"
Cohesion: 0.12
Nodes (24): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), Badge(), badgeVariants (+16 more)

### Community 60 - "dashboard-access-grid.tsx"
Cohesion: 0.20
Nodes (13): AccessItem, DashboardAccessGrid(), Layout, layoutKey(), layoutListeners, memoryLayouts, parseLayout(), readLayout() (+5 more)

### Community 61 - "marketplaces.ts"
Cohesion: 0.23
Nodes (18): SCOPE_OPTIONS, WEEKDAY_FULL, WEEKDAY_SHORT, ComposeDialog(), MODE_LABEL, SendResult, splitAddresses(), Button() (+10 more)

### Community 62 - "page.tsx"
Cohesion: 0.15
Nodes (26): AddPriceDialog(), ImportPricesSheet(), PriceCell(), PriceRow(), ProductsView(), addProductPrice(), cleanPrice(), deleteProductPrice() (+18 more)

### Community 63 - "page.tsx"
Cohesion: 0.12
Nodes (22): MarketplaceOptions(), formatPrice(), MasterListPage(), matchesRegion(), PullFromAmazonSheet(), PullResult, RegionFilter, SkuDetailDialog() (+14 more)

### Community 64 - "session.ts"
Cohesion: 0.14
Nodes (14): newBlock(), ProductBlock(), toLines(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription() (+6 more)

### Community 66 - "page.tsx"
Cohesion: 0.26
Nodes (17): BrandLibrarySection(), AdsBulkGeneratorPage(), Step, BrandLogo, createBrandLogo(), createStoreUrl(), deleteBrandLogo(), deletePdpPreset() (+9 more)

### Community 67 - "layout.tsx"
Cohesion: 0.19
Nodes (10): PortalLayout(), DashboardLink(), Sidebar(), Topbar(), EMPTY_PERMISSIONS, LEGACY_SECTIONS, PermissionSet, Role (+2 more)

### Community 68 - "price-plan-import.ts"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 69 - "task-form-dialog.tsx"
Cohesion: 0.22
Nodes (13): TaskFormDialog(), TaskFormDialogProps, TaskFormInner(), todayLocal(), formatWhen(), TaskUpdates(), Label(), Task (+5 more)

### Community 70 - "partners.ts"
Cohesion: 0.33
Nodes (11): cleanShortName(), createPartner(), deletePartner(), friendlyError(), listPartners(), movePartner(), renamePartner(), requirePartnersAccess() (+3 more)

### Community 71 - "utils.ts"
Cohesion: 0.38
Nodes (3): ChatPanel(), markdownComponents, Textarea()

### Community 72 - "input.tsx"
Cohesion: 0.47
Nodes (3): Option, SearchableSelect(), Input()

## Knowledge Gaps
- **292 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem` (+287 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `getStaffDirectory` to `PPC Top-Up Automation`, `Auth & Staff Management`, `PPC Schedule AI Import`, `monday.com Dashboards — Comprehensive Reference`, `Sponsored Brands Bulk XLSX Builder`, `projects.ts`, `chart.tsx`, `projects.ts`, `page-header.tsx`, `mail.ts`, `skeleton.tsx`, `product-block.tsx`, `server.ts`, `permissions.ts`, `hash-password.ts`, `page.tsx`, `page.tsx`, `page.tsx`, `layout.tsx`, `price-plan-import.ts`, `partners.ts`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Why does `cn()` connect `page-header.tsx` to `calendar.ts`, `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `utils.ts`, `build.ts`, `projects.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `dashboard-access-grid.tsx`, `marketplaces.ts`, `page.tsx`, `session.ts`, `layout.tsx`, `task-form-dialog.tsx`, `utils.ts`, `input.tsx`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `PPC Top-Up Automation`, `mail.ts`, `skeleton.tsx`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `SCOPE_CURRENCY` to the rest of the system?**
  _295 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10163170163170163 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.06848994857410004 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._