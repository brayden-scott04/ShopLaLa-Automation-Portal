# Graph Report - LaLaGreen-Automation-Portal  (2026-10-29)

## Corpus Check
- 206 files · ~150,611 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1554 nodes · 4836 edges · 78 communities (55 shown, 23 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.57)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `41667b63`
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
- session.ts
- page.tsx
- fba-fee-tracker-constants.ts
- page-header.tsx
- getMyPermissions
- marketplaces.ts
- page.tsx
- page.tsx
- session.ts
- price-plan-import.ts
- page.tsx
- layout.tsx
- page.tsx
- nav.ts
- page-header.tsx
- dashboard-access-grid.tsx
- price-change-plans.ts
- session.ts
- buildVideoBulk.ts
- page.tsx
- page.tsx
- page.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 148 edges
2. `createServiceClient()` - 122 edges
3. `getSession()` - 103 edges
4. `createClient()` - 85 edges
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

## Communities (78 total, 23 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.06
Nodes (107): CalendarSidebar(), DayTasksDialog(), DayView(), DeleteScopeDialog(), ManageAccessDialog(), layoutWeekRibbons(), MonthGrid(), RibbonCell (+99 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.07
Nodes (77): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+69 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.26
Nodes (16): changeOwnPassword(), createStaffMember(), deleteStaffMember(), listStaff(), renameStaffMember(), requireAdmin(), requireAdminOrModerator(), resetPassword() (+8 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.08
Nodes (31): distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), Block, BlockMode, newBlock() (+23 more)

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
Nodes (6): PlaceholderPage(), advertisements, finance, goalVsPerformance, listingScore, orders

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.12
Nodes (32): fetchSkuDetail(), fetchSkuPricing(), requireStaff(), marketplace, asNumber(), callSpApi(), callSpApiJson(), chunk() (+24 more)

### Community 10 - "utils.ts"
Cohesion: 0.16
Nodes (20): cleanShortName(), createPartner(), deletePartner(), friendlyError(), listPartners(), movePartner(), Partner, renamePartner() (+12 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.14
Nodes (17): PortalLayout(), PasswordField(), SettingsPage(), DirectoryEntry, JobRoleEditor(), TeamPage(), DashboardLink(), PinToggle() (+9 more)

### Community 13 - "Root Layout"
Cohesion: 0.12
Nodes (20): SCOPE_CURRENCY, StatTile(), AlertRankCell(), AsinDetail(), buildRows(), CategoryRank, Delta(), Filter (+12 more)

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
Cohesion: 0.14
Nodes (23): AD_GROUP_MEDIA, AD_MEDIA, AdsCountry, adsHeaders(), adsPost(), AdsProfile, CAMPAIGN_MEDIA, createSbAdGroup() (+15 more)

### Community 26 - "chart.tsx"
Cohesion: 0.33
Nodes (6): sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), SUBGROUP_LABELS

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.17
Nodes (18): Row, AsinBsrHistory, BsrAlert, BsrSnapshot, BsrSyncRun, daysBefore(), getAsinBsrHistory(), getTrendsOverview() (+10 more)

### Community 42 - "projects.ts"
Cohesion: 0.15
Nodes (25): SCOPE_OPTIONS, WEEKDAY_FULL, WEEKDAY_SHORT, MODE_LABEL, SendResult, markdownComponents, TaskFormDialogProps, TaskFormInner() (+17 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.11
Nodes (34): ManageUsersPage(), foldKey(), foldListeners, initials(), isActive(), memoryPins, NavGroupSection(), NavLeaf() (+26 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.06
Nodes (55): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPES, sgtDate() (+47 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (68): ComposeDialog(), ComposeDialogProps, splitAddresses(), CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps (+60 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.17
Nodes (17): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), NewPricePlanSheet(), nextStepPrice() (+9 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.18
Nodes (19): BulkDimsResult, bulkUpdateTrueDims(), daysBefore(), DimsInput, DimsJson, FbaFeeOverview, getFbaFeeOverview(), getSkuFeeHistory() (+11 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.16
Nodes (21): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+13 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.13
Nodes (21): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), notesTooltip(), PRIORITY_ICONS, PriorityPill(), Scope (+13 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.14
Nodes (25): ActionResult, BrandLibraryItem, STEPS, WizardStep, Preset, AssetsSection(), BrandsSection(), COUNTRIES (+17 more)

### Community 51 - "server.ts"
Cohesion: 0.19
Nodes (13): IncomingCampaign, BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL (+5 more)

### Community 52 - "permissions.ts"
Cohesion: 0.06
Nodes (35): accessSummary(), StaffMember, GoalVsPerformanceLayout(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout(), PpcTopUpLayout() (+27 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.15
Nodes (16): MarketplaceOptions(), formatPrice(), MasterListPage(), matchesRegion(), PullFromAmazonSheet(), PullResult, RegionFilter, SkuDetailDialog() (+8 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.06
Nodes (92): BrandLibrarySection(), AdsBulkGeneratorPage(), Step, formatWhen(), TaskUpdates(), PriorityBadge(), priorityBadgeClass(), StaffProfileView() (+84 more)

### Community 56 - "session.ts"
Cohesion: 0.23
Nodes (13): POST(), POST(), toLocale(), setLocaleCookie(), toRole(), clearSessionCookie(), getSecretKey(), SessionPayload (+5 more)

### Community 57 - "page.tsx"
Cohesion: 0.20
Nodes (14): UPLOADABLE_COUNTRIES, UploadResponse, ImportPricesSheet(), PriceCell(), PriceRow(), DialogDescription(), Sheet(), SheetClose() (+6 more)

### Community 58 - "fba-fee-tracker-constants.ts"
Cohesion: 0.29
Nodes (7): FeeAlert, ALERT_CAUSES, ALERT_KIND_LABELS, ALERT_KINDS, ALERT_STATUS_LABELS, AlertCause, AlertKind

### Community 59 - "page-header.tsx"
Cohesion: 0.11
Nodes (26): Option, SearchableSelect(), AddPriceDialog(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount() (+18 more)

### Community 60 - "getMyPermissions"
Cohesion: 0.24
Nodes (15): POST(), POST(), BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor() (+7 more)

### Community 61 - "marketplaces.ts"
Cohesion: 0.14
Nodes (30): RegionPicker(), RegionTag(), addRegionsTo(), addSkus(), addSkusGrouped(), ColumnDetectSchema, ColumnMapping, deleteSku() (+22 more)

### Community 62 - "page.tsx"
Cohesion: 0.20
Nodes (19): addProductPrice(), cleanPrice(), deleteProductPrice(), getPriceForSku(), importProductPrices(), listFactories(), listProductPrices(), parsePriceExcel() (+11 more)

### Community 63 - "page.tsx"
Cohesion: 0.29
Nodes (5): MARKETPLACE_CODES, MARKETPLACE_IDS, Region, REGION_HOSTS, REGION_LABELS

### Community 64 - "session.ts"
Cohesion: 0.25
Nodes (10): BaseCampaignInput, budgetFor(), buildSponsoredBrandsBulk(), CampaignInput, dedupeKeywords(), emptyRow(), HEADER, SHEET_NAME (+2 more)

### Community 65 - "price-plan-import.ts"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 66 - "page.tsx"
Cohesion: 0.47
Nodes (4): InsertionPlan, naturalCompare(), planInsertions(), skuPrefix()

### Community 67 - "layout.tsx"
Cohesion: 0.09
Nodes (32): inter, metadata, RootLayout(), LoginPage(), DashboardPage(), LanguageCard(), CORE_VALUES, CoreValue (+24 more)

### Community 68 - "page.tsx"
Cohesion: 0.23
Nodes (14): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+6 more)

### Community 69 - "nav.ts"
Cohesion: 0.14
Nodes (12): adsBulkGenerator, BASE_PATHS, calendar, defineNavItem(), masterList, NavItemInput, priceChangePlans, profitAnalytics (+4 more)

### Community 70 - "page-header.tsx"
Cohesion: 0.17
Nodes (6): ChatPanel(), PageHeader(), ProductsView(), fbaFeeTracker, products, trends

### Community 71 - "dashboard-access-grid.tsx"
Cohesion: 0.20
Nodes (13): AccessItem, DashboardAccessGrid(), Layout, layoutKey(), layoutListeners, memoryLayouts, parseLayout(), readLayout() (+5 more)

### Community 72 - "price-change-plans.ts"
Cohesion: 0.29
Nodes (11): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PricePlan, PriceType, requirePlanAccess() (+3 more)

### Community 73 - "session.ts"
Cohesion: 0.13
Nodes (26): StaffDrilldown(), Tab, AddSkillDialog(), LevelBadge(), LevelFilter, LevelPicker(), skillText(), StaffSkillsView() (+18 more)

### Community 74 - "buildVideoBulk.ts"
Cohesion: 0.27
Nodes (10): BrandProfile, budgetFor(), buildVideoBulk(), dedupeKeywords(), emptyRow(), HEADER, SHEET_NAME, toAmazonDate() (+2 more)

### Community 75 - "page.tsx"
Cohesion: 0.33
Nodes (4): PartnersView(), withField(), partners, FORWARDER_LANES

## Knowledge Gaps
- **310 isolated node(s):** `StaffMember`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem`, `Step` (+305 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `PPC Schedule AI Import`, `monday.com Dashboards — Comprehensive Reference`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `chart.tsx`, `build.ts`, `page-header.tsx`, `mail.ts`, `skeleton.tsx`, `server.ts`, `permissions.ts`, `getStaffDirectory`, `session.ts`, `getMyPermissions`, `marketplaces.ts`, `page.tsx`, `price-plan-import.ts`, `layout.tsx`, `price-change-plans.ts`, `session.ts`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Why does `cn()` connect `page-header.tsx` to `calendar.ts`, `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `Sponsored Brands Bulk XLSX Builder`, `Root Layout`, `projects.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `permissions.ts`, `getStaffDirectory`, `page.tsx`, `page-header.tsx`, `dashboard-access-grid.tsx`, `session.ts`, `page.tsx`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `PPC Top-Up Automation`, `mail.ts`, `skeleton.tsx`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **What connects `StaffMember`, `SCOPE_CURRENCY`, `ActionResult` to the rest of the system?**
  _313 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.061529696624412475 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.06802244039270687 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._