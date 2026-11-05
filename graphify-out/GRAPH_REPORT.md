# Graph Report - LaLaGreen-Automation-Portal  (2026-11-05)

## Corpus Check
- 209 files · ~154,585 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1595 nodes · 4964 edges · 67 communities (46 shown, 21 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `64cf4489`
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
- page.tsx
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
- session.ts
- page.tsx
- fba-fee-tracker-constants.ts
- page-header.tsx
- marketplaces.ts
- page.tsx
- marketplaces.ts
- sku-grouping.ts
- layout.tsx
- dashboard-access-grid.tsx
- price-change-plans.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 150 edges
2. `createServiceClient()` - 123 edges
3. `getSession()` - 104 edges
4. `createClient()` - 86 edges
5. `assertItemAccess()` - 47 edges
6. `useT()` - 46 edges
7. `Button()` - 32 edges
8. `requireStaff()` - 24 edges
9. `Skeleton()` - 22 edges
10. `Card()` - 21 edges

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

## Communities (67 total, 21 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.05
Nodes (119): CalendarSidebar(), DayTasksDialog(), DayView(), layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS, formatDate() (+111 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.05
Nodes (97): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+89 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.13
Nodes (30): accessSummary(), ManageUsersPage(), StaffMember, LanguageCard(), PasswordField(), SettingsPage(), TeamPage(), changeOwnPassword() (+22 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (47): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, date-holidays, @dnd-kit/core (+39 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.09
Nodes (36): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+28 more)

### Community 5 - "shadcn/ui Component Registry Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 6 - "PPC Schedule AI Import"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "product-block.tsx"
Cohesion: 0.06
Nodes (27): DirectoryEntry, PageHeader(), PlaceholderPage(), advertisements, BASE_PATHS, bulkCampaignUpload, calendar, defineNavItem() (+19 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.14
Nodes (28): marketplace, asNumber(), callSpApi(), callSpApiJson(), chunk(), credentialsFor(), extractFeaturedPricing(), extractOfferPrice() (+20 more)

### Community 10 - "utils.ts"
Cohesion: 0.13
Nodes (23): PartnersView(), withField(), cleanShortName(), createPartner(), deletePartner(), friendlyError(), listPartners(), movePartner() (+15 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.18
Nodes (18): skillText(), StaffSkillsView(), createSkill(), getStaffSkills(), requireSkillsEditor(), Result, setStaffSkillLevel(), StaffSkillsView (+10 more)

### Community 13 - "Root Layout"
Cohesion: 0.18
Nodes (15): distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), Block, BlockMode, newBlock() (+7 more)

### Community 15 - "ESLint Config"
Cohesion: 0.40
Nodes (4): eslintConfig, I18N_ENFORCED, SHOWN, shownStrings

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.05
Nodes (36): Adding a Layer-1 group, Adding a new staff member, Adding a page to an existing group, Adding an API route, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+28 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.16
Nodes (17): Banded, expectedFbaFee(), FeeInput, fromRows(), incremental(), IncrementalRate, priceBandOf(), RateTables (+9 more)

### Community 25 - "projects.ts"
Cohesion: 0.08
Nodes (44): BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor(), POST(), AD_GROUP_MEDIA (+36 more)

### Community 26 - "page.tsx"
Cohesion: 0.13
Nodes (23): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), MarketplaceOptions(), NewBulkPricePlanSheet(), NewPricePlanSheet() (+15 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.17
Nodes (19): Row, AsinBsrHistory, BsrAlert, BsrSnapshot, BsrSyncRun, daysBefore(), getAsinBsrHistory(), getTrendsOverview() (+11 more)

### Community 42 - "projects.ts"
Cohesion: 0.12
Nodes (33): DeleteScopeDialog(), SCOPE_OPTIONS, NameCalendarDialog(), WEEKDAY_FULL, WEEKDAY_SHORT, MODE_LABEL, SendResult, ChatPanel() (+25 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.12
Nodes (28): DashboardLink(), foldKey(), foldListeners, initials(), isActive(), memoryPins, NavGroupSection(), NavLeaf() (+20 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (58): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES (+50 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (68): ComposeDialog(), ComposeDialogProps, splitAddresses(), CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps (+60 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.13
Nodes (19): AlertRankCell(), AsinDetail(), buildRows(), CategoryRank, Delta(), Filter, KIND_SEVERITY, rankText() (+11 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.20
Nodes (17): BulkDimsResult, bulkUpdateTrueDims(), daysBefore(), DimsInput, DimsJson, FbaFeeOverview, getFbaFeeOverview(), getSkuFeeHistory() (+9 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.16
Nodes (21): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+13 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.12
Nodes (25): ManageAccessDialog(), AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), isBoolean(), isScope(), isSortKey() (+17 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.33
Nodes (6): sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), SUBGROUP_LABELS

### Community 51 - "server.ts"
Cohesion: 0.12
Nodes (22): BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL, SB_MAG_HEADER (+14 more)

### Community 52 - "permissions.ts"
Cohesion: 0.08
Nodes (26): GoalVsPerformanceLayout(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout(), PpcTopUpLayout(), PriceChangePlansLayout(), SponsoredBrandsUploadLayout() (+18 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.10
Nodes (35): ActionResult, BrandLibraryItem, STEPS, WizardStep, Preset, MasterListPage(), matchesRegion(), PullFromAmazonSheet() (+27 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.05
Nodes (97): BrandLibrarySection(), AdsBulkGeneratorPage(), Step, formatWhen(), TaskUpdates(), StaffDrilldown(), Tab, PriorityBadge() (+89 more)

### Community 56 - "session.ts"
Cohesion: 0.12
Nodes (23): POST(), POST(), IncomingCampaign, POST(), POST(), PortalLayout(), toLocale(), setLocaleCookie() (+15 more)

### Community 57 - "page.tsx"
Cohesion: 0.83
Nodes (3): fetchSkuDetail(), fetchSkuPricing(), requireStaff()

### Community 58 - "fba-fee-tracker-constants.ts"
Cohesion: 0.29
Nodes (7): FeeAlert, ALERT_CAUSES, ALERT_KIND_LABELS, ALERT_KINDS, ALERT_STATUS_LABELS, AlertCause, AlertKind

### Community 59 - "page-header.tsx"
Cohesion: 0.09
Nodes (36): Option, SearchableSelect(), AddPriceDialog(), formatPercent(), ImportPricesSheet(), PriceCell(), PriceRow(), ProductsView() (+28 more)

### Community 61 - "marketplaces.ts"
Cohesion: 0.14
Nodes (30): RegionPicker(), RegionTag(), addRegionsTo(), addSkus(), addSkusGrouped(), ColumnDetectSchema, ColumnMapping, deleteSku() (+22 more)

### Community 62 - "page.tsx"
Cohesion: 0.13
Nodes (31): addProductPrice(), cleanDetails(), cleanPrice(), deleteProductPrice(), importProductPrices(), listFactories(), listProductPrices(), NUMERIC_DETAILS (+23 more)

### Community 65 - "marketplaces.ts"
Cohesion: 0.18
Nodes (9): PricePlan, MARKETPLACE_CODES, MARKETPLACE_IDS, MarketplaceCode, Region, REGION_HOSTS, REGION_LABELS, SKU_REGION_LABELS (+1 more)

### Community 66 - "sku-grouping.ts"
Cohesion: 0.47
Nodes (4): InsertionPlan, naturalCompare(), planInsertions(), skuPrefix()

### Community 67 - "layout.tsx"
Cohesion: 0.12
Nodes (25): inter, metadata, RootLayout(), LoginPage(), DashboardPage(), CORE_VALUES, CoreValue, CoreValues() (+17 more)

### Community 71 - "dashboard-access-grid.tsx"
Cohesion: 0.09
Nodes (33): JobRoleEditor(), AccessItem, DashboardAccessGrid(), Layout, layoutKey(), layoutListeners, memoryLayouts, parseLayout() (+25 more)

### Community 72 - "price-change-plans.ts"
Cohesion: 0.36
Nodes (9): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PriceType, requirePlanAccess(), requireStaff() (+1 more)

## Knowledge Gaps
- **318 isolated node(s):** `StaffMember`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem`, `Step` (+313 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `PPC Schedule AI Import`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `projects.ts`, `build.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `skeleton.tsx`, `product-block.tsx`, `fba-fee-calculator.ts`, `permissions.ts`, `getStaffDirectory`, `session.ts`, `page.tsx`, `marketplaces.ts`, `page.tsx`, `layout.tsx`, `price-change-plans.ts`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Why does `cn()` connect `page-header.tsx` to `calendar.ts`, `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `dashboard-access-grid.tsx`, `projects.ts`, `utils.ts`, `page-header.tsx`, `Root Layout`, `buildVideoBulk.ts`, `mail.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `tabs.tsx`, `Sponsored Brands Bulk XLSX Builder`, `fba-fee-calculator.ts`, `getStaffDirectory`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `PPC Top-Up Automation`, `marketplaces.ts`, `mail.ts`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **What connects `StaffMember`, `SCOPE_CURRENCY`, `ActionResult` to the rest of the system?**
  _321 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05445431761221235 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.0527868343424934 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.13174603174603175 - nodes in this community are weakly interconnected._