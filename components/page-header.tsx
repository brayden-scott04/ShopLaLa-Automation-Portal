import type { LucideIcon } from "lucide-react";
import { NavText } from "@/lib/i18n/nav";

/**
 * Pages pass already-translated text, or a nav item's English name/description
 * (title={item.name}), which <NavText> translates from the nav dictionary.
 */
export function PageHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-6 p-6 md:p-8">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent">
        <Icon className="size-5 text-primary" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          <NavText text={title} />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          <NavText text={description} />
        </p>
      </div>
    </div>
  );
}
