# Graph Report - LaLaGreen-Automation-Portal  (2026-10-25)

## Corpus Check
- 183 files · ~128,267 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1365 nodes · 4062 edges · 63 communities (38 shown, 25 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `59a5122d`
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
- page.tsx
- dashboard-access-grid.tsx
- page.tsx
- page.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 131 edges
2. `createServiceClient()` - 96 edges
3. `getSession()` - 93 edges
4. `createClient()` - 76 edges
5. `assertItemAccess()` - 47 edges
6. `Button()` - 32 edges
7. `requireStaff()` - 24 edges
8. `SupabaseServerClient` - 20 edges
9. `Skeleton()` - 19 edges
10. `getMyPermissions()` - 19 edges

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

## Communities (63 total, 25 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.06
Nodes (111): CalendarSidebar(), DayTasksDialog(), DayView(), DeleteScopeDialog(), ManageAccessDialog(), layoutWeekRibbons(), MonthGrid(), RibbonCell (+103 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.07
Nodes (76): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+68 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.17
Nodes (17): POST(), BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, BaseCampaignInput, budgetFor() (+9 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.12
Nodes (33): AlertRankCell(), AsinDetail(), buildRows(), CategoryRank, Delta(), Filter, KIND_SEVERITY, rankText() (+25 more)

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
Cohesion: 0.12
Nodes (6): PlaceholderPage(), advertisements, goalVsPerformance, inventory, shipments, supplyChainAutomations

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 10 - "utils.ts"
Cohesion: 0.13
Nodes (23): PartnersView(), withField(), cleanShortName(), createPartner(), deletePartner(), friendlyError(), listPartners(), movePartner() (+15 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.12
Nodes (15): adsBulkGenerator, BASE_PATHS, bulkCampaignUpload, calendar, defineNavItem(), listingScore, masterList, NavGroup (+7 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.06
Nodes (31): Adding a Layer-1 group, Adding a new staff member, Adding a page to an existing group, Adding an API route, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+23 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.08
Nodes (44): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PricePlan, PriceType, requirePlanAccess() (+36 more)

### Community 26 - "chart.tsx"
Cohesion: 0.09
Nodes (29): Option, SearchableSelect(), Row, AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback() (+21 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.26
Nodes (13): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+5 more)

### Community 42 - "projects.ts"
Cohesion: 0.17
Nodes (19): Row, AsinBsrHistory, BsrAlert, BsrSnapshot, BsrSyncRun, daysBefore(), getAsinBsrHistory(), getTrendsOverview() (+11 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.05
Nodes (66): POST(), POST(), ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, PortalLayout(), SettingsPage() (+58 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (58): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES (+50 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (68): ComposeDialog(), ComposeDialogProps, splitAddresses(), CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps (+60 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.09
Nodes (35): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), NewPricePlanSheet(), nextStepPrice() (+27 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.20
Nodes (17): BulkDimsResult, bulkUpdateTrueDims(), daysBefore(), DimsInput, DimsJson, FbaFeeOverview, getFbaFeeOverview(), getSkuFeeHistory() (+9 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.16
Nodes (21): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+13 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.08
Nodes (42): ActionResult, BrandLibraryItem, MarketplaceOptions(), PRICE_TYPES, PriceTypeOption, UPLOADABLE_COUNTRIES, UploadResponse, Asset (+34 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.09
Nodes (56): AdsBulkGeneratorPage(), createBrand(), createKeywordTheme(), createVideoAsset(), deleteBrand(), deleteKeywordTheme(), deleteKeywordThemes(), deletePreset() (+48 more)

### Community 51 - "server.ts"
Cohesion: 0.12
Nodes (23): IncomingCampaign, BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL (+15 more)

### Community 52 - "permissions.ts"
Cohesion: 0.08
Nodes (29): POST(), GoalVsPerformanceLayout(), DashboardPage(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout(), PpcTopUpLayout() (+21 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.16
Nodes (17): Banded, expectedFbaFee(), FeeInput, fromRows(), incremental(), IncrementalRate, priceBandOf(), RateTables (+9 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.12
Nodes (23): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), notesTooltip(), PRIORITY_ICONS, PriorityPill(), Scope (+15 more)

### Community 56 - "hash-password.ts"
Cohesion: 0.13
Nodes (28): budgetFor(), POST(), AD_GROUP_MEDIA, AD_MEDIA, AdsCountry, adsHeaders(), adsPost(), AdsProfile (+20 more)

### Community 57 - "page.tsx"
Cohesion: 0.29
Nodes (7): ChatPanel(), markdownComponents, sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool()

### Community 58 - "fba-fee-tracker-constants.ts"
Cohesion: 0.29
Nodes (7): FeeAlert, ALERT_CAUSES, ALERT_KIND_LABELS, ALERT_KINDS, ALERT_STATUS_LABELS, AlertCause, AlertKind

### Community 59 - "page.tsx"
Cohesion: 0.08
Nodes (40): BrandLibrarySection(), distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), Step, Block (+32 more)

### Community 60 - "dashboard-access-grid.tsx"
Cohesion: 0.20
Nodes (13): AccessItem, DashboardAccessGrid(), Layout, layoutKey(), layoutListeners, memoryLayouts, parseLayout(), readLayout() (+5 more)

### Community 66 - "page.tsx"
Cohesion: 0.20
Nodes (4): PageHeader(), fbaFeeTracker, partners, trends

## Knowledge Gaps
- **284 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem` (+279 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `PPC Schedule AI Import`, `monday.com Dashboards — Comprehensive Reference`, `utils.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `skeleton.tsx`, `projects.ts`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `hash-password.ts`, `page.tsx`, `sp-api.ts`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `cn()` connect `chart.tsx` to `calendar.ts`, `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `utils.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `getStaffDirectory`, `page.tsx`, `page.tsx`, `dashboard-access-grid.tsx`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `createClient()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `PPC Schedule AI Import`, `utils.ts`, `tabs.tsx`, `page-header.tsx`, `projects.ts`, `buildVideoBulk.ts`, `skeleton.tsx`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `hash-password.ts`, `sp-api.ts`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `SCOPE_CURRENCY` to the rest of the system?**
  _287 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06031995803829006 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.07032967032967033 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._