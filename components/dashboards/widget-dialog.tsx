"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { getBoard, type BoardColumn } from "@/lib/actions/boards";
import { createWidget, updateWidget, type DashboardWidget, type WidgetConfig } from "@/lib/actions/dashboards";
import {
  WIDGET_TYPES,
  WIDGET_TYPE_LABELS,
  CHART_TYPES,
  CHART_TYPE_LABELS,
  AGGREGATIONS,
  AGGREGATION_LABELS,
  MAX_WIDGET_TITLE_LENGTH,
  type WidgetType,
  type ChartType,
  type Aggregation,
} from "@/lib/dashboards-constants";

const SELECT_CLASSNAME =
  "w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50";

export function WidgetDialog({
  open,
  onOpenChange,
  dashboardId,
  connectedBoards,
  widget,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dashboardId: string;
  connectedBoards: { id: string; name: string }[];
  widget: DashboardWidget | null;
  onSaved: (widget: DashboardWidget) => void;
}) {
  const [type, setType] = useState<WidgetType>("number");
  const [title, setTitle] = useState("");
  const [boardId, setBoardId] = useState("");
  const [columns, setColumns] = useState<BoardColumn[]>([]);

  // Number
  const [aggregation, setAggregation] = useState<Aggregation>("count");
  const [numberColumnId, setNumberColumnId] = useState("");
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [filterStatusColumnId, setFilterStatusColumnId] = useState("");
  const [filterOptionKey, setFilterOptionKey] = useState("");

  // Chart
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [groupByColumnId, setGroupByColumnId] = useState("");
  const [metricType, setMetricType] = useState<"count" | "aggregate">("count");
  const [metricColumnId, setMetricColumnId] = useState("");
  const [metricAggregation, setMetricAggregation] = useState<Aggregation>("sum");

  // Table
  const [rowLimit, setRowLimit] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  // Tracks the closed->open edge so the reset below (a render-time "adjusting
  // state when a prop changes" per the React docs) fires once per open.
  const [wasOpen, setWasOpen] = useState(false);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setError(null);

      const config = widget?.config;
      setType(widget?.type ?? "number");
      setTitle(widget?.title ?? "");
      const initialBoardId = config?.boardId ?? connectedBoards[0]?.id ?? "";
      setBoardId(initialBoardId);

      if (config?.mode === "number") {
        setAggregation(config.aggregation);
        setNumberColumnId(config.columnId ?? "");
        setFilterEnabled(!!config.filter);
        setFilterStatusColumnId(config.filter?.statusColumnId ?? "");
        setFilterOptionKey(config.filter?.optionKey ?? "");
      } else {
        setAggregation("count");
        setNumberColumnId("");
        setFilterEnabled(false);
        setFilterStatusColumnId("");
        setFilterOptionKey("");
      }

      if (config?.mode === "chart") {
        setChartType(config.chartType);
        setGroupByColumnId(config.groupByColumnId);
        setMetricType(config.metric.type);
        setMetricColumnId(config.metric.type === "aggregate" ? config.metric.columnId : "");
        setMetricAggregation(config.metric.type === "aggregate" ? config.metric.aggregation : "sum");
      } else {
        setChartType("bar");
        setGroupByColumnId("");
        setMetricType("count");
        setMetricColumnId("");
        setMetricAggregation("sum");
      }

      setRowLimit(config?.mode === "table" && config.rowLimit ? String(config.rowLimit) : "");
    }
  }

  useEffect(() => {
    if (!open || !boardId) {
      startTransition(() => setColumns([]));
      return;
    }
    startTransition(async () => {
      const result = await getBoard(boardId);
      setColumns(result.data?.columns ?? []);
    });
  }, [open, boardId]);

  const numberColumns = columns.filter((c) => c.type === "number");
  const statusColumns = columns.filter((c) => c.type === "status");
  const groupableColumns = columns.filter((c) => c.type === "status" || c.type === "date");
  const selectedFilterColumn = statusColumns.find((c) => c.id === filterStatusColumnId);

  function buildConfig(): WidgetConfig | null {
    if (!boardId) return null;

    if (type === "number") {
      if (aggregation !== "count" && !numberColumnId) return null;
      const filter =
        filterEnabled && filterStatusColumnId && filterOptionKey
          ? { statusColumnId: filterStatusColumnId, optionKey: filterOptionKey }
          : undefined;
      return {
        mode: "number",
        boardId,
        columnId: aggregation === "count" ? null : numberColumnId,
        aggregation,
        filter,
      };
    }

    if (type === "chart") {
      if (!groupByColumnId) return null;
      if (metricType === "aggregate" && !metricColumnId) return null;
      return {
        mode: "chart",
        boardId,
        chartType,
        groupByColumnId,
        metric:
          metricType === "count"
            ? { type: "count" }
            : { type: "aggregate", columnId: metricColumnId, aggregation: metricAggregation },
      };
    }

    const limit = rowLimit.trim() ? Number(rowLimit) : undefined;
    return { mode: "table", boardId, rowLimit: limit };
  }

  function handleSave() {
    setError(null);
    const config = buildConfig();
    if (!config) {
      setError("Fill in the required fields for this widget type");
      return;
    }
    startTransition(async () => {
      const result = widget
        ? await updateWidget(widget.id, { title, config })
        : await createWidget(dashboardId, { type, title, config });
      if (result.error || !result.data) {
        setError(result.error ?? "Something went wrong");
        return;
      }
      onSaved(result.data);
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{widget ? "Edit widget" : "Add widget"}</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="widget-title">Title</Label>
            <Input
              id="widget-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={MAX_WIDGET_TITLE_LENGTH}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="widget-type">Widget type</Label>
              <select
                id="widget-type"
                value={type}
                disabled={!!widget}
                onChange={(e) => setType(e.target.value as WidgetType)}
                className={SELECT_CLASSNAME}
              >
                {WIDGET_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {WIDGET_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="widget-board">Board</Label>
              <select
                id="widget-board"
                value={boardId}
                onChange={(e) => setBoardId(e.target.value)}
                className={SELECT_CLASSNAME}
              >
                {connectedBoards.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {type === "number" && (
            <div className="space-y-3 rounded-lg border border-border p-3">
              <div className="space-y-1.5">
                <Label htmlFor="widget-aggregation">Aggregation</Label>
                <select
                  id="widget-aggregation"
                  value={aggregation}
                  onChange={(e) => setAggregation(e.target.value as Aggregation)}
                  className={SELECT_CLASSNAME}
                >
                  {AGGREGATIONS.map((a) => (
                    <option key={a} value={a}>
                      {AGGREGATION_LABELS[a]}
                    </option>
                  ))}
                </select>
              </div>
              {aggregation !== "count" && (
                <div className="space-y-1.5">
                  <Label htmlFor="widget-number-column">Number column</Label>
                  <select
                    id="widget-number-column"
                    value={numberColumnId}
                    onChange={(e) => setNumberColumnId(e.target.value)}
                    className={SELECT_CLASSNAME}
                  >
                    <option value="">Select a column…</option>
                    {numberColumns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={filterEnabled}
                  onCheckedChange={(checked) => setFilterEnabled(checked === true)}
                  disabled={statusColumns.length === 0}
                />
                Only count items matching a Status value
              </label>
              {filterEnabled && (
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={filterStatusColumnId}
                    onChange={(e) => {
                      setFilterStatusColumnId(e.target.value);
                      setFilterOptionKey("");
                    }}
                    className={SELECT_CLASSNAME}
                  >
                    <option value="">Status column…</option>
                    {statusColumns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filterOptionKey}
                    onChange={(e) => setFilterOptionKey(e.target.value)}
                    disabled={!selectedFilterColumn}
                    className={SELECT_CLASSNAME}
                  >
                    <option value="">Value…</option>
                    {selectedFilterColumn?.options.map((o) => (
                      <option key={o.key} value={o.key}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {type === "chart" && (
            <div className="space-y-3 rounded-lg border border-border p-3">
              <div className="space-y-1.5">
                <Label htmlFor="widget-chart-type">Chart type</Label>
                <select
                  id="widget-chart-type"
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value as ChartType)}
                  className={SELECT_CLASSNAME}
                >
                  {CHART_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {CHART_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="widget-group-by">Group by</Label>
                <select
                  id="widget-group-by"
                  value={groupByColumnId}
                  onChange={(e) => setGroupByColumnId(e.target.value)}
                  className={SELECT_CLASSNAME}
                >
                  <option value="">Select a Status or Date column…</option>
                  {groupableColumns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="widget-metric-type">Metric</Label>
                <select
                  id="widget-metric-type"
                  value={metricType}
                  onChange={(e) => setMetricType(e.target.value as "count" | "aggregate")}
                  className={SELECT_CLASSNAME}
                >
                  <option value="count">Count of items</option>
                  <option value="aggregate">Aggregate a Number column</option>
                </select>
              </div>
              {metricType === "aggregate" && (
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={metricAggregation}
                    onChange={(e) => setMetricAggregation(e.target.value as Aggregation)}
                    className={SELECT_CLASSNAME}
                  >
                    {AGGREGATIONS.filter((a) => a !== "count").map((a) => (
                      <option key={a} value={a}>
                        {AGGREGATION_LABELS[a]}
                      </option>
                    ))}
                  </select>
                  <select
                    value={metricColumnId}
                    onChange={(e) => setMetricColumnId(e.target.value)}
                    className={SELECT_CLASSNAME}
                  >
                    <option value="">Column…</option>
                    {numberColumns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {type === "table" && (
            <div className="space-y-1.5 rounded-lg border border-border p-3">
              <Label htmlFor="widget-row-limit">Row limit (optional)</Label>
              <Input
                id="widget-row-limit"
                type="number"
                min={1}
                max={500}
                value={rowLimit}
                onChange={(e) => setRowLimit(e.target.value)}
                placeholder="All rows"
              />
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending || !title.trim() || !boardId}>
            {widget ? "Save" : "Add widget"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
