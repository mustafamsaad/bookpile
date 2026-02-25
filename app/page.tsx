import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground">
          <BookOpen className="h-8 w-8 text-background" />
        </div>

        <h1 className="font-heading mb-4 text-5xl font-bold tracking-tight sm:text-6xl">
          BookPile
        </h1>

        <p className="mb-10 max-w-md text-lg text-muted">
          Your digital shelf for every bookmark. Save posts, tweets, videos, and
          links — all in one clean, organized place.
        </p>

        <div className="flex gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 font-heading text-sm font-semibold text-background transition-opacity hover:opacity-80"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 font-heading text-sm font-semibold transition-colors hover:bg-card"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
