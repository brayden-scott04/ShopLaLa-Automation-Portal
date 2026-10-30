// Shared lookup used by both getT() (server) and useT() (client).
import type en from "@/lib/i18n/messages/en";

/** The dictionary shape: same keys as en.ts, every leaf a plain string. */
export type DeepStrings<T> = { [K in keyof T]: T[K] extends string ? string : DeepStrings<T[K]> };
export type Messages = DeepStrings<typeof en>;

/** Every valid dotted key, e.g. "team.profile.addTask". */
type Paths<T, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Paths<T[K], `${P}${K}.`>;
}[keyof T & string];
export type MessageKey = Paths<Messages>;

export type Vars = Record<string, string | number>;

/** A bound translator. `t.dynamic` is for keys built at runtime (e.g. nav ids), with a fallback. */
export interface Translator {
  (key: MessageKey, vars?: Vars): string;
  dynamic: (key: string, fallback: string, vars?: Vars) => string;
}

function lookup(messages: Messages, key: string): string | undefined {
  let node: unknown = messages;
  for (const part of key.split(".")) {
    if (node === null || typeof node !== "object") return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : undefined;
}

/** Fills `{name}` placeholders; unknown placeholders are left as-is. */
export function format(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}

export function createTranslator(messages: Messages): Translator {
  const t = ((key: MessageKey, vars?: Vars) => format(lookup(messages, key) ?? key, vars)) as Translator;
  t.dynamic = (key, fallback, vars) => format(lookup(messages, key) ?? fallback, vars);
  return t;
}
