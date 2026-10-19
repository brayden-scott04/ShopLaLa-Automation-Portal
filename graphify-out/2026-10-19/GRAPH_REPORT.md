# Graph Report - LaLaGreen-Automation-Portal  (2026-10-19)

## Corpus Check
- 184 files · ~118,646 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1264 nodes · 3740 edges · 58 communities (34 shown, 24 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.57)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `705eea47`
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
- fba-fee-tracker.ts
- product-block.tsx
- fba-fee-calculator.ts
- server.ts
- permissions.ts
- credentials.ts
- hash-password.ts
- page.tsx
- projects.ts
- getStaffDirectory
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

## Communities (58 total, 24 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.05
Nodes (123): DayTasksDialog(), DayView(), DeleteScopeDialog(), SCOPE_OPTIONS, ManageAccessDialog(), layoutWeekRibbons(), MonthGrid(), RibbonCell (+115 more)

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
Cohesion: 0.39
Nodes (6): SegmentOption, Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

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
Nodes (26): PlaceholderPage(), adsBulkGenerator, advertisements, BASE_PATHS, bulkCampaignUpload, calendar, companyInbox, defineNavItem() (+18 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.12
Nodes (34): BrandRow, distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), AdsBulkGeneratorPage(), Step (+26 more)

### Community 10 - "utils.ts"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.07
Nodes (39): Option, SearchableSelect(), CalendarSidebar(), CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps (+31 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.07
Nodes (29): Adding a Layer-1 group, Adding a new staff member, Adding a page to an existing group, Adding an API route, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+21 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.06
Nodes (67): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), MarketplaceOptions(), NewBulkPricePlanSheet(), NewPricePlanSheet() (+59 more)

### Community 25 - "projects.ts"
Cohesion: 0.23
Nodes (14): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+6 more)

### Community 26 - "chart.tsx"
Cohesion: 0.09
Nodes (42): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), notesTooltip(), PRIORITY_ICONS, PriorityPill(), Scope (+34 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.29
Nodes (10): POST(), POST(), toRole(), clearSessionCookie(), getSecretKey(), setSessionCookie(), signSession(), verifySessionToken() (+2 more)

### Community 42 - "projects.ts"
Cohesion: 0.25
Nodes (10): BaseCampaignInput, budgetFor(), buildSponsoredBrandsBulk(), CampaignInput, dedupeKeywords(), emptyRow(), HEADER, SHEET_NAME (+2 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.11
Nodes (29): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, SettingsPage(), DirectoryEntry, TeamPage(), PageHeader() (+21 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (57): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES (+49 more)

### Community 45 - "mail.ts"
Cohesion: 0.07
Nodes (58): ComposeDialogProps, RFC-5322, buildRawMessage(), cachedFetchMessages(), cachedRecentEnvelopes(), connectionErrorMessage(), CRLF, dedupeAddresses() (+50 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.17
Nodes (20): addSkus(), ColumnDetectSchema, ColumnMapping, deleteSku(), detectColumnHeuristically(), detectColumnWithAi(), DetectedSkuSheet, detectStatusColumnHeuristically() (+12 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.06
Nodes (65): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+57 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.10
Nodes (28): UPLOADABLE_COUNTRIES, UploadResponse, Asset, Block, Brand, newBlock(), Preset, ProductBlock() (+20 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.15
Nodes (33): STEPS, WizardStep, AssetsSection(), BrandsSection(), COUNTRIES, KeywordGarageSection(), CampaignProduct, createBrand() (+25 more)

### Community 51 - "server.ts"
Cohesion: 0.12
Nodes (22): BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL, SB_MAG_HEADER (+14 more)

### Community 52 - "permissions.ts"
Cohesion: 0.07
Nodes (22): GoalVsPerformanceLayout(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout(), PpcTopUpLayout(), PriceChangePlansLayout(), SponsoredBrandsUploadLayout() (+14 more)

### Community 57 - "page.tsx"
Cohesion: 0.22
Nodes (11): ActionResult, BrandLibraryItem, BrandLibrarySection(), DeleteConfirm(), Card(), CardAction(), CardContent(), CardDescription() (+3 more)

### Community 58 - "projects.ts"
Cohesion: 0.15
Nodes (20): PortalLayout(), foldKey(), foldListeners, initials(), isActive(), NavGroupSection(), NavLeaf(), parseFolds() (+12 more)

### Community 61 - "getStaffDirectory"
Cohesion: 0.36
Nodes (7): sendAiChatMessage(), getStaffDirectory(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), SUBGROUP_LABELS

### Community 62 - "sidebar-content.tsx"
Cohesion: 0.21
Nodes (16): IncomingCampaign, POST(), POST(), IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor() (+8 more)

## Knowledge Gaps
- **269 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem` (+264 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `calendar.ts` to `PPC Top-Up Automation`, `chart.tsx`, `PPC Schedule AI Import`, `monday.com Dashboards — Comprehensive Reference`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `tabs.tsx`, `fba-fee-tracker.ts`, `build.ts`, `fba-fee-calculator.ts`, `sp-api.ts`, `projects.ts`, `getStaffDirectory`, `sidebar-content.tsx`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Why does `cn()` connect `Sponsored Brands Bulk XLSX Builder` to `calendar.ts`, `PPC Top-Up Automation`, `projects.ts`, `Sponsored Brands Upload - Campaign Data`, `monday.com Dashboards — Comprehensive Reference`, `page-header.tsx`, `fba-fee-tracker.ts`, `product-block.tsx`, `page.tsx`, `chart.tsx`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Why does `createClient()` connect `calendar.ts` to `PPC Top-Up Automation`, `PPC Schedule AI Import`, `build.ts`, `monday.com Dashboards — Comprehensive Reference`, `tabs.tsx`, `page-header.tsx`, `buildVideoBulk.ts`, `fba-fee-tracker.ts`, `fba-fee-calculator.ts`, `sp-api.ts`, `getStaffDirectory`, `sidebar-content.tsx`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `SCOPE_CURRENCY` to the rest of the system?**
  _272 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.053502482073910645 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.07032967032967033 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.13768115942028986 - nodes in this community are weakly interconnected._