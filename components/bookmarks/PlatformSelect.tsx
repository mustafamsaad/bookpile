"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, Plus, Upload, X } from "lucide-react";
import { PLATFORMS, PLATFORM_LABELS, CURRENTCOLOR_PLATFORMS } from "@/types";
import type { Platform } from "@/types";
import { cn } from "@/lib/utils";

export interface CustomPlatformEntry {
  name: string;
  icon?: string;
  color?: string;
}

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#22c55e", "#14b8a6",
  "#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#6b7280",
];

interface PlatformSelectProps {
  value: string;
  customName: string;
  customPlatforms: CustomPlatformEntry[];
  iconPreview: string;
  colorPreview: string;
  onChange: (platform: string) => void;
  onCustomNameChange: (name: string) => void;
  onIconChange: (iconUrl: string) => void;
  onColorChange: (color: string) => void;
}

export function PlatformSelect({
  value,
  customName,
  customPlatforms,
  iconPreview,
  colorPreview,
  onChange,
  onCustomNameChange,
  onIconChange,
  onColorChange,
}: PlatformSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allOptions = [
    ...PLATFORMS.filter((p) => p !== "other").map((p) => ({
      id: p,
      label: PLATFORM_LABELS[p],
    })),
    ...customPlatforms.map((cp) => ({
      id: "other" as const,
      label: cp.name,
      isCustom: true,
      icon: cp.icon,
      color: cp.color,
    })),
    { id: "other" as const, label: "Other (custom)" },
  ];

  const filtered = query
    ? allOptions.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase())
      )
    : allOptions;

  const selectedLabel =
    value === "other" && customName
      ? customName
      : PLATFORM_LABELS[value as Platform] || value;

  async function handleIconUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        onIconChange(data.url);
      }
    } catch {
      /* silently fail */
    } finally {
      setUploading(false);
      if (iconInputRef.current) iconInputRef.current.value = "";
    }
  }

  function handleSelectCustom(cp: CustomPlatformEntry) {
    onChange("other");
    onCustomNameChange(cp.name);
    onIconChange(cp.icon || "");
    onColorChange(cp.color || PRESET_COLORS[9]);
  }

  const showTriggerIcon = value && value !== "other";
  const showCustomTriggerIcon = value === "other" && iconPreview;

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1.5 block text-sm font-medium">Platform</label>

      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          if (!open) setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5 text-left text-sm transition-colors",
          open ? "border-foreground" : ""
        )}
      >
        {showTriggerIcon && (
          <Image
            src={`/platforms/${value}.svg`}
            alt=""
            width={16}
            height={16}
            className={cn(
              "h-4 w-4",
              CURRENTCOLOR_PLATFORMS.includes(value as Platform) && "icon-adaptive"
            )}
          />
        )}
        {showCustomTriggerIcon && (
          <Image
            src={iconPreview}
            alt=""
            width={16}
            height={16}
            className="h-4 w-4 rounded-sm object-cover"
          />
        )}
        {value === "other" && !iconPreview && colorPreview && (
          <span
            className="h-4 w-4 rounded-sm"
            style={{ backgroundColor: colorPreview }}
          />
        )}
        <span className="flex-1">{selectedLabel}</span>
        <ChevronDown className={cn("h-4 w-4 text-muted transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-full rounded-lg border border-border bg-background shadow-lg">
          <div className="p-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search platforms..."
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-foreground"
            />
          </div>

          <div className="max-h-48 overflow-y-auto px-1 pb-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted">No results found</div>
            ) : (
              filtered.map((option, idx) => (
                <button
                  key={`${option.id}-${idx}`}
                  type="button"
                  onClick={() => {
                    if ("isCustom" in option && option.isCustom) {
                      handleSelectCustom({
                        name: option.label,
                        icon: "icon" in option ? option.icon : undefined,
                        color: "color" in option ? option.color : undefined,
                      });
                    } else if (option.id === "other") {
                      onChange("other");
                      onCustomNameChange("");
                      onIconChange("");
                      onColorChange(PRESET_COLORS[9]);
                    } else {
                      onChange(option.id);
                      onCustomNameChange("");
                      onIconChange("");
                      onColorChange("");
                    }
                    setQuery("");
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-card-hover",
                    value === option.id && "bg-card font-medium"
                  )}
                >
                  {option.id !== "other" ? (
                    <Image
                      src={`/platforms/${option.id}.svg`}
                      alt=""
                      width={16}
                      height={16}
                      className={cn(
                        "h-4 w-4",
                        CURRENTCOLOR_PLATFORMS.includes(option.id as Platform) && "icon-adaptive"
                      )}
                    />
                  ) : "icon" in option && option.icon ? (
                    <Image
                      src={option.icon}
                      alt=""
                      width={16}
                      height={16}
                      className="h-4 w-4 rounded-sm object-cover"
                    />
                  ) : "color" in option && option.color ? (
                    <span
                      className="h-4 w-4 rounded-sm"
                      style={{ backgroundColor: option.color }}
                    />
                  ) : (
                    <Plus className="h-4 w-4 text-muted" />
                  )}
                  <span>{option.label}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {value === "other" && (
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2">
            {/* Icon upload */}
            <div className="shrink-0">
              {iconPreview ? (
                <div className="relative">
                  <Image
                    src={iconPreview}
                    alt="Platform icon"
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-lg border border-border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onIconChange("")}
                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ) : (
                <label
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors hover:border-muted hover:bg-card",
                    uploading && "opacity-50"
                  )}
                >
                  <Upload className="h-3.5 w-3.5 text-muted" />
                  <input
                    ref={iconInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                    className="hidden"
                    onChange={handleIconUpload}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>

            {/* Platform name */}
            <input
              type="text"
              value={customName}
              onChange={(e) => onCustomNameChange(e.target.value)}
              placeholder="Enter platform name..."
              className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none transition-colors focus:border-foreground"
            />
          </div>

          {/* Color picker */}
          <div>
            <p className="mb-1.5 text-xs text-muted">Tag color</p>
            <div className="flex flex-wrap items-center gap-1.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onColorChange(c)}
                  className={cn(
                    "h-6 w-6 rounded-full transition-all",
                    colorPreview === c
                      ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                      : "hover:scale-110"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
