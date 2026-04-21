import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "accent" | "ok" | "info" | "warn" | "muted";

interface LiveBadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

const DOT_COLOR: Record<Tone, string> = {
  accent: "bg-accent",
  ok: "bg-ok",
  info: "bg-info",
  warn: "bg-warn",
  muted: "bg-muted",
};

export function LiveBadge({ children, tone = "accent", className }: LiveBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/80",
        className
      )}
    >
      <span className="relative flex size-1.5">
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-70",
            DOT_COLOR[tone]
          )}
        />
        <span
          className={cn(
            "relative inline-flex size-1.5 rounded-full",
            DOT_COLOR[tone]
          )}
        />
      </span>
      {children}
    </span>
  );
}
