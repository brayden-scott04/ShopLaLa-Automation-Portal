# Graph Report - LaLaGreen-Automation-Portal  (2026-10-30)

## Corpus Check
- 206 files · ~152,092 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1571 nodes · 4880 edges · 73 communities (52 shown, 21 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.57)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0f55b39d`
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
- price-plan-import.ts
- page.tsx
- layout.tsx
- page.tsx
- nav.ts
- page-header.tsx
- dashboard-access-grid.tsx
- price-change-plans.ts
- session.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 148 edges
2. `createServiceClient()` - 123 edges
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

## Communities (73 total, 21 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.06
Nodes (112): POST(), CalendarSidebar(), DayTasksDialog(), DayView(), DeleteScopeDialog(), ManageAccessDialog(), layoutWeekRibbons(), MonthGrid() (+104 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.07
Nodes (75): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+67 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.19
Nodes (22): accessSummary(), ManageUsersPage(), StaffMember, DirectoryEntry, TeamPage(), createStaffMember(), deleteStaffMember(), getCurrentUser() (+14 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.11
Nodes (27): UPLOADABLE_COUNTRIES, UploadResponse, newBlock(), ProductBlock(), toLines(), COUNTRIES, PartnerGrid(), pricesHref() (+19 more)

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
Nodes (19): PlaceholderPage(), adsBulkGenerator, advertisements, BASE_PATHS, calendar, defineNavItem(), finance, goalVsPerformance (+11 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.12
Nodes (30): fetchSkuDetail(), fetchSkuPricing(), requireStaff(), marketplace, asNumber(), callSpApi(), callSpApiJson(), chunk() (+22 more)

### Community 10 - "utils.ts"
Cohesion: 0.16
Nodes (19): cleanShortName(), createPartner(), deletePartner(), friendlyError(), listPartners(), movePartner(), Partner, renamePartner() (+11 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.10
Nodes (49): LanguageCard(), PasswordField(), SettingsPage(), JobRoleEditor(), PinToggle(), StaffDrilldown(), Tab, NewTeamDialog() (+41 more)

### Community 13 - "Root Layout"
Cohesion: 0.12
Nodes (24): ActionResult, BrandLibraryItem, AlertRankCell(), AsinDetail(), buildRows(), CategoryRank, Delta(), Filter (+16 more)

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
Nodes (46): POST(), BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor(), POST() (+38 more)

### Community 26 - "chart.tsx"
Cohesion: 0.33
Nodes (7): sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), NAV_GROUPS, SUBGROUP_LABELS

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.17
Nodes (19): Row, AsinBsrHistory, BsrAlert, BsrSnapshot, BsrSyncRun, daysBefore(), getAsinBsrHistory(), getTrendsOverview() (+11 more)

### Community 42 - "projects.ts"
Cohesion: 0.12
Nodes (25): FeeBreakdownBody(), SCOPE_CURRENCY, StatTile(), SCOPE_OPTIONS, ComposeDialog(), MODE_LABEL, SendResult, splitAddresses() (+17 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.15
Nodes (23): foldKey(), foldListeners, initials(), isActive(), memoryPins, NavGroupSection(), NavLeaf(), parseFolds() (+15 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.06
Nodes (54): money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPES, sgtDate(), addInto() (+46 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (66): ComposeDialogProps, CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps, RFC-5322, buildRawMessage() (+58 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.14
Nodes (21): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), nextStepPrice(), PlanCard() (+13 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.20
Nodes (17): BulkDimsResult, bulkUpdateTrueDims(), daysBefore(), DimsInput, DimsJson, FbaFeeOverview, getFbaFeeOverview(), getSkuFeeHistory() (+9 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.16
Nodes (21): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+13 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.13
Nodes (26): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), notesTooltip(), PRIORITY_ICONS, PriorityPill(), Scope (+18 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.23
Nodes (9): Option, SearchableSelect(), ChatPanel(), markdownComponents, Button(), buttonVariants, Input(), Label() (+1 more)

### Community 51 - "server.ts"
Cohesion: 0.13
Nodes (23): IncomingCampaign, BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL (+15 more)

### Community 52 - "permissions.ts"
Cohesion: 0.08
Nodes (26): GoalVsPerformanceLayout(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout(), PpcTopUpLayout(), PriceChangePlansLayout(), SponsoredBrandsUploadLayout() (+18 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.14
Nodes (17): MarketplaceOptions(), formatPrice(), MasterListPage(), matchesRegion(), PullFromAmazonSheet(), PullResult, RegionFilter, SkuDetailDialog() (+9 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.05
Nodes (88): BrandLibrarySection(), distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), AdsBulkGeneratorPage(), Step (+80 more)

### Community 56 - "session.ts"
Cohesion: 0.25
Nodes (12): POST(), POST(), toLocale(), setLocaleCookie(), toRole(), clearSessionCookie(), getSecretKey(), setSessionCookie() (+4 more)

### Community 57 - "page.tsx"
Cohesion: 0.16
Nodes (11): PortalLayout(), DashboardLink(), Sidebar(), Topbar(), EMPTY_PERMISSIONS, LEGACY_SECTIONS, PermissionSet, Role (+3 more)

### Community 58 - "fba-fee-tracker-constants.ts"
Cohesion: 0.29
Nodes (7): FeeAlert, ALERT_CAUSES, ALERT_KIND_LABELS, ALERT_KINDS, ALERT_STATUS_LABELS, AlertCause, AlertKind

### Community 59 - "page-header.tsx"
Cohesion: 0.10
Nodes (32): AddPriceDialog(), formatPercent(), ImportPricesSheet(), PriceCell(), PriceRow(), ProductsView(), AlertDialogMedia(), AlertDialogOverlay() (+24 more)

### Community 60 - "getMyPermissions"
Cohesion: 0.33
Nodes (9): LoginPage(), DashboardPage(), CORE_VALUES, CoreValue, CoreValues(), getLocale(), getT(), getMyPermissions() (+1 more)

### Community 61 - "marketplaces.ts"
Cohesion: 0.12
Nodes (33): NewPricePlanSheet(), RegionPicker(), RegionTag(), addRegionsTo(), addSkus(), addSkusGrouped(), ColumnDetectSchema, ColumnMapping (+25 more)

### Community 62 - "page.tsx"
Cohesion: 0.12
Nodes (32): addProductPrice(), cleanDetails(), cleanPrice(), deleteProductPrice(), getPriceForSku(), importProductPrices(), listFactories(), listProductPrices() (+24 more)

### Community 63 - "page.tsx"
Cohesion: 0.29
Nodes (5): MARKETPLACE_CODES, MARKETPLACE_IDS, Region, REGION_HOSTS, REGION_LABELS

### Community 65 - "price-plan-import.ts"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 66 - "page.tsx"
Cohesion: 0.47
Nodes (4): InsertionPlan, naturalCompare(), planInsertions(), skuPrefix()

### Community 67 - "layout.tsx"
Cohesion: 0.13
Nodes (20): inter, metadata, RootLayout(), I18nContext, I18nProvider(), Locale, LOCALE_LABELS, LOCALE_TAGS (+12 more)

### Community 68 - "page.tsx"
Cohesion: 0.19
Nodes (16): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+8 more)

### Community 69 - "nav.ts"
Cohesion: 0.31
Nodes (10): localizeNavGroup(), localizeNavItem(), NAV_TEXT_KEYS, NavText(), useLocalizedNav(), useSubgroupLabel(), Translator, NavGroup (+2 more)

### Community 70 - "page-header.tsx"
Cohesion: 0.12
Nodes (9): PageHeader(), PartnersView(), withField(), fbaFeeTracker, partners, products, trends, FORWARDER_LANES (+1 more)

### Community 71 - "dashboard-access-grid.tsx"
Cohesion: 0.20
Nodes (13): AccessItem, DashboardAccessGrid(), Layout, layoutKey(), layoutListeners, memoryLayouts, parseLayout(), readLayout() (+5 more)

### Community 72 - "price-change-plans.ts"
Cohesion: 0.29
Nodes (11): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PricePlan, PriceType, requirePlanAccess() (+3 more)

### Community 73 - "session.ts"
Cohesion: 0.23
Nodes (14): createSkill(), requireSkillsEditor(), Result, setStaffSkillLevel(), StaffSkillsView, tr(), Skill, SKILL_LEVEL_BADGE (+6 more)

## Knowledge Gaps
- **313 isolated node(s):** `StaffMember`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem`, `Step` (+308 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `PPC Schedule AI Import`, `monday.com Dashboards — Comprehensive Reference`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `projects.ts`, `chart.tsx`, `build.ts`, `page-header.tsx`, `mail.ts`, `skeleton.tsx`, `server.ts`, `permissions.ts`, `getStaffDirectory`, `session.ts`, `page.tsx`, `getMyPermissions`, `marketplaces.ts`, `page.tsx`, `price-plan-import.ts`, `price-change-plans.ts`, `session.ts`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Why does `cn()` connect `page-header.tsx` to `calendar.ts`, `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `page-header.tsx`, `dashboard-access-grid.tsx`, `projects.ts`, `tabs.tsx`, `page-header.tsx`, `Root Layout`, `mail.ts`, `Sponsored Brands Bulk XLSX Builder`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `buildVideoBulk.ts`, `getStaffDirectory`, `page.tsx`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `PPC Top-Up Automation`, `marketplaces.ts`, `mail.ts`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **What connects `StaffMember`, `SCOPE_CURRENCY`, `ActionResult` to the rest of the system?**
  _316 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05974193548387097 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.07032967032967033 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._