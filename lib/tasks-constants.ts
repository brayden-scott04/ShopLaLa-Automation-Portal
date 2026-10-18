export const MAX_TASK_TITLE_LENGTH = 120;
export const MAX_TASK_NOTES_LENGTH = 2000;
export const MAX_TASK_UPDATE_LENGTH = 1000;

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
  2: "bg-sky-100 text-sky-800 dark:bg-sky-500/25 dark:text-sky-200",
  3: "bg-amber-300 font-medium text-amber-950 dark:bg-amber-400 dark:text-amber-950",
  4: "bg-orange-500 font-semibold text-white dark:bg-orange-500 dark:text-white",
  5: "bg-red-600 font-bold text-white dark:bg-red-600 dark:text-white",
};
