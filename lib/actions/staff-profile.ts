"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getSession } from "@/lib/session";
import { canManageProfiles, toRole, type Role } from "@/lib/roles";
import {
  PRIORITY_DESCRIPTION_MAX,
  PRIORITY_LABEL_MAX,
  PRIORITY_LEVEL_MAX,
  RESPONSIBILITY_TITLE_MAX,
  TEAM_NAME_MAX,
  type PriorityLevel,
  type Responsibility,
  type TaskOption,
  type TeamWithMembers,
} from "@/lib/staff-profile-constants";

type Result<T> = { data: T | null; error: string | null };

export interface StaffProfile {
  member: {
    username: string;
    role: Role;
    job_role: string | null;
    people_manager: string | null;
    profile_reviewed_on: string | null;
  };
  functionalManagers: string[];
  /** Teams this person belongs to, with every member of each. */
  teams: TeamWithMembers[];
  /** Every team, for the "Add to team" picker. */
  allTeams: { id: string; name: string }[];
  responsibilities: Responsibility[];
  /** Every task, for the "Add existing task" picker. Only sent to editors. */
  allTasks: TaskOption[];
  priorities: PriorityLevel[];
  /** All staff usernames, for the manager and member pickers. */
  directory: string[];
  canEdit: boolean;
}

/**
 * Server actions are independently callable POST endpoints, so every write re-checks the role
 * here rather than trusting the page to hide its controls.
 */
async function requireProfileEditor() {
  const session = await getSession();
  if (!session) return { session: null, error: "Unauthorized" as const };
  if (!canManageProfiles(session.role)) return { session: null, error: "Forbidden" as const };
  return { session, error: null };
}

function friendlyError(error: { message: string; code?: string } | null): string | null {
  if (!error) return null;
  if (error.code === "23503") return "That staff member or priority no longer exists";
  if (error.code === "23514") return "Someone can't be their own manager";
  return error.message;
}

/** Any signed-in staff member can view anyone's profile. */
export async function getStaffProfile(username: string): Promise<Result<StaffProfile>> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const client = await createClient();
  const [memberRes, fmRes, myTeamsRes, allTeamsRes, tasksRes, assigneesRes, prioRes, dirRes] = await Promise.all([
    client
      .from("staff")
      .select("username, role, job_role, people_manager, profile_reviewed_on")
      .eq("username", username)
      .maybeSingle(),
    client.from("staff_functional_managers").select("manager_username").eq("username", username).order("position"),
    client.from("team_members").select("team_id").eq("username", username),
    client.from("teams").select("id, name").order("name"),
    client.from("responsibilities").select("id, title, project_manager").order("title"),
    client.from("responsibility_assignees").select("responsibility_id, username, priority, position").order("username"),
    client.from("responsibility_priorities").select("level, label, description").order("level"),
    client.from("staff").select("username").order("username"),
  ]);
  for (const res of [memberRes, fmRes, myTeamsRes, allTeamsRes, tasksRes, assigneesRes, prioRes, dirRes]) {
    if (res.error) return { data: null, error: res.error.message };
  }
  if (!memberRes.data) return { data: null, error: "Not found" };

  const teamIds = (myTeamsRes.data ?? []).map((t) => t.team_id as string);
  let teams: TeamWithMembers[] = [];
  if (teamIds.length > 0) {
    const { data: members, error } = await client
      .from("team_members")
      .select("team_id, username")
      .in("team_id", teamIds)
      .order("username");
    if (error) return { data: null, error: error.message };
    teams = (allTeamsRes.data ?? [])
      .filter((t) => teamIds.includes(t.id))
      .map((t) => ({
        id: t.id,
        name: t.name,
        members: (members ?? []).filter((m) => m.team_id === t.id).map((m) => m.username as string),
      }));
  }

  // Task lists are small (a handful per person), so both views are built from one full read.
  const assignees = assigneesRes.data ?? [];
  const tasks = (tasksRes.data ?? []).map((t) => ({
    ...t,
    assignees: assignees.filter((a) => a.responsibility_id === t.id).map((a) => a.username as string),
  })) as TaskOption[];
  const responsibilities: Responsibility[] = assignees
    .filter((a) => a.username === username)
    .flatMap((a) => {
      const task = tasks.find((t) => t.id === a.responsibility_id);
      if (!task) return [];
      return [
        {
          id: task.id,
          title: task.title,
          project_manager: task.project_manager,
          priority: a.priority,
          position: a.position,
          coAssignees: task.assignees.filter((u) => u !== username),
        },
      ];
    });
  const canEdit = canManageProfiles(session.role);

  return {
    data: {
      member: { ...memberRes.data, role: toRole(memberRes.data.role) },
      functionalManagers: (fmRes.data ?? []).map((r) => r.manager_username as string),
      teams,
      allTeams: allTeamsRes.data ?? [],
      responsibilities,
      allTasks: canEdit ? tasks : [],
      priorities: (prioRes.data ?? []) as PriorityLevel[],
      directory: (dirRes.data ?? []).map((r) => r.username as string),
      canEdit,
    },
    error: null,
  };
}

// ── Reporting lines ─────────────────────────────────────────────────────────

export async function setPeopleManager(username: string, manager: string | null): Promise<Result<null>> {
  const { error } = await requireProfileEditor();
  if (error) return { data: null, error };
  if (manager === username) return { data: null, error: "Someone can't be their own manager" };

  const { error: dbError } = await createServiceClient()
    .from("staff")
    .update({ people_manager: manager || null })
    .eq("username", username);
  return { data: null, error: friendlyError(dbError) };
}

export async function addFunctionalManager(username: string, manager: string): Promise<Result<null>> {
  const { error } = await requireProfileEditor();
  if (error) return { data: null, error };
  if (manager === username) return { data: null, error: "Someone can't be their own manager" };

  const service = createServiceClient();
  const { data: last } = await service
    .from("staff_functional_managers")
    .select("position")
    .eq("username", username)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { error: dbError } = await service
    .from("staff_functional_managers")
    .upsert({ username, manager_username: manager, position: (last?.position ?? 0) + 1 });
  return { data: null, error: friendlyError(dbError) };
}

export async function removeFunctionalManager(username: string, manager: string): Promise<Result<null>> {
  const { error } = await requireProfileEditor();
  if (error) return { data: null, error };

  const { error: dbError } = await createServiceClient()
    .from("staff_functional_managers")
    .delete()
    .eq("username", username)
    .eq("manager_username", manager);
  return { data: null, error: friendlyError(dbError) };
}

/** `date` is "YYYY-MM-DD", or null to clear. */
export async function setProfileReviewedOn(username: string, date: string | null): Promise<Result<null>> {
  const { error } = await requireProfileEditor();
  if (error) return { data: null, error };
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) return { data: null, error: "Invalid date" };

  const { error: dbError } = await createServiceClient()
    .from("staff")
    .update({ profile_reviewed_on: date || null })
    .eq("username", username);
  return { data: null, error: friendlyError(dbError) };
}

// ── Teams ───────────────────────────────────────────────────────────────────

export async function createTeam(name: string): Promise<Result<{ id: string; name: string }>> {
  const { session, error } = await requireProfileEditor();
  if (error) return { data: null, error };

  const trimmed = name.trim();
  if (!trimmed) return { data: null, error: "Enter a team name" };
  if (trimmed.length > TEAM_NAME_MAX) return { data: null, error: `Team name must be ${TEAM_NAME_MAX} characters or fewer` };

  const { data, error: dbError } = await createServiceClient()
    .from("teams")
    .insert({ name: trimmed, created_by: session!.username })
    .select("id, name")
    .single();
  if (dbError?.code === "23505") return { data: null, error: "A team with that name already exists" };
  return { data, error: friendlyError(dbError) };
}

export async function addTeamMember(teamId: string, username: string): Promise<Result<null>> {
  const { error } = await requireProfileEditor();
  if (error) return { data: null, error };

  const { error: dbError } = await createServiceClient()
    .from("team_members")
    .upsert({ team_id: teamId, username }, { ignoreDuplicates: true });
  return { data: null, error: friendlyError(dbError) };
}

/** Removing the last member also deletes the team, so empty teams don't pile up in the picker. */
export async function removeTeamMember(teamId: string, username: string): Promise<Result<null>> {
  const { error } = await requireProfileEditor();
  if (error) return { data: null, error };

  const service = createServiceClient();
  const { error: dbError } = await service.from("team_members").delete().eq("team_id", teamId).eq("username", username);
  if (dbError) return { data: null, error: friendlyError(dbError) };

  const { count } = await service.from("team_members").select("username", { count: "exact", head: true }).eq("team_id", teamId);
  if (count === 0) await service.from("teams").delete().eq("id", teamId);
  return { data: null, error: null };
}

// ── Tasks / projects ────────────────────────────────────────────────────────
// A task is shared (`responsibilities`); each person on it has their own priority
// (`responsibility_assignees`). Title and Project Manager edits show for everyone on the task.

interface TaskInput {
  title: string;
  projectManager: string | null;
}

function cleanTask(input: TaskInput) {
  const title = input.title.trim();
  if (!title) return { row: null, error: "Enter a task or project" };
  if (title.length > RESPONSIBILITY_TITLE_MAX) {
    return { row: null, error: `Task/project must be ${RESPONSIBILITY_TITLE_MAX} characters or fewer` };
  }
  return { row: { title, project_manager: input.projectManager || null }, error: null };
}

/** Adds `username` to an existing task at the end of their list. Returns an error message or null. */
async function insertAssignee(
  service: ReturnType<typeof createServiceClient>,
  responsibilityId: string,
  username: string,
  priority: number,
): Promise<string | null> {
  if (!Number.isInteger(priority)) return "Pick a priority";
  const { data: last } = await service
    .from("responsibility_assignees")
    .select("position")
    .eq("username", username)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { error } = await service
    .from("responsibility_assignees")
    .insert({ responsibility_id: responsibilityId, username, priority, position: (last?.position ?? 0) + 1 });
  if (error?.code === "23505") return `${username} is already on this task`;
  return friendlyError(error);
}

/** Creates a brand-new task with `username` as its first assignee. */
export async function createResponsibility(
  username: string,
  input: TaskInput & { priority: number },
): Promise<Result<null>> {
  const { session, error } = await requireProfileEditor();
  if (error) return { data: null, error };
  const { row, error: inputError } = cleanTask(input);
  if (inputError) return { data: null, error: inputError };

  const service = createServiceClient();
  const { data: task, error: dbError } = await service
    .from("responsibilities")
    .insert({ ...row, created_by: session!.username, updated_by: session!.username })
    .select("id")
    .single();
  if (dbError || !task) return { data: null, error: friendlyError(dbError) ?? "Could not create task" };

  const assignError = await insertAssignee(service, task.id, username, input.priority);
  if (assignError) {
    await service.from("responsibilities").delete().eq("id", task.id);
    return { data: null, error: assignError };
  }
  return { data: null, error: null };
}

/** Puts `username` on a task that already exists, alongside the people already on it. */
export async function assignExistingResponsibility(
  username: string,
  responsibilityId: string,
  priority: number,
): Promise<Result<null>> {
  const { error } = await requireProfileEditor();
  if (error) return { data: null, error };

  const assignError = await insertAssignee(createServiceClient(), responsibilityId, username, priority);
  return { data: null, error: assignError };
}

/** Updates the shared title / Project Manager and this person's own priority. */
export async function updateResponsibility(
  id: string,
  username: string,
  input: TaskInput & { priority: number },
): Promise<Result<null>> {
  const { session, error } = await requireProfileEditor();
  if (error) return { data: null, error };
  const { row, error: inputError } = cleanTask(input);
  if (inputError) return { data: null, error: inputError };
  if (!Number.isInteger(input.priority)) return { data: null, error: "Pick a priority" };

  const service = createServiceClient();
  const { error: taskError } = await service
    .from("responsibilities")
    .update({ ...row, updated_at: new Date().toISOString(), updated_by: session!.username })
    .eq("id", id);
  if (taskError) return { data: null, error: friendlyError(taskError) };

  const { error: prioError } = await service
    .from("responsibility_assignees")
    .update({ priority: input.priority })
    .eq("responsibility_id", id)
    .eq("username", username);
  return { data: null, error: friendlyError(prioError) };
}

/** Takes `username` off a task. The task itself is deleted once nobody is left on it. */
export async function removeResponsibilityAssignee(id: string, username: string): Promise<Result<null>> {
  const { error } = await requireProfileEditor();
  if (error) return { data: null, error };

  const service = createServiceClient();
  const { error: dbError } = await service
    .from("responsibility_assignees")
    .delete()
    .eq("responsibility_id", id)
    .eq("username", username);
  if (dbError) return { data: null, error: friendlyError(dbError) };

  const { count } = await service
    .from("responsibility_assignees")
    .select("username", { count: "exact", head: true })
    .eq("responsibility_id", id);
  if (count === 0) await service.from("responsibilities").delete().eq("id", id);
  return { data: null, error: null };
}

// ── Priority levels (shared legend) ─────────────────────────────────────────

export async function savePriorityLevel(input: PriorityLevel): Promise<Result<null>> {
  const { error } = await requireProfileEditor();
  if (error) return { data: null, error };

  const label = input.label.trim();
  const description = input.description?.trim() ?? "";
  if (!Number.isInteger(input.level) || input.level < 0 || input.level > PRIORITY_LEVEL_MAX) {
    return { data: null, error: `Level must be a whole number from 0 to ${PRIORITY_LEVEL_MAX}` };
  }
  if (!label) return { data: null, error: "Enter a label" };
  if (label.length > PRIORITY_LABEL_MAX) return { data: null, error: `Label must be ${PRIORITY_LABEL_MAX} characters or fewer` };
  if (description.length > PRIORITY_DESCRIPTION_MAX) {
    return { data: null, error: `Description must be ${PRIORITY_DESCRIPTION_MAX} characters or fewer` };
  }

  const { error: dbError } = await createServiceClient()
    .from("responsibility_priorities")
    .upsert({ level: input.level, label, description: description || null });
  return { data: null, error: friendlyError(dbError) };
}

export async function deletePriorityLevel(level: number): Promise<Result<null>> {
  const { error } = await requireProfileEditor();
  if (error) return { data: null, error };

  const { error: dbError } = await createServiceClient().from("responsibility_priorities").delete().eq("level", level);
  if (dbError?.code === "23503") {
    return { data: null, error: "Some tasks still use this priority. Move them to another level first." };
  }
  return { data: null, error: friendlyError(dbError) };
}
