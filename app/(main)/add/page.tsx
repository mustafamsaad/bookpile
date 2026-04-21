"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { PlatformSelect } from "@/components/bookmarks/PlatformSelect";
import type { CustomPlatformEntry } from "@/components/bookmarks/PlatformSelect";
import { TopicSelect } from "@/components/bookmarks/TopicSelect";
import { useToast } from "@/components/ui/Toast";

export default function AddBookmarkPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [headline, setHeadline] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("facebook");
  const [customPlatformName, setCustomPlatformName] = useState("");
  const [topic, setTopic] = useState("tech");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fetchingOg, setFetchingOg] = useState(false);
  const [customPlatformIcon, setCustomPlatformIcon] = useState("");
  const [customPlatformColor, setCustomPlatformColor] = useState("#6b7280");
  const [customPlatforms, setCustomPlatforms] = useState<CustomPlatformEntry[]>([]);
  const [customTopics, setCustomTopics] = useState<string[]>([]);

  useEffect(() => {
    async function loadCustomData() {
      try {
        const [platformRes, topicRes] = await Promise.all([
          fetch("/api/bookmarks?platform=other"),
          fetch("/api/topics"),
        ]);
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
        if (topicRes.ok) {
          const data = await topicRes.json();
          setCustomTopics(data.custom || []);
        }
      } catch {
        /* ignore */
      }
    }
    loadCustomData();
  }, []);

  async function fetchOgData(targetUrl: string) {
    if (!targetUrl.trim()) return;
    try {
      new URL(targetUrl);
    } catch {
      return;
    }

    setFetchingOg(true);
    try {
      const res = await fetch("/api/og-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });
      if (!res.ok) return;
      const data = await res.json();

      if (data.image && !imageFile && !image) {
        setImage(data.image);
        setImagePreview(data.image);
      }
      if (data.title && !headline) {
        setHeadline(data.title);
      }
      if (data.description && !content) {
        setContent(data.description.slice(0, 500));
      }

      const urlLower = targetUrl.toLowerCase();
      const platformMap: Record<string, string> = {
        "facebook.com": "facebook",
        "fb.com": "facebook",
        "twitter.com": "x",
        "x.com": "x",
        "reddit.com": "reddit",
        "youtube.com": "youtube",
        "youtu.be": "youtube",
        "instagram.com": "instagram",
        "linkedin.com": "linkedin",
        "github.com": "github",
        "pinterest.com": "pinterest",
        "tiktok.com": "tiktok",
        "medium.com": "medium",
        "stackoverflow.com": "stackoverflow",
      };

      for (const [domain, plat] of Object.entries(platformMap)) {
        if (urlLower.includes(domain)) {
          setPlatform(plat);
          break;
        }
      }
    } catch {
      /* silently fail - this is optional enhancement */
    } finally {
      setFetchingOg(false);
    }
  }

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

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be under 5MB" }));
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImage("");
    setErrors((prev) => {
      const next = { ...prev };
      delete next.image;
      return next;
    });
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview("");
    setImage("");
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!headline.trim()) newErrors.headline = "Headline is required";
    if (!url.trim()) {
      newErrors.url = "URL is required";
    } else {
      try {
        new URL(url);
      } catch {
        newErrors.url = "Please enter a valid URL";
      }
    }
    if (platform === "other" && !customPlatformName.trim()) {
      newErrors.platform = "Please enter a platform name";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      let imageUrl = image;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        }
      }

      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: headline.trim(),
          url: url.trim(),
          content: content.trim(),
          image: imageUrl,
          platform,
          customPlatformName: customPlatformName.trim(),
          customPlatformIcon,
          customPlatformColor,
          topic,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create bookmark");
      }

      toast("Bookmark added to your pile!");
      router.push("/dashboard");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to create bookmark",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-6 md:py-14">
      <Link
        href="/dashboard"
        className="mb-8 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to dashboard
      </Link>

      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.15em] text-accent">
        New bookmark
      </p>
      <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
        Add to your <span className="text-muted">pile.</span>
      </h1>
      <p className="mt-2 text-sm text-muted">
        Paste a URL — the rest is filled in for you.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        {/* Headline */}
        <div>
          <label
            htmlFor="headline"
            className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.15em] text-muted"
          >
            Headline <span className="text-accent">*</span>
          </label>
          <input
            id="headline"
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="What's this bookmark about?"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-dim focus:border-foreground/40"
          />
          {errors.headline && (
            <p className="mt-1.5 text-xs text-accent">{errors.headline}</p>
          )}
        </div>

        {/* URL */}
        <div>
          <label
            htmlFor="url"
            className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.15em] text-muted"
          >
            URL <span className="text-accent">*</span>
          </label>
          <div className="relative">
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={(e) => fetchOgData(e.target.value)}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData("text");
                setTimeout(() => fetchOgData(pasted), 100);
              }}
              placeholder="https://... — paste a link to auto-fill"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-dim focus:border-foreground/40"
            />
            {fetchingOg && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted" />
              </div>
            )}
          </div>
          {errors.url && (
            <p className="mt-1.5 text-xs text-accent">{errors.url}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.15em] text-muted"
          >
            Content preview
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="A brief snippet or the first few lines of the post..."
            className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-dim focus:border-foreground/40"
          />
          <p className="mt-1.5 text-xs text-dim">{content.length}/500</p>
        </div>

        {/* Platform & Topic row */}
        <div className="grid gap-5 sm:grid-cols-2">
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

        {errors.platform && (
          <p className="text-xs text-accent">{errors.platform}</p>
        )}

        {/* Image */}
        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.15em] text-muted">
            Image <span className="text-dim normal-case tracking-normal">(optional)</span>
          </label>
          <p className="mb-3 text-xs text-dim">
            Auto-fetched from URL when available, or upload your own.
          </p>

          {imagePreview ? (
            <div className="relative inline-block">
              <Image
                src={imagePreview}
                alt="Preview"
                width={200}
                height={100}
                className="rounded-xl border border-border object-cover"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-accent/30 bg-accent text-white shadow"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border-strong bg-card/40 px-6 py-10 transition-colors hover:border-foreground/30 hover:bg-card">
              <Upload className="h-6 w-6 text-muted" strokeWidth={1.75} />
              <span className="text-sm text-foreground">
                Click to upload an image
              </span>
              <span className="text-xs text-dim">
                JPEG, PNG, GIF or WebP — up to 5MB
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
          {errors.image && (
            <p className="mt-1.5 text-xs text-accent">{errors.image}</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-7 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Add bookmark
          </button>
          <Link
            href="/dashboard"
            className="inline-flex h-12 items-center rounded-full border border-border-strong px-6 text-sm font-medium transition-colors hover:border-foreground/40"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
