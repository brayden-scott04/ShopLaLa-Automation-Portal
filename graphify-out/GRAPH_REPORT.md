# Graph Report - LaLaGreen-Automation-Portal  (2026-11-13)

## Corpus Check
- 245 files · ~191,094 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1900 nodes · 6178 edges · 88 communities (62 shown, 26 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.54)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `01aec9d7`
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
- page.tsx
- page.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 192 edges
2. `createServiceClient()` - 154 edges
3. `getSession()` - 124 edges
4. `createClient()` - 93 edges
5. `useT()` - 78 edges
6. `assertItemAccess()` - 49 edges
7. `Button()` - 42 edges
8. `getMyPermissions()` - 29 edges
9. `Skeleton()` - 28 edges
10. `getT()` - 28 edges

## Surprising Connections (you probably didn't know these)
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/market-ops/automations/trends/trends-view.tsx → lib/utils.ts
- `SortTh()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/market-ops/automations/trends/trends-view.tsx → lib/utils.ts
- `Delta()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/market-ops/automations/trends/trends-view.tsx → lib/utils.ts
- `PriorityPill()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/others/tasks/page.tsx → lib/utils.ts
- `TileBody()` --calls--> `cn()`  [EXTRACTED]
  components/dashboard-access-grid.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (88 total, 26 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.15
Nodes (48): AccessResult, addCalendarMember(), addCalendarMembers(), assertAssigneesAllowed(), copyTaskToDates(), createTask(), deleteOccurrences(), DeleteScope (+40 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.05
Nodes (100): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+92 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.21
Nodes (20): StaffMember, SettingsPage(), TeamPage(), changeOwnPassword(), createStaffMember(), deleteStaffMember(), getCurrentUser(), listStaff() (+12 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (47): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, date-holidays, @dnd-kit/core (+39 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.07
Nodes (59): GET(), changeLine(), dayLabel(), NotificationText, timeText(), timeValue(), useDayLabel(), useNotificationText() (+51 more)

### Community 5 - "shadcn/ui Component Registry Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 6 - "PPC Schedule AI Import"
Cohesion: 0.23
Nodes (15): WorkflowDiagram(), DeleteFileDialog(), EditStepButton(), FileList(), fill(), Segmented(), SopDialog(), StepPanel() (+7 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "product-block.tsx"
Cohesion: 0.08
Nodes (20): PlaceholderPage(), adsBulkGenerator, advertisements, BASE_PATHS, bulkCampaignUpload, defineNavItem(), fbaFeeTracker, finance (+12 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.15
Nodes (20): ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedSkuSheet, detectStatusColumnHeuristically(), ExistingAmazonSku, extractSkusFromSheet() (+12 more)

### Community 10 - "utils.ts"
Cohesion: 0.15
Nodes (18): ARROWS, bilingualLines, CardBox, CARDS, LANES, lines, PHASES, sections (+10 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.23
Nodes (14): createSkill(), requireSkillsEditor(), Result, setStaffSkillLevel(), StaffSkillsView, tr(), Skill, SKILL_LEVEL_BADGE (+6 more)

### Community 13 - "Root Layout"
Cohesion: 0.14
Nodes (17): DepartmentDialog(), DepartmentColumn(), IconButton(), KIND_CLASSES, Legend(), NodeBox(), NodeDialogState, OrgChartView() (+9 more)

### Community 15 - "ESLint Config"
Cohesion: 0.40
Nodes (4): eslintConfig, I18N_ENFORCED, SHOWN, shownStrings

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.05
Nodes (39): Adding a Layer-1 group, Adding a new staff member, Adding a page to an existing group, Adding an API route, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+31 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.32
Nodes (16): cleanText(), deleteOrgDepartment(), deleteOrgNode(), deleteOrgPerson(), moveOrgDepartment(), moveOrgNode(), requireEditor(), Result (+8 more)

### Community 25 - "projects.ts"
Cohesion: 0.10
Nodes (34): BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor(), POST(), AD_GROUP_MEDIA (+26 more)

### Community 26 - "page.tsx"
Cohesion: 0.14
Nodes (21): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), MarketplaceOptions(), NewBulkPricePlanSheet(), NewPricePlanSheet() (+13 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.06
Nodes (55): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), money(), num(), pct(), relativeTime() (+47 more)

### Community 42 - "projects.ts"
Cohesion: 0.12
Nodes (36): SCOPE_OPTIONS, MODE_LABEL, SendResult, markdownComponents, PingButton(), PingCandidate, PingResult, fromForm() (+28 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.12
Nodes (26): foldKey(), foldListeners, initials(), isActive(), memoryPins, NavGroupSection(), NavLeaf(), parseFolds() (+18 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.08
Nodes (40): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPES, sgtDate() (+32 more)

### Community 45 - "mail.ts"
Cohesion: 0.05
Nodes (81): ComposeDialog(), ComposeDialogProps, splitAddresses(), CompanyInboxPage(), FOLDER_OPTIONS, formatDate(), MAIL_ACTIONS, Notice (+73 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.17
Nodes (18): Row, AsinBsrHistory, BsrAlert, BsrSnapshot, BsrSyncRun, daysBefore(), getAsinBsrHistory(), getTrendsOverview() (+10 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.12
Nodes (27): PartnerGrid(), PartnersView(), pricesHref(), Row, withField(), cleanShortName(), createPartner(), deletePartner() (+19 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.13
Nodes (23): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), isBoolean(), isScope(), isSortKey(), notesTooltip() (+15 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.31
Nodes (8): ManageAccessDialog(), sendAiChatMessage(), getStaffDirectory(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), SUBGROUP_LABELS

### Community 51 - "server.ts"
Cohesion: 0.13
Nodes (23): IncomingCampaign, BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL (+15 more)

### Community 52 - "permissions.ts"
Cohesion: 0.06
Nodes (36): GoalVsPerformanceLayout(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout(), PpcTopUpLayout(), PriceChangePlansLayout(), SponsoredBrandsUploadLayout() (+28 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.07
Nodes (54): ActionResult, BrandLibraryItem, BrandLibrarySection(), blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign (+46 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.14
Nodes (14): BulkNotesDialog(), BULK_NOTE_COLUMNS, clamp01(), DEFAULT_LIMITS, isMismatchKind(), LISTING_ALERT_KINDS, LISTING_SORT_LABELS, LISTING_SORTS (+6 more)

### Community 56 - "session.ts"
Cohesion: 0.23
Nodes (13): POST(), POST(), toLocale(), setLocaleCookie(), toRole(), clearSessionCookie(), getSecretKey(), SessionPayload (+5 more)

### Community 57 - "page.tsx"
Cohesion: 0.10
Nodes (29): marketplace, MARKETPLACE_CODES, MARKETPLACE_IDS, Region, REGION_HOSTS, REGION_LABELS, callSpApi(), callSpApiJson() (+21 more)

### Community 58 - "fba-fee-tracker-constants.ts"
Cohesion: 0.24
Nodes (7): PriorityChip(), UpcomingEvent, UpcomingOverview(), UpcomingTask, calendar, ppcTopUp, tasks

### Community 59 - "page-header.tsx"
Cohesion: 0.09
Nodes (30): StatTile(), Option, SearchableSelect(), SortTh(), StatTile(), PersonRow(), SummaryTile(), AlertDialogMedia() (+22 more)

### Community 60 - "nav.ts"
Cohesion: 0.11
Nodes (20): PasswordField(), JobRoleEditor(), LoginForm(), SaveFooter(), StepEditDialog(), TeamEditDialog(), toForm(), UploadDialog() (+12 more)

### Community 61 - "marketplaces.ts"
Cohesion: 0.29
Nodes (11): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PricePlan, PriceType, requirePlanAccess() (+3 more)

### Community 62 - "page.tsx"
Cohesion: 0.11
Nodes (42): SkuDetailDialog(), AddPriceDialog(), formatPercent(), ImportPricesSheet(), PriceCell(), PriceRow(), ProductsView(), addProductPrice() (+34 more)

### Community 63 - "build.ts"
Cohesion: 0.08
Nodes (70): AdsBulkGeneratorPage(), PriorityBadge(), priorityBadgeClass(), StaffProfileView(), TaskSubmit, CampaignProduct, createBrand(), createKeywordTheme() (+62 more)

### Community 64 - "dashboard-access-grid.tsx"
Cohesion: 0.20
Nodes (13): AccessItem, DashboardAccessGrid(), Layout, layoutKey(), layoutListeners, memoryLayouts, parseLayout(), readLayout() (+5 more)

### Community 65 - "marketplaces.ts"
Cohesion: 0.14
Nodes (38): CalendarSidebar(), DeleteScopeDialog(), NameCalendarDialog(), UpcomingPanel(), WeekView(), WEEKDAY_INITIALS, YearView(), CalendarPage() (+30 more)

### Community 66 - "alert-change.tsx"
Cohesion: 0.12
Nodes (19): AlertChange(), AlertHeading(), asImages(), asStrings(), BulletDiff(), imageId(), ImageRow(), norm() (+11 more)

### Community 67 - "layout.tsx"
Cohesion: 0.11
Nodes (25): POST(), inter, metadata, RootLayout(), LoginPage(), OrgChartPage(), CORE_VALUES, CoreValue (+17 more)

### Community 68 - "config.ts"
Cohesion: 0.22
Nodes (10): deleteWorkflowFile(), getWorkflow(), requireEditor(), Result, saveWorkflowContent(), SECTION, WorkflowContent, workflowContentSchema (+2 more)

### Community 69 - "page.tsx"
Cohesion: 0.25
Nodes (10): BaseCampaignInput, budgetFor(), buildSponsoredBrandsBulk(), CampaignInput, dedupeKeywords(), emptyRow(), HEADER, SHEET_NAME (+2 more)

### Community 70 - "page.tsx"
Cohesion: 0.07
Nodes (52): SCOPE_CURRENCY, Filter, SortKey, STEPS, WizardStep, AlertRankCell(), AsinDetail(), buildRows() (+44 more)

### Community 71 - "fba-fee-tracker-constants.ts"
Cohesion: 0.18
Nodes (16): bulkImportListingNotes(), BulkNotesResult, getListingDetail(), getListingScoreOverview(), ListingNotesInput, NOTE_COLUMN_LABELS, NoteColumn, noteColumnFor() (+8 more)

### Community 72 - "price-change-plans.ts"
Cohesion: 0.16
Nodes (20): workflowAccess(), GET(), POST(), POST(), DashboardPage(), PortalLayout(), DashboardLink(), Sidebar() (+12 more)

### Community 73 - "sku-grouping.ts"
Cohesion: 0.47
Nodes (4): InsertionPlan, naturalCompare(), planInsertions(), skuPrefix()

### Community 74 - "getT"
Cohesion: 0.14
Nodes (22): distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), Step, Block, BlockMode (+14 more)

### Community 75 - "calendar-constants.ts"
Cohesion: 0.11
Nodes (28): DayTasksDialog(), TaskFormDialog(), WEEKDAY_FULL, WEEKDAY_SHORT, AccessibleCalendar, CalendarMember, CalendarSummary, TaskInput (+20 more)

### Community 76 - "page.tsx"
Cohesion: 0.38
Nodes (9): accessSummary(), ManageUsersPage(), localizeNavGroup(), localizeNavItem(), NAV_TEXT_KEYS, NavText(), useLocalizedNav(), useSubgroupLabel() (+1 more)

### Community 77 - "task-form-dialog.tsx"
Cohesion: 0.39
Nodes (8): Row, ListingTableRow, ListingScoreOverview, ListingAlert, ListingNotes, ListingScore, ListingSummary, ListingSyncRun

### Community 78 - "listing-sheet.tsx"
Cohesion: 0.14
Nodes (26): BANDS, Filter, imagesMissing(), ListingScoreView(), OPPORTUNITIES, ViewMode, AlertActions(), ListingCard() (+18 more)

### Community 79 - "pricing-update.ts"
Cohesion: 0.39
Nodes (8): fetchSkuDetail(), fetchSkuPricing(), requireStaff(), asNumber(), extractOfferPrice(), extractStringAttr(), firstAttr(), getSkuDetail()

### Community 80 - "month-grid.tsx"
Cohesion: 0.20
Nodes (17): DayView(), layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS, formatDate(), Result, SearchResults() (+9 more)

### Community 81 - "devDependencies"
Cohesion: 0.43
Nodes (6): listeners, memory, readRaw(), subscribe(), usePersistedState(), writeRaw()

### Community 82 - "requireStaff"
Cohesion: 0.28
Nodes (15): RegionPicker(), RegionTag(), addRegionsTo(), addSkus(), addSkusGrouped(), deleteSku(), fetchAmazonMissingSkus(), listSkus() (+7 more)

## Knowledge Gaps
- **363 isolated node(s):** `StaffMember`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem`, `Step` (+358 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `page-header.tsx` to `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `utils.ts`, `Root Layout`, `page.tsx`, `build.ts`, `projects.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `permissions.ts`, `fba-fee-calculator.ts`, `fba-fee-tracker-constants.ts`, `nav.ts`, `page.tsx`, `build.ts`, `dashboard-access-grid.tsx`, `alert-change.tsx`, `page.tsx`, `price-change-plans.ts`, `getT`, `calendar-constants.ts`, `listing-sheet.tsx`, `month-grid.tsx`, `package.json`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Why does `getSession()` connect `price-change-plans.ts` to `calendar.ts`, `PPC Top-Up Automation`, `Auth & Staff Management`, `Sponsored Brands Upload - Campaign Data`, `monday.com Dashboards — Comprehensive Reference`, `Sponsored Brands Bulk XLSX Builder`, `sp-api.ts`, `projects.ts`, `build.ts`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `skeleton.tsx`, `fba-fee-tracker.ts`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `session.ts`, `fba-fee-tracker-constants.ts`, `marketplaces.ts`, `page.tsx`, `build.ts`, `marketplaces.ts`, `config.ts`, `fba-fee-tracker-constants.ts`, `pricing-update.ts`, `requireStaff`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Why does `createClient()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `monday.com Dashboards — Comprehensive Reference`, `Sponsored Brands Bulk XLSX Builder`, `sp-api.ts`, `projects.ts`, `build.ts`, `page-header.tsx`, `buildVideoBulk.ts`, `fba-fee-tracker.ts`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `session.ts`, `marketplaces.ts`, `page.tsx`, `build.ts`, `fba-fee-tracker-constants.ts`, `price-change-plans.ts`, `requireStaff`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `StaffMember`, `SCOPE_CURRENCY`, `ActionResult` to the rest of the system?**
  _366 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14540816326530612 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.051274362818590706 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._