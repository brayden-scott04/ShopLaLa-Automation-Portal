# Graph Report - LaLaGreen-Automation-Portal  (2026-10-01)

## Corpus Check
- 161 files · ~116,710 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1247 nodes · 3688 edges · 63 communities (38 shown, 25 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.54)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `740d492f`
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
- server.ts
- permissions.ts
- page.tsx
- credentials.ts
- hash-password.ts
- getSession
- projects.ts
- fba-fee-tracker-view.tsx
- price-change-plans.ts
- buildSponsoredBrandsBulk.ts
- pricing-update.ts
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
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/tools/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts
- `SortTh()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/tools/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts
- `SheetOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/sheet.tsx → lib/utils.ts
- `PpcTopUpLayout()` --calls--> `assertItemAccess()`  [EXTRACTED]
  app/(portal)/automations/ppc-top-up/layout.tsx → lib/permissions.ts
- `PriceChangePlansLayout()` --calls--> `assertItemAccess()`  [EXTRACTED]
  app/(portal)/automations/price-change-plans/layout.tsx → lib/permissions.ts

## Import Cycles
- None detected.

## Communities (63 total, 25 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.07
Nodes (63): CalendarSidebar(), DayTasksDialog(), ManageAccessDialog(), layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS, NameCalendarDialog() (+55 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.07
Nodes (75): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+67 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.13
Nodes (28): budgetFor(), POST(), AD_GROUP_MEDIA, AD_MEDIA, AdsCountry, adsHeaders(), adsPost(), AdsProfile (+20 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.10
Nodes (53): AdsBulkGeneratorPage(), Step, STEPS, WizardStep, AssetsSection(), BrandsSection(), COUNTRIES, KeywordGarageSection() (+45 more)

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
Cohesion: 0.25
Nodes (17): ComposeDialog(), MODE_LABEL, SendResult, splitAddresses(), Button(), buttonVariants, Dialog(), DialogBody() (+9 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.06
Nodes (35): 10. mondayDB 2.0 (Enterprise Only), 11. Common Troubleshooting, 12. Key Constraints Summary, 1. What are Dashboards?, 2. What Data Can a Dashboard Show?, 3. Plan Limits, 4. Creating a Dashboard, 5. Dashboard Types (Visibility) (+27 more)

### Community 10 - "utils.ts"
Cohesion: 0.16
Nodes (21): addSkus(), ColumnDetectSchema, ColumnMapping, deleteSku(), detectColumnHeuristically(), detectColumnWithAi(), detectStatusColumnHeuristically(), extractSkusFromSheet() (+13 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.10
Nodes (30): Option, SearchableSelect(), SidebarContent(), Sidebar(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge() (+22 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.06
Nodes (31): Adding a New Project, Adding a New Sales Item, Adding a new staff member, Adding a New Tool, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+23 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.13
Nodes (29): fetchSkuDetail(), fetchSkuPricing(), requireStaff(), marketplace, asNumber(), callSpApi(), callSpApiJson(), chunk() (+21 more)

### Community 25 - "projects.ts"
Cohesion: 0.11
Nodes (27): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+19 more)

### Community 26 - "chart.tsx"
Cohesion: 0.33
Nodes (6): defineSalesItem(), profitAnalytics, SalesItem, SalesItemInput, salesItems, slugify()

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 42 - "sku-list.ts"
Cohesion: 0.18
Nodes (12): ActionResult, BrandLibraryItem, BrandLibrarySection(), DeleteConfirm(), Sheet(), SheetClose(), SheetContent(), SheetDescription() (+4 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.06
Nodes (49): POST(), POST(), ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, SettingsPage(), DirectoryEntry (+41 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.09
Nodes (38): addInto(), emptyTotals(), getProfitOverview(), MetricRow, num(), ProfitDailyPoint, ProfitOverview, ProfitTotals (+30 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (65): ComposeDialogProps, CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps, RFC-5322, buildRawMessage() (+57 more)

### Community 47 - "getSession"
Cohesion: 0.13
Nodes (27): distributeKeywords(), shuffle(), BoardGrid(), ItemRow, PendingDelete, ColumnDialog(), PageHeader(), AlertDialog() (+19 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.06
Nodes (64): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+56 more)

### Community 49 - "createClient"
Cohesion: 0.05
Nodes (79): BoardDetailPage(), BoardsPage(), DashboardDetailPage(), DashboardsPage(), StatusBadge(), CHART_CONFIG, WidgetCard(), WidgetDialog() (+71 more)

### Community 51 - "server.ts"
Cohesion: 0.13
Nodes (24): IncomingCampaign, POST(), BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow() (+16 more)

### Community 52 - "permissions.ts"
Cohesion: 0.14
Nodes (14): PpcTopUpLayout(), PriceChangePlansLayout(), CompanyInboxLayout(), MasterListLayout(), BoardsLayout(), CalendarLayout(), DashboardsLayout(), ProfitAnalyticsLayout() (+6 more)

### Community 54 - "page.tsx"
Cohesion: 0.19
Nodes (16): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), NewPricePlanSheet(), nextStepPrice() (+8 more)

### Community 57 - "getSession"
Cohesion: 0.33
Nodes (6): DashboardPage(), PortalLayout(), Topbar(), getMyPermissions(), sanitizePermissions(), toPermissionSet()

### Community 58 - "projects.ts"
Cohesion: 0.14
Nodes (15): AutomationProject, defineProject(), ppcTopUp, priceChangePlans, ProjectInput, projects, slugify(), adsBulkGenerator (+7 more)

### Community 62 - "fba-fee-tracker-view.tsx"
Cohesion: 0.18
Nodes (15): money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES, sgtDate() (+7 more)

### Community 64 - "price-change-plans.ts"
Cohesion: 0.29
Nodes (11): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PricePlan, PriceType, requirePlanAccess() (+3 more)

### Community 66 - "buildSponsoredBrandsBulk.ts"
Cohesion: 0.16
Nodes (18): POST(), BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, isAllowed(), BaseCampaignInput (+10 more)

### Community 67 - "pricing-update.ts"
Cohesion: 0.14
Nodes (11): MarketplaceOptions(), formatPrice(), SkuDetailDialog(), DetectedSkuSheet, formatMoney(), MARKETPLACE_CODES, MARKETPLACE_IDS, marketplacesByRegion() (+3 more)

### Community 69 - "communications.ts"
Cohesion: 0.33
Nodes (6): CommunicationItem, CommunicationItemInput, communicationItems, companyInbox, defineCommunicationItem(), slugify()

### Community 70 - "configuration.ts"
Cohesion: 0.33
Nodes (6): ConfigurationItem, ConfigurationItemInput, configurationItems, defineConfigurationItem(), masterList, slugify()

## Knowledge Gaps
- **294 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES`, `PriceTypeOption`, `SendResult` (+289 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `calendar.ts` to `price-change-plans.ts`, `PPC Top-Up Automation`, `Auth & Staff Management`, `buildSponsoredBrandsBulk.ts`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `build.ts`, `utils.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `fba-fee-tracker.ts`, `createClient`, `server.ts`, `permissions.ts`, `sp-api.ts`, `getSession`, `projects.ts`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Why does `createClient()` connect `createClient` to `calendar.ts`, `PPC Top-Up Automation`, `Auth & Staff Management`, `buildSponsoredBrandsBulk.ts`, `Sponsored Brands Upload - Campaign Data`, `price-change-plans.ts`, `PPC Schedule AI Import`, `utils.ts`, `tabs.tsx`, `page-header.tsx`, `fba-fee-tracker.ts`, `server.ts`, `permissions.ts`, `getSession`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `PPC Top-Up Automation`, `utils.ts`, `mail.ts`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES` to the rest of the system?**
  _297 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07237871674491393 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.07081807081807082 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._