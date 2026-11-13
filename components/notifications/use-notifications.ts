"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  NOTIFICATIONS_CHANGED_EVENT,
  NOTIFICATIONS_POLL_MS,
  type PortalNotification,
} from "@/lib/notifications-constants";

/** Tell every mounted panel/badge to refetch (after marking read, or after sending a ping). */
export function announceNotificationsChanged() {
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
}

/**
 * Polls GET /api/notifications every NOTIFICATIONS_POLL_MS while the tab is visible, and again
 * whenever the tab regains focus or another component announces a change. `countOnly` asks for
 * just the unread count (the sidebar badge).
 */
function usePoll<T>(url: string, parse: (json: unknown) => T | null) {
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState(false);
  const inFlight = useRef(false);

  const refresh = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const res = await fetch(url, { cache: "no-store" });
      const json = res.ok ? await res.json() : null;
      const parsed = json ? parse(json) : null;
      if (parsed === null) setError(true);
      else {
        setValue(parsed);
        setError(false);
      }
    } catch {
      setError(true);
    } finally {
      inFlight.current = false;
    }
  }, [url, parse]);

  useEffect(() => {
    const first = window.setTimeout(refresh, 0);
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, NOTIFICATIONS_POLL_MS);
    const onVisible = () => document.visibilityState === "visible" && refresh();
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, refresh);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, refresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  return { value, setValue, error, refresh };
}

// Module-level so usePoll's callbacks stay stable between renders.
function parseList(json: unknown): { items: PortalNotification[]; unread: number } | null {
  const j = json as { items?: PortalNotification[]; unread?: number };
  return Array.isArray(j.items) ? { items: j.items, unread: j.unread ?? 0 } : null;
}

function parseCount(json: unknown): number | null {
  const n = (json as { unread?: unknown }).unread;
  return typeof n === "number" ? n : null;
}

export function useNotifications() {
  const { value, setValue, error, refresh } = usePoll("/api/notifications", parseList);
  return {
    items: value?.items ?? null,
    unread: value?.unread ?? 0,
    error: error && value === null,
    refresh,
    /** Optimistic local update, e.g. marking one read before the server confirms. */
    update: (fn: (items: PortalNotification[]) => PortalNotification[]) =>
      setValue((v) => {
        if (!v) return v;
        const items = fn(v.items);
        const unread = Math.max(0, v.unread - (v.items.filter((n) => !n.readAt).length - items.filter((n) => !n.readAt).length));
        return { items, unread };
      }),
  };
}

export function useUnreadCount(): number {
  const { value } = usePoll("/api/notifications?count=1", parseCount);
  return value ?? 0;
}
