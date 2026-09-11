"use client";

import { useState, useTransition } from "react";
import { Plus, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ColumnDialog } from "@/components/boards/column-dialog";
import {
  createItem,
  deleteColumn,
  deleteItem,
  renameItem,
  setCellValues,
  type BoardColumn,
  type BoardItem,
} from "@/lib/actions/boards";
import { BOARD_COLUMN_TYPE_LABELS } from "@/lib/boards-constants";

type ItemRow = BoardItem & { values: Record<string, unknown> };
type PendingDelete = { kind: "column" | "item"; id: string; label: string };

const CELL_INPUT_CLASSNAME =
  "h-8 w-full min-w-0 rounded-md border border-transparent bg-transparent px-2 text-sm outline-none transition-colors hover:border-input focus:border-ring focus:ring-2 focus:ring-ring/50";

function cellKey(itemId: string, columnId: string, value: unknown) {
  return `${itemId}:${columnId}:${String(value)}`;
}

export function BoardGrid({
  boardId,
  initialColumns,
  initialItems,
}: {
  boardId: string;
  initialColumns: BoardColumn[];
  initialItems: ItemRow[];
}) {
  const [columns, setColumns] = useState<BoardColumn[]>(initialColumns);
  const [items, setItems] = useState<ItemRow[]>(initialItems);
  const [columnDialog, setColumnDialog] = useState<{ open: boolean; column: BoardColumn | null }>({
    open: false,
    column: null,
  });
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleColumnSaved(column: BoardColumn) {
    setColumns((prev) => {
      const exists = prev.some((c) => c.id === column.id);
      return exists ? prev.map((c) => (c.id === column.id ? column : c)) : [...prev, column];
    });
  }

  function commitCell(itemId: string, columnId: string, value: string | number | boolean | null) {
    setError(null);
    startTransition(async () => {
      const result = await setCellValues(boardId, [{ itemId, columnId, value }]);
      if (result.error) {
        setError(result.error);
        return;
      }
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, values: { ...item.values, [columnId]: value } } : item))
      );
    });
  }

  function handleAddItem() {
    setError(null);
    startTransition(async () => {
      const result = await createItem(boardId, "New item");
      if (result.error || !result.data) {
        setError(result.error ?? "Something went wrong");
        return;
      }
      setItems((prev) => [...prev, { ...result.data!, values: {} }]);
    });
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setPendingDelete(null);
    setError(null);
    startTransition(async () => {
      const result = target.kind === "column" ? await deleteColumn(target.id) : await deleteItem(target.id);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (target.kind === "column") {
        setColumns((prev) => prev.filter((c) => c.id !== target.id));
        setItems((prev) =>
          prev.map((item) => {
            if (!(target.id in item.values)) return item;
            const values = { ...item.values };
            delete values[target.id];
            return { ...item, values };
          })
        );
      } else {
        setItems((prev) => prev.filter((i) => i.id !== target.id));
      }
    });
  }

  function renderCell(item: ItemRow, column: BoardColumn) {
    const value = item.values[column.id];

    if (column.type === "checkbox") {
      return (
        <Checkbox
          checked={value === true}
          onCheckedChange={(checked) => commitCell(item.id, column.id, checked === true)}
        />
      );
    }

    if (column.type === "status") {
      return (
        <select
          key={cellKey(item.id, column.id, value)}
          defaultValue={typeof value === "string" ? value : ""}
          onChange={(e) => commitCell(item.id, column.id, e.target.value || null)}
          className={CELL_INPUT_CLASSNAME}
        >
          <option value="">—</option>
          {column.options.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
      );
    }

    if (column.type === "number") {
      return (
        <input
          key={cellKey(item.id, column.id, value)}
          type="number"
          defaultValue={typeof value === "number" ? value : ""}
          onBlur={(e) => {
            const raw = e.target.value.trim();
            commitCell(item.id, column.id, raw === "" ? null : Number(raw));
          }}
          className={CELL_INPUT_CLASSNAME}
        />
      );
    }

    if (column.type === "date") {
      return (
        <input
          key={cellKey(item.id, column.id, value)}
          type="date"
          defaultValue={typeof value === "string" ? value : ""}
          onChange={(e) => commitCell(item.id, column.id, e.target.value || null)}
          className={CELL_INPUT_CLASSNAME}
        />
      );
    }

    return (
      <input
        key={cellKey(item.id, column.id, value)}
        type="text"
        defaultValue={typeof value === "string" ? value : ""}
        onBlur={(e) => commitCell(item.id, column.id, e.target.value.trim() || null)}
        className={CELL_INPUT_CLASSNAME}
      />
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="min-w-48 px-3 py-2 text-left font-medium text-muted-foreground">Item</th>
              {columns.map((column) => (
                <th key={column.id} className="min-w-40 px-3 py-2 text-left font-medium text-muted-foreground">
                  <div className="flex items-center justify-between gap-2">
                    <span>
                      {column.name}
                      <span className="ml-1.5 font-normal text-muted-foreground/70">
                        ({BOARD_COLUMN_TYPE_LABELS[column.type]})
                      </span>
                    </span>
                    <div className="flex shrink-0 items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setColumnDialog({ open: true, column })}
                        aria-label={`Edit ${column.name} column`}
                      >
                        <Settings />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() =>
                          setPendingDelete({ kind: "column", id: column.id, label: column.name })
                        }
                        aria-label={`Delete ${column.name} column`}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </th>
              ))}
              <th className="w-10 px-3 py-2">
                <Button variant="ghost" size="icon-sm" onClick={() => setColumnDialog({ open: true, column: null })}>
                  <Plus />
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                <td className="px-3 py-1.5">
                  <input
                    key={`${item.id}:${item.name}`}
                    type="text"
                    defaultValue={item.name}
                    onBlur={(e) => {
                      const trimmed = e.target.value.trim();
                      if (!trimmed || trimmed === item.name) return;
                      startTransition(async () => {
                        const result = await renameItem(item.id, trimmed);
                        if (result.error) {
                          setError(result.error);
                          return;
                        }
                        setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, name: trimmed } : i)));
                      });
                    }}
                    className={CELL_INPUT_CLASSNAME + " font-medium"}
                  />
                </td>
                {columns.map((column) => (
                  <td key={column.id} className="px-3 py-1.5">
                    {renderCell(item, column)}
                  </td>
                ))}
                <td className="px-3 py-1.5 text-center">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setPendingDelete({ kind: "item", id: item.id, label: item.name })}
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button variant="outline" size="sm" onClick={handleAddItem} disabled={isPending}>
        <Plus /> Add item
      </Button>

      <ColumnDialog
        open={columnDialog.open}
        onOpenChange={(open) => setColumnDialog((prev) => ({ ...prev, open }))}
        boardId={boardId}
        column={columnDialog.column}
        onSaved={handleColumnSaved}
      />

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {pendingDelete?.kind === "column" ? "column" : "item"} &ldquo;{pendingDelete?.label}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.kind === "column"
                ? "This removes the column and every item's value in it. This can't be undone."
                : "This removes the item and all of its values. This can't be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
