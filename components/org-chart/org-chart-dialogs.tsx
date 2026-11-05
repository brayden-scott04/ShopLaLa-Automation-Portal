"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  deleteOrgNode,
  deleteOrgPerson,
  saveOrgDepartment,
  saveOrgNode,
  updateOrgPerson,
} from "@/lib/actions/org-chart";
import {
  ORG_LOCATION_MAX,
  ORG_NAME_MAX,
  ORG_NODE_KINDS,
  type OrgChart,
  type OrgDepartment,
  type OrgNode,
  type OrgNodeKind,
  type OrgPerson,
} from "@/lib/org-chart-constants";
import { useT } from "@/lib/i18n/client";
import type { MessageKey } from "@/lib/i18n/translate";
import { cn } from "@/lib/utils";

const KIND_LABELS: Record<OrgNodeKind, MessageKey> = {
  pic: "orgChart.kindPic",
  member: "orgChart.kindMember",
  supporting: "orgChart.kindSupporting",
  new: "orgChart.kindNew",
  open: "orgChart.kindOpen",
};

/** Distinct locations already in use, for the location input's suggestions. */
function knownLocations(people: OrgPerson[]): string[] {
  return Array.from(new Set(people.map((p) => p.location).filter((l): l is string => !!l))).sort();
}

export function NodeDialog({
  node,
  department,
  people,
  onClose,
  onSaved,
}: {
  node: OrgNode | null;
  department: OrgDepartment;
  people: OrgPerson[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const t = useT();
  const current = node?.personId ? people.find((p) => p.id === node.personId) : undefined;
  const [kind, setKind] = useState<OrgNodeKind>(node?.kind ?? "member");
  const [personName, setPersonName] = useState(current?.name ?? "");
  const [title, setTitle] = useState(node?.title ?? "");
  const [note, setNote] = useState(node?.note ?? "");
  const [location, setLocation] = useState(current?.location ?? "");
  const [partTime, setPartTime] = useState(current?.partTime ?? false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Picking an existing person fills in their saved location and part-time flag.
  function changePerson(name: string) {
    setPersonName(name);
    const match = people.find((p) => p.name.toLowerCase() === name.trim().toLowerCase());
    if (match) {
      setLocation(match.location ?? "");
      setPartTime(match.partTime);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await saveOrgNode({
      id: node?.id,
      departmentId: department.id,
      kind,
      personName,
      title,
      note,
      location,
      partTime,
    });
    setBusy(false);
    if (res.error) setError(res.error);
    else onSaved();
  }

  async function handleDelete() {
    if (!node) return;
    setBusy(true);
    const res = await deleteOrgNode(node.id);
    setBusy(false);
    if (res.error) setError(res.error);
    else onSaved();
  }

  const isOpen = kind === "open";

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
          <DialogHeader>
            <DialogTitle>{node ? t("orgChart.editBox") : t("orgChart.newBox", { department: department.name })}</DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <div>
              <Label className="mb-1.5">{t("orgChart.boxType")}</Label>
              <div className="flex flex-wrap gap-1.5">
                {ORG_NODE_KINDS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKind(k)}
                    className={cn(
                      "rounded-md border px-2.5 py-1 text-sm transition-colors",
                      kind === k ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"
                    )}
                  >
                    {t(KIND_LABELS[k])}
                  </button>
                ))}
              </div>
            </div>

            {isOpen ? (
              <div>
                <Label className="mb-1">{t("orgChart.positionTitle")}</Label>
                <Input
                  autoFocus
                  value={title}
                  maxLength={ORG_NAME_MAX}
                  placeholder={t("orgChart.positionTitlePlaceholder")}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            ) : (
              <>
                <div>
                  <Label className="mb-1">{t("orgChart.person")}</Label>
                  <Input
                    autoFocus
                    list="org-chart-people"
                    value={personName}
                    maxLength={ORG_NAME_MAX}
                    onChange={(e) => changePerson(e.target.value)}
                  />
                  <datalist id="org-chart-people">
                    {people.map((p) => (
                      <option key={p.id} value={p.name} />
                    ))}
                  </datalist>
                  <p className="mt-1 text-xs text-muted-foreground">{t("orgChart.personHint")}</p>
                </div>
                <div className="grid grid-cols-[1fr_auto] items-end gap-3">
                  <div>
                    <Label className="mb-1">{t("orgChart.location")}</Label>
                    <Input
                      list="org-chart-locations"
                      value={location}
                      maxLength={ORG_LOCATION_MAX}
                      placeholder={t("orgChart.locationPlaceholder")}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <datalist id="org-chart-locations">
                      {knownLocations(people).map((l) => (
                        <option key={l} value={l} />
                      ))}
                    </datalist>
                  </div>
                  <label className="flex h-8 items-center gap-2 text-sm">
                    <Checkbox checked={partTime} onCheckedChange={(c) => setPartTime(c === true)} />
                    {t("orgChart.partTime")}
                  </label>
                </div>
                <p className="-mt-2 text-xs text-muted-foreground">{t("orgChart.personSharedHint")}</p>
              </>
            )}

            <div>
              <Label className="mb-1">{t("orgChart.note")}</Label>
              <Input
                value={note}
                maxLength={ORG_NAME_MAX}
                placeholder={t("orgChart.notePlaceholder")}
                onChange={(e) => setNote(e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">{t("orgChart.noteHint")}</p>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </DialogBody>
          <DialogFooter className="sm:justify-between">
            {node ? (
              <Button type="button" variant="destructive" disabled={busy} onClick={handleDelete}>
                <Trash2 />
                {t("orgChart.deleteBox")}
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={busy || (isOpen ? !title.trim() : !personName.trim())}>
                {busy ? t("common.saving") : t("common.save")}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DepartmentDialog({
  department,
  onClose,
  onSaved,
}: {
  department: OrgDepartment | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const t = useT();
  const [name, setName] = useState(department?.name ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await saveOrgDepartment({ id: department?.id, name });
    setBusy(false);
    if (res.error) setError(res.error);
    else onSaved();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
          <DialogHeader>
            <DialogTitle>{department ? t("orgChart.renameDepartment") : t("orgChart.newDepartment")}</DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-3">
            <Input
              autoFocus
              value={name}
              maxLength={ORG_NAME_MAX}
              placeholder={t("orgChart.departmentName")}
              onChange={(e) => setName(e.target.value)}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={busy || !name.trim()}>
              {busy ? t("common.saving") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** Every person on the chart: rename, location and part-time apply in all their departments. */
export function PeopleDialog({
  chart,
  onClose,
  onChanged,
}: {
  chart: OrgChart;
  onClose: () => void;
  onChanged: () => void;
}) {
  const t = useT();
  const deptName = new Map(chart.departments.map((d) => [d.id, d.name]));
  const locations = knownLocations(chart.people);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("orgChart.peopleTitle")}</DialogTitle>
          <DialogDescription>{t("orgChart.peopleDescription")}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <datalist id="org-chart-people-locations">
            {locations.map((l) => (
              <option key={l} value={l} />
            ))}
          </datalist>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="py-1.5 pr-2 font-medium">{t("orgChart.name")}</th>
                <th className="py-1.5 pr-2 font-medium">{t("orgChart.location")}</th>
                <th className="py-1.5 pr-2 font-medium">{t("orgChart.partTime")}</th>
                <th className="py-1.5 pr-2 font-medium">{t("orgChart.columns")}</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {chart.people.map((person) => (
                <PersonRow
                  key={`${person.id}:${person.name}:${person.location}:${person.partTime}`}
                  person={person}
                  departments={Array.from(
                    new Set(
                      chart.nodes
                        .filter((n) => n.personId === person.id)
                        .map((n) => deptName.get(n.departmentId))
                        .filter((d): d is string => !!d)
                    )
                  )}
                  onChanged={onChanged}
                />
              ))}
            </tbody>
          </table>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

function PersonRow({
  person,
  departments,
  onChanged,
}: {
  person: OrgPerson;
  departments: string[];
  onChanged: () => void;
}) {
  const t = useT();
  const [name, setName] = useState(person.name);
  const [location, setLocation] = useState(person.location ?? "");
  const [error, setError] = useState<string | null>(null);

  async function save(next: { name?: string; location?: string; partTime?: boolean }) {
    const merged = { name, location, partTime: person.partTime, ...next };
    if (
      merged.name.trim() === person.name &&
      merged.location.trim() === (person.location ?? "") &&
      merged.partTime === person.partTime
    ) {
      return;
    }
    const res = await updateOrgPerson({ id: person.id, ...merged });
    if (res.error) setError(res.error);
    else {
      setError(null);
      onChanged();
    }
  }

  async function remove() {
    if (!window.confirm(t("orgChart.confirmDeletePerson", { name: person.name }))) return;
    const res = await deleteOrgPerson(person.id);
    if (res.error) setError(res.error);
    else onChanged();
  }

  return (
    <tr className="border-b border-border align-top last:border-0">
      <td className="py-1.5 pr-2">
        <Input
          value={name}
          maxLength={ORG_NAME_MAX}
          className={cn("h-8", person.partTime && "text-red-600 dark:text-red-400")}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => save({})}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        />
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </td>
      <td className="py-1.5 pr-2">
        <Input
          value={location}
          list="org-chart-people-locations"
          maxLength={ORG_LOCATION_MAX}
          className="h-8"
          onChange={(e) => setLocation(e.target.value)}
          onBlur={() => save({})}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        />
      </td>
      <td className="py-1.5 pr-2">
        <div className="flex h-8 items-center">
          <Checkbox checked={person.partTime} onCheckedChange={(c) => save({ partTime: c === true })} />
        </div>
      </td>
      <td className="py-1.5 pr-2 text-xs leading-8 text-muted-foreground">
        {departments.length ? departments.join(", ") : t("orgChart.notOnChart")}
      </td>
      <td className="py-1.5">
        <Button
          size="icon-sm"
          variant="ghost"
          className="text-destructive"
          title={t("orgChart.deletePerson", { name: person.name })}
          aria-label={t("orgChart.deletePerson", { name: person.name })}
          onClick={remove}
        >
          <Trash2 />
        </Button>
      </td>
    </tr>
  );
}
