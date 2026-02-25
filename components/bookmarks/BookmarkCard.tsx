"use client";

import Image from "next/image";
import { ExternalLink, Trash2, Pencil } from "lucide-react";
import type { Bookmark, Platform, Topic } from "@/types";
import { PLATFORM_LABELS, PLATFORM_COLORS, TOPIC_LABELS, CURRENTCOLOR_PLATFORMS, LIGHT_BG_IN_DARK_PLATFORMS } from "@/types";
import { truncateText, cn } from "@/lib/utils";

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  onEdit: (bookmark: Bookmark) => void;
}

export function BookmarkCard({ bookmark, onDelete, onEdit }: BookmarkCardProps) {
  const platformLabel =
    bookmark.platform === "other" && bookmark.customPlatformName
      ? bookmark.customPlatformName
      : PLATFORM_LABELS[bookmark.platform as Platform] || bookmark.platform;

  const platformColor =
    PLATFORM_COLORS[bookmark.platform as Platform] || PLATFORM_COLORS.other;

  const topicLabel =
    TOPIC_LABELS[bookmark.topic as Topic] ||
    bookmark.topic.charAt(0).toUpperCase() + bookmark.topic.slice(1);

  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:border-border hover:bg-card-hover hover:shadow-md dark:hover:shadow-none"
    >
      {/* Image */}
      <div className="relative aspect-[2/1] w-full overflow-hidden bg-card">
        {bookmark.image ? (
          <Image
            src={bookmark.image}
            alt={bookmark.headline}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            {bookmark.customPlatformIcon ? (
              <Image
                src={bookmark.customPlatformIcon}
                alt={platformLabel}
                width={40}
                height={40}
                className="opacity-30 object-contain"
              />
            ) : (
              <Image
                src={`/platforms/${bookmark.platform}.svg`}
                alt={platformLabel}
                width={40}
                height={40}
                className={cn(
                  "opacity-20",
                  CURRENTCOLOR_PLATFORMS.includes(bookmark.platform as Platform) && "icon-adaptive"
                )}
              />
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-sm font-semibold leading-snug line-clamp-2">
          {bookmark.headline}
        </h3>

        {bookmark.content && (
          <p className="mt-1.5 text-xs leading-relaxed text-muted line-clamp-2">
            {truncateText(bookmark.content, 120)}
          </p>
        )}

        {/* Tags */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-card-hover px-2.5 py-0.5 text-[11px] font-medium">
            {topicLabel}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
              LIGHT_BG_IN_DARK_PLATFORMS.includes(bookmark.platform as Platform)
                ? "text-background"
                : "text-white"
            )}
            style={{ backgroundColor: platformColor }}
          >
            {bookmark.customPlatformIcon && (
              <Image
                src={bookmark.customPlatformIcon}
                alt=""
                width={12}
                height={12}
                className="h-3 w-3 rounded-sm object-cover"
              />
            )}
            {platformLabel}
          </span>
        </div>
      </div>

      {/* Actions overlay — stopPropagation prevents card navigation */}
      <div
        className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => e.preventDefault()}
      >
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-background/90 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-background"
          title="Open link"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(bookmark); }}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-background/90 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-background"
          title="Edit"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(bookmark._id); }}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-red-500/90 text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-red-600"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </a>
  );
}
