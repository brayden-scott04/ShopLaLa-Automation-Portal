# Graph Report - LaLaGreen-Automation-Portal  (2026-11-05)

## Corpus Check
- 207 files · ~152,700 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1582 nodes · 4903 edges · 71 communities (50 shown, 21 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `28971ce8`
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
- use-persisted-state.ts
- layout.tsx
- page.tsx
- nav.ts
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

## Communities (71 total, 21 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.06
Nodes (110): CalendarSidebar(), DayTasksDialog(), DayView(), DeleteScopeDialog(), ManageAccessDialog(), layoutWeekRibbons(), MonthGrid(), RibbonCell (+102 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.07
Nodes (76): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+68 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.13
Nodes (30): accessSummary(), ManageUsersPage(), StaffMember, SettingsPage(), DirectoryEntry, JobRoleEditor(), TeamPage(), changeOwnPassword() (+22 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.13
Nodes (27): ActionResult, BrandLibraryItem, UPLOADABLE_COUNTRIES, UploadResponse, COUNTRIES, DeleteConfirm(), AlertDialog(), AlertDialogAction() (+19 more)

### Community 5 - "shadcn/ui Component Registry Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 6 - "PPC Schedule AI Import"
Cohesion: 0.06
Nodes (49): AMOUNT_HINTS, analyzeScheduleImport(), ColumnDetectSchema, ColumnMapping, COUNTRY_ALIASES, COUNTRY_HINTS, detectColumnBlocks(), detectColumnsWithAi() (+41 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "product-block.tsx"
Cohesion: 0.06
Nodes (27): PageHeader(), PlaceholderPage(), ProductsView(), advertisements, BASE_PATHS, calendar, defineNavItem(), fbaFeeTracker (+19 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.11
Nodes (33): marketplace, MARKETPLACE_CODES, MARKETPLACE_IDS, Region, REGION_HOSTS, REGION_LABELS, asNumber(), callSpApi() (+25 more)

### Community 10 - "utils.ts"
Cohesion: 0.17
Nodes (17): PartnerGrid(), PartnersView(), pricesHref(), Row, withField(), Partner, setPartnerField(), FACTORY_FIELDS (+9 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.16
Nodes (34): StaffDrilldown(), Tab, PriorityBadge(), priorityBadgeClass(), StaffProfileView(), TaskSubmit, addFunctionalManager(), addTeamMember() (+26 more)

### Community 13 - "Root Layout"
Cohesion: 0.40
Nodes (6): Card(), CardContent(), CardDescription(), CardHeader(), CardTitle(), Skeleton()

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
Cohesion: 0.10
Nodes (37): IncomingCampaign, POST(), POST(), IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor() (+29 more)

### Community 26 - "chart.tsx"
Cohesion: 0.20
Nodes (9): ChatPanel(), markdownComponents, Textarea(), sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool() (+1 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.11
Nodes (31): AlertRankCell(), AsinDetail(), buildRows(), CategoryRank, Delta(), Filter, KIND_SEVERITY, rankText() (+23 more)

### Community 42 - "projects.ts"
Cohesion: 0.21
Nodes (15): SCOPE_OPTIONS, ComposeDialog(), MODE_LABEL, SendResult, splitAddresses(), Dialog(), DialogBody(), DialogClose() (+7 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.18
Nodes (19): foldKey(), foldListeners, initials(), isActive(), memoryPins, NavGroupSection(), parseFolds(), parsePins() (+11 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (57): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES (+49 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (66): ComposeDialogProps, CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps, RFC-5322, buildRawMessage() (+58 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.14
Nodes (22): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), NewPricePlanSheet(), nextStepPrice() (+14 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.19
Nodes (18): BulkDimsResult, bulkUpdateTrueDims(), daysBefore(), DimsInput, DimsJson, FbaFeeOverview, getFbaFeeOverview(), getSkuFeeHistory() (+10 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.16
Nodes (21): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+13 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.17
Nodes (19): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), isBoolean(), isScope(), isSortKey(), notesTooltip() (+11 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.24
Nodes (12): TaskFormDialog(), TaskFormDialogProps, TaskFormInner(), todayLocal(), formatWhen(), TaskUpdates(), Task, TaskProgressUpdate (+4 more)

### Community 51 - "server.ts"
Cohesion: 0.12
Nodes (22): BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL, SB_MAG_HEADER (+14 more)

### Community 52 - "permissions.ts"
Cohesion: 0.08
Nodes (26): GoalVsPerformanceLayout(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout(), PpcTopUpLayout(), PriceChangePlansLayout(), SponsoredBrandsUploadLayout() (+18 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.10
Nodes (24): MarketplaceOptions(), formatPrice(), MasterListPage(), matchesRegion(), PullFromAmazonSheet(), PullResult, RegionFilter, RegionPicker() (+16 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.06
Nodes (77): BrandRow, BrandLibrarySection(), distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), AdsBulkGeneratorPage() (+69 more)

### Community 56 - "session.ts"
Cohesion: 0.16
Nodes (17): POST(), POST(), PortalLayout(), SidebarContent(), Sidebar(), toLocale(), setLocaleCookie(), Role (+9 more)

### Community 57 - "page.tsx"
Cohesion: 0.13
Nodes (15): PasswordField(), DashboardLink(), LoginForm(), PinToggle(), NewTeamDialog(), PersonChip(), PrioritiesDialog(), PriorityRow() (+7 more)

### Community 58 - "fba-fee-tracker-constants.ts"
Cohesion: 0.29
Nodes (7): FeeAlert, ALERT_CAUSES, ALERT_KIND_LABELS, ALERT_KINDS, ALERT_STATUS_LABELS, AlertCause, AlertKind

### Community 59 - "page-header.tsx"
Cohesion: 0.09
Nodes (27): Option, SearchableSelect(), NavLeaf(), Pin(), SummaryTile(), AlertDialogMedia(), AlertDialogOverlay(), Avatar() (+19 more)

### Community 60 - "getMyPermissions"
Cohesion: 0.22
Nodes (17): addTaskUpdate(), AssigneeRow, createTrackedTask(), deleteTrackedTask(), listTasks(), listTaskUpdates(), loadVisible(), setAssignees() (+9 more)

### Community 61 - "marketplaces.ts"
Cohesion: 0.14
Nodes (30): addRegionsTo(), addSkus(), addSkusGrouped(), ColumnDetectSchema, ColumnMapping, deleteSku(), detectColumnHeuristically(), detectColumnWithAi() (+22 more)

### Community 62 - "page.tsx"
Cohesion: 0.11
Nodes (40): AddPriceDialog(), formatPercent(), ImportPricesSheet(), PriceCell(), PriceRow(), addProductPrice(), cleanDetails(), cleanPrice() (+32 more)

### Community 63 - "page.tsx"
Cohesion: 0.40
Nodes (9): cleanShortName(), createPartner(), deletePartner(), friendlyError(), listPartners(), movePartner(), renamePartner(), requirePartnersAccess() (+1 more)

### Community 64 - "use-persisted-state.ts"
Cohesion: 0.43
Nodes (6): listeners, memory, readRaw(), subscribe(), usePersistedState(), writeRaw()

### Community 67 - "layout.tsx"
Cohesion: 0.09
Nodes (32): inter, metadata, RootLayout(), LoginPage(), DashboardPage(), LanguageCard(), CORE_VALUES, CoreValue (+24 more)

### Community 68 - "page.tsx"
Cohesion: 0.14
Nodes (20): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+12 more)

### Community 69 - "nav.ts"
Cohesion: 0.42
Nodes (8): localizeNavGroup(), localizeNavItem(), NAV_TEXT_KEYS, NavText(), useLocalizedNav(), useSubgroupLabel(), Translator, NavSubgroup

### Community 71 - "dashboard-access-grid.tsx"
Cohesion: 0.20
Nodes (13): AccessItem, DashboardAccessGrid(), Layout, layoutKey(), layoutListeners, memoryLayouts, parseLayout(), readLayout() (+5 more)

### Community 72 - "price-change-plans.ts"
Cohesion: 0.36
Nodes (9): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PriceType, requirePlanAccess(), requireStaff() (+1 more)

### Community 73 - "session.ts"
Cohesion: 0.23
Nodes (17): LevelFilter, skillText(), StaffSkillsView(), createSkill(), requireSkillsEditor(), Result, setStaffSkillLevel(), StaffSkillsView (+9 more)

## Knowledge Gaps
- **315 isolated node(s):** `StaffMember`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem`, `Step` (+310 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `PPC Schedule AI Import`, `Sponsored Brands Bulk XLSX Builder`, `projects.ts`, `chart.tsx`, `build.ts`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `skeleton.tsx`, `permissions.ts`, `getStaffDirectory`, `session.ts`, `getMyPermissions`, `marketplaces.ts`, `page.tsx`, `page.tsx`, `layout.tsx`, `price-change-plans.ts`, `session.ts`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Why does `cn()` connect `page-header.tsx` to `calendar.ts`, `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `product-block.tsx`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `Root Layout`, `chart.tsx`, `build.ts`, `projects.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `fba-fee-calculator.ts`, `getStaffDirectory`, `session.ts`, `page.tsx`, `page.tsx`, `page.tsx`, `dashboard-access-grid.tsx`, `session.ts`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `PPC Top-Up Automation`, `mail.ts`, `PPC Schedule AI Import`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `StaffMember`, `SCOPE_CURRENCY`, `ActionResult` to the rest of the system?**
  _318 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06157536985205918 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.07032967032967033 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.12605042016806722 - nodes in this community are weakly interconnected._