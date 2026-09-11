export const WIDGET_TYPES = ["number", "chart", "table"] as const;
export type WidgetType = (typeof WIDGET_TYPES)[number];

export const WIDGET_TYPE_LABELS: Record<WidgetType, string> = {
  number: "Number",
  chart: "Chart",
  table: "Table",
};

export const CHART_TYPES = ["bar", "line", "pie"] as const;
export type ChartType = (typeof CHART_TYPES)[number];

export const CHART_TYPE_LABELS: Record<ChartType, string> = {
  bar: "Bar",
  line: "Line",
  pie: "Pie",
};

export const AGGREGATIONS = ["sum", "avg", "count", "min", "max"] as const;
export type Aggregation = (typeof AGGREGATIONS)[number];

export const AGGREGATION_LABELS: Record<Aggregation, string> = {
  sum: "Sum",
  avg: "Average",
  count: "Count",
  min: "Minimum",
  max: "Maximum",
};

export const MAX_DASHBOARD_NAME_LENGTH = 80;
export const MAX_DASHBOARD_DESCRIPTION_LENGTH = 300;
export const MAX_WIDGET_TITLE_LENGTH = 60;

export const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];
