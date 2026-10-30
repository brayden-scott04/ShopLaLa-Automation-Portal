"use client";

// Client-side language access. The root layout reads the cookie on the server and passes the
// matching dictionary down, so client components never import the dictionaries themselves.
import { createContext, useContext, useMemo } from "react";
import type { Locale } from "@/lib/i18n/config";
import { createTranslator, type Messages, type Translator } from "@/lib/i18n/translate";

const I18nContext = createContext<{ locale: Locale; t: Translator } | null>(null);

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ locale, t: createTranslator(messages) }), [locale, messages]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT/useLocale must be used inside <I18nProvider>");
  return ctx;
}

export function useT(): Translator {
  return useI18n().t;
}

export function useLocale(): Locale {
  return useI18n().locale;
}
