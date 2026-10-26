# Graph Report - LaLaGreen-Automation-Portal  (2026-10-26)

## Corpus Check
- 185 files · ~132,354 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1395 nodes · 4157 edges · 65 communities (42 shown, 23 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `64cd3a9c`
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
- dashboard-access-grid.tsx
- library-sections.tsx
- page.tsx
- session.ts
- utils.ts
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
- `MarketplaceOptions()` --calls--> `marketplacesByRegion()`  [EXTRACTED]
  app/(portal)/market-ops/automations/price-change-plans/page.tsx → lib/amazon/marketplaces.ts

## Import Cycles
- None detected.

## Communities (65 total, 23 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.06
Nodes (108): CalendarSidebar(), DayTasksDialog(), DayView(), DeleteScopeDialog(), ManageAccessDialog(), layoutWeekRibbons(), MonthGrid(), RibbonCell (+100 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.06
Nodes (91): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+83 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.15
Nodes (22): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, SettingsPage(), DirectoryEntry, TeamPage(), Skeleton() (+14 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.20
Nodes (20): SCOPE_OPTIONS, ComposeDialog(), MODE_LABEL, SendResult, splitAddresses(), TaskFormInner(), todayLocal(), formatWhen() (+12 more)

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
Cohesion: 0.05
Nodes (31): PageHeader(), PlaceholderPage(), sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), adsBulkGenerator (+23 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.14
Nodes (31): RegionPicker(), RegionTag(), addRegionsTo(), addSkus(), addSkusGrouped(), ColumnDetectSchema, ColumnMapping, deleteSku() (+23 more)

### Community 10 - "utils.ts"
Cohesion: 0.14
Nodes (24): PartnersView(), Row, withField(), cleanShortName(), createPartner(), deletePartner(), friendlyError(), listPartners() (+16 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.40
Nodes (5): AccessItem, NavGroup, NavItem, NavItemInput, Section

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.06
Nodes (32): Adding a Layer-1 group, Adding a new staff member, Adding a page to an existing group, Adding an API route, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+24 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.12
Nodes (30): fetchSkuDetail(), fetchSkuPricing(), requireStaff(), marketplace, asNumber(), callSpApi(), callSpApiJson(), chunk() (+22 more)

### Community 25 - "projects.ts"
Cohesion: 0.14
Nodes (23): AD_GROUP_MEDIA, AD_MEDIA, AdsCountry, adsHeaders(), adsPost(), AdsProfile, CAMPAIGN_MEDIA, createSbAdGroup() (+15 more)

### Community 26 - "chart.tsx"
Cohesion: 0.10
Nodes (27): ChatPanel(), markdownComponents, AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup() (+19 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.29
Nodes (11): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PricePlan, PriceType, requirePlanAccess() (+3 more)

### Community 42 - "projects.ts"
Cohesion: 0.11
Nodes (31): AlertRankCell(), AsinDetail(), buildRows(), CategoryRank, Delta(), Filter, KIND_SEVERITY, rankText() (+23 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.13
Nodes (26): DashboardPage(), foldKey(), foldListeners, initials(), isActive(), memoryPins, NavGroupSection(), NavLeaf() (+18 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.09
Nodes (43): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES (+35 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (66): ComposeDialogProps, CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps, RFC-5322, buildRawMessage() (+58 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.17
Nodes (17): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), MarketplaceOptions(), NewBulkPricePlanSheet(), NewPricePlanSheet() (+9 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.19
Nodes (18): BulkDimsResult, bulkUpdateTrueDims(), daysBefore(), DimsInput, DimsJson, FbaFeeOverview, getFbaFeeOverview(), getSkuFeeHistory() (+10 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.16
Nodes (21): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+13 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.11
Nodes (35): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+27 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.06
Nodes (74): BrandRow, distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), AdsBulkGeneratorPage(), Step (+66 more)

### Community 51 - "server.ts"
Cohesion: 0.13
Nodes (24): IncomingCampaign, POST(), BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow() (+16 more)

### Community 52 - "permissions.ts"
Cohesion: 0.07
Nodes (30): GoalVsPerformanceLayout(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout(), PpcTopUpLayout(), PriceChangePlansLayout(), SponsoredBrandsUploadLayout() (+22 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.16
Nodes (17): Banded, expectedFbaFee(), FeeInput, fromRows(), incremental(), IncrementalRate, priceBandOf(), RateTables (+9 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.09
Nodes (40): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), notesTooltip(), PRIORITY_ICONS, PriorityPill(), Scope (+32 more)

### Community 56 - "hash-password.ts"
Cohesion: 0.15
Nodes (21): POST(), IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor(), POST(), getProfileId() (+13 more)

### Community 57 - "page.tsx"
Cohesion: 0.47
Nodes (4): InsertionPlan, naturalCompare(), planInsertions(), skuPrefix()

### Community 58 - "fba-fee-tracker-constants.ts"
Cohesion: 0.29
Nodes (7): FeeAlert, ALERT_CAUSES, ALERT_KIND_LABELS, ALERT_KINDS, ALERT_STATUS_LABELS, AlertCause, AlertKind

### Community 60 - "dashboard-access-grid.tsx"
Cohesion: 0.23
Nodes (11): DashboardAccessGrid(), Layout, layoutKey(), layoutListeners, memoryLayouts, parseLayout(), readLayout(), SortableTile() (+3 more)

### Community 62 - "library-sections.tsx"
Cohesion: 0.12
Nodes (20): ActionResult, BrandLibraryItem, BrandLibrarySection(), DeleteConfirm(), LoginForm(), Card(), CardAction(), CardContent() (+12 more)

### Community 63 - "page.tsx"
Cohesion: 0.11
Nodes (21): formatPrice(), MasterListPage(), matchesRegion(), PullFromAmazonSheet(), PullResult, RegionFilter, SkuDetailDialog(), ExistingAmazonSku (+13 more)

### Community 64 - "session.ts"
Cohesion: 0.26
Nodes (11): POST(), POST(), toRole(), clearSessionCookie(), getSecretKey(), SessionPayload, setSessionCookie(), signSession() (+3 more)

### Community 65 - "utils.ts"
Cohesion: 0.50
Nodes (3): Option, SearchableSelect(), Input()

### Community 67 - "layout.tsx"
Cohesion: 0.38
Nodes (5): PortalLayout(), DashboardLink(), Sidebar(), Topbar(), getMyPermissions()

## Knowledge Gaps
- **290 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem` (+285 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `PPC Schedule AI Import`, `product-block.tsx`, `monday.com Dashboards — Comprehensive Reference`, `utils.ts`, `sp-api.ts`, `build.ts`, `projects.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `skeleton.tsx`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `getStaffDirectory`, `hash-password.ts`, `session.ts`, `layout.tsx`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Why does `cn()` connect `chart.tsx` to `calendar.ts`, `utils.ts`, `PPC Top-Up Automation`, `layout.tsx`, `Sponsored Brands Upload - Campaign Data`, `Auth & Staff Management`, `projects.ts`, `utils.ts`, `page-header.tsx`, `mail.ts`, `tabs.tsx`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `permissions.ts`, `getStaffDirectory`, `dashboard-access-grid.tsx`, `library-sections.tsx`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `PPC Top-Up Automation`, `mail.ts`, `PPC Schedule AI Import`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `SCOPE_CURRENCY` to the rest of the system?**
  _293 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06008403361344538 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.05878355419639823 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._