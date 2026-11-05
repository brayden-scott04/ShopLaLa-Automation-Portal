# Graph Report - LaLaGreen-Automation-Portal  (2026-11-05)

## Corpus Check
- 214 files · ~160,796 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1650 nodes · 5195 edges · 70 communities (46 shown, 24 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e2bd96a6`
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
- price-change-plans.ts
- page.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 160 edges
2. `createServiceClient()` - 133 edges
3. `getSession()` - 108 edges
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

## Communities (70 total, 24 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.05
Nodes (125): CalendarSidebar(), DayTasksDialog(), DayView(), DeleteScopeDialog(), layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS (+117 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.06
Nodes (85): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+77 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.18
Nodes (23): accessSummary(), ManageUsersPage(), StaffMember, DirectoryEntry, JobRoleEditor(), TeamPage(), changeOwnPassword(), createStaffMember() (+15 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (47): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, date-holidays, @dnd-kit/core (+39 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.10
Nodes (33): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+25 more)

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
Nodes (7): PlaceholderPage(), advertisements, goalVsPerformance, listingScore, shipments, sourcing, supplyChainAutomations

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.14
Nodes (28): marketplace, asNumber(), callSpApi(), callSpApiJson(), chunk(), credentialsFor(), extractFeaturedPricing(), extractOfferPrice() (+20 more)

### Community 10 - "utils.ts"
Cohesion: 0.22
Nodes (27): StaffProfileView(), addFunctionalManager(), addTeamMember(), assignExistingResponsibility(), cleanTask(), createResponsibility(), createTeam(), deletePriorityLevel() (+19 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.19
Nodes (21): LevelFilter, skillText(), StaffSkillsView(), SummaryTile(), createSkill(), getStaffSkills(), requireSkillsEditor(), Result (+13 more)

### Community 13 - "Root Layout"
Cohesion: 0.15
Nodes (5): PageHeader(), fbaFeeTracker, partners, products, trends

### Community 15 - "ESLint Config"
Cohesion: 0.40
Nodes (4): eslintConfig, I18N_ENFORCED, SHOWN, shownStrings

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.05
Nodes (37): Adding a Layer-1 group, Adding a new staff member, Adding a page to an existing group, Adding an API route, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+29 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.11
Nodes (27): buildRows(), FbaFeeTrackerView(), money(), pct(), relativeTime(), SkuDetail(), TierBadge(), tierLabel() (+19 more)

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
Cohesion: 0.07
Nodes (47): Row, Row, BulkDimsResult, bulkUpdateTrueDims(), daysBefore(), DimsInput, DimsJson, FbaFeeOverview (+39 more)

### Community 42 - "projects.ts"
Cohesion: 0.14
Nodes (32): SCOPE_OPTIONS, WEEKDAY_FULL, WEEKDAY_SHORT, MODE_LABEL, SendResult, KIND_LABELS, knownLocations(), NodeDialog() (+24 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.11
Nodes (30): foldKey(), foldListeners, initials(), isActive(), memoryPins, NavGroupSection(), NavLeaf(), parseFolds() (+22 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.06
Nodes (54): money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPES, sgtDate(), addInto() (+46 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (72): ComposeDialog(), ComposeDialogProps, splitAddresses(), CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps (+64 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.06
Nodes (59): FeeBreakdownBody(), SCOPE_CURRENCY, StatTile(), DimsDiff(), dimsText(), Filter, num(), SortKey (+51 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.12
Nodes (35): DepartmentDialog(), DepartmentColumn(), IconButton(), KIND_CLASSES, Legend(), NodeBox(), NodeDialogState, OrgChartView() (+27 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.13
Nodes (23): PartnersView(), withField(), cleanShortName(), createPartner(), deletePartner(), friendlyError(), listPartners(), movePartner() (+15 more)

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
Cohesion: 0.07
Nodes (33): POST(), POST(), GoalVsPerformanceLayout(), DashboardPage(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout() (+25 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.12
Nodes (25): ActionResult, BrandLibraryItem, COUNTRIES, DeleteConfirm(), AddPriceDialog(), formatPercent(), ImportPricesSheet(), PriceCell() (+17 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.07
Nodes (70): BrandLibrarySection(), AdsBulkGeneratorPage(), Step, STEPS, WizardStep, AssetsSection(), BrandsSection(), KeywordGarageSection() (+62 more)

### Community 56 - "session.ts"
Cohesion: 0.23
Nodes (13): POST(), POST(), toLocale(), setLocaleCookie(), toRole(), clearSessionCookie(), getSecretKey(), SessionPayload (+5 more)

### Community 57 - "page.tsx"
Cohesion: 0.19
Nodes (14): distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), Block, BlockMode, newBlock() (+6 more)

### Community 59 - "page-header.tsx"
Cohesion: 0.10
Nodes (27): Option, SearchableSelect(), PersonRow(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback() (+19 more)

### Community 60 - "nav.ts"
Cohesion: 0.17
Nodes (14): AccessItem, BASE_PATHS, calendar, companyInbox, defineNavItem(), masterList, NavGroup, NavItem (+6 more)

### Community 61 - "marketplaces.ts"
Cohesion: 0.10
Nodes (41): MasterListPage(), matchesRegion(), PullFromAmazonSheet(), PullResult, RegionFilter, RegionPicker(), RegionTag(), addRegionsTo() (+33 more)

### Community 62 - "page.tsx"
Cohesion: 0.12
Nodes (32): addProductPrice(), cleanDetails(), cleanPrice(), deleteProductPrice(), getPriceForSku(), importProductPrices(), listFactories(), listProductPrices() (+24 more)

### Community 64 - "dashboard-access-grid.tsx"
Cohesion: 0.07
Nodes (35): PortalLayout(), LanguageCard(), PasswordField(), SettingsPage(), DashboardAccessGrid(), Layout, layoutKey(), layoutListeners (+27 more)

### Community 65 - "marketplaces.ts"
Cohesion: 0.18
Nodes (10): MarketplaceOptions(), formatPrice(), SkuDetailDialog(), formatMoney(), MARKETPLACE_CODES, MARKETPLACE_IDS, marketplacesByRegion(), Region (+2 more)

### Community 66 - "sku-grouping.ts"
Cohesion: 0.47
Nodes (4): InsertionPlan, naturalCompare(), planInsertions(), skuPrefix()

### Community 67 - "layout.tsx"
Cohesion: 0.11
Nodes (27): inter, metadata, RootLayout(), LoginPage(), OrgChartPage(), CORE_VALUES, CoreValue, CoreValues() (+19 more)

### Community 72 - "price-change-plans.ts"
Cohesion: 0.29
Nodes (11): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PricePlan, PriceType, requirePlanAccess() (+3 more)

## Knowledge Gaps
- **324 isolated node(s):** `StaffMember`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem`, `Step` (+319 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `page-header.tsx` to `calendar.ts`, `dashboard-access-grid.tsx`, `Sponsored Brands Upload - Campaign Data`, `projects.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `skeleton.tsx`, `fba-fee-tracker.ts`, `product-block.tsx`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `fba-fee-calculator.ts`, `sp-api.ts`, `page.tsx`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Why does `getSession()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `PPC Schedule AI Import`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `projects.ts`, `page.tsx`, `build.ts`, `page-header.tsx`, `mail.ts`, `skeleton.tsx`, `fba-fee-tracker.ts`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `getStaffDirectory`, `session.ts`, `marketplaces.ts`, `page.tsx`, `dashboard-access-grid.tsx`, `price-change-plans.ts`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `createClient()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `price-change-plans.ts`, `build.ts`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `page-header.tsx`, `skeleton.tsx`, `fba-fee-tracker.ts`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `getStaffDirectory`, `session.ts`, `projects.ts`, `marketplaces.ts`, `page.tsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **What connects `StaffMember`, `SCOPE_CURRENCY`, `ActionResult` to the rest of the system?**
  _327 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05210688591983556 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.06303030303030303 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._