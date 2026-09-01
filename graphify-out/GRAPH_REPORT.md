# Graph Report - LaLaGreen-Automation-Portal  (2026-08-31)

## Corpus Check
- 112 files · ~73,903 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 859 nodes · 2284 edges · 47 communities (23 shown, 24 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `65117680`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- PPC Top-Up Automation
- Auth & Staff Management
- Package Dependencies (package.json)
- Sponsored Brands Upload - Campaign Data
- shadcn/ui Component Registry Config
- PPC Schedule AI Import
- TypeScript Config
- product-block.tsx
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
- getSession
- credentials.ts
- hash-password.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 94 edges
2. `getSession()` - 54 edges
3. `createServiceClient()` - 48 edges
4. `createClient()` - 44 edges
5. `requireStaff()` - 24 edges
6. `todaySgt()` - 17 edges
7. `Button()` - 16 edges
8. `CANONICAL_SLOTS` - 16 edges
9. `compilerOptions` - 16 edges
10. `sendMailReplyImpl()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `SettingsPage()` --calls--> `getCurrentUser()`  [EXTRACTED]
  app/(portal)/settings/page.tsx → lib/actions/staff.ts
- `AlertDialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `AlertDialogMedia()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `SheetOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/sheet.tsx → lib/utils.ts
- `PpcTopUpLayout()` --calls--> `assertItemAccess()`  [EXTRACTED]
  app/(portal)/automations/ppc-top-up/layout.tsx → lib/permissions.ts

## Import Cycles
- None detected.

## Communities (47 total, 24 thin omitted)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.09
Nodes (63): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+55 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.07
Nodes (51): POST(), BrandRow, IncomingCampaign, ResolveErr, resolveMarketplace(), ResolveOk, budgetFor(), POST() (+43 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (46): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable (+38 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.10
Nodes (40): COUNTRIES, STEPS, WizardStep, SegmentedControl(), SegmentOption, Tabs(), TabsContent(), TabsList() (+32 more)

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
Cohesion: 0.18
Nodes (14): ComposeDialog(), MODE_LABEL, SendResult, splitAddresses(), Button(), buttonVariants, Dialog(), DialogBody() (+6 more)

### Community 10 - "utils.ts"
Cohesion: 0.13
Nodes (22): addSkus(), ColumnDetectSchema, ColumnMapping, deleteSku(), detectColumnHeuristically(), detectColumnWithAi(), DetectedSkuSheet, detectStatusColumnHeuristically() (+14 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.05
Nodes (54): SettingsPage(), ChatPanel(), markdownComponents, LoginForm(), PageHeader(), Sidebar(), Avatar(), AvatarBadge() (+46 more)

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.07
Nodes (29): Adding a New Project, Adding a New Sales Item, Adding a new staff member, Adding a New Tool, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System, Database (Supabase) (+21 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.06
Nodes (66): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), MarketplaceOptions(), NewBulkPricePlanSheet(), NewPricePlanSheet() (+58 more)

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
Cohesion: 0.17
Nodes (18): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+10 more)

### Community 42 - "sku-list.ts"
Cohesion: 0.19
Nodes (11): UPLOADABLE_COUNTRIES, UploadResponse, Checkbox(), Sheet(), SheetClose(), SheetContent(), SheetDescription(), SheetFooter() (+3 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.05
Nodes (69): ACCESS_SECTIONS, accessSummary(), ManageUsersPage(), StaffMember, PpcTopUpLayout(), PriceChangePlansLayout(), CompanyInboxLayout(), MasterListLayout() (+61 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.08
Nodes (48): money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES, sgtDate() (+40 more)

### Community 45 - "mail.ts"
Cohesion: 0.09
Nodes (48): ComposeDialogProps, CompanyInboxPage(), formatDate(), MAIL_ACTIONS, ThreadView(), ThreadViewProps, RFC-5322, buildRawMessage() (+40 more)

### Community 47 - "getSession"
Cohesion: 0.15
Nodes (14): newBlock(), Preset, ProductBlock(), toLines(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent() (+6 more)

## Knowledge Gaps
- **217 isolated node(s):** `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES`, `PriceTypeOption`, `SendResult` (+212 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSession()` connect `Auth & Staff Management` to `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `build.ts`, `utils.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `Sponsored Brands Bulk XLSX Builder`, `sp-api.ts`, `chart.tsx`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Why does `cn()` connect `Sponsored Brands Bulk XLSX Builder` to `Sponsored Brands Upload - Campaign Data`, `product-block.tsx`, `sku-list.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `getSession`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies (package.json)` to `build.ts`, `Sponsored Brands Bulk XLSX Builder`, `mail.ts`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **What connects `StaffMember`, `ACCESS_SECTIONS`, `PRICE_TYPES` to the rest of the system?**
  _220 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.09192982456140351 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.07268170426065163 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._