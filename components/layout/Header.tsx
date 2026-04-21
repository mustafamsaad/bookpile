"use client";

import { Search, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  title: string;
}

export function Header({ search, onSearchChange, title }: HeaderProps) {
  const [focused, setFocused] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-sm sm:px-6">
      <div className="w-10 lg:hidden" />

      <div className="min-w-0">
        <p className="hidden text-[10px] font-medium uppercase tracking-[0.15em] text-muted sm:block">
          Your pile
        </p>
        <h1 className="font-heading truncate text-base font-semibold tracking-tight sm:text-lg">
          {title}
        </h1>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div
          className={cn(
            "flex items-center rounded-full border bg-card transition-colors",
            focused ? "border-border-strong" : "border-border"
          )}
        >
          <Search className="ml-3.5 h-4 w-4 text-muted" strokeWidth={1.75} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search bookmarks..."
            className="w-32 bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-dim sm:w-48 md:w-64"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="mr-2 flex h-5 w-5 items-center justify-center rounded-full text-muted hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
