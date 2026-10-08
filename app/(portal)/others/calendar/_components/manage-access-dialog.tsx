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
import { Checkbox } from "@/components/ui/checkbox";
import { CALENDAR_MEMBER_ROLES, type CalendarMemberRole } from "@/lib/calendar-constants";
import {
  getCalendarMembers,
  addCalendarMembers,
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
  const [selectedUsernames, setSelectedUsernames] = useState<Set<string>>(new Set());
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

  const allSelected = availableStaff.length > 0 && availableStaff.every((s) => selectedUsernames.has(s.username));

  function toggleStaff(username: string) {
    setSelectedUsernames((prev) => {
      const next = new Set(prev);
      if (next.has(username)) next.delete(username);
      else next.add(username);
      return next;
    });
  }

  function toggleAll() {
    setSelectedUsernames(allSelected ? new Set() : new Set(availableStaff.map((s) => s.username)));
  }

  function handleAdd() {
    if (!calendar || selectedUsernames.size === 0) return;
    setError(null);
    startTransition(async () => {
      const { error } = await addCalendarMembers(calendar.id, Array.from(selectedUsernames), selectedRole);
      if (error) {
        setError(error);
        return;
      }
      setSelectedUsernames(new Set());
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
          {availableStaff.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label>Add staff members</Label>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={selectedUsernames.size > 0 && !allSelected}
                    onCheckedChange={toggleAll}
                  />
                  Add all
                </label>
              </div>
              <div className="max-h-44 space-y-1.5 overflow-y-auto rounded-md border border-border p-2">
                {availableStaff.map((s) => (
                  <label key={s.username} className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox
                      checked={selectedUsernames.has(s.username)}
                      onCheckedChange={() => toggleStaff(s.username)}
                    />
                    {s.username}
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as CalendarMemberRole)}
                  className="h-8 flex-1 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {CALENDAR_MEMBER_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r === "editor" ? "Can edit" : "Can view"}
                    </option>
                  ))}
                </select>
                <Button variant="outline" onClick={handleAdd} disabled={selectedUsernames.size === 0 || isPending}>
                  <UserPlus />
                  Add {selectedUsernames.size > 0 ? selectedUsernames.size : ""} selected
                </Button>
              </div>
            </div>
          )}

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
