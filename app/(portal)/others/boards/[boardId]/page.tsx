"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { BoardGrid } from "@/components/boards/board-grid";
import { boards as boardsItem } from "@/lib/others";
import { getBoard, updateBoard, deleteBoard, type BoardDetail } from "@/lib/actions/boards";
import { MAX_BOARD_NAME_LENGTH } from "@/lib/boards-constants";

export default function BoardDetailPage() {
  const params = useParams<{ boardId: string }>();
  const router = useRouter();
  const boardId = params.boardId;

  const [detail, setDetail] = useState<BoardDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const result = await getBoard(boardId);
      if (result.error) {
        setError(result.error);
      } else {
        setDetail(result.data);
      }
      setIsLoading(false);
    });
  }, [boardId]);

  function handleDelete() {
    setDeleteOpen(false);
    startTransition(async () => {
      const result = await deleteBoard(boardId);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push("/others/boards");
    });
  }

  if (isLoading) {
    return (
      <>
        <PageHeader icon={boardsItem.icon} title="Loading…" description="" />
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
          href="/others/boards"
          className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="size-3.5" /> Back to boards
        </Link>
      </div>
    );
  }

  if (!detail) return null;

  return (
    <>
      <div className="flex items-start justify-between gap-4 p-6 md:p-8 md:pb-0">
        <div className="min-w-0">
          <Link
            href="/others/boards"
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> Boards
          </Link>
          <input
            key={detail.board.name}
            defaultValue={detail.board.name}
            maxLength={MAX_BOARD_NAME_LENGTH}
            onBlur={(e) => {
              const trimmed = e.target.value.trim();
              if (!trimmed || trimmed === detail.board.name) return;
              startTransition(async () => {
                const result = await updateBoard(boardId, { name: trimmed });
                if (result.error) {
                  setError(result.error);
                  return;
                }
                setDetail((prev) => (prev ? { ...prev, board: { ...prev.board, name: trimmed } } : prev));
              });
            }}
            className="-mx-1 block w-full rounded-md border border-transparent bg-transparent px-1 text-2xl font-semibold text-foreground outline-none transition-colors hover:border-input focus:border-ring focus:ring-2 focus:ring-ring/50"
          />
          {detail.board.description && (
            <p className="mt-1 text-sm text-muted-foreground">{detail.board.description}</p>
          )}
        </div>
        <Button variant="ghost" size="icon-sm" onClick={() => setDeleteOpen(true)} aria-label="Delete board">
          <Trash2 />
        </Button>
      </div>

      <div className="space-y-4 p-6 md:p-8">
        {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        <BoardGrid boardId={boardId} initialColumns={detail.columns} initialItems={detail.items} />
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete board &ldquo;{detail.board.name}&rdquo;?</AlertDialogTitle>
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
