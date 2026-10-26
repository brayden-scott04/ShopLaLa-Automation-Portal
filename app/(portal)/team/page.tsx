"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil, Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser, getStaffDirectory, updateJobRole } from "@/lib/actions/staff";
import { type Role, ROLE_LABELS } from "@/lib/roles";

type DirectoryEntry = {
  id: string;
  username: string;
  role: Role;
  job_role: string | null;
};

/** Admin-only: plain text until clicked, then an input that saves on blur or Enter (Escape cancels). */
function JobRoleEditor({
  member,
  onSaved,
  onError,
}: {
  member: DirectoryEntry;
  onSaved: (jobRole: string | null) => void;
  onError: (error: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  // Some browsers fire blur when the input unmounts; this stops Escape from saving.
  const cancelled = useRef(false);

  function startEditing() {
    cancelled.current = false;
    setValue(member.job_role ?? "");
    setIsEditing(true);
  }

  async function save() {
    if (cancelled.current) return;
    const next = value.trim();
    if (next === (member.job_role ?? "")) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    const { data, error } = await updateJobRole(member.id, next);
    setIsSaving(false);
    setIsEditing(false);
    if (error) onError(error);
    else onSaved(data?.job_role ?? null);
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={startEditing}
        title="Edit job role"
        className="group inline-flex items-center gap-1.5 text-left"
      >
        <span className={member.job_role ? "" : "text-muted-foreground"}>
          {member.job_role ?? "Add job role"}
        </span>
        <Pencil className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </button>
    );
  }

  return (
    <Input
      autoFocus
      value={value}
      maxLength={60}
      placeholder="Add job role"
      disabled={isSaving}
      onChange={(e) => setValue(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          cancelled.current = true;
          setIsEditing(false);
        }
      }}
      className="h-8 max-w-56"
    />
  );
}

export default function TeamPage() {
  const [staff, setStaff] = useState<DirectoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    Promise.all([getStaffDirectory(), getCurrentUser()]).then(([{ data, error }, user]) => {
      if (error) setError(error);
      else setStaff((data as DirectoryEntry[]) ?? []);
      setIsAdmin(user?.role === "admin");
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <PageHeader
        icon={Users}
        title="Team"
        description="Everyone with portal access"
      />

      <div className="p-6 md:p-8">
        {error && (
          <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Username</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Job Role</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Portal Role</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-4 py-3"><Skeleton className="h-4 w-28" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-14 rounded-full" /></td>
                  </tr>
                ))
              ) : (
                <>
                  {staff.map((member) => (
                    <tr key={member.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-medium">{member.username}</td>
                      <td className="px-4 py-3">
                        {isAdmin ? (
                          <JobRoleEditor
                            member={member}
                            onError={setError}
                            onSaved={(jobRole) => {
                              setError(null);
                              setStaff((prev) =>
                                prev.map((m) => (m.id === member.id ? { ...m, job_role: jobRole } : m)),
                              );
                            }}
                          />
                        ) : (
                          <span className={member.job_role ? "" : "text-muted-foreground"}>
                            {member.job_role ?? "—"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            member.role === "admin"
                              ? "bg-primary/10 text-primary"
                              : member.role === "manager"
                                ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                                : member.role === "moderator"
                                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                  : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {ROLE_LABELS[member.role]}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {staff.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                        No accounts yet
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
