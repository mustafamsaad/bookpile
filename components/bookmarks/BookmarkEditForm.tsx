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
          const map = new Map<string, string>();
          for (const b of data) {
            if (b.customPlatformName && !map.has(b.customPlatformName)) {
              map.set(b.customPlatformName, b.customPlatformIcon || "");
            }
          }
          setCustomPlatforms(
            Array.from(map.entries()).map(([name, icon]) => ({ name, icon: icon || undefined }))
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
      topic,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium">Headline</label>
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-foreground"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-foreground"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Content Preview
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          maxLength={500}
          className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-foreground"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <PlatformSelect
          value={platform}
          customName={customPlatformName}
          customPlatforms={customPlatforms}
          iconPreview={customPlatformIcon}
          onChange={setPlatform}
          onCustomNameChange={setCustomPlatformName}
          onIconChange={setCustomPlatformIcon}
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
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-card"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Changes
        </button>
      </div>
    </form>
  );
}
