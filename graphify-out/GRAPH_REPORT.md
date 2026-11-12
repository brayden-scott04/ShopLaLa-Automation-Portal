# Graph Report - LaLaGreen-Automation-Portal  (2026-11-12)

## Corpus Check
- 233 files · ~180,515 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1813 nodes · 5769 edges · 68 communities (46 shown, 22 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7ffa777d`
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
- layout.tsx
- fba-fee-tracker-constants.ts
- price-change-plans.ts

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
10. `Skeleton()` - 26 edges

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

## Communities (68 total, 22 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.05
Nodes (128): CalendarSidebar(), DayTasksDialog(), DayView(), DeleteScopeDialog(), layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS (+120 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.05
Nodes (97): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+89 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.13
Nodes (27): accessSummary(), ManageUsersPage(), StaffMember, SettingsPage(), DirectoryEntry, JobRoleEditor(), TeamPage(), changeOwnPassword() (+19 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (47): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, date-holidays, @dnd-kit/core (+39 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.07
Nodes (62): BANDS, Filter, ListingScoreView(), OPPORTUNITIES, Row, SortKey, AlertActions(), AlertChange() (+54 more)

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
Cohesion: 0.08
Nodes (22): PlaceholderPage(), adsBulkGenerator, advertisements, BASE_PATHS, bulkCampaignUpload, calendar, defineNavItem(), finance (+14 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.05
Nodes (69): RegionPicker(), RegionTag(), fetchSkuPricing(), requireStaff(), addRegionsTo(), addSkus(), addSkusGrouped(), ColumnDetectSchema (+61 more)

### Community 10 - "utils.ts"
Cohesion: 0.08
Nodes (48): WorkflowDiagram(), DeleteFileDialog(), StepEditDialog(), TeamEditDialog(), toForm(), UploadDialog(), EditStepButton(), FileList() (+40 more)

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
Cohesion: 0.07
Nodes (43): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), MarketplaceOptions(), NewBulkPricePlanSheet(), NewPricePlanSheet() (+35 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.19
Nodes (18): BulkDimsResult, bulkUpdateTrueDims(), daysBefore(), DimsInput, DimsJson, FbaFeeOverview, getFbaFeeOverview(), getSkuFeeHistory() (+10 more)

### Community 42 - "projects.ts"
Cohesion: 0.14
Nodes (30): SCOPE_OPTIONS, WEEKDAY_FULL, WEEKDAY_SHORT, ComposeDialog(), MODE_LABEL, SendResult, splitAddresses(), ChatPanel() (+22 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.14
Nodes (25): foldKey(), foldListeners, initials(), isActive(), memoryPins, NavGroupSection(), NavLeaf(), parseFolds() (+17 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.06
Nodes (54): money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPES, sgtDate(), addInto() (+46 more)

### Community 45 - "mail.ts"
Cohesion: 0.05
Nodes (80): ComposeDialogProps, CompanyInboxPage(), FOLDER_OPTIONS, formatDate(), MAIL_ACTIONS, Notice, viewKey(), ThreadView() (+72 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.11
Nodes (31): AlertRankCell(), AsinDetail(), buildRows(), CategoryRank, Delta(), Filter, KIND_SEVERITY, rankText() (+23 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.14
Nodes (26): PartnerGrid(), PartnersView(), pricesHref(), Row, withField(), cleanShortName(), createPartner(), deletePartner() (+18 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.13
Nodes (23): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), isBoolean(), isScope(), isSortKey(), notesTooltip() (+15 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.27
Nodes (8): ManageAccessDialog(), sendAiChatMessage(), getStaffDirectory(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), SUBGROUP_LABELS

### Community 51 - "server.ts"
Cohesion: 0.13
Nodes (24): IncomingCampaign, POST(), BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow() (+16 more)

### Community 52 - "permissions.ts"
Cohesion: 0.06
Nodes (33): GoalVsPerformanceLayout(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout(), PpcTopUpLayout(), PriceChangePlansLayout(), SponsoredBrandsUploadLayout() (+25 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.07
Nodes (48): distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), newBlock(), ProductBlock(), todayIso() (+40 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.07
Nodes (72): BrandLibrarySection(), AdsBulkGeneratorPage(), Step, formatWhen(), TaskUpdates(), createBrand(), createKeywordTheme(), createVideoAsset() (+64 more)

### Community 56 - "session.ts"
Cohesion: 0.22
Nodes (14): POST(), POST(), toLocale(), setLocaleCookie(), Role, toRole(), clearSessionCookie(), getSecretKey() (+6 more)

### Community 57 - "page.tsx"
Cohesion: 0.12
Nodes (7): PageHeader(), fbaFeeTracker, listingScore, newProductLaunchWorkflow, partners, products, trends

### Community 58 - "fba-fee-tracker-constants.ts"
Cohesion: 0.09
Nodes (36): FeeBreakdownBody(), SCOPE_CURRENCY, StatTile(), ActionResult, BrandLibraryItem, Block, BlockMode, STEPS (+28 more)

### Community 59 - "page-header.tsx"
Cohesion: 0.09
Nodes (30): Option, SearchableSelect(), PersonRow(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback() (+22 more)

### Community 60 - "nav.ts"
Cohesion: 0.10
Nodes (21): LanguageCard(), PasswordField(), DashboardLink(), SaveFooter(), knownLocations(), NodeDialog(), PeopleDialog(), StaffDrilldown() (+13 more)

### Community 62 - "page.tsx"
Cohesion: 0.11
Nodes (41): AddPriceDialog(), formatPercent(), ImportPricesSheet(), PriceCell(), PriceRow(), ProductsView(), addProductPrice(), cleanDetails() (+33 more)

### Community 63 - "build.ts"
Cohesion: 0.21
Nodes (30): PriorityBadge(), priorityBadgeClass(), StaffProfileView(), TaskSubmit, addFunctionalManager(), addTeamMember(), assignExistingResponsibility(), cleanTask() (+22 more)

### Community 64 - "dashboard-access-grid.tsx"
Cohesion: 0.15
Nodes (20): AccessItem, DashboardAccessGrid(), Layout, layoutKey(), layoutListeners, memoryLayouts, parseLayout(), readLayout() (+12 more)

### Community 67 - "layout.tsx"
Cohesion: 0.12
Nodes (24): inter, metadata, RootLayout(), LoginPage(), OrgChartPage(), CORE_VALUES, CoreValue, CoreValues() (+16 more)

### Community 71 - "fba-fee-tracker-constants.ts"
Cohesion: 0.29
Nodes (7): FeeAlert, ALERT_CAUSES, ALERT_KIND_LABELS, ALERT_KINDS, ALERT_STATUS_LABELS, AlertCause, AlertKind

### Community 72 - "price-change-plans.ts"
Cohesion: 0.21
Nodes (11): workflowAccess(), GET(), POST(), DashboardPage(), PortalLayout(), Sidebar(), Topbar(), isValidScope() (+3 more)

## Knowledge Gaps
- **353 isolated node(s):** `StaffMember`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem`, `Step` (+348 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `page-header.tsx` to `calendar.ts`, `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `Root Layout`, `page.tsx`, `projects.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `fba-fee-tracker-constants.ts`, `nav.ts`, `page.tsx`, `build.ts`, `dashboard-access-grid.tsx`, `price-change-plans.ts`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Why does `getSession()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `Sponsored Brands Upload - Campaign Data`, `monday.com Dashboards — Comprehensive Reference`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `Root Layout`, `projects.ts`, `build.ts`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `skeleton.tsx`, `fba-fee-tracker.ts`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `getStaffDirectory`, `session.ts`, `nav.ts`, `page.tsx`, `build.ts`, `price-change-plans.ts`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `createClient()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `Sponsored Brands Upload - Campaign Data`, `monday.com Dashboards — Comprehensive Reference`, `Sponsored Brands Bulk XLSX Builder`, `Root Layout`, `projects.ts`, `page.tsx`, `build.ts`, `page-header.tsx`, `buildVideoBulk.ts`, `fba-fee-tracker.ts`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `getStaffDirectory`, `session.ts`, `nav.ts`, `page.tsx`, `build.ts`, `price-change-plans.ts`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **What connects `StaffMember`, `SCOPE_CURRENCY`, `ActionResult` to the rest of the system?**
  _356 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.051511868413276866 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.0527868343424934 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.13446969696969696 - nodes in this community are weakly interconnected._