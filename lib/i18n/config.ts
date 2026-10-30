// Site language. Plain module (no "use server"): safe to import from server and client code.
// LOCALES must match the CHECK on staff.language in sql/staff_language_migration.sql.

export const LOCALES = ["en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Set on login (from staff.language) and by the Settings switch; read on every request. */
export const LOCALE_COOKIE = "portal_lang";

/** Each language's name written in that language, for the switcher. */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  zh: "中文",
};

/** BCP 47 tag for <html lang> and Intl formatting. */
export const LOCALE_TAGS: Record<Locale, string> = {
  en: "en-SG",
  zh: "zh-CN",
};

export function toLocale(value: unknown): Locale {
  return value === "zh" ? "zh" : "en";
}
