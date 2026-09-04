"use client";

import { MoreVertical, Pencil, Plus, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { CalendarSummary } from "@/lib/actions/calendar";

export function CalendarSidebar({
  calendars,
  selectedIds,
  onToggle,
  onCreateNew,
  onRename,
  onDelete,
  onManageAccess,
}: {
  calendars: CalendarSummary[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onCreateNew: () => void;
  onRename: (cal: CalendarSummary) => void;
  onDelete: (cal: CalendarSummary) => void;
  onManageAccess: (cal: CalendarSummary) => void;
}) {
  return (
    <div className="flex w-64 shrink-0 flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">My Calendars</h3>
        <Button size="icon-sm" variant="outline" onClick={onCreateNew} title="New calendar">
          <Plus />
        </Button>
      </div>

      {calendars.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No calendars yet — create one to start pinning tasks.
        </p>
      ) : (
        <ul className="space-y-1">
          {calendars.map((cal) => (
            <li
              key={cal.id}
              className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent"
            >
              <Checkbox
                checked={selectedIds.has(cal.id)}
                onCheckedChange={() => onToggle(cal.id)}
              />
              <span className="min-w-0 flex-1 truncate text-sm text-foreground">{cal.name}</span>
              {cal.myRole !== "owner" && (
                <Badge variant="secondary" className="shrink-0 text-[10px]">
                  {cal.myRole === "editor" ? "Shared · Editor" : "Shared · View"}
                </Badge>
              )}
              {cal.myRole === "owner" && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        className="shrink-0 opacity-0 group-hover:opacity-100"
                      />
                    }
                  >
                    <MoreVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onManageAccess(cal)}>
                      <Share2 />
                      Manage access
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onRename(cal)}>
                      <Pencil />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => onDelete(cal)}>
                      <Trash2 />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
