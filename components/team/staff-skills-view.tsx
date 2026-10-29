"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, UserRound } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/roles";
import { createSkill, getStaffSkills, setStaffSkillLevel, type StaffSkillsView as View } from "@/lib/actions/skills";
import {
  SKILL_DESCRIPTION_MAX,
  SKILL_LEVEL_BADGE,
  SKILL_LEVEL_DOT,
  SKILL_LEVEL_LABELS,
  SKILL_LEVELS,
  SKILL_MARKET_MAX,
  SKILL_MARKETS,
  SKILL_TASK_MAX,
  SKILL_TEAMS,
  type Skill,
  type SkillLevel,
} from "@/lib/skills-constants";

type LevelFilter = "all" | SkillLevel;

const inputClass =
  "w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
const primaryBtn =
  "rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50";
const labelClass = "mb-1.5 block text-xs font-medium text-muted-foreground";

function LevelBadge({ level }: { level: SkillLevel }) {
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap", SKILL_LEVEL_BADGE[level])}>
      {SKILL_LEVEL_LABELS[level]}
    </span>
  );
}

/** Saves on change; "—" marks the skill not applicable to this person. */
function LevelPicker({
  level,
  disabled,
  onChange,
}: {
  level: SkillLevel | undefined;
  disabled: boolean;
  onChange: (level: SkillLevel | null) => void;
}) {
  return (
    <select
      value={level ?? ""}
      disabled={disabled}
      onChange={(e) => onChange((e.target.value || null) as SkillLevel | null)}
      className={cn(
        "h-7 rounded-full border-0 px-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50",
        level ? SKILL_LEVEL_BADGE[level] : "bg-muted text-muted-foreground",
      )}
    >
      <option value="">— Not applicable</option>
      {SKILL_LEVELS.map((l) => (
        <option key={l} value={l}>
          {SKILL_LEVEL_LABELS[l]}
        </option>
      ))}
    </select>
  );
}

function AddSkillDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (skill: Skill) => void;
}) {
  const [team, setTeam] = useState<string>(SKILL_TEAMS[0]);
  const [task, setTask] = useState("");
  const [market, setMarket] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await createSkill({ team, task, market, description });
    setBusy(false);
    if (error || !data) {
      setError(error ?? "Could not add skill");
      return;
    }
    onCreated(data);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add skill</DialogTitle>
            <DialogDescription>
              Adds a skill to the catalogue for everyone. It starts as not applicable for each person.
            </DialogDescription>
          </DialogHeader>
          <div>
            <label className={labelClass}>Team</label>
            <select className={inputClass} value={team} onChange={(e) => setTeam(e.target.value)}>
              {SKILL_TEAMS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Skill</label>
            <input
              autoFocus
              className={inputClass}
              placeholder="e.g. Create Shipment"
              maxLength={SKILL_TASK_MAX}
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Market (optional)</label>
            <input
              className={inputClass}
              list="skill-markets"
              placeholder="e.g. US/CA/MX"
              maxLength={SKILL_MARKET_MAX}
              value={market}
              onChange={(e) => setMarket(e.target.value)}
            />
            <datalist id="skill-markets">
              {SKILL_MARKETS.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </div>
          <div>
            <label className={labelClass}>Description (optional)</label>
            <textarea
              className={cn(inputClass, "min-h-20")}
              maxLength={SKILL_DESCRIPTION_MAX}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <button type="submit" disabled={busy || !task.trim()} className={primaryBtn}>
              {busy ? "Adding…" : "Add skill"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function StaffSkillsView({ username }: { username: string }) {
  const [view, setView] = useState<View | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [marketFilter, setMarketFilter] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [saving, setSaving] = useState<Set<string>>(new Set());
  const [addOpen, setAddOpen] = useState(false);
  // Bumped on each open so the dialog remounts with an empty form.
  const [addKey, setAddKey] = useState(0);

  useEffect(() => {
    getStaffSkills(username).then(({ data, error }) => {
      if (error) setError(error);
      else setView(data);
      setIsLoading(false);
    });
  }, [username]);

  const markets = useMemo(() => {
    const set = new Set<string>();
    for (const s of view?.skills ?? []) if (s.market) set.add(s.market);
    return [...set].sort();
  }, [view?.skills]);

  const counts = useMemo(() => {
    const c: Record<SkillLevel, number> = { in_charge: 0, can_do: 0, learning: 0 };
    for (const level of Object.values(view?.levels ?? {})) c[level]++;
    return c;
  }, [view?.levels]);

  const groups = useMemo(() => {
    if (!view) return [];
    const visible = view.skills.filter((s) => {
      const level = view.levels[s.id];
      if (!level && !(view.canEdit && showAll)) return false;
      if (levelFilter !== "all" && level !== levelFilter) return false;
      if (marketFilter && s.market !== marketFilter) return false;
      return true;
    });
    return SKILL_TEAMS.map((team) => ({ team, skills: visible.filter((s) => s.team === team) })).filter(
      (g) => g.skills.length > 0,
    );
  }, [view, levelFilter, marketFilter, showAll]);

  async function changeLevel(skillId: string, level: SkillLevel | null) {
    if (!view) return;
    const previous = view.levels[skillId];
    const apply = (next: SkillLevel | undefined) =>
      setView((v) => {
        if (!v) return v;
        const levels = { ...v.levels };
        if (next) levels[skillId] = next;
        else delete levels[skillId];
        return { ...v, levels };
      });

    apply(level ?? undefined);
    setSaving((s) => new Set(s).add(skillId));
    const { error } = await setStaffSkillLevel(username, skillId, level);
    setSaving((s) => {
      const next = new Set(s);
      next.delete(skillId);
      return next;
    });
    if (error) {
      apply(previous);
      setError(error);
    } else {
      setError(null);
    }
  }

  const notFound = !isLoading && !view && error === "Not found";

  return (
    <>
      <PageHeader
        icon={UserRound}
        title={view?.member.username ?? username}
        description={view?.member.job_role ?? (notFound ? "No such staff member" : "Skills")}
      />

      <div className="space-y-6 p-6 md:p-8">
        <Link
          href="/team"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Team
        </Link>

        {error && !notFound && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {notFound ? (
          <p className="text-sm text-muted-foreground">There is no staff account called “{username}”.</p>
        ) : isLoading || !view ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <SummaryTile label="Total skills" value={counts.in_charge + counts.can_do} hint="In charge + Can do" />
              <SummaryTile label="In charge" value={counts.in_charge} level="in_charge" />
              <SummaryTile label="Can do" value={counts.can_do} level="can_do" />
              <SummaryTile label="Learning" value={counts.learning} level="learning" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <SegmentedControl<LevelFilter>
                value={levelFilter}
                onValueChange={setLevelFilter}
                options={[
                  { value: "all", label: "All" },
                  ...SKILL_LEVELS.map((l) => ({ value: l, label: SKILL_LEVEL_LABELS[l] })),
                ]}
              />
              <select
                value={marketFilter}
                onChange={(e) => setMarketFilter(e.target.value)}
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring dark:bg-input/30"
              >
                <option value="">All markets</option>
                {markets.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              {view.canEdit && (
                <div className="ml-auto flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Switch checked={showAll} onCheckedChange={setShowAll} />
                    Show all catalogue skills
                  </label>
                  <button type="button" onClick={() => {
                      setAddKey((k) => k + 1);
                      setAddOpen(true);
                    }} className={cn(primaryBtn, "inline-flex items-center gap-1.5")}>
                    <Plus className="size-4" />
                    Add skill
                  </button>
                </div>
              )}
            </div>

            {groups.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {Object.keys(view.levels).length === 0 ? "No skills recorded yet" : "No skills match these filters"}
              </p>
            ) : (
              groups.map(({ team, skills }) => (
                <Card key={team}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {team}
                      <span className="text-sm font-normal text-muted-foreground">{skills.length}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="divide-y divide-border">
                      {skills.map((skill) => {
                        const level = view.levels[skill.id];
                        return (
                          <li key={skill.id} className="flex items-center gap-4 px-4 py-2.5">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={cn("text-sm font-medium", !level && "text-muted-foreground")}>
                                  {skill.task}
                                </span>
                                {skill.market && (
                                  <span className="rounded border border-border px-1.5 py-px text-[11px] text-muted-foreground">
                                    {skill.market}
                                  </span>
                                )}
                              </div>
                              {skill.description && (
                                <p className="mt-0.5 text-xs text-muted-foreground">{skill.description}</p>
                              )}
                            </div>
                            {view.canEdit ? (
                              <LevelPicker
                                level={level}
                                disabled={saving.has(skill.id)}
                                onChange={(next) => changeLevel(skill.id, next)}
                              />
                            ) : (
                              level && <LevelBadge level={level} />
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              ))
            )}

            <p className="text-xs text-muted-foreground">
              Portal role: {ROLE_LABELS[view.member.role]}
              {view.canEdit ? "" : " · Only admins and managers can change skills."}
            </p>

            <AddSkillDialog
              key={addKey}
              open={addOpen}
              onClose={() => setAddOpen(false)}
              onCreated={(skill) => {
                setView((v) => (v ? { ...v, skills: [...v.skills, skill] } : v));
                setShowAll(true);
              }}
            />
          </>
        )}
      </div>
    </>
  );
}

function SummaryTile({
  label,
  value,
  level,
  hint,
}: {
  label: string;
  value: number;
  level?: SkillLevel;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          {level && <span className={cn("size-2 rounded-full", SKILL_LEVEL_DOT[level])} />}
        </div>
        <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
        {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}
