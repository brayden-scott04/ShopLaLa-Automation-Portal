"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getSession } from "@/lib/session";
import {
  BOARD_COLUMN_TYPES,
  MAX_BOARD_NAME_LENGTH,
  MAX_BOARD_DESCRIPTION_LENGTH,
  MAX_COLUMN_NAME_LENGTH,
  MAX_ITEM_NAME_LENGTH,
  MAX_STATUS_OPTIONS,
  MAX_STATUS_OPTION_LABEL_LENGTH,
  STATUS_COLOR_SWATCHES,
  type BoardColumnType,
} from "@/lib/boards-constants";

export interface StatusOption {
  key: string;
  label: string;
  color: string;
}

export interface BoardColumn {
  id: string;
  boardId: string;
  name: string;
  type: BoardColumnType;
  position: number;
  options: StatusOption[];
}

export interface BoardItem {
  id: string;
  boardId: string;
  name: string;
  position: number;
  createdBy: string;
  createdAt: string;
}

export interface BoardSummary {
  id: string;
  name: string;
  description: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
  columnCount: number;
}

export interface BoardDetail {
  board: BoardSummary;
  columns: BoardColumn[];
  items: (BoardItem & { values: Record<string, unknown> })[];
}

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

/** Returns the validated/normalized options, or null if anything is malformed. */
function validateOptions(options: unknown): StatusOption[] | null {
  if (!Array.isArray(options)) return null;
  if (options.length > MAX_STATUS_OPTIONS) return null;

  const seen = new Set<string>();
  const result: StatusOption[] = [];
  for (const opt of options) {
    if (typeof opt !== "object" || opt === null) return null;
    const { key, label, color } = opt as Record<string, unknown>;
    const label_ = typeof label === "string" ? label.trim() : "";
    if (!label_ || label_.length > MAX_STATUS_OPTION_LABEL_LENGTH) return null;
    if (typeof color !== "string" || !STATUS_COLOR_SWATCHES.some((s) => s.key === color)) return null;
    const finalKey = typeof key === "string" && key.trim() ? key.trim() : crypto.randomUUID();
    if (seen.has(finalKey)) return null;
    seen.add(finalKey);
    result.push({ key: finalKey, label: label_, color });
  }
  return result;
}

function validateCellValue(type: BoardColumnType, options: StatusOption[], value: unknown): string | null {
  if (value === null) return null;
  switch (type) {
    case "text":
      return typeof value === "string" ? null : "Text value must be a string";
    case "number":
      return typeof value === "number" && Number.isFinite(value) ? null : "Number value must be a finite number";
    case "checkbox":
      return typeof value === "boolean" ? null : "Checkbox value must be true or false";
    case "date":
      return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? null
        : "Date value must be in YYYY-MM-DD format";
    case "status":
      return typeof value === "string" && options.some((o) => o.key === value) ? null : "Invalid status option";
    default:
      return "Unknown column type";
  }
}

async function countByBoard(
  client: SupabaseServerClient,
  table: "board_items" | "board_columns",
  boardIds: string[]
): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (boardIds.length === 0) return map;
  const { data } = await client.from(table).select("board_id").in("board_id", boardIds);
  (data ?? []).forEach((row: { board_id: string }) => {
    map.set(row.board_id, (map.get(row.board_id) ?? 0) + 1);
  });
  return map;
}

// ---- Boards ----

export async function listBoards(): Promise<{ data: BoardSummary[] | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();
  const { data: boards, error: boardsError } = await client
    .from("boards")
    .select("id, name, description, created_by, created_at, updated_at")
    .order("created_at", { ascending: true });
  if (boardsError) return { data: null, error: boardsError.message };

  const boardIds = (boards ?? []).map((b) => b.id);
  const [itemCounts, columnCounts] = await Promise.all([
    countByBoard(client, "board_items", boardIds),
    countByBoard(client, "board_columns", boardIds),
  ]);

  const data: BoardSummary[] = (boards ?? []).map((b) => ({
    id: b.id,
    name: b.name,
    description: b.description,
    createdBy: b.created_by,
    createdAt: b.created_at,
    updatedAt: b.updated_at,
    itemCount: itemCounts.get(b.id) ?? 0,
    columnCount: columnCounts.get(b.id) ?? 0,
  }));

  return { data, error: null };
}

export async function getBoard(boardId: string): Promise<{ data: BoardDetail | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();
  const { data: board, error: boardError } = await client
    .from("boards")
    .select("id, name, description, created_by, created_at, updated_at")
    .eq("id", boardId)
    .maybeSingle();
  if (boardError) return { data: null, error: boardError.message };
  if (!board) return { data: null, error: "Board not found" };

  const [{ data: columns, error: columnsError }, { data: items, error: itemsError }] = await Promise.all([
    client
      .from("board_columns")
      .select("id, board_id, name, type, position, options")
      .eq("board_id", boardId)
      .order("position", { ascending: true }),
    client
      .from("board_items")
      .select("id, board_id, name, position, created_by, created_at")
      .eq("board_id", boardId)
      .order("position", { ascending: true }),
  ]);
  if (columnsError) return { data: null, error: columnsError.message };
  if (itemsError) return { data: null, error: itemsError.message };

  const itemIds = (items ?? []).map((i) => i.id);
  const valuesByItem = new Map<string, Record<string, unknown>>();
  if (itemIds.length > 0) {
    const { data: values, error: valuesError } = await client
      .from("board_item_values")
      .select("item_id, column_id, value")
      .in("item_id", itemIds);
    if (valuesError) return { data: null, error: valuesError.message };
    (values ?? []).forEach((v) => {
      const rec = valuesByItem.get(v.item_id) ?? {};
      rec[v.column_id] = v.value;
      valuesByItem.set(v.item_id, rec);
    });
  }

  const boardColumns = (columns ?? []).map(toBoardColumn);
  const boardItems = (items ?? []).map((i) => ({
    id: i.id,
    boardId: i.board_id,
    name: i.name,
    position: i.position,
    createdBy: i.created_by,
    createdAt: i.created_at,
    values: valuesByItem.get(i.id) ?? {},
  }));

  return {
    data: {
      board: {
        id: board.id,
        name: board.name,
        description: board.description,
        createdBy: board.created_by,
        createdAt: board.created_at,
        updatedAt: board.updated_at,
        itemCount: boardItems.length,
        columnCount: boardColumns.length,
      },
      columns: boardColumns,
      items: boardItems,
    },
    error: null,
  };
}

export async function createBoard(
  name: string,
  description?: string
): Promise<{ data: BoardSummary | null; error: string | null }> {
  const { session, error } = await requireStaff();
  if (error) return { data: null, error };

  const trimmed = name.trim();
  if (!trimmed) return { data: null, error: "Board name is required" };
  if (trimmed.length > MAX_BOARD_NAME_LENGTH) return { data: null, error: "Board name is too long" };
  const desc = description?.trim() || null;
  if (desc && desc.length > MAX_BOARD_DESCRIPTION_LENGTH) return { data: null, error: "Description is too long" };

  const service = createServiceClient();
  const { data, error: insertError } = await service
    .from("boards")
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
      itemCount: 0,
      columnCount: 0,
    },
    error: null,
  };
}

export async function updateBoard(
  boardId: string,
  updates: { name?: string; description?: string | null }
): Promise<{ data: { ok: true } | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.name !== undefined) {
    const trimmed = updates.name.trim();
    if (!trimmed) return { data: null, error: "Board name is required" };
    if (trimmed.length > MAX_BOARD_NAME_LENGTH) return { data: null, error: "Board name is too long" };
    patch.name = trimmed;
  }
  if (updates.description !== undefined) {
    const desc = updates.description?.trim() || null;
    if (desc && desc.length > MAX_BOARD_DESCRIPTION_LENGTH) return { data: null, error: "Description is too long" };
    patch.description = desc;
  }
  if (Object.keys(patch).length === 1) return { data: null, error: "No changes provided" };

  const service = createServiceClient();
  const { error: updateError } = await service.from("boards").update(patch).eq("id", boardId);
  if (updateError) return { data: null, error: updateError.message };

  return { data: { ok: true }, error: null };
}

export async function deleteBoard(
  boardId: string
): Promise<{ data: { ok: true } | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();
  const { data: connections, error: connError } = await client
    .from("dashboard_boards")
    .select("dashboard_id, dashboards(name)")
    .eq("board_id", boardId);
  if (connError) return { data: null, error: connError.message };

  if (connections && connections.length > 0) {
    const names = connections.map((c) => {
      const dash = Array.isArray(c.dashboards) ? c.dashboards[0] : c.dashboards;
      return dash?.name ?? "Unknown dashboard";
    });
    return {
      data: null,
      error: `Cannot delete — connected to ${names.length} dashboard(s): ${names.join(", ")}. Disconnect it from each first.`,
    };
  }

  const service = createServiceClient();
  const { error: deleteError } = await service.from("boards").delete().eq("id", boardId);
  if (deleteError) return { data: null, error: deleteError.message };

  return { data: { ok: true }, error: null };
}

// ---- Columns ----

export async function createColumn(
  boardId: string,
  input: { name: string; type: BoardColumnType; options?: StatusOption[] }
): Promise<{ data: BoardColumn | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  if (!BOARD_COLUMN_TYPES.includes(input.type)) return { data: null, error: "Invalid column type" };
  const trimmed = input.name.trim();
  if (!trimmed) return { data: null, error: "Column name is required" };
  if (trimmed.length > MAX_COLUMN_NAME_LENGTH) return { data: null, error: "Column name is too long" };

  const options = input.type === "status" ? validateOptions(input.options ?? []) : [];
  if (options === null) return { data: null, error: "Invalid status options" };

  const client = await createClient();
  const { data: board, error: boardError } = await client.from("boards").select("id").eq("id", boardId).maybeSingle();
  if (boardError) return { data: null, error: boardError.message };
  if (!board) return { data: null, error: "Board not found" };

  const { data: lastColumn, error: lastColumnError } = await client
    .from("board_columns")
    .select("position")
    .eq("board_id", boardId)
    .order("position", { ascending: false })
    .limit(1);
  if (lastColumnError) return { data: null, error: lastColumnError.message };
  const nextPosition = (lastColumn?.[0]?.position ?? -1) + 1;

  const service = createServiceClient();
  const { data, error: insertError } = await service
    .from("board_columns")
    .insert({ board_id: boardId, name: trimmed, type: input.type, position: nextPosition, options })
    .select("id, board_id, name, type, position, options")
    .single();
  if (insertError) return { data: null, error: insertError.message };

  return { data: toBoardColumn(data), error: null };
}

export async function updateColumn(
  columnId: string,
  updates: { name?: string; options?: StatusOption[] }
): Promise<{ data: BoardColumn | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const client = await createClient();
  const { data: existing, error: fetchError } = await client
    .from("board_columns")
    .select("id, type")
    .eq("id", columnId)
    .maybeSingle();
  if (fetchError) return { data: null, error: fetchError.message };
  if (!existing) return { data: null, error: "Column not found" };

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.name !== undefined) {
    const trimmed = updates.name.trim();
    if (!trimmed) return { data: null, error: "Column name is required" };
    if (trimmed.length > MAX_COLUMN_NAME_LENGTH) return { data: null, error: "Column name is too long" };
    patch.name = trimmed;
  }
  if (updates.options !== undefined) {
    if (existing.type !== "status") return { data: null, error: "Only Status columns have options" };
    const options = validateOptions(updates.options);
    if (options === null) return { data: null, error: "Invalid status options" };
    patch.options = options;
  }
  if (Object.keys(patch).length === 1) return { data: null, error: "No changes provided" };

  const service = createServiceClient();
  const { data, error: updateError } = await service
    .from("board_columns")
    .update(patch)
    .eq("id", columnId)
    .select("id, board_id, name, type, position, options")
    .single();
  if (updateError) return { data: null, error: updateError.message };

  return { data: toBoardColumn(data), error: null };
}

export async function deleteColumn(
  columnId: string
): Promise<{ data: { ok: true } | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const service = createServiceClient();
  const { error: deleteError } = await service.from("board_columns").delete().eq("id", columnId);
  if (deleteError) return { data: null, error: deleteError.message };

  return { data: { ok: true }, error: null };
}

// ---- Items ----

export async function createItem(
  boardId: string,
  name: string
): Promise<{ data: BoardItem | null; error: string | null }> {
  const { session, error } = await requireStaff();
  if (error) return { data: null, error };

  const trimmed = name.trim();
  if (!trimmed) return { data: null, error: "Item name is required" };
  if (trimmed.length > MAX_ITEM_NAME_LENGTH) return { data: null, error: "Item name is too long" };

  const client = await createClient();
  const { data: board, error: boardError } = await client.from("boards").select("id").eq("id", boardId).maybeSingle();
  if (boardError) return { data: null, error: boardError.message };
  if (!board) return { data: null, error: "Board not found" };

  const { data: lastItem, error: lastItemError } = await client
    .from("board_items")
    .select("position")
    .eq("board_id", boardId)
    .order("position", { ascending: false })
    .limit(1);
  if (lastItemError) return { data: null, error: lastItemError.message };
  const nextPosition = (lastItem?.[0]?.position ?? -1) + 1;

  const service = createServiceClient();
  const { data, error: insertError } = await service
    .from("board_items")
    .insert({ board_id: boardId, name: trimmed, position: nextPosition, created_by: session.username })
    .select("id, board_id, name, position, created_by, created_at")
    .single();
  if (insertError) return { data: null, error: insertError.message };

  return {
    data: {
      id: data.id,
      boardId: data.board_id,
      name: data.name,
      position: data.position,
      createdBy: data.created_by,
      createdAt: data.created_at,
    },
    error: null,
  };
}

export async function renameItem(
  itemId: string,
  name: string
): Promise<{ data: { ok: true } | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const trimmed = name.trim();
  if (!trimmed) return { data: null, error: "Item name is required" };
  if (trimmed.length > MAX_ITEM_NAME_LENGTH) return { data: null, error: "Item name is too long" };

  const service = createServiceClient();
  const { error: updateError } = await service
    .from("board_items")
    .update({ name: trimmed, updated_at: new Date().toISOString() })
    .eq("id", itemId);
  if (updateError) return { data: null, error: updateError.message };

  return { data: { ok: true }, error: null };
}

export async function deleteItem(
  itemId: string
): Promise<{ data: { ok: true } | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };

  const service = createServiceClient();
  const { error: deleteError } = await service.from("board_items").delete().eq("id", itemId);
  if (deleteError) return { data: null, error: deleteError.message };

  return { data: { ok: true }, error: null };
}

// ---- Cell values ----

export async function setCellValues(
  boardId: string,
  changes: { itemId: string; columnId: string; value: string | number | boolean | null }[]
): Promise<{ data: { updated: number } | null; error: string | null }> {
  const { error } = await requireStaff();
  if (error) return { data: null, error };
  if (changes.length === 0) return { data: { updated: 0 }, error: null };

  const client = await createClient();
  const [{ data: items, error: itemsError }, { data: columns, error: columnsError }] = await Promise.all([
    client.from("board_items").select("id").eq("board_id", boardId),
    client.from("board_columns").select("id, type, options").eq("board_id", boardId),
  ]);
  if (itemsError) return { data: null, error: itemsError.message };
  if (columnsError) return { data: null, error: columnsError.message };

  const itemIds = new Set((items ?? []).map((i) => i.id));
  const columnById = new Map((columns ?? []).map((c) => [c.id, c]));

  // All-or-nothing validation before any write, so a batch save never partially applies.
  for (const change of changes) {
    if (!itemIds.has(change.itemId)) return { data: null, error: "That item no longer belongs to this board" };
    const column = columnById.get(change.columnId);
    if (!column) return { data: null, error: "That column no longer belongs to this board" };
    const validationError = validateCellValue(
      column.type as BoardColumnType,
      Array.isArray(column.options) ? (column.options as StatusOption[]) : [],
      change.value
    );
    if (validationError) return { data: null, error: validationError };
  }

  const service = createServiceClient();
  const updatedAt = new Date().toISOString();
  const { error: upsertError } = await service.from("board_item_values").upsert(
    changes.map((c) => ({ item_id: c.itemId, column_id: c.columnId, value: c.value, updated_at: updatedAt })),
    { onConflict: "item_id,column_id" }
  );
  if (upsertError) return { data: null, error: upsertError.message };

  return { data: { updated: changes.length }, error: null };
}
