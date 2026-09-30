# Graph Report - LaLaGreen-Automation-Portal  (2026-09-30)

## Corpus Check
- 161 files · ~116,284 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1245 nodes · 3686 edges · 71 communities (47 shown, 24 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.54)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5695e8fe`
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
- boards.ts
- page.tsx
- credentials.ts
- hash-password.ts
- getSession
- projects.ts
- widget-card.tsx
- roles.ts
- product-block.tsx
- fba-fee-tracker-view.tsx
- dashboards-constants.ts
- price-change-plans.ts
- tools.ts
- buildSponsoredBrandsBulk.ts
- pricing-update.ts
- others.ts
- communications.ts
- configuration.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 107 edges
2. `createServiceClient()` - 93 edges
3. `createClient()` - 82 edges
4. `getSession()` - 79 edges
5. `Button()` - 34 edges
6. `assertItemAccess()` - 25 edges
7. `requireStaff()` - 24 edges
8. `Card()` - 19 edges
9. `CardContent()` - 19 edges
10. `Skeleton()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `SearchableSelect()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/tools/ads-bulk-generator/searchable-select.tsx → lib/utils.ts
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/tools/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts
- `SortTh()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/tools/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts
- `SheetOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/sheet.tsx → lib/utils.ts
- `PpcTopUpLayout()` --calls--> `assertItemAccess()`  [EXTRACTED]
  app/(portal)/automations/ppc-top-up/layout.tsx → lib/permissions.ts

## Import Cycles
- None detected.

## Communities (71 total, 24 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.08
Nodes (55): CalendarSidebar(), DayTasksDialog(), ManageAccessDialog(), layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS, NameCalendarDialog() (+47 more)

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
Cohesion: 0.10
Nodes (55): BrandRow, AdsBulkGeneratorPage(), Step, STEPS, WizardStep, AssetsSection(), BrandsSection(), COUNTRIES (+47 more)

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
Cohesion: 0.30
Nodes (15): MODE_LABEL, SendResult, WidgetDialog(), Button(), buttonVariants, Dialog(), DialogBody(), DialogClose() (+7 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.06
Nodes (35): 10. mondayDB 2.0 (Enterprise Only), 11. Common Troubleshooting, 12. Key Constraints Summary, 1. What are Dashboards?, 2. What Data Can a Dashboard Show?, 3. Plan Limits, 4. Creating a Dashboard, 5. Dashboard Types (Visibility) (+27 more)

### Community 10 - "utils.ts"
Cohesion: 0.14
Nodes (21): addSkus(), ColumnDetectSchema, ColumnMapping, deleteSku(), detectColumnHeuristically(), detectColumnWithAi(), DetectedSkuSheet, detectStatusColumnHeuristically() (+13 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.11
Nodes (25): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+17 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.06
Nodes (31): Adding a New Project, Adding a New Sales Item, Adding a new staff member, Adding a New Tool, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+23 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.12
Nodes (29): marketplace, MARKETPLACE_CODES, MARKETPLACE_IDS, Region, REGION_HOSTS, REGION_LABELS, asNumber(), callSpApi() (+21 more)

### Community 25 - "projects.ts"
Cohesion: 0.23
Nodes (14): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+6 more)

### Community 26 - "chart.tsx"
Cohesion: 0.29
Nodes (10): POST(), POST(), toRole(), clearSessionCookie(), getSecretKey(), setSessionCookie(), signSession(), verifySessionToken() (+2 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 42 - "sku-list.ts"
Cohesion: 0.17
Nodes (13): ActionResult, BrandLibraryItem, BrandLibrarySection(), DeleteConfirm(), Topbar(), Sheet(), SheetClose(), SheetContent() (+5 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.11
Nodes (23): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, SettingsPage(), createStaffMember(), deleteStaffMember(), getCurrentUser() (+15 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (45): money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPES, sgtDate(), addInto() (+37 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (67): ComposeDialog(), ComposeDialogProps, splitAddresses(), CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps (+59 more)

### Community 46 - "page.tsx"
Cohesion: 0.15
Nodes (17): SCOPE_CURRENCY, DirectoryEntry, ChatPanel(), markdownComponents, PageHeader(), Card(), CardAction(), CardContent() (+9 more)

### Community 47 - "getSession"
Cohesion: 0.11
Nodes (30): distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), newBlock(), UPLOADABLE_COUNTRIES, UploadResponse (+22 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.11
Nodes (31): Row, BulkDimsResult, bulkUpdateTrueDims(), daysBefore(), DimsInput, DimsJson, FbaFeeOverview, FeeAlert (+23 more)

### Community 49 - "createClient"
Cohesion: 0.13
Nodes (31): DashboardsPage(), BoardItem, createItem(), aggregateNumbers(), BoardItemWithValues, computeChartGroups(), computeChartResult(), computeNumberResult() (+23 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.11
Nodes (28): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), money(), num(), pct(), relativeTime() (+20 more)

### Community 51 - "server.ts"
Cohesion: 0.12
Nodes (23): IncomingCampaign, BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL (+15 more)

### Community 52 - "permissions.ts"
Cohesion: 0.14
Nodes (14): PpcTopUpLayout(), PriceChangePlansLayout(), CompanyInboxLayout(), MasterListLayout(), BoardsLayout(), CalendarLayout(), DashboardsLayout(), ProfitAnalyticsLayout() (+6 more)

### Community 53 - "boards.ts"
Cohesion: 0.16
Nodes (23): BoardDetailPage(), BoardsPage(), DashboardDetailPage(), BoardDetail, countByBoard(), createBoard(), createColumn(), deleteBoard() (+15 more)

### Community 54 - "page.tsx"
Cohesion: 0.16
Nodes (18): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), NewPricePlanSheet(), nextStepPrice() (+10 more)

### Community 57 - "getSession"
Cohesion: 0.23
Nodes (17): POST(), POST(), IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor(), POST() (+9 more)

### Community 58 - "projects.ts"
Cohesion: 0.17
Nodes (14): TeamPage(), sendAiChatMessage(), getStaffDirectory(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), AutomationProject (+6 more)

### Community 59 - "widget-card.tsx"
Cohesion: 0.14
Nodes (12): StatusBadge(), CHART_CONFIG, WidgetCard(), BoardColumn, StatusOption, ChartWidgetResult, NumberWidgetResult, TableWidgetResult (+4 more)

### Community 60 - "roles.ts"
Cohesion: 0.22
Nodes (11): SidebarContent(), Sidebar(), Separator(), changeOwnPassword(), canManageUsers(), filterItems(), PermissionSet, Role (+3 more)

### Community 61 - "product-block.tsx"
Cohesion: 0.21
Nodes (9): Block, BlockMode, ProductBlock(), todayIso(), toLines(), Option, SearchableSelect(), LoginForm() (+1 more)

### Community 62 - "fba-fee-tracker-view.tsx"
Cohesion: 0.20
Nodes (10): Filter, SortKey, SortTh(), StatTile(), SegmentOption, Tabs(), TabsContent(), TabsList() (+2 more)

### Community 63 - "dashboards-constants.ts"
Cohesion: 0.17
Nodes (12): DashboardWidget, DashboardWidgetResult, validateWidgetConfig(), Aggregation, AGGREGATION_LABELS, AGGREGATIONS, CHART_COLORS, CHART_TYPE_LABELS (+4 more)

### Community 64 - "price-change-plans.ts"
Cohesion: 0.29
Nodes (11): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PricePlan, PriceType, requirePlanAccess() (+3 more)

### Community 65 - "tools.ts"
Cohesion: 0.24
Nodes (7): adsBulkGenerator, AutomationTool, bulkCampaignUpload, defineTool(), fbaFeeTracker, slugify(), ToolInput

### Community 66 - "buildSponsoredBrandsBulk.ts"
Cohesion: 0.29
Nodes (9): BaseCampaignInput, budgetFor(), buildSponsoredBrandsBulk(), dedupeKeywords(), emptyRow(), HEADER, SHEET_NAME, toAmazonDate() (+1 more)

### Community 67 - "pricing-update.ts"
Cohesion: 0.28
Nodes (8): MarketplaceOptions(), formatPrice(), SkuDetailDialog(), fetchSkuDetail(), fetchSkuPricing(), requireStaff(), formatMoney(), marketplacesByRegion()

### Community 68 - "others.ts"
Cohesion: 0.29
Nodes (7): boards, calendar, defineOtherItem(), OtherItem, OtherItemInput, othersItems, slugify()

### Community 69 - "communications.ts"
Cohesion: 0.33
Nodes (6): CommunicationItem, CommunicationItemInput, communicationItems, companyInbox, defineCommunicationItem(), slugify()

### Community 70 - "configuration.ts"
Cohesion: 0.33
Nodes (6): ConfigurationItem, ConfigurationItemInput, configurationItems, defineConfigurationItem(), masterList, slugify()

## Knowledge Gaps
- **292 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES`, `PriceTypeOption`, `SendResult` (+287 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `getSession` to `calendar.ts`, `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `utils.ts`, `chart.tsx`, `build.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `fba-fee-tracker.ts`, `createClient`, `server.ts`, `permissions.ts`, `boards.ts`, `projects.ts`, `roles.ts`, `price-change-plans.ts`, `pricing-update.ts`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Why does `createClient()` connect `createClient` to `calendar.ts`, `PPC Top-Up Automation`, `price-change-plans.ts`, `Sponsored Brands Upload - Campaign Data`, `projects.ts`, `PPC Schedule AI Import`, `utils.ts`, `tabs.tsx`, `page-header.tsx`, `fba-fee-tracker.ts`, `server.ts`, `permissions.ts`, `boards.ts`, `getSession`, `chart.tsx`, `roles.ts`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `cn()` connect `Sponsored Brands Bulk XLSX Builder` to `calendar.ts`, `PPC Top-Up Automation`, `product-block.tsx`, `sku-list.ts`, `page-header.tsx`, `mail.ts`, `page.tsx`, `getSession`, `fba-fee-calculator.ts`, `widget-card.tsx`, `roles.ts`, `product-block.tsx`, `fba-fee-tracker-view.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES` to the rest of the system?**
  _295 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0825136612021858 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.07032967032967033 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.13768115942028986 - nodes in this community are weakly interconnected._