"use client";

import type { Bookmark } from "@/types";
import { BookmarkCard } from "./BookmarkCard";
import { BookmarkPlus } from "lucide-react";
import Link from "next/link";

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  loading: boolean;
  onDelete: (id: string) => void;
  onEdit: (bookmark: Bookmark) => void;
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="aspect-[2/1] w-full animate-pulse bg-card-hover" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-card-hover" />
        <div className="h-3 w-full animate-pulse rounded bg-card-hover" />
        <div className="flex gap-2">
          <div className="h-5 w-16 animate-pulse rounded-full bg-card-hover" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-card-hover" />
        </div>
      </div>
    </div>
  );
}

export function BookmarkGrid({
  bookmarks,
  loading,
  onDelete,
  onEdit,
}: BookmarkGridProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-card">
          <BookmarkPlus className="h-8 w-8 text-muted" />
        </div>
        <h3 className="font-heading text-lg font-semibold">No bookmarks yet</h3>
        <p className="mt-1 text-sm text-muted">
          Start building your pile by adding your first bookmark.
        </p>
        <Link
          href="/add"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 font-heading text-sm font-semibold text-background transition-opacity hover:opacity-80"
        >
          <BookmarkPlus className="h-4 w-4" />
          Add Bookmark
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark._id}
          bookmark={bookmark}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
