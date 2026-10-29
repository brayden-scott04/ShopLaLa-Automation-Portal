# Graph Report - LaLaGreen-Automation-Portal  (2026-10-29)

## Corpus Check
- 197 files · ~145,590 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1500 nodes · 4583 edges · 69 communities (46 shown, 23 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.57)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `20adc43e`
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
- page.tsx
- page-header.tsx
- dashboard-access-grid.tsx
- marketplaces.ts
- page.tsx
- page.tsx
- session.ts
- page.tsx
- layout.tsx
- page.tsx
- task-form-dialog.tsx
- partners.ts
- session.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 148 edges
2. `createServiceClient()` - 122 edges
3. `getSession()` - 102 edges
4. `createClient()` - 84 edges
5. `assertItemAccess()` - 47 edges
6. `Button()` - 32 edges
7. `requireStaff()` - 24 edges
8. `Skeleton()` - 22 edges
9. `Card()` - 21 edges
10. `CardContent()` - 21 edges

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

## Communities (69 total, 23 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.06
Nodes (101): CalendarSidebar(), DayTasksDialog(), DayView(), DeleteScopeDialog(), SCOPE_OPTIONS, ManageAccessDialog(), layoutWeekRibbons(), MonthGrid() (+93 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.07
Nodes (76): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+68 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.17
Nodes (21): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, SettingsPage(), DirectoryEntry, TeamPage(), createStaffMember() (+13 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.08
Nodes (44): distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), Block, BlockMode, newBlock() (+36 more)

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
Cohesion: 0.08
Nodes (23): PlaceholderPage(), adsBulkGenerator, advertisements, BASE_PATHS, bulkCampaignUpload, calendar, defineNavItem(), finance (+15 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.15
Nodes (27): marketplace, asNumber(), callSpApi(), callSpApiJson(), chunk(), credentialsFor(), extractFeaturedPricing(), extractOfferPrice() (+19 more)

### Community 10 - "utils.ts"
Cohesion: 0.17
Nodes (16): PartnerGrid(), PartnersView(), pricesHref(), Row, withField(), Partner, FACTORY_FIELDS, FORWARDER_FIELDS (+8 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.13
Nodes (34): StaffDrilldown(), Tab, PrioritiesDialog(), PriorityBadge(), priorityBadgeClass(), PriorityRow(), StaffProfileView(), TaskSubmit (+26 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.06
Nodes (35): Adding a Layer-1 group, Adding a new staff member, Adding a page to an existing group, Adding an API route, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+27 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 25 - "projects.ts"
Cohesion: 0.14
Nodes (23): AD_GROUP_MEDIA, AD_MEDIA, AdsCountry, adsHeaders(), adsPost(), AdsProfile, CAMPAIGN_MEDIA, createSbAdGroup() (+15 more)

### Community 26 - "chart.tsx"
Cohesion: 0.19
Nodes (9): ChatPanel(), markdownComponents, sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), NAV_GROUPS (+1 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.21
Nodes (15): Row, BsrAlert, BsrSnapshot, BsrSyncRun, daysBefore(), getAsinBsrHistory(), getTrendsOverview(), requireStaff() (+7 more)

### Community 42 - "projects.ts"
Cohesion: 0.10
Nodes (33): AlertRankCell(), AsinDetail(), buildRows(), CategoryRank, Delta(), Filter, KIND_SEVERITY, rankText() (+25 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.13
Nodes (24): foldKey(), foldListeners, initials(), isActive(), memoryPins, NavGroupSection(), NavLeaf(), parseFolds() (+16 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (57): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES (+49 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (68): ComposeDialog(), ComposeDialogProps, splitAddresses(), CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps (+60 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.16
Nodes (18): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), NewPricePlanSheet(), nextStepPrice() (+10 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.18
Nodes (21): addCalendarMember(), addCalendarMembers(), removeCalendarMember(), updateCalendarMemberRole(), bulkUpdateTrueDims(), daysBefore(), DimsInput, getFbaFeeOverview() (+13 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.06
Nodes (50): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+42 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.14
Nodes (20): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), notesTooltip(), PRIORITY_ICONS, PriorityPill(), Scope (+12 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.11
Nodes (30): ActionResult, BrandLibraryItem, Option, MasterListPage(), matchesRegion(), PullResult, RegionFilter, COUNTRIES (+22 more)

### Community 51 - "server.ts"
Cohesion: 0.12
Nodes (22): BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL, SB_MAG_HEADER (+14 more)

### Community 52 - "permissions.ts"
Cohesion: 0.07
Nodes (23): GoalVsPerformanceLayout(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout(), PpcTopUpLayout(), PriceChangePlansLayout(), SponsoredBrandsUploadLayout() (+15 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.83
Nodes (3): fetchSkuDetail(), fetchSkuPricing(), requireStaff()

### Community 54 - "getStaffDirectory"
Cohesion: 0.11
Nodes (32): STEPS, WizardStep, Preset, AssetsSection(), BrandsSection(), KeywordGarageSection(), CampaignProduct, createBrand() (+24 more)

### Community 57 - "page.tsx"
Cohesion: 0.17
Nodes (6): PageHeader(), ProductsView(), fbaFeeTracker, partners, products, trends

### Community 59 - "page-header.tsx"
Cohesion: 0.07
Nodes (45): SearchableSelect(), AddPriceDialog(), ImportPricesSheet(), PriceCell(), PriceRow(), AddSkillDialog(), LevelBadge(), LevelFilter (+37 more)

### Community 60 - "dashboard-access-grid.tsx"
Cohesion: 0.20
Nodes (13): AccessItem, DashboardAccessGrid(), Layout, layoutKey(), layoutListeners, memoryLayouts, parseLayout(), readLayout() (+5 more)

### Community 61 - "marketplaces.ts"
Cohesion: 0.13
Nodes (33): RegionPicker(), RegionTag(), addRegionsTo(), addSkus(), addSkusGrouped(), ColumnDetectSchema, ColumnMapping, deleteSku() (+25 more)

### Community 62 - "page.tsx"
Cohesion: 0.20
Nodes (19): addProductPrice(), cleanPrice(), deleteProductPrice(), getPriceForSku(), importProductPrices(), listFactories(), listProductPrices(), parsePriceExcel() (+11 more)

### Community 63 - "page.tsx"
Cohesion: 0.12
Nodes (16): MarketplaceOptions(), formatPrice(), PullFromAmazonSheet(), SkuDetailDialog(), PricePlan, formatMoney(), MARKETPLACE_CODES, MARKETPLACE_IDS (+8 more)

### Community 64 - "session.ts"
Cohesion: 0.13
Nodes (23): POST(), BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor(), POST() (+15 more)

### Community 66 - "page.tsx"
Cohesion: 0.47
Nodes (4): InsertionPlan, naturalCompare(), planInsertions(), skuPrefix()

### Community 67 - "layout.tsx"
Cohesion: 0.15
Nodes (17): IncomingCampaign, POST(), DashboardPage(), PortalLayout(), DashboardLink(), Sidebar(), Topbar(), ALL_ITEM_IDS (+9 more)

### Community 68 - "page.tsx"
Cohesion: 0.24
Nodes (18): BrandLibrarySection(), AdsBulkGeneratorPage(), Step, BrandLogo, createBrandLogo(), createStoreUrl(), deleteBrandLogo(), deletePdpPreset() (+10 more)

### Community 69 - "task-form-dialog.tsx"
Cohesion: 0.21
Nodes (21): formatWhen(), TaskUpdates(), addTaskUpdate(), AssigneeRow, createTrackedTask(), deleteTrackedTask(), listTasks(), listTaskUpdates() (+13 more)

### Community 70 - "partners.ts"
Cohesion: 0.21
Nodes (20): cleanShortName(), createPartner(), deletePartner(), friendlyError(), listPartners(), movePartner(), renamePartner(), requirePartnersAccess() (+12 more)

### Community 73 - "session.ts"
Cohesion: 0.11
Nodes (29): POST(), POST(), createSkill(), getStaffSkills(), requireSkillsEditor(), Result, setStaffSkillLevel(), StaffSkillsView (+21 more)

## Knowledge Gaps
- **300 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem` (+295 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `page-header.tsx` to `calendar.ts`, `PPC Top-Up Automation`, `layout.tsx`, `Sponsored Brands Upload - Campaign Data`, `projects.ts`, `utils.ts`, `page-header.tsx`, `mail.ts`, `tabs.tsx`, `Sponsored Brands Bulk XLSX Builder`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `page.tsx`, `chart.tsx`, `dashboard-access-grid.tsx`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Why does `getSession()` connect `task-form-dialog.tsx` to `calendar.ts`, `PPC Top-Up Automation`, `Auth & Staff Management`, `PPC Schedule AI Import`, `Sponsored Brands Bulk XLSX Builder`, `sp-api.ts`, `chart.tsx`, `build.ts`, `page-header.tsx`, `mail.ts`, `skeleton.tsx`, `fba-fee-calculator.ts`, `getStaffDirectory`, `marketplaces.ts`, `page.tsx`, `session.ts`, `layout.tsx`, `page.tsx`, `partners.ts`, `session.ts`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `session.ts`, `PPC Top-Up Automation`, `mail.ts`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `SCOPE_CURRENCY` to the rest of the system?**
  _303 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06300533943554538 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.07091136079900125 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._