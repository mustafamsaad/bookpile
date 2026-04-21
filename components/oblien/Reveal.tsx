"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Direction = "up" | "down" | "left" | "right";

interface RevealProps {
  children: ReactNode;
  from?: Direction;
  distance?: number;
  blur?: number;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function Reveal({
  children,
  from = "up",
  distance = 24,
  blur = 6,
  delay = 0,
  duration = 0.65,
  className,
  once = true,
}: RevealProps) {
  const reduced = useReducedMotion();

  const offset =
    from === "left"
      ? { x: -distance, y: 0 }
      : from === "right"
        ? { x: distance, y: 0 }
        : from === "down"
          ? { x: 0, y: -distance }
          : { x: 0, y: distance };

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: `blur(${blur}px)`, ...offset }}
      whileInView={{ opacity: 1, filter: "blur(0px)", x: 0, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  once?: boolean;
}

export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  once = true,
}: RevealGroupProps) {
  const reduced = useReducedMotion();

  const parent: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={parent}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  from?: Direction;
  distance?: number;
  duration?: number;
}

export function RevealItem({
  children,
  className,
  from = "up",
  distance = 20,
  duration = 0.6,
}: RevealItemProps) {
  const offset =
    from === "left"
      ? { x: -distance, y: 0 }
      : from === "right"
        ? { x: distance, y: 0 }
        : from === "down"
          ? { x: 0, y: -distance }
          : { x: 0, y: distance };

  const child: Variants = {
    hidden: { opacity: 0, filter: "blur(5px)", ...offset },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: { duration, ease: EASE },
    },
  };

  return (
    <motion.div className={className} variants={child}>
      {children}
    </motion.div>
  );
}
