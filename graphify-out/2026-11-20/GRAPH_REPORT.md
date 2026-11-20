# Graph Report - LaLaGreen-Automation-Portal  (2026-11-20)

## Corpus Check
- 245 files · ~194,801 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1919 nodes · 6235 edges · 75 communities (53 shown, 22 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.54)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `eb5aa7c3`
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
- page.tsx
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
- skeleton.tsx
- fba-fee-tracker.ts
- product-block.tsx
- fba-fee-calculator.ts
- server.ts
- permissions.ts
- fba-fee-calculator.ts
- getStaffDirectory
- credentials.ts
- session.ts
- page.tsx
- fba-fee-tracker-constants.ts
- page-header.tsx
- nav.ts
- marketplaces.ts
- page.tsx
- build.ts
- dashboard-access-grid.tsx
- marketplaces.ts
- alert-change.tsx
- layout.tsx
- listing-score.ts
- staff-drilldown.tsx
- nav.tsx
- getT
- listing-sheet.tsx
- pricing-update.ts
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `cn()` - 197 edges
2. `createServiceClient()` - 156 edges
3. `getSession()` - 126 edges
4. `createClient()` - 93 edges
5. `useT()` - 78 edges
6. `assertItemAccess()` - 49 edges
7. `Button()` - 42 edges
8. `getMyPermissions()` - 29 edges
9. `getT()` - 28 edges
10. `Skeleton()` - 27 edges

## Surprising Connections (you probably didn't know these)
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/dashboard/profit-analytics/page.tsx → lib/utils.ts
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/market-ops/automations/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts
- `SortTh()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/market-ops/automations/fba-fee-tracker/fba-fee-tracker-view.tsx → lib/utils.ts
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/market-ops/automations/trends/trends-view.tsx → lib/utils.ts
- `SortTh()` --calls--> `cn()`  [EXTRACTED]
  app/(portal)/market-ops/automations/trends/trends-view.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (75 total, 22 thin omitted)

### Community 0 - "calendar.ts"
Cohesion: 0.05
Nodes (140): DayTasksDialog(), DayView(), ManageAccessDialog(), layoutWeekRibbons(), MonthGrid(), RibbonCell, WEEKDAY_LABELS, formatDate() (+132 more)

### Community 1 - "PPC Top-Up Automation"
Cohesion: 0.05
Nodes (97): GET(), AcosScheduleCard(), isManualTopUpFuture(), LiveProjectionCard(), nextUpcomingSlot(), PpcTopUpPage(), relativeDayLabel(), statusBadgeClass() (+89 more)

### Community 2 - "Auth & Staff Management"
Cohesion: 0.15
Nodes (26): accessSummary(), ManageUsersPage(), StaffMember, changeOwnPassword(), createStaffMember(), deleteStaffMember(), listStaff(), renameStaffMember() (+18 more)

### Community 3 - "Package Dependencies (package.json)"
Cohesion: 0.04
Nodes (47): dependencies, @anthropic-ai/sdk, @base-ui/react, bcryptjs, class-variance-authority, clsx, date-holidays, @dnd-kit/core (+39 more)

### Community 4 - "Sponsored Brands Upload - Campaign Data"
Cohesion: 0.10
Nodes (36): GET(), LanguageCard(), changeLine(), dayLabel(), NotificationText, timeText(), timeValue(), useDayLabel() (+28 more)

### Community 5 - "shadcn/ui Component Registry Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 6 - "PPC Schedule AI Import"
Cohesion: 0.21
Nodes (30): PriorityBadge(), priorityBadgeClass(), StaffProfileView(), TaskSubmit, addFunctionalManager(), addTeamMember(), assignExistingResponsibility(), cleanTask() (+22 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "product-block.tsx"
Cohesion: 0.07
Nodes (22): PlaceholderPage(), adsBulkGenerator, advertisements, BASE_PATHS, bulkCampaignUpload, companyInbox, defineNavItem(), fbaFeeTracker (+14 more)

### Community 9 - "monday.com Dashboards — Comprehensive Reference"
Cohesion: 0.06
Nodes (66): RegionPicker(), RegionTag(), addRegionsTo(), addSkus(), addSkusGrouped(), ColumnDetectSchema, ColumnMapping, deleteSku() (+58 more)

### Community 10 - "utils.ts"
Cohesion: 0.08
Nodes (52): WorkflowDiagram(), fromForm(), LANG_KEYS, Save, Section, STEP_FIELDS, StepEditDialog(), StepForm (+44 more)

### Community 11 - "Sponsored Brands Bulk XLSX Builder"
Cohesion: 0.10
Nodes (30): money(), moneyIn(), ProfitAnalyticsPage(), RANGES, relativeTime(), SCOPE_CURRENCY, SCOPES, sgtDate() (+22 more)

### Community 13 - "Root Layout"
Cohesion: 0.11
Nodes (30): Row, BulkDimsResult, bulkUpdateTrueDims(), daysBefore(), DimsInput, DimsJson, FbaFeeOverview, FeeAlert (+22 more)

### Community 15 - "ESLint Config"
Cohesion: 0.40
Nodes (4): eslintConfig, I18N_ENFORCED, SHOWN, shownStrings

### Community 23 - "LaLaGreen Automation Portal — Developer Guide"
Cohesion: 0.05
Nodes (39): Adding a Layer-1 group, Adding a new staff member, Adding a page to an existing group, Adding an API route, Ads Bulk Generator tables, Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon"), Architecture, Auth System (+31 more)

### Community 24 - "sp-api.ts"
Cohesion: 0.09
Nodes (35): PasswordField(), DeleteFileDialog(), SaveFooter(), TeamEditDialog(), EditStepButton(), DepartmentDialog(), KIND_LABELS, knownLocations() (+27 more)

### Community 25 - "projects.ts"
Cohesion: 0.13
Nodes (29): resolveMarketplace(), budgetFor(), POST(), AD_GROUP_MEDIA, AD_MEDIA, AdsCountry, adsHeaders(), adsPost() (+21 more)

### Community 26 - "page.tsx"
Cohesion: 0.14
Nodes (22): daysRemaining(), EditPricePlanForm(), formatDate(), formatPrice(), HistoryTable(), NewBulkPricePlanSheet(), NewPricePlanSheet(), nextStepPrice() (+14 more)

### Community 27 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "build.ts"
Cohesion: 0.11
Nodes (27): buildRows(), FbaFeeTrackerView(), money(), pct(), relativeTime(), SkuDetail(), TierBadge(), tierLabel() (+19 more)

### Community 42 - "projects.ts"
Cohesion: 0.14
Nodes (27): DimsDiff(), dimsText(), Filter, num(), SortKey, SortTh(), StatTile(), DeleteScopeDialog() (+19 more)

### Community 43 - "tabs.tsx"
Cohesion: 0.11
Nodes (28): PortalLayout(), DashboardLink(), foldKey(), foldListeners, initials(), isActive(), memoryPins, NavGroupSection() (+20 more)

### Community 44 - "page-header.tsx"
Cohesion: 0.07
Nodes (48): FeeBreakdownBody(), addInto(), emptyTotals(), FeeBreakdown, FeeBreakdownFamily, FeeBreakdownType, FeeRow, getFeeBreakdown() (+40 more)

### Community 45 - "mail.ts"
Cohesion: 0.06
Nodes (79): ComposeDialogProps, CompanyInboxPage(), FOLDER_OPTIONS, formatDate(), MAIL_ACTIONS, Notice, viewKey(), ThreadView() (+71 more)

### Community 46 - "buildVideoBulk.ts"
Cohesion: 0.11
Nodes (30): AlertRankCell(), AsinDetail(), buildRows(), CategoryRank, Delta(), Filter, KIND_SEVERITY, rankText() (+22 more)

### Community 47 - "skeleton.tsx"
Cohesion: 0.18
Nodes (17): analyzeBulkPriceImport(), ColumnDetectSchema, ColumnMapping, detectColumnHeuristically(), detectColumnWithAi(), DetectedPriceImportSheet, detectTargetColumnHeuristically(), extractRowsFromSheet() (+9 more)

### Community 48 - "fba-fee-tracker.ts"
Cohesion: 0.12
Nodes (27): PartnerGrid(), PartnersView(), pricesHref(), Row, withField(), cleanShortName(), createPartner(), deletePartner() (+19 more)

### Community 49 - "product-block.tsx"
Cohesion: 0.11
Nodes (27): AcknowledgedCell(), COLUMNS, formatDate(), formatDateTime(), isBoolean(), isScope(), isSortKey(), notesTooltip() (+19 more)

### Community 50 - "fba-fee-calculator.ts"
Cohesion: 0.21
Nodes (8): ChatPanel(), sendAiChatMessage(), ChatMessage, generateAssistantReply(), chatToolDefinitions, runChatTool(), NAV_GROUPS, SUBGROUP_LABELS

### Community 51 - "server.ts"
Cohesion: 0.13
Nodes (23): IncomingCampaign, BrandCampaignInput, budgetFor(), buildBrandBulk(), COL, dedupeKeywords(), emptyRow(), MATCH_LABEL (+15 more)

### Community 52 - "permissions.ts"
Cohesion: 0.07
Nodes (30): POST(), POST(), GoalVsPerformanceLayout(), DashboardPage(), ProfitAnalyticsLayout(), AdvertisementsLayout(), AdsBulkGeneratorLayout(), FbaFeeTrackerLayout() (+22 more)

### Community 53 - "fba-fee-calculator.ts"
Cohesion: 0.13
Nodes (30): BrandLibrarySection(), distributeKeywords(), GenerateForm(), padBrandAsins(), readDraft(), shuffle(), AdsBulkGeneratorPage(), Step (+22 more)

### Community 54 - "getStaffDirectory"
Cohesion: 0.17
Nodes (22): imagesMissing(), ListingCard(), ListingSheet(), Align, ListingTable(), SortState, AmazonImg(), BAND_BG (+14 more)

### Community 56 - "session.ts"
Cohesion: 0.25
Nodes (12): POST(), POST(), toLocale(), setLocaleCookie(), toRole(), clearSessionCookie(), getSecretKey(), setSessionCookie() (+4 more)

### Community 57 - "page.tsx"
Cohesion: 0.16
Nodes (19): UPLOADABLE_COUNTRIES, UploadResponse, COUNTRIES, AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription() (+11 more)

### Community 58 - "fba-fee-tracker-constants.ts"
Cohesion: 0.12
Nodes (18): STEPS, WizardStep, Preset, AssetsSection(), BrandsSection(), KeywordGarageSection(), Badge(), badgeVariants (+10 more)

### Community 59 - "page-header.tsx"
Cohesion: 0.06
Nodes (45): SearchableSelect(), CalendarSidebar(), PriorityPill(), TextPair(), LengthBar(), BulletRatio(), Count(), Ratio() (+37 more)

### Community 60 - "nav.ts"
Cohesion: 0.15
Nodes (19): blockIssues(), BlockSummary, buildCampaigns(), buildName(), Campaign, campaignCountForBlock(), distributeKeywords(), shuffle() (+11 more)

### Community 61 - "marketplaces.ts"
Cohesion: 0.15
Nodes (18): BANDS, compareRows(), Filter, ListingScoreView(), OPPORTUNITIES, Row, SORT_VALUE, ViewMode (+10 more)

### Community 62 - "page.tsx"
Cohesion: 0.10
Nodes (42): AddPriceDialog(), formatPercent(), ImportPricesSheet(), PriceCell(), PriceRow(), ProductsView(), addProductPrice(), cleanDetails() (+34 more)

### Community 63 - "build.ts"
Cohesion: 0.07
Nodes (76): createBrand(), createKeywordTheme(), createVideoAsset(), deleteBrand(), deleteKeywordTheme(), deleteKeywordThemes(), deletePreset(), deleteProduct() (+68 more)

### Community 64 - "dashboard-access-grid.tsx"
Cohesion: 0.20
Nodes (13): AccessItem, DashboardAccessGrid(), Layout, layoutKey(), layoutListeners, memoryLayouts, parseLayout(), readLayout() (+5 more)

### Community 65 - "marketplaces.ts"
Cohesion: 0.20
Nodes (16): createSkill(), requireSkillsEditor(), Result, setStaffSkillLevel(), StaffSkillsView, tr(), Role, SessionPayload (+8 more)

### Community 66 - "alert-change.tsx"
Cohesion: 0.16
Nodes (15): BrandRow, IncomingCampaign, ResolveErr, ResolveOk, BaseCampaignInput, budgetFor(), buildSponsoredBrandsBulk(), CampaignInput (+7 more)

### Community 67 - "layout.tsx"
Cohesion: 0.11
Nodes (24): inter, metadata, RootLayout(), LoginPage(), OrgChartPage(), CORE_VALUES, CoreValue, CoreValues() (+16 more)

### Community 68 - "listing-score.ts"
Cohesion: 0.21
Nodes (16): bulkImportListingNotes(), BulkNotesResult, getListingDetail(), getListingScoreOverview(), ListingNotesInput, NOTE_COLUMN_LABELS, NoteColumn, noteColumnFor() (+8 more)

### Community 69 - "staff-drilldown.tsx"
Cohesion: 0.23
Nodes (8): workflowAccess(), GET(), POST(), StaffDrilldown(), Tab, getStaffProfile(), isValidScope(), canManageProfiles()

### Community 70 - "nav.tsx"
Cohesion: 0.29
Nodes (10): localizeNavGroup(), localizeNavItem(), NAV_TEXT_KEYS, NavText(), useSubgroupLabel(), Translator, NavGroup, NavItemInput (+2 more)

### Community 74 - "getT"
Cohesion: 0.17
Nodes (14): markdownComponents, TaskFormDialogProps, TaskFormInner(), todayLocal(), CharCount(), formatWhen(), TaskUpdates(), Textarea() (+6 more)

### Community 78 - "listing-sheet.tsx"
Cohesion: 0.09
Nodes (29): AlertActions(), AlertChange(), AlertHeading(), asImages(), asStrings(), BulletDiff(), imageId(), ImageRow() (+21 more)

### Community 79 - "pricing-update.ts"
Cohesion: 0.14
Nodes (17): MarketplaceOptions(), formatPrice(), MasterListPage(), matchesRegion(), PullFromAmazonSheet(), PullResult, RegionFilter, SkuDetailDialog() (+9 more)

## Knowledge Gaps
- **366 isolated node(s):** `StaffMember`, `SCOPE_CURRENCY`, `ActionResult`, `BrandLibraryItem`, `Step` (+361 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `page-header.tsx` to `calendar.ts`, `PPC Top-Up Automation`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `sp-api.ts`, `build.ts`, `projects.ts`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `getStaffDirectory`, `page.tsx`, `fba-fee-tracker-constants.ts`, `marketplaces.ts`, `page.tsx`, `dashboard-access-grid.tsx`, `getT`, `listing-sheet.tsx`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Why does `getSession()` connect `calendar.ts` to `PPC Top-Up Automation`, `Auth & Staff Management`, `Sponsored Brands Upload - Campaign Data`, `PPC Schedule AI Import`, `monday.com Dashboards — Comprehensive Reference`, `utils.ts`, `Sponsored Brands Bulk XLSX Builder`, `Root Layout`, `projects.ts`, `page.tsx`, `tabs.tsx`, `page-header.tsx`, `mail.ts`, `buildVideoBulk.ts`, `skeleton.tsx`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `server.ts`, `permissions.ts`, `fba-fee-calculator.ts`, `session.ts`, `page.tsx`, `build.ts`, `marketplaces.ts`, `listing-score.ts`, `staff-drilldown.tsx`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Why does `createServiceClient()` connect `build.ts` to `calendar.ts`, `PPC Top-Up Automation`, `marketplaces.ts`, `Sponsored Brands Upload - Campaign Data`, `listing-score.ts`, `staff-drilldown.tsx`, `PPC Schedule AI Import`, `monday.com Dashboards — Comprehensive Reference`, `utils.ts`, `page-header.tsx`, `Root Layout`, `buildVideoBulk.ts`, `fba-fee-tracker.ts`, `product-block.tsx`, `fba-fee-calculator.ts`, `page.tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **What connects `StaffMember`, `SCOPE_CURRENCY`, `ActionResult` to the rest of the system?**
  _369 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.050314465408805034 - nodes in this community are weakly interconnected._
- **Should `PPC Top-Up Automation` be split into smaller, more focused modules?**
  _Cohesion score 0.05293931731984829 - nodes in this community are weakly interconnected._
- **Should `Auth & Staff Management` be split into smaller, more focused modules?**
  _Cohesion score 0.1471264367816092 - nodes in this community are weakly interconnected._