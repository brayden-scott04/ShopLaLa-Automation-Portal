"use client";

import { useEffect, useMemo, useSyncExternalStore, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  LayoutGrid,
  Pin as PinIcon,
  PinOff,
  Sparkles,
  Users,
  Users2,
} from "lucide-react";
import {
  NAV_GROUPS,
  SUBGROUP_LABELS,
  type NavGroup,
  type NavItem,
  type NavSubgroup,
} from "@/lib/nav";
import { cn } from "@/lib/utils";
import { CHAT_ENABLED } from "@/lib/features";
import { UserMenu } from "@/components/user-menu";
import { Separator } from "@/components/ui/separator";
import {
  type Role,
  type PermissionSet,
  ROLE_LABELS,
  canManageUsers,
  filterItems,
} from "@/lib/roles";

const FOLD_KEY = "sidebar-folded";

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Fold key for a Layer-1 group, or for a subgroup nested inside one. */
function foldKey(group: NavGroup, subgroup?: NavSubgroup): string {
  return subgroup ? `${group.section}/${subgroup}` : group.section;
}

// Fold state lives in localStorage (shared by the desktop sidebar and the
// mobile sheet). `memoryFolds` keeps toggling working when storage is blocked.
const foldListeners = new Set<() => void>();
let memoryFolds = "{}";

function readFolds(): string {
  try {
    return localStorage.getItem(FOLD_KEY) ?? "{}";
  } catch {
    return memoryFolds;
  }
}

function writeFolds(next: Record<string, boolean>) {
  memoryFolds = JSON.stringify(next);
  try {
    localStorage.setItem(FOLD_KEY, memoryFolds);
  } catch {
    // Private window / blocked storage: state just won't persist.
  }
  foldListeners.forEach((listener) => listener());
}

function parseFolds(raw: string): Record<string, boolean> {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function subscribeFolds(listener: () => void) {
  foldListeners.add(listener);
  return () => {
    foldListeners.delete(listener);
  };
}

/**
 * Which groups/subgroups are folded, persisted per browser. Everything starts
 * open, and navigating to a page unfolds whatever contains it.
 */
function useFoldState(
  pathname: string
): [Record<string, boolean>, (key: string, value: boolean) => void] {
  const raw = useSyncExternalStore(subscribeFolds, readFolds, () => "{}");
  const folded = useMemo(() => parseFolds(raw), [raw]);

  useEffect(() => {
    const group = NAV_GROUPS.find((g) => g.items.some((item) => isActive(pathname, item.href)));
    if (!group) return;
    const active = group.items.find((item) => isActive(pathname, item.href))!;
    const keys = [foldKey(group)];
    if (active.subgroup) keys.push(foldKey(group, active.subgroup));
    const current = parseFolds(readFolds());
    if (!keys.some((k) => current[k])) return;
    for (const k of keys) current[k] = false;
    writeFolds(current);
  }, [pathname]);

  function setFolded(key: string, value: boolean) {
    writeFolds({ ...parseFolds(readFolds()), [key]: value });
  }

  return [folded, setFolded];
}

// Pinned pages (hrefs, in pin order) live in localStorage per username, the
// same way as the fold state and the dashboard layout.
const pinListeners = new Set<() => void>();
const memoryPins = new Map<string, string>();

function pinsKey(username: string): string {
  return `sidebar-pins:${username}`;
}

function readPins(username: string): string {
  try {
    return localStorage.getItem(pinsKey(username)) ?? "[]";
  } catch {
    return memoryPins.get(username) ?? "[]";
  }
}

function writePins(username: string, next: string[]) {
  const raw = JSON.stringify(next);
  memoryPins.set(username, raw);
  try {
    localStorage.setItem(pinsKey(username), raw);
  } catch {
    // Private window / blocked storage: pins just won't persist.
  }
  pinListeners.forEach((listener) => listener());
}

function parsePins(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function subscribePins(listener: () => void) {
  pinListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    pinListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function usePins(username: string): [string[], (href: string) => void] {
  const raw = useSyncExternalStore(subscribePins, () => readPins(username), () => "[]");
  const pins = useMemo(() => parsePins(raw), [raw]);

  function togglePin(href: string) {
    const current = parsePins(readPins(username));
    writePins(
      username,
      current.includes(href) ? current.filter((h) => h !== href) : [...current, href]
    );
  }

  return [pins, togglePin];
}

/** Up to two initials, shown in place of an item when the sidebar is collapsed. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/** The group's pin: a small colour tile with a soft halo of the same colour. */
function Pin({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-2 shrink-0 rounded-[3px] bg-[var(--pin)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--pin)_20%,transparent)]",
        className
      )}
    />
  );
}

/** A Layer-1 group: pin header, then its Layer-2 pages along a coloured rail. */
function NavGroupSection({
  group,
  pathname,
  collapsed,
  folded,
  onToggle,
  pinnedHrefs,
  onPin,
}: {
  group: NavGroup;
  pathname: string;
  collapsed: boolean;
  folded: Record<string, boolean>;
  onToggle: (key: string) => void;
  pinnedHrefs: Set<string>;
  onPin: (href: string) => void;
}) {
  const style = { "--pin": `var(${group.colorVar})` } as CSSProperties;

  if (collapsed) {
    return (
      <div style={style} className="flex flex-col items-center gap-1 pt-3" title={group.label}>
        <Pin className="mb-1" />
        {group.items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            title={item.subgroup ? `${SUBGROUP_LABELS[item.subgroup]} › ${item.name}` : item.name}
            className={cn(
              "flex size-8 items-center justify-center rounded-md text-[10px] font-semibold tracking-wide text-muted-foreground hover:bg-accent hover:text-foreground",
              isActive(pathname, item.href) &&
                "bg-accent text-foreground ring-1 ring-[color-mix(in_srgb,var(--pin)_60%,transparent)]"
            )}
          >
            {initials(item.name)}
          </Link>
        ))}
      </div>
    );
  }

  const groupKey = foldKey(group);
  const isFolded = folded[groupKey] ?? false;
  const topItems = group.items.filter((item) => !item.subgroup);
  const subgroups = [...new Set(group.items.flatMap((item) => item.subgroup ?? []))];

  return (
    <div style={style} className="pt-3">
      <button
        type="button"
        onClick={() => onToggle(groupKey)}
        aria-expanded={!isFolded}
        className="group/pin flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-left"
      >
        <Pin className="transition-transform group-hover/pin:scale-110" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/80 group-hover/pin:text-foreground">
          {group.label}
        </span>
        <span
          aria-hidden
          className="h-px flex-1 bg-gradient-to-r from-[color-mix(in_srgb,var(--pin)_45%,transparent)] to-transparent"
        />
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground/70 transition-transform group-hover/pin:text-foreground",
            isFolded && "-rotate-90"
          )}
        />
      </button>

      {!isFolded && (
        <div className="mt-0.5 ml-[15px] border-l border-[color-mix(in_srgb,var(--pin)_30%,transparent)]">
          {topItems.map((item) => (
            <NavLeaf
              key={item.id}
              item={item}
              active={isActive(pathname, item.href)}
              pinned={pinnedHrefs.has(item.href)}
              onPin={() => onPin(item.href)}
            />
          ))}
          {subgroups.map((subgroup) => {
            const key = foldKey(group, subgroup);
            const subFolded = folded[key] ?? false;
            return (
              <div key={subgroup}>
                <button
                  type="button"
                  onClick={() => onToggle(key)}
                  aria-expanded={!subFolded}
                  className="flex w-full items-center gap-1.5 rounded-r-md py-1.5 pr-2 pl-3.5 text-left text-sm text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                >
                  <span className="flex-1 truncate">{SUBGROUP_LABELS[subgroup]}</span>
                  <ChevronDown
                    className={cn("size-3.5 shrink-0 transition-transform", subFolded && "-rotate-90")}
                  />
                </button>
                {!subFolded && (
                  <div className="mb-1 ml-3.5 border-l border-dashed border-[color-mix(in_srgb,var(--pin)_30%,transparent)]">
                    {group.items
                      .filter((item) => item.subgroup === subgroup)
                      .map((item) => (
                        <NavLeaf
                          key={item.id}
                          item={item}
                          active={isActive(pathname, item.href)}
                          pinned={pinnedHrefs.has(item.href)}
                          onPin={() => onPin(item.href)}
                        />
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Hover-revealed pin / unpin button that sits over the right edge of a nav link. */
function PinToggle({ pinned, name, onClick }: { pinned: boolean; name: string; onClick: () => void }) {
  const Icon = pinned ? PinOff : PinIcon;
  const label = pinned ? `Unpin ${name}` : `Pin ${name} to top`;
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="absolute top-1/2 right-1 -translate-y-1/2 rounded p-1 text-muted-foreground opacity-0 group-hover/leaf:opacity-100 hover:bg-background hover:text-foreground focus-visible:opacity-100"
    >
      <Icon className="size-3.5" />
    </button>
  );
}

/** A Layer-2 page link. The active one lights up its stretch of the rail. */
function NavLeaf({
  item,
  active,
  pinned,
  onPin,
}: {
  item: NavItem;
  active: boolean;
  pinned: boolean;
  onPin: () => void;
}) {
  return (
    <div className="group/leaf relative">
      <Link
        href={item.href}
        className={cn(
          "-ml-px block truncate rounded-r-md border-l-2 border-transparent py-1.5 pr-7 pl-3.5 text-sm text-muted-foreground hover:bg-accent/60 hover:text-foreground",
          active && "border-[var(--pin)] bg-accent font-medium text-foreground hover:bg-accent"
        )}
      >
        {item.name}
      </Link>
      <PinToggle pinned={pinned} name={item.name} onClick={onPin} />
    </div>
  );
}

/** Pinned pages, listed under Dashboard / Chat / Team, each tagged with its group's colour. */
function PinnedSection({
  items,
  pathname,
  collapsed,
  onUnpin,
}: {
  items: (NavItem & { colorVar: string })[];
  pathname: string;
  collapsed: boolean;
  onUnpin: (href: string) => void;
}) {
  if (items.length === 0) return null;

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-1 pt-3" title="Pinned">
        <PinIcon className="mb-1 size-3 text-muted-foreground" />
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={item.name}
            style={{ "--pin": `var(${item.colorVar})` } as CSSProperties}
            className={cn(
              "flex size-8 items-center justify-center rounded-md text-[10px] font-semibold tracking-wide text-muted-foreground hover:bg-accent hover:text-foreground",
              isActive(pathname, item.href) &&
                "bg-accent text-foreground ring-1 ring-[color-mix(in_srgb,var(--pin)_60%,transparent)]"
            )}
          >
            {initials(item.name)}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="pt-3">
      <div className="flex items-center gap-2.5 px-3 py-1.5">
        <PinIcon className="size-3 shrink-0 text-muted-foreground" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/80">
          Pinned
        </span>
        <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
      </div>
      <div className="mt-0.5 space-y-px">
        {items.map((item) => (
          <div
            key={item.href}
            style={{ "--pin": `var(${item.colorVar})` } as CSSProperties}
            className="group/leaf relative"
          >
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md py-1.5 pr-7 pl-3 text-sm text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                isActive(pathname, item.href) && "bg-accent font-medium text-foreground hover:bg-accent"
              )}
            >
              <Pin />
              <span className="truncate">{item.name}</span>
            </Link>
            <PinToggle pinned name={item.name} onClick={() => onUnpin(item.href)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SidebarContent({
  username,
  role,
  permissions,
  collapsed = false,
  onToggleCollapse,
}: {
  username: string;
  role: Role;
  permissions: PermissionSet;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const pathname = usePathname();
  const [folded, setFolded] = useFoldState(pathname);
  const [pins, togglePin] = usePins(username);

  const allowedGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: filterItems(group.section, group.items, role, permissions),
  }));

  // Pins the user no longer has access to simply don't show (they're kept in
  // storage, so they come back if access is restored).
  const allowedByHref = new Map(
    allowedGroups.flatMap((group) =>
      group.items.map((item) => [item.href, { ...item, colorVar: group.colorVar }] as const)
    )
  );
  const pinnedItems = pins.flatMap((href) => allowedByHref.get(href) ?? []);
  const pinnedHrefs = new Set(pinnedItems.map((item) => item.href));

  // Pinning is a quick link: the page also stays where it is in its group.
  const visibleGroups = allowedGroups.filter((group) => group.items.length > 0);

  return (
    <div className="flex h-full w-full flex-col">
      <div
        className={cn(
          "flex items-center gap-2 p-6",
          collapsed && "justify-center p-3"
        )}
      >
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              ShopLaLa
              <sup className="ml-0.5 text-[10px] font-normal">&reg;</sup>
            </h1>
            <p className="text-xs text-muted-foreground">Automation Portal</p>
          </div>
        )}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            {collapsed ? (
              <ChevronsRight className="size-4" />
            ) : (
              <ChevronsLeft className="size-4" />
            )}
          </button>
        )}
      </div>

      <nav
        className={cn(
          "min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-3",
          collapsed && "px-2"
        )}
      >
        <Link
          href="/dashboard"
          title={collapsed ? "Dashboard" : undefined}
          className={cn(
            "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent",
            collapsed && "justify-center px-2",
            pathname === "/dashboard" && "bg-accent text-primary"
          )}
        >
          <LayoutGrid className="size-4 shrink-0" />
          {!collapsed && "Dashboard"}
        </Link>

        {CHAT_ENABLED && (
          <Link
            href="/chat"
            title={collapsed ? "Chat" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent",
              collapsed && "justify-center px-2",
              pathname === "/chat" && "bg-accent text-primary"
            )}
          >
            <Sparkles className="size-4 shrink-0" />
            {!collapsed && "Chat"}
          </Link>
        )}

        <Link
          href="/team"
          title={collapsed ? "Team" : undefined}
          className={cn(
            "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent",
            collapsed && "justify-center px-2",
            pathname === "/team" && "bg-accent text-primary"
          )}
        >
          <Users2 className="size-4 shrink-0" />
          {!collapsed && "Team"}
        </Link>

        <PinnedSection
          items={pinnedItems}
          pathname={pathname}
          collapsed={collapsed}
          onUnpin={togglePin}
        />

        {visibleGroups.map((group) => (
          <NavGroupSection
            key={group.section}
            group={group}
            pathname={pathname}
            collapsed={collapsed}
            folded={folded}
            onToggle={(key) => setFolded(key, !folded[key])}
            pinnedHrefs={pinnedHrefs}
            onPin={togglePin}
          />
        ))}
      </nav>

      {canManageUsers(role) && (
        <div className={cn("px-3 pb-2", collapsed && "px-2")}>
          {collapsed ? (
            <Separator className="my-2" />
          ) : (
            <p className="px-3 pt-4 pb-1 text-xs font-medium text-muted-foreground">
              {ROLE_LABELS[role]}
            </p>
          )}
          <Link
            href="/admin/users"
            title={collapsed ? "Manage Users" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent",
              collapsed && "justify-center px-2",
              pathname === "/admin/users" && "bg-accent text-primary"
            )}
          >
            <Users className="size-4 shrink-0" />
            {!collapsed && <span className="flex-1 truncate">Manage Users</span>}
          </Link>
        </div>
      )}

      <div
        className={cn(
          "mt-auto shrink-0 border-t border-border p-3 pb-4",
          collapsed && "px-2"
        )}
      >
        <UserMenu username={username} collapsed={collapsed} />
      </div>
    </div>
  );
}
