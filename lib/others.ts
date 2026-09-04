import type { LucideIcon } from "lucide-react";
import { CalendarDays } from "lucide-react";

export interface OtherItem {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

interface OtherItemInput {
  name: string;
  description: string;
  icon: LucideIcon;
  href?: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function defineOtherItem(input: OtherItemInput): OtherItem {
  const id = slugify(input.name);
  return { ...input, id, href: input.href ?? `/others/${id}` };
}

/**
 * Add a new "Others" item as a named `defineOtherItem(...)` export below, then
 * include it in the `othersItems` array (sidebar and dashboard read from that
 * list, so they stay in sync automatically). Finally, create
 * app/(portal)/others/<id>/page.tsx yourself, plus a layout.tsx calling
 * assertItemAccess("others", "<id>") — that guard is what stops a direct URL
 * visit, not the hidden sidebar link.
 */
export const calendar = defineOtherItem({
  name: "Calendar",
  description: "Personal calendars for tasks, deadlines, and reminders",
  icon: CalendarDays,
});

export const othersItems: OtherItem[] = [calendar];
