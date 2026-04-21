import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
}

/**
 * Infinite horizontal marquee with edge fade mask.
 * The caller is responsible for duplicating its own content so the
 * translate(-50%) loop joins seamlessly. Use like:
 *   <Marquee>
 *     <Row />
 *     <Row aria-hidden />
 *   </Marquee>
 */
export function Marquee({ children, className }: MarqueeProps) {
  return (
    <div className={cn("overflow-hidden marquee-mask", className)}>
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap md:gap-14">
        {children}
      </div>
    </div>
  );
}
