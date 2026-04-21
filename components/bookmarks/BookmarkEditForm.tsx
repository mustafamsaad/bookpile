"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import type { Bookmark, Platform } from "@/types";
import { PlatformSelect } from "@/components/bookmarks/PlatformSelect";
import type { CustomPlatformEntry } from "@/components/bookmarks/PlatformSelect";
import { TopicSelect } from "@/components/bookmarks/TopicSelect";
import { useToast } from "@/components/ui/Toast";

interface BookmarkEditFormProps {
  bookmark: Bookmark;
  onSave: (updated: Bookmark) => void;
  onCancel: () => void;
}

export function BookmarkEditForm({
  bookmark,
  onSave,
  onCancel,
}: BookmarkEditFormProps) {
  const [headline, setHeadline] = useState(bookmark.headline);
  const [url, setUrl] = useState(bookmark.url);
  const [content, setContent] = useState(bookmark.content || "");
  const [platform, setPlatform] = useState<string>(bookmark.platform);
  const [customPlatformName, setCustomPlatformName] = useState(
    bookmark.customPlatformName || ""
  );
  const [customPlatformIcon, setCustomPlatformIcon] = useState(
    bookmark.customPlatformIcon || ""
  );
  const [customPlatformColor, setCustomPlatformColor] = useState(
    bookmark.customPlatformColor || "#6b7280"
  );
  const [topic, setTopic] = useState<string>(bookmark.topic);
  const [saving, setSaving] = useState(false);
  const [customTopics, setCustomTopics] = useState<string[]>([]);
  const [customPlatforms, setCustomPlatforms] = useState<CustomPlatformEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const [topicRes, platformRes] = await Promise.all([
          fetch("/api/topics"),
          fetch("/api/bookmarks?platform=other"),
        ]);
        if (topicRes.ok) {
          const data = await topicRes.json();
          setCustomTopics(data.custom || []);
        }
        if (platformRes.ok) {
          const data = await platformRes.json();
          const map = new Map<string, { icon: string; color: string }>();
          for (const b of data) {
            if (b.customPlatformName && !map.has(b.customPlatformName)) {
              map.set(b.customPlatformName, {
                icon: b.customPlatformIcon || "",
                color: b.customPlatformColor || "",
              });
            }
          }
          setCustomPlatforms(
            Array.from(map.entries()).map(([name, v]) => ({
              name,
              icon: v.icon || undefined,
              color: v.color || undefined,
            }))
          );
        }
      } catch { /* ignore */ }
    }
    loadData();
  }, []);

  async function handleDeleteTopic(topicToDelete: string) {
    try {
      const res = await fetch("/api/topics", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicToDelete }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || "Failed to delete topic", "error");
        return;
      }
      setCustomTopics((prev) => prev.filter((t) => t !== topicToDelete));
      if (topic === topicToDelete) setTopic("tech");
      toast("Topic removed");
    } catch {
      toast("Failed to delete topic", "error");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    onSave({
      ...bookmark,
      headline,
      url,
      content,
      platform: platform as Platform,
      customPlatformName,
      customPlatformIcon,
      customPlatformColor,
      topic,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.15em] text-muted">
          Headline
        </label>
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          required
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground/40"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.15em] text-muted">
          URL
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground/40"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.15em] text-muted">
          Content preview
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          maxLength={500}
          className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground/40"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <PlatformSelect
          value={platform}
          customName={customPlatformName}
          customPlatforms={customPlatforms}
          iconPreview={customPlatformIcon}
          colorPreview={customPlatformColor}
          onChange={setPlatform}
          onCustomNameChange={setCustomPlatformName}
          onIconChange={setCustomPlatformIcon}
          onColorChange={setCustomPlatformColor}
        />

        <TopicSelect
          value={topic}
          customTopics={customTopics}
          onChange={setTopic}
          onDeleteTopic={handleDeleteTopic}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-11 items-center rounded-full border border-border-strong px-5 text-sm font-medium transition-colors hover:border-foreground/40"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save changes
        </button>
      </div>
    </form>
  );
}
