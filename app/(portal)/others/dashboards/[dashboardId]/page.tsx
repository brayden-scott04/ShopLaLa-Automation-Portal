"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Link2, Link2Off, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { WidgetCard } from "@/components/dashboards/widget-card";
import { WidgetDialog } from "@/components/dashboards/widget-dialog";
import { dashboards as dashboardsItem } from "@/lib/others";
import { listBoards, type BoardSummary } from "@/lib/actions/boards";
import {
  getDashboard,
  getDashboardData,
  deleteDashboard,
  connectBoard,
  disconnectBoard,
  deleteWidget,
  moveWidget,
  type DashboardDetail,
  type DashboardWidgetResult,
  type DashboardWidget,
} from "@/lib/actions/dashboards";

const SELECT_CLASSNAME =
  "w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export default function DashboardDetailPage() {
  const params = useParams<{ dashboardId: string }>();
  const router = useRouter();
  const dashboardId = params.dashboardId;

  const [detail, setDetail] = useState<DashboardDetail | null>(null);
  const [widgets, setWidgets] = useState<DashboardWidgetResult[]>([]);
  const [allBoards, setAllBoards] = useState<BoardSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectOpen, setConnectOpen] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [deleteDashboardOpen, setDeleteDashboardOpen] = useState(false);
  const [disconnectTarget, setDisconnectTarget] = useState<{ id: string; name: string } | null>(null);
  const [widgetDialog, setWidgetDialog] = useState<{ open: boolean; widget: DashboardWidget | null }>({
    open: false,
    widget: null,
  });
  const [deleteWidgetTarget, setDeleteWidgetTarget] = useState<DashboardWidgetResult | null>(null);
  const [, startTransition] = useTransition();

  function reload() {
    startTransition(async () => {
      const [detailResult, dataResult] = await Promise.all([getDashboard(dashboardId), getDashboardData(dashboardId)]);
      if (detailResult.error) {
        setError(detailResult.error);
      } else {
        setDetail(detailResult.data);
      }
      setWidgets(dataResult.data ?? []);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    reload();
    startTransition(async () => {
      const { data } = await listBoards();
      setAllBoards(data ?? []);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardId]);

  const connectableBoards = allBoards.filter((b) => !detail?.connectedBoards.some((c) => c.id === b.id));

  function handleConnect() {
    if (!selectedBoardId) return;
    setError(null);
    startTransition(async () => {
      const result = await connectBoard(dashboardId, selectedBoardId);
      if (result.error) {
        setError(result.error);
        return;
      }
      setConnectOpen(false);
      setSelectedBoardId("");
      reload();
    });
  }

  function handleDisconnect() {
    if (!disconnectTarget) return;
    const target = disconnectTarget;
    setDisconnectTarget(null);
    setError(null);
    startTransition(async () => {
      const result = await disconnectBoard(dashboardId, target.id);
      if (result.error) {
        setError(result.error);
        return;
      }
      reload();
    });
  }

  function handleDeleteDashboard() {
    setDeleteDashboardOpen(false);
    startTransition(async () => {
      const result = await deleteDashboard(dashboardId);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push("/others/dashboards");
    });
  }

  function handleDeleteWidget() {
    if (!deleteWidgetTarget) return;
    const target = deleteWidgetTarget;
    setDeleteWidgetTarget(null);
    startTransition(async () => {
      const result = await deleteWidget(target.id);
      if (result.error) {
        setError(result.error);
        return;
      }
      reload();
    });
  }

  function handleMoveWidget(widgetId: string, direction: "up" | "down") {
    startTransition(async () => {
      const result = await moveWidget(widgetId, direction);
      if (result.error) {
        setError(result.error);
        return;
      }
      reload();
    });
  }

  if (isLoading) {
    return (
      <>
        <PageHeader icon={dashboardsItem.icon} title="Loading…" description="" />
        <div className="p-6 md:p-8">
          <Skeleton className="h-64" />
        </div>
      </>
    );
  }

  if (error && !detail) {
    return (
      <div className="p-6 md:p-8">
        <p className="text-sm text-destructive">{error}</p>
        <Link
          href="/others/dashboards"
          className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="size-3.5" /> Back to dashboards
        </Link>
      </div>
    );
  }

  if (!detail) return null;

  return (
    <>
      <div className="flex items-start justify-between gap-4 p-6 md:p-8 md:pb-0">
        <div>
          <Link
            href="/others/dashboards"
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> Dashboards
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">{detail.dashboard.name}</h1>
          {detail.dashboard.description && (
            <p className="mt-1 text-sm text-muted-foreground">{detail.dashboard.description}</p>
          )}
        </div>
        <Button variant="ghost" size="icon-sm" onClick={() => setDeleteDashboardOpen(true)} aria-label="Delete dashboard">
          <Trash2 />
        </Button>
      </div>

      <div className="space-y-6 p-6 md:p-8">
        {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">Connected boards</h2>
            <Button variant="outline" size="sm" onClick={() => setConnectOpen(true)}>
              <Link2 /> Connect board
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {detail.connectedBoards.length === 0 ? (
              <p className="text-sm text-muted-foreground">No boards connected yet.</p>
            ) : (
              detail.connectedBoards.map((b) => (
                <Badge key={b.id} variant="outline" className="gap-1.5 pr-1">
                  {b.name}
                  <button
                    type="button"
                    onClick={() => setDisconnectTarget(b)}
                    className="rounded-full p-0.5 hover:bg-muted"
                    aria-label={`Disconnect ${b.name}`}
                  >
                    <Link2Off className="size-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">Widgets</h2>
            <Button
              size="sm"
              onClick={() => setWidgetDialog({ open: true, widget: null })}
              disabled={detail.connectedBoards.length === 0}
            >
              <Plus /> Add widget
            </Button>
          </div>
          {widgets.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
              <p className="text-sm text-muted-foreground">
                {detail.connectedBoards.length === 0
                  ? "Connect a board first, then add widgets to visualize its data."
                  : "No widgets yet. Add one to visualize your connected boards."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {widgets.map((widget, index) => (
                <WidgetCard
                  key={widget.id}
                  widget={widget}
                  onEdit={() => setWidgetDialog({ open: true, widget })}
                  onDelete={() => setDeleteWidgetTarget(widget)}
                  onMoveUp={() => handleMoveWidget(widget.id, "up")}
                  onMoveDown={() => handleMoveWidget(widget.id, "down")}
                  canMoveUp={index > 0}
                  canMoveDown={index < widgets.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={connectOpen} onOpenChange={setConnectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect a board</DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-3">
            {connectableBoards.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Every board is already connected, or none exist yet — create one under Boards first.
              </p>
            ) : (
              <select
                value={selectedBoardId}
                onChange={(e) => setSelectedBoardId(e.target.value)}
                className={SELECT_CLASSNAME}
              >
                <option value="">Select a board…</option>
                {connectableBoards.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            )}
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConnectOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConnect} disabled={!selectedBoardId}>
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <WidgetDialog
        open={widgetDialog.open}
        onOpenChange={(open) => setWidgetDialog((prev) => ({ ...prev, open }))}
        dashboardId={dashboardId}
        connectedBoards={detail.connectedBoards}
        widget={widgetDialog.widget}
        onSaved={() => reload()}
      />

      <AlertDialog open={disconnectTarget !== null} onOpenChange={(open) => !open && setDisconnectTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect &ldquo;{disconnectTarget?.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              Any widgets on this dashboard built from that board will be removed. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDisconnect}>
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteWidgetTarget !== null} onOpenChange={(open) => !open && setDeleteWidgetTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete widget &ldquo;{deleteWidgetTarget?.title}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDeleteWidget}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDashboardOpen} onOpenChange={setDeleteDashboardOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete dashboard &ldquo;{detail.dashboard.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the dashboard and its widgets. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDeleteDashboard}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
