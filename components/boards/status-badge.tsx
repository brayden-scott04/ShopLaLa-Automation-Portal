import { cn } from "@/lib/utils";
import { swatchFor } from "@/lib/boards-constants";
import type { StatusOption } from "@/lib/actions/boards";

export function StatusBadge({
  optionKey,
  options,
}: {
  optionKey: string | null | undefined;
  options: StatusOption[];
}) {
  if (!optionKey) return <span className="text-xs text-muted-foreground">—</span>;

  const option = options.find((o) => o.key === optionKey);
  if (!option) return <span className="text-xs text-muted-foreground">{optionKey}</span>;

  const swatch = swatchFor(option.color);
  return (
    <span
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center gap-1.5 rounded-full px-2 text-xs font-medium whitespace-nowrap",
        swatch.chip
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", swatch.dot)} />
      {option.label}
    </span>
  );
}
