# Graph Report - LaLaGreen-Automation-Portal  (2026-10-09)

## Corpus Check
- 158 files · ~110,070 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1172 nodes · 3486 edges · 66 communities (42 shown, 24 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `19911744`
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
- sku-list.ts
- tabs.tsx
- page-header.tsx
- mail.ts
- page.tsx
- getSession
- fba-fee-tracker.ts
- createClient
- fba-fee-calculator.ts
- server.ts
- permissions.ts
- session.ts
- page.tsx
- credentials.ts
- hash-password.ts
- getSession
- projects.ts
- others.ts
- pricing-update.ts
- segmented-control.tsx
- price-change-plans.ts
- buildSponsoredBrandsBulk.ts
- pricing-update.ts
- communications.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 109 edges
2. `getSession()` - 83 edges
3. `createServiceClient()` - 82 edges
4. `createClient()` - 67 edges
5. `Button()` - 29 edges
6. `requireStaff()` - 24 edges
7. `assertItemAccess()` - 23 edges
8. `getMyPermissions()` - 17 edges
9. `todaySgt()` - 17 edges
10. `Card()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `SearchableSelect()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/tools/ads-bulk-generator/searchable-select.tsx → lib/utils.ts
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/tools/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts
- `SortTh()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/tools/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts
- `TaskFormInner()` --calls--> `cn()`  [EXTRACTED]
  components/tasks/task-form-dialog.tsx → lib/utils.ts
- `SheetOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/sheet.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (66 total, 24 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.08
Nodes (80): CalendarSidebar(), DayTasksDialog(), DayView(), layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS, NameCalendarDialog() (+72 more)

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
Cohesion: 0.05
Nodes (93): ActionResult, BrandLibraryItem, BrandLibrarySection(), distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle() (+85 more)

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
Cohesion: 0.23
Nodes (17): ComposeDialog(), MODE_LABEL, SendResult, splitAddresses(), WEEKDAY_SHORT, Button(), buttonVariants, Dialog() (+9 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.16
Nodes (17): Banded, expectedFbaFee(), FeeInput, fromRows(), incremental(), IncrementalRate, priceBandOf(), RateTables (+9 more)

### Community 10 - "utils.ts"
Cohesion: 0.13
Nodes (22): addSkus(), ColumnDetectSchema, ColumnMapping, deleteSku(), detectColumnHeuristically(), detectColumnWithAi(), DetectedSkuSheet, detectStatusColumnHeuristically() (+14 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.11
Nodes (26): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+18 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.06
Nodes (32): Adding a New Project, Adding a New Sales Item, Adding a new staff member, Adding a New Tool, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+24 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.15
Nodes (25): marketplace, asNumber(), callSpApi(), callSpApiJson(), chunk(), credentialsFor(), extractFeaturedPricing(), extractOfferPrice() (+17 more)

### Community 25 - "projects.ts"
Cohesion: 0.13
Nodes (25): formatDate(), Scope, SortKey, TasksPage(), todayIso(), UPLOADABLE_COUNTRIES, UploadResponse, Asset (+17 more)

### Community 26 - "chart.tsx"
Cohesion: 0.40
Nodes (5): defineSalesItem(), SalesItem, SalesItemInput, salesItems, slugify()

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 42 - "sku-list.ts"
Cohesion: 0.14
Nodes (20): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+12 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.17
Nodes (19): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, ManageAccessDialog(), SettingsPage(), DirectoryEntry, TeamPage() (+11 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.08
Nodes (47): money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES, sgtDate() (+39 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (66): ComposeDialogProps, CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps, RFC-5322, buildRawMessage() (+58 more)

### Community 46 - "page.tsx"
Cohesion: 0.15
Nodes (14): Option, SearchableSelect(), ChatPanel(), markdownComponents, TaskFormDialog(), TaskFormDialogProps, TaskFormInner(), Input() (+6 more)

### Community 47 - "getSession"
Cohesion: 0.26
Nodes (13): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+5 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.11
Nodes (30): Row, BulkDimsResult, bulkUpdateTrueDims(), daysBefore(), DimsInput, DimsJson, FbaFeeOverview, FeeAlert (+22 more)

### Community 49 - "createClient"
Cohesion: 0.25
Nodes (10): BaseCampaignInput, budgetFor(), buildSponsoredBrandsBulk(), CampaignInput, dedupeKeywords(), emptyRow(), HEADER, SHEET_NAME (+2 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.19
Nodes (8): PageHeader(), adsBulkGenerator, AutomationTool, bulkCampaignUpload, defineTool(), fbaFeeTracker, slugify(), ToolInput

### Community 51 - "server.ts"
Cohesion: 0.12
Nodes (22): BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL, SB_MAG_HEADER (+14 more)

### Community 52 - "permissions.ts"
Cohesion: 0.13
Nodes (16): PpcTopUpLayout(), PriceChangePlansLayout(), CompanyInboxLayout(), MasterListLayout(), CalendarLayout(), TasksLayout(), ProfitAnalyticsLayout(), AdsBulkGeneratorLayout() (+8 more)

### Community 53 - "session.ts"
Cohesion: 0.26
Nodes (11): POST(), POST(), toRole(), clearSessionCookie(), getSecretKey(), SessionPayload, setSessionCookie(), signSession() (+3 more)

### Community 54 - "page.tsx"
Cohesion: 0.18
Nodes (17): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), NewPricePlanSheet(), nextStepPrice() (+9 more)

### Community 57 - "getSession"
Cohesion: 0.30
Nodes (9): SidebarContent(), Sidebar(), Topbar(), canManageUsers(), filterItems(), PermissionSet, Role, ROLES (+1 more)

### Community 58 - "projects.ts"
Cohesion: 0.18
Nodes (13): sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), AutomationProject, defineProject(), ppcTopUp (+5 more)

### Community 59 - "others.ts"
Cohesion: 0.29
Nodes (7): calendar, defineOtherItem(), OtherItem, OtherItemInput, othersItems, slugify(), tasks

### Community 60 - "pricing-update.ts"
Cohesion: 0.83
Nodes (3): fetchSkuDetail(), fetchSkuPricing(), requireStaff()

### Community 61 - "segmented-control.tsx"
Cohesion: 0.39
Nodes (6): SegmentOption, Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 64 - "price-change-plans.ts"
Cohesion: 0.29
Nodes (11): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PricePlan, PriceType, requirePlanAccess() (+3 more)

### Community 66 - "buildSponsoredBrandsBulk.ts"
Cohesion: 0.17
Nodes (25): IncomingCampaign, POST(), POST(), BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk (+17 more)

### Community 67 - "pricing-update.ts"
Cohesion: 0.18
Nodes (10): MarketplaceOptions(), formatPrice(), SkuDetailDialog(), formatMoney(), MARKETPLACE_CODES, MARKETPLACE_IDS, marketplacesByRegion(), Region (+2 more)

### Community 69 - "communications.ts"
Cohesion: 0.18
Nodes (10): CommunicationItem, CommunicationItemInput, communicationItems, defineCommunicationItem(), slugify(), ConfigurationItem, ConfigurationItemInput, configurationItems (+2 more)

## Knowledge Gaps
- **268 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES`, `PriceTypeOption`, `SendResult` (+263 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `buildSponsoredBrandsBulk.ts` to `calendar.ts`, `PPC Top-Up Automation`, `price-change-plans.ts`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `build.ts`, `utils.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `fba-fee-tracker.ts`, `permissions.ts`, `session.ts`, `getSession`, `projects.ts`, `pricing-update.ts`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Why does `cn()` connect `Sponsored Brands Bulk XLSX Builder` to `calendar.ts`, `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `product-block.tsx`, `sku-list.ts`, `page-header.tsx`, `mail.ts`, `page.tsx`, `projects.ts`, `segmented-control.tsx`, `getSession`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `createClient()` connect `buildSponsoredBrandsBulk.ts` to `calendar.ts`, `PPC Top-Up Automation`, `price-change-plans.ts`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `sku-list.ts`, `utils.ts`, `page-header.tsx`, `tabs.tsx`, `fba-fee-tracker.ts`, `permissions.ts`, `session.ts`, `page.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES` to the rest of the system?**
  _271 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0761904761904762 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.07008547008547009 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.13768115942028986 - nodes in this community are weakly interconnected._