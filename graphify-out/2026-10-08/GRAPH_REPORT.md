# Graph Report - LaLaGreen-Automation-Portal  (2026-10-08)

## Corpus Check
- 167 files · ~120,554 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1279 nodes · 3847 edges · 65 communities (41 shown, 24 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.54)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `564dfc5a`
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
- fba-fee-tracker-view.tsx
- price-change-plans.ts
- buildSponsoredBrandsBulk.ts
- pricing-update.ts
- communications.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 107 edges
2. `createServiceClient()` - 95 edges
3. `createClient()` - 84 edges
4. `getSession()` - 81 edges
5. `Button()` - 35 edges
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

## Communities (65 total, 24 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.07
Nodes (84): DayTasksDialog(), DayView(), ManageAccessDialog(), layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS, NameCalendarDialog() (+76 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.09
Nodes (64): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+56 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.14
Nodes (23): AD_GROUP_MEDIA, AD_MEDIA, AdsCountry, adsHeaders(), adsPost(), AdsProfile, CAMPAIGN_MEDIA, createSbAdGroup() (+15 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.07
Nodes (70): BrandRow, BrandLibrarySection(), distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), AdsBulkGeneratorPage() (+62 more)

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
Cohesion: 0.24
Nodes (16): MODE_LABEL, SendResult, WEEKDAY_SHORT, SCOPE_CURRENCY, LoginForm(), Button(), buttonVariants, Dialog() (+8 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.06
Nodes (35): 10. mondayDB 2.0 (Enterprise Only), 11. Common Troubleshooting, 12. Key Constraints Summary, 1. What are Dashboards?, 2. What Data Can a Dashboard Show?, 3. Plan Limits, 4. Creating a Dashboard, 5. Dashboard Types (Visibility) (+27 more)

### Community 10 - "utils.ts"
Cohesion: 0.13
Nodes (22): addSkus(), ColumnDetectSchema, ColumnMapping, deleteSku(), detectColumnHeuristically(), detectColumnWithAi(), DetectedSkuSheet, detectStatusColumnHeuristically() (+14 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.10
Nodes (26): CalendarSidebar(), SearchableSelect(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup() (+18 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.06
Nodes (31): Adding a New Project, Adding a New Sales Item, Adding a new staff member, Adding a New Tool, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+23 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.15
Nodes (27): fetchSkuDetail(), fetchSkuPricing(), requireStaff(), marketplace, asNumber(), callSpApi(), callSpApiJson(), chunk() (+19 more)

### Community 25 - "projects.ts"
Cohesion: 0.10
Nodes (31): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+23 more)

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
Cohesion: 0.30
Nodes (8): ActionResult, BrandLibraryItem, Card(), CardAction(), CardContent(), CardDescription(), CardHeader(), CardTitle()

### Community 43 - "tabs.tsx"
Cohesion: 0.26
Nodes (14): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, SettingsPage(), createStaffMember(), deleteStaffMember(), getCurrentUser() (+6 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (45): money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPES, sgtDate(), addInto() (+37 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (68): ComposeDialog(), ComposeDialogProps, splitAddresses(), CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps (+60 more)

### Community 46 - "page.tsx"
Cohesion: 0.18
Nodes (8): ProductBlock(), toLines(), Option, ChatPanel(), markdownComponents, Checkbox(), Input(), Textarea()

### Community 47 - "getSession"
Cohesion: 0.23
Nodes (15): BoardGrid(), ItemRow, PendingDelete, ColumnDialog(), PageHeader(), AlertDialog(), AlertDialogAction(), AlertDialogCancel() (+7 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.11
Nodes (31): Row, BulkDimsResult, bulkUpdateTrueDims(), daysBefore(), DimsInput, DimsJson, FbaFeeOverview, FeeAlert (+23 more)

### Community 49 - "createClient"
Cohesion: 0.05
Nodes (79): BoardDetailPage(), BoardsPage(), DashboardDetailPage(), DashboardsPage(), StatusBadge(), CHART_CONFIG, WidgetCard(), WidgetDialog() (+71 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.11
Nodes (27): buildRows(), FbaFeeTrackerView(), money(), pct(), relativeTime(), SkuDetail(), TierBadge(), tierLabel() (+19 more)

### Community 51 - "server.ts"
Cohesion: 0.12
Nodes (22): BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL, SB_MAG_HEADER (+14 more)

### Community 52 - "permissions.ts"
Cohesion: 0.13
Nodes (17): PpcTopUpLayout(), PriceChangePlansLayout(), CompanyInboxLayout(), MasterListLayout(), BoardsLayout(), CalendarLayout(), DashboardsLayout(), ProfitAnalyticsLayout() (+9 more)

### Community 53 - "session.ts"
Cohesion: 0.26
Nodes (11): POST(), POST(), toRole(), clearSessionCookie(), getSecretKey(), SessionPayload, setSessionCookie(), signSession() (+3 more)

### Community 54 - "page.tsx"
Cohesion: 0.14
Nodes (20): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), NewPricePlanSheet(), nextStepPrice() (+12 more)

### Community 57 - "getSession"
Cohesion: 0.27
Nodes (10): PortalLayout(), SidebarContent(), Sidebar(), Topbar(), canManageUsers(), filterItems(), PermissionSet, Role (+2 more)

### Community 58 - "projects.ts"
Cohesion: 0.14
Nodes (15): DirectoryEntry, TeamPage(), sendAiChatMessage(), getStaffDirectory(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool() (+7 more)

### Community 59 - "others.ts"
Cohesion: 0.25
Nodes (8): boards, calendar, dashboards, defineOtherItem(), OtherItem, OtherItemInput, othersItems, slugify()

### Community 62 - "fba-fee-tracker-view.tsx"
Cohesion: 0.09
Nodes (26): DimsDiff(), dimsText(), Filter, num(), SortKey, SortTh(), StatTile(), ChartConfig (+18 more)

### Community 64 - "price-change-plans.ts"
Cohesion: 0.29
Nodes (11): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PricePlan, PriceType, requirePlanAccess() (+3 more)

### Community 66 - "buildSponsoredBrandsBulk.ts"
Cohesion: 0.13
Nodes (25): IncomingCampaign, POST(), POST(), IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor() (+17 more)

### Community 67 - "pricing-update.ts"
Cohesion: 0.18
Nodes (10): MarketplaceOptions(), formatPrice(), SkuDetailDialog(), formatMoney(), MARKETPLACE_CODES, MARKETPLACE_IDS, marketplacesByRegion(), Region (+2 more)

### Community 69 - "communications.ts"
Cohesion: 0.14
Nodes (15): CommunicationItem, CommunicationItemInput, communicationItems, defineCommunicationItem(), slugify(), ConfigurationItem, ConfigurationItemInput, configurationItems (+7 more)

## Knowledge Gaps
- **299 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES`, `PriceTypeOption`, `SendResult` (+294 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `calendar.ts` to `price-change-plans.ts`, `PPC Top-Up Automation`, `buildSponsoredBrandsBulk.ts`, `Sponsored Brands Upload - Campaign Data`, `communications.ts`, `PPC Schedule AI Import`, `build.ts`, `utils.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `fba-fee-tracker.ts`, `createClient`, `permissions.ts`, `session.ts`, `sp-api.ts`, `getSession`, `projects.ts`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Why does `createClient()` connect `calendar.ts` to `price-change-plans.ts`, `PPC Top-Up Automation`, `buildSponsoredBrandsBulk.ts`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `utils.ts`, `tabs.tsx`, `page-header.tsx`, `fba-fee-tracker.ts`, `createClient`, `permissions.ts`, `session.ts`, `projects.ts`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `cn()` connect `Sponsored Brands Bulk XLSX Builder` to `calendar.ts`, `product-block.tsx`, `sku-list.ts`, `page-header.tsx`, `mail.ts`, `page.tsx`, `getSession`, `createClient`, `fba-fee-calculator.ts`, `projects.ts`, `getSession`, `fba-fee-tracker-view.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES` to the rest of the system?**
  _302 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07211646136618141 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.08885850991114148 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.13768115942028986 - nodes in this community are weakly interconnected._