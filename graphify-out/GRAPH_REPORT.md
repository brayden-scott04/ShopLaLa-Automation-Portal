# Graph Report - LaLaGreen-Automation-Portal  (2026-10-19)

## Corpus Check
- 164 files · ~117,236 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1218 nodes · 3643 edges · 57 communities (33 shown, 24 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.59)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d3378498`
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
- communications.ts
- credentials.ts
- hash-password.ts
- projects.ts
- sidebar-content.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 114 edges
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
- `SearchableSelect()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/tools/ads-bulk-generator/searchable-select.tsx → lib/utils.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dialog.tsx → lib/utils.ts
- `PpcTopUpLayout()` --calls--> `assertItemAccess()`  [EXTRACTED]
  app/(portal)/automations/ppc-top-up/layout.tsx → lib/permissions.ts
- `PriceChangePlansLayout()` --calls--> `assertItemAccess()`  [EXTRACTED]
  app/(portal)/automations/price-change-plans/layout.tsx → lib/permissions.ts

## Import Cycles
- None detected.

## Communities (57 total, 24 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.07
Nodes (91): DayTasksDialog(), DayView(), ManageAccessDialog(), layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS, TaskCard() (+83 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.07
Nodes (75): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+67 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.08
Nodes (44): BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor(), POST(), AD_GROUP_MEDIA (+36 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.15
Nodes (19): distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), Block, BlockMode, newBlock() (+11 more)

### Community 5 - "shadcn/ui Component Registry Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 6 - "PPC Schedule AI Import"
Cohesion: 0.08
Nodes (42): AMOUNT_HINTS, analyzeScheduleImport(), ColumnDetectSchema, ColumnMapping, COUNTRY_ALIASES, COUNTRY_HINTS, detectColumnBlocks(), detectColumnsWithAi() (+34 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "product-block.tsx"
Cohesion: 0.13
Nodes (25): ComposeDialog(), MODE_LABEL, SendResult, splitAddresses(), DeleteScopeDialog(), SCOPE_OPTIONS, NameCalendarDialog(), TaskFormDialog() (+17 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.29
Nodes (7): calendar, defineOtherItem(), OtherItem, OtherItemInput, othersItems, slugify(), tasks

### Community 10 - "utils.ts"
Cohesion: 0.10
Nodes (38): TaskFormDialogProps, formatWhen(), TaskUpdates(), analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi() (+30 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.09
Nodes (31): CalendarSidebar(), PriorityPill(), SortTh(), StatTile(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge() (+23 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.06
Nodes (33): Adding a New Project, Adding a New Sales Item, Adding a new staff member, Adding a New Tool, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+25 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.06
Nodes (68): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), MarketplaceOptions(), NewBulkPricePlanSheet(), NewPricePlanSheet() (+60 more)

### Community 25 - "projects.ts"
Cohesion: 0.23
Nodes (14): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+6 more)

### Community 26 - "chart.tsx"
Cohesion: 0.10
Nodes (32): COLUMNS, formatDate(), notesTooltip(), PRIORITY_ICONS, Scope, SortKey, TasksPage(), todayIso() (+24 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.26
Nodes (11): POST(), POST(), toRole(), clearSessionCookie(), getSecretKey(), SessionPayload, setSessionCookie(), signSession() (+3 more)

### Community 42 - "projects.ts"
Cohesion: 0.12
Nodes (17): DirectoryEntry, TeamPage(), ChatPanel(), PageHeader(), sendAiChatMessage(), getStaffDirectory(), ChatMessage, generateAssistantReply() (+9 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.24
Nodes (15): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, SettingsPage(), createStaffMember(), deleteStaffMember(), getCurrentUser() (+7 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (58): FeeBreakdownBody(), money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES (+50 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (66): ComposeDialogProps, CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps, RFC-5322, buildRawMessage() (+58 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.40
Nodes (5): CommunicationItem, CommunicationItemInput, communicationItems, defineCommunicationItem(), slugify()

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.06
Nodes (62): buildRows(), DimsDiff(), dimsText(), FbaFeeTrackerView(), Filter, money(), num(), pct() (+54 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.12
Nodes (23): ActionResult, BrandLibraryItem, markdownComponents, COUNTRIES, DeleteConfirm(), LoginForm(), Button(), buttonVariants (+15 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.08
Nodes (63): BrandLibrarySection(), AdsBulkGeneratorPage(), Step, STEPS, WizardStep, AssetsSection(), BrandsSection(), KeywordGarageSection() (+55 more)

### Community 51 - "server.ts"
Cohesion: 0.13
Nodes (24): IncomingCampaign, POST(), BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow() (+16 more)

### Community 52 - "permissions.ts"
Cohesion: 0.12
Nodes (17): PpcTopUpLayout(), PriceChangePlansLayout(), CompanyInboxLayout(), MasterListLayout(), CalendarLayout(), TasksLayout(), ProfitAnalyticsLayout(), AdsBulkGeneratorLayout() (+9 more)

### Community 53 - "communications.ts"
Cohesion: 0.40
Nodes (5): ConfigurationItem, ConfigurationItemInput, configurationItems, defineConfigurationItem(), slugify()

### Community 58 - "projects.ts"
Cohesion: 0.24
Nodes (11): POST(), DashboardPage(), getMyPermissions(), AutomationProject, defineProject(), ppcTopUp, ProjectInput, projects (+3 more)

### Community 62 - "sidebar-content.tsx"
Cohesion: 0.21
Nodes (12): PortalLayout(), SidebarContent(), Sidebar(), Topbar(), canManageUsers(), PermissionSet, Role, defineSalesItem() (+4 more)

## Knowledge Gaps
- **279 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES`, `PriceTypeOption`, `SendResult` (+274 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `utils.ts` to `calendar.ts`, `PPC Top-Up Automation`, `Auth & Staff Management`, `PPC Schedule AI Import`, `build.ts`, `projects.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `sp-api.ts`, `projects.ts`, `sidebar-content.tsx`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Why does `cn()` connect `Sponsored Brands Bulk XLSX Builder` to `calendar.ts`, `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `product-block.tsx`, `projects.ts`, `page-header.tsx`, `mail.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `chart.tsx`, `sidebar-content.tsx`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `PPC Top-Up Automation`, `mail.ts`, `PPC Schedule AI Import`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES` to the rest of the system?**
  _282 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07113517550410754 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.07081807081807082 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.07535460992907801 - nodes in this community are weakly interconnected._