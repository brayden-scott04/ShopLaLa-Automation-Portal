"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getSession } from "@/lib/session";
import { canManageProfiles, toRole, type Role } from "@/lib/roles";
import {
  SKILL_DESCRIPTION_MAX,
  SKILL_LEVELS,
  SKILL_MARKET_MAX,
  SKILL_TASK_MAX,
  SKILL_TEAMS,
  type Skill,
  type SkillLevel,
  type SkillTeam,
} from "@/lib/skills-constants";

import { getT } from "@/lib/i18n/server";
import type { MessageKey, Vars } from "@/lib/i18n/translate";

/** Error text in the caller's language. */
async function tr(key: MessageKey, vars?: Vars): Promise<string> {
  return (await getT())(key, vars);
}

type Result<T> = { data: T | null; error: string | null };

export interface StaffSkillsView {
  member: { username: string; role: Role; job_role: string | null };
  skills: Skill[];
  levels: Record<string, SkillLevel>;
  canEdit: boolean;
}

/**
 * Server actions are independently callable POST endpoints, so writes re-check the role
 * here rather than trusting the page to hide its controls.
 */
async function requireSkillsEditor() {
  const session = await getSession();
  if (!session) return { session: null, error: "Unauthorized" as const };
  if (!canManageProfiles(session.role)) return { session: null, error: "Forbidden" as const };
  return { session, error: null };
}

/** Any signed-in staff member can view anyone's skills. */
export async function getStaffSkills(username: string): Promise<Result<StaffSkillsView>> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const client = await createClient();
  const [memberRes, skillsRes, levelsRes] = await Promise.all([
    client.from("staff").select("username, role, job_role").eq("username", username).maybeSingle(),
    // "*" rather than a column list: the _zh columns only exist after sql/staff_language_migration.sql.
    client.from("skills").select("*").order("position"),
    client.from("staff_skills").select("skill_id, level").eq("username", username),
  ]);
  if (memberRes.error) return { data: null, error: memberRes.error.message };
  if (!memberRes.data) return { data: null, error: "Not found" };
  if (skillsRes.error) return { data: null, error: skillsRes.error.message };
  if (levelsRes.error) return { data: null, error: levelsRes.error.message };

  const levels: Record<string, SkillLevel> = {};
  for (const row of levelsRes.data ?? []) levels[row.skill_id] = row.level as SkillLevel;

  return {
    data: {
      member: { ...memberRes.data, role: toRole(memberRes.data.role) },
      skills: (skillsRes.data ?? []) as Skill[],
      levels,
      canEdit: canManageProfiles(session.role),
    },
    error: null,
  };
}

/** `null` marks the skill not applicable to this person (deletes the row). */
export async function setStaffSkillLevel(
  username: string,
  skillId: string,
  level: SkillLevel | null,
): Promise<Result<null>> {
  const { session, error } = await requireSkillsEditor();
  if (error) return { data: null, error };
  if (level !== null && !SKILL_LEVELS.includes(level)) return { data: null, error: await tr("errors.invalidLevel") };

  const service = createServiceClient();
  const { error: dbError } =
    level === null
      ? await service.from("staff_skills").delete().eq("username", username).eq("skill_id", skillId)
      : await service.from("staff_skills").upsert({
          username,
          skill_id: skillId,
          level,
          updated_at: new Date().toISOString(),
          updated_by: session!.username,
        });

  return { data: null, error: dbError?.message ?? null };
}

export async function createSkill(input: {
  team: string;
  task: string;
  market: string;
  description: string;
  taskZh?: string;
  descriptionZh?: string;
}): Promise<Result<Skill>> {
  const { session, error } = await requireSkillsEditor();
  if (error) return { data: null, error };

  const team = input.team as SkillTeam;
  const task = input.task.trim();
  const market = input.market.trim();
  const description = input.description.trim();
  const taskZh = input.taskZh?.trim() ?? "";
  const descriptionZh = input.descriptionZh?.trim() ?? "";
  if (!SKILL_TEAMS.includes(team)) return { data: null, error: await tr("errors.pickTeam") };
  if (!task) return { data: null, error: await tr("errors.enterSkill") };
  if (task.length > SKILL_TASK_MAX || taskZh.length > SKILL_TASK_MAX) return { data: null, error: await tr("errors.skillTooLong", { max: SKILL_TASK_MAX }) };
  if (market.length > SKILL_MARKET_MAX) return { data: null, error: await tr("errors.marketTooLong", { max: SKILL_MARKET_MAX }) };
  if (description.length > SKILL_DESCRIPTION_MAX || descriptionZh.length > SKILL_DESCRIPTION_MAX) {
    return { data: null, error: await tr("errors.descriptionTooLong", { max: SKILL_DESCRIPTION_MAX }) };
  }

  const service = createServiceClient();
  const { data: last } = await service
    .from("skills")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error: dbError } = await service
    .from("skills")
    .insert({
      team,
      task,
      market: market || null,
      description: description || null,
      position: (last?.position ?? 0) + 1,
      created_by: session!.username,
      // Only sent when filled, so adding an English-only skill works before the _zh columns exist.
      ...(taskZh ? { task_zh: taskZh } : {}),
      ...(descriptionZh ? { description_zh: descriptionZh } : {}),
    })
    .select("*")
    .single();

  if (dbError) {
    return {
      data: null,
      error: dbError.code === "23505" ? await tr("errors.skillExists") : dbError.message,
    };
  }
  return { data: data as Skill, error: null };
}
