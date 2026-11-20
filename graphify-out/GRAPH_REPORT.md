# Graph Report - LaLaGreen-Automation-Portal  (2026-11-20)

## Corpus Check
- 247 files · ~196,355 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1924 nodes · 6291 edges · 90 communities (68 shown, 22 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.54)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `eb5aa7c3`
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
- listing-score.ts
- staff-drilldown.tsx
- nav.tsx
- useT
- fba-fee-tracker-view.tsx
- server.ts
- getT
- page-header.tsx
- task-form-dialog.tsx
- ppc-top-up-chart.tsx
- listing-sheet.tsx
- pricing-update.ts
- ppc-daily-cap.ts
- addDays
- listing-score.ts
- page.tsx
- listing-table.tsx
- vercel.json
- buildVideoBulk.ts
- ppc-acos-topup-constants.ts
- fba-fee-tracker-constants.ts
- holidays.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 199 edges
2. `createServiceClient()` - 158 edges
3. `getSession()` - 128 edges
4. `createClient()` - 93 edges
5. `useT()` - 80 edges
6. `assertItemAccess()` - 49 edges
7. `Button()` - 43 edges
8. `getT()` - 30 edges
9. `getMyPermissions()` - 29 edges
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

## Communities (90 total, 22 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.14
Nodes (54): ManageAccessDialog(), AccessResult, addCalendarMember(), addCalendarMembers(), assertAssigneesAllowed(), CalendarMember, copyTaskToDates(), createTask() (+46 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.19
Nodes (26): AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass(), toNumericAmount() (+18 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.17
Nodes (23): StaffMember, SettingsPage(), DirectoryEntry, JobRoleEditor(), TeamPage(), changeOwnPassword(), createStaffMember(), deleteStaffMember() (+15 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (47): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, date-holidays, @dnd-kit/core (+39 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.15
Nodes (23): GET(), ICONS, NotificationsPanel(), parseCount(), parseList(), useNotifications(), usePoll(), useUnreadCount() (+15 more)

### Community 5 - "shadcn/ui Component Registry Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 6 - "PPC Schedule AI Import"
Cohesion: 0.07
Nodes (77): BrandLibrarySection(), AdsBulkGeneratorPage(), Step, StaffDrilldown(), Tab, PriorityBadge(), priorityBadgeClass(), StaffProfileView() (+69 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "product-block.tsx"
Cohesion: 0.09
Nodes (20): PlaceholderPage(), adsBulkGenerator, advertisements, BASE_PATHS, bulkCampaignUpload, defineNavItem(), finance, goalVsPerformance (+12 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.05
Nodes (75): RegionPicker(), RegionTag(), applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PriceType (+67 more)

### Community 10 - "utils.ts"
Cohesion: 0.09
Nodes (44): WorkflowDiagram(), StepEditDialog(), toForm(), FileList(), fill(), Segmented(), SopDialog(), StepPanel() (+36 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.08
Nodes (32): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES (+24 more)

### Community 13 - "Root Layout"
Cohesion: 0.20
Nodes (17): BulkDimsResult, bulkUpdateTrueDims(), daysBefore(), DimsInput, DimsJson, FbaFeeOverview, getFbaFeeOverview(), getSkuFeeHistory() (+9 more)

### Community 15 - "ESLint Config"
Cohesion: 0.40
Nodes (4): eslintConfig, I18N_ENFORCED, SHOWN, shownStrings

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.05
Nodes (39): Adding a Layer-1 group, Adding a new staff member, Adding a page to an existing group, Adding an API route, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+31 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.14
Nodes (17): DepartmentDialog(), DepartmentColumn(), IconButton(), KIND_CLASSES, Legend(), NodeBox(), NodeDialogState, OrgChartView() (+9 more)

### Community 25 - "projects.ts"
Cohesion: 0.13
Nodes (28): budgetFor(), POST(), AD_GROUP_MEDIA, AD_MEDIA, AdsCountry, adsHeaders(), adsPost(), AdsProfile (+20 more)

### Community 26 - "page.tsx"
Cohesion: 0.08
Nodes (39): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), MarketplaceOptions(), NewBulkPricePlanSheet(), NewPricePlanSheet() (+31 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.16
Nodes (17): Banded, expectedFbaFee(), FeeInput, fromRows(), incremental(), IncrementalRate, priceBandOf(), RateTables (+9 more)

### Community 42 - "projects.ts"
Cohesion: 0.12
Nodes (37): Option, SearchableSelect(), ComposeDialog(), MODE_LABEL, SendResult, splitAddresses(), LoginForm(), PingCandidate (+29 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.14
Nodes (24): foldKey(), foldListeners, initials(), isActive(), memoryPins, NavGroupSection(), NavLeaf(), parseFolds() (+16 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.10
Nodes (32): addInto(), emptyTotals(), FeeBreakdown, FeeBreakdownFamily, FeeBreakdownType, FeeRow, getFeeBreakdown(), getProfitOverview() (+24 more)

### Community 45 - "mail.ts"
Cohesion: 0.05
Nodes (79): ComposeDialogProps, CompanyInboxPage(), FOLDER_OPTIONS, formatDate(), MAIL_ACTIONS, Notice, viewKey(), ThreadView() (+71 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.17
Nodes (19): Row, AsinBsrHistory, BsrAlert, BsrSnapshot, BsrSyncRun, daysBefore(), getAsinBsrHistory(), getTrendsOverview() (+11 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.13
Nodes (23): PartnersView(), withField(), cleanShortName(), createPartner(), deletePartner(), friendlyError(), listPartners(), movePartner() (+15 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.07
Nodes (59): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), isBoolean(), isScope(), isSortKey(), notesTooltip() (+51 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.33
Nodes (7): sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), NAV_GROUPS, SUBGROUP_LABELS

### Community 51 - "server.ts"
Cohesion: 0.21
Nodes (13): IncomingCampaign, BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL (+5 more)

### Community 52 - "permissions.ts"
Cohesion: 0.06
Nodes (32): GoalVsPerformanceLayout(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout(), PpcTopUpLayout(), PriceChangePlansLayout(), SponsoredBrandsUploadLayout() (+24 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.15
Nodes (26): CalendarSidebar(), DeleteScopeDialog(), SCOPE_OPTIONS, NameCalendarDialog(), WEEKDAY_INITIALS, YearView(), CalendarPage(), isViewMode() (+18 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.20
Nodes (18): AlertHeading(), ListingCard(), LengthBar(), ListingSheet(), ListingTable(), AmazonImg(), BAND_BG, BAND_TEXT (+10 more)

### Community 56 - "session.ts"
Cohesion: 0.19
Nodes (16): POST(), POST(), sendBroadcast(), getStaffSkills(), toLocale(), setLocaleCookie(), canManageProfiles(), toRole() (+8 more)

### Community 57 - "page.tsx"
Cohesion: 0.13
Nodes (26): ActionResult, BrandLibraryItem, STEPS, WizardStep, AssetsSection(), BrandsSection(), COUNTRIES, DeleteConfirm() (+18 more)

### Community 58 - "fba-fee-tracker-constants.ts"
Cohesion: 0.20
Nodes (22): DayTasksDialog(), DayView(), layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS, formatDate(), Result (+14 more)

### Community 59 - "page-header.tsx"
Cohesion: 0.09
Nodes (31): BroadcastButton(), PersonRow(), PartnerGrid(), pricesHref(), Row, AlertDialogFooter(), Avatar(), AvatarBadge() (+23 more)

### Community 60 - "nav.ts"
Cohesion: 0.07
Nodes (45): distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), Block, BlockMode, newBlock() (+37 more)

### Community 61 - "marketplaces.ts"
Cohesion: 0.19
Nodes (10): BANDS, compareRows(), Filter, imagesMissing(), ListingScoreView(), OPPORTUNITIES, SORT_VALUE, ViewMode (+2 more)

### Community 62 - "page.tsx"
Cohesion: 0.10
Nodes (42): AddPriceDialog(), formatPercent(), ImportPricesSheet(), PriceCell(), PriceRow(), ProductsView(), addProductPrice(), cleanDetails() (+34 more)

### Community 63 - "build.ts"
Cohesion: 0.32
Nodes (16): cleanText(), deleteOrgDepartment(), deleteOrgNode(), deleteOrgPerson(), moveOrgDepartment(), moveOrgNode(), requireEditor(), Result (+8 more)

### Community 64 - "dashboard-access-grid.tsx"
Cohesion: 0.15
Nodes (20): AccessItem, DashboardAccessGrid(), Layout, layoutKey(), layoutListeners, memoryLayouts, parseLayout(), readLayout() (+12 more)

### Community 65 - "marketplaces.ts"
Cohesion: 0.16
Nodes (22): AddSkillDialog(), LevelBadge(), LevelFilter, LevelPicker(), skillText(), StaffSkillsView(), SummaryTile(), Switch() (+14 more)

### Community 66 - "alert-change.tsx"
Cohesion: 0.17
Nodes (17): POST(), BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, BaseCampaignInput, budgetFor() (+9 more)

### Community 67 - "layout.tsx"
Cohesion: 0.14
Nodes (20): RootLayout(), LoginPage(), OrgChartPage(), CORE_VALUES, CoreValue, CoreValues(), en, zh (+12 more)

### Community 68 - "listing-score.ts"
Cohesion: 0.15
Nodes (22): Row, ListingTableRow, bulkImportListingNotes(), BulkNotesResult, getListingDetail(), getListingScoreOverview(), ListingNotesInput, ListingScoreOverview (+14 more)

### Community 69 - "staff-drilldown.tsx"
Cohesion: 0.29
Nodes (10): workflowAccess(), GET(), POST(), POST(), DashboardPage(), requireEditor(), requireInboxAccess(), isValidScope() (+2 more)

### Community 70 - "nav.tsx"
Cohesion: 0.16
Nodes (20): inter, metadata, accessSummary(), ManageUsersPage(), changeLine(), dayLabel(), NotificationText, timeText() (+12 more)

### Community 71 - "useT"
Cohesion: 0.10
Nodes (22): PortalLayout(), LanguageCard(), PasswordField(), DashboardLink(), DeleteFileDialog(), SaveFooter(), TeamEditDialog(), UploadDialog() (+14 more)

### Community 72 - "fba-fee-tracker-view.tsx"
Cohesion: 0.16
Nodes (21): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+13 more)

### Community 73 - "server.ts"
Cohesion: 0.23
Nodes (16): AcosManualTopUp, cancelAcosManualTopUp(), createAcosManualTopUp(), listAcosManualTopUps(), requireStaff(), AcosBandSettings, AcosScheduleRow, getAcosTopupConfig() (+8 more)

### Community 74 - "getT"
Cohesion: 0.19
Nodes (20): AMOUNT_HINTS, analyzeScheduleImport(), ColumnDetectSchema, ColumnMapping, COUNTRY_ALIASES, COUNTRY_HINTS, detectColumnBlocks(), detectColumnsWithAi() (+12 more)

### Community 75 - "page-header.tsx"
Cohesion: 0.13
Nodes (6): PageHeader(), fbaFeeTracker, listingScore, newProductLaunchWorkflow, partners, trends

### Community 76 - "task-form-dialog.tsx"
Cohesion: 0.15
Nodes (17): WEEKDAY_FULL, WEEKDAY_SHORT, PingButton(), AccessibleCalendar, CalendarSummary, TaskInput, TaskUpdate, CalendarRole (+9 more)

### Community 77 - "ppc-top-up-chart.tsx"
Cohesion: 0.18
Nodes (14): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION (+6 more)

### Community 78 - "listing-sheet.tsx"
Cohesion: 0.14
Nodes (17): AlertActions(), AlertChange(), asImages(), asStrings(), BulletDiff(), imageId(), ImageRow(), norm() (+9 more)

### Community 79 - "pricing-update.ts"
Cohesion: 0.23
Nodes (15): createGoal(), deleteGoal(), getGoalProgress(), GOAL_SCOPES, GoalProgress, isValidDate(), listGoals(), MetricSumRow (+7 more)

### Community 80 - "ppc-daily-cap.ts"
Cohesion: 0.23
Nodes (13): GET(), fetchAllScheduleRows(), findIncompleteCountries(), getDailyCapConfig(), requireStaff(), ScheduleRow, updateCountrySettings(), updateScheduleSlots() (+5 more)

### Community 81 - "addDays"
Cohesion: 0.33
Nodes (15): toResult(), TaskFormDialog(), addDays(), addMonths(), diffDays(), fromDateKey(), toDateKey(), clampedDate() (+7 more)

### Community 82 - "listing-score.ts"
Cohesion: 0.14
Nodes (14): BulkNotesDialog(), BULK_NOTE_COLUMNS, clamp01(), DEFAULT_LIMITS, LISTING_ALERT_KINDS, LISTING_SORT_DEFAULT_DIR, LISTING_SORT_LABELS, LISTING_SORTS (+6 more)

### Community 83 - "page.tsx"
Cohesion: 0.24
Nodes (7): BroadcastCandidate, PriorityChip(), UpcomingEvent, UpcomingOverview(), UpcomingTask, calendar, tasks

### Community 84 - "listing-table.tsx"
Cohesion: 0.18
Nodes (9): Align, BulletRatio(), Count(), Ratio(), SortState, Th(), LISTING_STATUS_LABELS, ListingSort (+1 more)

### Community 86 - "buildVideoBulk.ts"
Cohesion: 0.27
Nodes (10): BrandProfile, budgetFor(), buildVideoBulk(), dedupeKeywords(), emptyRow(), HEADER, SHEET_NAME, toAmazonDate() (+2 more)

### Community 87 - "ppc-acos-topup-constants.ts"
Cohesion: 0.28
Nodes (8): ACOS_BANDS, ACOS_METRICS, currentHalfHourSlotSgt(), formatBandLabel(), HALF_HOUR_SLOTS, nowSgt(), subSlotsFor(), trimPercent()

### Community 88 - "fba-fee-tracker-constants.ts"
Cohesion: 0.29
Nodes (7): FeeAlert, ALERT_CAUSES, ALERT_KIND_LABELS, ALERT_KINDS, ALERT_STATUS_LABELS, AlertCause, AlertKind

### Community 89 - "holidays.ts"
Cohesion: 0.50
Nodes (4): EXCLUDED, getHolidayTasks(), getInstances(), HOLIDAY_COUNTRIES

## Knowledge Gaps
- **366 isolated node(s):** `StaffMember`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem`, `Step` (+361 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `page-header.tsx` to `Auth & Staff Management`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `sp-api.ts`, `projects.ts`, `tabs.tsx`, `mail.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `getStaffDirectory`, `page.tsx`, `fba-fee-tracker-constants.ts`, `nav.ts`, `marketplaces.ts`, `page.tsx`, `dashboard-access-grid.tsx`, `marketplaces.ts`, `useT`, `fba-fee-tracker-view.tsx`, `task-form-dialog.tsx`, `ppc-top-up-chart.tsx`, `listing-sheet.tsx`, `addDays`, `page.tsx`, `listing-table.tsx`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **Why does `getSession()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `monday.com Dashboards — Comprehensive Reference`, `utils.ts`, `Root Layout`, `projects.ts`, `page.tsx`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `skeleton.tsx`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `fba-fee-calculator.ts`, `session.ts`, `page.tsx`, `build.ts`, `marketplaces.ts`, `alert-change.tsx`, `listing-score.ts`, `staff-drilldown.tsx`, `useT`, `server.ts`, `getT`, `pricing-update.ts`, `ppc-daily-cap.ts`, `page.tsx`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Why does `createClient()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `PPC Schedule AI Import`, `monday.com Dashboards — Comprehensive Reference`, `Root Layout`, `projects.ts`, `page.tsx`, `page-header.tsx`, `buildVideoBulk.ts`, `fba-fee-tracker.ts`, `server.ts`, `permissions.ts`, `session.ts`, `page.tsx`, `build.ts`, `marketplaces.ts`, `alert-change.tsx`, `listing-score.ts`, `staff-drilldown.tsx`, `server.ts`, `getT`, `pricing-update.ts`, `ppc-daily-cap.ts`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **What connects `StaffMember`, `SCOPE_CURRENCY`, `ActionResult` to the rest of the system?**
  _369 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13636363636363635 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Should `shadcn/ui Component Registry Config` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._