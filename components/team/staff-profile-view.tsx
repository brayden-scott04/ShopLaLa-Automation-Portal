"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/client";
import {
  addFunctionalManager,
  addTeamMember,
  createResponsibility,
  createTeam,
  deletePriorityLevel,
  assignExistingResponsibility,
  removeResponsibilityAssignee,
  removeFunctionalManager,
  removeTeamMember,
  savePriorityLevel,
  setPeopleManager,
  setProfileReviewedOn,
  updateResponsibility,
  type StaffProfile,
} from "@/lib/actions/staff-profile";
import {
  compareResponsibilities,
  INACTIVE_PRIORITY,
  PRIORITY_DESCRIPTION_MAX,
  PRIORITY_LABEL_MAX,
  PRIORITY_LEVEL_MAX,
  RESPONSIBILITY_TITLE_MAX,
  TEAM_NAME_MAX,
  type PriorityLevel,
  type Responsibility,
  type TaskOption,
} from "@/lib/staff-profile-constants";

const inputClass =
  "w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
const selectClass =
  "h-7 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring";
const primaryBtn =
  "rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50";
const ghostBtn =
  "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground";
const destructiveBtn =
  "rounded-md px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50";
const labelClass = "mb-1.5 block text-xs font-medium text-muted-foreground";

/** Lower numbers are more urgent; 0 is inactive and greyed out. */
function priorityBadgeClass(level: number): string {
  if (level === INACTIVE_PRIORITY) return "bg-muted text-muted-foreground";
  if (level === 1) return "bg-red-500/10 text-red-600 dark:text-red-400";
  if (level === 2) return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  if (level === 3) return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
  return "bg-slate-500/10 text-slate-600 dark:text-slate-400";
}

function PriorityBadge({ level, priorities }: { level: number; priorities: PriorityLevel[] }) {
  const p = priorities.find((x) => x.level === level);
  return (
    <span
      title={p?.description ?? undefined}
      className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap", priorityBadgeClass(level))}
    >
      {level}
      {p ? ` · ${p.label}` : ""}
    </span>
  );
}

/** A username that links to that person's profile, with an optional remove button for editors. */
function PersonChip({ username, onRemove }: { username: string; onRemove?: () => void }) {
  const t = useT();
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 py-0.5 pr-1 pl-2.5 text-sm">
      <Link href={`/team/${encodeURIComponent(username)}`} className="hover:text-primary hover:underline">
        {username}
      </Link>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          title={t("profile.remove", { name: username })}
          className="rounded-full p-0.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="size-3" />
        </button>
      ) : (
        <span className="w-1" />
      )}
    </span>
  );
}

/** A select that fires once per choice and resets to its placeholder. */
function PickToAdd({
  options,
  placeholder,
  onPick,
  extra,
}: {
  options: string[];
  placeholder: string;
  onPick: (value: string) => void;
  extra?: { value: string; label: string };
}) {
  if (options.length === 0 && !extra) return null;
  return (
    <select
      value=""
      onChange={(e) => e.target.value && onPick(e.target.value)}
      className={selectClass}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
      {extra && <option value={extra.value}>{extra.label}</option>}
    </select>
  );
}

const NEW_TEAM = "__new__";

export function StaffProfileView({
  profile,
  onChanged,
}: {
  profile: StaffProfile;
  /** Refetches the profile after a write. */
  onChanged: () => Promise<void>;
}) {
  const { member, canEdit, directory, priorities } = profile;
  const t = useT();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [newTeamOpen, setNewTeamOpen] = useState(false);
  const [editing, setEditing] = useState<Responsibility | "new" | null>(null);
  const [prioritiesOpen, setPrioritiesOpen] = useState(false);

  const others = directory.filter((u) => u !== member.username);
  const responsibilities = useMemo(
    () => [...profile.responsibilities].sort(compareResponsibilities),
    [profile.responsibilities],
  );
  const joinableTeams = profile.allTeams.filter((team) => !profile.teams.some((m) => m.id === team.id));

  /** Runs a write, then refetches; shows the error instead if it failed. */
  async function run(action: () => Promise<{ error: string | null }>) {
    setBusy(true);
    const { error } = await action();
    if (error) setError(error);
    else {
      setError(null);
      await onChanged();
    }
    setBusy(false);
  }

  return (
    <div className={cn("space-y-6", busy && "pointer-events-none opacity-70")}>
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* ── Reporting ─────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>{t("profile.reporting")}</CardTitle>
          <CardDescription>
            {t("profile.lastReviewed")}{" "}
            {canEdit ? (
              <input
                type="date"
                value={member.profile_reviewed_on ?? ""}
                onChange={(e) => run(() => setProfileReviewedOn(member.username, e.target.value || null))}
                className="rounded border border-input bg-background px-1.5 py-0.5 text-xs"
              />
            ) : (
              <span className="text-foreground">{member.profile_reviewed_on ?? t("common.dash")}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium">{t("profile.peopleManager")}</p>
            <p className="mb-2 text-xs text-muted-foreground">{t("profile.peopleManagerHint")}</p>
            {canEdit ? (
              <select
                value={member.people_manager ?? ""}
                onChange={(e) => run(() => setPeopleManager(member.username, e.target.value || null))}
                className={cn(selectClass, "h-8 text-sm")}
              >
                <option value="">{t("common.none")}</option>
                {others.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            ) : member.people_manager ? (
              <PersonChip username={member.people_manager} />
            ) : (
              <span className="text-sm text-muted-foreground">{t("common.notSet")}</span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{t("profile.functionalManagers")}</p>
            <p className="mb-2 text-xs text-muted-foreground">{t("profile.functionalManagerHint")}</p>
            <div className="flex flex-wrap items-center gap-2">
              {profile.functionalManagers.map((m) => (
                <PersonChip
                  key={m}
                  username={m}
                  onRemove={canEdit ? () => run(() => removeFunctionalManager(member.username, m)) : undefined}
                />
              ))}
              {profile.functionalManagers.length === 0 && !canEdit && (
                <span className="text-sm text-muted-foreground">{t("common.notSet")}</span>
              )}
              {canEdit && (
                <PickToAdd
                  placeholder={t("profile.addPerson")}
                  options={others.filter((u) => !profile.functionalManagers.includes(u))}
                  onPick={(m) => run(() => addFunctionalManager(member.username, m))}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Teams ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>{t("profile.teams")}</CardTitle>
          <CardDescription>{t("profile.teamsDescription", { name: member.username })}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.teams.length === 0 && <p className="text-sm text-muted-foreground">{t("profile.noTeams")}</p>}
          {profile.teams.map((team) => (
            <div key={team.id} className="rounded-lg border border-border p-3">
              <p className="mb-2 text-sm font-medium">
                {team.name} <span className="font-normal text-muted-foreground">· {team.members.length}</span>
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {team.members.map((u) => (
                  <PersonChip
                    key={u}
                    username={u}
                    onRemove={canEdit ? () => run(() => removeTeamMember(team.id, u)) : undefined}
                  />
                ))}
                {canEdit && (
                  <PickToAdd
                    placeholder={t("profile.addMember")}
                    options={directory.filter((u) => !team.members.includes(u))}
                    onPick={(u) => run(() => addTeamMember(team.id, u))}
                  />
                )}
              </div>
            </div>
          ))}
          {canEdit && (
            <PickToAdd
              placeholder={t("profile.addToTeam", { name: member.username })}
              options={joinableTeams.map((team) => team.name)}
              extra={{ value: NEW_TEAM, label: t("profile.newTeamOption") }}
              onPick={(name) => {
                if (name === NEW_TEAM) return setNewTeamOpen(true);
                const team = joinableTeams.find((j) => j.name === name);
                if (team) run(() => addTeamMember(team.id, member.username));
              }}
            />
          )}
          {canEdit && (
            <p className="text-xs text-muted-foreground">{t("profile.lastMemberNote")}</p>
          )}
        </CardContent>
      </Card>

      {/* ── Responsibilities ──────────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{t("profile.tasks")}</CardTitle>
            <CardDescription>{t("profile.tasksDescription")}</CardDescription>
          </div>
          {canEdit && (
            <button type="button" onClick={() => setEditing("new")} className={cn(primaryBtn, "inline-flex items-center gap-1.5")}>
              <Plus className="size-4" />
              {t("common.add")}
            </button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-border bg-muted/50">
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t("profile.priority")}</th>
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t("profile.taskProject")}</th>
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t("profile.projectManager")}</th>
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t("profile.workingWith")}</th>
                {canEdit && <th className="w-10" />}
              </tr>
            </thead>
            <tbody>
              {responsibilities.map((r) => {
                const inactive = r.priority === INACTIVE_PRIORITY;
                return (
                  <tr key={r.id} className={cn("border-b border-border last:border-0", inactive && "text-muted-foreground")}>
                    <td className="px-4 py-2.5">
                      <PriorityBadge level={r.priority} priorities={priorities} />
                    </td>
                    <td className={cn("px-4 py-2.5", !inactive && "font-medium")}>{r.title}</td>
                    <td className="px-4 py-2.5">
                      {r.project_manager ? (
                        <Link href={`/team/${encodeURIComponent(r.project_manager)}`} className="hover:text-primary hover:underline">
                          {r.project_manager}
                        </Link>
                      ) : (
                        t("common.dash")
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {r.coAssignees.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {r.coAssignees.map((u) => (
                            <PersonChip key={u} username={u} />
                          ))}
                        </div>
                      ) : (
                        t("common.dash")
                      )}
                    </td>
                    {canEdit && (
                      <td className="px-2">
                        <button type="button" onClick={() => setEditing(r)} title={t("profile.edit")} className={ghostBtn}>
                          <Pencil className="size-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
              {responsibilities.length === 0 && (
                <tr>
                  <td colSpan={canEdit ? 5 : 4} className="px-4 py-8 text-center text-muted-foreground">
                    {t("profile.noTasks")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
        <CardContent className="border-t border-border pt-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">{t("profile.priorityLegend")}</p>
            {canEdit && (
              <button type="button" onClick={() => setPrioritiesOpen(true)} className={ghostBtn}>
                <Pencil className="size-3" />
                {t("profile.editLevels")}
              </button>
            )}
          </div>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {[...priorities]
              .sort((a, b) => Number(a.level === INACTIVE_PRIORITY) - Number(b.level === INACTIVE_PRIORITY) || a.level - b.level)
              .map((p) => (
                <li key={p.level} className="flex items-start gap-2 text-xs">
                  <PriorityBadge level={p.level} priorities={priorities} />
                  <span className="text-muted-foreground">{p.description}</span>
                </li>
              ))}
          </ul>
        </CardContent>
      </Card>

      {canEdit && (
        <>
          <NewTeamDialog
            open={newTeamOpen}
            onClose={() => setNewTeamOpen(false)}
            onSubmit={async (name) => {
              const { data, error } = await createTeam(name);
              if (error || !data) return error ?? t("errors.couldNotCreateTeam");
              await run(() => addTeamMember(data.id, member.username));
              return null;
            }}
          />
          {/* Mounted only while open, so every Add starts from an empty form. */}
          {editing && <ResponsibilityDialog
            username={member.username}
            editing={editing}
            priorities={priorities}
            directory={directory}
            existingTasks={profile.allTasks.filter((task) => !task.assignees.includes(member.username))}
            onClose={() => setEditing(null)}
            onSubmit={async (input) => {
              const res =
                input.mode === "existing"
                  ? await assignExistingResponsibility(member.username, input.taskId, input.priority)
                  : editing === "new"
                    ? await createResponsibility(member.username, input)
                    : await updateResponsibility((editing as Responsibility).id, member.username, input);
              if (res.error) return res.error;
              await onChanged();
              return null;
            }}
            onRemove={async (id) => {
              const { error } = await removeResponsibilityAssignee(id, member.username);
              if (error) return error;
              await onChanged();
              return null;
            }}
          />}
          <PrioritiesDialog
            open={prioritiesOpen}
            priorities={priorities}
            onClose={() => setPrioritiesOpen(false)}
            onSave={async (p) => {
              const { error } = await savePriorityLevel(p);
              if (error) return error;
              await onChanged();
              return null;
            }}
            onDelete={async (level) => {
              const { error } = await deletePriorityLevel(level);
              if (error) return error;
              await onChanged();
              return null;
            }}
          />
        </>
      )}
    </div>
  );
}

function NewTeamDialog({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<string | null>;
}) {
  const t = useT();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const err = await onSubmit(name);
    setBusy(false);
    if (err) return setError(err);
    setName("");
    setError(null);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
          <DialogHeader>
            <DialogTitle>{t("profile.newTeam")}</DialogTitle>
            <DialogDescription>{t("profile.newTeamDescription")}</DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <input
              autoFocus
              className={inputClass}
              placeholder={t("profile.teamNamePlaceholder")}
              maxLength={TEAM_NAME_MAX}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </DialogBody>
          <DialogFooter>
            <button type="submit" disabled={busy || !name.trim()} className={primaryBtn}>
              {busy ? t("profile.creating") : t("profile.createTeam")}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type TaskSubmit =
  | { mode: "existing"; taskId: string; priority: number }
  | { mode: "new"; title: string; priority: number; projectManager: string | null };

/**
 * Add: pick an existing task (to work on it alongside whoever is already on it) or create a new one.
 * Edit: change the shared title / Project Manager and this person's own priority, or take them off it.
 */
function ResponsibilityDialog({
  username,
  editing,
  priorities,
  directory,
  existingTasks,
  onClose,
  onSubmit,
  onRemove,
}: {
  username: string;
  editing: Responsibility | "new" | null;
  priorities: PriorityLevel[];
  directory: string[];
  /** Tasks this person isn't on yet. */
  existingTasks: TaskOption[];
  onClose: () => void;
  onSubmit: (input: TaskSubmit) => Promise<string | null>;
  onRemove: (id: string) => Promise<string | null>;
}) {
  const t = useT();
  const current = editing && editing !== "new" ? editing : null;
  const defaultPriority = priorities.find((p) => p.level !== INACTIVE_PRIORITY)?.level ?? priorities[0]?.level ?? 1;
  const [mode, setMode] = useState<"existing" | "new">(!current && existingTasks.length > 0 ? "existing" : "new");
  const [taskId, setTaskId] = useState("");
  const [title, setTitle] = useState(current?.title ?? "");
  const [priority, setPriority] = useState(current?.priority ?? defaultPriority);
  const [projectManager, setProjectManager] = useState(current?.project_manager ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const picked = existingTasks.find((task) => task.id === taskId);
  const canSubmit = mode === "existing" ? Boolean(picked) : Boolean(title.trim());

  async function finish(action: () => Promise<string | null>) {
    setBusy(true);
    const err = await action();
    setBusy(false);
    if (err) setError(err);
    else onClose();
  }

  const prioritySelect = (
    <div>
      <label className={labelClass}>{t("profile.priorityFor", { name: username })}</label>
      <select className={inputClass} value={priority} onChange={(e) => setPriority(Number(e.target.value))}>
        {priorities.map((p) => (
          <option key={p.level} value={p.level}>
            {p.level} · {p.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <Dialog open={editing !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            finish(() =>
              onSubmit(
                mode === "existing"
                  ? { mode, taskId, priority }
                  : { mode, title, priority, projectManager: projectManager || null },
              ),
            );
          }}
          className="flex min-h-0 flex-col"
        >
          <DialogHeader>
            <DialogTitle>{current ? t("profile.editTask") : t("profile.addTaskFor", { name: username })}</DialogTitle>
            {current && current.coAssignees.length > 0 && (
              <DialogDescription>
                {t("profile.sharedWith", { names: current.coAssignees.join(", "), name: username })}
              </DialogDescription>
            )}
          </DialogHeader>
          <DialogBody className="space-y-4">
            {!current && (
              <SegmentedControl<"existing" | "new">
                value={mode}
                onValueChange={setMode}
                options={[
                  { value: "existing", label: t("profile.existingTask"), disabled: existingTasks.length === 0 },
                  { value: "new", label: t("profile.newTask") },
                ]}
              />
            )}

            {mode === "existing" ? (
              <>
                <div>
                  <label className={labelClass}>{t("profile.taskProject")}</label>
                  <select autoFocus className={inputClass} value={taskId} onChange={(e) => setTaskId(e.target.value)}>
                    <option value="">{t("profile.chooseTask")}</option>
                    {existingTasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.title}
                        {task.project_manager ? t("profile.pmSuffix", { name: task.project_manager }) : ""}
                      </option>
                    ))}
                  </select>
                  {picked && (
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {t("profile.pickedSummary", {
                        pm: picked.project_manager ?? t("profile.noneLower"),
                        people: picked.assignees.length > 0 ? picked.assignees.join(", ") : t("profile.nobody"),
                      })}
                    </p>
                  )}
                </div>
                {prioritySelect}
              </>
            ) : (
              <>
                <div>
                  <label className={labelClass}>{t("profile.taskProject")}</label>
                  <input
                    autoFocus
                    className={inputClass}
                    maxLength={RESPONSIBILITY_TITLE_MAX}
                    placeholder={t("profile.taskPlaceholder")}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                {prioritySelect}
                <div>
                  <label className={labelClass}>{t("profile.projectManager")}</label>
                  <select
                    className={inputClass}
                    value={projectManager}
                    onChange={(e) => setProjectManager(e.target.value)}
                  >
                    <option value="">{t("common.none")}</option>
                    {directory.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
          </DialogBody>
          <DialogFooter className="sm:justify-between">
            {current ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => finish(() => onRemove(current.id))}
                title={current.coAssignees.length === 0 ? t("profile.deleteTaskHint") : undefined}
                className={destructiveBtn}
              >
                <Trash2 className="mr-1 inline size-3.5" />
                {current.coAssignees.length === 0 ? t("profile.deleteTask") : t("profile.remove", { name: username })}
              </button>
            ) : (
              <span />
            )}
            <button type="submit" disabled={busy || !canSubmit} className={primaryBtn}>
              {busy ? t("common.saving") : current ? t("common.save") : t("common.add")}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PrioritiesDialog({
  open,
  priorities,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  priorities: PriorityLevel[];
  onClose: () => void;
  onSave: (p: PriorityLevel) => Promise<string | null>;
  onDelete: (level: number) => Promise<string | null>;
}) {
  const t = useT();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const nextLevel = Math.max(0, ...priorities.map((p) => p.level)) + 1;

  async function finish(action: () => Promise<string | null>) {
    setBusy(true);
    setError(await action());
    setBusy(false);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("profile.priorityLevels")}</DialogTitle>
          <DialogDescription>{t("profile.priorityLevelsDescription")}</DialogDescription>
        </DialogHeader>
        <DialogBody className={cn("space-y-2", busy && "pointer-events-none opacity-70")}>
          {priorities.map((p) => (
            <PriorityRow key={p.level} priority={p} onSave={(next) => finish(() => onSave(next))} onDelete={() => finish(() => onDelete(p.level))} />
          ))}
          <PriorityRow
            key={`new-${nextLevel}`}
            priority={{ level: nextLevel, label: "", description: "" }}
            isNew
            onSave={(next) => finish(() => onSave(next))}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

function PriorityRow({
  priority,
  isNew,
  onSave,
  onDelete,
}: {
  priority: PriorityLevel;
  isNew?: boolean;
  onSave: (p: PriorityLevel) => void;
  onDelete?: () => void;
}) {
  const t = useT();
  const [level, setLevel] = useState(priority.level);
  const [label, setLabel] = useState(priority.label);
  const [description, setDescription] = useState(priority.description ?? "");
  const dirty = level !== priority.level || label !== priority.label || description !== (priority.description ?? "");

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={0}
        max={PRIORITY_LEVEL_MAX}
        value={level}
        disabled={!isNew}
        onChange={(e) => setLevel(Number(e.target.value))}
        className={cn(inputClass, "w-16 shrink-0")}
        title={isNew ? t("profile.levelNumber") : t("profile.renumberHint")}
      />
      <input
        className={cn(inputClass, "w-36 shrink-0")}
        placeholder={isNew ? t("profile.newLevelLabel") : t("profile.label")}
        maxLength={PRIORITY_LABEL_MAX}
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <input
        className={inputClass}
        placeholder={t("profile.meaning")}
        maxLength={PRIORITY_DESCRIPTION_MAX}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        type="button"
        disabled={!dirty || !label.trim()}
        onClick={() => onSave({ level, label, description })}
        className={cn(primaryBtn, "shrink-0 px-2.5 py-1 text-xs")}
      >
        {isNew ? t("common.add") : t("common.save")}
      </button>
      {onDelete ? (
        <button type="button" onClick={onDelete} title={t("profile.deleteLevel")} className={cn(ghostBtn, "shrink-0 hover:text-destructive")}>
          <Trash2 className="size-3.5" />
        </button>
      ) : (
        <span className="w-8 shrink-0" />
      )}
    </div>
  );
}
