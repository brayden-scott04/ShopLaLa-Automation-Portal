// Organization Chart (/org-chart) types and limits. Kept out of lib/actions/org-chart.ts because a
// "use server" file must not export constants for client components (see CLAUDE.md).

export const ORG_NODE_KINDS = ["pic", "member", "supporting", "new", "open"] as const;
export type OrgNodeKind = (typeof ORG_NODE_KINDS)[number];

/** Matches the CHECK constraints in sql/org_chart_migration.sql. */
export const ORG_NAME_MAX = 60;
export const ORG_LOCATION_MAX = 40;

export interface OrgDepartment {
  id: string;
  name: string;
  position: number;
}

export interface OrgPerson {
  id: string;
  name: string;
  location: string | null;
  partTime: boolean;
}

export interface OrgNode {
  id: string;
  departmentId: string;
  /** Null only for open positions. */
  personId: string | null;
  kind: OrgNodeKind;
  /** Open positions only: the box's label, e.g. "New Hire 1". */
  title: string | null;
  /** Optional detail: under the name for members ("Images"), in brackets after it otherwise ("Store"). */
  note: string | null;
  position: number;
}

export interface OrgChart {
  departments: OrgDepartment[];
  people: OrgPerson[];
  nodes: OrgNode[];
  /** ISO time of the last edit, shown as "As of <date>". */
  updatedAt: string | null;
  canEdit: boolean;
}

export interface OrgNodeInput {
  id?: string;
  departmentId: string;
  kind: OrgNodeKind;
  /** Person's name; an unknown name creates the person. Ignored for open positions. */
  personName?: string;
  title?: string;
  note?: string;
  /** Saved on the person, so they apply in every column the person appears in. */
  location?: string;
  partTime?: boolean;
}

export interface OrgStats {
  headcount: number;
  fullTime: number;
  partTime: number;
  openPositions: number;
}

/** People on the chart (each counted once, however many columns they're in) plus open boxes. */
export function orgStats(chart: Pick<OrgChart, "people" | "nodes">): OrgStats {
  const onChart = new Set(chart.nodes.map((n) => n.personId).filter((id): id is string => !!id));
  const people = chart.people.filter((p) => onChart.has(p.id));
  const partTime = people.filter((p) => p.partTime).length;
  return {
    headcount: people.length,
    fullTime: people.length - partTime,
    partTime,
    openPositions: chart.nodes.filter((n) => n.kind === "open").length,
  };
}

/**
 * The Team locations panel: people on the chart grouped by location, biggest group first, each group
 * in the order people first appear on the chart. People with no location are left out.
 */
export function orgLocations(chart: Pick<OrgChart, "departments" | "people" | "nodes">): { location: string; people: OrgPerson[] }[] {
  const deptOrder = new Map(chart.departments.map((d) => [d.id, d.position]));
  const ordered = [...chart.nodes].sort(
    (a, b) => (deptOrder.get(a.departmentId) ?? 0) - (deptOrder.get(b.departmentId) ?? 0) || a.position - b.position
  );
  const byId = new Map(chart.people.map((p) => [p.id, p]));
  const seen = new Set<string>();
  const groups = new Map<string, OrgPerson[]>();
  for (const node of ordered) {
    const person = node.personId ? byId.get(node.personId) : undefined;
    if (!person || seen.has(person.id) || !person.location) continue;
    seen.add(person.id);
    const list = groups.get(person.location) ?? [];
    list.push(person);
    groups.set(person.location, list);
  }
  return Array.from(groups, ([location, people]) => ({ location, people })).sort(
    (a, b) => b.people.length - a.people.length
  );
}
