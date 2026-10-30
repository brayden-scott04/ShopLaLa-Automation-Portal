// Locale-aware date/number formatting. Plain module: pass the locale from useLocale()/getLocale().
import { LOCALE_TAGS, type Locale } from "@/lib/i18n/config";

/** `value` is a Date, an ISO timestamp, or a "YYYY-MM-DD" date (read as a calendar date, not UTC). */
export function formatDate(locale: Locale, value: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const date =
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? new Date(`${value}T00:00:00`)
      : new Date(value);
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], options ?? { dateStyle: "medium" }).format(date);
}

export function formatNumber(locale: Locale, value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(LOCALE_TAGS[locale], options).format(value);
}
