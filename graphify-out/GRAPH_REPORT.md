# Graph Report - LaLaGreen-Automation-Portal  (2026-10-23)

## Corpus Check
- 178 files · ~123,303 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1307 nodes · 3891 edges · 59 communities (36 shown, 23 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.57)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8b38f094`
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 123 edges
2. `getSession()` - 91 edges
3. `createServiceClient()` - 90 edges
4. `createClient()` - 74 edges
5. `assertItemAccess()` - 47 edges
6. `Button()` - 32 edges
7. `requireStaff()` - 24 edges
8. `SupabaseServerClient` - 20 edges
9. `Skeleton()` - 18 edges
10. `PageHeader()` - 17 edges

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

## Communities (59 total, 23 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.05
Nodes (125): CalendarSidebar(), DayTasksDialog(), DayView(), DeleteScopeDialog(), SCOPE_OPTIONS, ManageAccessDialog(), layoutWeekRibbons(), MonthGrid() (+117 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.07
Nodes (76): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+68 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.12
Nodes (28): POST(), POST(), BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor() (+20 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.24
Nodes (16): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, SettingsPage(), createStaffMember(), deleteStaffMember(), getCurrentUser() (+8 more)

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
Cohesion: 0.06
Nodes (31): PlaceholderPage(), sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), advertisements, BASE_PATHS (+23 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.29
Nodes (10): POST(), POST(), toRole(), clearSessionCookie(), getSecretKey(), setSessionCookie(), signSession(), verifySessionToken() (+2 more)

### Community 10 - "utils.ts"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.09
Nodes (31): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+23 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.06
Nodes (30): Adding a Layer-1 group, Adding a new staff member, Adding a page to an existing group, Adding an API route, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+22 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.08
Nodes (44): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PricePlan, PriceType, requirePlanAccess() (+36 more)

### Community 25 - "projects.ts"
Cohesion: 0.18
Nodes (15): distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), Block, BlockMode, newBlock() (+7 more)

### Community 26 - "chart.tsx"
Cohesion: 0.15
Nodes (18): Option, SearchableSelect(), LoginForm(), TaskFormDialog(), TaskFormDialogProps, TaskFormInner(), todayLocal(), Button() (+10 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.14
Nodes (20): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+12 more)

### Community 42 - "projects.ts"
Cohesion: 0.11
Nodes (30): AsinDetail(), buildRows(), CategoryRank, Delta(), Filter, KIND_SEVERITY, rankText(), relativeTime() (+22 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.11
Nodes (27): DirectoryEntry, TeamPage(), foldKey(), foldListeners, initials(), isActive(), NavGroupSection(), NavLeaf() (+19 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (58): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES (+50 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (66): ComposeDialogProps, CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps, RFC-5322, buildRawMessage() (+58 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.09
Nodes (34): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), NewPricePlanSheet(), nextStepPrice() (+26 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.18
Nodes (19): BulkDimsResult, bulkUpdateTrueDims(), daysBefore(), DimsInput, DimsJson, FbaFeeOverview, getFbaFeeOverview(), getSkuFeeHistory() (+11 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.15
Nodes (22): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+14 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.11
Nodes (28): MarketplaceOptions(), PRICE_TYPES, PriceTypeOption, UPLOADABLE_COUNTRIES, UploadResponse, formatPrice(), SkuDetailDialog(), COUNTRIES (+20 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.08
Nodes (64): BrandLibrarySection(), AdsBulkGeneratorPage(), Step, formatWhen(), TaskUpdates(), createBrand(), createKeywordTheme(), createVideoAsset() (+56 more)

### Community 51 - "server.ts"
Cohesion: 0.12
Nodes (23): IncomingCampaign, BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL (+15 more)

### Community 52 - "permissions.ts"
Cohesion: 0.08
Nodes (26): GoalVsPerformanceLayout(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout(), PpcTopUpLayout(), PriceChangePlansLayout(), SponsoredBrandsUploadLayout() (+18 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.17
Nodes (16): Banded, expectedFbaFee(), FeeInput, fromRows(), incremental(), IncrementalRate, priceBandOf(), RateTables (+8 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.12
Nodes (19): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), notesTooltip(), PRIORITY_ICONS, PriorityPill(), Scope (+11 more)

### Community 56 - "hash-password.ts"
Cohesion: 0.14
Nodes (23): AD_GROUP_MEDIA, AD_MEDIA, AdsCountry, adsHeaders(), adsPost(), AdsProfile, CAMPAIGN_MEDIA, createSbAdGroup() (+15 more)

### Community 57 - "page.tsx"
Cohesion: 0.13
Nodes (19): ActionResult, BrandLibraryItem, STEPS, WizardStep, AssetsSection(), BrandsSection(), KeywordGarageSection(), Badge() (+11 more)

### Community 58 - "fba-fee-tracker-constants.ts"
Cohesion: 0.29
Nodes (7): FeeAlert, ALERT_CAUSES, ALERT_KIND_LABELS, ALERT_KINDS, ALERT_STATUS_LABELS, AlertCause, AlertKind

## Knowledge Gaps
- **275 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem` (+270 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `product-block.tsx`, `monday.com Dashboards — Comprehensive Reference`, `utils.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `skeleton.tsx`, `projects.ts`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `sp-api.ts`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `cn()` connect `Sponsored Brands Bulk XLSX Builder` to `calendar.ts`, `PPC Top-Up Automation`, `projects.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `getStaffDirectory`, `projects.ts`, `chart.tsx`, `page.tsx`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `PPC Top-Up Automation`, `mail.ts`, `skeleton.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `SCOPE_CURRENCY` to the rest of the system?**
  _278 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05277777777777778 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.07032967032967033 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.12121212121212122 - nodes in this community are weakly interconnected._