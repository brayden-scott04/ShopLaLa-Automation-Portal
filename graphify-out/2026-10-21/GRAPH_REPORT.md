# Graph Report - LaLaGreen-Automation-Portal  (2026-10-21)

## Corpus Check
- 186 files · ~119,697 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1264 nodes · 3743 edges · 57 communities (33 shown, 24 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.57)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bf6688ac`
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
- credentials.ts
- hash-password.ts
- page.tsx
- sidebar-content.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 118 edges
2. `getSession()` - 89 edges
3. `createServiceClient()` - 88 edges
4. `createClient()` - 71 edges
5. `assertItemAccess()` - 45 edges
6. `Button()` - 31 edges
7. `requireStaff()` - 24 edges
8. `Skeleton()` - 17 edges
9. `SupabaseServerClient` - 17 edges
10. `addDays()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/dashboard/profit-analytics/page.tsx → lib/utils.ts
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/market-ops/automations/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts
- `SortTh()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/market-ops/automations/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts
- `PriorityPill()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/others/tasks/page.tsx → lib/utils.ts
- `TeamPage()` --calls--> `getStaffDirectory()`  [EXTRACTED]
  app/(portal)/team/page.tsx → lib/actions/staff.ts

## Import Cycles
- None detected.

## Communities (57 total, 24 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.07
Nodes (83): DayTasksDialog(), DayView(), DeleteScopeDialog(), SCOPE_OPTIONS, layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS (+75 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.07
Nodes (76): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+68 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.14
Nodes (23): AD_GROUP_MEDIA, AD_MEDIA, AdsCountry, adsHeaders(), adsPost(), AdsProfile, CAMPAIGN_MEDIA, createSbAdGroup() (+15 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.21
Nodes (18): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, SettingsPage(), createStaffMember(), deleteStaffMember(), getCurrentUser() (+10 more)

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
Cohesion: 0.05
Nodes (35): PlaceholderPage(), sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), adsBulkGenerator, advertisements (+27 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.26
Nodes (11): POST(), POST(), toRole(), clearSessionCookie(), getSecretKey(), SessionPayload, setSessionCookie(), signSession() (+3 more)

### Community 10 - "utils.ts"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.09
Nodes (33): Option, SearchableSelect(), CalendarSidebar(), NavLeaf(), Pin(), Avatar(), AvatarBadge(), AvatarFallback() (+25 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.07
Nodes (29): Adding a Layer-1 group, Adding a new staff member, Adding a page to an existing group, Adding an API route, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+21 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.06
Nodes (68): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), MarketplaceOptions(), NewBulkPricePlanSheet(), NewPricePlanSheet() (+60 more)

### Community 25 - "projects.ts"
Cohesion: 0.13
Nodes (30): BrandLibrarySection(), distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), AdsBulkGeneratorPage(), Step (+22 more)

### Community 26 - "chart.tsx"
Cohesion: 0.08
Nodes (32): Asset, Block, newBlock(), Preset, ProductBlock(), Theme, toLines(), AcknowledgedCell() (+24 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.23
Nodes (14): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+6 more)

### Community 42 - "projects.ts"
Cohesion: 0.16
Nodes (17): POST(), BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, BaseCampaignInput, budgetFor() (+9 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.16
Nodes (20): DirectoryEntry, TeamPage(), foldKey(), foldListeners, initials(), isActive(), NavGroupSection(), parseFolds() (+12 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (57): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES (+49 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (65): ComposeDialogProps, CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps, RFC-5322, buildRawMessage() (+57 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.17
Nodes (20): addSkus(), ColumnDetectSchema, ColumnMapping, deleteSku(), detectColumnHeuristically(), detectColumnWithAi(), DetectedSkuSheet, detectStatusColumnHeuristically() (+12 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.27
Nodes (4): ChatPanel(), markdownComponents, PageHeader(), Skeleton()

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.06
Nodes (65): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+57 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.15
Nodes (16): ActionResult, BrandLibraryItem, UPLOADABLE_COUNTRIES, UploadResponse, AlertDialogTitle(), Badge(), badgeVariants, CardAction() (+8 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.06
Nodes (91): ManageAccessDialog(), formatWhen(), TaskUpdates(), CampaignProduct, createBrand(), createKeywordTheme(), createVideoAsset(), deleteBrand() (+83 more)

### Community 51 - "server.ts"
Cohesion: 0.13
Nodes (24): IncomingCampaign, POST(), BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow() (+16 more)

### Community 52 - "permissions.ts"
Cohesion: 0.08
Nodes (24): GoalVsPerformanceLayout(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout(), PpcTopUpLayout(), PriceChangePlansLayout(), SponsoredBrandsUploadLayout() (+16 more)

### Community 57 - "page.tsx"
Cohesion: 0.14
Nodes (20): Block, STEPS, WizardStep, AssetsSection(), BrandsSection(), COUNTRIES, KeywordGarageSection(), LoginForm() (+12 more)

### Community 62 - "sidebar-content.tsx"
Cohesion: 0.25
Nodes (12): budgetFor(), POST(), DashboardPage(), PortalLayout(), Sidebar(), Topbar(), getProfileId(), isUploadableCountry() (+4 more)

## Knowledge Gaps
- **268 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem` (+263 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `fba-fee-calculator.ts` to `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `product-block.tsx`, `monday.com Dashboards — Comprehensive Reference`, `projects.ts`, `utils.ts`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `fba-fee-tracker.ts`, `server.ts`, `permissions.ts`, `sp-api.ts`, `projects.ts`, `sidebar-content.tsx`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Why does `cn()` connect `Sponsored Brands Bulk XLSX Builder` to `calendar.ts`, `PPC Top-Up Automation`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `skeleton.tsx`, `fba-fee-tracker.ts`, `product-block.tsx`, `sp-api.ts`, `sidebar-content.tsx`, `page.tsx`, `chart.tsx`, `projects.ts`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Why does `createClient()` connect `fba-fee-calculator.ts` to `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `monday.com Dashboards — Comprehensive Reference`, `projects.ts`, `page-header.tsx`, `buildVideoBulk.ts`, `fba-fee-tracker.ts`, `server.ts`, `permissions.ts`, `sp-api.ts`, `projects.ts`, `sidebar-content.tsx`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `SCOPE_CURRENCY` to the rest of the system?**
  _271 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06788926115323576 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.07032967032967033 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.13768115942028986 - nodes in this community are weakly interconnected._