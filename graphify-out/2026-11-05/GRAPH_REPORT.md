# Graph Report - LaLaGreen-Automation-Portal  (2026-11-05)

## Corpus Check
- 208 files · ~153,509 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1588 nodes · 4917 edges · 69 communities (48 shown, 21 thin omitted)
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
- page.tsx
- use-persisted-state.ts
- marketplaces.ts
- sku-grouping.ts
- layout.tsx
- page.tsx
- dashboard-access-grid.tsx
- price-change-plans.ts

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

## Communities (69 total, 21 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.05
Nodes (121): POST(), CalendarSidebar(), DayTasksDialog(), DayView(), DeleteScopeDialog(), ManageAccessDialog(), layoutWeekRibbons(), MonthGrid() (+113 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.05
Nodes (96): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+88 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.21
Nodes (21): accessSummary(), ManageUsersPage(), StaffMember, changeOwnPassword(), createStaffMember(), deleteStaffMember(), getCurrentUser(), listStaff() (+13 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.08
Nodes (26): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, date-holidays, @dnd-kit/core (+18 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.08
Nodes (43): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), NewPricePlanSheet(), nextStepPrice() (+35 more)

### Community 5 - "shadcn/ui Component Registry Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 6 - "PPC Schedule AI Import"
Cohesion: 0.17
Nodes (18): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+10 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "product-block.tsx"
Cohesion: 0.05
Nodes (31): PageHeader(), PlaceholderPage(), sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), adsBulkGenerator (+23 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.12
Nodes (32): fetchSkuDetail(), fetchSkuPricing(), requireStaff(), marketplace, asNumber(), callSpApi(), callSpApiJson(), chunk() (+24 more)

### Community 10 - "utils.ts"
Cohesion: 0.13
Nodes (23): PartnersView(), withField(), cleanShortName(), createPartner(), deletePartner(), friendlyError(), listPartners(), movePartner() (+15 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.10
Nodes (49): StaffDrilldown(), Tab, PriorityBadge(), priorityBadgeClass(), StaffProfileView(), TaskSubmit, createSkill(), requireSkillsEditor() (+41 more)

### Community 13 - "Root Layout"
Cohesion: 0.12
Nodes (29): ActionResult, BrandLibraryItem, distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), Block (+21 more)

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
Cohesion: 0.13
Nodes (28): budgetFor(), POST(), AD_GROUP_MEDIA, AD_MEDIA, AdsCountry, adsHeaders(), adsPost(), AdsProfile (+20 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.17
Nodes (19): Row, AsinBsrHistory, BsrAlert, BsrSnapshot, BsrSyncRun, daysBefore(), getAsinBsrHistory(), getTrendsOverview() (+11 more)

### Community 42 - "projects.ts"
Cohesion: 0.19
Nodes (18): SCOPE_OPTIONS, ComposeDialog(), MODE_LABEL, SendResult, splitAddresses(), Button(), buttonVariants, Dialog() (+10 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.14
Nodes (25): foldKey(), foldListeners, initials(), isActive(), memoryPins, NavGroupSection(), NavLeaf(), parseFolds() (+17 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (58): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES (+50 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (66): ComposeDialogProps, CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps, RFC-5322, buildRawMessage() (+58 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.09
Nodes (27): STEPS, WizardStep, AlertRankCell(), AsinDetail(), buildRows(), CategoryRank, Delta(), Filter (+19 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.20
Nodes (17): BulkDimsResult, bulkUpdateTrueDims(), daysBefore(), DimsInput, DimsJson, FbaFeeOverview, getFbaFeeOverview(), getSkuFeeHistory() (+9 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.16
Nodes (21): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+13 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.12
Nodes (29): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), isBoolean(), isScope(), isSortKey(), notesTooltip() (+21 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.14
Nodes (21): POST(), BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, DashboardPage(), getMyPermissions() (+13 more)

### Community 51 - "server.ts"
Cohesion: 0.13
Nodes (23): IncomingCampaign, BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL (+15 more)

### Community 52 - "permissions.ts"
Cohesion: 0.08
Nodes (26): GoalVsPerformanceLayout(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout(), PpcTopUpLayout(), PriceChangePlansLayout(), SponsoredBrandsUploadLayout() (+18 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.15
Nodes (16): MarketplaceOptions(), formatPrice(), MasterListPage(), matchesRegion(), PullFromAmazonSheet(), PullResult, RegionFilter, SkuDetailDialog() (+8 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.08
Nodes (63): BrandLibrarySection(), AdsBulkGeneratorPage(), Step, formatWhen(), TaskUpdates(), createBrand(), createKeywordTheme(), createVideoAsset() (+55 more)

### Community 56 - "session.ts"
Cohesion: 0.15
Nodes (18): POST(), POST(), toLocale(), setLocaleCookie(), EMPTY_PERMISSIONS, LEGACY_SECTIONS, Role, ROLE_LABELS (+10 more)

### Community 57 - "page.tsx"
Cohesion: 0.10
Nodes (22): PortalLayout(), LanguageCard(), PasswordField(), SettingsPage(), DirectoryEntry, JobRoleEditor(), TeamPage(), SortableTile() (+14 more)

### Community 58 - "fba-fee-tracker-constants.ts"
Cohesion: 0.29
Nodes (7): FeeAlert, ALERT_CAUSES, ALERT_KIND_LABELS, ALERT_KINDS, ALERT_STATUS_LABELS, AlertCause, AlertKind

### Community 59 - "page-header.tsx"
Cohesion: 0.08
Nodes (36): ChatPanel(), markdownComponents, PartnerGrid(), pricesHref(), Row, AddSkillDialog(), LevelBadge(), LevelFilter (+28 more)

### Community 61 - "marketplaces.ts"
Cohesion: 0.14
Nodes (30): RegionPicker(), RegionTag(), addRegionsTo(), addSkus(), addSkusGrouped(), ColumnDetectSchema, ColumnMapping, deleteSku() (+22 more)

### Community 62 - "page.tsx"
Cohesion: 0.10
Nodes (42): AddPriceDialog(), formatPercent(), ImportPricesSheet(), PriceCell(), PriceRow(), ProductsView(), addProductPrice(), cleanDetails() (+34 more)

### Community 63 - "page.tsx"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, tsx, @types/bcryptjs, @types/mailparser (+5 more)

### Community 64 - "use-persisted-state.ts"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

### Community 65 - "marketplaces.ts"
Cohesion: 0.29
Nodes (5): MARKETPLACE_CODES, MARKETPLACE_IDS, Region, REGION_HOSTS, REGION_LABELS

### Community 66 - "sku-grouping.ts"
Cohesion: 0.47
Nodes (4): InsertionPlan, naturalCompare(), planInsertions(), skuPrefix()

### Community 67 - "layout.tsx"
Cohesion: 0.11
Nodes (25): inter, metadata, RootLayout(), LoginPage(), CORE_VALUES, CoreValue, CoreValues(), I18nContext (+17 more)

### Community 68 - "page.tsx"
Cohesion: 0.23
Nodes (14): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+6 more)

### Community 71 - "dashboard-access-grid.tsx"
Cohesion: 0.14
Nodes (21): AccessItem, DashboardAccessGrid(), Layout, layoutKey(), layoutListeners, memoryLayouts, parseLayout(), readLayout() (+13 more)

### Community 72 - "price-change-plans.ts"
Cohesion: 0.29
Nodes (11): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PricePlan, PriceType, requirePlanAccess() (+3 more)

## Knowledge Gaps
- **318 isolated node(s):** `StaffMember`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem`, `Step` (+313 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `PPC Schedule AI Import`, `product-block.tsx`, `monday.com Dashboards — Comprehensive Reference`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `projects.ts`, `build.ts`, `page-header.tsx`, `mail.ts`, `skeleton.tsx`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `getStaffDirectory`, `session.ts`, `page.tsx`, `marketplaces.ts`, `page.tsx`, `price-change-plans.ts`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Why does `cn()` connect `page-header.tsx` to `calendar.ts`, `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `dashboard-access-grid.tsx`, `utils.ts`, `tabs.tsx`, `page-header.tsx`, `Root Layout`, `buildVideoBulk.ts`, `mail.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `Sponsored Brands Bulk XLSX Builder`, `projects.ts`, `page.tsx`, `page.tsx`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `use-persisted-state.ts`, `PPC Top-Up Automation`, `mail.ts`, `PPC Schedule AI Import`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **What connects `StaffMember`, `SCOPE_CURRENCY`, `ActionResult` to the rest of the system?**
  _321 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05326797385620915 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.05293931731984829 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._