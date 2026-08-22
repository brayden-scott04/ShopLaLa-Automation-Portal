# Graph Report - LaLaGreen-Automation-Portal  (2026-08-22)

## Corpus Check
- 108 files · ~69,361 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 822 nodes · 2154 edges · 56 communities (31 shown, 25 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `eccedbf6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Shared UI Components & Layout Shell
- PPC Top-Up Automation
- Auth & Staff Management
- Package Dependencies (package.json)
- Sponsored Brands Upload - Campaign Data
- shadcn/ui Component Registry Config
- PPC Schedule AI Import
- TypeScript Config
- product-block.tsx
- Dashboard, Projects & Tools Registry
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
- sku-list.ts
- getSession
- roles.ts
- page.tsx
- permissions.ts
- communications.ts
- configuration.ts
- badge.tsx
- credentials.ts
- hash-password.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 92 edges
2. `getSession()` - 50 edges
3. `createServiceClient()` - 44 edges
4. `createClient()` - 38 edges
5. `requireStaff()` - 24 edges
6. `Button()` - 16 edges
7. `CANONICAL_SLOTS` - 16 edges
8. `compilerOptions` - 16 edges
9. `sendMailReplyImpl()` - 15 edges
10. `getMyPermissions()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `AlertDialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dialog.tsx → lib/utils.ts
- `PpcTopUpLayout()` --calls--> `assertItemAccess()`  [EXTRACTED]
  app/(portal)/automations/ppc-top-up/layout.tsx → lib/permissions.ts
- `PriceChangePlansLayout()` --calls--> `assertItemAccess()`  [EXTRACTED]
  app/(portal)/automations/price-change-plans/layout.tsx → lib/permissions.ts
- `MarketplaceOptions()` --calls--> `marketplacesByRegion()`  [EXTRACTED]
  app/(portal)/automations/price-change-plans/page.tsx → lib/amazon/marketplaces.ts

## Import Cycles
- None detected.

## Communities (56 total, 25 thin omitted)

### Community 0 - "Shared UI Components & Layout Shell"
Cohesion: 0.17
Nodes (15): ComposeDialog(), MODE_LABEL, SendResult, splitAddresses(), Button(), buttonVariants, Dialog(), DialogBody() (+7 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.09
Nodes (64): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+56 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.07
Nodes (47): POST(), BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor(), POST() (+39 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.13
Nodes (33): COUNTRIES, STEPS, WizardStep, Brand, CampaignProduct, createBrand(), createKeywordTheme(), createVideoAsset() (+25 more)

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
Cohesion: 0.15
Nodes (13): Preset, ProductBlock(), toLines(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription() (+5 more)

### Community 9 - "Dashboard, Projects & Tools Registry"
Cohesion: 0.19
Nodes (11): TeamPage(), getStaffDirectory(), chatToolDefinitions, runChatTool(), projects, AutomationTool, bulkCampaignUpload, defineTool() (+3 more)

### Community 10 - "utils.ts"
Cohesion: 0.29
Nodes (7): AutomationProject, defineProject(), ppcTopUp, priceChangePlans, profitAnalytics, ProjectInput, slugify()

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.12
Nodes (24): AlertDialogMedia(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), CardFooter() (+16 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.07
Nodes (28): Adding a New Project, Adding a new staff member, Adding a New Tool, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System, Database (Supabase), Environment variables (+20 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.05
Nodes (73): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), MarketplaceOptions(), NewBulkPricePlanSheet(), NewPricePlanSheet() (+65 more)

### Community 25 - "projects.ts"
Cohesion: 0.18
Nodes (17): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+9 more)

### Community 26 - "chart.tsx"
Cohesion: 0.26
Nodes (11): POST(), POST(), toRole(), clearSessionCookie(), getSecretKey(), SessionPayload, setSessionCookie(), signSession() (+3 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 42 - "sku-list.ts"
Cohesion: 0.19
Nodes (11): UPLOADABLE_COUNTRIES, UploadResponse, newBlock(), Checkbox(), Sheet(), SheetClose(), SheetContent(), SheetDescription() (+3 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.29
Nodes (5): ChatPanel(), markdownComponents, sendAiChatMessage(), ChatMessage, generateAssistantReply()

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (41): money(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPES, sgtDate(), DirectoryEntry, PageHeader() (+33 more)

### Community 45 - "mail.ts"
Cohesion: 0.09
Nodes (48): ComposeDialogProps, CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps, SegmentedControl(), RFC-5322 (+40 more)

### Community 46 - "sku-list.ts"
Cohesion: 0.16
Nodes (21): addSkus(), ColumnDetectSchema, ColumnMapping, deleteSku(), detectColumnHeuristically(), detectColumnWithAi(), DetectedSkuSheet, detectStatusColumnHeuristically() (+13 more)

### Community 47 - "getSession"
Cohesion: 0.47
Nodes (3): LoginForm(), Input(), Label()

### Community 48 - "roles.ts"
Cohesion: 0.42
Nodes (6): SidebarContent(), Sidebar(), Topbar(), canManageUsers(), PermissionSet, Role

### Community 49 - "page.tsx"
Cohesion: 0.23
Nodes (17): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, SettingsPage(), changeOwnPassword(), createStaffMember(), deleteStaffMember() (+9 more)

### Community 50 - "permissions.ts"
Cohesion: 0.16
Nodes (13): PpcTopUpLayout(), PriceChangePlansLayout(), ProfitAnalyticsLayout(), CompanyInboxLayout(), MasterListLayout(), SponsoredBrandsUploadLayout(), ALL_ITEM_IDS, assertItemAccess() (+5 more)

### Community 52 - "communications.ts"
Cohesion: 0.25
Nodes (9): DashboardPage(), CommunicationItem, CommunicationItemInput, communicationItems, companyInbox, defineCommunicationItem(), slugify(), filterItems() (+1 more)

### Community 53 - "configuration.ts"
Cohesion: 0.33
Nodes (6): ConfigurationItem, ConfigurationItemInput, configurationItems, defineConfigurationItem(), masterList, slugify()

## Knowledge Gaps
- **210 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES`, `PriceTypeOption`, `SCOPES` (+205 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `page.tsx` to `PPC Top-Up Automation`, `Auth & Staff Management`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `build.ts`, `Dashboard, Projects & Tools Registry`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `sku-list.ts`, `roles.ts`, `permissions.ts`, `communications.ts`, `sp-api.ts`, `chart.tsx`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `page-header.tsx`, `mail.ts`, `sku-list.ts`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `cn()` connect `Sponsored Brands Bulk XLSX Builder` to `Shared UI Components & Layout Shell`, `product-block.tsx`, `sku-list.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `getSession`, `roles.ts`, `badge.tsx`, `sp-api.ts`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES` to the rest of the system?**
  _213 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.09022556390977443 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.0746606334841629 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._