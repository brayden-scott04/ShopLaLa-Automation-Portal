"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useT } from "@/lib/i18n/client";

/** Quick "back to Dashboard" link shown above every portal page except the dashboard itself. */
export function DashboardLink() {
  const t = useT();
  const pathname = usePathname();
  if (pathname === "/dashboard") return null;

  return (
    <div className="px-6 pt-4 md:px-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 rounded-md text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        {t("nav.dashboard")}
      </Link>
    </div>
  );
}
