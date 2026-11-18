# Graph Report - LaLaGreen-Automation-Portal  (2026-11-18)

## Corpus Check
- 245 files · ~193,703 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1906 nodes · 6198 edges · 74 communities (52 shown, 22 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.54)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fb2d0ba9`
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
- getT
- calendar-constants.ts
- listing-sheet.tsx
- pricing-update.ts
- devDependencies
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `cn()` - 194 edges
2. `createServiceClient()` - 156 edges
3. `getSession()` - 126 edges
4. `createClient()` - 93 edges
5. `useT()` - 78 edges
6. `assertItemAccess()` - 49 edges
7. `Button()` - 42 edges
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

## Communities (74 total, 22 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.15
Nodes (44): POST(), AccessResult, addCalendarMember(), addCalendarMembers(), assertAssigneesAllowed(), copyTaskToDates(), createTask(), deleteOccurrences() (+36 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.05
Nodes (98): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+90 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.17
Nodes (24): accessSummary(), ManageUsersPage(), StaffMember, ManageAccessDialog(), SettingsPage(), DirectoryEntry, JobRoleEditor(), TeamPage() (+16 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.08
Nodes (26): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, date-holidays, @dnd-kit/core (+18 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.14
Nodes (24): GET(), ICONS, NotificationsPanel(), announceNotificationsChanged(), parseCount(), parseList(), useNotifications(), usePoll() (+16 more)

### Community 5 - "shadcn/ui Component Registry Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 6 - "PPC Schedule AI Import"
Cohesion: 0.16
Nodes (35): NewTeamDialog(), PersonChip(), PrioritiesDialog(), PriorityBadge(), priorityBadgeClass(), PriorityRow(), ResponsibilityDialog(), StaffProfileView() (+27 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "product-block.tsx"
Cohesion: 0.07
Nodes (22): PageHeader(), PlaceholderPage(), advertisements, BASE_PATHS, bulkCampaignUpload, defineNavItem(), fbaFeeTracker, finance (+14 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.11
Nodes (36): RegionPicker(), RegionTag(), addRegionsTo(), addSkus(), addSkusGrouped(), ColumnDetectSchema, ColumnMapping, deleteSku() (+28 more)

### Community 10 - "utils.ts"
Cohesion: 0.05
Nodes (67): workflowAccess(), GET(), POST(), WorkflowDiagram(), DeleteFileDialog(), TeamEditDialog(), UploadDialog(), EditStepButton() (+59 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.15
Nodes (25): CalendarSidebar(), DeleteScopeDialog(), NameCalendarDialog(), CalendarPage(), isViewMode(), monthAnchor(), VIEW_OPTIONS, ViewMode (+17 more)

### Community 13 - "Root Layout"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, tsx, @types/bcryptjs, @types/mailparser (+5 more)

### Community 15 - "ESLint Config"
Cohesion: 0.40
Nodes (4): eslintConfig, I18N_ENFORCED, SHOWN, shownStrings

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.05
Nodes (39): Adding a Layer-1 group, Adding a new staff member, Adding a page to an existing group, Adding an API route, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+31 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.06
Nodes (48): inter, metadata, LanguageCard(), PasswordField(), DashboardLink(), LoginForm(), changeLine(), dayLabel() (+40 more)

### Community 25 - "projects.ts"
Cohesion: 0.08
Nodes (45): POST(), BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor(), POST() (+37 more)

### Community 26 - "page.tsx"
Cohesion: 0.17
Nodes (18): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), NewPricePlanSheet(), nextStepPrice() (+10 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.06
Nodes (59): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+51 more)

### Community 42 - "projects.ts"
Cohesion: 0.16
Nodes (28): SCOPE_OPTIONS, WEEKDAY_FULL, WEEKDAY_SHORT, ComposeDialog(), MODE_LABEL, SendResult, splitAddresses(), PingButton() (+20 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.10
Nodes (33): foldKey(), foldListeners, initials(), isActive(), memoryPins, NavGroupSection(), NavLeaf(), parseFolds() (+25 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (58): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES (+50 more)

### Community 45 - "mail.ts"
Cohesion: 0.05
Nodes (80): ComposeDialogProps, CompanyInboxPage(), FOLDER_OPTIONS, formatDate(), MAIL_ACTIONS, Notice, viewKey(), ThreadView() (+72 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.11
Nodes (31): AlertRankCell(), AsinDetail(), buildRows(), CategoryRank, Delta(), Filter, KIND_SEVERITY, rankText() (+23 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.17
Nodes (18): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+10 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.12
Nodes (27): PartnerGrid(), PartnersView(), pricesHref(), Row, withField(), cleanShortName(), createPartner(), deletePartner() (+19 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.17
Nodes (19): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), isBoolean(), isScope(), isSortKey(), notesTooltip() (+11 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.19
Nodes (9): ChatPanel(), markdownComponents, sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), NAV_GROUPS (+1 more)

### Community 51 - "server.ts"
Cohesion: 0.13
Nodes (23): IncomingCampaign, BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL (+15 more)

### Community 52 - "permissions.ts"
Cohesion: 0.07
Nodes (31): GoalVsPerformanceLayout(), ProfitAnalyticsLayout(), PortalLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout(), PpcTopUpLayout(), PriceChangePlansLayout() (+23 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.08
Nodes (43): ActionResult, BrandLibraryItem, distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), Block (+35 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

### Community 56 - "session.ts"
Cohesion: 0.23
Nodes (13): POST(), POST(), toLocale(), setLocaleCookie(), toRole(), clearSessionCookie(), getSecretKey(), SessionPayload (+5 more)

### Community 57 - "page.tsx"
Cohesion: 0.13
Nodes (29): marketplace, asNumber(), callSpApi(), callSpApiJson(), chunk(), credentialsFor(), extractFeaturedPricing(), extractOfferPrice() (+21 more)

### Community 58 - "fba-fee-tracker-constants.ts"
Cohesion: 0.17
Nodes (22): DayTasksDialog(), DayView(), layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS, TaskCard(), TaskFormDialog() (+14 more)

### Community 59 - "page-header.tsx"
Cohesion: 0.08
Nodes (35): PersonRow(), AddSkillDialog(), LevelBadge(), LevelFilter, LevelPicker(), SummaryTile(), AlertDialogMedia(), AlertDialogOverlay() (+27 more)

### Community 60 - "nav.ts"
Cohesion: 0.09
Nodes (39): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+31 more)

### Community 61 - "marketplaces.ts"
Cohesion: 0.29
Nodes (11): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PricePlan, PriceType, requirePlanAccess() (+3 more)

### Community 62 - "page.tsx"
Cohesion: 0.10
Nodes (42): AddPriceDialog(), formatPercent(), ImportPricesSheet(), PriceCell(), PriceRow(), ProductsView(), addProductPrice(), cleanDetails() (+34 more)

### Community 63 - "build.ts"
Cohesion: 0.06
Nodes (85): BrandLibrarySection(), AdsBulkGeneratorPage(), Step, createBrand(), createKeywordTheme(), createVideoAsset(), deleteBrand(), deleteKeywordTheme() (+77 more)

### Community 64 - "dashboard-access-grid.tsx"
Cohesion: 0.15
Nodes (20): AccessItem, DashboardAccessGrid(), Layout, layoutKey(), layoutListeners, memoryLayouts, parseLayout(), readLayout() (+12 more)

### Community 65 - "marketplaces.ts"
Cohesion: 0.22
Nodes (23): formatDate(), SearchResults(), Section(), toResult(), rangeFor(), MONTH_WEEK_OPTIONS, addDays(), addMonths() (+15 more)

### Community 66 - "alert-change.tsx"
Cohesion: 0.83
Nodes (3): fetchSkuDetail(), fetchSkuPricing(), requireStaff()

### Community 67 - "layout.tsx"
Cohesion: 0.11
Nodes (26): RootLayout(), LoginPage(), DashboardPage(), OrgChartPage(), CORE_VALUES, CoreValue, CoreValues(), UpcomingEvent (+18 more)

### Community 74 - "getT"
Cohesion: 0.13
Nodes (20): ProductBlock(), todayIso(), toLines(), Option, SearchableSelect(), TaskFormDialog(), TaskFormDialogProps, TaskFormInner() (+12 more)

### Community 75 - "calendar-constants.ts"
Cohesion: 0.11
Nodes (21): Result, WEEKDAY_INITIALS, YearView(), AccessibleCalendar, CalendarMember, CalendarTask, TaskInput, TaskUpdate (+13 more)

### Community 78 - "listing-sheet.tsx"
Cohesion: 0.05
Nodes (83): BANDS, Filter, imagesMissing(), ListingScoreView(), OPPORTUNITIES, Row, ViewMode, AlertActions() (+75 more)

### Community 79 - "pricing-update.ts"
Cohesion: 0.13
Nodes (14): MarketplaceOptions(), formatPrice(), PullFromAmazonSheet(), SkuDetailDialog(), formatMoney(), MARKETPLACE_CODES, MARKETPLACE_IDS, marketplacesByRegion() (+6 more)

### Community 81 - "devDependencies"
Cohesion: 0.43
Nodes (6): listeners, memory, readRaw(), subscribe(), usePersistedState(), writeRaw()

## Knowledge Gaps
- **363 isolated node(s):** `StaffMember`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem`, `Step` (+358 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `page-header.tsx` to `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `utils.ts`, `sp-api.ts`, `build.ts`, `projects.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `fba-fee-calculator.ts`, `fba-fee-tracker-constants.ts`, `nav.ts`, `page.tsx`, `dashboard-access-grid.tsx`, `marketplaces.ts`, `getT`, `listing-sheet.tsx`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Why does `getSession()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `monday.com Dashboards — Comprehensive Reference`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `sp-api.ts`, `projects.ts`, `build.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `skeleton.tsx`, `fba-fee-tracker.ts`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `session.ts`, `fba-fee-tracker-constants.ts`, `marketplaces.ts`, `page.tsx`, `build.ts`, `alert-change.tsx`, `layout.tsx`, `listing-sheet.tsx`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `createServiceClient()` connect `build.ts` to `calendar.ts`, `PPC Top-Up Automation`, `layout.tsx`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `build.ts`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `page-header.tsx`, `monday.com Dashboards — Comprehensive Reference`, `listing-sheet.tsx`, `buildVideoBulk.ts`, `fba-fee-tracker.ts`, `fba-fee-tracker-constants.ts`, `marketplaces.ts`, `page.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `StaffMember`, `SCOPE_CURRENCY`, `ActionResult` to the rest of the system?**
  _366 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14747474747474748 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.05202135774218154 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._