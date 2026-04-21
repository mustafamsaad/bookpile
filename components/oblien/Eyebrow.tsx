import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

/**
 * Small uppercase orange kicker that sits above every section headline.
 * Matches the oblien eyebrow rhythm: 12px, 500 weight, tracking 0.15em.
 */
export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "mb-5 text-xs font-medium uppercase tracking-[0.15em] text-accent",
        className
      )}
    >
      {children}
    </p>
  );
}
