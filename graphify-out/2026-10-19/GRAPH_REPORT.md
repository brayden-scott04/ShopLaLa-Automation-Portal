# Graph Report - LaLaGreen-Automation-Portal  (2026-10-19)

## Corpus Check
- 163 files · ~116,434 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1211 nodes · 3622 edges · 60 communities (36 shown, 24 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8f168757`
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
- fba-fee-tracker.ts
- product-block.tsx
- fba-fee-calculator.ts
- server.ts
- permissions.ts
- page.tsx
- credentials.ts
- hash-password.ts
- projects.ts
- others.ts
- sidebar-content.tsx
- price-change-plans.ts
- pricing-update.ts
- pricing-update.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 112 edges
2. `getSession()` - 88 edges
3. `createServiceClient()` - 87 edges
4. `createClient()` - 71 edges
5. `Button()` - 31 edges
6. `requireStaff()` - 24 edges
7. `assertItemAccess()` - 23 edges
8. `Skeleton()` - 17 edges
9. `SupabaseServerClient` - 17 edges
10. `addDays()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/sales/profit-analytics/page.tsx → lib/utils.ts
- `TeamPage()` --calls--> `getStaffDirectory()`  [EXTRACTED]
  app/(portal)/team/page.tsx → lib/actions/staff.ts
- `SearchableSelect()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/tools/ads-bulk-generator/searchable-select.tsx → lib/utils.ts
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/tools/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts
- `SortTh()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/tools/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (60 total, 24 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.07
Nodes (103): CalendarSidebar(), DayTasksDialog(), DayView(), DeleteScopeDialog(), ManageAccessDialog(), layoutWeekRibbons(), MonthGrid(), RibbonCell (+95 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.07
Nodes (76): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+68 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.08
Nodes (44): BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor(), POST(), AD_GROUP_MEDIA (+36 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.16
Nodes (16): distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), Block, BlockMode, newBlock() (+8 more)

### Community 5 - "shadcn/ui Component Registry Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 6 - "PPC Schedule AI Import"
Cohesion: 0.10
Nodes (33): POST(), POST(), AMOUNT_HINTS, analyzeScheduleImport(), ColumnDetectSchema, ColumnMapping, COUNTRY_ALIASES, COUNTRY_HINTS (+25 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "product-block.tsx"
Cohesion: 0.13
Nodes (26): ComposeDialog(), MODE_LABEL, SendResult, splitAddresses(), SCOPE_OPTIONS, markdownComponents, TaskFormDialogProps, TaskFormInner() (+18 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.14
Nodes (19): DashboardPage(), SidebarContent(), CommunicationItem, CommunicationItemInput, communicationItems, defineCommunicationItem(), slugify(), ConfigurationItem (+11 more)

### Community 10 - "utils.ts"
Cohesion: 0.13
Nodes (22): addSkus(), ColumnDetectSchema, ColumnMapping, deleteSku(), detectColumnHeuristically(), detectColumnWithAi(), DetectedSkuSheet, detectStatusColumnHeuristically() (+14 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.10
Nodes (27): PriorityPill(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount() (+19 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.06
Nodes (33): Adding a New Project, Adding a New Sales Item, Adding a new staff member, Adding a New Tool, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+25 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.15
Nodes (25): marketplace, asNumber(), callSpApi(), callSpApiJson(), chunk(), credentialsFor(), extractFeaturedPricing(), extractOfferPrice() (+17 more)

### Community 25 - "projects.ts"
Cohesion: 0.09
Nodes (38): formatDate(), PRIORITY_ICONS, Scope, SortKey, TasksPage(), todayIso(), blockIssues(), BlockSummary (+30 more)

### Community 26 - "chart.tsx"
Cohesion: 0.31
Nodes (5): Option, SearchableSelect(), LoginForm(), Input(), Label()

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 42 - "projects.ts"
Cohesion: 0.33
Nodes (6): AutomationProject, defineProject(), priceChangePlans, ProjectInput, projects, slugify()

### Community 43 - "tabs.tsx"
Cohesion: 0.15
Nodes (22): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, SettingsPage(), createStaffMember(), deleteStaffMember(), getCurrentUser() (+14 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (58): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES (+50 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (66): ComposeDialogProps, CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps, RFC-5322, buildRawMessage() (+58 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.06
Nodes (65): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+57 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.14
Nodes (17): ActionResult, BrandLibraryItem, Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+9 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.06
Nodes (82): DirectoryEntry, TeamPage(), BrandLibrarySection(), AdsBulkGeneratorPage(), Step, STEPS, WizardStep, ChatPanel() (+74 more)

### Community 51 - "server.ts"
Cohesion: 0.13
Nodes (23): IncomingCampaign, BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL (+15 more)

### Community 52 - "permissions.ts"
Cohesion: 0.14
Nodes (16): POST(), POST(), PpcTopUpLayout(), PriceChangePlansLayout(), CompanyInboxLayout(), MasterListLayout(), CalendarLayout(), TasksLayout() (+8 more)

### Community 54 - "page.tsx"
Cohesion: 0.18
Nodes (17): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), NewPricePlanSheet(), nextStepPrice() (+9 more)

### Community 58 - "projects.ts"
Cohesion: 0.19
Nodes (12): sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), adsBulkGenerator, AutomationTool, bulkCampaignUpload (+4 more)

### Community 59 - "others.ts"
Cohesion: 0.29
Nodes (7): calendar, defineOtherItem(), OtherItem, OtherItemInput, othersItems, slugify(), tasks

### Community 62 - "sidebar-content.tsx"
Cohesion: 0.50
Nodes (3): PortalLayout(), Sidebar(), Topbar()

### Community 64 - "price-change-plans.ts"
Cohesion: 0.29
Nodes (11): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PricePlan, PriceType, requirePlanAccess() (+3 more)

### Community 67 - "pricing-update.ts"
Cohesion: 0.18
Nodes (10): MarketplaceOptions(), formatPrice(), SkuDetailDialog(), formatMoney(), MARKETPLACE_CODES, MARKETPLACE_IDS, marketplacesByRegion(), Region (+2 more)

### Community 68 - "pricing-update.ts"
Cohesion: 0.83
Nodes (3): fetchSkuDetail(), fetchSkuPricing(), requireStaff()

## Knowledge Gaps
- **278 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES`, `PriceTypeOption`, `SendResult` (+273 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `calendar.ts` to `price-change-plans.ts`, `PPC Top-Up Automation`, `Auth & Staff Management`, `pricing-update.ts`, `PPC Schedule AI Import`, `monday.com Dashboards — Comprehensive Reference`, `build.ts`, `utils.ts`, `page-header.tsx`, `mail.ts`, `tabs.tsx`, `fba-fee-tracker.ts`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `projects.ts`, `sidebar-content.tsx`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **Why does `cn()` connect `Sponsored Brands Bulk XLSX Builder` to `calendar.ts`, `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `product-block.tsx`, `monday.com Dashboards — Comprehensive Reference`, `page-header.tsx`, `mail.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `projects.ts`, `chart.tsx`, `sidebar-content.tsx`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `fba-fee-tracker.ts`, `PPC Top-Up Automation`, `mail.ts`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES` to the rest of the system?**
  _281 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06581709145427286 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.07032967032967033 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.07535460992907801 - nodes in this community are weakly interconnected._