"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Download,
  ExternalLink,
  Pencil,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  deleteWorkflowFile,
  getWorkflow,
  saveWorkflowContent,
} from "@/lib/actions/npl-workflow";
import {
  TEAM_STEPS,
  VIEW_LABELS,
  WORKFLOW_LANGS,
  WORKFLOW_TEAMS,
  fileDownloadUrl,
  formatBytes,
  stepIn,
  stepName,
  teamActions,
  type ViewLabels,
  type WorkflowContent,
  type WorkflowData,
  type WorkflowFile,
  type WorkflowLang,
  type WorkflowTeam,
} from "@/lib/npl-workflow/constants";
import { useLocale, useT } from "@/lib/i18n/client";
import { formatDate } from "@/lib/i18n/format";
import { cn } from "@/lib/utils";
import { WorkflowDiagram } from "./workflow-diagram";
import {
  DeleteFileDialog,
  StepEditDialog,
  TeamEditDialog,
  UploadDialog,
} from "./workflow-dialogs";

// New Product Launch Workflow, ported from the "New Product Launch Workflow Draft" HTML: the
// swim-lane diagram, a step detail panel, team filters and each team's full SOP, in English or
// Chinese. Everyone with page access reads it; admins and leaders also get "Edit workflow".

const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));

type UploadTarget = {
  scopeType: "step" | "team";
  scopeId: string;
  target: string;
};

export function WorkflowView() {
  const t = useT();
  const locale = useLocale();
  const [data, setData] = useState<WorkflowData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<WorkflowLang>(locale === "zh" ? "zh" : "en");
  const [team, setTeam] = useState<WorkflowTeam | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [sop, setSop] = useState<{
    team: WorkflowTeam;
    step: number | null;
  } | null>(null);
  const [editing, setEditing] = useState(false);
  const [stepEditor, setStepEditor] = useState<number | null>(null);
  const [teamEditor, setTeamEditor] = useState<WorkflowTeam | null>(null);
  const [upload, setUpload] = useState<UploadTarget | null>(null);
  const [deleting, setDeleting] = useState<WorkflowFile | null>(null);

  useEffect(() => {
    getWorkflow().then((res) => {
      if (res.error) setError(res.error);
      else setData(res.data);
    });
  }, []);

  // Escape closes the step panel, as in the original (dialogs handle their own Escape).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        !sop &&
        stepEditor === null &&
        teamEditor === null &&
        !upload
      )
        setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sop, stepEditor, teamEditor, upload]);

  if (!data) {
    return error ? (
      <p className="text-sm text-destructive">{error}</p>
    ) : (
      <Skeleton className="h-[640px] w-full" />
    );
  }

  const L = VIEW_LABELS[lang];
  const { content } = data;
  const canEdit = data.canEdit && editing;

  async function save(next: WorkflowContent): Promise<string | null> {
    if (!data) return null;
    const res = await saveWorkflowContent(next, data.revision);
    if (res.error || !res.data) return res.error ?? "Error";
    const saved = res.data;
    setData((d) => (d ? { ...d, content: next, ...saved } : d));
    return null;
  }

  function removeFile(file: WorkflowFile) {
    deleteWorkflowFile(file.id).then((res) => {
      if (res.error) setError(res.error);
      else
        setData((d) =>
          d ? { ...d, files: d.files.filter((f) => f.id !== file.id) } : d,
        );
    });
  }

  const filesFor = (scopeType: "step" | "team", scopeId: string) =>
    data.files.filter(
      (f) => f.scopeType === scopeType && f.scopeId === scopeId,
    );

  /** The file list for a step or team, or null when there's nothing to show (no files, not editing). */
  const fileList = (
    scopeType: "step" | "team",
    scopeId: string,
    target: string,
  ) =>
    !canEdit && !filesFor(scopeType, scopeId).length ? null : (
      <FileList
        files={filesFor(scopeType, scopeId)}
        canEdit={canEdit}
        onUpload={() => setUpload({ scopeType, scopeId, target })}
        onDelete={setDeleting}
      />
    );

  const stepLabel = (id: number) =>
    `${fill(L.step, { n: id })} · ${stepName(stepIn(content, lang, id))}`;

  return (
    <div className="space-y-3">
      {/* Toolbar: language, team filter, full SOP, edit. */}
      <div className="flex flex-wrap items-center gap-2">
        <Segmented
          options={WORKFLOW_LANGS.map((l) => ({
            value: l,
            label: VIEW_LABELS[l].langName,
          }))}
          value={lang}
          onChange={setLang}
        />
        <span className="ml-2 text-xs text-muted-foreground">{L.team}</span>
        <Segmented
          options={[
            { value: "all", label: L.allSteps },
            ...WORKFLOW_TEAMS.map((r) => ({ value: r, label: L.teamName[r] })),
          ]}
          value={team ?? "all"}
          onChange={(v) => setTeam(v === "all" ? null : (v as WorkflowTeam))}
        />
        {team && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSop({ team, step: null })}
          >
            <BookOpen />
            {fill(L.viewFull, { sop: L.teamSop[team] })}
          </Button>
        )}
        {data.canEdit && (
          <Button
            size="sm"
            className="ml-auto"
            variant={editing ? "default" : "outline"}
            onClick={() => setEditing((e) => !e)}
          >
            <Pencil />
            {editing ? t("nplWorkflow.doneEditing") : t("nplWorkflow.edit")}
          </Button>
        )}
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        <strong className="text-foreground">{L.introLead}</strong> {L.intro}
      </p>
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid gap-4 lg:h-[calc(100dvh-15rem)] lg:min-h-[560px] lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]">
        <div className="h-[70vh] min-h-0 min-w-0 overflow-auto rounded-xl border border-[#d9e2e9] bg-white shadow-sm lg:h-auto">
          <WorkflowDiagram
            content={content}
            lang={lang}
            labels={L}
            selected={selected}
            team={team}
            onSelect={setSelected}
          />
        </div>

        <section
          className="min-h-0 overflow-auto rounded-xl border bg-card p-5"
          aria-live="polite"
        >
          {selected === null ? (
            <p className="text-sm text-muted-foreground">{L.pickStep}</p>
          ) : (
            <StepPanel
              id={selected}
              content={content}
              lang={lang}
              L={L}
              team={team}
              canEdit={canEdit}
              files={fileList("step", String(selected), stepLabel(selected))}
              onClose={() => setSelected(null)}
              onEdit={() => setStepEditor(selected)}
              onOpenSop={(r) => setSop({ team: r, step: selected })}
            />
          )}
        </section>
      </div>

      <p className="text-xs text-muted-foreground">
        {data.updatedAt && data.updatedBy
          ? t("nplWorkflow.lastUpdated", {
              date: formatDate(locale, data.updatedAt),
              user: data.updatedBy,
            })
          : t("nplWorkflow.notSavedYet")}
      </p>

      {sop && (
        <SopDialog
          team={sop.team}
          scrollTo={sop.step}
          content={content}
          lang={lang}
          L={L}
          canEdit={canEdit}
          stepFiles={(id) => fileList("step", String(id), stepLabel(id))}
          teamFiles={fileList("team", sop.team, L.teamSop[sop.team])}
          onEditInstructions={() => setTeamEditor(sop.team)}
          onClose={() => setSop(null)}
        />
      )}
      {stepEditor !== null && (
        <StepEditDialog
          content={content}
          stepId={stepEditor}
          onClose={() => setStepEditor(null)}
          onSave={save}
        />
      )}
      {teamEditor && (
        <TeamEditDialog
          content={content}
          team={teamEditor}
          onClose={() => setTeamEditor(null)}
          onSave={save}
        />
      )}
      {upload && (
        <UploadDialog
          {...upload}
          onClose={() => setUpload(null)}
          onUploaded={(f) =>
            setData((d) => (d ? { ...d, files: [...d.files, f] } : d))
          }
        />
      )}
      <DeleteFileDialog
        file={deleting}
        onCancel={() => setDeleting(null)}
        onConfirm={removeFile}
      />
    </div>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex flex-wrap rounded-lg border bg-muted/40 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
            value === o.value && "bg-background text-foreground shadow-sm",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-4 mb-1.5 text-sm font-semibold text-[#426077] dark:text-sky-300">
      {children}
    </h3>
  );
}

function StepPanel({
  id,
  content,
  lang,
  L,
  team,
  canEdit,
  files,
  onClose,
  onEdit,
  onOpenSop,
}: {
  id: number;
  content: WorkflowContent;
  lang: WorkflowLang;
  L: ViewLabels;
  team: WorkflowTeam | null;
  canEdit: boolean;
  files: React.ReactNode;
  onClose: () => void;
  onEdit: () => void;
  onOpenSop: (team: WorkflowTeam) => void;
}) {
  const s = stepIn(content, lang, id);
  // With a team filter on, a step in that team's SOP shows the team's own actions and only its SOP.
  const roleStep = team && TEAM_STEPS[team].includes(id) ? team : null;
  const sops = WORKFLOW_TEAMS.filter(
    (r) => TEAM_STEPS[r].includes(id) && (!roleStep || r === roleStep),
  );

  return (
    <div className="text-sm leading-relaxed">
      <div className="flex items-start gap-2">
        <h2 className="flex-1 text-lg font-bold">
          {fill(L.step, { n: id })} · {stepName(s)}
        </h2>
        <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="×">
          <X />
        </Button>
      </div>
      {canEdit && <EditStepButton onClick={onEdit} />}
      <div className="my-2 flex flex-wrap gap-1.5">
        <span className="rounded bg-muted px-2 py-1 text-xs">{s.sub}</span>
        <span className="rounded bg-muted px-2 py-1 text-xs">{s.owner}</span>
      </div>
      <H3>{L.startWhen}</H3>
      <p>{s.trigger}</p>
      <H3>{L.actions}</H3>
      <ul className="list-disc space-y-1 pl-5">
        {teamActions(content, roleStep, lang, id).map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
      <H3>{L.deliverable}</H3>
      <p>{s.output}</p>
      <H3>{L.handoff}</H3>
      <p>{s.handoff}</p>
      {((id === 5 && content.labelTemplateUrl) || files) && (
        <>
          <H3>{L.documents}</H3>
          {id === 5 && content.labelTemplateUrl && (
            <LabelTemplateLink url={content.labelTemplateUrl} L={L} />
          )}
          {files}
        </>
      )}
      {s.note && (
        <>
          <H3>{L.note}</H3>
          <p>{s.note}</p>
        </>
      )}
      <H3>{L.fullSop}</H3>
      <div className="flex flex-wrap gap-2">
        {sops.map((r) => (
          <Button
            key={r}
            size="sm"
            variant="outline"
            onClick={() => onOpenSop(r)}
          >
            <BookOpen />
            {L.teamSop[r]}
          </Button>
        ))}
      </div>
    </div>
  );
}

/** Its label follows the portal language (editor chrome), not the page's English / 中文 switch. */
function EditStepButton({ onClick }: { onClick: () => void }) {
  const t = useT();
  return (
    <Button size="sm" variant="outline" className="mt-1" onClick={onClick}>
      <Pencil />
      {t("nplWorkflow.editStep")}
    </Button>
  );
}

function LabelTemplateLink({ url, L }: { url: string; L: ViewLabels }) {
  return (
    <p className="mb-1">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sky-700 hover:underline dark:text-sky-400"
      >
        <ExternalLink className="size-3.5" />
        {L.labelTemplate}
      </a>
    </p>
  );
}

function FileList({
  files,
  canEdit,
  onUpload,
  onDelete,
}: {
  files: WorkflowFile[];
  canEdit: boolean;
  onUpload: () => void;
  onDelete: (file: WorkflowFile) => void;
}) {
  const t = useT();
  if (!files.length && !canEdit) return null;
  return (
    <div className="space-y-1">
      {files.length === 0 && (
        <p className="text-xs text-muted-foreground">
          {t("nplWorkflow.noFiles")}
        </p>
      )}
      <ul className="space-y-1">
        {files.map((f) => (
          <li key={f.id} className="flex items-center gap-2">
            <a
              href={fileDownloadUrl(f.id)}
              className="inline-flex min-w-0 items-center gap-1 text-sky-700 hover:underline dark:text-sky-400"
              download={f.fileName}
            >
              <Download className="size-3.5 shrink-0" />
              <span className="truncate">{f.title}</span>
            </a>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatBytes(f.size)}
            </span>
            {canEdit && (
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={t("nplWorkflow.deleteFile", { name: f.title })}
                onClick={() => onDelete(f)}
              >
                <Trash2 />
              </Button>
            )}
          </li>
        ))}
      </ul>
      {canEdit && (
        <Button size="xs" variant="outline" onClick={onUpload}>
          <Upload />
          {t("nplWorkflow.uploadFile")}
        </Button>
      )}
    </div>
  );
}

function SopDialog({
  team,
  scrollTo,
  content,
  lang,
  L,
  canEdit,
  stepFiles,
  teamFiles,
  onEditInstructions,
  onClose,
}: {
  team: WorkflowTeam;
  scrollTo: number | null;
  content: WorkflowContent;
  lang: WorkflowLang;
  L: ViewLabels;
  canEdit: boolean;
  stepFiles: (id: number) => React.ReactNode;
  teamFiles: React.ReactNode;
  onEditInstructions: () => void;
  onClose: () => void;
}) {
  const t = useT();
  const ids = TEAM_STEPS[team];
  const anchor = (n: number) => `npl-sop-${team}-${n}`;

  // Opened from a step's "Full SOP" button: jump to that step once the dialog has rendered.
  useEffect(() => {
    if (!scrollTo) return;
    const timer = setTimeout(
      () =>
        document
          .getElementById(anchor(scrollTo))
          ?.scrollIntoView({ block: "start" }),
      50,
    );
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollTo, team]);

  const extras = content.extras[team][lang];

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-5xl">
        <DialogHeader className="bg-[#10324a] text-white">
          <DialogTitle className="text-lg">{L.teamSop[team]}</DialogTitle>
        </DialogHeader>
        <DialogBody className="text-sm leading-relaxed">
          <nav className="flex flex-wrap gap-x-4 gap-y-1.5 pb-2">
            {ids.map((n) => (
              <button
                key={n}
                type="button"
                className="text-sky-700 hover:underline dark:text-sky-400"
                onClick={() =>
                  document
                    .getElementById(anchor(n))
                    ?.scrollIntoView({ block: "start", behavior: "smooth" })
                }
              >
                {fill(L.step, { n })} · {stepName(stepIn(content, lang, n))}
              </button>
            ))}
          </nav>
          {ids.map((n) => {
            const s = stepIn(content, lang, n);
            return (
              <section
                key={n}
                id={anchor(n)}
                className="scroll-mt-2 space-y-1.5 border-b py-3"
              >
                <h3 className="text-base font-semibold text-[#174861] dark:text-sky-300">
                  {fill(L.step, { n })} · {stepName(s)}
                </h3>
                <p>
                  <strong>{L.processOwner}</strong> {s.owner}
                </p>
                <p>
                  <strong>{L.startWhenColon}</strong> {s.trigger}
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  {teamActions(content, team, lang, n).map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
                <p>
                  <strong>{L.sharedDeliverable}</strong> {s.output}
                </p>
                <p>
                  <strong>{L.handoffColon}</strong> {s.handoff}
                </p>
                {s.note && (
                  <p>
                    <strong>{L.noteColon}</strong> {s.note}
                  </p>
                )}
                {n === 5 && content.labelTemplateUrl && (
                  <LabelTemplateLink url={content.labelTemplateUrl} L={L} />
                )}
                {stepFiles(n)}
              </section>
            );
          })}

          {teamFiles && (
            <div className="mt-4 rounded-lg border bg-muted/30 p-3">
              <h3 className="mb-2 font-semibold">{L.attachments}</h3>
              {teamFiles}
            </div>
          )}

          <div className="mt-5 flex items-center gap-2">
            <h3 className="flex-1 text-base font-semibold text-[#174861] dark:text-sky-300">
              {L.roleInstructions}
            </h3>
            {canEdit && (
              <Button size="sm" variant="outline" onClick={onEditInstructions}>
                <Pencil />
                {t("nplWorkflow.editInstructions")}
              </Button>
            )}
          </div>
          {extras.map(([heading, body], i) => (
            <section key={i} className="border-b py-2">
              <h4 className="font-semibold">{heading}</h4>
              <p className="whitespace-pre-line">{body}</p>
            </section>
          ))}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
