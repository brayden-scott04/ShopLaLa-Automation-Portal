"use client";

import { useEffect, useState, useTransition } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Pencil, Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  deleteOrgDepartment,
  getOrgChart,
  moveOrgDepartment,
  moveOrgNode,
} from "@/lib/actions/org-chart";
import {
  orgLocations,
  orgStats,
  type OrgChart,
  type OrgDepartment,
  type OrgNode,
  type OrgPerson,
} from "@/lib/org-chart-constants";
import { useLocale, useT } from "@/lib/i18n/client";
import { formatDate } from "@/lib/i18n/format";
import { cn } from "@/lib/utils";
import { DepartmentDialog, NodeDialog, PeopleDialog } from "./org-chart-dialogs";

// Connector lines between boxes.
const LINE = "bg-slate-400 dark:bg-slate-500";
const DARK_BOX = "bg-slate-800 text-white dark:bg-slate-700";

/** Box colours by kind, matching the legend. */
const KIND_CLASSES: Record<OrgNode["kind"], string> = {
  pic: "border-2 border-slate-800 bg-card dark:border-slate-300",
  member: "border border-border bg-card",
  supporting: "border border-dashed border-sky-400 bg-sky-100 dark:border-sky-700 dark:bg-sky-950/60",
  new: "border border-green-500 bg-green-200 dark:border-green-700 dark:bg-green-900/50",
  open: "border border-yellow-500 bg-yellow-200 dark:border-yellow-700 dark:bg-yellow-900/50",
};

const PART_TIME_TEXT = "text-red-600 dark:text-red-400";

type NodeDialogState = { node: OrgNode | null; department: OrgDepartment } | null;

export function OrgChartView() {
  const t = useT();
  const locale = useLocale();
  const [chart, setChart] = useState<OrgChart | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [, startTransition] = useTransition();

  const [nodeDialog, setNodeDialog] = useState<NodeDialogState>(null);
  const [departmentDialog, setDepartmentDialog] = useState<{ department: OrgDepartment | null } | null>(null);
  const [peopleOpen, setPeopleOpen] = useState(false);

  function reload() {
    startTransition(async () => {
      const res = await getOrgChart();
      if (res.error) setError(res.error);
      else {
        setError(null);
        setChart(res.data);
      }
    });
  }

  useEffect(reload, []);

  /** Runs a write, then reloads; shows the error instead if it failed. */
  function run(action: () => Promise<{ error: string | null }>) {
    startTransition(async () => {
      const res = await action();
      if (res.error) setError(res.error);
      reload();
    });
  }

  if (!chart) {
    return error ? <p className="text-sm text-destructive">{error}</p> : <Skeleton className="h-[480px] w-full" />;
  }

  const departments = [...chart.departments].sort((a, b) => a.position - b.position);
  const peopleById = new Map(chart.people.map((p) => [p.id, p]));
  const stats = orgStats(chart);
  const locations = orgLocations(chart);
  const columnCount = Math.max(departments.length, 1);
  // Half a column, as a percentage: where the first and last columns' centres sit.
  const halfColumn = `${50 / columnCount}%`;

  return (
    <div className="space-y-4">
      {chart.canEdit && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          {editing && (
            <>
              <Button size="sm" variant="outline" onClick={() => setPeopleOpen(true)}>
                <Users />
                {t("orgChart.people")}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setDepartmentDialog({ department: null })}>
                <Plus />
                {t("orgChart.addDepartment")}
              </Button>
            </>
          )}
          <Button size="sm" variant={editing ? "default" : "outline"} onClick={() => setEditing((e) => !e)}>
            <Pencil />
            {editing ? t("orgChart.doneEditing") : t("orgChart.edit")}
          </Button>
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="overflow-x-auto rounded-lg border border-border bg-muted/20 p-6">
        <div className="relative" style={{ minWidth: columnCount * 165 }}>
          {/* Title, with the counts to its right. */}
          <div className="relative flex flex-col items-center">
            <div className={cn("rounded-md px-12 py-3 text-center shadow-sm", DARK_BOX)}>
              <div className="text-lg font-bold">{t("orgChart.chartTitle")}</div>
              {chart.updatedAt && (
                <div className="text-xs opacity-80">
                  {t("orgChart.asOf", { date: formatDate(locale, chart.updatedAt, { dateStyle: "medium" }) })}
                </div>
              )}
            </div>
            <div className="absolute top-0 right-0 flex gap-2">
              <StatBox value={stats.headcount} label={t("orgChart.headcount")} className={DARK_BOX} />
              <StatBox value={stats.fullTime} label={t("orgChart.fullTime")} className="border border-border bg-card" />
              <StatBox
                value={stats.partTime}
                label={t("orgChart.partTime")}
                className="border border-border bg-card"
                valueClassName={PART_TIME_TEXT}
              />
              <StatBox
                value={stats.openPositions}
                label={t("orgChart.openPosition")}
                className={KIND_CLASSES.open}
              />
            </div>
            {departments.length > 0 && <div className={cn("h-8 w-px", LINE)} />}
          </div>

          {departments.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">{t("orgChart.empty")}</p>
          ) : (
            <div className="relative grid" style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}>
              {departments.length > 1 && (
                <div className={cn("absolute top-0 h-px", LINE)} style={{ left: halfColumn, right: halfColumn }} />
              )}
              {departments.map((dept, index) => (
                <DepartmentColumn
                  key={dept.id}
                  department={dept}
                  nodes={chart.nodes
                    .filter((n) => n.departmentId === dept.id)
                    .sort((a, b) => a.position - b.position)}
                  peopleById={peopleById}
                  editing={editing}
                  isFirst={index === 0}
                  isLast={index === departments.length - 1}
                  onRename={() => setDepartmentDialog({ department: dept })}
                  onDelete={() => {
                    if (window.confirm(t("orgChart.confirmDeleteDepartment", { name: dept.name }))) {
                      run(() => deleteOrgDepartment(dept.id));
                    }
                  }}
                  onMove={(dir) => run(() => moveOrgDepartment(dept.id, dir))}
                  onMoveNode={(node, dir) => run(() => moveOrgNode(node.id, dir))}
                  onEditNode={(node) => setNodeDialog({ node, department: dept })}
                  onAddNode={() => setNodeDialog({ node: null, department: dept })}
                />
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
            <Legend />
            {locations.length > 0 && (
              <div className="max-w-xl min-w-72 flex-1 space-y-2">
                <h3 className="text-sm font-semibold text-foreground">{t("orgChart.teamLocations")}</h3>
                <div className="flex flex-wrap gap-2">
                  {locations.map(({ location, people }) => (
                    <div key={location} className="rounded-md border border-border bg-card px-3 py-2">
                      <div className="text-sm font-semibold text-foreground">
                        {location} <span className="font-normal text-muted-foreground">· {people.length}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {people.map((p, i) => (
                          <span key={p.id}>
                            {i > 0 && ", "}
                            <span className={p.partTime ? PART_TIME_TEXT : undefined}>{p.name}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {nodeDialog && (
        <NodeDialog
          key={nodeDialog.node?.id ?? `new-${nodeDialog.department.id}`}
          node={nodeDialog.node}
          department={nodeDialog.department}
          people={chart.people}
          onClose={() => setNodeDialog(null)}
          onSaved={() => {
            setNodeDialog(null);
            reload();
          }}
        />
      )}
      {departmentDialog && (
        <DepartmentDialog
          key={departmentDialog.department?.id ?? "new"}
          department={departmentDialog.department}
          onClose={() => setDepartmentDialog(null)}
          onSaved={() => {
            setDepartmentDialog(null);
            reload();
          }}
        />
      )}
      {peopleOpen && <PeopleDialog chart={chart} onClose={() => setPeopleOpen(false)} onChanged={reload} />}
    </div>
  );
}

function StatBox({
  value,
  label,
  className,
  valueClassName,
}: {
  value: number;
  label: string;
  className: string;
  valueClassName?: string;
}) {
  return (
    <div className={cn("min-w-20 rounded-md px-3 py-1.5 text-center shadow-sm", className)}>
      <div className={cn("text-lg leading-tight font-bold", valueClassName)}>{value}</div>
      <div className="text-[11px] opacity-80">{label}</div>
    </div>
  );
}

function DepartmentColumn({
  department,
  nodes,
  peopleById,
  editing,
  isFirst,
  isLast,
  onRename,
  onDelete,
  onMove,
  onMoveNode,
  onEditNode,
  onAddNode,
}: {
  department: OrgDepartment;
  nodes: OrgNode[];
  peopleById: Map<string, OrgPerson>;
  editing: boolean;
  isFirst: boolean;
  isLast: boolean;
  onRename: () => void;
  onDelete: () => void;
  onMove: (direction: -1 | 1) => void;
  onMoveNode: (node: OrgNode, direction: -1 | 1) => void;
  onEditNode: (node: OrgNode) => void;
  onAddNode: () => void;
}) {
  const t = useT();
  return (
    <div className="flex min-w-0 flex-col items-stretch px-2">
      <div className={cn("mx-auto h-6 w-px", LINE)} />
      <div
        className={cn(
          "group relative flex min-h-14 items-center justify-center rounded-md px-2 py-2 text-center text-sm font-bold shadow-sm",
          DARK_BOX
        )}
      >
        {department.name}
        {editing && (
          <div className="absolute inset-x-1 -bottom-3 flex justify-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            {!isFirst && <IconButton label={t("orgChart.moveLeft")} onClick={() => onMove(-1)} icon={ChevronLeft} />}
            <IconButton label={t("orgChart.renameDepartment")} onClick={onRename} icon={Pencil} />
            <IconButton label={t("orgChart.deleteDepartment")} onClick={onDelete} icon={Trash2} destructive />
            {!isLast && <IconButton label={t("orgChart.moveRight")} onClick={() => onMove(1)} icon={ChevronRight} />}
          </div>
        )}
      </div>

      {nodes.map((node, index) => (
        <div key={node.id} className="flex flex-col items-stretch">
          <div className={cn("mx-auto h-4 w-px", LINE)} />
          <NodeBox
            node={node}
            person={node.personId ? peopleById.get(node.personId) : undefined}
            editing={editing}
            canMoveUp={index > 0}
            canMoveDown={index < nodes.length - 1}
            onMove={(dir) => onMoveNode(node, dir)}
            onEdit={() => onEditNode(node)}
          />
        </div>
      ))}

      {editing && (
        <>
          <div className={cn("mx-auto h-4 w-px", LINE)} />
          <button
            type="button"
            onClick={onAddNode}
            className="flex items-center justify-center gap-1 rounded-md border border-dashed border-border py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Plus className="size-3.5" />
            {t("orgChart.addBox")}
          </button>
        </>
      )}
    </div>
  );
}

function NodeBox({
  node,
  person,
  editing,
  canMoveUp,
  canMoveDown,
  onMove,
  onEdit,
}: {
  node: OrgNode;
  person: OrgPerson | undefined;
  editing: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMove: (direction: -1 | 1) => void;
  onEdit: () => void;
}) {
  const t = useT();
  const partTime = !!person?.partTime;

  let name = node.kind === "open" ? (node.title ?? "") : (person?.name ?? "");
  const subtitle: string[] = [];
  if (node.kind === "member") {
    if (node.note) subtitle.push(node.note);
  } else if (node.note) {
    name = `${name} (${node.note})`;
  }
  if (node.kind === "pic") subtitle.push(t("orgChart.pic"));
  if (node.kind === "supporting") subtitle.push(t("orgChart.supporting"));
  if (node.kind === "new") subtitle.push(partTime ? t("orgChart.newShort") : t("orgChart.newMember"));
  if (node.kind === "open") subtitle.push(t("orgChart.openPosition"));
  if (partTime) subtitle.push(t("orgChart.partTime"));

  const body = (
    <>
      <div className={cn("text-sm font-semibold", partTime ? PART_TIME_TEXT : "text-foreground")}>{name}</div>
      {subtitle.length > 0 && (
        <div className={cn("text-[11px]", partTime ? PART_TIME_TEXT : "text-muted-foreground")}>
          {subtitle.join(" · ")}
        </div>
      )}
    </>
  );
  const boxClass = cn(
    "flex min-h-11 w-full flex-col items-center justify-center rounded-md px-2 py-1.5 text-center shadow-sm",
    KIND_CLASSES[node.kind]
  );

  if (!editing) return <div className={boxClass}>{body}</div>;

  return (
    <div className="group relative">
      <button type="button" onClick={onEdit} title={t("orgChart.editBox")} className={cn(boxClass, "hover:ring-2 hover:ring-ring")}>
        {body}
      </button>
      <div className="absolute top-1/2 -right-1 flex -translate-y-1/2 flex-col opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        {canMoveUp && <IconButton label={t("orgChart.moveUp")} onClick={() => onMove(-1)} icon={ChevronUp} />}
        {canMoveDown && <IconButton label={t("orgChart.moveDown")} onClick={() => onMove(1)} icon={ChevronDown} />}
      </div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  icon: Icon,
  destructive,
}: {
  label: string;
  onClick: () => void;
  icon: typeof Plus;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "flex size-6 items-center justify-center rounded border border-border bg-background text-foreground shadow-sm hover:bg-accent",
        destructive && "text-destructive"
      )}
    >
      <Icon className="size-3.5" />
    </button>
  );
}

function Legend() {
  const t = useT();
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
      <span className="font-semibold text-foreground">{t("orgChart.legend")}</span>
      <LegendItem swatch={<span className={cn("h-4 w-7 rounded", KIND_CLASSES.new)} />} label={t("orgChart.legendNew")} />
      <LegendItem swatch={<span className={cn("h-4 w-7 rounded", KIND_CLASSES.open)} />} label={t("orgChart.legendOpen")} />
      <LegendItem
        swatch={
          <span className={cn("rounded border border-border bg-card px-1 text-xs font-semibold", PART_TIME_TEXT)}>{t("orgChart.partTimeSample")}</span>
        }
        label={t("orgChart.legendPartTime")}
      />
      <LegendItem
        swatch={<span className={cn("h-4 w-7 rounded", KIND_CLASSES.supporting)} />}
        label={t("orgChart.legendSupporting")}
      />
    </div>
  );
}

function LegendItem({ swatch, label }: { swatch: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-2 text-muted-foreground">
      {swatch}
      {label}
    </span>
  );
}
