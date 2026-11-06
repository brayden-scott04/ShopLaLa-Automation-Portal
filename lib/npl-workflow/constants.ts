import { z } from "zod";

// New Product Launch Workflow: shared types, validation and diagram layout. Plain module (not
// "use server"), so client components and the server actions both import from here.
//
// The text of the SOP is data (npl_workflow.content, edited in the portal by admins and leaders).
// The diagram's geometry (where each card and arrow sits) is code, below.

export const WORKFLOW_LANGS = ["en", "zh"] as const;
export type WorkflowLang = (typeof WORKFLOW_LANGS)[number];

export const WORKFLOW_TEAMS = ["supply", "ops", "visual"] as const;
export type WorkflowTeam = (typeof WORKFLOW_TEAMS)[number];

export const STEP_COUNT = 13;

/** 4 MB: a Vercel request body tops out at 4.5 MB, and an upload is one request. */
export const MAX_FILE_BYTES = 4 * 1024 * 1024;
export const FILE_TITLE_MAX = 120;

const text = z.string().max(4000);
const lines = z.array(z.string().max(2000)).max(40);

export const stepTextSchema = z.object({
  title: z.string().min(1).max(80),
  /** Second line of the card title on the diagram (English only; Chinese titles fit on one). */
  title2: z.string().max(80).optional(),
  sub: z.string().max(80),
  owner: text,
  trigger: text,
  actions: lines,
  output: text,
  handoff: text,
  note: text.optional(),
});
export type StepText = z.infer<typeof stepTextSchema>;

const bilingualLines = z.object({ en: lines, zh: lines });
const sections = z.array(z.tuple([z.string().max(200), z.string().max(6000)])).max(40);

export const workflowContentSchema = z.object({
  schema: z.literal(1),
  en: z.array(stepTextSchema).length(STEP_COUNT),
  zh: z.array(stepTextSchema).length(STEP_COUNT),
  /** Per team, per step number: actions that replace the shared ones in that team's view. */
  sharedActions: z.record(z.enum(WORKFLOW_TEAMS), z.record(z.string().regex(/^\d{1,2}$/), bilingualLines)),
  /** Per team: the "Role-specific instructions" sections at the end of its full SOP, [heading, body]. */
  extras: z.record(z.enum(WORKFLOW_TEAMS), z.object({ en: sections, zh: sections })),
  labelTemplateUrl: z.union([z.literal(""), z.url({ protocol: /^https?$/ })]),
});
export type WorkflowContent = z.infer<typeof workflowContentSchema>;

export interface WorkflowFile {
  id: string;
  scopeType: "step" | "team";
  scopeId: string;
  title: string;
  fileName: string;
  size: number;
}

export interface WorkflowData {
  content: WorkflowContent;
  /** 0 = nothing saved yet (showing the bundled default). */
  revision: number;
  updatedAt: string | null;
  updatedBy: string | null;
  files: WorkflowFile[];
  canEdit: boolean;
}

export function isValidScope(scopeType: string, scopeId: string): scopeType is "step" | "team" {
  if (scopeType === "step") return /^([1-9]|1[0-3])$/.test(scopeId);
  if (scopeType === "team") return (WORKFLOW_TEAMS as readonly string[]).includes(scopeId);
  return false;
}

export const fileDownloadUrl = (id: string) => `/api/npl-workflow/files/${id}`;

// ---- Which steps each team's SOP covers ----

export const TEAM_STEPS: Record<WorkflowTeam, number[]> = {
  supply: [1, 2, 3, 4, 5, 6, 8, 9, 13],
  ops: [4, 5, 7, 10, 11, 12, 13],
  visual: [4, 5, 6, 7, 9, 11, 13],
};

// ---- Diagram layout (SVG user units, viewBox 0 0 1800 1120) ----

export interface CardBox {
  id: number;
  lane: WorkflowTeam;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const CARDS: CardBox[] = [
  { id: 1, lane: "supply", x: 70, y: 193, w: 230, h: 64 },
  { id: 2, lane: "supply", x: 70, y: 286, w: 230, h: 64 },
  { id: 3, lane: "supply", x: 70, y: 379, w: 230, h: 64 },
  { id: 4, lane: "ops", x: 415, y: 555, w: 250, h: 72 },
  { id: 5, lane: "ops", x: 415, y: 655, w: 250, h: 94 },
  { id: 6, lane: "supply", x: 415, y: 193, w: 230, h: 64 },
  { id: 7, lane: "visual", x: 760, y: 922, w: 230, h: 64 },
  { id: 8, lane: "supply", x: 415, y: 286, w: 230, h: 90 },
  { id: 9, lane: "supply", x: 760, y: 286, w: 230, h: 64 },
  { id: 10, lane: "ops", x: 1095, y: 610, w: 230, h: 64 },
  { id: 11, lane: "visual", x: 1095, y: 922, w: 230, h: 64 },
  { id: 12, lane: "ops", x: 1430, y: 555, w: 245, h: 64 },
  { id: 13, lane: "ops", x: 1430, y: 660, w: 245, h: 64 },
];

/** [SVG path, dashed?] Solid = main handoff / completion; dashed = shared information. */
export const ARROWS: [string, boolean][] = [
  ["M185 257 L185 286", false],
  ["M185 350 L185 379", false],
  ["M300 411 L345 411 L345 225 L415 225", false],
  ["M185 443 L185 591 L415 591", false],
  ["M540 627 L540 655", false],
  ["M645 225 L690 225 L690 860 L875 860 L875 922", true],
  ["M530 257 L530 286", false],
  ["M415 702 L385 702 L385 326 L415 326", false],
  ["M645 326 L715 326 L715 318 L760 318", false],
  ["M990 318 L1040 318 L1040 642 L1095 642", false],
  ["M1210 674 L1210 922", false],
  ["M990 954 L1095 954", false],
  ["M1325 954 L1380 954 L1380 587 L1430 587", false],
  ["M1552 619 L1552 660", false],
  ["M990 350 L1015 350 L1015 860 L900 860 L900 922", true],
  ["M665 591 L705 591 L705 895 L760 895 L760 922", true],
];

export const PHASES: { x: number; w: number; name: Record<WorkflowLang, string>; weeks: Record<WorkflowLang, string> }[] = [
  { x: 50, w: 300, name: { en: "DECIDE", zh: "决定" }, weeks: { en: "Wk 1–4", zh: "第 1–4 周" } },
  { x: 395, w: 300, name: { en: "PREPARE & PRODUCE", zh: "准备与生产" }, weeks: { en: "Wk 4–8", zh: "第 4–8 周" } },
  { x: 740, w: 300, name: { en: "CREATE & SHIP", zh: "制作与运输" }, weeks: { en: "Wk 8–16", zh: "第 8–16 周" } },
  { x: 1085, w: 300, name: { en: "READY TO LAUNCH", zh: "准备上线" }, weeks: { en: "Wk 15–16", zh: "第 15–16 周" } },
  { x: 1415, w: 330, name: { en: "LAUNCH & LEARN", zh: "上线与复盘" }, weeks: { en: "Wk 16+", zh: "第 16+ 周" } },
];

export const LANES: { team: WorkflowTeam; y: number; h: number; labelX: number; name: Record<WorkflowLang, string>; note: Record<WorkflowLang, string> }[] = [
  {
    team: "supply",
    y: 160,
    h: 330,
    labelX: 1095,
    name: { en: "SUPPLY CHAIN", zh: "供应链" },
    note: { en: "Supplier, production, labels, QC and shipment", zh: "供应商、生产、标签、质检及发货" },
  },
  {
    team: "ops",
    y: 520,
    h: 270,
    labelX: 70,
    name: { en: "MARKET OPS", zh: "市场运营" },
    note: { en: "Product form: Supply Chain; listing and stock: Market Ops", zh: "产品表由供应链负责；商品信息和库存由市场运营负责" },
  },
  {
    team: "visual",
    y: 815,
    h: 260,
    labelX: 70,
    name: { en: "VISUAL", zh: "视觉团队" },
    note: { en: "Accurate images, video and PDP review", zh: "图片、视频及详情页审核" },
  },
];

export const TEAM_COLORS: Record<WorkflowTeam, { fill: string; stroke: string; badge: string }> = {
  supply: { fill: "#e9f2f7", stroke: "#4890b2", badge: "#3280a5" },
  ops: { fill: "#fff3dd", stroke: "#d59537", badge: "#cc8931" },
  visual: { fill: "#eeeafa", stroke: "#9074c6", badge: "#8466bd" },
};

// ---- Viewer labels ----
// The page has its own English / 中文 switch (defaulting to the portal language), and these labels
// follow that switch rather than the portal locale, so they live here instead of lib/i18n.

export const VIEW_LABELS = {
  en: {
    langName: "English",
    diagramTitle: "NEW PRODUCT LAUNCH WORKFLOW",
    introLead: "How to read:",
    intro:
      "solid arrows show the main handoff or required completion; dashed arrows show information shared across teams. Weeks are planning estimates from kickoff; sample or production delays extend the timeline.",
    team: "Team",
    allSteps: "All steps",
    viewFull: "View full {sop}",
    teamName: { supply: "Supply Chain", ops: "Market Ops", visual: "Visual Team" },
    teamSop: { supply: "Supply Chain SOP", ops: "Market Ops SOP", visual: "Visual Team SOP" },
    legendSolid: "Solid: main handoff / completion",
    legendDashed: "Dashed: shared information / parallel input",
    clickHint: "Click a numbered card to inspect the step",
    pickStep: "Click any step on the diagram for its owner, timing, actions and handoff.",
    step: "Step {n}",
    startWhen: "Start when",
    actions: "Actions",
    deliverable: "Deliverable",
    handoff: "Handoff",
    documents: "Documents",
    note: "Note",
    fullSop: "Full SOP",
    labelTemplate: "Open GTIN label template",
    processOwner: "Process owner:",
    startWhenColon: "Start when:",
    sharedDeliverable: "Shared deliverable:",
    handoffColon: "Handoff:",
    noteColon: "Note:",
    attachments: "Attachments",
    roleInstructions: "Role-specific instructions",
  },
  zh: {
    langName: "中文",
    diagramTitle: "新产品发布流程",
    introLead: "阅读说明：",
    intro: "实线表示主要交接或必须完成的工作；虚线表示团队间共享信息。周数是启动后的计划估算，样品或生产延误会影响时间。",
    team: "团队",
    allSteps: "全部流程",
    viewFull: "查看完整 {sop}",
    teamName: { supply: "供应链", ops: "市场运营", visual: "视觉团队" },
    teamSop: { supply: "供应链 SOP", ops: "市场运营 SOP", visual: "视觉团队 SOP" },
    legendSolid: "实线：主要交接／完成",
    legendDashed: "虚线：共享信息／并行工作",
    clickHint: "点击步骤查看详情",
    pickStep: "点击流程图中的任一步骤，查看负责人、时间、行动和交接。",
    step: "步骤 {n}",
    startWhen: "开始条件",
    actions: "行动",
    deliverable: "交付成果",
    handoff: "交接",
    documents: "文件",
    note: "备注",
    fullSop: "完整 SOP",
    labelTemplate: "打开 GTIN 标签模板",
    processOwner: "流程负责人：",
    startWhenColon: "开始条件：",
    sharedDeliverable: "共同交付成果：",
    handoffColon: "交接：",
    noteColon: "备注：",
    attachments: "附件",
    roleInstructions: "岗位补充说明",
  },
} as const satisfies Record<WorkflowLang, unknown>;

export type ViewLabels = (typeof VIEW_LABELS)[WorkflowLang];

/** Step text in the chosen language. Chinese titles are one line, so `title2` is dropped. */
export function stepIn(content: WorkflowContent, lang: WorkflowLang, id: number): StepText {
  const s = content[lang][id - 1];
  return lang === "zh" ? { ...s, title2: undefined } : s;
}

export function stepName(s: StepText): string {
  return s.title2 ? `${s.title} ${s.title2}` : s.title;
}

/** The actions a team sees for a step: its own list if it has one, else the shared list. */
export function teamActions(content: WorkflowContent, team: WorkflowTeam | null, lang: WorkflowLang, id: number): string[] {
  const own = team ? content.sharedActions[team]?.[String(id)]?.[lang] : undefined;
  return own && own.length ? own : stepIn(content, lang, id).actions;
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
