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
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-[2/1] w-full animate-pulse bg-card-hover" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-card-hover" />
        <div className="h-3 w-full animate-pulse rounded-full bg-card-hover" />
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
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card">
          <BookmarkPlus className="h-6 w-6 text-muted" strokeWidth={1.75} />
        </div>
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.15em] text-accent">
          Empty pile
        </p>
        <h3 className="font-heading text-xl font-semibold tracking-tight">
          Nothing saved yet.
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Paste a URL and BookPile will turn it into a card. Titles, covers,
          platforms — all fetched automatically.
        </p>
        <Link
          href="/add"
          className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
        >
          <BookmarkPlus className="h-4 w-4" strokeWidth={1.75} />
          Add your first bookmark
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
