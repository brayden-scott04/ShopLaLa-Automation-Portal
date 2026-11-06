"use client";

import { useId } from "react";
import {
  ARROWS,
  CARDS,
  LANES,
  PHASES,
  TEAM_COLORS,
  TEAM_STEPS,
  stepIn,
  stepName,
  type ViewLabels,
  type WorkflowContent,
  type WorkflowLang,
  type WorkflowTeam,
} from "@/lib/npl-workflow/constants";
import { cn } from "@/lib/utils";

// The swim-lane diagram: five phases across, three team lanes down, 13 numbered cards. Geometry is
// fixed in lib/npl-workflow/constants.ts; only the text comes from the saved content. It keeps the
// original draft's light palette in dark mode too, like an embedded drawing.

const ARROW = "#526b7c";
const ARROW_INFO = "#8b9dac";

export function WorkflowDiagram({
  content,
  lang,
  labels,
  selected,
  team,
  onSelect,
}: {
  content: WorkflowContent;
  lang: WorkflowLang;
  labels: ViewLabels;
  selected: number | null;
  team: WorkflowTeam | null;
  onSelect: (id: number) => void;
}) {
  // Marker/filter ids must be unique in the document; useId's punctuation isn't valid in url(#…).
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const arrowId = `npl-arrow-${uid}`;
  const arrowInfoId = `npl-arrow-info-${uid}`;
  const shadowId = `npl-shadow-${uid}`;

  return (
    <svg
      viewBox="0 0 1800 1120"
      role="img"
      aria-label={labels.diagramTitle}
      className="block h-full min-h-[780px] w-full min-w-[1250px]"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <defs>
        <marker id={arrowId} markerWidth={9} markerHeight={9} refX={8} refY={4.5} orient="auto">
          <path d="M0 0 L9 4.5 L0 9 Z" fill={ARROW} />
        </marker>
        <marker id={arrowInfoId} markerWidth={9} markerHeight={9} refX={8} refY={4.5} orient="auto">
          <path d="M0 0 L9 4.5 L0 9 Z" fill={ARROW_INFO} />
        </marker>
        <filter id={shadowId} x="-10%" y="-20%" width="125%" height="150%">
          <feDropShadow dx={0} dy={2} stdDeviation={2} floodColor="#173047" floodOpacity={0.1} />
        </filter>
      </defs>

      <text x={50} y={27} fontSize={17} fontWeight="bold" fill="#1d465e">
        {labels.diagramTitle}
      </text>

      {PHASES.map((p) => (
        <g key={p.x}>
          <rect x={p.x} y={45} width={p.w} height={75} rx={8} fill="#e8eff5" />
          <text x={p.x + 18} y={75} fontSize={17} fontWeight="bold" fill="#1d465e">
            {p.name[lang]}
          </text>
          <text x={p.x + 18} y={100} fontSize={13} fill="#587184">
            {p.weeks[lang]}
          </text>
        </g>
      ))}

      {LANES.map((l) => (
        <g key={l.team}>
          <rect x={50} y={l.y} width={1695} height={l.h} rx={10} fill="#f7f9fb" stroke="#e6edf2" />
          <text x={l.labelX} y={l.y + 27} fontSize={16} fontWeight="bold" fill="#426077">
            {l.name[lang]}
          </text>
          <text x={l.labelX} y={l.y + 48} fontSize={12} fill="#687f8e">
            {l.note[lang]}
          </text>
        </g>
      ))}

      {ARROWS.map(([d, info]) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke={info ? ARROW_INFO : ARROW}
          strokeWidth={info ? 2 : 2.5}
          strokeDasharray={info ? "7 6" : undefined}
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd={`url(#${info ? arrowInfoId : arrowId})`}
        />
      ))}

      {CARDS.map((c) => {
        const s = stepIn(content, lang, c.id);
        const colors = TEAM_COLORS[c.lane];
        const included = !team || TEAM_STEPS[team].includes(c.id);
        const emphasised = selected === c.id || (!!team && included);
        return (
          <g
            key={c.id}
            role="button"
            tabIndex={0}
            aria-label={`${labels.step.replace("{n}", String(c.id))}: ${stepName(s)}`}
            aria-pressed={selected === c.id}
            className={cn("group cursor-pointer outline-none transition-opacity", !included && "opacity-[0.22]")}
            onClick={() => onSelect(c.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(c.id);
              }
            }}
          >
            <rect
              x={c.x}
              y={c.y}
              width={c.w}
              height={c.h}
              rx={10}
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth={emphasised ? 4 : 2}
              filter={`url(#${shadowId})`}
              className="group-hover:[stroke-width:4] group-focus-visible:[stroke-width:4]"
            />
            <circle cx={c.x + 27} cy={c.y + 23} r={16} fill={colors.badge} />
            <text x={c.x + 27} y={c.y + 28} fontSize={14} fontWeight="bold" fill="#fff" textAnchor="middle">
              {c.id}
            </text>
            <text x={c.x + 52} y={c.y + 28} fontSize={17} fontWeight="bold" fill="#183448">
              {s.title}
            </text>
            {s.title2 && (
              <text x={c.x + 52} y={c.y + 50} fontSize={17} fontWeight="bold" fill="#183448">
                {s.title2}
              </text>
            )}
            <text x={c.x + 52} y={c.y + (s.title2 ? 77 : 50)} fontSize={12} fill="#577080">
              {s.sub}
            </text>
          </g>
        );
      })}

      <text x={75} y={1100} fontSize={13} fill="#466376">
        {labels.legendSolid}
      </text>
      <path
        d="M315 1094 L365 1094"
        fill="none"
        stroke={ARROW}
        strokeWidth={2.5}
        strokeLinecap="round"
        markerEnd={`url(#${arrowId})`}
      />
      <text x={390} y={1100} fontSize={13} fill="#466376">
        {labels.legendDashed}
      </text>
      <path
        d="M695 1094 L745 1094"
        fill="none"
        stroke={ARROW_INFO}
        strokeWidth={2}
        strokeDasharray="7 6"
        strokeLinecap="round"
        markerEnd={`url(#${arrowInfoId})`}
      />
      <text x={770} y={1100} fontSize={13} fill="#627c8d">
        {labels.clickHint}
      </text>
    </svg>
  );
}
