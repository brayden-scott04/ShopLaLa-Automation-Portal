# Graph Report - LaLaGreen-Automation-Portal  (2026-10-18)

## Corpus Check
- 161 files · ~115,703 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1203 nodes · 3590 edges · 71 communities (47 shown, 24 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0149f94a`
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
- product-block.tsx
- fba-fee-calculator.ts
- server.ts
- permissions.ts
- session.ts
- page.tsx
- credentials.ts
- hash-password.ts
- fba-fee-tracker-view.tsx
- projects.ts
- others.ts
- fba-fee-calculator.ts
- build.ts
- sidebar-content.tsx
- chart.tsx
- price-change-plans.ts
- segmented-control.tsx
- sales.ts
- pricing-update.ts
- pricing-update.ts
- task-form-dialog.tsx
- tools.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 112 edges
2. `getSession()` - 86 edges
3. `createServiceClient()` - 85 edges
4. `createClient()` - 71 edges
5. `Button()` - 30 edges
6. `requireStaff()` - 24 edges
7. `assertItemAccess()` - 23 edges
8. `SupabaseServerClient` - 17 edges
9. `addDays()` - 17 edges
10. `getMyPermissions()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/sales/profit-analytics/page.tsx → lib/utils.ts
- `SearchableSelect()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/tools/ads-bulk-generator/searchable-select.tsx → lib/utils.ts
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/tools/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts
- `SortTh()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/tools/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts
- `PpcTopUpLayout()` --calls--> `assertItemAccess()`  [EXTRACTED]
  app/(portal)/automations/ppc-top-up/layout.tsx → lib/permissions.ts

## Import Cycles
- None detected.

## Communities (71 total, 24 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.06
Nodes (96): DayTasksDialog(), DayView(), DeleteScopeDialog(), ManageAccessDialog(), layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS (+88 more)

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
Cohesion: 0.15
Nodes (14): GenerateForm(), padBrandAsins(), readDraft(), Block, BlockMode, newBlock(), ProductBlock(), todayIso() (+6 more)

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
Cohesion: 0.21
Nodes (19): ComposeDialog(), MODE_LABEL, SendResult, splitAddresses(), SCOPE_OPTIONS, WEEKDAY_FULL, WEEKDAY_SHORT, Button() (+11 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.40
Nodes (5): ConfigurationItem, ConfigurationItemInput, configurationItems, defineConfigurationItem(), slugify()

### Community 10 - "utils.ts"
Cohesion: 0.13
Nodes (22): addSkus(), ColumnDetectSchema, ColumnMapping, deleteSku(), detectColumnHeuristically(), detectColumnWithAi(), DetectedSkuSheet, detectStatusColumnHeuristically() (+14 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.07
Nodes (36): CalendarSidebar(), PriorityPill(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup() (+28 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.06
Nodes (33): Adding a New Project, Adding a New Sales Item, Adding a new staff member, Adding a New Tool, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+25 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.15
Nodes (25): marketplace, asNumber(), callSpApi(), callSpApiJson(), chunk(), credentialsFor(), extractFeaturedPricing(), extractOfferPrice() (+17 more)

### Community 25 - "projects.ts"
Cohesion: 0.11
Nodes (28): formatDate(), PRIORITY_ICONS, Scope, SortKey, TasksPage(), todayIso(), distributeKeywords(), shuffle() (+20 more)

### Community 26 - "chart.tsx"
Cohesion: 0.40
Nodes (5): CommunicationItem, CommunicationItemInput, communicationItems, defineCommunicationItem(), slugify()

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 42 - "sku-list.ts"
Cohesion: 0.23
Nodes (15): createGoal(), deleteGoal(), getGoalProgress(), GOAL_SCOPES, GoalProgress, isValidDate(), listGoals(), MetricSumRow (+7 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.22
Nodes (16): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, SettingsPage(), changeOwnPassword(), createStaffMember(), deleteStaffMember() (+8 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.14
Nodes (22): FeeBreakdownBody(), addInto(), emptyTotals(), FeeBreakdown, FeeBreakdownFamily, FeeBreakdownType, FeeRow, getFeeBreakdown() (+14 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (66): ComposeDialogProps, CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps, RFC-5322, buildRawMessage() (+58 more)

### Community 46 - "page.tsx"
Cohesion: 0.23
Nodes (17): POST(), DashboardPage(), PortalLayout(), deleteCalendar(), createTrackedTask(), deleteTrackedTask(), listTasks(), loadVisible() (+9 more)

### Community 47 - "getSession"
Cohesion: 0.32
Nodes (3): ChatPanel(), PageHeader(), fbaFeeTracker

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.06
Nodes (65): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+57 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.20
Nodes (13): ActionResult, BrandLibraryItem, DeleteConfirm(), LoginForm(), Card(), CardAction(), CardContent(), CardDescription() (+5 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.10
Nodes (54): BrandLibrarySection(), AdsBulkGeneratorPage(), Step, STEPS, WizardStep, AssetsSection(), BrandsSection(), COUNTRIES (+46 more)

### Community 51 - "server.ts"
Cohesion: 0.13
Nodes (24): IncomingCampaign, POST(), BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow() (+16 more)

### Community 52 - "permissions.ts"
Cohesion: 0.12
Nodes (17): PpcTopUpLayout(), PriceChangePlansLayout(), CompanyInboxLayout(), MasterListLayout(), CalendarLayout(), TasksLayout(), ProfitAnalyticsLayout(), AdsBulkGeneratorLayout() (+9 more)

### Community 53 - "session.ts"
Cohesion: 0.26
Nodes (11): POST(), POST(), toRole(), clearSessionCookie(), getSecretKey(), SessionPayload, setSessionCookie(), signSession() (+3 more)

### Community 54 - "page.tsx"
Cohesion: 0.17
Nodes (18): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), NewPricePlanSheet(), nextStepPrice() (+10 more)

### Community 57 - "fba-fee-tracker-view.tsx"
Cohesion: 0.26
Nodes (11): emptyTotals(), getSalesOverview(), num(), requireStaff(), SalesOverview, SalesRow, SalesTotals, FALLBACK_USD_RATE (+3 more)

### Community 58 - "projects.ts"
Cohesion: 0.15
Nodes (15): DirectoryEntry, TeamPage(), sendAiChatMessage(), getStaffDirectory(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool() (+7 more)

### Community 59 - "others.ts"
Cohesion: 0.33
Nodes (6): defineOtherItem(), OtherItem, OtherItemInput, othersItems, slugify(), tasks

### Community 60 - "fba-fee-calculator.ts"
Cohesion: 0.29
Nodes (9): money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES, sgtDate() (+1 more)

### Community 61 - "build.ts"
Cohesion: 0.23
Nodes (14): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+6 more)

### Community 62 - "sidebar-content.tsx"
Cohesion: 0.38
Nodes (7): SidebarContent(), Sidebar(), Topbar(), canManageUsers(), filterItems(), PermissionSet, Role

### Community 63 - "chart.tsx"
Cohesion: 0.21
Nodes (12): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION (+4 more)

### Community 64 - "price-change-plans.ts"
Cohesion: 0.29
Nodes (11): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PricePlan, PriceType, requirePlanAccess() (+3 more)

### Community 65 - "segmented-control.tsx"
Cohesion: 0.39
Nodes (6): SegmentOption, Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 66 - "sales.ts"
Cohesion: 0.33
Nodes (6): defineSalesItem(), profitAnalytics, SalesItem, SalesItemInput, salesItems, slugify()

### Community 67 - "pricing-update.ts"
Cohesion: 0.18
Nodes (10): MarketplaceOptions(), formatPrice(), SkuDetailDialog(), formatMoney(), MARKETPLACE_CODES, MARKETPLACE_IDS, marketplacesByRegion(), Region (+2 more)

### Community 68 - "pricing-update.ts"
Cohesion: 0.83
Nodes (3): fetchSkuDetail(), fetchSkuPricing(), requireStaff()

### Community 69 - "task-form-dialog.tsx"
Cohesion: 0.29
Nodes (9): TaskFormDialog(), TaskFormDialogProps, TaskFormInner(), todayLocal(), Task, TrackedTaskInput, PRIORITIES, PRIORITY_CLASSES (+1 more)

### Community 70 - "tools.ts"
Cohesion: 0.29
Nodes (7): adsBulkGenerator, AutomationTool, bulkCampaignUpload, defineTool(), slugify(), ToolInput, tools

## Knowledge Gaps
- **277 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES`, `PriceTypeOption`, `SendResult` (+272 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `page.tsx` to `calendar.ts`, `PPC Top-Up Automation`, `Auth & Staff Management`, `PPC Schedule AI Import`, `utils.ts`, `build.ts`, `sku-list.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `fba-fee-tracker.ts`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `session.ts`, `fba-fee-tracker-view.tsx`, `projects.ts`, `sidebar-content.tsx`, `price-change-plans.ts`, `pricing-update.ts`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **Why does `cn()` connect `Sponsored Brands Bulk XLSX Builder` to `calendar.ts`, `segmented-control.tsx`, `Sponsored Brands Upload - Campaign Data`, `task-form-dialog.tsx`, `product-block.tsx`, `page-header.tsx`, `mail.ts`, `getSession`, `fba-fee-tracker.ts`, `product-block.tsx`, `projects.ts`, `fba-fee-calculator.ts`, `sidebar-content.tsx`, `chart.tsx`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `fba-fee-tracker.ts`, `mail.ts`, `chart.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES` to the rest of the system?**
  _280 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06224651736907071 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.09192982456140351 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.07535460992907801 - nodes in this community are weakly interconnected._