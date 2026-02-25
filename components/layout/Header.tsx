"use client";

import { Search, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

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

      <h1 className="font-heading text-lg font-bold sm:text-xl">{title}</h1>

      <div className="ml-auto flex items-center gap-3">
        <div
          className={`flex items-center rounded-lg border bg-card transition-colors ${
            focused ? "border-foreground" : "border-border"
          }`}
        >
          <Search className="ml-3 h-4 w-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search bookmarks..."
            className="w-32 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted sm:w-48 md:w-64"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="mr-2 flex h-5 w-5 items-center justify-center rounded text-muted hover:text-foreground"
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
