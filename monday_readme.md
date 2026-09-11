# monday.com Dashboards — Comprehensive Reference

> Sourced from official monday.com support documentation (support.monday.com).
> Covers: Dashboards overview, configuration, permissions, filtering, sharing/presenting, and mondayDB 2.0.

---

## 1. What are Dashboards?

A Dashboard is a centralized reporting view that pulls data from multiple connected boards and displays it through widgets. It sits as a read/reporting layer on top of your boards — the columns that exist on connected boards determine what each widget can show.

- Dashboards support **30+ widget types** (Chart, Calendar, Numbers, Timeline, Table, Battery, Files Gallery, Workload, Gantt, etc.).
- A dashboard holds **up to 30 widgets**. Text Widgets are excluded from this count.
- You connect boards to the dashboard; widgets then read specific column data from those boards.
- If you use **Connect Boards Columns** or **Mirror Columns** across boards, that data is also available to widgets — enabling cross-board reporting without manually duplicating data.

---

## 2. What Data Can a Dashboard Show?

Dashboards aggregate **item and column data** from any boards you connect. You can connect boards from different workspaces or portfolios and surface their data side by side.

### Data types and caveats

| Data Type | Available? | Notes |
|---|---|---|
| Board column data | ✅ Yes | Only columns that exist on connected boards |
| Mirror columns | ✅ Yes | Only if mirror is correctly set up and board is connected with right permissions |
| Connect Boards column data | ✅ Yes | Cross-board linked data |
| Portfolio-scoped data (project Overview tab, portfolio automations, portfolio rollups) | ❌ No | Scoped to one portfolio; not available as board columns. Bring into a board column first |
| External data (Excel, external tools) | ❌ Direct | Must be imported via import tool, sync integration, or API first |

### Column matching
When multiple boards share identical column types and names, you can match them:
- **All at once** — automatic matching across all connected boards
- **One by one** — manual selection per board
- Numbers in the UI show how many boards share each column
- Dashboard-wide column matching is configurable via the cog-wheel icon in top-right

---

## 3. Plan Limits

### Connected boards per plan
| Plan | Max Connected Boards |
|---|---|
| Free | 1 |
| Standard | 5 |
| Pro | 20 |
| Enterprise | 50 |

### Item limits
- **Max 20,000 total items** (items + subitems + linked items) across all connected boards per dashboard.
- Dashboards with **3,000+ items** using only supported widgets are automatically upgraded to a higher-performance engine (mondayDB 2.0 — Enterprise only).
- If you exceed limits, a warning prompts you to disconnect some boards or use filters to reduce load.

### Scheduled PDF exports per plan
| Plan | Max Scheduled Exports |
|---|---|
| Standard | 1 |
| Pro | 5 |
| Enterprise | 100 |

---

## 4. Creating a Dashboard

**Method 1:** Click the `+` below the workspace name → select **New Dashboard**.

**Method 2:** Click the three-dot menu within a folder in your workspace → **Create in folder** → **New Dashboard**.

**Deletion:** A dashboard can be **deleted but not archived**. Only the owner can do this via the three-dot menu next to the dashboard name → **Delete**.

---

## 5. Dashboard Types (Visibility)

| Type | Who Can See It |
|---|---|
| Public (Main) | Everyone in your account — all account users become members automatically |
| Private | Only the owner + team members/guests the owner explicitly invites |

**Note:** Enterprise plan admins can view high-level metadata (name, subscribers, creation date) of private dashboards through the content directory, even if they're not invited.

---

## 6. Configuring a Dashboard

### Connecting boards
- Use the search bar or scroll through recently used boards in the **Connect boards** picker.
- Select boards via checkboxes.
- There is a checkbox option to let newly connected boards automatically populate existing widgets (enabled by default).
- If a board doesn't appear in the picker:
  - You must be subscribed to the workspace where the board lives.
  - You must have at least view-level permission on the board.
  - Ask the board owner to share it with you if needed.

### Adding widgets
- Click the **Add widget** icon and select your widget type.
- Access widget settings via the three-dot menu in the widget's top-right corner.

### Edit vs. View mode
- Toggle between **Edit** and **View** using the center button above widgets.
- Only Dashboard **Owners** can move, resize, or edit widgets in Edit mode.
- Members invited as Viewers or Subscribers cannot change layout.

### Live data settings
- **Live data ON:** Real-time editing; data refreshes immediately.
- **Live data OFF:** Read-only report mode; data refreshes only on page reload or manual "Refresh" button click.
- You can also set an **automatic refresh interval** via the dropdown next to "Refresh".
- **Note:** Live data is only available for cross-board dashboards, not board views.

---

## 7. Dashboard Permissions

### Roles

| Role | How Assigned | What They Can Do |
|---|---|---|
| Owner | Automatically assigned to the dashboard creator (blue crown icon) | Full control: edit mode, add/remove widgets, manage board connections, subscribe/unsubscribe members, change all settings |
| Member | All account users on Public dashboards; invited users on Private dashboards | View, interact, toggle dark/light mode, use presentation mode, duplicate, add to favorites, filter and drill down on widgets |
| Guest | External users invited via email or link | Read-only access as free viewers |

### Owner-exclusive actions
- Toggle Edit mode
- Move and resize widgets
- Add or delete widgets
- Manage connected boards
- Subscribe or unsubscribe members

### Access requests
Users who encounter an inaccessible private dashboard can click **Request access**, which sends a notification to all owners.

### Board-level permissions affect widget data
Widgets respect the permission level of connected boards:
- Private workspaces/boards require subscription to see data
- Hidden columns show missing data indicators in widgets
- Item-view permissions affect widget calculations

---

## 8. Filtering a Dashboard

### Dashboard-level filters
Access via the **funnel icon** in the top-right corner of the dashboard.

| Filter Type | Description |
|---|---|
| Quick filters | Filter by board, group, or column — fast and straightforward |
| Advanced filters | Set custom conditions across multiple columns simultaneously |

- You can apply up to **50 columns** across connected boards.
- Connect Boards and Mirror columns are **excluded** from "All boards" filtering.
- Multiple filters can be active simultaneously.
- **Save to this Dashboard** persists filters for all viewers.
- **Clear all** removes all applied filters.

### Subitem filtering (Advanced filters only)
Three modes:
- Filter by parent item columns only
- Filter by subitem columns only
- Filter by both simultaneously

### Widget-level filters
Individual widgets have their own funnel icons — filter parameters are per-widget, independent of dashboard-level filters.

**Limitation:** Text filtering is not supported on large dashboards exceeding 3,000 items.

---

## 9. Sharing and Presenting a Dashboard

### Export options

| Format | How to Access | Notes |
|---|---|---|
| PDF (manual) | Export button → Export to PDF | Recipients need a monday.com account; for external stakeholders use this or board view sharing |
| PDF (scheduled) | Export → Schedule PDF export | Configure recipients (up to 50), subject, body, frequency (daily/weekly/monthly), and time. Emails arrive within 30 min of scheduled time |
| Excel | Three-dot menu on widget → Export to Excel | **Only Timeline Widget and Table Widget** support Excel export |
| Chart formats | Three-dot menu on Chart widget → Export | Multiple file format options |

**PDF layout options:** Portrait or Landscape orientation, content scaling per page.

**Permissions for scheduled exports:** Only one dashboard owner per board can schedule/delete exports. Account admins can restrict external scheduled PDF sharing via Administration → Permissions → Dashboards.

### Email notifications (Enterprise only)
Send dashboards periodically via email to subscribers or selected team members. Configurable for daily, weekly, or monthly delivery at specific times.

### Presentation modes

| Mode | How to Access | What It Does |
|---|---|---|
| Present Mode | Three-dot menu → Present | Removes left pane, buttons, icons for a clean presentation on large screens |
| Full-Screen Widget | Three-dot menu on widget → Full Screen | Expands a single widget to fill the screen |
| Dark Mode | Account-wide setting (not dashboard-specific) | Toggle via account settings |

---

## 10. mondayDB 2.0 (Enterprise Only)

monday.com's high-performance data infrastructure layer for large-scale projects.

### What it unlocks

| Area | Limit |
|---|---|
| Items per board | 100,000 |
| Connected items per board | 100,000 |
| Items per dashboard | 500,000 |
| Connected boards per single board | 60 (200 for Portfolio solutions) |

Enhanced widget support for: **Chart, Battery, Numbers** widgets.

### Limitations of mondayDB 2.0

| Limitation | Detail |
|---|---|
| Board duplication with existing values | Not supported |
| Auto Number Column | Not available |
| Column type conversions (e.g. Status → Text) | Not permitted |
| Interactive widgets (Gantt, Timeline, Workload, Table) | Capped at 20,000 items |
| Textual search | Unavailable |

### Activation
Automatic — no user action needed. Triggers when a dashboard has 3,000+ items using only supported widgets. A notice appears in the bottom-right of the screen when the upgrade occurs. Cost: Free for all mondayDB performance enhancements.

---

## 11. Common Troubleshooting

| Problem | Fix |
|---|---|
| Board not appearing in Connect boards picker | Check workspace subscription and board permission level |
| Column missing from a widget | Column may not exist on all connected boards; only boards that have it contribute data |
| Mirror column data appears empty | Verify the column is populated on the source board and board is connected with correct permissions |
| Dashboard at capacity / limit warning | Go to Connect boards → disconnect boards no longer needed, or use filters to reduce visible item load |
| Can't access a private dashboard | Click "Request access" to notify all owners |
| Live data option unavailable | Live data only works on cross-board dashboards, not board views |

---

## 12. Key Constraints Summary

- Dashboards pull from **board columns only** — not from portfolio-level features.
- To report across projects from different portfolios: connect the underlying boards directly (not via portfolio features).
- Dashboard-level changes (widgets, layout, connections) are **Owner-only**.
- Members can filter, drill down, and view — but cannot modify layout.
- Scheduled PDF exports require a monday.com account to receive in most scenarios (external stakeholders should use manual PDF export).