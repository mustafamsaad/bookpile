import Link from "next/link";
import { Bookmark } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="section-cream relative flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background">
            <Bookmark className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="text-base font-semibold tracking-tight">BookPile</span>
        </Link>
        <Link
          href="/"
          className="text-xs font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:text-foreground"
        >
          ← Back home
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pb-16 pt-6 md:px-10">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card/60 p-8 shadow-[0_20px_60px_-30px_rgba(10,8,8,0.25)] backdrop-blur-sm md:p-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
