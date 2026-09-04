"use client";

import { useEffect, useState, useTransition } from "react";
import { Trash2, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CALENDAR_MEMBER_ROLES, type CalendarMemberRole } from "@/lib/calendar-constants";
import {
  getCalendarMembers,
  addCalendarMember,
  updateCalendarMemberRole,
  removeCalendarMember,
  type CalendarSummary,
  type CalendarMember,
} from "@/lib/actions/calendar";
import { getStaffDirectory } from "@/lib/actions/staff";

export function ManageAccessDialog({
  calendar,
  onClose,
}: {
  calendar: CalendarSummary | null;
  onClose: () => void;
}) {
  const open = calendar !== null;
  const [members, setMembers] = useState<CalendarMember[]>([]);
  const [staffOptions, setStaffOptions] = useState<{ username: string }[]>([]);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [selectedRole, setSelectedRole] = useState<CalendarMemberRole>("viewer");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open || !calendar) return;
    startTransition(async () => {
      setError(null);
      const [membersRes, staffRes] = await Promise.all([
        getCalendarMembers(calendar.id),
        getStaffDirectory(),
      ]);
      setMembers(membersRes.data ?? []);
      setStaffOptions(
        (staffRes.data ?? []).filter((s) => s.username !== calendar.ownerUsername)
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, calendar?.id]);

  const availableStaff = staffOptions.filter(
    (s) => !members.some((m) => m.username === s.username)
  );

  function reload() {
    if (!calendar) return;
    startTransition(async () => {
      const { data } = await getCalendarMembers(calendar.id);
      setMembers(data ?? []);
    });
  }

  function handleAdd() {
    if (!calendar || !selectedUsername) return;
    setError(null);
    startTransition(async () => {
      const { error } = await addCalendarMember(calendar.id, selectedUsername, selectedRole);
      if (error) {
        setError(error);
        return;
      }
      setSelectedUsername("");
      reload();
    });
  }

  function handleRoleChange(username: string, role: CalendarMemberRole) {
    if (!calendar) return;
    startTransition(async () => {
      const { error } = await updateCalendarMemberRole(calendar.id, username, role);
      if (error) setError(error);
      reload();
    });
  }

  function handleRemove(username: string) {
    if (!calendar) return;
    startTransition(async () => {
      const { error } = await removeCalendarMember(calendar.id, username);
      if (error) setError(error);
      reload();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage access</DialogTitle>
          <DialogDescription>
            Choose who can see and edit &ldquo;{calendar?.name}&rdquo;.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label className="mb-1">Add staff member</Label>
              <select
                value={selectedUsername}
                onChange={(e) => setSelectedUsername(e.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Select a username…</option>
                {availableStaff.map((s) => (
                  <option key={s.username} value={s.username}>
                    {s.username}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as CalendarMemberRole)}
              className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {CALENDAR_MEMBER_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r === "editor" ? "Can edit" : "Can view"}
                </option>
              ))}
            </select>
            <Button size="icon" variant="outline" onClick={handleAdd} disabled={!selectedUsername || isPending}>
              <UserPlus />
            </Button>
          </div>

          <div className="space-y-1.5">
            {members.length === 0 ? (
              <p className="text-sm text-muted-foreground">Only you can see this calendar.</p>
            ) : (
              members.map((m) => (
                <div
                  key={m.username}
                  className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5"
                >
                  <span className="flex-1 truncate text-sm">{m.username}</span>
                  <select
                    value={m.role}
                    onChange={(e) => handleRoleChange(m.username, e.target.value as CalendarMemberRole)}
                    className="h-7 rounded-md border border-input bg-transparent px-2 text-xs outline-none"
                  >
                    {CALENDAR_MEMBER_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r === "editor" ? "Can edit" : "Can view"}
                      </option>
                    ))}
                  </select>
                  <Button size="icon-xs" variant="ghost" onClick={() => handleRemove(m.username)} title="Remove">
                    <Trash2 />
                  </Button>
                </div>
              ))
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Done</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
