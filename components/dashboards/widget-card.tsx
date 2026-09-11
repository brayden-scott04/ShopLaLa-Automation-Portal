"use client";

import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts";
import { ChevronDown, ChevronUp, Settings, Trash2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { StatusBadge } from "@/components/boards/status-badge";
import type {
  DashboardWidgetResult,
  NumberWidgetResult,
  ChartWidgetResult,
  TableWidgetResult,
} from "@/lib/actions/dashboards";
import { CHART_COLORS } from "@/lib/dashboards-constants";

const CHART_CONFIG: ChartConfig = { value: { label: "Value", color: CHART_COLORS[0] } };

export function WidgetCard({
  widget,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: {
  widget: DashboardWidgetResult;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{widget.title}</CardTitle>
        <CardAction className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon-xs" onClick={onMoveUp} disabled={!canMoveUp} aria-label="Move up">
            <ChevronUp />
          </Button>
          <Button variant="ghost" size="icon-xs" onClick={onMoveDown} disabled={!canMoveDown} aria-label="Move down">
            <ChevronDown />
          </Button>
          <Button variant="ghost" size="icon-xs" onClick={onEdit} aria-label="Edit widget">
            <Settings />
          </Button>
          <Button variant="ghost" size="icon-xs" onClick={onDelete} aria-label="Delete widget">
            <Trash2 />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {widget.configInvalid || !widget.result ? (
          <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-4 text-sm text-muted-foreground">
            <TriangleAlert className="size-4 shrink-0" />
            This widget&apos;s source column or board no longer exists. Edit or remove it.
          </div>
        ) : widget.type === "number" ? (
          <NumberWidgetBody result={widget.result as NumberWidgetResult} />
        ) : widget.type === "chart" ? (
          <ChartWidgetBody
            result={widget.result as ChartWidgetResult}
            chartType={widget.config.mode === "chart" ? widget.config.chartType : "bar"}
          />
        ) : (
          <TableWidgetBody result={widget.result as TableWidgetResult} />
        )}
      </CardContent>
    </Card>
  );
}

function NumberWidgetBody({ result }: { result: NumberWidgetResult }) {
  return (
    <p className="text-3xl font-semibold tabular-nums text-foreground">
      {result.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
    </p>
  );
}

function ChartWidgetBody({ result, chartType }: { result: ChartWidgetResult; chartType: "bar" | "line" | "pie" }) {
  if (result.data.length === 0) {
    return <p className="text-sm text-muted-foreground">No data yet.</p>;
  }

  if (chartType === "pie") {
    return (
      <ChartContainer config={CHART_CONFIG} className="mx-auto max-h-64">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie data={result.data} dataKey="value" nameKey="label" outerRadius={90}>
            {result.data.map((_, index) => (
              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    );
  }

  if (chartType === "line") {
    return (
      <ChartContainer config={CHART_CONFIG} className="max-h-64">
        <LineChart data={result.data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={32} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer config={CHART_CONFIG} className="max-h-64">
      <BarChart data={result.data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={32} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="var(--color-value)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

function TableWidgetBody({ result }: { result: TableWidgetResult }) {
  if (result.rows.length === 0) {
    return <p className="text-sm text-muted-foreground">No items yet.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">Item</th>
            {result.columns.map((c) => (
              <th key={c.id} className="px-2 py-1.5 text-left font-medium text-muted-foreground">
                {c.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows.map((row) => (
            <tr key={row.itemId} className="border-b border-border last:border-b-0">
              <td className="px-2 py-1.5 font-medium">{row.itemName}</td>
              {result.columns.map((c) => {
                const value = row.values[c.id];
                return (
                  <td key={c.id} className="px-2 py-1.5">
                    {c.type === "status" ? (
                      <StatusBadge optionKey={value as string | null} options={c.options} />
                    ) : c.type === "checkbox" ? (
                      value === true ? (
                        "Yes"
                      ) : (
                        "No"
                      )
                    ) : value !== null && value !== undefined ? (
                      String(value)
                    ) : (
                      "—"
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
