# Graph Report - LaLaGreen-Automation-Portal  (2026-10-19)

## Corpus Check
- 165 files · ~117,811 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1223 nodes · 3654 edges · 64 communities (40 shown, 24 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.59)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6a3be6c5`
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
- profit-goals.ts
- fba-fee-tracker.ts
- product-block.tsx
- fba-fee-calculator.ts
- server.ts
- permissions.ts
- communications.ts
- chart.tsx
- credentials.ts
- hash-password.ts
- page.tsx
- projects.ts
- sales-traffic.ts
- page.tsx
- getStaffDirectory
- sidebar-content.tsx
- resizable-columns.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 115 edges
2. `getSession()` - 89 edges
3. `createServiceClient()` - 88 edges
4. `createClient()` - 71 edges
5. `Button()` - 31 edges
6. `requireStaff()` - 24 edges
7. `assertItemAccess()` - 23 edges
8. `Skeleton()` - 17 edges
9. `SupabaseServerClient` - 17 edges
10. `addDays()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/tools/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts
- `SortTh()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/tools/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts
- `PpcTopUpLayout()` --calls--> `assertItemAccess()`  [EXTRACTED]
  app/(portal)/automations/ppc-top-up/layout.tsx → lib/permissions.ts
- `PriceChangePlansLayout()` --calls--> `assertItemAccess()`  [EXTRACTED]
  app/(portal)/automations/price-change-plans/layout.tsx → lib/permissions.ts
- `MarketplaceOptions()` --calls--> `marketplacesByRegion()`  [EXTRACTED]
  app/(portal)/automations/price-change-plans/page.tsx → lib/amazon/marketplaces.ts

## Import Cycles
- None detected.

## Communities (64 total, 24 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.07
Nodes (96): DayTasksDialog(), DayView(), ManageAccessDialog(), layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS, TaskCard() (+88 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.09
Nodes (63): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+55 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.08
Nodes (44): BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor(), POST(), AD_GROUP_MEDIA (+36 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.14
Nodes (16): STEPS, WizardStep, Preset, AssetsSection(), BrandsSection(), KeywordGarageSection(), CardDescription(), SegmentOption (+8 more)

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
Cohesion: 0.09
Nodes (31): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), MarketplaceOptions(), NewBulkPricePlanSheet(), NewPricePlanSheet() (+23 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.33
Nodes (6): calendar, defineOtherItem(), OtherItem, OtherItemInput, slugify(), tasks

### Community 10 - "utils.ts"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.05
Nodes (73): ComposeDialog(), MODE_LABEL, SendResult, splitAddresses(), CalendarSidebar(), DeleteScopeDialog(), SCOPE_OPTIONS, NameCalendarDialog() (+65 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.06
Nodes (33): Adding a New Project, Adding a New Sales Item, Adding a new staff member, Adding a New Tool, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+25 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.09
Nodes (39): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PriceType, requirePlanAccess(), requireStaff() (+31 more)

### Community 25 - "projects.ts"
Cohesion: 0.15
Nodes (19): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+11 more)

### Community 26 - "chart.tsx"
Cohesion: 0.10
Nodes (32): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), notesTooltip(), PRIORITY_ICONS, Scope, SortKey (+24 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.26
Nodes (11): POST(), POST(), toRole(), clearSessionCookie(), getSecretKey(), SessionPayload, setSessionCookie(), signSession() (+3 more)

### Community 42 - "projects.ts"
Cohesion: 0.21
Nodes (7): ChatPanel(), PageHeader(), AutomationTool, defineTool(), fbaFeeTracker, slugify(), ToolInput

### Community 43 - "tabs.tsx"
Cohesion: 0.19
Nodes (18): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, SettingsPage(), createStaffMember(), deleteStaffMember(), getCurrentUser() (+10 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.14
Nodes (22): FeeBreakdownBody(), addInto(), emptyTotals(), FeeBreakdown, FeeBreakdownFamily, FeeBreakdownType, FeeRow, getFeeBreakdown() (+14 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (66): ComposeDialogProps, CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps, RFC-5322, buildRawMessage() (+58 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.18
Nodes (19): addSkus(), ColumnDetectSchema, ColumnMapping, deleteSku(), detectColumnHeuristically(), detectColumnWithAi(), DetectedSkuSheet, detectStatusColumnHeuristically() (+11 more)

### Community 47 - "profit-goals.ts"
Cohesion: 0.25
Nodes (14): createGoal(), deleteGoal(), getGoalProgress(), GOAL_SCOPES, isValidDate(), listGoals(), MetricSumRow, num() (+6 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.06
Nodes (65): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+57 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.20
Nodes (13): ActionResult, BrandLibraryItem, UPLOADABLE_COUNTRIES, UploadResponse, Badge(), badgeVariants, Sheet(), SheetClose() (+5 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.08
Nodes (61): BrandLibrarySection(), AdsBulkGeneratorPage(), Step, createBrand(), createKeywordTheme(), createVideoAsset(), deleteBrand(), deleteKeywordTheme() (+53 more)

### Community 51 - "server.ts"
Cohesion: 0.13
Nodes (24): IncomingCampaign, POST(), BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow() (+16 more)

### Community 52 - "permissions.ts"
Cohesion: 0.14
Nodes (11): PpcTopUpLayout(), PriceChangePlansLayout(), CompanyInboxLayout(), MasterListLayout(), CalendarLayout(), TasksLayout(), ProfitAnalyticsLayout(), AdsBulkGeneratorLayout() (+3 more)

### Community 53 - "communications.ts"
Cohesion: 0.40
Nodes (5): ConfigurationItem, ConfigurationItemInput, defineConfigurationItem(), masterList, slugify()

### Community 54 - "chart.tsx"
Cohesion: 0.21
Nodes (12): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION (+4 more)

### Community 57 - "page.tsx"
Cohesion: 0.33
Nodes (6): LoginForm(), Card(), CardContent(), CardHeader(), CardTitle(), Skeleton()

### Community 58 - "projects.ts"
Cohesion: 0.13
Nodes (24): SidebarContent(), CommunicationItem, CommunicationItemInput, communicationItems, defineCommunicationItem(), slugify(), configurationItems, othersItems (+16 more)

### Community 59 - "sales-traffic.ts"
Cohesion: 0.26
Nodes (11): emptyTotals(), getSalesOverview(), num(), requireStaff(), SalesOverview, SalesRow, SalesTotals, FALLBACK_USD_RATE (+3 more)

### Community 60 - "page.tsx"
Cohesion: 0.26
Nodes (10): money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES, sgtDate() (+2 more)

### Community 61 - "getStaffDirectory"
Cohesion: 0.36
Nodes (7): TeamPage(), sendAiChatMessage(), getStaffDirectory(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool()

### Community 62 - "sidebar-content.tsx"
Cohesion: 0.18
Nodes (13): POST(), DashboardPage(), PortalLayout(), DirectoryEntry, Sidebar(), Topbar(), getMyPermissions(), isAllowed() (+5 more)

### Community 63 - "resizable-columns.tsx"
Cohesion: 0.60
Nodes (4): ColumnResizeHandle(), readStored(), useResizableColumns(), writeStored()

## Knowledge Gaps
- **281 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES`, `PriceTypeOption`, `SendResult` (+276 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `PPC Schedule AI Import`, `product-block.tsx`, `utils.ts`, `sp-api.ts`, `build.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `profit-goals.ts`, `fba-fee-tracker.ts`, `fba-fee-calculator.ts`, `server.ts`, `projects.ts`, `sales-traffic.ts`, `getStaffDirectory`, `sidebar-content.tsx`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `cn()` connect `Sponsored Brands Bulk XLSX Builder` to `calendar.ts`, `projects.ts`, `Sponsored Brands Upload - Campaign Data`, `product-block.tsx`, `projects.ts`, `page-header.tsx`, `mail.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `chart.tsx`, `page.tsx`, `chart.tsx`, `page.tsx`, `sidebar-content.tsx`, `resizable-columns.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `fba-fee-tracker.ts`, `mail.ts`, `chart.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES` to the rest of the system?**
  _284 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06929994709927702 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.0887719298245614 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.07535460992907801 - nodes in this community are weakly interconnected._