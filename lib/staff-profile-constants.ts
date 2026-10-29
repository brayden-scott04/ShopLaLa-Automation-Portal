// Shared by lib/actions/staff-profile.ts and the /team/<username> Profile tab. Kept out of the
// "use server" file because constants exported from one arrive as undefined on the client.
// Limits must match the CHECK constraints in sql/staff_profiles_migration.sql.

export const TEAM_NAME_MAX = 40;
export const RESPONSIBILITY_TITLE_MAX = 120;
export const PRIORITY_LABEL_MAX = 40;
export const PRIORITY_DESCRIPTION_MAX = 200;
export const PRIORITY_LEVEL_MAX = 99;

/** Priority 0 is "inactive / on hold" by convention: always listed last and greyed out. */
export const INACTIVE_PRIORITY = 0;

/** Wording taken from the legend on the original "Reporting & Responsibility" sheet. */
export const PEOPLE_MANAGER_HINT =
  "Salary, performance review, attendance, leave, general employee matters, career development";
export const FUNCTIONAL_MANAGER_HINT = "Main work/tasks, priorities, targets, projects, daily work direction";

export interface PriorityLevel {
  level: number;
  label: string;
  description: string | null;
}

/** One task as it appears on one person's list: shared fields plus that person's priority. */
export interface Responsibility {
  id: string;
  title: string;
  project_manager: string | null;
  /** This person's priority for the task. */
  priority: number;
  position: number;
  /** Everyone else working on the same task. */
  coAssignees: string[];
}

/** A task offered in the "Add existing task" picker. */
export interface TaskOption {
  id: string;
  title: string;
  project_manager: string | null;
  assignees: string[];
}

export interface TeamWithMembers {
  id: string;
  name: string;
  members: string[];
}

/** Active priorities first (1, 2, 3…), inactive (0) last, then by hand order. */
export function compareResponsibilities(a: Responsibility, b: Responsibility): number {
  const rank = (p: number) => (p === INACTIVE_PRIORITY ? Number.MAX_SAFE_INTEGER : p);
  return rank(a.priority) - rank(b.priority) || a.position - b.position;
}
