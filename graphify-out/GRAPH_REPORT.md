# Graph Report - LaLaGreen-Automation-Portal  (2026-11-12)

## Corpus Check
- 234 files · ~180,726 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1815 nodes · 5772 edges · 86 communities (64 shown, 22 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2f131c88`
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
- alert-change.tsx
- layout.tsx
- config.ts
- page.tsx
- page.tsx
- fba-fee-tracker-constants.ts
- price-change-plans.ts
- sku-grouping.ts
- getT
- calendar-constants.ts
- page.tsx
- task-form-dialog.tsx
- listing-sheet.tsx
- pricing-update.ts
- month-grid.tsx
- devDependencies
- requireStaff
- package.json
- marketplaces.ts
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `cn()` - 181 edges
2. `createServiceClient()` - 144 edges
3. `getSession()` - 115 edges
4. `createClient()` - 91 edges
5. `useT()` - 67 edges
6. `assertItemAccess()` - 49 edges
7. `Button()` - 39 edges
8. `getMyPermissions()` - 29 edges
9. `getT()` - 28 edges
10. `Skeleton()` - 27 edges

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

## Communities (86 total, 22 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.14
Nodes (47): AccessResult, addCalendarMember(), addCalendarMembers(), assertAssigneesAllowed(), copyTaskToDates(), createTask(), deleteCalendar(), deleteOccurrences() (+39 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.05
Nodes (100): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+92 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.15
Nodes (24): accessSummary(), ManageUsersPage(), StaffMember, DirectoryEntry, JobRoleEditor(), TeamPage(), createStaffMember(), deleteStaffMember() (+16 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.08
Nodes (26): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, date-holidays, @dnd-kit/core (+18 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.23
Nodes (14): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+6 more)

### Community 5 - "shadcn/ui Component Registry Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 6 - "PPC Schedule AI Import"
Cohesion: 0.19
Nodes (17): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+9 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "product-block.tsx"
Cohesion: 0.06
Nodes (29): ChatPanel(), PageHeader(), PlaceholderPage(), adsBulkGenerator, advertisements, BASE_PATHS, calendar, defineNavItem() (+21 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.25
Nodes (13): ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), detectStatusColumnHeuristically(), extractSkusFromSheet(), findColumn(), INACTIVE_KEYWORDS (+5 more)

### Community 10 - "utils.ts"
Cohesion: 0.09
Nodes (43): WorkflowDiagram(), FileList(), fill(), Segmented(), SopDialog(), StepPanel(), UploadTarget, WorkflowView() (+35 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.20
Nodes (20): LevelFilter, skillText(), StaffSkillsView(), SummaryTile(), createSkill(), getStaffSkills(), requireSkillsEditor(), Result (+12 more)

### Community 13 - "Root Layout"
Cohesion: 0.12
Nodes (33): DepartmentDialog(), DepartmentColumn(), IconButton(), KIND_CLASSES, Legend(), NodeBox(), NodeDialogState, OrgChartView() (+25 more)

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
Cohesion: 0.08
Nodes (45): POST(), BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor(), POST() (+37 more)

### Community 26 - "page.tsx"
Cohesion: 0.13
Nodes (26): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), NewPricePlanSheet(), nextStepPrice() (+18 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.14
Nodes (24): Row, BulkDimsResult, bulkUpdateTrueDims(), daysBefore(), DimsInput, DimsJson, FbaFeeOverview, FeeAlert (+16 more)

### Community 42 - "projects.ts"
Cohesion: 0.14
Nodes (29): SCOPE_OPTIONS, ComposeDialog(), MODE_LABEL, SendResult, splitAddresses(), fromForm(), LANG_KEYS, Save (+21 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.11
Nodes (33): foldKey(), foldListeners, initials(), isActive(), memoryPins, NavGroupSection(), NavLeaf(), parseFolds() (+25 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.10
Nodes (33): FeeBreakdownBody(), addInto(), emptyTotals(), FeeBreakdown, FeeBreakdownFamily, FeeBreakdownType, FeeRow, getFeeBreakdown() (+25 more)

### Community 45 - "mail.ts"
Cohesion: 0.05
Nodes (80): ComposeDialogProps, CompanyInboxPage(), FOLDER_OPTIONS, formatDate(), MAIL_ACTIONS, Notice, viewKey(), ThreadView() (+72 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.13
Nodes (23): Row, AsinBsrHistory, BsrAlert, BsrSnapshot, BsrSyncRun, daysBefore(), getAsinBsrHistory(), getTrendsOverview() (+15 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.17
Nodes (18): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+10 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.13
Nodes (26): PartnerGrid(), PartnersView(), pricesHref(), Row, withField(), cleanShortName(), createPartner(), deletePartner() (+18 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.07
Nodes (50): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), isBoolean(), isScope(), isSortKey(), notesTooltip() (+42 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.36
Nodes (7): ManageAccessDialog(), sendAiChatMessage(), getStaffDirectory(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool()

### Community 51 - "server.ts"
Cohesion: 0.13
Nodes (24): IncomingCampaign, POST(), BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow() (+16 more)

### Community 52 - "permissions.ts"
Cohesion: 0.08
Nodes (27): GoalVsPerformanceLayout(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout(), PpcTopUpLayout(), PriceChangePlansLayout(), SponsoredBrandsUploadLayout() (+19 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.15
Nodes (19): UPLOADABLE_COUNTRIES, UploadResponse, Asset, Block, Brand, newBlock(), Preset, ProductBlock() (+11 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.20
Nodes (25): createBrand(), createKeywordTheme(), createVideoAsset(), deleteBrand(), deleteKeywordTheme(), deleteKeywordThemes(), deletePreset(), deleteProduct() (+17 more)

### Community 56 - "session.ts"
Cohesion: 0.09
Nodes (32): POST(), POST(), inter, metadata, RootLayout(), LoginPage(), DashboardPage(), OrgChartPage() (+24 more)

### Community 57 - "page.tsx"
Cohesion: 0.13
Nodes (29): marketplace, asNumber(), callSpApi(), callSpApiJson(), chunk(), credentialsFor(), extractFeaturedPricing(), extractOfferPrice() (+21 more)

### Community 58 - "fba-fee-tracker-constants.ts"
Cohesion: 0.12
Nodes (24): ActionResult, BrandLibraryItem, STEPS, WizardStep, AssetsSection(), BrandsSection(), COUNTRIES, DeleteConfirm() (+16 more)

### Community 59 - "page-header.tsx"
Cohesion: 0.10
Nodes (28): CalendarSidebar(), TextPair(), LengthBar(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback() (+20 more)

### Community 60 - "nav.ts"
Cohesion: 0.09
Nodes (24): PortalLayout(), PasswordField(), SettingsPage(), DashboardLink(), LoginForm(), DeleteFileDialog(), SaveFooter(), TeamEditDialog() (+16 more)

### Community 61 - "marketplaces.ts"
Cohesion: 0.11
Nodes (21): MarketplaceOptions(), formatPrice(), MasterListPage(), matchesRegion(), PullFromAmazonSheet(), PullResult, RegionFilter, RegionPicker() (+13 more)

### Community 62 - "page.tsx"
Cohesion: 0.11
Nodes (42): SkuDetailDialog(), AddPriceDialog(), formatPercent(), ImportPricesSheet(), PriceCell(), PriceRow(), ProductsView(), addProductPrice() (+34 more)

### Community 63 - "build.ts"
Cohesion: 0.16
Nodes (33): StaffDrilldown(), Tab, PriorityBadge(), priorityBadgeClass(), StaffProfileView(), TaskSubmit, addFunctionalManager(), addTeamMember() (+25 more)

### Community 64 - "dashboard-access-grid.tsx"
Cohesion: 0.21
Nodes (12): AccessItem, DashboardAccessGrid(), Layout, layoutKey(), layoutListeners, memoryLayouts, parseLayout(), readLayout() (+4 more)

### Community 65 - "marketplaces.ts"
Cohesion: 0.15
Nodes (35): DeleteScopeDialog(), NameCalendarDialog(), formatDate(), SearchResults(), Section(), toResult(), UpcomingPanel(), WeekView() (+27 more)

### Community 66 - "alert-change.tsx"
Cohesion: 0.10
Nodes (27): AlertActions(), AlertChange(), AlertHeading(), asImages(), asStrings(), BulletDiff(), imageId(), ImageRow() (+19 more)

### Community 67 - "layout.tsx"
Cohesion: 0.16
Nodes (14): LanguageCard(), I18nContext, I18nProvider(), useI18n(), useLocale(), en, zh, createTranslator() (+6 more)

### Community 68 - "config.ts"
Cohesion: 0.15
Nodes (14): Option, SearchableSelect(), markdownComponents, TaskFormInner(), todayLocal(), formatWhen(), TaskUpdates(), CardDescription() (+6 more)

### Community 69 - "page.tsx"
Cohesion: 0.13
Nodes (21): money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES, sgtDate() (+13 more)

### Community 70 - "page.tsx"
Cohesion: 0.12
Nodes (21): AlertRankCell(), AsinDetail(), buildRows(), CategoryRank, Delta(), Filter, KIND_SEVERITY, rankText() (+13 more)

### Community 71 - "fba-fee-tracker-constants.ts"
Cohesion: 0.16
Nodes (22): BANDS, Filter, ListingScoreView(), OPPORTUNITIES, Row, SortKey, relativeTime(), getListingDetail() (+14 more)

### Community 72 - "price-change-plans.ts"
Cohesion: 0.46
Nodes (5): workflowAccess(), GET(), POST(), isValidScope(), isAllowed()

### Community 73 - "sku-grouping.ts"
Cohesion: 0.47
Nodes (4): InsertionPlan, naturalCompare(), planInsertions(), skuPrefix()

### Community 74 - "getT"
Cohesion: 0.17
Nodes (18): distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), Block, BlockMode, newBlock() (+10 more)

### Community 75 - "calendar-constants.ts"
Cohesion: 0.12
Nodes (19): Result, AccessibleCalendar, CalendarMember, CalendarSummary, CalendarTask, TaskInput, TaskUpdate, CalendarMemberRole (+11 more)

### Community 76 - "page.tsx"
Cohesion: 0.29
Nodes (15): BrandLibrarySection(), AdsBulkGeneratorPage(), Step, createBrandLogo(), createStoreUrl(), deleteBrandLogo(), deletePdpPreset(), deleteStoreUrl() (+7 more)

### Community 77 - "task-form-dialog.tsx"
Cohesion: 0.26
Nodes (14): TaskFormDialog(), WEEKDAY_FULL, WEEKDAY_SHORT, MONTH_WEEK_OPTIONS, diffDays(), formatDayLabel(), clampedDate(), describeRecurrence() (+6 more)

### Community 78 - "listing-sheet.tsx"
Cohesion: 0.26
Nodes (11): ListingCard(), ListingSheet(), AmazonImg(), BAND_BG, BAND_TEXT, CheckChip(), Meter(), ScoreRing() (+3 more)

### Community 79 - "pricing-update.ts"
Cohesion: 0.83
Nodes (3): fetchSkuDetail(), fetchSkuPricing(), requireStaff()

### Community 80 - "month-grid.tsx"
Cohesion: 0.30
Nodes (11): DayTasksDialog(), DayView(), layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS, TaskCard(), isUninvolved() (+3 more)

### Community 81 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, tsx, @types/bcryptjs, @types/mailparser (+5 more)

### Community 82 - "requireStaff"
Cohesion: 0.39
Nodes (12): addRegionsTo(), addSkus(), addSkusGrouped(), deleteSku(), fetchAmazonMissingSkus(), readAllSkusOrdered(), reorderSkus(), replaceSkus() (+4 more)

### Community 83 - "package.json"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

### Community 84 - "marketplaces.ts"
Cohesion: 0.29
Nodes (5): MARKETPLACE_CODES, MARKETPLACE_IDS, Region, REGION_HOSTS, REGION_LABELS

## Knowledge Gaps
- **353 isolated node(s):** `StaffMember`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem`, `Step` (+348 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `page-header.tsx` to `PPC Schedule AI Import`, `product-block.tsx`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `Root Layout`, `projects.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `fba-fee-tracker-constants.ts`, `nav.ts`, `page.tsx`, `build.ts`, `dashboard-access-grid.tsx`, `marketplaces.ts`, `alert-change.tsx`, `config.ts`, `page.tsx`, `page.tsx`, `fba-fee-tracker-constants.ts`, `getT`, `task-form-dialog.tsx`, `listing-sheet.tsx`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Why does `getSession()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `monday.com Dashboards — Comprehensive Reference`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `Root Layout`, `projects.ts`, `page.tsx`, `build.ts`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `skeleton.tsx`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `getStaffDirectory`, `session.ts`, `nav.ts`, `page.tsx`, `build.ts`, `marketplaces.ts`, `fba-fee-tracker-constants.ts`, `price-change-plans.ts`, `page.tsx`, `pricing-update.ts`, `requireStaff`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `createClient()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `monday.com Dashboards — Comprehensive Reference`, `Sponsored Brands Bulk XLSX Builder`, `Root Layout`, `projects.ts`, `page.tsx`, `build.ts`, `page-header.tsx`, `buildVideoBulk.ts`, `fba-fee-tracker.ts`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `getStaffDirectory`, `session.ts`, `nav.ts`, `marketplaces.ts`, `page.tsx`, `build.ts`, `fba-fee-tracker-constants.ts`, `page.tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **What connects `StaffMember`, `SCOPE_CURRENCY`, `ActionResult` to the rest of the system?**
  _356 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14095744680851063 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.051871500147362214 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._