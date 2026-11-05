# Graph Report - LaLaGreen-Automation-Portal  (2026-11-05)

## Corpus Check
- 214 files · ~160,258 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1645 nodes · 5174 edges · 76 communities (53 shown, 23 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d69ccd82`
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
- sku-grouping.ts
- layout.tsx
- getMyPermissions
- page.tsx
- page.tsx
- dashboard-access-grid.tsx
- price-change-plans.ts
- page.tsx
- page.tsx
- page.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 160 edges
2. `createServiceClient()` - 133 edges
3. `getSession()` - 107 edges
4. `createClient()` - 88 edges
5. `useT()` - 56 edges
6. `assertItemAccess()` - 47 edges
7. `Button()` - 34 edges
8. `requireStaff()` - 24 edges
9. `getT()` - 24 edges
10. `Skeleton()` - 23 edges

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

## Communities (76 total, 23 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.06
Nodes (119): CalendarSidebar(), DayTasksDialog(), DayView(), DeleteScopeDialog(), layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS (+111 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.07
Nodes (76): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+68 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.16
Nodes (24): accessSummary(), ManageUsersPage(), StaffMember, changeOwnPassword(), createStaffMember(), deleteStaffMember(), listStaff(), renameStaffMember() (+16 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (47): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, date-holidays, @dnd-kit/core (+39 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.07
Nodes (40): distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), newBlock(), ProductBlock(), todayIso() (+32 more)

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
Cohesion: 0.13
Nodes (7): PlaceholderPage(), goalVsPerformance, inventory, orders, shipments, sourcing, supplyChainAutomations

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.13
Nodes (29): fetchSkuPricing(), requireStaff(), marketplace, asNumber(), callSpApi(), callSpApiJson(), chunk(), credentialsFor() (+21 more)

### Community 10 - "utils.ts"
Cohesion: 0.21
Nodes (30): PriorityBadge(), priorityBadgeClass(), StaffProfileView(), TaskSubmit, addFunctionalManager(), addTeamMember(), assignExistingResponsibility(), cleanTask() (+22 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.22
Nodes (12): AddSkillDialog(), LevelBadge(), LevelFilter, LevelPicker(), SummaryTile(), StaffSkillsView, Skill, SKILL_LEVEL_BADGE (+4 more)

### Community 13 - "Root Layout"
Cohesion: 0.17
Nodes (6): OrgChartPage(), PageHeader(), fbaFeeTracker, partners, products, trends

### Community 15 - "ESLint Config"
Cohesion: 0.40
Nodes (4): eslintConfig, I18N_ENFORCED, SHOWN, shownStrings

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.05
Nodes (37): Adding a Layer-1 group, Adding a new staff member, Adding a page to an existing group, Adding an API route, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+29 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.10
Nodes (30): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), money(), num(), pct(), relativeTime() (+22 more)

### Community 25 - "projects.ts"
Cohesion: 0.13
Nodes (28): budgetFor(), POST(), AD_GROUP_MEDIA, AD_MEDIA, AdsCountry, adsHeaders(), adsPost(), AdsProfile (+20 more)

### Community 26 - "page.tsx"
Cohesion: 0.14
Nodes (23): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), MarketplaceOptions(), NewBulkPricePlanSheet(), NewPricePlanSheet() (+15 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.07
Nodes (48): Row, Row, BulkDimsResult, bulkUpdateTrueDims(), daysBefore(), DimsInput, DimsJson, FbaFeeOverview (+40 more)

### Community 42 - "projects.ts"
Cohesion: 0.15
Nodes (26): Block, BlockMode, Option, SCOPE_OPTIONS, NameCalendarDialog(), WEEKDAY_FULL, WEEKDAY_SHORT, MODE_LABEL (+18 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.14
Nodes (23): foldKey(), foldListeners, initials(), isActive(), memoryPins, NavGroupSection(), NavLeaf(), parseFolds() (+15 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (57): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES (+49 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (68): ComposeDialog(), ComposeDialogProps, splitAddresses(), CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps (+60 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.10
Nodes (30): Filter, SortKey, SortTh(), StatTile(), AlertRankCell(), AsinDetail(), buildRows(), CategoryRank (+22 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.10
Nodes (38): DepartmentDialog(), knownLocations(), NodeDialog(), PeopleDialog(), DepartmentColumn(), IconButton(), KIND_CLASSES, Legend() (+30 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.13
Nodes (23): PartnersView(), withField(), cleanShortName(), createPartner(), deletePartner(), friendlyError(), listPartners(), movePartner() (+15 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.12
Nodes (29): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), isBoolean(), isScope(), isSortKey(), notesTooltip() (+21 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.20
Nodes (9): ManageAccessDialog(), ChatPanel(), markdownComponents, sendAiChatMessage(), getStaffDirectory(), ChatMessage, generateAssistantReply(), chatToolDefinitions (+1 more)

### Community 51 - "server.ts"
Cohesion: 0.12
Nodes (22): BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL, SB_MAG_HEADER (+14 more)

### Community 52 - "permissions.ts"
Cohesion: 0.08
Nodes (26): GoalVsPerformanceLayout(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout(), PpcTopUpLayout(), PriceChangePlansLayout(), SponsoredBrandsUploadLayout() (+18 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.12
Nodes (26): ActionResult, BrandLibraryItem, UPLOADABLE_COUNTRIES, UploadResponse, STEPS, WizardStep, Preset, AssetsSection() (+18 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.08
Nodes (64): BrandLibrarySection(), AdsBulkGeneratorPage(), Step, formatWhen(), TaskUpdates(), createBrand(), createKeywordTheme(), createVideoAsset() (+56 more)

### Community 56 - "session.ts"
Cohesion: 0.25
Nodes (12): POST(), POST(), toLocale(), setLocaleCookie(), toRole(), clearSessionCookie(), getSecretKey(), setSessionCookie() (+4 more)

### Community 57 - "page.tsx"
Cohesion: 0.26
Nodes (15): RegionPicker(), RegionTag(), addRegionsTo(), addSkus(), addSkusGrouped(), deleteSku(), fetchAmazonMissingSkus(), readAllSkusOrdered() (+7 more)

### Community 58 - "fba-fee-tracker-constants.ts"
Cohesion: 0.18
Nodes (21): AMOUNT_HINTS, analyzeScheduleImport(), ColumnDetectSchema, ColumnMapping, COUNTRY_ALIASES, COUNTRY_HINTS, detectColumnBlocks(), detectColumnsWithAi() (+13 more)

### Community 59 - "page-header.tsx"
Cohesion: 0.10
Nodes (26): SearchableSelect(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount() (+18 more)

### Community 60 - "nav.ts"
Cohesion: 0.16
Nodes (13): BASE_PATHS, bulkCampaignUpload, calendar, defineNavItem(), listingScore, masterList, NavGroup, NavItemInput (+5 more)

### Community 61 - "marketplaces.ts"
Cohesion: 0.21
Nodes (15): ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedSkuSheet, detectStatusColumnHeuristically(), extractSkusFromSheet(), findColumn() (+7 more)

### Community 62 - "page.tsx"
Cohesion: 0.11
Nodes (41): AddPriceDialog(), formatPercent(), ImportPricesSheet(), PriceCell(), PriceRow(), ProductsView(), addProductPrice(), cleanDetails() (+33 more)

### Community 63 - "build.ts"
Cohesion: 0.28
Nodes (12): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+4 more)

### Community 64 - "dashboard-access-grid.tsx"
Cohesion: 0.14
Nodes (21): AccessItem, DashboardAccessGrid(), Layout, layoutKey(), layoutListeners, memoryLayouts, parseLayout(), readLayout() (+13 more)

### Community 65 - "marketplaces.ts"
Cohesion: 0.18
Nodes (9): PricePlan, MARKETPLACE_CODES, MARKETPLACE_IDS, MarketplaceCode, Region, REGION_HOSTS, REGION_LABELS, SKU_REGION_LABELS (+1 more)

### Community 66 - "sku-grouping.ts"
Cohesion: 0.47
Nodes (4): InsertionPlan, naturalCompare(), planInsertions(), skuPrefix()

### Community 67 - "layout.tsx"
Cohesion: 0.14
Nodes (21): inter, metadata, RootLayout(), LoginPage(), CORE_VALUES, CoreValue, CoreValues(), I18nProvider() (+13 more)

### Community 68 - "getMyPermissions"
Cohesion: 0.16
Nodes (17): IncomingCampaign, POST(), DashboardPage(), PortalLayout(), SidebarContent(), Sidebar(), Topbar(), NAV_GROUPS (+9 more)

### Community 69 - "page.tsx"
Cohesion: 0.16
Nodes (17): POST(), BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, BaseCampaignInput, budgetFor() (+9 more)

### Community 70 - "page.tsx"
Cohesion: 0.33
Nodes (10): createSkill(), getStaffSkills(), requireSkillsEditor(), Result, setStaffSkillLevel(), tr(), Vars, canManageProfiles() (+2 more)

### Community 71 - "dashboard-access-grid.tsx"
Cohesion: 0.11
Nodes (23): LanguageCard(), PasswordField(), SettingsPage(), DirectoryEntry, JobRoleEditor(), TeamPage(), DashboardLink(), LoginForm() (+15 more)

### Community 72 - "price-change-plans.ts"
Cohesion: 0.36
Nodes (9): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PriceType, requirePlanAccess(), requireStaff() (+1 more)

### Community 73 - "page.tsx"
Cohesion: 0.67
Nodes (4): TaskInput, TaskUpdate, RepeatRule, TaskColorKey

## Knowledge Gaps
- **323 isolated node(s):** `StaffMember`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem`, `Step` (+318 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `PPC Schedule AI Import`, `monday.com Dashboards — Comprehensive Reference`, `utils.ts`, `projects.ts`, `build.ts`, `page-header.tsx`, `mail.ts`, `skeleton.tsx`, `fba-fee-tracker.ts`, `fba-fee-calculator.ts`, `permissions.ts`, `getStaffDirectory`, `session.ts`, `page.tsx`, `fba-fee-tracker-constants.ts`, `marketplaces.ts`, `page.tsx`, `getMyPermissions`, `page.tsx`, `page.tsx`, `dashboard-access-grid.tsx`, `price-change-plans.ts`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Why does `cn()` connect `page-header.tsx` to `calendar.ts`, `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `sp-api.ts`, `projects.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `skeleton.tsx`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `fba-fee-calculator.ts`, `page.tsx`, `dashboard-access-grid.tsx`, `getMyPermissions`, `dashboard-access-grid.tsx`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `PPC Top-Up Automation`, `mail.ts`, `build.ts`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **What connects `StaffMember`, `SCOPE_CURRENCY`, `ActionResult` to the rest of the system?**
  _326 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05521265851195152 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.07032967032967033 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._