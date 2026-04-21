"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BookmarkGrid } from "@/components/bookmarks/BookmarkGrid";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { BookmarkEditForm } from "@/components/bookmarks/BookmarkEditForm";
import type { Bookmark, Platform, Topic } from "@/types";
import { PLATFORM_LABELS, TOPIC_LABELS } from "@/types";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { toast } = useToast();
  const [allBookmarks, setAllBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAllBookmarks = useCallback(async () => {
    try {
      const res = await fetch("/api/bookmarks");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setAllBookmarks(data);
    } catch {
      toast("Failed to load bookmarks", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAllBookmarks();
  }, [fetchAllBookmarks]);

  const filteredBookmarks = useMemo(() => {
    return allBookmarks.filter((b) => {
      if (selectedPlatform !== "all") {
        if (selectedPlatform.startsWith("custom:")) {
          const customName = selectedPlatform.slice(7);
          if (b.platform !== "other" || b.customPlatformName !== customName) return false;
        } else {
          if (b.platform !== selectedPlatform) return false;
        }
      }
      if (selectedTopic !== "all" && b.topic !== selectedTopic) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!b.headline.toLowerCase().includes(q) && !b.content?.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [allBookmarks, selectedPlatform, selectedTopic, search]);

  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setAllBookmarks((prev) => prev.filter((b) => b._id !== id));
      toast("Bookmark deleted");
      setDeleteConfirm(null);
    } catch {
      toast("Failed to delete bookmark", "error");
    } finally {
      setDeleting(false);
    }
  }

  async function handleEditSave(updated: Bookmark) {
    try {
      const res = await fetch(`/api/bookmarks/${updated._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Failed to update");
      const data = await res.json();
      setAllBookmarks((prev) =>
        prev.map((b) => (b._id === data._id ? data : b))
      );
      toast("Bookmark updated");
      setEditingBookmark(null);
    } catch {
      toast("Failed to update bookmark", "error");
    }
  }

  function getTopicLabel(t: string): string {
    return TOPIC_LABELS[t as Topic] || t.charAt(0).toUpperCase() + t.slice(1);
  }

  let headerTitle = "All Bookmarks";
  if (selectedPlatform !== "all") {
    if (selectedPlatform.startsWith("custom:")) {
      headerTitle = selectedPlatform.slice(7);
    } else {
      headerTitle = PLATFORM_LABELS[selectedPlatform as Platform] || selectedPlatform;
    }
    if (selectedTopic !== "all") {
      headerTitle += ` / ${getTopicLabel(selectedTopic)}`;
    }
  } else if (selectedTopic !== "all") {
    headerTitle = getTopicLabel(selectedTopic);
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        bookmarks={allBookmarks}
        selectedPlatform={selectedPlatform}
        selectedTopic={selectedTopic}
        onSelectPlatform={setSelectedPlatform}
        onSelectTopic={setSelectedTopic}
      />

      <main className="flex flex-1 flex-col overflow-hidden">
        <Header
          search={search}
          onSearchChange={setSearch}
          title={headerTitle}
        />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <BookmarkGrid
            bookmarks={filteredBookmarks}
            loading={loading}
            onDelete={(id) => setDeleteConfirm(id)}
            onEdit={setEditingBookmark}
          />
        </div>
      </main>

      {/* Edit Modal */}
      <Modal
        open={!!editingBookmark}
        onClose={() => setEditingBookmark(null)}
        title="Edit Bookmark"
      >
        {editingBookmark && (
          <BookmarkEditForm
            bookmark={editingBookmark}
            onSave={handleEditSave}
            onCancel={() => setEditingBookmark(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => !deleting && setDeleteConfirm(null)}
        title="Delete Bookmark"
      >
        <p className="mb-6 text-sm text-muted">
          Are you sure you want to delete this bookmark? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteConfirm(null)}
            disabled={deleting}
            className="inline-flex h-11 items-center rounded-full border border-border-strong px-5 text-sm font-medium transition-colors hover:border-foreground/40 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            disabled={deleting}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
