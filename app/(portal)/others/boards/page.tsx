"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Plus, LayoutGrid, Trash2 } from "lucide-react";
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
import { boards as boardsItem } from "@/lib/others";
import { listBoards, createBoard, deleteBoard, type BoardSummary } from "@/lib/actions/boards";
import { MAX_BOARD_NAME_LENGTH, MAX_BOARD_DESCRIPTION_LENGTH } from "@/lib/boards-constants";

export default function BoardsPage() {
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BoardSummary | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const { data } = await listBoards();
      setBoards(data ?? []);
      setIsLoading(false);
    });
  }, []);

  function handleCreate() {
    setError(null);
    startTransition(async () => {
      const result = await createBoard(name, description);
      if (result.error || !result.data) {
        setError(result.error ?? "Something went wrong");
        return;
      }
      setBoards((prev) => [...prev, result.data!]);
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
      const result = await deleteBoard(target.id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setBoards((prev) => prev.filter((b) => b.id !== target.id));
    });
    setDeleteTarget(null);
  }

  return (
    <>
      <PageHeader icon={boardsItem.icon} title={boardsItem.name} description={boardsItem.description} />
      <div className="space-y-4 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">
            {boards.length} board{boards.length === 1 ? "" : "s"}
          </h2>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus /> Create board
          </Button>
        </div>

        {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : boards.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
            <LayoutGrid className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No boards yet. Create one to start tracking data.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <Card key={board.id}>
                <CardHeader>
                  <CardTitle>
                    <Link href={`/others/boards/${board.id}`} className="hover:underline">
                      {board.name}
                    </Link>
                  </CardTitle>
                  {board.description && <CardDescription>{board.description}</CardDescription>}
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {board.columnCount} column{board.columnCount === 1 ? "" : "s"} · {board.itemCount} item
                  {board.itemCount === 1 ? "" : "s"}
                </CardContent>
                <CardFooter className="justify-end">
                  <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(board)} aria-label="Delete board">
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
            <DialogTitle>Create board</DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="board-name">Name</Label>
              <Input
                id="board-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={MAX_BOARD_NAME_LENGTH}
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="board-description">Description (optional)</Label>
              <Textarea
                id="board-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={MAX_BOARD_DESCRIPTION_LENGTH}
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
            <AlertDialogTitle>Delete board &ldquo;{deleteTarget?.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the board and all of its items. This can&apos;t be undone.
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
