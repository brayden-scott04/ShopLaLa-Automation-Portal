# Graph Report - LaLaGreen-Automation-Portal  (2026-11-18)

## Corpus Check
- 245 files · ~193,407 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1905 nodes · 6193 edges · 77 communities (55 shown, 22 thin omitted)
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
- page.tsx
- fba-fee-tracker-constants.ts
- sku-grouping.ts
- getT
- calendar-constants.ts
- listing-sheet.tsx
- pricing-update.ts
- devDependencies
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `cn()` - 194 edges
2. `createServiceClient()` - 155 edges
3. `getSession()` - 125 edges
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

## Communities (77 total, 22 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.13
Nodes (55): AccessResult, addCalendarMember(), addCalendarMembers(), assertAssigneesAllowed(), copyTaskToDates(), createTask(), deleteCalendar(), deleteOccurrences() (+47 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.07
Nodes (77): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+69 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.18
Nodes (22): StaffMember, changeOwnPassword(), createStaffMember(), deleteStaffMember(), listStaff(), renameStaffMember(), requireAdmin(), requireAdminOrModerator() (+14 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (47): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, date-holidays, @dnd-kit/core (+39 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.14
Nodes (25): GET(), useRelativeTime(), ICONS, NotificationsPanel(), announceNotificationsChanged(), parseCount(), parseList(), useNotifications() (+17 more)

### Community 5 - "shadcn/ui Component Registry Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 6 - "PPC Schedule AI Import"
Cohesion: 0.21
Nodes (30): PriorityBadge(), priorityBadgeClass(), StaffProfileView(), TaskSubmit, addFunctionalManager(), addTeamMember(), assignExistingResponsibility(), cleanTask() (+22 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "product-block.tsx"
Cohesion: 0.07
Nodes (22): ChatPanel(), PageHeader(), PlaceholderPage(), advertisements, BASE_PATHS, defineNavItem(), fbaFeeTracker, finance (+14 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.12
Nodes (34): RegionPicker(), RegionTag(), addRegionsTo(), addSkus(), addSkusGrouped(), ColumnDetectSchema, ColumnMapping, deleteSku() (+26 more)

### Community 10 - "utils.ts"
Cohesion: 0.08
Nodes (45): POST(), WorkflowDiagram(), TeamEditDialog(), EditStepButton(), FileList(), fill(), Segmented(), SopDialog() (+37 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.24
Nodes (13): createSkill(), Result, setStaffSkillLevel(), StaffSkillsView, tr(), Skill, SKILL_LEVEL_BADGE, SKILL_LEVEL_DOT (+5 more)

### Community 13 - "Root Layout"
Cohesion: 0.12
Nodes (33): DepartmentDialog(), DepartmentColumn(), IconButton(), KIND_CLASSES, Legend(), NodeBox(), NodeDialogState, OrgChartView() (+25 more)

### Community 15 - "ESLint Config"
Cohesion: 0.40
Nodes (4): eslintConfig, I18N_ENFORCED, SHOWN, shownStrings

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.05
Nodes (39): Adding a Layer-1 group, Adding a new staff member, Adding a page to an existing group, Adding an API route, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+31 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.13
Nodes (24): inter, metadata, LanguageCard(), PasswordField(), SettingsPage(), changeLine(), dayLabel(), NotificationText (+16 more)

### Community 25 - "projects.ts"
Cohesion: 0.08
Nodes (44): BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor(), POST(), AD_GROUP_MEDIA (+36 more)

### Community 26 - "page.tsx"
Cohesion: 0.15
Nodes (20): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), NewPricePlanSheet(), nextStepPrice() (+12 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.06
Nodes (59): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+51 more)

### Community 42 - "projects.ts"
Cohesion: 0.17
Nodes (27): SCOPE_OPTIONS, WEEKDAY_FULL, WEEKDAY_SHORT, ComposeDialog(), MODE_LABEL, SendResult, splitAddresses(), PingButton() (+19 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.14
Nodes (23): foldKey(), foldListeners, initials(), isActive(), memoryPins, NavGroupSection(), NavLeaf(), parseFolds() (+15 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (59): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES (+51 more)

### Community 45 - "mail.ts"
Cohesion: 0.05
Nodes (79): ComposeDialogProps, CompanyInboxPage(), FOLDER_OPTIONS, formatDate(), MAIL_ACTIONS, Notice, viewKey(), ThreadView() (+71 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.10
Nodes (34): AlertRankCell(), AsinDetail(), buildRows(), CategoryRank, Delta(), Filter, KIND_SEVERITY, rankText() (+26 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.09
Nodes (39): AMOUNT_HINTS, analyzeScheduleImport(), ColumnDetectSchema, ColumnMapping, COUNTRY_ALIASES, COUNTRY_HINTS, detectColumnBlocks(), detectColumnsWithAi() (+31 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.12
Nodes (27): PartnerGrid(), PartnersView(), pricesHref(), Row, withField(), cleanShortName(), createPartner(), deletePartner() (+19 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.11
Nodes (29): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), isBoolean(), isScope(), isSortKey(), notesTooltip() (+21 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.33
Nodes (7): sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), NAV_GROUPS, SUBGROUP_LABELS

### Community 51 - "server.ts"
Cohesion: 0.12
Nodes (22): BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL, SB_MAG_HEADER (+14 more)

### Community 52 - "permissions.ts"
Cohesion: 0.06
Nodes (37): workflowAccess(), GET(), IncomingCampaign, POST(), POST(), GoalVsPerformanceLayout(), ProfitAnalyticsLayout(), PortalLayout() (+29 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.10
Nodes (32): ActionResult, BrandLibraryItem, BrandLibrarySection(), blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign (+24 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.27
Nodes (8): LoginForm(), LevelFilter, SummaryTile(), Card(), CardContent(), CardFooter(), CardHeader(), Switch()

### Community 56 - "session.ts"
Cohesion: 0.22
Nodes (14): POST(), POST(), toLocale(), setLocaleCookie(), Role, toRole(), clearSessionCookie(), getSecretKey() (+6 more)

### Community 57 - "page.tsx"
Cohesion: 0.13
Nodes (30): fetchSkuDetail(), fetchSkuPricing(), requireStaff(), marketplace, asNumber(), callSpApi(), callSpApiJson(), chunk() (+22 more)

### Community 58 - "fba-fee-tracker-constants.ts"
Cohesion: 0.23
Nodes (8): DashboardPage(), PriorityChip(), UpcomingEvent, UpcomingTask, listTasks(), calendar, tasks, filterItems()

### Community 59 - "page-header.tsx"
Cohesion: 0.08
Nodes (32): SearchableSelect(), CalendarSidebar(), TextPair(), LengthBar(), Count(), Ratio(), SidebarContent(), Sidebar() (+24 more)

### Community 60 - "nav.ts"
Cohesion: 0.10
Nodes (26): ProductBlock(), toLines(), MasterListPage(), matchesRegion(), PullFromAmazonSheet(), PullResult, RegionFilter, fromForm() (+18 more)

### Community 61 - "marketplaces.ts"
Cohesion: 0.29
Nodes (11): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PricePlan, PriceType, requirePlanAccess() (+3 more)

### Community 62 - "page.tsx"
Cohesion: 0.10
Nodes (42): AddPriceDialog(), formatPercent(), ImportPricesSheet(), PriceCell(), PriceRow(), ProductsView(), addProductPrice(), cleanDetails() (+34 more)

### Community 63 - "build.ts"
Cohesion: 0.06
Nodes (86): AdsBulkGeneratorPage(), Step, STEPS, WizardStep, AssetsSection(), BrandsSection(), COUNTRIES, KeywordGarageSection() (+78 more)

### Community 64 - "dashboard-access-grid.tsx"
Cohesion: 0.08
Nodes (37): accessSummary(), ManageUsersPage(), AccessItem, DashboardAccessGrid(), Layout, layoutKey(), layoutListeners, memoryLayouts (+29 more)

### Community 65 - "marketplaces.ts"
Cohesion: 0.10
Nodes (63): DayTasksDialog(), DayView(), DeleteScopeDialog(), layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS, NameCalendarDialog() (+55 more)

### Community 66 - "alert-change.tsx"
Cohesion: 0.10
Nodes (27): AlertActions(), AlertChange(), asImages(), asStrings(), BulletDiff(), imageId(), ImageRow(), norm() (+19 more)

### Community 67 - "layout.tsx"
Cohesion: 0.14
Nodes (20): RootLayout(), LoginPage(), OrgChartPage(), CORE_VALUES, CoreValue, CoreValues(), en, zh (+12 more)

### Community 70 - "page.tsx"
Cohesion: 0.15
Nodes (10): ManageAccessDialog(), DirectoryEntry, JobRoleEditor(), TeamPage(), StaffDrilldown(), Tab, skillText(), StaffSkillsView() (+2 more)

### Community 71 - "fba-fee-tracker-constants.ts"
Cohesion: 0.16
Nodes (20): bulkImportListingNotes(), BulkNotesResult, getListingDetail(), getListingScoreOverview(), ListingNotesInput, ListingScoreOverview, NOTE_COLUMN_LABELS, NoteColumn (+12 more)

### Community 73 - "sku-grouping.ts"
Cohesion: 0.47
Nodes (4): InsertionPlan, naturalCompare(), planInsertions(), skuPrefix()

### Community 74 - "getT"
Cohesion: 0.12
Nodes (20): distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), Block, BlockMode, newBlock() (+12 more)

### Community 75 - "calendar-constants.ts"
Cohesion: 0.14
Nodes (15): AccessibleCalendar, CalendarMember, TaskInput, TaskUpdate, CalendarMemberRole, CalendarRole, FIXED_CALENDAR_COLORS, RepeatFreq (+7 more)

### Community 78 - "listing-sheet.tsx"
Cohesion: 0.14
Nodes (29): BANDS, Filter, imagesMissing(), ListingScoreView(), OPPORTUNITIES, Row, ViewMode, AlertHeading() (+21 more)

### Community 79 - "pricing-update.ts"
Cohesion: 0.18
Nodes (10): MarketplaceOptions(), formatPrice(), SkuDetailDialog(), formatMoney(), MARKETPLACE_CODES, MARKETPLACE_IDS, marketplacesByRegion(), Region (+2 more)

### Community 81 - "devDependencies"
Cohesion: 0.43
Nodes (6): listeners, memory, readRaw(), subscribe(), usePersistedState(), writeRaw()

## Knowledge Gaps
- **363 isolated node(s):** `StaffMember`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem`, `Step` (+358 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `page-header.tsx` to `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `product-block.tsx`, `utils.ts`, `Root Layout`, `build.ts`, `projects.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `getStaffDirectory`, `fba-fee-tracker-constants.ts`, `nav.ts`, `page.tsx`, `build.ts`, `dashboard-access-grid.tsx`, `marketplaces.ts`, `alert-change.tsx`, `page.tsx`, `getT`, `listing-sheet.tsx`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **Why does `getSession()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `monday.com Dashboards — Comprehensive Reference`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `Root Layout`, `sp-api.ts`, `projects.ts`, `build.ts`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `skeleton.tsx`, `fba-fee-tracker.ts`, `fba-fee-calculator.ts`, `permissions.ts`, `session.ts`, `page.tsx`, `fba-fee-tracker-constants.ts`, `marketplaces.ts`, `page.tsx`, `build.ts`, `marketplaces.ts`, `page.tsx`, `fba-fee-tracker-constants.ts`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `PPC Top-Up Automation`, `mail.ts`, `skeleton.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **What connects `StaffMember`, `SCOPE_CURRENCY`, `ActionResult` to the rest of the system?**
  _366 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1318181818181818 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.0692785475394171 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._