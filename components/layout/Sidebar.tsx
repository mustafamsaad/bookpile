"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  LogOut,
  Plus,
  Layers,
  Tag,
  X,
  Menu,
} from "lucide-react";
import { PLATFORMS, PLATFORM_LABELS, TOPIC_LABELS, CURRENTCOLOR_PLATFORMS } from "@/types";
import type { Platform, Topic, Bookmark } from "@/types";
import { cn } from "@/lib/utils";

interface SidebarProps {
  bookmarks: Bookmark[];
  selectedPlatform: string;
  selectedTopic: string;
  onSelectPlatform: (platform: string) => void;
  onSelectTopic: (topic: string) => void;
}

export function Sidebar({
  bookmarks,
  selectedPlatform,
  selectedTopic,
  onSelectPlatform,
  onSelectTopic,
}: SidebarProps) {
  const { data: session } = useSession();
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);
  const [topicsExpanded, setTopicsExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const platformCounts: Record<string, number> = {};
  const platformTopicCounts: Record<string, Record<string, number>> = {};

  bookmarks.forEach((b) => {
    platformCounts[b.platform] = (platformCounts[b.platform] || 0) + 1;
    if (!platformTopicCounts[b.platform]) platformTopicCounts[b.platform] = {};
    platformTopicCounts[b.platform][b.topic] =
      (platformTopicCounts[b.platform][b.topic] || 0) + 1;
  });

  const activePlatforms = PLATFORMS.filter((p) => platformCounts[p]);

  const customPlatformIconMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const b of bookmarks) {
      if (b.platform === "other" && b.customPlatformIcon) {
        map[b.platform] = b.customPlatformIcon;
        break;
      }
    }
    return map;
  }, [bookmarks]);

  const globalTopicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    bookmarks.forEach((b) => {
      counts[b.topic] = (counts[b.topic] || 0) + 1;
    });
    return counts;
  }, [bookmarks]);

  const allTopicKeys = useMemo(() => {
    return Object.keys(globalTopicCounts).sort((a, b) => {
      return (globalTopicCounts[b] || 0) - (globalTopicCounts[a] || 0);
    });
  }, [globalTopicCounts]);

  function getTopicLabel(topic: string): string {
    return TOPIC_LABELS[topic as Topic] || topic.charAt(0).toUpperCase() + topic.slice(1);
  }

  function handlePlatformClick(platform: string) {
    if (expandedPlatform === platform) {
      setExpandedPlatform(null);
    } else {
      setExpandedPlatform(platform);
    }
    onSelectPlatform(platform);
    onSelectTopic("all");
  }

  function handlePlatformTopicClick(platform: string, topic: string) {
    onSelectPlatform(platform);
    onSelectTopic(topic);
    setMobileOpen(false);
  }

  function handleGlobalTopicClick(topic: string) {
    onSelectPlatform("all");
    onSelectTopic(topic);
    setExpandedPlatform(null);
    setMobileOpen(false);
  }

  function handleAllClick() {
    onSelectPlatform("all");
    onSelectTopic("all");
    setExpandedPlatform(null);
    setMobileOpen(false);
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={handleAllClick}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
            <BookOpen className="h-4 w-4 text-background" />
          </div>
          <span className="font-heading text-lg font-bold">BookPile</span>
        </Link>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-sidebar-hover lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Add button */}
      <div className="px-3 pt-4">
        <Link
          href="/add"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2 font-heading text-sm font-semibold text-background transition-opacity hover:opacity-80"
          onClick={() => setMobileOpen(false)}
        >
          <Plus className="h-4 w-4" />
          Add Bookmark
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {/* All Bookmarks */}
        <button
          onClick={handleAllClick}
          className={cn(
            "mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            selectedPlatform === "all" && selectedTopic === "all"
              ? "bg-sidebar-active font-medium"
              : "hover:bg-sidebar-hover"
          )}
        >
          <Layers className="h-4 w-4" />
          <span>All Bookmarks</span>
          <span className="ml-auto text-xs text-muted">{bookmarks.length}</span>
        </button>

        {/* Topics section — global, cross-platform */}
        {allTopicKeys.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setTopicsExpanded(!topicsExpanded)}
              className="mb-2 flex w-full items-center gap-1 px-3 text-xs font-medium uppercase tracking-wider text-muted"
            >
              <span>Topics</span>
              {topicsExpanded ? (
                <ChevronDown className="ml-auto h-3 w-3" />
              ) : (
                <ChevronRight className="ml-auto h-3 w-3" />
              )}
            </button>

            {topicsExpanded && (
              <div className="space-y-0.5">
                {allTopicKeys.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleGlobalTopicClick(topic)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      selectedPlatform === "all" && selectedTopic === topic
                        ? "bg-sidebar-active font-medium"
                        : "hover:bg-sidebar-hover"
                    )}
                  >
                    <Tag className="h-3.5 w-3.5 text-muted" />
                    <span>{getTopicLabel(topic)}</span>
                    <span className="ml-auto text-xs text-muted">
                      {globalTopicCounts[topic]}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Platform list */}
        {activePlatforms.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted">
              Platforms
            </p>
            {activePlatforms.map((platform) => (
              <div key={platform}>
                <button
                  onClick={() => handlePlatformClick(platform)}
                  className={cn(
                    "mb-0.5 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    selectedPlatform === platform && selectedTopic === "all"
                      ? "bg-sidebar-active font-medium"
                      : "hover:bg-sidebar-hover"
                  )}
                >
                  {customPlatformIconMap[platform] ? (
                    <Image
                      src={customPlatformIconMap[platform]}
                      alt={PLATFORM_LABELS[platform as Platform]}
                      width={16}
                      height={16}
                      className="h-4 w-4 rounded-sm object-cover"
                    />
                  ) : (
                    <Image
                      src={`/platforms/${platform}.svg`}
                      alt={PLATFORM_LABELS[platform as Platform]}
                      width={16}
                      height={16}
                      className={cn(
                        "h-4 w-4",
                        CURRENTCOLOR_PLATFORMS.includes(platform as Platform) && "icon-adaptive"
                      )}
                    />
                  )}
                  <span>{PLATFORM_LABELS[platform as Platform]}</span>
                  <span className="ml-auto flex items-center gap-1 text-xs text-muted">
                    {platformCounts[platform]}
                    {expandedPlatform === platform ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </span>
                </button>

                {/* Nested topics under this platform */}
                {expandedPlatform === platform &&
                  platformTopicCounts[platform] && (
                    <div className="mb-1 ml-7 space-y-0.5">
                      {Object.keys(platformTopicCounts[platform])
                        .sort((a, b) =>
                          (platformTopicCounts[platform][b] || 0) -
                          (platformTopicCounts[platform][a] || 0)
                        )
                        .map((topic) => (
                          <button
                            key={topic}
                            onClick={() => handlePlatformTopicClick(platform, topic)}
                            className={cn(
                              "flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs transition-colors",
                              selectedPlatform === platform &&
                                selectedTopic === topic
                                ? "bg-sidebar-active font-medium"
                                : "text-muted hover:bg-sidebar-hover hover:text-foreground"
                            )}
                          >
                            <span>{getTopicLabel(topic)}</span>
                            <span>{platformTopicCounts[platform][topic]}</span>
                          </button>
                        ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* User section */}
      {session?.user && (
        <div className="border-t border-border px-3 py-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-xs font-bold uppercase">
              {session.user.name?.[0] || "U"}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium">{session.user.name}</p>
              <p className="truncate text-xs text-muted">{session.user.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-sidebar-hover hover:text-foreground"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background lg:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-72 bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
