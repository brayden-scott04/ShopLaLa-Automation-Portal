"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MAX_FILE_BYTES,
  TEAM_STEPS,
  VIEW_LABELS,
  WORKFLOW_LANGS,
  WORKFLOW_TEAMS,
  type StepText,
  type WorkflowContent,
  type WorkflowFile,
  type WorkflowLang,
  type WorkflowTeam,
} from "@/lib/npl-workflow/constants";
import { useT } from "@/lib/i18n/client";
import type { MessageKey } from "@/lib/i18n/translate";

// Editing UI for the New Product Launch Workflow, shown only to admins and leaders (the server
// re-checks). Every dialog edits a copy of the content and hands the whole document to `onSave`.

type Save = (next: WorkflowContent) => Promise<string | null>;

const toLines = (v: string) =>
  v
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);

const LANG_KEYS: Record<WorkflowLang, MessageKey> = { en: "nplWorkflow.english", zh: "nplWorkflow.chinese" };

type StepForm = Record<keyof StepText, string>;

function toForm(s: StepText): StepForm {
  return {
    title: s.title,
    title2: s.title2 ?? "",
    sub: s.sub,
    owner: s.owner,
    trigger: s.trigger,
    actions: s.actions.join("\n"),
    output: s.output,
    handoff: s.handoff,
    note: s.note ?? "",
  };
}

function fromForm(f: StepForm, lang: WorkflowLang): StepText {
  const s: StepText = {
    title: f.title.trim(),
    sub: f.sub.trim(),
    owner: f.owner.trim(),
    trigger: f.trigger.trim(),
    actions: toLines(f.actions),
    output: f.output.trim(),
    handoff: f.handoff.trim(),
  };
  if (lang === "en" && f.title2.trim()) s.title2 = f.title2.trim();
  if (f.note.trim()) s.note = f.note.trim();
  return s;
}

const STEP_FIELDS: { key: keyof StepText; label: MessageKey; rows?: number }[] = [
  { key: "title", label: "nplWorkflow.fieldTitle" },
  { key: "title2", label: "nplWorkflow.fieldTitle2" },
  { key: "sub", label: "nplWorkflow.fieldSub" },
  { key: "owner", label: "nplWorkflow.fieldOwner", rows: 2 },
  { key: "trigger", label: "nplWorkflow.fieldTrigger", rows: 2 },
  { key: "actions", label: "nplWorkflow.fieldActions", rows: 8 },
  { key: "output", label: "nplWorkflow.fieldOutput", rows: 2 },
  { key: "handoff", label: "nplWorkflow.fieldHandoff", rows: 2 },
  { key: "note", label: "nplWorkflow.fieldNote", rows: 2 },
];

function SaveFooter({ busy, error, onCancel, onSave }: { busy: boolean; error: string | null; onCancel: () => void; onSave: () => void }) {
  const t = useT();
  return (
    <DialogFooter className="items-center">
      {error && <p className="mr-auto text-sm text-destructive">{error}</p>}
      <Button variant="outline" onClick={onCancel} disabled={busy}>
        {t("nplWorkflow.cancel")}
      </Button>
      <Button onClick={onSave} disabled={busy}>
        {busy ? t("nplWorkflow.saving") : t("nplWorkflow.save")}
      </Button>
    </DialogFooter>
  );
}

export function StepEditDialog({
  content,
  stepId,
  onClose,
  onSave,
}: {
  content: WorkflowContent;
  stepId: number;
  onClose: () => void;
  onSave: Save;
}) {
  const t = useT();
  const [forms, setForms] = useState<Record<WorkflowLang, StepForm>>(() => ({
    en: toForm(content.en[stepId - 1]),
    zh: toForm(content.zh[stepId - 1]),
  }));
  const teams = WORKFLOW_TEAMS.filter((r) => TEAM_STEPS[r].includes(stepId));
  const [teamLines, setTeamLines] = useState<Record<string, string>>(() => {
    const out: Record<string, string> = {};
    for (const r of teams)
      for (const l of WORKFLOW_LANGS) out[`${r}:${l}`] = (content.sharedActions[r]?.[String(stepId)]?.[l] ?? []).join("\n");
    return out;
  });
  const [labelUrl, setLabelUrl] = useState(content.labelTemplateUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField(lang: WorkflowLang, key: keyof StepText, value: string) {
    setForms((f) => ({ ...f, [lang]: { ...f[lang], [key]: value } }));
  }

  async function save() {
    const next: WorkflowContent = structuredClone(content);
    next.en[stepId - 1] = fromForm(forms.en, "en");
    next.zh[stepId - 1] = fromForm(forms.zh, "zh");
    for (const r of teams) {
      const en = toLines(teamLines[`${r}:en`]);
      const zh = toLines(teamLines[`${r}:zh`]);
      next.sharedActions[r] ??= {};
      if (en.length || zh.length) next.sharedActions[r][String(stepId)] = { en, zh };
      else delete next.sharedActions[r][String(stepId)];
    }
    if (stepId === 5) next.labelTemplateUrl = labelUrl.trim();
    setBusy(true);
    const err = await onSave(next);
    setBusy(false);
    if (err) setError(err);
    else onClose();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && !busy && onClose()}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>{t("nplWorkflow.editStepTitle", { n: stepId })}</DialogTitle>
          <DialogDescription>{t("nplWorkflow.editStepHint")}</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {WORKFLOW_LANGS.map((lang) => (
              <section key={lang} className="min-w-0 space-y-3">
                <h3 className="border-b pb-1.5 text-sm font-semibold">{t(LANG_KEYS[lang])}</h3>
                {STEP_FIELDS.filter((f) => lang === "en" || f.key !== "title2").map((f) => {
                  const id = `npl-${lang}-${f.key}`;
                  return (
                    <div key={f.key} className="space-y-1">
                      <Label htmlFor={id}>{t(f.label)}</Label>
                      {f.rows ? (
                        <Textarea
                          id={id}
                          rows={f.rows}
                          value={forms[lang][f.key]}
                          onChange={(e) => setField(lang, f.key, e.target.value)}
                        />
                      ) : (
                        <Input id={id} value={forms[lang][f.key]} onChange={(e) => setField(lang, f.key, e.target.value)} />
                      )}
                    </div>
                  );
                })}
              </section>
            ))}
          </div>

          {stepId === 5 && (
            <div className="space-y-1">
              <Label htmlFor="npl-label-url">{t("nplWorkflow.labelTemplateUrl")}</Label>
              <Input id="npl-label-url" type="url" value={labelUrl} onChange={(e) => setLabelUrl(e.target.value)} />
            </div>
          )}

          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">{t("nplWorkflow.teamActions")}</h3>
              <p className="text-xs text-muted-foreground">{t("nplWorkflow.teamActionsHint")}</p>
            </div>
            {teams.map((r) => (
              <div key={r} className="space-y-2">
                <h4 className="text-sm font-medium">{VIEW_LABELS.en.teamName[r]} · {VIEW_LABELS.zh.teamName[r]}</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  {WORKFLOW_LANGS.map((lang) => (
                    <div key={lang} className="space-y-1">
                      <Label htmlFor={`npl-team-${r}-${lang}`}>{t(LANG_KEYS[lang])}</Label>
                      <Textarea
                        id={`npl-team-${r}-${lang}`}
                        rows={4}
                        value={teamLines[`${r}:${lang}`]}
                        onChange={(e) => setTeamLines((v) => ({ ...v, [`${r}:${lang}`]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </DialogBody>
        <SaveFooter busy={busy} error={error} onCancel={onClose} onSave={save} />
      </DialogContent>
    </Dialog>
  );
}

type Section = { en: [string, string]; zh: [string, string] };

export function TeamEditDialog({
  content,
  team,
  onClose,
  onSave,
}: {
  content: WorkflowContent;
  team: WorkflowTeam;
  onClose: () => void;
  onSave: Save;
}) {
  const t = useT();
  const [sections, setSections] = useState<Section[]>(() => {
    const { en, zh } = content.extras[team];
    return Array.from({ length: Math.max(en.length, zh.length) }, (_, i) => ({
      en: [...(en[i] ?? ["", ""])] as [string, string],
      zh: [...(zh[i] ?? ["", ""])] as [string, string],
    }));
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(i: number, lang: WorkflowLang, part: 0 | 1, value: string) {
    setSections((list) =>
      list.map((s, j) => {
        if (j !== i) return s;
        const pair: [string, string] = [...s[lang]];
        pair[part] = value;
        return { ...s, [lang]: pair };
      }),
    );
  }

  function move(i: number, by: number) {
    setSections((list) => {
      const next = [...list];
      const [item] = next.splice(i, 1);
      next.splice(i + by, 0, item);
      return next;
    });
  }

  async function save() {
    const kept = sections
      .map((s) => ({ en: s.en.map((x) => x.trim()) as [string, string], zh: s.zh.map((x) => x.trim()) as [string, string] }))
      .filter((s) => [...s.en, ...s.zh].some(Boolean));
    const next: WorkflowContent = structuredClone(content);
    next.extras[team] = { en: kept.map((s) => s.en), zh: kept.map((s) => s.zh) };
    setBusy(true);
    const err = await onSave(next);
    setBusy(false);
    if (err) setError(err);
    else onClose();
  }

  const sop = `${VIEW_LABELS.en.teamSop[team]} · ${VIEW_LABELS.zh.teamSop[team]}`;

  return (
    <Dialog open onOpenChange={(o) => !o && !busy && onClose()}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>{t("nplWorkflow.editInstructionsTitle", { sop })}</DialogTitle>
          <DialogDescription>{t("nplWorkflow.editInstructionsHint")}</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4">
          {sections.map((s, i) => (
            <div key={i} className="space-y-3 rounded-lg border p-3">
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="icon-sm" aria-label={t("nplWorkflow.moveUp")} disabled={i === 0} onClick={() => move(i, -1)}>
                  <ArrowUp />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("nplWorkflow.moveDown")}
                  disabled={i === sections.length - 1}
                  onClick={() => move(i, 1)}
                >
                  <ArrowDown />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("nplWorkflow.removeSection")}
                  onClick={() => setSections((list) => list.filter((_, j) => j !== i))}
                >
                  <Trash2 />
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {WORKFLOW_LANGS.map((lang) => (
                  <div key={lang} className="min-w-0 space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground">{t(LANG_KEYS[lang])}</h4>
                    <div className="space-y-1">
                      <Label htmlFor={`npl-sec-${i}-${lang}-h`}>{t("nplWorkflow.heading")}</Label>
                      <Input id={`npl-sec-${i}-${lang}-h`} value={s[lang][0]} onChange={(e) => update(i, lang, 0, e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`npl-sec-${i}-${lang}-b`}>{t("nplWorkflow.body")}</Label>
                      <Textarea id={`npl-sec-${i}-${lang}-b`} rows={4} value={s[lang][1]} onChange={(e) => update(i, lang, 1, e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setSections((list) => [
                ...list,
                { en: [t("nplWorkflow.newSection"), ""], zh: ["", ""] },
              ])
            }
          >
            <Plus />
            {t("nplWorkflow.addSection")}
          </Button>
        </DialogBody>
        <SaveFooter busy={busy} error={error} onCancel={onClose} onSave={save} />
      </DialogContent>
    </Dialog>
  );
}

export function UploadDialog({
  scopeType,
  scopeId,
  target,
  onClose,
  onUploaded,
}: {
  scopeType: "step" | "team";
  scopeId: string;
  /** Where the file goes, already in words ("Step 4 · Product form"). */
  target: string;
  onClose: () => void;
  onUploaded: (file: WorkflowFile) => void;
}) {
  const t = useT();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const maxMb = MAX_FILE_BYTES / 1024 / 1024;

  async function upload() {
    if (!file) return setError(t("errors.nplFileRequired"));
    if (file.size > MAX_FILE_BYTES) return setError(t("errors.nplFileTooLarge", { max: maxMb }));
    const body = new FormData();
    body.set("file", file);
    body.set("scopeType", scopeType);
    body.set("scopeId", scopeId);
    body.set("title", title);
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/npl-workflow/files", { method: "POST", body });
      const json = (await res.json().catch(() => ({}))) as { data?: WorkflowFile; error?: string };
      if (!res.ok || !json.data) setError(json.error ?? `HTTP ${res.status}`);
      else {
        onUploaded(json.data);
        onClose();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && !busy && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("nplWorkflow.uploadTitle")}</DialogTitle>
          <DialogDescription>{t("nplWorkflow.uploadHint", { target, max: maxMb })}</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-3">
          <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <div className="space-y-1">
            <Label htmlFor="npl-file-title">{t("nplWorkflow.fileTitle")}</Label>
            <Input id="npl-file-title" value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} />
          </div>
        </DialogBody>
        <DialogFooter className="items-center">
          {error && <p className="mr-auto text-sm text-destructive">{error}</p>}
          <Button variant="outline" onClick={onClose} disabled={busy}>
            {t("nplWorkflow.cancel")}
          </Button>
          <Button onClick={upload} disabled={busy || !file}>
            {busy ? t("nplWorkflow.uploading") : t("nplWorkflow.upload")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteFileDialog({
  file,
  onCancel,
  onConfirm,
}: {
  file: WorkflowFile | null;
  onCancel: () => void;
  onConfirm: (file: WorkflowFile) => void;
}) {
  const t = useT();
  return (
    <AlertDialog open={file !== null} onOpenChange={(o) => !o && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{file ? t("nplWorkflow.deleteFile", { name: file.title }) : null}</AlertDialogTitle>
          <AlertDialogDescription>{file ? t("nplWorkflow.deleteFileConfirm", { name: file.title }) : null}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("nplWorkflow.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              if (file) onConfirm(file);
              onCancel();
            }}
          >
            {t("nplWorkflow.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
