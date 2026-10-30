import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { I18nProvider } from "@/lib/i18n/client";
import { LOCALE_TAGS } from "@/lib/i18n/config";
import { getLocale, getMessages } from "@/lib/i18n/server";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ShopLaLa Automation Portal",
  description: "Internal automation control center for ShopLaLa",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The language comes from the portal_lang cookie (set at login and by the Settings switch).
  const locale = await getLocale();

  return (
    <html lang={LOCALE_TAGS[locale]} className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <I18nProvider locale={locale} messages={getMessages(locale)}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
