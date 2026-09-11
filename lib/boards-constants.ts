export const BOARD_COLUMN_TYPES = ["text", "number", "status", "date", "checkbox"] as const;
export type BoardColumnType = (typeof BOARD_COLUMN_TYPES)[number];

export const BOARD_COLUMN_TYPE_LABELS: Record<BoardColumnType, string> = {
  text: "Text",
  number: "Number",
  status: "Status",
  date: "Date",
  checkbox: "Checkbox",
};

export interface StatusColorSwatch {
  key: string;
  label: string;
  dot: string;
  chip: string;
}

/** Fixed picker palette for Status column options — same shape as calendar's TASK_COLORS. */
export const STATUS_COLOR_SWATCHES: StatusColorSwatch[] = [
  { key: "gray", label: "Gray", dot: "bg-gray-500", chip: "bg-gray-500/15 text-gray-600 dark:text-gray-400" },
  { key: "red", label: "Red", dot: "bg-red-500", chip: "bg-red-500/15 text-red-600 dark:text-red-400" },
  { key: "orange", label: "Orange", dot: "bg-orange-500", chip: "bg-orange-500/15 text-orange-600 dark:text-orange-400" },
  { key: "yellow", label: "Yellow", dot: "bg-yellow-500", chip: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400" },
  { key: "green", label: "Green", dot: "bg-green-500", chip: "bg-green-500/15 text-green-600 dark:text-green-400" },
  { key: "blue", label: "Blue", dot: "bg-blue-500", chip: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
  { key: "purple", label: "Purple", dot: "bg-purple-500", chip: "bg-purple-500/15 text-purple-600 dark:text-purple-400" },
  { key: "pink", label: "Pink", dot: "bg-pink-500", chip: "bg-pink-500/15 text-pink-600 dark:text-pink-400" },
];

export const DEFAULT_STATUS_COLOR = "gray";

export function swatchFor(colorKey: string): StatusColorSwatch {
  return STATUS_COLOR_SWATCHES.find((s) => s.key === colorKey) ?? STATUS_COLOR_SWATCHES[0];
}

export const MAX_BOARD_NAME_LENGTH = 80;
export const MAX_BOARD_DESCRIPTION_LENGTH = 300;
export const MAX_COLUMN_NAME_LENGTH = 40;
export const MAX_ITEM_NAME_LENGTH = 120;
export const MAX_STATUS_OPTIONS = 12;
export const MAX_STATUS_OPTION_LABEL_LENGTH = 30;
