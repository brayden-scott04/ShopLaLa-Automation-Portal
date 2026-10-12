# Graph Report - LaLaGreen-Automation-Portal  (2026-10-11)

## Corpus Check
- 159 files · ~112,584 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1184 nodes · 3516 edges · 61 communities (36 shown, 25 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9fd39ac5`
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
- fba-fee-calculator.ts
- server.ts
- permissions.ts
- session.ts
- page.tsx
- credentials.ts
- hash-password.ts
- projects.ts
- others.ts
- price-change-plans.ts
- pricing-update.ts
- communications.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 111 edges
2. `getSession()` - 83 edges
3. `createServiceClient()` - 82 edges
4. `createClient()` - 68 edges
5. `Button()` - 29 edges
6. `requireStaff()` - 24 edges
7. `assertItemAccess()` - 23 edges
8. `getMyPermissions()` - 17 edges
9. `todaySgt()` - 17 edges
10. `Card()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/sales/profit-analytics/page.tsx → lib/utils.ts
- `SettingsPage()` --calls--> `getCurrentUser()`  [EXTRACTED]
  app/(portal)/settings/page.tsx → lib/actions/staff.ts
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/tools/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts
- `SortTh()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/tools/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts
- `TaskFormInner()` --calls--> `cn()`  [EXTRACTED]
  components/tasks/task-form-dialog.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (61 total, 25 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.08
Nodes (81): DayTasksDialog(), DayView(), layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS, NameCalendarDialog(), TaskCard() (+73 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.07
Nodes (75): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+67 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.08
Nodes (46): POST(), BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor(), POST() (+38 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.05
Nodes (88): BrandLibrarySection(), distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), AdsBulkGeneratorPage(), Step (+80 more)

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
Nodes (18): ComposeDialog(), MODE_LABEL, SendResult, splitAddresses(), WEEKDAY_SHORT, Option, Button(), buttonVariants (+10 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.33
Nodes (6): ConfigurationItem, ConfigurationItemInput, configurationItems, defineConfigurationItem(), masterList, slugify()

### Community 10 - "utils.ts"
Cohesion: 0.17
Nodes (20): addSkus(), ColumnDetectSchema, ColumnMapping, deleteSku(), detectColumnHeuristically(), detectColumnWithAi(), DetectedSkuSheet, detectStatusColumnHeuristically() (+12 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.10
Nodes (29): CalendarSidebar(), SearchableSelect(), SidebarContent(), Sidebar(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup() (+21 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.06
Nodes (32): Adding a New Project, Adding a New Sales Item, Adding a new staff member, Adding a New Tool, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+24 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.15
Nodes (26): marketplace, asNumber(), callSpApi(), callSpApiJson(), chunk(), credentialsFor(), extractFeaturedPricing(), extractOfferPrice() (+18 more)

### Community 25 - "projects.ts"
Cohesion: 0.11
Nodes (30): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+22 more)

### Community 26 - "chart.tsx"
Cohesion: 0.13
Nodes (17): DashboardPage(), PortalLayout(), Topbar(), getMyPermissions(), AutomationProject, defineProject(), ppcTopUp, priceChangePlans (+9 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 42 - "sku-list.ts"
Cohesion: 0.11
Nodes (25): SettingsPage(), ActionResult, BrandLibraryItem, COUNTRIES, DeleteConfirm(), LoginForm(), AlertDialog(), AlertDialogHeader() (+17 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.27
Nodes (14): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, createStaffMember(), deleteStaffMember(), getCurrentUser(), listStaff() (+6 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (57): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES (+49 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (65): ComposeDialogProps, CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps, RFC-5322, buildRawMessage() (+57 more)

### Community 46 - "page.tsx"
Cohesion: 0.20
Nodes (14): formatDate(), Scope, SortKey, TasksPage(), todayIso(), TaskFormDialog(), TaskFormDialogProps, TaskFormInner() (+6 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.06
Nodes (64): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+56 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.17
Nodes (9): ManageAccessDialog(), DirectoryEntry, TeamPage(), ChatPanel(), PageHeader(), Skeleton(), getStaffDirectory(), ROLE_LABELS (+1 more)

### Community 51 - "server.ts"
Cohesion: 0.13
Nodes (24): IncomingCampaign, POST(), BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow() (+16 more)

### Community 52 - "permissions.ts"
Cohesion: 0.11
Nodes (19): PpcTopUpLayout(), PriceChangePlansLayout(), CompanyInboxLayout(), MasterListLayout(), CalendarLayout(), TasksLayout(), ProfitAnalyticsLayout(), AdsBulkGeneratorLayout() (+11 more)

### Community 53 - "session.ts"
Cohesion: 0.24
Nodes (12): POST(), POST(), Role, toRole(), clearSessionCookie(), getSecretKey(), SessionPayload, setSessionCookie() (+4 more)

### Community 54 - "page.tsx"
Cohesion: 0.18
Nodes (17): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), NewPricePlanSheet(), nextStepPrice() (+9 more)

### Community 58 - "projects.ts"
Cohesion: 0.19
Nodes (12): sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), adsBulkGenerator, AutomationTool, bulkCampaignUpload (+4 more)

### Community 59 - "others.ts"
Cohesion: 0.29
Nodes (7): calendar, defineOtherItem(), OtherItem, OtherItemInput, othersItems, slugify(), tasks

### Community 64 - "price-change-plans.ts"
Cohesion: 0.29
Nodes (11): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PricePlan, PriceType, requirePlanAccess() (+3 more)

### Community 67 - "pricing-update.ts"
Cohesion: 0.15
Nodes (13): MarketplaceOptions(), formatPrice(), SkuDetailDialog(), fetchSkuDetail(), fetchSkuPricing(), requireStaff(), formatMoney(), MARKETPLACE_CODES (+5 more)

### Community 69 - "communications.ts"
Cohesion: 0.33
Nodes (6): CommunicationItem, CommunicationItemInput, communicationItems, companyInbox, defineCommunicationItem(), slugify()

## Knowledge Gaps
- **272 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES`, `PriceTypeOption`, `SendResult` (+267 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `utils.ts`, `chart.tsx`, `build.ts`, `sku-list.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `fba-fee-tracker.ts`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `session.ts`, `projects.ts`, `price-change-plans.ts`, `pricing-update.ts`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **Why does `cn()` connect `Sponsored Brands Bulk XLSX Builder` to `calendar.ts`, `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `product-block.tsx`, `sku-list.ts`, `page-header.tsx`, `mail.ts`, `page.tsx`, `getSession`, `fba-fee-tracker.ts`, `fba-fee-calculator.ts`, `projects.ts`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Sponsored Brands Upload - Campaign Data` to `calendar.ts`, `PPC Top-Up Automation`, `Auth & Staff Management`, `price-change-plans.ts`, `PPC Schedule AI Import`, `utils.ts`, `tabs.tsx`, `page-header.tsx`, `sku-list.ts`, `fba-fee-tracker.ts`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `session.ts`, `page.tsx`, `chart.tsx`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES` to the rest of the system?**
  _275 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07811753463927378 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.07081807081807082 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.07686274509803921 - nodes in this community are weakly interconnected._