# Graph Report - LaLaGreen-Automation-Portal  (2026-11-07)

## Corpus Check
- 225 files · ~172,529 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1738 nodes · 5506 edges · 75 communities (54 shown, 21 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f38517a1`
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
- nav.ts
- marketplaces.ts
- page.tsx
- build.ts
- dashboard-access-grid.tsx
- marketplaces.ts
- layout.tsx
- config.ts
- page.tsx
- page.tsx
- fba-fee-tracker-constants.ts
- price-change-plans.ts
- sku-grouping.ts
- getT
- pricing-update.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 164 edges
2. `createServiceClient()` - 141 edges
3. `getSession()` - 112 edges
4. `createClient()` - 88 edges
5. `useT()` - 67 edges
6. `assertItemAccess()` - 49 edges
7. `Button()` - 36 edges
8. `getT()` - 28 edges
9. `getMyPermissions()` - 27 edges
10. `Skeleton()` - 24 edges

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

## Communities (75 total, 21 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.05
Nodes (128): CalendarSidebar(), DayTasksDialog(), DayView(), DeleteScopeDialog(), layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS (+120 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.05
Nodes (97): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+89 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.20
Nodes (22): accessSummary(), ManageUsersPage(), StaffMember, changeOwnPassword(), createStaffMember(), deleteStaffMember(), getCurrentUser(), listStaff() (+14 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (47): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, date-holidays, @dnd-kit/core (+39 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.23
Nodes (14): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+6 more)

### Community 5 - "shadcn/ui Component Registry Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 6 - "PPC Schedule AI Import"
Cohesion: 0.16
Nodes (21): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+13 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "product-block.tsx"
Cohesion: 0.06
Nodes (30): AccessItem, PageHeader(), PlaceholderPage(), adsBulkGenerator, advertisements, BASE_PATHS, calendar, defineNavItem() (+22 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.15
Nodes (30): RegionPicker(), RegionTag(), addRegionsTo(), addSkus(), addSkusGrouped(), ColumnDetectSchema, ColumnMapping, deleteSku() (+22 more)

### Community 10 - "utils.ts"
Cohesion: 0.09
Nodes (43): WorkflowDiagram(), StepEditDialog(), toForm(), FileList(), fill(), Segmented(), SopDialog(), StepPanel() (+35 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.23
Nodes (14): createSkill(), requireSkillsEditor(), Result, setStaffSkillLevel(), StaffSkillsView, tr(), Skill, SKILL_LEVEL_BADGE (+6 more)

### Community 13 - "Root Layout"
Cohesion: 0.12
Nodes (34): DepartmentDialog(), DepartmentColumn(), IconButton(), KIND_CLASSES, Legend(), NodeBox(), NodeDialogState, OrgChartView() (+26 more)

### Community 15 - "ESLint Config"
Cohesion: 0.40
Nodes (4): eslintConfig, I18N_ENFORCED, SHOWN, shownStrings

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.05
Nodes (38): Adding a Layer-1 group, Adding a new staff member, Adding a page to an existing group, Adding an API route, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+30 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.16
Nodes (17): Banded, expectedFbaFee(), FeeInput, fromRows(), incremental(), IncrementalRate, priceBandOf(), RateTables (+9 more)

### Community 25 - "projects.ts"
Cohesion: 0.13
Nodes (29): resolveMarketplace(), budgetFor(), POST(), AD_GROUP_MEDIA, AD_MEDIA, AdsCountry, adsHeaders(), adsPost() (+21 more)

### Community 26 - "page.tsx"
Cohesion: 0.17
Nodes (17): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), NewPricePlanSheet(), nextStepPrice() (+9 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.18
Nodes (19): BulkDimsResult, bulkUpdateTrueDims(), daysBefore(), DimsInput, DimsJson, FbaFeeOverview, getFbaFeeOverview(), getSkuFeeHistory() (+11 more)

### Community 42 - "projects.ts"
Cohesion: 0.13
Nodes (29): SCOPE_OPTIONS, ComposeDialog(), MODE_LABEL, SendResult, splitAddresses(), KIND_LABELS, knownLocations(), NodeDialog() (+21 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.12
Nodes (27): foldKey(), foldListeners, initials(), isActive(), memoryPins, NavGroupSection(), NavLeaf(), parseFolds() (+19 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (57): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES (+49 more)

### Community 45 - "mail.ts"
Cohesion: 0.05
Nodes (79): ComposeDialogProps, CompanyInboxPage(), FOLDER_OPTIONS, formatDate(), MAIL_ACTIONS, Notice, viewKey(), ThreadView() (+71 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.17
Nodes (18): Row, AsinBsrHistory, BsrAlert, BsrSnapshot, BsrSyncRun, daysBefore(), getAsinBsrHistory(), getTrendsOverview() (+10 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.20
Nodes (13): PartnerGrid(), PartnersView(), pricesHref(), Row, withField(), FACTORY_FIELDS, FORWARDER_FIELDS, FORWARDER_LANES (+5 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.08
Nodes (35): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), isBoolean(), isScope(), isSortKey(), notesTooltip() (+27 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.21
Nodes (13): sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), localizeNavGroup(), localizeNavItem(), NAV_TEXT_KEYS (+5 more)

### Community 51 - "server.ts"
Cohesion: 0.13
Nodes (23): IncomingCampaign, BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL (+15 more)

### Community 52 - "permissions.ts"
Cohesion: 0.06
Nodes (32): GoalVsPerformanceLayout(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout(), PpcTopUpLayout(), PriceChangePlansLayout(), SponsoredBrandsUploadLayout() (+24 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.11
Nodes (27): UPLOADABLE_COUNTRIES, UploadResponse, Asset, Block, Brand, newBlock(), ProductBlock(), Theme (+19 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.08
Nodes (59): BrandLibrarySection(), AdsBulkGeneratorPage(), Step, formatWhen(), TaskUpdates(), createBrand(), createKeywordTheme(), createVideoAsset() (+51 more)

### Community 56 - "session.ts"
Cohesion: 0.23
Nodes (13): POST(), POST(), toLocale(), setLocaleCookie(), toRole(), clearSessionCookie(), getSecretKey(), SessionPayload (+5 more)

### Community 57 - "page.tsx"
Cohesion: 0.13
Nodes (29): marketplace, asNumber(), callSpApi(), callSpApiJson(), chunk(), credentialsFor(), extractFeaturedPricing(), extractOfferPrice() (+21 more)

### Community 58 - "fba-fee-tracker-constants.ts"
Cohesion: 0.08
Nodes (45): ActionResult, BrandLibraryItem, distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), Block (+37 more)

### Community 59 - "page-header.tsx"
Cohesion: 0.09
Nodes (33): SearchableSelect(), AddPriceDialog(), formatPercent(), ImportPricesSheet(), PriceCell(), PriceRow(), ProductsView(), Avatar() (+25 more)

### Community 60 - "nav.ts"
Cohesion: 0.10
Nodes (23): ManageAccessDialog(), LanguageCard(), PasswordField(), SettingsPage(), DirectoryEntry, JobRoleEditor(), TeamPage(), DashboardLink() (+15 more)

### Community 61 - "marketplaces.ts"
Cohesion: 0.11
Nodes (21): MarketplaceOptions(), formatPrice(), MasterListPage(), matchesRegion(), PullFromAmazonSheet(), PullResult, RegionFilter, SkuDetailDialog() (+13 more)

### Community 62 - "page.tsx"
Cohesion: 0.12
Nodes (32): addProductPrice(), cleanDetails(), cleanPrice(), deleteProductPrice(), getPriceForSku(), importProductPrices(), listFactories(), listProductPrices() (+24 more)

### Community 63 - "build.ts"
Cohesion: 0.16
Nodes (33): StaffDrilldown(), Tab, PriorityBadge(), priorityBadgeClass(), StaffProfileView(), TaskSubmit, addFunctionalManager(), addTeamMember() (+25 more)

### Community 64 - "dashboard-access-grid.tsx"
Cohesion: 0.23
Nodes (11): DashboardAccessGrid(), Layout, layoutKey(), layoutListeners, memoryLayouts, parseLayout(), readLayout(), SortableTile() (+3 more)

### Community 65 - "marketplaces.ts"
Cohesion: 0.16
Nodes (15): BrandRow, IncomingCampaign, ResolveErr, ResolveOk, BaseCampaignInput, budgetFor(), buildSponsoredBrandsBulk(), CampaignInput (+7 more)

### Community 67 - "layout.tsx"
Cohesion: 0.13
Nodes (20): inter, metadata, RootLayout(), I18nContext, I18nProvider(), Locale, LOCALE_LABELS, LOCALE_TAGS (+12 more)

### Community 68 - "config.ts"
Cohesion: 0.27
Nodes (13): cleanShortName(), createPartner(), deletePartner(), friendlyError(), listPartners(), movePartner(), Partner, renamePartner() (+5 more)

### Community 69 - "page.tsx"
Cohesion: 0.29
Nodes (11): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PricePlan, PriceType, requirePlanAccess() (+3 more)

### Community 70 - "page.tsx"
Cohesion: 0.14
Nodes (18): AlertRankCell(), AsinDetail(), buildRows(), CategoryRank, Delta(), Filter, KIND_SEVERITY, rankText() (+10 more)

### Community 71 - "fba-fee-tracker-constants.ts"
Cohesion: 0.29
Nodes (7): FeeAlert, ALERT_CAUSES, ALERT_KIND_LABELS, ALERT_KINDS, ALERT_STATUS_LABELS, AlertCause, AlertKind

### Community 72 - "price-change-plans.ts"
Cohesion: 0.24
Nodes (16): workflowAccess(), GET(), POST(), POST(), DashboardPage(), PortalLayout(), skillText(), StaffSkillsView() (+8 more)

### Community 73 - "sku-grouping.ts"
Cohesion: 0.47
Nodes (4): InsertionPlan, naturalCompare(), planInsertions(), skuPrefix()

### Community 74 - "getT"
Cohesion: 0.26
Nodes (9): POST(), LoginPage(), OrgChartPage(), CORE_VALUES, CoreValue, CoreValues(), getLocale(), getT() (+1 more)

### Community 79 - "pricing-update.ts"
Cohesion: 0.83
Nodes (3): fetchSkuDetail(), fetchSkuPricing(), requireStaff()

## Knowledge Gaps
- **341 isolated node(s):** `StaffMember`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem`, `Step` (+336 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `price-change-plans.ts` to `calendar.ts`, `PPC Top-Up Automation`, `Auth & Staff Management`, `monday.com Dashboards — Comprehensive Reference`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `Root Layout`, `projects.ts`, `build.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `skeleton.tsx`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `getStaffDirectory`, `session.ts`, `nav.ts`, `page.tsx`, `build.ts`, `config.ts`, `page.tsx`, `pricing-update.ts`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `cn()` connect `page-header.tsx` to `calendar.ts`, `PPC Top-Up Automation`, `PPC Schedule AI Import`, `utils.ts`, `Root Layout`, `page.tsx`, `projects.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `fba-fee-tracker-constants.ts`, `nav.ts`, `build.ts`, `dashboard-access-grid.tsx`, `page.tsx`, `price-change-plans.ts`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Why does `createServiceClient()` connect `getStaffDirectory` to `calendar.ts`, `PPC Top-Up Automation`, `config.ts`, `page.tsx`, `price-change-plans.ts`, `build.ts`, `getT`, `utils.ts`, `page-header.tsx`, `Root Layout`, `Sponsored Brands Bulk XLSX Builder`, `monday.com Dashboards — Comprehensive Reference`, `buildVideoBulk.ts`, `page.tsx`, `build.ts`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **What connects `StaffMember`, `SCOPE_CURRENCY`, `ActionResult` to the rest of the system?**
  _344 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.051019403132079186 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.0527868343424934 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._