"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface CounterProps {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

export function Counter({
  to,
  duration = 1.4,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setV(latest),
    });
    return () => c.stop();
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {prefix}
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
}
