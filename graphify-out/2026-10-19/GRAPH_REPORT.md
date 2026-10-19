# Graph Report - LaLaGreen-Automation-Portal  (2026-10-19)

## Corpus Check
- 163 files · ~116,742 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1212 nodes · 3629 edges · 59 communities (35 shown, 24 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.59)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fb71224d`
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
- route.ts
- fba-fee-tracker.ts
- product-block.tsx
- fba-fee-calculator.ts
- server.ts
- permissions.ts
- communications.ts
- page.tsx
- credentials.ts
- hash-password.ts
- projects.ts
- sidebar-content.tsx

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
- `PriorityPill()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/others/tasks/page.tsx → lib/utils.ts
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/sales/profit-analytics/page.tsx → lib/utils.ts
- `SearchableSelect()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/tools/ads-bulk-generator/searchable-select.tsx → lib/utils.ts
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/tools/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts
- `SortTh()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/tools/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (59 total, 24 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.06
Nodes (114): ComposeDialog(), MODE_LABEL, SendResult, splitAddresses(), DayTasksDialog(), DayView(), DeleteScopeDialog(), SCOPE_OPTIONS (+106 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.07
Nodes (76): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+68 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.15
Nodes (22): AD_GROUP_MEDIA, AD_MEDIA, AdsCountry, adsHeaders(), adsPost(), AdsProfile, CAMPAIGN_MEDIA, createSbAdGroup() (+14 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.19
Nodes (13): distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), Block, BlockMode, newBlock() (+5 more)

### Community 5 - "shadcn/ui Component Registry Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 6 - "PPC Schedule AI Import"
Cohesion: 0.10
Nodes (32): POST(), POST(), AMOUNT_HINTS, analyzeScheduleImport(), ColumnDetectSchema, ColumnMapping, COUNTRY_ALIASES, COUNTRY_HINTS (+24 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "product-block.tsx"
Cohesion: 0.12
Nodes (21): Option, SearchableSelect(), ChatPanel(), markdownComponents, LoginForm(), TaskFormDialog(), TaskFormDialogProps, TaskFormInner() (+13 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.14
Nodes (15): DashboardPage(), ConfigurationItem, ConfigurationItemInput, configurationItems, defineConfigurationItem(), masterList, slugify(), calendar (+7 more)

### Community 10 - "utils.ts"
Cohesion: 0.08
Nodes (38): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+30 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.10
Nodes (29): CalendarSidebar(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), CardFooter() (+21 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.06
Nodes (33): Adding a New Project, Adding a New Sales Item, Adding a new staff member, Adding a New Tool, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+25 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.06
Nodes (67): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), MarketplaceOptions(), NewBulkPricePlanSheet(), NewPricePlanSheet() (+59 more)

### Community 25 - "projects.ts"
Cohesion: 0.13
Nodes (26): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+18 more)

### Community 26 - "chart.tsx"
Cohesion: 0.12
Nodes (18): formatDate(), notesTooltip(), PRIORITY_ICONS, PriorityPill(), Scope, SortKey, TasksPage(), todayIso() (+10 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.17
Nodes (17): POST(), BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, BaseCampaignInput, budgetFor() (+9 more)

### Community 42 - "projects.ts"
Cohesion: 0.14
Nodes (12): DirectoryEntry, TeamPage(), PageHeader(), getStaffDirectory(), ROLE_LABELS, adsBulkGenerator, AutomationTool, bulkCampaignUpload (+4 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.22
Nodes (16): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, SettingsPage(), changeOwnPassword(), createStaffMember(), deleteStaffMember() (+8 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (57): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES (+49 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (65): ComposeDialogProps, CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps, RFC-5322, buildRawMessage() (+57 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.27
Nodes (10): BrandProfile, budgetFor(), buildVideoBulk(), dedupeKeywords(), emptyRow(), HEADER, SHEET_NAME, toAmazonDate() (+2 more)

### Community 47 - "route.ts"
Cohesion: 0.48
Nodes (6): budgetFor(), POST(), getProfileId(), isUploadableCountry(), UploadCampaign, UploadResult

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.06
Nodes (64): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+56 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.13
Nodes (26): ActionResult, BrandLibraryItem, STEPS, WizardStep, AssetsSection(), BrandsSection(), COUNTRIES, DeleteConfirm() (+18 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.09
Nodes (61): BrandLibrarySection(), AdsBulkGeneratorPage(), Step, formatWhen(), TaskUpdates(), createBrand(), createKeywordTheme(), createVideoAsset() (+53 more)

### Community 51 - "server.ts"
Cohesion: 0.19
Nodes (15): IncomingCampaign, POST(), isAllowed(), BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords() (+7 more)

### Community 52 - "permissions.ts"
Cohesion: 0.14
Nodes (11): PpcTopUpLayout(), PriceChangePlansLayout(), CompanyInboxLayout(), MasterListLayout(), CalendarLayout(), TasksLayout(), ProfitAnalyticsLayout(), AdsBulkGeneratorLayout() (+3 more)

### Community 53 - "communications.ts"
Cohesion: 0.33
Nodes (6): CommunicationItem, CommunicationItemInput, communicationItems, companyInbox, defineCommunicationItem(), slugify()

### Community 54 - "page.tsx"
Cohesion: 0.40
Nodes (5): defineSalesItem(), profitAnalytics, SalesItem, SalesItemInput, slugify()

### Community 58 - "projects.ts"
Cohesion: 0.19
Nodes (12): sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), AutomationProject, defineProject(), priceChangePlans (+4 more)

### Community 62 - "sidebar-content.tsx"
Cohesion: 0.17
Nodes (16): PortalLayout(), SidebarContent(), Sidebar(), Topbar(), Separator(), ALL_ITEM_IDS, getMyPermissions(), canManageUsers() (+8 more)

## Knowledge Gaps
- **278 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES`, `PriceTypeOption`, `SendResult` (+273 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `fba-fee-calculator.ts` to `calendar.ts`, `PPC Top-Up Automation`, `PPC Schedule AI Import`, `monday.com Dashboards — Comprehensive Reference`, `build.ts`, `utils.ts`, `page-header.tsx`, `mail.ts`, `tabs.tsx`, `route.ts`, `fba-fee-tracker.ts`, `projects.ts`, `server.ts`, `sp-api.ts`, `projects.ts`, `sidebar-content.tsx`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Why does `cn()` connect `Sponsored Brands Bulk XLSX Builder` to `calendar.ts`, `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `product-block.tsx`, `page-header.tsx`, `mail.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `projects.ts`, `chart.tsx`, `sidebar-content.tsx`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `PPC Top-Up Automation`, `utils.ts`, `mail.ts`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES` to the rest of the system?**
  _281 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05644708786892605 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.06975633062589584 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._