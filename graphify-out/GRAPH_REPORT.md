# Graph Report - LaLaGreen-Automation-Portal  (2026-10-27)

## Corpus Check
- 186 files · ~133,017 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1399 nodes · 4172 edges · 67 communities (40 shown, 27 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b2f4d956`
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
- hash-password.ts
- page.tsx
- fba-fee-tracker-constants.ts
- page-header.tsx
- dashboard-access-grid.tsx
- marketplaces.ts
- page.tsx
- page.tsx
- session.ts
- page.tsx
- layout.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 131 edges
2. `createServiceClient()` - 99 edges
3. `getSession()` - 93 edges
4. `createClient()` - 76 edges
5. `assertItemAccess()` - 47 edges
6. `Button()` - 32 edges
7. `requireStaff()` - 24 edges
8. `SupabaseServerClient` - 20 edges
9. `Skeleton()` - 19 edges
10. `getMyPermissions()` - 19 edges

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

## Communities (67 total, 27 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.05
Nodes (122): DayTasksDialog(), DayView(), DeleteScopeDialog(), SCOPE_OPTIONS, ManageAccessDialog(), layoutWeekRibbons(), MonthGrid(), RibbonCell (+114 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.08
Nodes (62): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+54 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.12
Nodes (29): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, SettingsPage(), DirectoryEntry, TeamPage(), createStaffMember() (+21 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.14
Nodes (18): distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), Block, BlockMode, newBlock() (+10 more)

### Community 5 - "shadcn/ui Component Registry Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 6 - "PPC Schedule AI Import"
Cohesion: 0.09
Nodes (39): AMOUNT_HINTS, analyzeScheduleImport(), ColumnDetectSchema, ColumnMapping, COUNTRY_ALIASES, COUNTRY_HINTS, detectColumnBlocks(), detectColumnsWithAi() (+31 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "product-block.tsx"
Cohesion: 0.15
Nodes (6): PlaceholderPage(), finance, goalVsPerformance, inventory, listingScore, orders

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.06
Nodes (66): RegionPicker(), RegionTag(), addRegionsTo(), addSkus(), addSkusGrouped(), ColumnDetectSchema, ColumnMapping, deleteSku() (+58 more)

### Community 10 - "utils.ts"
Cohesion: 0.14
Nodes (24): PartnersView(), Row, withField(), cleanShortName(), createPartner(), deletePartner(), friendlyError(), listPartners() (+16 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.26
Nodes (11): POST(), POST(), toRole(), clearSessionCookie(), getSecretKey(), SessionPayload, setSessionCookie(), signSession() (+3 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.06
Nodes (32): Adding a Layer-1 group, Adding a new staff member, Adding a page to an existing group, Adding an API route, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+24 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.13
Nodes (14): adsBulkGenerator, BASE_PATHS, bulkCampaignUpload, calendar, companyInbox, defineNavItem(), masterList, NavItemInput (+6 more)

### Community 25 - "projects.ts"
Cohesion: 0.13
Nodes (29): resolveMarketplace(), budgetFor(), POST(), AD_GROUP_MEDIA, AD_MEDIA, AdsCountry, adsHeaders(), adsPost() (+21 more)

### Community 26 - "chart.tsx"
Cohesion: 0.22
Nodes (7): ChatPanel(), markdownComponents, sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool()

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.12
Nodes (30): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+22 more)

### Community 42 - "projects.ts"
Cohesion: 0.11
Nodes (31): AlertRankCell(), AsinDetail(), buildRows(), CategoryRank, Delta(), Filter, KIND_SEVERITY, rankText() (+23 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.14
Nodes (23): foldKey(), foldListeners, initials(), isActive(), memoryPins, NavGroupSection(), NavLeaf(), parseFolds() (+15 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.06
Nodes (67): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES (+59 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (65): ComposeDialogProps, CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps, RFC-5322, buildRawMessage() (+57 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.11
Nodes (28): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), MarketplaceOptions(), NewBulkPricePlanSheet(), NewPricePlanSheet() (+20 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.19
Nodes (18): BulkDimsResult, bulkUpdateTrueDims(), daysBefore(), DimsInput, DimsJson, FbaFeeOverview, getFbaFeeOverview(), getSkuFeeHistory() (+10 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.16
Nodes (21): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+13 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.09
Nodes (45): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), notesTooltip(), PRIORITY_ICONS, PriorityPill(), Scope (+37 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.13
Nodes (24): ActionResult, BrandLibraryItem, STEPS, WizardStep, AssetsSection(), BrandsSection(), COUNTRIES, DeleteConfirm() (+16 more)

### Community 51 - "server.ts"
Cohesion: 0.13
Nodes (23): IncomingCampaign, BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL (+15 more)

### Community 52 - "permissions.ts"
Cohesion: 0.07
Nodes (33): POST(), POST(), GoalVsPerformanceLayout(), DashboardPage(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout() (+25 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.16
Nodes (17): Banded, expectedFbaFee(), FeeInput, fromRows(), incremental(), IncrementalRate, priceBandOf(), RateTables (+9 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.09
Nodes (54): BrandLibrarySection(), AdsBulkGeneratorPage(), Step, CampaignProduct, createBrand(), createKeywordTheme(), createVideoAsset(), deleteBrand() (+46 more)

### Community 56 - "hash-password.ts"
Cohesion: 0.16
Nodes (15): BrandRow, IncomingCampaign, ResolveErr, ResolveOk, BaseCampaignInput, budgetFor(), buildSponsoredBrandsBulk(), CampaignInput (+7 more)

### Community 57 - "page.tsx"
Cohesion: 0.24
Nodes (4): PageHeader(), fbaFeeTracker, partners, trends

### Community 58 - "fba-fee-tracker-constants.ts"
Cohesion: 0.29
Nodes (7): FeeAlert, ALERT_CAUSES, ALERT_KIND_LABELS, ALERT_KINDS, ALERT_STATUS_LABELS, AlertCause, AlertKind

### Community 59 - "page-header.tsx"
Cohesion: 0.09
Nodes (31): CalendarSidebar(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount() (+23 more)

### Community 60 - "dashboard-access-grid.tsx"
Cohesion: 0.21
Nodes (12): AccessItem, DashboardAccessGrid(), Layout, layoutKey(), layoutListeners, memoryLayouts, parseLayout(), readLayout() (+4 more)

### Community 63 - "page.tsx"
Cohesion: 0.10
Nodes (26): MasterListPage(), matchesRegion(), PullFromAmazonSheet(), PullResult, RegionFilter, LoginForm(), Card(), CardAction() (+18 more)

### Community 67 - "layout.tsx"
Cohesion: 0.38
Nodes (4): PortalLayout(), DashboardLink(), Sidebar(), Topbar()

## Knowledge Gaps
- **290 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem` (+285 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `layout.tsx`, `PPC Schedule AI Import`, `monday.com Dashboards — Comprehensive Reference`, `utils.ts`, `projects.ts`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `skeleton.tsx`, `Sponsored Brands Bulk XLSX Builder`, `product-block.tsx`, `server.ts`, `permissions.ts`, `getStaffDirectory`, `projects.ts`, `chart.tsx`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Why does `cn()` connect `page-header.tsx` to `calendar.ts`, `layout.tsx`, `Sponsored Brands Upload - Campaign Data`, `build.ts`, `projects.ts`, `utils.ts`, `page-header.tsx`, `mail.ts`, `tabs.tsx`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `chart.tsx`, `dashboard-access-grid.tsx`, `page.tsx`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `page-header.tsx`, `mail.ts`, `PPC Schedule AI Import`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `SCOPE_CURRENCY` to the rest of the system?**
  _293 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.054540005993407255 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.07867494824016563 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.12100840336134454 - nodes in this community are weakly interconnected._