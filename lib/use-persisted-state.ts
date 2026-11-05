"use client";

import { useCallback, useMemo, useSyncExternalStore, type SetStateAction } from "react";

// Shared by every usePersistedState hook: notifies subscribers when one key is written.
// `memory` keeps the value working for this visit when storage is blocked (private window).
const listeners = new Set<() => void>();
const memory = new Map<string, string>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key) ?? memory.get(key) ?? null;
  } catch {
    return memory.get(key) ?? null;
  }
}

function writeRaw(key: string, raw: string) {
  memory.set(key, raw);
  try {
    localStorage.setItem(key, raw);
  } catch {
    // Not persisting is fine; the value still applies for this visit.
  }
  listeners.forEach((listener) => listener());
}

/**
 * `useState` that remembers its last value per browser (localStorage), so a page reopens the way the
 * person left it. The server render always uses `defaultValue`, so hydration matches; the stored value
 * takes over on the client. `isValid` drops anything stale or hand-edited and should be a stable,
 * module-level guard.
 */
export function usePersistedState<T>(
  storageKey: string,
  defaultValue: T,
  isValid: (value: unknown) => value is T
): [T, (next: SetStateAction<T>) => void] {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(storageKey),
    () => null
  );

  const value = useMemo(() => {
    if (raw === null) return defaultValue;
    try {
      const parsed: unknown = JSON.parse(raw);
      return isValid(parsed) ? parsed : defaultValue;
    } catch {
      return defaultValue;
    }
    // defaultValue/isValid are constants at every call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw]);

  const set = useCallback(
    (next: SetStateAction<T>) => {
      const current = (() => {
        const stored = readRaw(storageKey);
        if (stored === null) return defaultValue;
        try {
          const parsed: unknown = JSON.parse(stored);
          return isValid(parsed) ? parsed : defaultValue;
        } catch {
          return defaultValue;
        }
      })();
      const resolved = typeof next === "function" ? (next as (prev: T) => T)(current) : next;
      writeRaw(storageKey, JSON.stringify(resolved));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [storageKey]
  );

  return [value, set];
}
