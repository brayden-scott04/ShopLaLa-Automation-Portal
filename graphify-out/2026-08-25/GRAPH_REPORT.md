# Graph Report - LaLaGreen-Automation-Portal  (2026-08-25)

## Corpus Check
- 110 files · ~71,967 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 845 nodes · 2243 edges · 58 communities (34 shown, 24 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `de604eac`
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
- button.tsx
- communications.ts
- communications.ts
- projects.ts
- credentials.ts
- hash-password.ts
- sales.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 94 edges
2. `getSession()` - 52 edges
3. `createServiceClient()` - 48 edges
4. `createClient()` - 42 edges
5. `requireStaff()` - 24 edges
6. `todaySgt()` - 17 edges
7. `Button()` - 16 edges
8. `CANONICAL_SLOTS` - 16 edges
9. `compilerOptions` - 16 edges
10. `sendMailReplyImpl()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `AlertDialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `AlertDialogMedia()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dialog.tsx → lib/utils.ts
- `PpcTopUpLayout()` --calls--> `assertItemAccess()`  [EXTRACTED]
  app/(portal)/automations/ppc-top-up/layout.tsx → lib/permissions.ts
- `PriceChangePlansLayout()` --calls--> `assertItemAccess()`  [EXTRACTED]
  app/(portal)/automations/price-change-plans/layout.tsx → lib/permissions.ts

## Import Cycles
- None detected.

## Communities (58 total, 24 thin omitted)

### Community 0 - "Shared UI Components & Layout Shell"
Cohesion: 0.13
Nodes (23): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), MarketplaceOptions(), NewBulkPricePlanSheet(), NewPricePlanSheet() (+15 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.07
Nodes (77): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+69 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.07
Nodes (45): BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor(), POST(), Brand (+37 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.12
Nodes (37): createBrand(), createKeywordTheme(), createVideoAsset(), deleteBrand(), deleteKeywordTheme(), deleteKeywordThemes(), deletePreset(), deleteProduct() (+29 more)

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
Cohesion: 0.16
Nodes (11): AlertDialogTitle(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle() (+3 more)

### Community 9 - "Dashboard, Projects & Tools Registry"
Cohesion: 0.24
Nodes (11): SidebarContent(), Sidebar(), Topbar(), canManageUsers(), EMPTY_PERMISSIONS, filterItems(), PermissionSet, Role (+3 more)

### Community 10 - "utils.ts"
Cohesion: 0.33
Nodes (6): ConfigurationItem, ConfigurationItemInput, configurationItems, defineConfigurationItem(), masterList, slugify()

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.10
Nodes (29): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), DropdownMenu(), DropdownMenuCheckboxItem() (+21 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.07
Nodes (29): Adding a New Project, Adding a New Sales Item, Adding a new staff member, Adding a New Tool, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System, Database (Supabase) (+21 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.11
Nodes (33): fetchSkuDetail(), fetchSkuPricing(), requireStaff(), marketplace, MARKETPLACE_CODES, MARKETPLACE_IDS, Region, REGION_HOSTS (+25 more)

### Community 25 - "projects.ts"
Cohesion: 0.25
Nodes (13): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+5 more)

### Community 26 - "chart.tsx"
Cohesion: 0.26
Nodes (11): POST(), POST(), toRole(), clearSessionCookie(), getSecretKey(), SessionPayload, setSessionCookie(), signSession() (+3 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.17
Nodes (18): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+10 more)

### Community 42 - "sku-list.ts"
Cohesion: 0.15
Nodes (9): COUNTRIES, STEPS, WizardStep, Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader() (+1 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.15
Nodes (15): DirectoryEntry, TeamPage(), sendAiChatMessage(), getStaffDirectory(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool() (+7 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (51): ComposeDialog(), ComposeDialogProps, MODE_LABEL, SendResult, splitAddresses(), money(), ProfitAnalyticsPage(), RANGES (+43 more)

### Community 45 - "mail.ts"
Cohesion: 0.10
Nodes (43): CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps, RFC-5322, buildRawMessage(), dedupeAddresses() (+35 more)

### Community 46 - "sku-list.ts"
Cohesion: 0.17
Nodes (20): addSkus(), ColumnDetectSchema, ColumnMapping, deleteSku(), detectColumnHeuristically(), detectColumnWithAi(), DetectedSkuSheet, detectStatusColumnHeuristically() (+12 more)

### Community 47 - "getSession"
Cohesion: 0.12
Nodes (24): UPLOADABLE_COUNTRIES, UploadResponse, Asset, Block, Brand, newBlock(), Preset, ProductBlock() (+16 more)

### Community 48 - "roles.ts"
Cohesion: 0.27
Nodes (4): ChatPanel(), markdownComponents, PageHeader(), Textarea()

### Community 49 - "page.tsx"
Cohesion: 0.24
Nodes (15): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, SettingsPage(), changeOwnPassword(), createStaffMember(), deleteStaffMember() (+7 more)

### Community 50 - "permissions.ts"
Cohesion: 0.21
Nodes (10): PpcTopUpLayout(), PriceChangePlansLayout(), CompanyInboxLayout(), MasterListLayout(), ProfitAnalyticsLayout(), SponsoredBrandsUploadLayout(), ALL_ITEM_IDS, assertItemAccess() (+2 more)

### Community 51 - "button.tsx"
Cohesion: 0.33
Nodes (5): LoginForm(), Button(), buttonVariants, Input(), Label()

### Community 52 - "communications.ts"
Cohesion: 0.61
Nodes (6): POST(), DashboardPage(), PortalLayout(), getMyPermissions(), isAllowed(), getSession()

### Community 53 - "communications.ts"
Cohesion: 0.33
Nodes (6): CommunicationItem, CommunicationItemInput, communicationItems, companyInbox, defineCommunicationItem(), slugify()

### Community 54 - "projects.ts"
Cohesion: 0.33
Nodes (6): AutomationProject, defineProject(), priceChangePlans, ProjectInput, projects, slugify()

### Community 57 - "sales.ts"
Cohesion: 0.33
Nodes (6): defineSalesItem(), profitAnalytics, SalesItem, SalesItemInput, salesItems, slugify()

## Knowledge Gaps
- **213 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES`, `PriceTypeOption`, `SendResult` (+208 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `communications.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `Dashboard, Projects & Tools Registry`, `build.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `sku-list.ts`, `page.tsx`, `permissions.ts`, `sp-api.ts`, `chart.tsx`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `cn()` connect `Sponsored Brands Bulk XLSX Builder` to `PPC Top-Up Automation`, `product-block.tsx`, `Dashboard, Projects & Tools Registry`, `sku-list.ts`, `page-header.tsx`, `mail.ts`, `getSession`, `roles.ts`, `button.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `PPC Top-Up Automation`, `mail.ts`, `build.ts`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES` to the rest of the system?**
  _216 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Shared UI Components & Layout Shell` be split into smaller, more focused modules?**
  _Cohesion score 0.12962962962962962 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.07082748948106592 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.07312925170068027 - nodes in this community are weakly interconnected._