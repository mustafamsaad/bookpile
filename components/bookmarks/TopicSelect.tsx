"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Plus, Tag, X } from "lucide-react";
import { TOPICS, TOPIC_LABELS } from "@/types";
import type { Topic } from "@/types";
import { cn } from "@/lib/utils";

interface TopicSelectProps {
  value: string;
  customTopics: string[];
  onChange: (topic: string) => void;
  onDeleteTopic?: (topic: string) => void;
}

export function TopicSelect({ value, customTopics, onChange, onDeleteTopic }: TopicSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const defaultOptions = TOPICS.map((t) => ({
    value: t,
    label: TOPIC_LABELS[t],
    isDefault: true,
  }));

  const customOptions = customTopics
    .filter((ct) => !TOPICS.includes(ct as Topic))
    .map((ct) => ({ value: ct, label: ct, isDefault: false }));

  const allOptions = [...defaultOptions, ...customOptions];

  const filtered = query
    ? allOptions.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase())
      )
    : allOptions;

  const queryTrimmed = query.trim();
  const exactMatch = allOptions.some(
    (o) => o.label.toLowerCase() === queryTrimmed.toLowerCase() || o.value.toLowerCase() === queryTrimmed.toLowerCase()
  );
  const showCreateOption = queryTrimmed.length > 0 && !exactMatch;

  const displayLabel = TOPIC_LABELS[value as Topic] || value || "Select topic";

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.15em] text-muted">
        Topic
      </label>

      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          if (!open) setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-left text-sm transition-colors",
          open ? "border-foreground/40" : ""
        )}
      >
        <Tag className="h-4 w-4 text-muted" strokeWidth={1.75} />
        <span className="flex-1">{displayLabel}</span>
        <ChevronDown className={cn("h-4 w-4 text-muted transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 z-20 mb-1.5 w-full rounded-2xl border border-border bg-background shadow-[0_20px_40px_-15px_rgba(0,0,0,0.35)]">
          <div className="max-h-56 overflow-y-auto px-1 pt-1">
            {showCreateOption && (
              <button
                type="button"
                onClick={() => {
                  onChange(queryTrimmed);
                  setQuery("");
                  setOpen(false);
                }}
                className="mb-0.5 flex w-full items-center gap-3 rounded-lg border border-dashed border-border-strong px-3 py-2 text-left text-sm transition-colors hover:border-foreground/30 hover:bg-card-hover"
              >
                <Plus className="h-4 w-4 text-accent" strokeWidth={1.75} />
                <span>
                  Create &ldquo;<span className="font-medium">{queryTrimmed}</span>&rdquo;
                </span>
              </button>
            )}

            {filtered.length === 0 && !showCreateOption ? (
              <div className="px-3 py-2 text-sm text-muted">No topics found</div>
            ) : (
              filtered.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center rounded-lg transition-colors hover:bg-card-hover",
                    value === option.value && "bg-card font-medium"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setQuery("");
                      setOpen(false);
                    }}
                    className="flex flex-1 items-center gap-3 px-3 py-2 text-left text-sm"
                  >
                    <Tag className="h-4 w-4 text-muted" strokeWidth={1.75} />
                    <span>{option.label}</span>
                  </button>

                  {!option.isDefault && onDeleteTopic && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTopic(option.value);
                      }}
                      className="mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-accent/10 hover:text-accent"
                      title="Delete topic"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="border-t border-border p-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && showCreateOption) {
                  e.preventDefault();
                  onChange(queryTrimmed);
                  setQuery("");
                  setOpen(false);
                }
              }}
              placeholder="Search or type a new topic..."
              className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none placeholder:text-dim focus:border-foreground/40"
            />
          </div>
        </div>
      )}
    </div>
  );
}
