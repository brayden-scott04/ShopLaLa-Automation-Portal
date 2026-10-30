"use client";

// Translated views of the nav registry (lib/nav.ts). Names and descriptions stay in English in
// lib/nav.ts (the permission model and URLs key off them); the dictionary's nav.* keys, by group
// section and item id, supply the displayed text, falling back to the English when a key is missing.
import { useMemo } from "react";
import { NAV_GROUPS, SUBGROUP_LABELS, type NavGroup, type NavItem, type NavSubgroup } from "@/lib/nav";
import { useT } from "@/lib/i18n/client";
import type { Translator } from "@/lib/i18n/translate";

export function localizeNavItem<T extends NavItem>(item: T, t: Translator): T {
  return {
    ...item,
    name: t.dynamic(`nav.items.${item.id}.name`, item.name),
    description: t.dynamic(`nav.items.${item.id}.description`, item.description),
  };
}

export function localizeNavGroup(group: NavGroup, t: Translator): NavGroup {
  return {
    ...group,
    label: t.dynamic(`nav.groups.${group.section}`, group.label),
    items: group.items.map((item) => localizeNavItem(item, t)),
  };
}

/** NAV_GROUPS with every label in the current language. */
export function useLocalizedNav(): NavGroup[] {
  const t = useT();
  return useMemo(() => NAV_GROUPS.map((group) => localizeNavGroup(group, t)), [t]);
}

export function useSubgroupLabel(): (subgroup: NavSubgroup) => string {
  const t = useT();
  return (subgroup) => t.dynamic(`nav.subgroups.${subgroup}`, SUBGROUP_LABELS[subgroup]);
}

// English nav text → its dictionary key, so <NavText> can translate the plain strings pages
// already pass to <PageHeader> (title={item.name}) without every page changing.
const NAV_TEXT_KEYS = new Map<string, string>(
  NAV_GROUPS.flatMap((group) => [
    [group.label, `nav.groups.${group.section}`] as const,
    ...group.items.flatMap((item) => [
      [item.name, `nav.items.${item.id}.name`] as const,
      [item.description, `nav.items.${item.id}.description`] as const,
    ]),
  ]),
);

/** Renders `text` translated if it is a nav name/description/group label, else unchanged. */
export function NavText({ text }: { text: string }) {
  const t = useT();
  const key = NAV_TEXT_KEYS.get(text);
  return <>{key ? t.dynamic(key, text) : text}</>;
}
