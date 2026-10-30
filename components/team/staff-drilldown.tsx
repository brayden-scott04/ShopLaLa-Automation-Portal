"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, UserRound } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useT } from "@/lib/i18n/client";
import { getStaffProfile, type StaffProfile } from "@/lib/actions/staff-profile";
import { StaffProfileView } from "@/components/team/staff-profile-view";
import { StaffSkillsView } from "@/components/team/staff-skills-view";

type Tab = "profile" | "skills";

/** /team/<username>: Profile first, Skills as the second tab (?tab=skills). */
export function StaffDrilldown({ username }: { username: string }) {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const tab: Tab = useSearchParams().get("tab") === "skills" ? "skills" : "profile";

  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    const { data, error } = await getStaffProfile(username);
    setError(error);
    setProfile(data);
    setIsLoading(false);
  }, [username]);

  useEffect(() => {
    getStaffProfile(username).then(({ data, error }) => {
      setError(error);
      setProfile(data);
      setIsLoading(false);
    });
  }, [username]);

  const notFound = error === "Not found";

  return (
    <>
      <PageHeader
        icon={UserRound}
        title={profile?.member.username ?? username}
        description={
          notFound
            ? t("team.noSuchMember")
            : profile
              ? [profile.member.job_role, t(`roles.${profile.member.role}`)].filter(Boolean).join(" · ")
              : ""
        }
      />

      <div className="space-y-6 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/team"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {t("team.backToTeam")}
          </Link>
          {!notFound && (
            <SegmentedControl<Tab>
              value={tab}
              onValueChange={(next) => router.replace(next === "skills" ? `${pathname}?tab=skills` : pathname)}
              options={[
                { value: "profile", label: t("team.tabProfile") },
                { value: "skills", label: t("team.tabSkills") },
              ]}
            />
          )}
        </div>

        {notFound ? (
          <p className="text-sm text-muted-foreground">{t("team.notFound", { username })}</p>
        ) : tab === "skills" ? (
          <StaffSkillsView username={username} />
        ) : isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-36 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        ) : profile ? (
          <StaffProfileView profile={profile} onChanged={load} />
        ) : (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>
    </>
  );
}
