"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Plus, LayoutDashboard, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboards as dashboardsItem } from "@/lib/others";
import { listDashboards, createDashboard, deleteDashboard, type DashboardSummary } from "@/lib/actions/dashboards";
import { MAX_DASHBOARD_NAME_LENGTH, MAX_DASHBOARD_DESCRIPTION_LENGTH } from "@/lib/dashboards-constants";

export default function DashboardsPage() {
  const [dashboards, setDashboards] = useState<DashboardSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DashboardSummary | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const { data } = await listDashboards();
      setDashboards(data ?? []);
      setIsLoading(false);
    });
  }, []);

  function handleCreate() {
    setError(null);
    startTransition(async () => {
      const result = await createDashboard(name, description);
      if (result.error || !result.data) {
        setError(result.error ?? "Something went wrong");
        return;
      }
      setDashboards((prev) => [...prev, result.data!]);
      setCreateOpen(false);
      setName("");
      setDescription("");
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setError(null);
    startTransition(async () => {
      const result = await deleteDashboard(target.id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setDashboards((prev) => prev.filter((d) => d.id !== target.id));
    });
    setDeleteTarget(null);
  }

  return (
    <>
      <PageHeader icon={dashboardsItem.icon} title={dashboardsItem.name} description={dashboardsItem.description} />
      <div className="space-y-4 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">
            {dashboards.length} dashboard{dashboards.length === 1 ? "" : "s"}
          </h2>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus /> Create dashboard
          </Button>
        </div>

        {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : dashboards.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
            <LayoutDashboard className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No dashboards yet. Create one, connect a board, and add widgets.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dashboards.map((dashboard) => (
              <Card key={dashboard.id}>
                <CardHeader>
                  <CardTitle>
                    <Link href={`/others/dashboards/${dashboard.id}`} className="hover:underline">
                      {dashboard.name}
                    </Link>
                  </CardTitle>
                  {dashboard.description && <CardDescription>{dashboard.description}</CardDescription>}
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {dashboard.connectedBoardCount} board{dashboard.connectedBoardCount === 1 ? "" : "s"} connected
                </CardContent>
                <CardFooter className="justify-end">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDeleteTarget(dashboard)}
                    aria-label="Delete dashboard"
                  >
                    <Trash2 />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create dashboard</DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="dashboard-name">Name</Label>
              <Input
                id="dashboard-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={MAX_DASHBOARD_NAME_LENGTH}
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dashboard-description">Description (optional)</Label>
              <Textarea
                id="dashboard-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={MAX_DASHBOARD_DESCRIPTION_LENGTH}
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isPending || !name.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete dashboard &ldquo;{deleteTarget?.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the dashboard and its widgets. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
