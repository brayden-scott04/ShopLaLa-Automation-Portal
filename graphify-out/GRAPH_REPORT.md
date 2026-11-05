# Graph Report - LaLaGreen-Automation-Portal  (2026-11-05)

## Corpus Check
- 214 files · ~161,831 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1659 nodes · 5221 edges · 70 communities (49 shown, 21 thin omitted)
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
- config.ts
- price-change-plans.ts

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

## Communities (70 total, 21 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.05
Nodes (125): CalendarSidebar(), DayTasksDialog(), DayView(), DeleteScopeDialog(), layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS (+117 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.09
Nodes (65): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+57 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.19
Nodes (23): accessSummary(), ManageUsersPage(), StaffMember, changeOwnPassword(), createStaffMember(), deleteStaffMember(), getCurrentUser(), listStaff() (+15 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (47): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, date-holidays, @dnd-kit/core (+39 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.10
Nodes (34): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+26 more)

### Community 5 - "shadcn/ui Component Registry Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 6 - "PPC Schedule AI Import"
Cohesion: 0.13
Nodes (22): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES (+14 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "product-block.tsx"
Cohesion: 0.09
Nodes (19): PlaceholderPage(), adsBulkGenerator, advertisements, BASE_PATHS, calendar, defineNavItem(), finance, goalVsPerformance (+11 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.10
Nodes (34): marketplace, MARKETPLACE_CODES, MARKETPLACE_IDS, Region, REGION_HOSTS, REGION_LABELS, asNumber(), callSpApi() (+26 more)

### Community 10 - "utils.ts"
Cohesion: 0.16
Nodes (34): StaffDrilldown(), Tab, PriorityBadge(), priorityBadgeClass(), StaffProfileView(), TaskSubmit, addFunctionalManager(), addTeamMember() (+26 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.20
Nodes (16): createSkill(), requireSkillsEditor(), Result, setStaffSkillLevel(), StaffSkillsView, tr(), Role, SessionPayload (+8 more)

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
Cohesion: 0.09
Nodes (35): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+27 more)

### Community 25 - "projects.ts"
Cohesion: 0.13
Nodes (28): budgetFor(), POST(), AD_GROUP_MEDIA, AD_MEDIA, AdsCountry, adsHeaders(), adsPost(), AdsProfile (+20 more)

### Community 26 - "page.tsx"
Cohesion: 0.12
Nodes (27): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), MarketplaceOptions(), NewBulkPricePlanSheet(), NewPricePlanSheet() (+19 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.05
Nodes (63): Row, Row, BulkDimsResult, bulkUpdateTrueDims(), daysBefore(), DimsInput, DimsJson, FbaFeeOverview (+55 more)

### Community 42 - "projects.ts"
Cohesion: 0.14
Nodes (31): SCOPE_OPTIONS, WEEKDAY_FULL, WEEKDAY_SHORT, ComposeDialog(), MODE_LABEL, SendResult, splitAddresses(), KIND_LABELS (+23 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.14
Nodes (24): foldKey(), foldListeners, initials(), isActive(), memoryPins, NavGroupSection(), NavLeaf(), parseFolds() (+16 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (47): addInto(), emptyTotals(), FeeBreakdown, FeeBreakdownFamily, FeeBreakdownType, FeeRow, getFeeBreakdown(), getProfitOverview() (+39 more)

### Community 45 - "mail.ts"
Cohesion: 0.05
Nodes (79): ComposeDialogProps, CompanyInboxPage(), FOLDER_OPTIONS, formatDate(), MAIL_ACTIONS, Notice, viewKey(), ThreadView() (+71 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.13
Nodes (20): AlertRankCell(), AsinDetail(), buildRows(), CategoryRank, Delta(), Filter, KIND_SEVERITY, rankText() (+12 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.12
Nodes (35): DepartmentDialog(), DepartmentColumn(), IconButton(), KIND_CLASSES, Legend(), NodeBox(), NodeDialogState, OrgChartView() (+27 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.18
Nodes (15): PartnerGrid(), PartnersView(), pricesHref(), Row, withField(), Partner, FACTORY_FIELDS, FORWARDER_FIELDS (+7 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.16
Nodes (20): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), isBoolean(), isScope(), isSortKey(), notesTooltip() (+12 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.33
Nodes (7): sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), NAV_GROUPS, SUBGROUP_LABELS

### Community 51 - "server.ts"
Cohesion: 0.13
Nodes (24): IncomingCampaign, POST(), BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow() (+16 more)

### Community 52 - "permissions.ts"
Cohesion: 0.07
Nodes (29): GoalVsPerformanceLayout(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout(), PpcTopUpLayout(), PriceChangePlansLayout(), SponsoredBrandsUploadLayout() (+21 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.12
Nodes (26): ActionResult, BrandLibraryItem, STEPS, WizardStep, AssetsSection(), BrandsSection(), COUNTRIES, DeleteConfirm() (+18 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.08
Nodes (60): BrandLibrarySection(), AdsBulkGeneratorPage(), Step, createBrand(), createKeywordTheme(), createVideoAsset(), deleteBrand(), deleteKeywordTheme() (+52 more)

### Community 56 - "session.ts"
Cohesion: 0.25
Nodes (12): POST(), POST(), toLocale(), setLocaleCookie(), toRole(), clearSessionCookie(), getSecretKey(), setSessionCookie() (+4 more)

### Community 57 - "page.tsx"
Cohesion: 0.19
Nodes (15): distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), Block, BlockMode, newBlock() (+7 more)

### Community 58 - "fba-fee-tracker-constants.ts"
Cohesion: 0.12
Nodes (17): ChatPanel(), markdownComponents, formatWhen(), TaskUpdates(), AddSkillDialog(), LevelBadge(), LevelFilter, LevelPicker() (+9 more)

### Community 59 - "page-header.tsx"
Cohesion: 0.11
Nodes (26): Option, SearchableSelect(), PersonRow(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount() (+18 more)

### Community 60 - "nav.ts"
Cohesion: 0.12
Nodes (21): ManageAccessDialog(), LanguageCard(), PasswordField(), SettingsPage(), DirectoryEntry, JobRoleEditor(), TeamPage(), DashboardLink() (+13 more)

### Community 61 - "marketplaces.ts"
Cohesion: 0.09
Nodes (44): MasterListPage(), matchesRegion(), PullFromAmazonSheet(), PullResult, RegionFilter, RegionPicker(), RegionTag(), addRegionsTo() (+36 more)

### Community 62 - "page.tsx"
Cohesion: 0.11
Nodes (41): AddPriceDialog(), formatPercent(), ImportPricesSheet(), PriceCell(), PriceRow(), ProductsView(), addProductPrice(), cleanDetails() (+33 more)

### Community 63 - "build.ts"
Cohesion: 0.18
Nodes (21): AMOUNT_HINTS, analyzeScheduleImport(), ColumnDetectSchema, ColumnMapping, COUNTRY_ALIASES, COUNTRY_HINTS, detectColumnBlocks(), detectColumnsWithAi() (+13 more)

### Community 64 - "dashboard-access-grid.tsx"
Cohesion: 0.13
Nodes (23): AccessItem, DashboardAccessGrid(), Layout, layoutKey(), layoutListeners, memoryLayouts, parseLayout(), readLayout() (+15 more)

### Community 65 - "marketplaces.ts"
Cohesion: 0.16
Nodes (17): POST(), BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, BaseCampaignInput, budgetFor() (+9 more)

### Community 66 - "sku-grouping.ts"
Cohesion: 0.33
Nodes (11): cleanShortName(), createPartner(), deletePartner(), friendlyError(), listPartners(), movePartner(), renamePartner(), requirePartnersAccess() (+3 more)

### Community 67 - "layout.tsx"
Cohesion: 0.12
Nodes (23): inter, metadata, RootLayout(), LoginPage(), OrgChartPage(), CORE_VALUES, CoreValue, CoreValues() (+15 more)

### Community 68 - "config.ts"
Cohesion: 0.47
Nodes (3): Locale, LOCALE_LABELS, LOCALE_TAGS

### Community 72 - "price-change-plans.ts"
Cohesion: 0.21
Nodes (15): DashboardPage(), PortalLayout(), requireInboxAccess(), applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans() (+7 more)

## Knowledge Gaps
- **325 isolated node(s):** `StaffMember`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem`, `Step` (+320 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `projects.ts`, `page.tsx`, `build.ts`, `page-header.tsx`, `mail.ts`, `skeleton.tsx`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `getStaffDirectory`, `session.ts`, `nav.ts`, `marketplaces.ts`, `page.tsx`, `build.ts`, `marketplaces.ts`, `sku-grouping.ts`, `price-change-plans.ts`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Why does `cn()` connect `page-header.tsx` to `calendar.ts`, `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `utils.ts`, `sp-api.ts`, `projects.ts`, `tabs.tsx`, `mail.ts`, `buildVideoBulk.ts`, `skeleton.tsx`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `page.tsx`, `fba-fee-tracker-constants.ts`, `nav.ts`, `page.tsx`, `dashboard-access-grid.tsx`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `createClient()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `sp-api.ts`, `projects.ts`, `page.tsx`, `build.ts`, `page-header.tsx`, `skeleton.tsx`, `server.ts`, `permissions.ts`, `getStaffDirectory`, `session.ts`, `nav.ts`, `marketplaces.ts`, `page.tsx`, `build.ts`, `marketplaces.ts`, `sku-grouping.ts`, `price-change-plans.ts`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **What connects `StaffMember`, `SCOPE_CURRENCY`, `ActionResult` to the rest of the system?**
  _328 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05171514961943489 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.08691308691308691 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._