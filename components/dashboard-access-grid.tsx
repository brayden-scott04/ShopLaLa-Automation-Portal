"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, Eye, EyeOff, GripVertical, RotateCcw } from "lucide-react";
import { NAV_GROUPS, type NavItem } from "@/lib/nav";
import { cn } from "@/lib/utils";

interface AccessItem extends NavItem {
  group: string;
  colorVar: string;
}

interface Layout {
  order: string[];
  hidden: string[];
}

const EMPTY_LAYOUT = "{}";

// Layout lives in localStorage per username (same approach as the sidebar's
// fold state). `memoryLayouts` keeps edits working when storage is blocked.
const layoutListeners = new Set<() => void>();
const memoryLayouts = new Map<string, string>();

function layoutKey(username: string): string {
  return `dashboard-layout:${username}`;
}

function readLayout(username: string): string {
  try {
    return localStorage.getItem(layoutKey(username)) ?? EMPTY_LAYOUT;
  } catch {
    return memoryLayouts.get(username) ?? EMPTY_LAYOUT;
  }
}

function writeLayout(username: string, next: Layout | null) {
  const raw = next ? JSON.stringify(next) : EMPTY_LAYOUT;
  memoryLayouts.set(username, raw);
  try {
    if (next) localStorage.setItem(layoutKey(username), raw);
    else localStorage.removeItem(layoutKey(username));
  } catch {
    // Private window / blocked storage: layout just won't persist.
  }
  layoutListeners.forEach((listener) => listener());
}

function parseLayout(raw: string): Layout {
  try {
    const parsed = JSON.parse(raw);
    return {
      order: Array.isArray(parsed?.order) ? parsed.order : [],
      hidden: Array.isArray(parsed?.hidden) ? parsed.hidden : [],
    };
  } catch {
    return { order: [], hidden: [] };
  }
}

function subscribe(listener: () => void) {
  layoutListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    layoutListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/**
 * "Your access" tiles on the dashboard. Staff can drag tiles to reorder them
 * and hide the ones they don't use; hidden tiles collect in a fold below.
 * Takes hrefs (not NavItems) because icons can't cross the server boundary.
 */
export function DashboardAccessGrid({
  username,
  hrefs,
  fullAccess,
}: {
  username: string;
  hrefs: string[];
  fullAccess: boolean;
}) {
  const raw = useSyncExternalStore(
    subscribe,
    () => readLayout(username),
    () => EMPTY_LAYOUT
  );
  const layout = useMemo(() => parseLayout(raw), [raw]);
  const [showHidden, setShowHidden] = useState(false);

  const items = useMemo(() => {
    const allowed = new Set(hrefs);
    const byHref = new Map<string, AccessItem>();
    for (const group of NAV_GROUPS) {
      for (const item of group.items) {
        if (allowed.has(item.href)) {
          byHref.set(item.href, { ...item, group: group.label, colorVar: group.colorVar });
        }
      }
    }
    // Saved order first, then anything new (e.g. freshly granted access) in nav order.
    const ordered = layout.order.filter((href) => byHref.has(href));
    const rest = hrefs.filter((href) => byHref.has(href) && !ordered.includes(href));
    return [...ordered, ...rest].map((href) => byHref.get(href)!);
  }, [hrefs, layout.order]);

  const hiddenSet = useMemo(() => new Set(layout.hidden), [layout.hidden]);
  const visible = items.filter((item) => !hiddenSet.has(item.href));
  const hidden = items.filter((item) => hiddenSet.has(item.href));
  const isCustomised = layout.order.length > 0 || layout.hidden.length > 0;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function save(order: string[], hiddenHrefs: string[]) {
    writeLayout(username, { order, hidden: hiddenHrefs });
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const order = items.map((item) => item.href);
    const from = order.indexOf(String(active.id));
    const to = order.indexOf(String(over.id));
    if (from === -1 || to === -1) return;
    save(arrayMove(order, from, to), layout.hidden);
  }

  function toggleHidden(href: string) {
    const order = items.map((item) => item.href);
    const next = hiddenSet.has(href)
      ? layout.hidden.filter((h) => h !== href)
      : [...layout.hidden, href];
    save(order, next);
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">Your access</h3>
        <div className="flex items-center gap-3">
          {isCustomised && (
            <button
              type="button"
              onClick={() => writeLayout(username, null)}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-3" />
              Reset layout
            </button>
          )}
          {fullAccess && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              Full access
            </span>
          )}
        </div>
      </div>

      {visible.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={visible.map((item) => item.href)} strategy={rectSortingStrategy}>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((item) => (
                <SortableTile key={item.href} item={item} onToggleHidden={toggleHidden} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          All your shortcuts are hidden. Show them again below.
        </p>
      )}

      {hidden.length > 0 && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowHidden((open) => !open)}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ChevronDown className={cn("size-3.5 transition-transform", !showHidden && "-rotate-90")} />
            Hidden ({hidden.length})
          </button>
          {showHidden && (
            <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {hidden.map((item) => (
                <TileBody key={item.href} item={item} muted>
                  <IconButton label={`Show ${item.name}`} onClick={() => toggleHidden(item.href)}>
                    <Eye className="size-4" />
                  </IconButton>
                </TileBody>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function SortableTile({
  item,
  onToggleHidden,
}: {
  item: AccessItem;
  onToggleHidden: (href: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.href });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("relative", isDragging && "z-10 opacity-80 shadow-lg")}
    >
      <TileBody item={item}>
        <IconButton label={`Hide ${item.name}`} onClick={() => onToggleHidden(item.href)}>
          <EyeOff className="size-4" />
        </IconButton>
        <button
          ref={setActivatorNodeRef}
          type="button"
          aria-label={`Move ${item.name}`}
          className="flex size-7 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
      </TileBody>
    </div>
  );
}

function TileBody({
  item,
  muted,
  children,
}: {
  item: AccessItem;
  muted?: boolean;
  children: React.ReactNode;
}) {
  const Icon = item.icon;
  return (
    <div
      className={cn(
        "group relative flex items-center rounded-lg border border-border bg-background transition-colors hover:bg-accent",
        muted && "border-dashed opacity-60"
      )}
    >
      <Link href={item.href} className="flex min-w-0 flex-1 items-center gap-3 p-4">
        <Icon className="size-5 shrink-0 text-muted-foreground" />
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-foreground">{item.name}</span>
          <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
            <span
              aria-hidden
              className="size-1.5 rounded-[2px]"
              style={{ backgroundColor: `var(${item.colorVar})` }}
            />
            {item.group}
          </span>
        </span>
      </Link>
      {/* Controls show on hover/focus on desktop; always visible on touch screens. */}
      <div
        className={cn(
          "flex shrink-0 items-center gap-0.5 pr-2 transition-opacity",
          !muted && "md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
        )}
      >
        {children}
      </div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-foreground"
    >
      {children}
    </button>
  );
}
