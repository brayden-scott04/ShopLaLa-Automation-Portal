"use client";

import { useRouter } from "next/navigation";
import {
  BellRing,
  CalendarClock,
  CalendarMinus,
  CalendarPlus,
  CalendarX,
  CheckCheck,
  CheckCircle2,
  ListChecks,
  ListPlus,
  ListX,
  MessageSquare,
  UserMinus,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/client";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/actions/notifications";
import { isPingKind, type NotificationKind, type PortalNotification } from "@/lib/notifications-constants";
import { announceNotificationsChanged, useNotifications } from "./use-notifications";
import { useNotificationText, useRelativeTime } from "./notification-text";

const ICONS: Record<NotificationKind, LucideIcon> = {
  cal_assigned: CalendarPlus,
  cal_unassigned: CalendarMinus,
  cal_updated: CalendarClock,
  cal_deleted: CalendarX,
  cal_ping: BellRing,
  task_assigned: ListPlus,
  task_unassigned: UserMinus,
  task_updated: ListChecks,
  task_progress: MessageSquare,
  task_done: CheckCircle2,
  task_ack: CheckCheck,
  task_deleted: ListX,
  task_ping: BellRing,
};

export function NotificationsPanel({ className }: { className?: string }) {
  const t = useT();
  const router = useRouter();
  const { items, unread, error, update } = useNotifications();
  const text = useNotificationText();
  const relative = useRelativeTime();

  function markRead(n: PortalNotification) {
    if (n.readAt) return;
    const now = new Date().toISOString();
    update((list) => list.map((x) => (x.id === n.id ? { ...x, readAt: now } : x)));
    markNotificationRead(n.id).then(announceNotificationsChanged);
  }

  function open(n: PortalNotification) {
    markRead(n);
    if (n.link) router.push(n.link);
  }

  function markAll() {
    const now = new Date().toISOString();
    update((list) => list.map((x) => (x.readAt ? x : { ...x, readAt: now })));
    markAllNotificationsRead().then(announceNotificationsChanged);
  }

  return (
    <section className={cn("flex min-h-0 flex-col rounded-xl border border-border bg-card", className)}>
      <header className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">{t("notifications.title")}</h3>
          {unread > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
              {t("notifications.unread", { count: unread })}
            </span>
          )}
        </div>
        {unread > 0 && (
          <Button size="sm" variant="ghost" onClick={markAll}>
            <CheckCheck />
            {t("notifications.markAllRead")}
          </Button>
        )}
      </header>

      <div className="max-h-[30rem] min-h-0 flex-1 overflow-y-auto">
        {items === null ? (
          error ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">{t("notifications.loadError")}</p>
          ) : (
            <div className="space-y-3 p-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )
        ) : items.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">{t("notifications.empty")}</p>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((n) => {
              const Icon = ICONS[n.kind] ?? ListChecks;
              const ping = isPingKind(n.kind);
              const unreadItem = !n.readAt;
              const { headline, details } = text(n);
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => open(n)}
                    className={cn(
                      "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/60",
                      ping && "bg-amber-500/10 hover:bg-amber-500/15",
                      !unreadItem && "opacity-70"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground",
                        ping && "bg-amber-500/20 text-amber-700 dark:text-amber-400",
                        n.kind === "cal_deleted" || n.kind === "task_deleted" ? "text-destructive" : ""
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      {ping && (
                        <span className="mb-0.5 block text-[11px] font-bold tracking-wider text-amber-700 uppercase dark:text-amber-400">
                          {t("notifications.reminder")}
                        </span>
                      )}
                      <span className={cn("block text-sm text-foreground", ping && "font-semibold")}>{headline}</span>
                      {details.filter(Boolean).map((line, i) => (
                        <span key={i} className="mt-0.5 block text-xs break-words text-muted-foreground">
                          {line}
                        </span>
                      ))}
                      <span className="mt-1 block text-[11px] text-muted-foreground">{relative(n.createdAt)}</span>
                    </span>
                    {unreadItem && <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" aria-hidden />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
