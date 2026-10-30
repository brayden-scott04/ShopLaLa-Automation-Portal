// Server-side language access: server components, server actions and route handlers.
import { cookies } from "next/headers";
import en from "@/lib/i18n/messages/en";
import zh from "@/lib/i18n/messages/zh";
import { LOCALE_COOKIE, toLocale, type Locale } from "@/lib/i18n/config";
import { createTranslator, type Messages, type Translator } from "@/lib/i18n/translate";

const DICTIONARIES: Record<Locale, Messages> = { en, zh };

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return toLocale(store.get(LOCALE_COOKIE)?.value);
}

export function getMessages(locale: Locale): Messages {
  return DICTIONARIES[locale];
}

/** Translator for the current request's language. */
export async function getT(): Promise<Translator> {
  return createTranslator(getMessages(await getLocale()));
}

/** Remembers the language in the browser for a year; the Settings switch and login both call this. */
export async function setLocaleCookie(locale: Locale) {
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
  });
}
