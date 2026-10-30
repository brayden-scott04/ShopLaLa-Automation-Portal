// Shared by lib/actions/skills.ts and the /team/<username> page. Kept out of the "use server"
// file because constants exported from one arrive as undefined on the client.
// TEAMS and LEVELS must match the CHECK constraints in sql/staff_skills_migration.sql.

export const SKILL_TEAMS = ["Supply Chain", "Market Ops", "Visual", "Social Media", "Others"] as const;
export type SkillTeam = (typeof SKILL_TEAMS)[number];

/** Suggested values for the Add skill form; the column itself is free text. */
export const SKILL_MARKETS = ["All Mkt", "US/CA", "US/CA/MX", "EU", "AU"] as const;

/** Ordered strongest first. No staff_skills row means "not applicable". */
export const SKILL_LEVELS = ["in_charge", "can_do", "learning"] as const;
export type SkillLevel = (typeof SKILL_LEVELS)[number];

/** Red / green / blue echo the original sheet's red 1, black 1 and blue 0. */
export const SKILL_LEVEL_BADGE: Record<SkillLevel, string> = {
  in_charge: "bg-red-500/10 text-red-600 dark:text-red-400",
  can_do: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  learning: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

export const SKILL_LEVEL_DOT: Record<SkillLevel, string> = {
  in_charge: "bg-red-500",
  can_do: "bg-emerald-500",
  learning: "bg-blue-500",
};

export const SKILL_TASK_MAX = 80;
export const SKILL_MARKET_MAX = 30;
export const SKILL_DESCRIPTION_MAX = 300;

export interface Skill {
  id: string;
  team: SkillTeam;
  task: string;
  market: string | null;
  description: string | null;
  /** Optional Chinese text, shown in 中文 mode (sql/staff_language_migration.sql). */
  task_zh?: string | null;
  description_zh?: string | null;
  position: number;
}
