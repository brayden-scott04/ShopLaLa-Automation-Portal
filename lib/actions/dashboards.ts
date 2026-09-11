"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getSession } from "@/lib/session";
import {
  WIDGET_TYPES,
  CHART_TYPES,
  AGGREGATIONS,
  MAX_DASHBOARD_NAME_LENGTH,
  MAX_DASHBOARD_DESCRIPTION_LENGTH,
  MAX_WIDGET_TITLE_LENGTH,
  type WidgetType,
  type ChartType,
  type Aggregation,
} from "@/lib/dashboards-constants";
import type { StatusOption, BoardColumn, BoardItem } from "@/lib/actions/boards";
import type { BoardColumnType } from "@/lib/boards-constants";

export type WidgetConfig =
  | {
      mode: "number";
      boardId: string;
      columnId: string | null;
      aggregation: Aggregation;
      filter?: { statusColumnId: string; optionKey: string };
    }
  | {
      mode: "chart";
      boardId: string;
      chartType: ChartType;
      groupByColumnId: string;
      metric: { type: "count" } | { type: "aggregate"; columnId: string; aggregation: Aggregation };
    }
  | {
      mode: "table";
      boardId: string;
      columnIds?: string[];
      rowLimit?: number;
    };

export interface DashboardWidget {
  id: string;
  dashboardId: string;
  type: WidgetType;
  title: string;
  position: number;
  config: WidgetConfig;
}

export interface DashboardSummary {
  id: string;
  name: string;
  description: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  connectedBoardCount: number;
}

export interface DashboardDetail {
  dashboard: DashboardSummary;
  connectedBoards: { id: string; name: string }[];
  widgets: DashboardWidget[];
}

export interface NumberWidgetResult {
  value: number;
}

export interface ChartWidgetResult {
  data: { label: string; value: number }[];
}

export interface TableWidgetResult {
  columns: { id: string; name: string; type: BoardColumnType; options: StatusOption[] }[];
  rows: { itemId: string; itemName: string; values: Record<string, unknown> }[];
}

export interface DashboardWidgetResult extends DashboardWidget {
  result: NumberWidgetResult | ChartWidgetResult | TableWidgetResult | null;
  configInvalid: boolean;
}

type BoardItemWithValues = BoardItem & { values: Record<string, unknown> };
type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

async function requireStaff() {
  const session = await getSession();
  if (!session) return { session: null, error: "Unauthorized" as const };
  return { session, error: null };
}

function toBoardColumn(row: {
  id: string;
  board_id: string;
  name: string;
  type: string;
  position: number;
  options: unknown;
}): BoardColumn {
  return {
    id: row.id,
    boardId: row.board_id,
    name: row.name,
    type: row.type as BoardColumnType,
    position: row.position,
    options: Array.isArray(row.options) ? (row.options as StatusOption[]) : [],
  };
}

function toDashboardWidget(row: {
  id: string;
  dashboard_id: string;
  type: string;
  title: string;
  position: number;
  config: unknown;
}): DashboardWidget {
  return {
    id: row.id,
    dashboardId: row.dashboard_id,
    type: row.type as WidgetType,
    title: row.title,
    position: row.position,
    config: row.config as WidgetConfig,
  };
}

function aggregateNumbers(values: number[], aggregation: Aggregation): number {
  if (values.length === 0) return 0;
  switch (aggregation) {
    case "sum":
      return values.reduce((a, b) => a + b, 0);
    case "avg":
      return values.reduce((a, b) => a + b, 0) / values.length;
    case "count":
      return values.length;
    case "min":
      return Math.min(...values);
    case "max":
      return Math.max(...values);
  }
}

/** Loads every connected board's columns and items+values in one batch (no N+1). */
async function loadBoardsData(
  client: SupabaseServerClient,
  boardIds: string[]
): Promise<Map<string, { columns: BoardColumn[]; items: BoardItemWithValues[] }>> {
  const map = new Map<string, { columns: BoardColumn[]; items: BoardItemWithValues[] }>();
  if (boardIds.length === 0) return map;

  const [{ data: columns }, { data: items }] = await Promise.all([
    client
      .from("board_columns")
      .select("id, board_id, name, type, position, options")
      .in("board_id", boardIds)
      .order("position", { ascending: true }),
    client
      .from("board_items")
      .select("id, board_id, name, position, created_by, created_at")
      .in("board_id", boardIds)
      .order("position", { ascending: true }),
  ]);

  const itemIds = (items ?? []).map((i) => i.id);
  const valuesByItem = new Map<string, Record<string, unknown>>();
  if (itemIds.length > 0) {
    const { data: values } = await client
      .from("board_item_values")
      .select("item_id, column_id, value")
      .in("item_id", itemIds);
    (values ?? []).forEach((v) => {
      const rec = valuesByItem.get(v.item_id) ?? {};
      rec[v.column_id] = v.value;
      valuesByItem.set(v.item_id, rec);
    });
  }

  for (const boardId of boardIds) {
    const boardColumns = (columns ?? []).filter((c) => c.board_id === boardId).map(toBoardColumn);
    const boardItems: BoardItemWithValues[] = (items ?? [])
      .filter((i) => i.board_id === boardId)
      .map((i) => ({
        id: i.id,
        boardId: i.board_id,
        name: i.name,
        position: i.position,
        createdBy: i.created_by,
        createdAt: i.created_at,
        values: valuesByItem.get(i.id) ?? {},
      }));
    map.set(boardId, { columns: boardColumns, items: boardItems });
  }

  return map;
}

function computeNumberResult(
  items: BoardItemWithValues[],
  columns: BoardColumn[],
  config: Extract<WidgetConfig, { mode: "number" }>
): { result: NumberWidgetResult | null; configInvalid: boolean } {
  let filtered = items;
  if (config.filter) {
    const filterColumn = columns.find((c) => c.id === config.filter!.statusColumnId && c.type === "status");
    if (!filterColumn) return { result: null, configInvalid: true };
    filtered = items.filter((i) => i.values[filterColumn.id] === config.filter!.optionKey);
  }

  if (config.aggregation === "count") {
    return { result: { value: filtered.length }, configInvalid: false };
  }

  if (!config.columnId) return { result: null, configInvalid: true };
  const column = columns.find((c) => c.id === config.columnId && c.type === "number");
  if (!column) return { result: null, configInvalid: true };

  const values = filtered
    .map((i) => i.values[column.id])
    .filter((v): v is number => typeof v === "number" && Number.isFinite(v));

  return { result: { value: aggregateNumbers(values, config.aggregation) }, configInvalid: false };
}

function computeChartGroups(
  items: BoardItemWithValues[],
  groupByColumn: BoardColumn,
  metric: Extract<WidgetConfig, { mode: "chart" }>["metric"],
  metricColumn: BoardColumn | null
): { label: string; value: number }[] {
  const groups = new Map<string, { label: string; values: number[]; count: number }>();

  for (const item of items) {
    const raw = item.values[groupByColumn.id];
    let key: string;
    let label: string;
    if (raw === null || raw === undefined) {
      key = "__unset__";
      label = "Unset";
    } else if (groupByColumn.type === "status") {
      const option = groupByColumn.options.find((o) => o.key === raw);
      key = String(raw);
      label = option?.label ?? String(raw);
    } else {
      key = String(raw);
      label = String(raw);
    }

    const group = groups.get(key) ?? { label, values: [] as number[], count: 0 };
    group.count += 1;
    if (metric.type === "aggregate" && metricColumn) {
      const v = item.values[metricColumn.id];
      if (typeof v === "number" && Number.isFinite(v)) group.values.push(v);
    }
    groups.set(key, group);
  }

  const orderedKeys =
    groupByColumn.type === "status"
      ? [...groupByColumn.options.map((o) => o.key), "__unset__"].filter((k) => groups.has(k))
      : Array.from(groups.keys()).sort();

  return orderedKeys.map((key) => {
    const group = groups.get(key)!;
    const value = metric.type === "count" ? group.count : aggregateNumbers(group.values, metric.aggregation);
    return { label: group.label, value };
  });
}

function computeChartResult(
  items: BoardItemWithValues[],
  columns: BoardColumn[],
  config: Extract<WidgetConfig, { mode: "chart" }>
): { result: ChartWidgetResult | null; configInvalid: boolean } {
  const groupByColumn = columns.find((c) => c.id === config.groupByColumnId);
  if (!groupByColumn || (groupByColumn.type !== "status" && groupByColumn.type !== "date")) {
    return { result: null, configInvalid: true };
  }

  let metricColumn: BoardColumn | null = null;
  if (config.metric.type === "aggregate") {
    const metric = config.metric;
    metricColumn = columns.find((c) => c.id === metric.columnId && c.type === "number") ?? null;
    if (!metricColumn) return { result: null, configInvalid: true };
  }

  return {
    result: { data: computeChartGroups(items, groupByColumn, config.metric, metricColumn) },
    configInvalid: false,
  };
}

function computeTableResult(
  items: BoardItemWithValues[],
  columns: BoardColumn[],
  config: Extract<WidgetConfig, { mode: "table" }>
): TableWidgetResult {
  const selectedColumns =
    config.columnIds && config.columnIds.length > 0
      ? columns.filter((c) => config.columnIds!.includes(c.id))
      : columns;
  const rows = config.rowLimit ? items.slice(0, config.rowLimit) : items;

  return {
    columns: selectedColumns.map((c) => ({ id: c.id, name: c.name, type: c.type, options: c.options })),
    rows: rows.map((i) => ({
      itemId: i.id,
      itemName: i.name,
      values: Object.fromEntries(selectedColumns.map((c) => [c.id, i.values[c.id] ?? null])),
    })),
  };
}

async function validateWidgetConfig(
  client: SupabaseServerClient,
  dashboardId: string,
  type: WidgetType,
  config: WidgetConfig
): Promise<string | null> {
  if (config.mode !== type) return "Widget config does not match widget type";

  const { data: connection, error: connError } = await client
    .from("dashboard_boards")
    .select("board_id")
    .eq("dashboard_id", dashboardId)
    .eq("board_id", config.boardId)
    .maybeSingle();
  if (connError) return connError.message;
  if (!connection) return "That board is not connected to this dashboard";

  const { data: columnRows, error: columnsError } = await client
    .from("board_columns")
    .select("id, type, options")
    .eq("board_id", config.boardId);
  if (columnsError) return columnsError.message;
  const columns = columnRows ?? [];
  const findColumn = (id: string) => columns.find((c) => c.id === id);

  if (config.mode === "number") {
    if (!AGGREGATIONS.includes(config.aggregation)) return "Invalid aggregation";
    if (config.aggregation !== "count") {
      if (!config.columnId) return "A Number column is required for this aggregation";
      const column = findColumn(config.columnId);
      if (!column || column.type !== "number") return "Aggregation column must be a Number column";
    }
    if (config.filter) {
      const filterColumn = findColumn(config.filter.statusColumnId);
      if (!filterColumn || filterColumn.type !== "status") return "Filter column must be a Status column";
      const options = Array.isArray(filterColumn.options) ? (filterColumn.options as StatusOption[]) : [];
      if (!options.some((o) => o.key === config.filter!.optionKey)) return "Invalid filter status option";
    }
    return null;
  }

  if (config.mode === "chart") {
    if (!CHART_TYPES.includes(config.chartType)) return "Invalid chart type";
    const groupByColumn = findColumn(config.groupByColumnId);
    if (!groupByColumn || (groupByColumn.type !== "status" && groupByColumn.type !== "date")) {
      return "Group-by column must be a Status or Date column";
    }
    if (config.metric.type === "aggregate") {
      if (!AGGREGATIONS.includes(config.metric.aggregation)) return "Invalid aggregation";
      const metricColumn = findColumn(config.metric.columnId);
      if (!metricColumn || metricColumn.type !== "number") return "Chart metric column must be a Number column";
    }
    return null;
  }

  // table
  if (config.columnIds && !config.columnIds.every((id) => findColumn(id))) {
    return "Invalid column selection";
  }
  if (
    config.rowLimit !== undefined &&
    (!Number.isInteger(config.rowLimit) || config.rowLimit <= 0 || config.rowLimit > 500)
  ) {
    return "Row limit must be a positive integer up to 500";
  }
  return null;
}

// ---- Dashboards ----

export async function listDashboards(): Promise<{ data: DashboardSummary[] | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();
  const { data: dashboards, error: dashError } = await client
    .from("dashboards")
    .select("id, name, description, created_by, created_at, updated_at")
    .order("created_at", { ascending: true });
  if (dashError) return { data: null, error: dashError.message };

  const dashboardIds = (dashboards ?? []).map((d) => d.id);
  const counts = new Map<string, number>();
  if (dashboardIds.length > 0) {
    const { data: connections } = await client
      .from("dashboard_boards")
      .select("dashboard_id")
      .in("dashboard_id", dashboardIds);
    (connections ?? []).forEach((c) => counts.set(c.dashboard_id, (counts.get(c.dashboard_id) ?? 0) + 1));
  }

  const data: DashboardSummary[] = (dashboards ?? []).map((d) => ({
    id: d.id,
    name: d.name,
    description: d.description,
    createdBy: d.created_by,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
    connectedBoardCount: counts.get(d.id) ?? 0,
  }));

  return { data, error: null };
}

export async function getDashboard(
  dashboardId: string
): Promise<{ data: DashboardDetail | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();
  const { data: dashboard, error: dashError } = await client
    .from("dashboards")
    .select("id, name, description, created_by, created_at, updated_at")
    .eq("id", dashboardId)
    .maybeSingle();
  if (dashError) return { data: null, error: dashError.message };
  if (!dashboard) return { data: null, error: "Dashboard not found" };

  const { data: connections, error: connError } = await client
    .from("dashboard_boards")
    .select("board_id, boards(id, name)")
    .eq("dashboard_id", dashboardId);
  if (connError) return { data: null, error: connError.message };

  const connectedBoards = (connections ?? []).map((c) => {
    const board = Array.isArray(c.boards) ? c.boards[0] : c.boards;
    return { id: c.board_id, name: board?.name ?? "Unknown board" };
  });

  const { data: widgetRows, error: widgetsError } = await client
    .from("dashboard_widgets")
    .select("id, dashboard_id, type, title, position, config")
    .eq("dashboard_id", dashboardId)
    .order("position", { ascending: true });
  if (widgetsError) return { data: null, error: widgetsError.message };

  return {
    data: {
      dashboard: {
        id: dashboard.id,
        name: dashboard.name,
        description: dashboard.description,
        createdBy: dashboard.created_by,
        createdAt: dashboard.created_at,
        updatedAt: dashboard.updated_at,
        connectedBoardCount: connectedBoards.length,
      },
      connectedBoards,
      widgets: (widgetRows ?? []).map(toDashboardWidget),
    },
    error: null,
  };
}

export async function createDashboard(
  name: string,
  description?: string
): Promise<{ data: DashboardSummary | null; error: string | null }> {
  const { session, error } = await requireStaff();
  if (error) return { data: null, error };

  const trimmed = name.trim();
  if (!trimmed) return { data: null, error: "Dashboard name is required" };
  if (trimmed.length > MAX_DASHBOARD_NAME_LENGTH) return { data: null, error: "Dashboard name is too long" };
  const desc = description?.trim() || null;
  if (desc && desc.length > MAX_DASHBOARD_DESCRIPTION_LENGTH) return { data: null, error: "Description is too long" };

  const service = createServiceClient();
  const { data, error: insertError } = await service
    .from("dashboards")
    .insert({ name: trimmed, description: desc, created_by: session.username })
    .select("id, name, description, created_by, created_at, updated_at")
    .single();
  if (insertError) return { data: null, error: insertError.message };

  return {
    data: {
      id: data.id,
      name: data.name,
      description: data.description,
      createdBy: data.created_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      connectedBoardCount: 0,
    },
    error: null,
  };
}

export async function updateDashboard(
  dashboardId: string,
  updates: { name?: string; description?: string | null }
): Promise<{ data: { ok: true } | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.name !== undefined) {
    const trimmed = updates.name.trim();
    if (!trimmed) return { data: null, error: "Dashboard name is required" };
    if (trimmed.length > MAX_DASHBOARD_NAME_LENGTH) return { data: null, error: "Dashboard name is too long" };
    patch.name = trimmed;
  }
  if (updates.description !== undefined) {
    const desc = updates.description?.trim() || null;
    if (desc && desc.length > MAX_DASHBOARD_DESCRIPTION_LENGTH) return { data: null, error: "Description is too long" };
    patch.description = desc;
  }
  if (Object.keys(patch).length === 1) return { data: null, error: "No changes provided" };

  const service = createServiceClient();
  const { error: updateError } = await service.from("dashboards").update(patch).eq("id", dashboardId);
  if (updateError) return { data: null, error: updateError.message };

  return { data: { ok: true }, error: null };
}

export async function deleteDashboard(
  dashboardId: string
): Promise<{ data: { ok: true } | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const service = createServiceClient();
  const { error: deleteError } = await service.from("dashboards").delete().eq("id", dashboardId);
  if (deleteError) return { data: null, error: deleteError.message };

  return { data: { ok: true }, error: null };
}

// ---- Connected boards ----

export async function connectBoard(
  dashboardId: string,
  boardId: string
): Promise<{ data: { ok: true } | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();
  const [{ data: dashboard }, { data: board }] = await Promise.all([
    client.from("dashboards").select("id").eq("id", dashboardId).maybeSingle(),
    client.from("boards").select("id").eq("id", boardId).maybeSingle(),
  ]);
  if (!dashboard) return { data: null, error: "Dashboard not found" };
  if (!board) return { data: null, error: "Board not found" };

  const service = createServiceClient();
  const { error: insertError } = await service
    .from("dashboard_boards")
    .insert({ dashboard_id: dashboardId, board_id: boardId });
  if (insertError) {
    if (insertError.code === "23505") return { data: null, error: "That board is already connected" };
    return { data: null, error: insertError.message };
  }

  return { data: { ok: true }, error: null };
}

export async function disconnectBoard(
  dashboardId: string,
  boardId: string
): Promise<{ data: { ok: true } | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();
  const { data: widgets, error: widgetsError } = await client
    .from("dashboard_widgets")
    .select("id, config")
    .eq("dashboard_id", dashboardId);
  if (widgetsError) return { data: null, error: widgetsError.message };

  const idsToDelete = (widgets ?? [])
    .filter((w) => (w.config as WidgetConfig)?.boardId === boardId)
    .map((w) => w.id);

  const service = createServiceClient();
  if (idsToDelete.length > 0) {
    const { error: deleteWidgetsError } = await service.from("dashboard_widgets").delete().in("id", idsToDelete);
    if (deleteWidgetsError) return { data: null, error: deleteWidgetsError.message };
  }

  const { error: deleteError } = await service
    .from("dashboard_boards")
    .delete()
    .eq("dashboard_id", dashboardId)
    .eq("board_id", boardId);
  if (deleteError) return { data: null, error: deleteError.message };

  return { data: { ok: true }, error: null };
}

// ---- Widgets ----

export async function createWidget(
  dashboardId: string,
  input: { type: WidgetType; title: string; config: WidgetConfig }
): Promise<{ data: DashboardWidget | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  if (!WIDGET_TYPES.includes(input.type)) return { data: null, error: "Invalid widget type" };
  const title = input.title.trim();
  if (!title) return { data: null, error: "Widget title is required" };
  if (title.length > MAX_WIDGET_TITLE_LENGTH) return { data: null, error: "Widget title is too long" };

  const client = await createClient();
  const configError = await validateWidgetConfig(client, dashboardId, input.type, input.config);
  if (configError) return { data: null, error: configError };

  const { data: lastWidget, error: lastWidgetError } = await client
    .from("dashboard_widgets")
    .select("position")
    .eq("dashboard_id", dashboardId)
    .order("position", { ascending: false })
    .limit(1);
  if (lastWidgetError) return { data: null, error: lastWidgetError.message };
  const nextPosition = (lastWidget?.[0]?.position ?? -1) + 1;

  const service = createServiceClient();
  const { data, error: insertError } = await service
    .from("dashboard_widgets")
    .insert({ dashboard_id: dashboardId, type: input.type, title, position: nextPosition, config: input.config })
    .select("id, dashboard_id, type, title, position, config")
    .single();
  if (insertError) return { data: null, error: insertError.message };

  return { data: toDashboardWidget(data), error: null };
}

export async function updateWidget(
  widgetId: string,
  updates: { title?: string; config?: WidgetConfig }
): Promise<{ data: DashboardWidget | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();
  const { data: existing, error: fetchError } = await client
    .from("dashboard_widgets")
    .select("id, dashboard_id, type")
    .eq("id", widgetId)
    .maybeSingle();
  if (fetchError) return { data: null, error: fetchError.message };
  if (!existing) return { data: null, error: "Widget not found" };

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.title !== undefined) {
    const title = updates.title.trim();
    if (!title) return { data: null, error: "Widget title is required" };
    if (title.length > MAX_WIDGET_TITLE_LENGTH) return { data: null, error: "Widget title is too long" };
    patch.title = title;
  }
  if (updates.config !== undefined) {
    const configError = await validateWidgetConfig(client, existing.dashboard_id, existing.type as WidgetType, updates.config);
    if (configError) return { data: null, error: configError };
    patch.config = updates.config;
  }
  if (Object.keys(patch).length === 1) return { data: null, error: "No changes provided" };

  const service = createServiceClient();
  const { data, error: updateError } = await service
    .from("dashboard_widgets")
    .update(patch)
    .eq("id", widgetId)
    .select("id, dashboard_id, type, title, position, config")
    .single();
  if (updateError) return { data: null, error: updateError.message };

  return { data: toDashboardWidget(data), error: null };
}

export async function deleteWidget(
  widgetId: string
): Promise<{ data: { ok: true } | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const service = createServiceClient();
  const { error: deleteError } = await service.from("dashboard_widgets").delete().eq("id", widgetId);
  if (deleteError) return { data: null, error: deleteError.message };

  return { data: { ok: true }, error: null };
}

export async function moveWidget(
  widgetId: string,
  direction: "up" | "down"
): Promise<{ data: { ok: true } | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();
  const { data: current, error: currentError } = await client
    .from("dashboard_widgets")
    .select("id, dashboard_id, position")
    .eq("id", widgetId)
    .maybeSingle();
  if (currentError) return { data: null, error: currentError.message };
  if (!current) return { data: null, error: "Widget not found" };

  const { data: siblings, error: siblingsError } = await client
    .from("dashboard_widgets")
    .select("id, position")
    .eq("dashboard_id", current.dashboard_id)
    .order("position", { ascending: true });
  if (siblingsError) return { data: null, error: siblingsError.message };

  const list = siblings ?? [];
  const index = list.findIndex((w) => w.id === widgetId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= list.length) {
    return { data: null, error: "Widget is already at the edge" };
  }

  const other = list[swapIndex];
  const service = createServiceClient();
  const [{ error: err1 }, { error: err2 }] = await Promise.all([
    service.from("dashboard_widgets").update({ position: other.position }).eq("id", current.id),
    service.from("dashboard_widgets").update({ position: current.position }).eq("id", other.id),
  ]);
  if (err1) return { data: null, error: err1.message };
  if (err2) return { data: null, error: err2.message };

  return { data: { ok: true }, error: null };
}

// ---- Dashboard data (aggregated widget results) ----

export async function getDashboardData(
  dashboardId: string
): Promise<{ data: DashboardWidgetResult[] | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();
  const { data: connections, error: connError } = await client
    .from("dashboard_boards")
    .select("board_id")
    .eq("dashboard_id", dashboardId);
  if (connError) return { data: null, error: connError.message };

  const boardIds = (connections ?? []).map((c) => c.board_id);
  const boardsData = await loadBoardsData(client, boardIds);

  const { data: widgetRows, error: widgetsError } = await client
    .from("dashboard_widgets")
    .select("id, dashboard_id, type, title, position, config")
    .eq("dashboard_id", dashboardId)
    .order("position", { ascending: true });
  if (widgetsError) return { data: null, error: widgetsError.message };

  const results: DashboardWidgetResult[] = (widgetRows ?? []).map((row) => {
    const widget = toDashboardWidget(row);
    const board = boardsData.get(widget.config.boardId);
    if (!board) {
      return { ...widget, result: null, configInvalid: true };
    }

    if (widget.config.mode === "number") {
      const { result, configInvalid } = computeNumberResult(board.items, board.columns, widget.config);
      return { ...widget, result, configInvalid };
    }
    if (widget.config.mode === "chart") {
      const { result, configInvalid } = computeChartResult(board.items, board.columns, widget.config);
      return { ...widget, result, configInvalid };
    }
    return { ...widget, result: computeTableResult(board.items, board.columns, widget.config), configInvalid: false };
  });

  return { data: results, error: null };
}
