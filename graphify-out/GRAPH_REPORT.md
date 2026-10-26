# Graph Report - LaLaGreen-Automation-Portal  (2026-10-26)

## Corpus Check
- 184 files · ~130,666 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1381 nodes · 4101 edges · 70 communities (44 shown, 26 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `65eb5d87`
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
- page.tsx
- dashboard-access-grid.tsx
- page.tsx
- library-sections.tsx
- page.tsx
- session.ts
- utils.ts
- page.tsx
- layout.tsx
- page.tsx
- page.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 131 edges
2. `createServiceClient()` - 98 edges
3. `getSession()` - 93 edges
4. `createClient()` - 76 edges
5. `assertItemAccess()` - 47 edges
6. `Button()` - 32 edges
7. `requireStaff()` - 24 edges
8. `SupabaseServerClient` - 20 edges
9. `Skeleton()` - 19 edges
10. `getMyPermissions()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `SearchableSelect()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/market-ops/automations/ads-bulk-generator/searchable-select.tsx → lib/utils.ts
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

## Communities (70 total, 26 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.10
Nodes (56): DayView(), DeleteScopeDialog(), layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS, NameCalendarDialog(), TaskCard() (+48 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.07
Nodes (76): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+68 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.16
Nodes (22): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, SettingsPage(), createStaffMember(), deleteStaffMember(), getCurrentUser() (+14 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.21
Nodes (20): DayTasksDialog(), SCOPE_OPTIONS, WEEKDAY_FULL, WEEKDAY_SHORT, ComposeDialog(), MODE_LABEL, SendResult, splitAddresses() (+12 more)

### Community 5 - "shadcn/ui Component Registry Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 6 - "PPC Schedule AI Import"
Cohesion: 0.18
Nodes (21): AMOUNT_HINTS, analyzeScheduleImport(), ColumnDetectSchema, ColumnMapping, COUNTRY_ALIASES, COUNTRY_HINTS, detectColumnBlocks(), detectColumnsWithAi() (+13 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "product-block.tsx"
Cohesion: 0.15
Nodes (6): PlaceholderPage(), goalVsPerformance, listingScore, products, shipments, supplyChainAutomations

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 10 - "utils.ts"
Cohesion: 0.14
Nodes (24): PartnersView(), Row, withField(), cleanShortName(), createPartner(), deletePartner(), friendlyError(), listPartners() (+16 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.15
Nodes (12): advertisements, BASE_PATHS, bulkCampaignUpload, defineNavItem(), masterList, NavGroup, NavItemInput, orders (+4 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.06
Nodes (32): Adding a Layer-1 group, Adding a new staff member, Adding a page to an existing group, Adding an API route, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+24 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.05
Nodes (69): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PriceType, requirePlanAccess(), requireStaff() (+61 more)

### Community 26 - "chart.tsx"
Cohesion: 0.10
Nodes (27): StatTile(), CalendarSidebar(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup() (+19 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.23
Nodes (14): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+6 more)

### Community 42 - "projects.ts"
Cohesion: 0.11
Nodes (31): AlertRankCell(), AsinDetail(), buildRows(), CategoryRank, Delta(), Filter, KIND_SEVERITY, rankText() (+23 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.11
Nodes (27): foldKey(), foldListeners, initials(), isActive(), memoryPins, NavGroupSection(), NavLeaf(), parseFolds() (+19 more)

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
Cohesion: 0.09
Nodes (32): distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), Block, BlockMode, newBlock() (+24 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.06
Nodes (93): formatWhen(), TaskUpdates(), CampaignProduct, createBrand(), createKeywordTheme(), createVideoAsset(), deleteBrand(), deleteKeywordTheme() (+85 more)

### Community 51 - "server.ts"
Cohesion: 0.13
Nodes (23): IncomingCampaign, BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL (+15 more)

### Community 52 - "permissions.ts"
Cohesion: 0.07
Nodes (30): POST(), GoalVsPerformanceLayout(), DashboardPage(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout(), PpcTopUpLayout() (+22 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.16
Nodes (17): Banded, expectedFbaFee(), FeeInput, fromRows(), incremental(), IncrementalRate, priceBandOf(), RateTables (+9 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.11
Nodes (27): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), notesTooltip(), PRIORITY_ICONS, PriorityPill(), Scope (+19 more)

### Community 56 - "hash-password.ts"
Cohesion: 0.08
Nodes (45): POST(), BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor(), POST() (+37 more)

### Community 57 - "page.tsx"
Cohesion: 0.21
Nodes (11): ManageAccessDialog(), DirectoryEntry, TeamPage(), sendAiChatMessage(), getStaffDirectory(), ChatMessage, generateAssistantReply(), chatToolDefinitions (+3 more)

### Community 58 - "fba-fee-tracker-constants.ts"
Cohesion: 0.28
Nodes (8): FeeAlert, ALERT_CAUSES, ALERT_KIND_LABELS, ALERT_KINDS, ALERT_STATUS_LABELS, AlertCause, AlertKind, AlertStatus

### Community 59 - "page.tsx"
Cohesion: 0.20
Nodes (11): STEPS, WizardStep, AssetsSection(), BrandsSection(), KeywordGarageSection(), Card(), CardContent(), CardDescription() (+3 more)

### Community 60 - "dashboard-access-grid.tsx"
Cohesion: 0.20
Nodes (13): AccessItem, DashboardAccessGrid(), Layout, layoutKey(), layoutListeners, memoryLayouts, parseLayout(), readLayout() (+5 more)

### Community 61 - "page.tsx"
Cohesion: 0.19
Nodes (21): BrandLibrarySection(), AdsBulkGeneratorPage(), Step, KeywordTheme, VideoAsset, BrandLogo, createBrandLogo(), createStoreUrl() (+13 more)

### Community 62 - "library-sections.tsx"
Cohesion: 0.21
Nodes (14): ActionResult, BrandLibraryItem, COUNTRIES, DeleteConfirm(), Badge(), badgeVariants, CardAction(), Sheet() (+6 more)

### Community 63 - "page.tsx"
Cohesion: 0.15
Nodes (14): MarketplaceOptions(), formatPrice(), PullFromAmazonSheet(), PullResult, SkuDetailDialog(), PricePlan, fetchSkuDetail(), fetchSkuPricing() (+6 more)

### Community 64 - "session.ts"
Cohesion: 0.26
Nodes (11): POST(), POST(), toRole(), clearSessionCookie(), getSecretKey(), SessionPayload, setSessionCookie(), signSession() (+3 more)

### Community 65 - "utils.ts"
Cohesion: 0.31
Nodes (5): Option, SearchableSelect(), LoginForm(), Input(), Label()

### Community 66 - "page.tsx"
Cohesion: 0.19
Nodes (5): ChatPanel(), PageHeader(), fbaFeeTracker, partners, trends

### Community 67 - "layout.tsx"
Cohesion: 0.40
Nodes (4): PortalLayout(), DashboardLink(), Sidebar(), Topbar()

## Knowledge Gaps
- **289 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem` (+284 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `fba-fee-calculator.ts` to `calendar.ts`, `PPC Top-Up Automation`, `Auth & Staff Management`, `PPC Schedule AI Import`, `monday.com Dashboards — Comprehensive Reference`, `utils.ts`, `sp-api.ts`, `projects.ts`, `page-header.tsx`, `mail.ts`, `skeleton.tsx`, `server.ts`, `permissions.ts`, `hash-password.ts`, `page.tsx`, `page.tsx`, `page.tsx`, `session.ts`, `layout.tsx`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Why does `cn()` connect `chart.tsx` to `calendar.ts`, `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `utils.ts`, `projects.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `getStaffDirectory`, `page.tsx`, `dashboard-access-grid.tsx`, `page.tsx`, `library-sections.tsx`, `utils.ts`, `page.tsx`, `layout.tsx`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `createClient()` connect `fba-fee-calculator.ts` to `session.ts`, `PPC Top-Up Automation`, `Auth & Staff Management`, `PPC Schedule AI Import`, `utils.ts`, `projects.ts`, `page-header.tsx`, `buildVideoBulk.ts`, `skeleton.tsx`, `server.ts`, `permissions.ts`, `hash-password.ts`, `sp-api.ts`, `page.tsx`, `page.tsx`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `SCOPE_CURRENCY` to the rest of the system?**
  _292 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09883449883449884 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.06975633062589584 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._