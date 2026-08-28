@AGENTS.md

# LaLaGreen Automation Portal — Developer Guide

## Project Overview

Internal automation portal for LaLaGreen. Staff log in and access automation tools — each tool has its own dedicated page with custom controls. The only shared UI is the header/sidebar.

---

## Architecture

```
automation-portal/
├── app/
│   ├── layout.tsx                          # Root layout (fonts, metadata)
│   ├── page.tsx                            # Redirects to /dashboard
│   ├── login/page.tsx                      # Login page (username + password)
│   ├── api/auth/
│   │   ├── login/route.ts                  # POST /api/auth/login
│   │   └── logout/route.ts                 # POST /api/auth/logout
│   └── (portal)/                           # All protected pages live here
│       ├── layout.tsx                      # Sidebar + topbar shell
│       ├── dashboard/page.tsx              # Project grid (auto-populated)
│       ├── team/page.tsx                   # Read-only staff directory (username + role), visible to all staff
│       ├── admin/users/page.tsx            # Create staff accounts + manage roles (admin only)
│       └── automations/
│           └── ppc-top-up/page.tsx
├── components/
│   ├── ui/                                 # Base UI (Button, Input, Card, Skeleton, etc.)
│   ├── page-header.tsx                     # Shared page header for every automation
│   ├── sidebar.tsx / sidebar-content.tsx
│   ├── topbar.tsx                          # Mobile nav
│   ├── login-form.tsx
│   └── user-menu.tsx
├── lib/
│   ├── projects.ts                         # Single source of truth for all projects
│   ├── session.ts                          # JWT sign/verify/cookie helpers
│   ├── supabase/
│   │   ├── client.ts                       # Browser Supabase client
│   │   └── server.ts                       # Server Supabase client (Next.js cookies)
│   └── actions/
│       ├── index.ts                        # Re-exports all actions
│       └── staff.ts                        # listStaff, createStaffMember, getStaffDirectory, updateStaffMember, resetPassword, deleteStaffMember, getCurrentUser
├── middleware.ts                           # Route protection
└── .env.local                              # Secrets (see Environment Variables below)
```

---

## Auth System

### How it works

- **JWT** tokens signed with `JWT_SECRET` (via `jose`), stored as an HTTP-only cookie named `portal_session`
- Cookie is valid for **7 days**, secure in production, `sameSite=lax`
- `middleware.ts` runs on every request, redirects to `/login` if no valid session
- Staff accounts are stored in the Supabase `staff` table, identified by **username** (no email); passwords are bcrypt-hashed (cost 10)
- Roles: `"admin"` or `"user"` — only admins can access `/admin/*`. There are exactly two admins today (Brayden, Dobie); every other account is `"user"`
- There is no self-service signup or email/invite flow — admins create every account directly from `/admin/users`
- **Admins can only create `"user"` accounts.** Granting `"admin"` (whether creating a new account or promoting an existing one) is blocked in `createStaffMember`/`updateStaffMember` and must be done directly in the Supabase `staff` table — this is intentional, not a bug. The UI only ever offers demoting an admin to user, never the reverse

### Public routes (no auth required)

`/login`, `/api/auth/login`

### Login flow

1. User submits username + password → `POST /api/auth/login`
2. Server queries `staff` table by `username` (lowercased), verifies password with `bcryptjs`
3. On success: signs JWT with `{ username, role }`, sets `portal_session` cookie
4. Client redirects to `/dashboard`

### Adding a new staff member

Go to `/admin/users` → click **Create User** → enter a username and password. The account is created immediately as a `"user"` role — no email or confirmation step, and no way to make it an admin from the UI. Every staff member (any role) can see the full account list, read-only, at `/team`.

### Reading the session server-side

```typescript
import { getSession } from "@/lib/session";

const session = await getSession(); // { username, role } | null
```

### Environment variables

```bash
# .env.local
JWT_SECRET=<64-character hex string>
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

#### Amazon Advertising API (Sponsored Brands Upload → "Upload to Amazon")

Direct campaign upload uses the Amazon **Advertising** API, which is separate from
the SP-API credentials (`CLIENT_ID` / `CLIENT_SECRET` / `REFRESH_TOKEN`) used for
pricing/listings. The refresh token must be granted the `advertising::campaign_management`
scope; the LWA client id/secret may be the same app as SP-API or a different one.

```bash
# .env.local — Amazon Ads API (advertising scope). Only these three are required.
ADS_CLIENT_ID=<LWA client id>
ADS_CLIENT_SECRET=<LWA client secret>
ADS_REFRESH_TOKEN=<refresh token with advertising::campaign_management scope>

# Optional — pin a specific advertising profile. Omit to auto-resolve by marketplace.
# ADS_PROFILE_ID_US=3041144588979787
# ADS_PROFILE_ID_CA=<CA advertising profile id>
```

Profile ids are resolved automatically at upload time from
`GET https://advertising-api.amazon.com/v2/profiles` (matching the campaign's
marketplace by `countryCode`, preferring a seller account) — so only the three
OAuth values above are needed. Set `ADS_PROFILE_ID_US` / `ADS_PROFILE_ID_CA` only
to override that lookup. Without the OAuth creds, "Download bulk file" still works;
"Upload to Amazon" surfaces a clear error. Client logic lives in
`lib/amazon/ads-api.ts`; the route is `app/api/tools/sponsored-brands-upload/upload/route.ts`.

---

## Database (Supabase)

Project ID: `fuynizhfhfnvbdzwihgp`

### `staff` table

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK, auto-generated |
| `username` | `text` | Unique, lowercase, `^[a-z0-9_-]{3,32}$` |
| `password_hash` | `text` | bcrypt, cost 10 |
| `role` | `text` | `"admin"` or `"user"` |
| `created_at` | `timestamptz` | Auto |

### PPC ACOS Top-Up tables

Extends the PPC Top Up automation with **per-campaign** budget top-ups, separate from the
country-level daily cap schedule (`ppc_topup_countries` / `ppc_topup_schedule` above).

> **This only ever applies to campaigns that are out of budget (OOB) at that moment.** Every 10
> minutes the external n8n/Python process lists the campaigns currently OOB, and only those are
> evaluated. A campaign comfortably within budget is never touched, whatever its ACOS. These are
> not general budget schedules.

For each OOB campaign the process computes **both** ACOS figures — today's and 14-day — matches
each to a band in `ppc_acos_topup_schedule` **at the current 10-minute slot**, and, if neither cap
in `ppc_acos_topup_band_settings` **for that matched (metric, band)** would be breached (checked
against `ppc_acos_topup_log`), raises that campaign's budget by the matched `topup_amount` via the
Ads API, then writes a row to `ppc_acos_topup_log`. The two metrics are independent: one campaign
can receive a today-ACOS top-up and a 14-day-ACOS top-up in the same tick, each gated by its own
caps. This portal only owns the configuration and the audit log view; it does not call Amazon
directly for this feature.

> Caps have moved twice: flat-per-country → per-band → now **per (metric, band)**. Today's `0-10`
> band and 14-Day's `0-10` band have fully independent "max budget" and "max individual campaign
> budget" values, edited via a small settings icon in each band's column header on the Today-ACOS
> / 14-Day-ACOS schedule cards. There is no longer a standalone "ACOS Top-Up" settings card in the
> portal — the old marketplace-wide Enabled/Disabled toggle and the audit-log view were removed
> from the UI along with it (deliberate simplification, confirmed with the user; both were still
> at their defaults — `enabled=false` for every country — when removed). `ppc_acos_topup_settings`
> and `ppc_acos_topup_log` **tables still exist in the DB**, they just have no portal UI anymore.

> **Band cut-offs and the per-band on/off toggle are staff-editable**, from that same gear icon,
> per `(country_code, acos_metric, band_key)`. The four ranges are fully independent — gaps and
> overlaps are legal; a gap means no top-up, an overlap resolves to the first band in fixed order
> (`0-10` → `10-20` → `20-30` → `30-plus`). Band 1's min is pinned to 0 and band 4's max is pinned
> to unbounded (`null`); only the interior edges of all four bands, and each band's `enabled` flag,
> are editable. A disabled band's column greys out in the grid and its stored amounts are excluded
> from both totals, but are kept (not zeroed) so re-enabling it restores them. `acos_band()` /
> `bands_for_metric()` in `sp_account_budget.py` (PPC-Task repo) read these edges and the toggle
> live every run — see `formatBandLabel()` in `lib/ppc-acos-topup-constants.ts` for how a band's
> display label is derived from its bounds.

> **The two ACOS grids show 48 half-hour rows (`HALF_HOUR_SLOTS`), not the 144 ten-minute rows of
> `ppc_topup_schedule`'s daily-cap grid.** This is a portal-UI-only change — `ppc_acos_topup_schedule`
> still holds all 144 ten-minute rows per `(country, metric, band)`, and the external process still
> floors to a 10-minute slot every run (`current_slot()`, unchanged). Saving a half-hour row writes
> the entered amount into its `:00`/`:30` **head** sub-slot and `0` into the two 10-minute sub-slots
> after it (`subSlotsFor()`), so the job's three ticks inside that half hour pay out exactly once.

> **Backend status (2026-07-31): wired, running in testing mode.** The external process
> (`LaLaGreen-PPC-Task`, sibling repo) now reads these tables live on every `/budget` run —
> `classify_acos_bands()` in `sp_account_budget.py` looks up `ppc_acos_topup_schedule` at the
> current 10-minute slot and caps by `(country_code, acos_metric, band_key)` in
> `ppc_acos_topup_band_settings`, so portal edits take effect on the next tick. Two caveats:
>
> - **`TESTING_MODE = True`** in `indiv_campaign_settings.py` — it computes, logs and reports the
>   full result but makes **no Amazon call**, and the Telegram report is suffixed `(Testing)`.
>   Rows written in this mode carry `is_test = true`. Going live is `TESTING_MODE = False` plus
>   `DELETE FROM ppc_acos_topup_log WHERE is_test;` so the daily caps restart from zero.
> - **`ppc_acos_topup_settings.enabled` is not consulted.** It lost its portal toggle and the
>   backend deliberately ignores it; on/off lives in `TOP_UP_INDIV_CAMPAIGN` in
>   `indiv_campaign_settings.py`. Don't reintroduce a dependency on that column without also
>   restoring a UI for it.
>
> Requires `acos_topup_migration.sql` **and** `acos_band_ranges_migration.sql` (both in the
> PPC-Task repo's `sql/`) to have been applied.

**`ppc_acos_topup_band_settings`** — one row per `(country_code, acos_metric, band_key)`, 4 rows
per (country, metric), 8 per country:

| Column | Type | Notes |
|---|---|---|
| `country_code` | `text` | Composite PK with `acos_metric`, `band_key`; matches `ppc_topup_countries.country_code` |
| `acos_metric` | `text` | `"today"` \| `"14d"` — independent caps per metric |
| `band_key` | `text` | `"0-10"` \| `"10-20"` \| `"20-30"` \| `"30-plus"` |
| `max_daily_topup_total` | `numeric` | "Max budget" — total $ across **all** campaigns in this (metric, band), this marketplace, per day |
| `max_campaign_budget` | `numeric` | "Max individual campaign budget" — highest daily budget one campaign in this (metric, band) may be raised to |
| `enabled` | `bool` | Off = skipped entirely — no top-up for a campaign whose ACOS falls here, neighbouring bands don't widen to cover it. Default `true` |
| `min_acos` | `numeric` | Half-open range start `[min_acos, max_acos)`. Pinned to `0` on `"0-10"` |
| `max_acos` | `numeric \| null` | Half-open range end. `null` = unbounded above; only ever `null` on `"30-plus"` |
| `updated_at` | `timestamptz` | Auto |

Added by `acos_band_ranges_migration.sql` (PPC-Task repo, `sql/`) — backfilled to the original
hardcoded `0/10/20/30` edges with `enabled = true`, so nothing changes until staff edit something.

**`ppc_acos_topup_schedule`** — 144 slots × 4 bands × 2 metrics = **1152 pre-seeded rows per
`country_code`**, all seeded to `0`; only `topup_amount` is editable. Slots are the same 144
ten-minute labels as `ppc_topup_schedule` (`CANONICAL_SLOTS` in `lib/ppc-daily-cap-constants.ts`),
and the table's row count and grain are unchanged. **The portal UI itself now edits only 48
half-hour rows** (`HALF_HOUR_SLOTS`) — see the note above; a `topup_amount` you see on screen is
always a slot's `:00`/`:30` head value, and its two 10-minute sub-slots are always `0`.

| Column | Type | Notes |
|---|---|---|
| `country_code` | `text` | Composite PK with `acos_metric`, `slot_time`, `band_key` |
| `acos_metric` | `text` | `"today"` \| `"14d"` — one grid each, both active |
| `slot_time` | `text` | `"HH:MM"`, one of the 144 canonical slots |
| `band_key` | `text` | `"0-10"` \| `"10-20"` \| `"20-30"` \| `"30-plus"` |
| `topup_amount` | `numeric` | $ top-up when an OOB campaign's ACOS falls in this band at this slot |
| `updated_at` | `timestamptz` | Auto |

> 1152 rows/country exceeds PostgREST's default 1000-row cap, so `getAcosTopupConfig(countryCode)`
> fetches **per (country, metric)** — 576 rows each — and errors if a query returns anything other
> than `EXPECTED_SCHEDULE_ROWS`. A truncated grid must never render as complete: staff saving one
> would wipe the missing slots.

**`ppc_acos_topup_log`** — audit trail, written by the external process after each applied top-up,
read-only from the portal. Also the **source of truth for the `max_daily_topup_total` cap**: each
run sums today's rows per `(metric, band)` via the `acos_topup_totals_today` RPC, so a row here is
not just a record — it consumes that band's remaining daily budget. One row per
`(campaign, metric)`: a campaign topped up on both grids in the same tick writes two.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `country_code` | `text` | |
| `campaign_id` | `text` | Amazon campaign id |
| `campaign_name` | `text` | Denormalized for display |
| `acos_metric` | `text` | `"today"` or `"14d"` — which of the two grids fired |
| `acos_value` | `numeric` | ACOS at the time of the check |
| `band_key` | `text` | Which band matched |
| `slot_time` | `text` | `"HH:MM"` slot the top-up fired in; `null` for pre-schedule rows |
| `topup_amount` | `numeric` | $ applied |
| `previous_budget` | `numeric` | |
| `new_budget` | `numeric` | |
| `applied_at` | `timestamptz` | |
| `marketplace_date` | `date` | Which marketplace day the cap counts this against. Written explicitly, **not** derived from `applied_at` — the US/CA day rolls over at 15:00 SGT, so grouping on `applied_at`'s calendar date would split one day in two and reset the cap early |
| `is_test` | `bool` | `true` = simulated (`TESTING_MODE`), never sent to Amazon. Still counts toward the daily cap so the limit is exercised; purge before going live |
| `is_manual` | `bool` | `true` = this payout came from a `ppc_acos_manual_topups` row, not the recurring grid |
| `manual_topup_id` | `uuid` | The `ppc_acos_manual_topups` row that scheduled it; `null` for grid payouts |
| `created_at` | `timestamptz` | Auto |

**`ppc_acos_manual_topups`** — one-off staff top-ups for the ACOS section, the grids' analogue of
the daily cap's `ppc_manual_topups`. Widget lives inside each `AcosScheduleCard` (a second
`CardContent` between the grid and the footer, one per metric); server actions in
`lib/actions/ppc-acos-manual-topups.ts` (`listAcosManualTopUps` / `createAcosManualTopUp` /
`cancelAcosManualTopUp`, mirroring `ppc-manual-topups.ts` — RLS-client reads, service-client
writes, cancel is a hard DELETE of pending+future rows). DDL:
`LaLaGreen-PPC-Task/sql/acos_manual_topups_migration.sql`.

Key semantics, different from the daily-cap widget:

- A row is **(country, metric, band, target_date, slot_time, amount)** — the band picker offers
  only **enabled** bands (create also re-checks server-side: a disabled band can never match, so
  the row would just die), and the **slot picker offers all 144 ten-minute `CANONICAL_SLOTS`**,
  not `HALF_HOUR_SLOTS` — paying between the grid's half-hour heads is the point of the feature.
- **One shot, no carry-forward.** Only the backend run landing exactly on that 10-minute slot
  (same marketplace day) consumes it, paying every OOB campaign in the band the full amount ON TOP
  of the grid's payout and **bypassing `max_campaign_budget`**. Anything else — missed tick, no
  matching campaign, band since disabled — and the backend flips it to **`expired`** (styled
  destructive in `statusBadgeClass`, distinct from cancelled): "it never paid and never will".
- Unique on `(country_code, acos_metric, band_key, target_date, slot_time)` — a duplicate insert
  surfaces as "already scheduled for this band and slot".

### Profit Analytics tables

Backs `/sales/profit-analytics` (Phase 1: revenue / Amazon fees / gross margin per
marketplace). **The portal only ever reads these** — every row is written by the sibling
`LaLaGreen-Daily-Report` repo's `reportlib/profit_sync.py`, on its own ~2-hourly n8n schedule
(`n8n/profit-sync.json` → `POST /sync-profit`), which is separate from that repo's unchanged
once-daily 12:00 SGT Excel workbook job. DDL:
`LaLaGreen-Daily-Report/Daily-Report/sql/profit_dashboard_migration.sql`.

> Editing `profit_sync.py` (or anything else under `LaLaGreen-Daily-Report`) does **not**
> redeploy from a git push — that repo runs as a hand-uploaded Docker container on the VPS, out
> of sync with git by design. See that repo's own `.claude/CLAUDE.md` → "Deployment (VPS)" for
> the full upload/rebuild/verify procedure and the gotchas already hit doing it (partial
> uploads leaving stale code, the container losing its n8n network attachment on every
> recreate). If a session touches that repo's `.py` files, flag the redeploy need there, not
> here — this portal's own deploy (`git push` → Vercel via GitHub Actions) is unrelated and
> automatic.

> **Settlement reports are the only source of Amazon's actual, final fees, and Amazon issues
> them roughly every 1–2 weeks per marketplace** — not on a schedule the seller controls. The
> 2-hourly cadence buys *latency* (a new settlement reaches the dashboard within ~2h of being
> finalized), not freshness: most runs correctly find nothing new. There is deliberately no
> "today's profit" figure in Phase 1 — the near-real-time estimate layer (orders-based revenue
> with modeled fees, superseded once settlement data lands) is Phase 2.

> **Amounts are stored exactly as Amazon reports them: revenue positive, fees negative.** So
> `gross_margin = revenue + total_fees`, never a subtraction, and any "fees" number shown to
> staff is negated at the display layer only. Gross margin is *before* product cost — there is
> no COGS anywhere in this system yet (Phase 3), so this is explicitly **not** net profit.

**`profit_daily_metrics`** — one row per `(metric_date, country_code, source, source_ref)`.

| Column | Type | Notes |
|---|---|---|
| `metric_date` | `date` | **SGT** calendar date, not UTC — matches the rest of the portal's marketplace-day convention |
| `country_code` | `text` | `US` \| `CA` \| `MX`. Never an `ALL` roll-up row — the Consolidated view sums across marketplaces at query time |
| `source` | `text` | `settlement` (Phase 1) \| `estimate` (Phase 2) |
| `source_ref` | `text` | The settlement `report_id`, or the literal `estimate`. Part of the unique key — see below |
| `revenue` / `total_fees` / `fba_fees` / `referral_fees` / `other_fees` / `gross_margin` | `numeric` | `other_fees` is denormalized (`total_fees − fba − referral`) so the 3-way fee tile needs no join |
| `units` / `orders` | `integer` | Gross units sold, before returns |

> **`source_ref` is in the unique key because one date can legitimately receive money from two
> different settlement reports.** Amazon can finalize concurrent settlements for the *same*
> marketplace with overlapping periods (observed on this account: a $647.56 secondary cycle
> sitting inside a $165,747 regular one). Keying on `(metric_date, country_code)` alone would
> make the second report's upsert silently overwrite the first one's money. Each report instead
> writes its own row per date and **readers SUM across `source_ref`** — additive across reports,
> idempotent within one. Nothing may assume one row per `(date, country)`.

**`profit_ingested_settlement_reports`** — `report_id` (PK) ledger, checked before any parsing
so the ~84 no-op runs/week cost one indexed lookup. Also stores `reconciliation_delta` /
`reconciled`: every settlement's rows must sum to its own `total-amount`, verified to the cent
across all cached reports, so a non-zero delta means rows were dropped or misparsed and that
period's figures are not trustworthy (surfaced as an amber banner on the page).

**`profit_sync_runs`** — append-only run log (same shape as `ppc_acos_topup_log`); powers the
"Synced Xh ago" badge. n8n alerts to Telegram **only on error/timeout** — a success ping every
2 hours saying "0 new settlements" would be pure noise.

> **Backend status (2026-08-22): Phase 1 live in production.** First sync (run by hand, before
> the n8n schedule was activated) ingested all 20 settlement reports visible on the account —
> US/CA/MX, spanning 2025-05-15 to 2026-08-21 — every one reconciled to the cent. A second
> immediate re-run ingested 0 (idempotency confirmed: same report list, all already in the
> ledger). Phase 1.5 (goals), Phase 2 (fee drill-down + orders-based estimate), and Phase 3
> (COGS) are not built yet.

> **There is a ~13-month reporting void (June 2025 – June 2026) in `profit_daily_metrics`,
> first found 2026-08-26 — recoverable, but not via the Settlement Reports path.** Amazon's
> `getReports` operation (`settlement._list_settlement_reports()` in the sibling
> `LaLaGreen-Daily-Report` repo, `reportlib/settlement.py`) hard-caps `createdSince` at 90
> days — confirmed live by passing 730 days back and getting `SellingApiBadRequestException:
> RequestedFromDate ... is more than 90 days old`. That filters on each report's own
> *creation* time, not the data period it covers, and no `max_pages`/pagination reaches past
> it — this part is a real, permanent ceiling on that one endpoint, not a bug.
>
> **However, a same-day follow-up test (2026-08-28, `test_finances_api.py` at the
> Daily-Report repo root, standalone/read-only) proved the gap itself is not permanent**: the
> Finances API v0's `listFinancialEventGroups` operation sees the same underlying
> transactions on a completely different, non-90-day-capped path. A live call with a 360-day
> lookback returned 100 groups (page-capped — more exist via `NextToken`), **76 of them
> starting before 2026-06-01**, i.e. inside the supposed gap. First bug hit while testing:
> `listFinancialEventGroups` takes `FinancialEventGroupStartedAfter` /
> `FinancialEventGroupStartedBefore` — **not** `PostedAfter`/`PostedBefore` (those belong to
> the sibling `listFinancialEvents` operation only). Passing the wrong names doesn't error,
> it silently no-ops, which is why every first attempt failed with a content-free
> `InvalidInput: Date range is not valid, startDate: null, endDate: null` regardless of what
> values were actually sent — confirmed by cross-checking Amazon's own OpenAPI spec
> (`amzn/selling-partner-api-models`, `financesV0.json`) rather than trusting memory a second
> time. `listFinancialEventsByGroupId` (for pulling one group's line items) does take
> `PostedAfter`/`PostedBefore`, but per a known upstream SDK issue
> (amzn/selling-partner-api-models#2325) **ignores them and returns the group's full data
> regardless** — treat any date filter on that call as decorative, not a guarantee.
>
> **Not yet built**: a real backfill/ingestion pipeline using this path. `test_finances_api.py`
> is a throwaway feasibility script (no Supabase writes, no pagination beyond page 1) — a
> production version needs `NextToken` pagination on `listFinancialEventGroups`, a decision on
> whether to map `ShipmentEventList`/`ItemChargeList`/`ItemFeeList` into the *same*
> `profit_daily_metrics` shape `feetypes.classify_fee()` already produces (so the two sources
> are indistinguishable downstream) or a separate `source='finances_backfill'` value, and a
> deliberate one-time-only trigger (this is filling a historical hole, not a recurring sync
> path — don't wire it into the 2-hourly `run_sync()` job).

> **Settlement date formats differ per marketplace and getting it wrong loses or misdates real
> money.** CA reports use dotted day-first (`10.07.2026` = 10 July); US/MX use ISO
> (`2025-07-24`). Parsing everything with pandas' default `dayfirst=False` drops `10.07.2026`
> entirely (caught in development: 1,082 CA rows worth $4,219.84, 77% of that settlement) and,
> worse, silently reads `05.07.2026` as **May 7** instead of 5 July. `profit_sync._parse_mixed_dates`
> detects the format per row, the same way `settlement._parse_settlement_date` does for its own
> dates. The reconciliation check above is what caught this — keep it.

### Supabase clients

```typescript
// Server components / actions / API routes
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();

// Client components (browser)
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
```

---

## Server Actions

All server actions live in `lib/actions/` and follow the `{ data, error }` return shape.

```typescript
import { listStaff, createStaffMember, getCurrentUser } from "@/lib/actions/staff";

const { data, error } = await listStaff();
```

Admin-only actions (`listStaff`, `createStaffMember`, `updateStaffMember`, `resetPassword`, `deleteStaffMember`) call `requireAdmin()` internally and return `{ data: null, error: "Unauthorized" }` if the session role isn't `"admin"`. `getStaffDirectory` (backs `/team`) and `getCurrentUser` only require a valid session — any authenticated staff member, not just admins.

> **Never export a plain constant (or a re-exported type) from a `"use server"` file for a
> client component to import.** Every export of a `"use server"` module is rewritten into a
> server-action reference by Turbopack's per-file transform, which works from syntax, not full
> type information. Hit this twice building Profit Analytics: exporting `PROFIT_COUNTRIES`
> (a plain array) directly from `lib/actions/profit-analytics.ts` rendered as `undefined`
> client-side (`.map is not a function`) — `tsc`/`eslint`/`next build` all passed anyway, since
> nothing about this is a compile error, only a runtime one a browser actually evaluating the
> bundle exposes. The fix (moving `PROFIT_COUNTRIES` to a plain sibling module,
> `lib/profit-analytics-constants.ts`) then tripped a second variant: re-exporting an *imported*
> type via `export type { X }` (as opposed to a type declared locally in the same file) produced
> a `ReferenceError: X is not defined` inside the compiled server-actions module. Locally
> declared types/interfaces (`export interface Foo {}`) are always safe to export from a
> `"use server"` file — they emit no JS at all — but constants and re-exported imported types
> are not. Put those in a separate, non-`"use server"` module and have every consumer (action
> file included) import from there directly, never through the action file.

---

## Adding a New Project

Every project needs two things: a definition in `lib/projects.ts` and a page file.

### Step 1 — Define the project (`lib/projects.ts`)

```typescript
import { BarChart3 } from "lucide-react"; // pick any lucide icon

export const salesMetrics = defineProject({
  name: "Sales Metrics",
  description: "Real-time sales performance dashboard",
  icon: BarChart3,
});

// Add it to the projects array — this auto-updates sidebar + dashboard
export const projects: AutomationProject[] = [
  ppcAdUpdates,
  inventoryReports,
  salesMetrics, // <-- add here
];
```

The `id` and `href` are auto-derived from the name (e.g. `"Sales Metrics"` → `id: "sales-metrics"`, `href: "/automations/sales-metrics"`).

### Step 2 — Create the page

Create `app/(portal)/automations/sales-metrics/page.tsx`:

```typescript
"use client"; // only needed if the page has interactivity

import { PageHeader } from "@/components/page-header";
import { salesMetrics } from "@/lib/projects";

export default function SalesMetricsPage() {
  return (
    <>
      <PageHeader
        icon={salesMetrics.icon}
        title={salesMetrics.name}
        description={salesMetrics.description}
      />
      {/* Everything below here is completely custom — no shared layout constraints */}
      <div className="p-6 md:p-8">
        {/* your controls, tables, forms, etc. */}
      </div>
    </>
  );
}
```

That's it. The project now appears in the sidebar and dashboard automatically.

### Step 3 — Add an API route (if needed)

Create `app/api/your-route/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // your logic here
  return NextResponse.json({ data: [] });
}
```

---

## Adding a New Tool

The sidebar and dashboard also have a separate "Tools" section, below Automations, sourced from `lib/tools.ts`. It follows the exact same pattern as `lib/projects.ts`, just under a different heading and route prefix. The "Tools" heading always renders (like "Automations"), even when the `tools` array is empty.

### Step 1 — Define the tool (`lib/tools.ts`)

```typescript
import { Wrench } from "lucide-react"; // pick any lucide icon

export const labelPrinter = defineTool({
  name: "Label Printer",
  description: "Print shipping labels in bulk",
  icon: Wrench,
});

// Add it to the tools array — this auto-updates sidebar + dashboard
export const tools: AutomationTool[] = [
  labelPrinter, // <-- add here
];
```

The `id` and `href` are auto-derived from the name (e.g. `"Label Printer"` → `id: "label-printer"`, `href: "/tools/label-printer"`).

### Step 2 — Create the page

Create `app/(portal)/tools/label-printer/page.tsx` following the same `<PageHeader>` pattern as an automation page (see "Adding a New Project" above) — just import from `@/lib/tools` instead of `@/lib/projects`.

---

## Adding a New Sales Item

A third nav category, "Sales", sits **above** Automations in both the sidebar and dashboard, sourced from `lib/sales.ts`. Same pattern again: `SalesItem` / `defineSalesItem()` / `salesItems` array, route prefix `/sales/<id>`, guarded per-page via `assertItemAccess("sales", "<id>")` in that page's own `layout.tsx`. Currently holds only Profit Analytics (`app/(portal)/sales/profit-analytics/`). Follow the same two-step pattern as "Adding a New Tool" above, importing from `@/lib/sales` instead.

Adding a category is bigger than adding an item within one: it also means a new entry in `Section` (`lib/roles.ts`), `PermissionSet`/`EMPTY_PERMISSIONS`/`toPermissionSet()` (`lib/roles.ts`), `ALL_ITEM_IDS`/`sanitizePermissions()` (`lib/permissions.ts`), the sidebar's per-section render block (`components/sidebar-content.tsx`), the dashboard's `accessGroups` array (`app/(portal)/dashboard/page.tsx`), and the admin permissions editor's `ACCESS_SECTIONS` (`app/(portal)/admin/users/page.tsx`) — all touched in lockstep when Sales was added. No DB migration is needed for a new section: `staff.permissions` is untyped jsonb and `toPermissionSet()` defaults any missing key to `[]`.

---

## Page Header Component

Every automation page uses `<PageHeader>` at the top:

```typescript
import { PageHeader } from "@/components/page-header";

<PageHeader
  icon={project.icon}               // LucideIcon component
  title={project.name}              // string
  description={project.description} // string
/>
```

Below `<PageHeader>`, each page is entirely custom — there are no shared layout constraints.

---

## Key Conventions

| Pattern | Detail |
|---|---|
| Server components | Default for pages and layouts |
| Client components | Add `"use client"` at top when using hooks/state/events |
| Server actions | `"use server"` in `lib/actions/`; return `{ data, error }` |
| Icons | Always from `lucide-react` |
| Styling | Tailwind CSS utilities; `cn()` from `@/lib/utils` to merge classes |
| Path aliases | `@/` maps to project root |
| UI primitives | `components/ui/` (Button, Input, Card, Skeleton, Badge, etc.) |

---

## Key File Reference

| File | Purpose |
|---|---|
| `lib/projects.ts` | Add/edit automation projects |
| `lib/tools.ts` | Add/edit tools (separate "Tools" nav section) |
| `lib/sales.ts` | Add/edit sales items (separate "Sales" nav section, above Automations) |
| `lib/session.ts` | JWT sign/verify/cookie helpers |
| `lib/supabase/server.ts` | Supabase client for server-side code |
| `lib/supabase/client.ts` | Supabase client for browser code |
| `lib/actions/staff.ts` | Staff CRUD, `createStaffMember`, `getStaffDirectory`, `getCurrentUser` |
| `middleware.ts` | Route protection + role-based redirects |
| `app/(portal)/layout.tsx` | Sidebar + topbar shell |
| `app/(portal)/admin/users/page.tsx` | Create staff accounts and manage roles |
| `app/(portal)/team/page.tsx` | Read-only staff directory (visible to all staff) |
| `components/page-header.tsx` | Shared header for automation pages |
| `.env.local` | All secrets and env config |

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
