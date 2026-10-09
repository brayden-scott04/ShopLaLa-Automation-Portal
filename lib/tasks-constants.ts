export const MAX_TASK_TITLE_LENGTH = 120;
export const MAX_TASK_NOTES_LENGTH = 2000;

export const PRIORITIES = [1, 2, 3, 4, 5] as const;

/** 5 = highest priority. */
export const PRIORITY_LABELS: Record<number, string> = {
  1: "Lowest",
  2: "Low",
  3: "Medium",
  4: "High",
  5: "Highest",
};

export const PRIORITY_CLASSES: Record<number, string> = {
  1: "bg-muted text-muted-foreground",
  2: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  3: "bg-yellow-500/20 text-yellow-800 dark:text-yellow-300",
  4: "bg-orange-500/20 text-orange-800 dark:text-orange-300",
  5: "bg-red-500/20 font-semibold text-red-700 dark:text-red-300",
};
