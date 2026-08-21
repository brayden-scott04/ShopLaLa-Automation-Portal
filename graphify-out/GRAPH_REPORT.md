# Graph Report - LaLaGreen-Automation-Portal  (2026-08-21)

## Corpus Check
- 104 files · ~66,228 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 795 nodes · 2075 edges · 57 communities (32 shown, 25 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `622bd09a`
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
- page.tsx
- communications.ts
- configuration.ts
- badge.tsx
- credentials.ts
- hash-password.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 92 edges
2. `getSession()` - 48 edges
3. `createServiceClient()` - 44 edges
4. `createClient()` - 36 edges
5. `requireStaff()` - 24 edges
6. `Button()` - 16 edges
7. `CANONICAL_SLOTS` - 16 edges
8. `compilerOptions` - 16 edges
9. `sendMailReplyImpl()` - 15 edges
10. `getMyPermissions()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `SettingsPage()` --calls--> `getCurrentUser()`  [EXTRACTED]
  app/(portal)/settings/page.tsx → lib/actions/staff.ts
- `AlertDialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `AlertDialogMedia()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dialog.tsx → lib/utils.ts
- `SheetOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/sheet.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (57 total, 25 thin omitted)

### Community 0 - "Shared UI Components & Layout Shell"
Cohesion: 0.15
Nodes (17): ComposeDialog(), ComposeDialogProps, MODE_LABEL, SendResult, splitAddresses(), Dialog(), DialogBody(), DialogClose() (+9 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.07
Nodes (76): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+68 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.14
Nodes (23): AD_GROUP_MEDIA, AD_MEDIA, AdsCountry, adsHeaders(), adsPost(), AdsProfile, CAMPAIGN_MEDIA, createSbAdGroup() (+15 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.09
Nodes (42): BrandRow, COUNTRIES, STEPS, WizardStep, SegmentOption, Tabs(), TabsContent(), TabsList() (+34 more)

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
Cohesion: 0.14
Nodes (21): UPLOADABLE_COUNTRIES, UploadResponse, Asset, Block, Brand, newBlock(), Preset, ProductBlock() (+13 more)

### Community 9 - "Dashboard, Projects & Tools Registry"
Cohesion: 0.15
Nodes (15): sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), AutomationProject, defineProject(), ProjectInput (+7 more)

### Community 10 - "utils.ts"
Cohesion: 0.16
Nodes (18): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), NewPricePlanSheet(), nextStepPrice() (+10 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.14
Nodes (20): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), DropdownMenu(), DropdownMenuCheckboxItem() (+12 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.07
Nodes (27): Adding a New Project, Adding a new staff member, Adding a New Tool, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System, Database (Supabase), Environment variables (+19 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.08
Nodes (45): applyManualStep(), cancelPricePlans(), createBulkPricePlans(), createPricePlan(), listPricePlans(), PricePlan, PriceType, requirePlanAccess() (+37 more)

### Community 25 - "projects.ts"
Cohesion: 0.25
Nodes (13): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+5 more)

### Community 26 - "chart.tsx"
Cohesion: 0.29
Nodes (10): POST(), POST(), toRole(), clearSessionCookie(), getSecretKey(), setSessionCookie(), signSession(), verifySessionToken() (+2 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 42 - "sku-list.ts"
Cohesion: 0.13
Nodes (15): MarketplaceOptions(), formatPrice(), SkuDetailDialog(), Topbar(), Sheet(), SheetClose(), SheetContent(), SheetDescription() (+7 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.22
Nodes (7): ChatPanel(), markdownComponents, Button(), buttonVariants, Separator(), Skeleton(), Textarea()

### Community 44 - "page-header.tsx"
Cohesion: 0.19
Nodes (11): SettingsPage(), LoginForm(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+3 more)

### Community 45 - "mail.ts"
Cohesion: 0.12
Nodes (36): RFC-5322, buildRawMessage(), dedupeAddresses(), encodeHeaderText(), extractText(), fetchAndParseMessage(), fetchAndParseTitanMessage(), findSentMailbox() (+28 more)

### Community 46 - "sku-list.ts"
Cohesion: 0.10
Nodes (31): addSkus(), ColumnDetectSchema, ColumnMapping, deleteSku(), detectColumnHeuristically(), detectColumnWithAi(), DetectedSkuSheet, detectStatusColumnHeuristically() (+23 more)

### Community 47 - "getSession"
Cohesion: 0.23
Nodes (17): POST(), IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor(), POST(), DashboardPage() (+9 more)

### Community 48 - "roles.ts"
Cohesion: 0.17
Nodes (15): DirectoryEntry, TeamPage(), SidebarContent(), Sidebar(), getStaffDirectory(), canManageUsers(), EMPTY_PERMISSIONS, filterItems() (+7 more)

### Community 49 - "page.tsx"
Cohesion: 0.29
Nodes (13): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, createStaffMember(), deleteStaffMember(), getCurrentUser(), listStaff() (+5 more)

### Community 50 - "permissions.ts"
Cohesion: 0.24
Nodes (9): PpcTopUpLayout(), PriceChangePlansLayout(), CompanyInboxLayout(), MasterListLayout(), SponsoredBrandsUploadLayout(), ALL_ITEM_IDS, assertItemAccess(), sanitizePermissions() (+1 more)

### Community 51 - "page.tsx"
Cohesion: 0.20
Nodes (10): CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps, PageHeader(), SegmentedControl(), listMailAccounts() (+2 more)

### Community 52 - "communications.ts"
Cohesion: 0.40
Nodes (5): CommunicationItem, CommunicationItemInput, communicationItems, defineCommunicationItem(), slugify()

### Community 53 - "configuration.ts"
Cohesion: 0.40
Nodes (5): ConfigurationItem, ConfigurationItemInput, configurationItems, defineConfigurationItem(), slugify()

## Knowledge Gaps
- **205 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES`, `PriceTypeOption`, `SendResult` (+200 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `getSession` to `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `Dashboard, Projects & Tools Registry`, `build.ts`, `mail.ts`, `sku-list.ts`, `roles.ts`, `page.tsx`, `permissions.ts`, `page.tsx`, `sp-api.ts`, `chart.tsx`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Why does `cn()` connect `Sponsored Brands Bulk XLSX Builder` to `Shared UI Components & Layout Shell`, `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `product-block.tsx`, `sku-list.ts`, `tabs.tsx`, `page-header.tsx`, `roles.ts`, `page.tsx`, `badge.tsx`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `PPC Top-Up Automation`, `mail.ts`, `sku-list.ts`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES` to the rest of the system?**
  _208 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.07032967032967033 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.13768115942028986 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._