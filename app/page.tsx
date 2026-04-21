import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Bookmark,
  Search,
  Sparkles,
  Tags,
  Layers,
  Image as ImageIcon,
  Moon,
  Lock,
  Filter,
  Rocket,
  LayoutGrid,
  Pencil,
  Zap,
} from "lucide-react";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  Eyebrow,
  LiveBadge,
  Marquee,
  Counter,
} from "@/components/oblien";

const MARQUEE_PLATFORMS = [
  { id: "facebook", label: "Facebook" },
  { id: "x", label: "X" },
  { id: "reddit", label: "Reddit" },
  { id: "youtube", label: "YouTube" },
  { id: "instagram", label: "Instagram" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "github", label: "GitHub" },
  { id: "pinterest", label: "Pinterest" },
  { id: "tiktok", label: "TikTok" },
  { id: "medium", label: "Medium" },
  { id: "stackoverflow", label: "Stack Overflow" },
];

const VALUE_CARDS = [
  {
    title: "Paste a link, get a card.",
    body: "Drop any URL. Open Graph data — title, description, cover image — is pulled in one round-trip so your pile is readable at a glance.",
    icon: Bookmark,
  },
  {
    title: "Tagged by platform.",
    body: "X, YouTube, Reddit, GitHub, and the rest are recognised automatically with brand colours and icons. Unknown domain? Roll your own.",
    icon: Tags,
  },
  {
    title: "Topics you actually use.",
    body: "Tech, Programming, Design — or whatever you type in the create field. Topics are stored per user and never leak across accounts.",
    icon: Layers,
  },
  {
    title: "Search that feels instant.",
    body: "Every keystroke filters the pile client-side. No reloads. No spinner. Just your stuff, narrower.",
    icon: Search,
  },
];

const FEATURE_CARDS = [
  { title: "Automatic OG data", body: "Titles, descriptions, cover images — all pulled from the page itself.", icon: Sparkles },
  { title: "Custom platforms", body: "Add a Bluesky, a Substack, anything. Upload an icon, pick a colour.", icon: LayoutGrid },
  { title: "Custom topics", body: "Type a name, it's a topic. Delete it when it stops being useful.", icon: Tags },
  { title: "Per-platform drill-in", body: "Click Reddit in the sidebar — see only Reddit. Expand it, filter by topic.", icon: Filter },
  { title: "Upload your own cover", body: "Auto-fetched image wrong? Drop in a replacement up to 5MB.", icon: ImageIcon },
  { title: "Dark & light", body: "A warm cream sheet or a near-black page. Your choice, saved locally.", icon: Moon },
  { title: "Private by default", body: "Sessions signed with your AUTH_SECRET. Bookmarks scoped to you.", icon: Lock },
  { title: "Keyboard-first edits", body: "Pencil to edit, escape to close. No mouse needed if you don't want one.", icon: Pencil },
  { title: "Zero-setup deploys", body: "Ships to Vercel with three env vars. MongoDB connection, secret, URL.", icon: Rocket },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Paste the link.",
    body: "BookPile reads the page headers and extracts a title, a description, and a cover image.",
  },
  {
    step: "02",
    title: "Tag it — or don't.",
    body: "Platforms are detected. Topics are one keystroke away. Adjust anything before saving.",
  },
  {
    step: "03",
    title: "Come back to it.",
    body: "Your pile sorts by date, filters by platform or topic, and searches in real time.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* ================================================================ */}
      {/* NAV                                                              */}
      {/* ================================================================ */}
      <header className="section-cream sticky top-0 z-40 border-b border-border/60 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-10">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background">
              <Bookmark className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="text-base font-semibold tracking-tight">BookPile</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
            <a href="#platforms" className="transition-colors hover:text-foreground">Platforms</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden h-10 items-center rounded-full px-4 text-sm font-medium text-muted transition-colors hover:text-foreground sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
            >
              Get started
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ================================================================ */}
      {/* HERO (cream)                                                     */}
      {/* ================================================================ */}
      <section className="section-cream relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
          <Reveal className="mx-auto max-w-3xl text-center">
            <LiveBadge tone="accent" className="mx-auto mb-8">
              Your pile, in one place
            </LiveBadge>

            <h1 className="font-heading text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.02] tracking-tight">
              A quiet home for{" "}
              <span className="text-accent">every link you save</span>.
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
              Paste a URL. Keep the thought. BookPile turns your scattered tabs into a
              single, organised pile — searchable, tagged, yours.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-7 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
              >
                Start your pile
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border-strong px-7 text-sm font-medium text-foreground transition-colors hover:border-foreground/40"
              >
                I already have an account
              </Link>
            </div>
          </Reveal>

          {/* Hero mock card — a single bookmark rendered in the product's own style */}
          <Reveal delay={0.15} className="mx-auto mt-20 max-w-3xl">
            <HeroMock />
          </Reveal>
        </div>

        {/* Logo marquee */}
        <div className="border-t border-border pb-16 pt-14" id="platforms">
          <p className="mb-8 text-center text-[11px] font-medium uppercase tracking-[0.15em] text-muted">
            Works with the platforms you already use
          </p>
          <Marquee>
            <PlatformRow />
            <PlatformRow aria-hidden />
          </Marquee>
        </div>
      </section>

      {/* ================================================================ */}
      {/* WHAT YOU GET — numbered value cards (dark)                       */}
      {/* ================================================================ */}
      <section className="section-dark bg-dot-night relative" id="features">
        <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <Eyebrow>What you get</Eyebrow>
            <h2 className="font-heading text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight">
              Four moves between a link and{" "}
              <span className="text-muted">a library.</span>
            </h2>
            <p className="mt-4 text-base text-muted md:text-lg">
              Not a read-later app. Not a Notion page. A small, opinionated tool
              that turns URLs into browseable cards — nothing more, nothing less.
            </p>
          </Reveal>

          <RevealGroup className="grid gap-4 md:grid-cols-2">
            {VALUE_CARDS.map((card, i) => (
              <RevealItem key={card.title}>
                <ValueCard
                  index={String(i + 1).padStart(2, "0")}
                  title={card.title}
                  body={card.body}
                  Icon={card.icon}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ================================================================ */}
      {/* HOW IT WORKS (cream)                                             */}
      {/* ================================================================ */}
      <section className="section-cream relative" id="how">
        <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="font-heading text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight">
              Three steps. No{" "}
              <span className="text-muted">folder trees.</span>
            </h2>
          </Reveal>

          <RevealGroup className="grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <RevealItem key={step.step}>
                <article className="group relative h-full rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:-translate-y-0.5 hover:border-border-strong">
                  <div className="mb-8 flex items-center gap-3">
                    <span className="inline-flex h-8 items-center rounded-full border border-border px-3 text-[11px] font-medium uppercase tracking-[0.15em] text-muted">
                      Step {step.step}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                  <span className="pointer-events-none absolute bottom-4 right-6 select-none font-heading text-7xl font-bold text-foreground/[0.05]">
                    {step.step}
                  </span>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FEATURE GRID (dark)                                              */}
      {/* ================================================================ */}
      <section className="section-dark bg-grid-night">
        <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <Eyebrow>Everything inside</Eyebrow>
            <h2 className="font-heading text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight">
              Small, sharp,{" "}
              <span className="text-muted">out of the way.</span>
            </h2>
            <p className="mt-4 text-base text-muted md:text-lg">
              Nine things BookPile does well. No email digests. No
              AI-summaries. No second app.
            </p>
          </Reveal>

          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURE_CARDS.map((f) => (
              <RevealItem key={f.title}>
                <article className="group h-full rounded-2xl border border-border bg-card p-6 transition-all duration-500 hover:-translate-y-0.5 hover:border-border-strong">
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card-hover">
                    <f.icon className="h-4 w-4 text-foreground" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-heading text-base font-semibold tracking-tight">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {f.body}
                  </p>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ================================================================ */}
      {/* STATS STRIP (cream)                                              */}
      {/* ================================================================ */}
      <section className="section-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24">
          <RevealGroup className="grid gap-10 text-center sm:grid-cols-3">
            <RevealItem>
              <Stat
                value={<Counter to={11} suffix="+" />}
                label="Platforms recognised"
              />
            </RevealItem>
            <RevealItem>
              <Stat
                value={<Counter to={500} />}
                label="Characters per preview"
              />
            </RevealItem>
            <RevealItem>
              <Stat
                value={<Counter to={1} suffix=" URL → 1 card" />}
                label="Paste-to-pile"
              />
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FINAL CTA (dark)                                                 */}
      {/* ================================================================ */}
      <section className="section-dark">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center md:px-10 md:py-32">
          <Reveal>
            <Eyebrow className="text-center">Ready when you are</Eyebrow>
            <h2 className="font-heading text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.05] tracking-tight">
              Stop losing good links.{" "}
              <span className="text-accent">Start a pile.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base text-muted md:text-lg">
              Free to use. One account, every bookmark, forever.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-7 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
              >
                Create your account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border-strong px-7 text-sm font-medium text-foreground transition-colors hover:border-foreground/40"
              >
                Sign in
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FOOTER                                                           */}
      {/* ================================================================ */}
      <footer className="section-dark border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background">
              <Bookmark className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="text-sm font-semibold tracking-tight">BookPile</span>
            <span className="ml-3 text-xs text-muted">
              A quiet home for every link you save.
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted">
            <Link href="/login" className="transition-colors hover:text-foreground">
              Log in
            </Link>
            <Link href="/signup" className="transition-colors hover:text-foreground">
              Sign up
            </Link>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ------------------------------------------------------------------------ */
/* Local building blocks                                                    */
/* ------------------------------------------------------------------------ */

function HeroMock() {
  return (
    <div className="relative mx-auto rounded-2xl border border-border bg-card-hover/70 p-3 shadow-[0_20px_60px_-20px_rgba(10,8,8,0.25)]">
      {/* faux browser chrome */}
      <div className="mb-3 flex items-center gap-1.5 px-2">
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        <span className="ml-3 inline-flex h-6 items-center rounded-full border border-border bg-background px-3 text-[11px] text-muted">
          bookpile.app/dashboard
        </span>
        <span className="ml-auto">
          <LiveBadge tone="ok">Live</LiveBadge>
        </span>
      </div>

      <div className="grid gap-3 rounded-xl border border-border bg-background p-4 sm:grid-cols-3">
        {[
          { title: "A small weekend project turned into a real SaaS", plat: "github", tone: "#333333" },
          { title: "Why the world's best engineers write less code", plat: "medium", tone: "#0a0807" },
          { title: "The 20-minute guide to CSS cascade layers", plat: "x", tone: "#0a0807" },
        ].map((c) => (
          <div
            key={c.title}
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            <div className="flex aspect-[2/1] items-center justify-center bg-card-hover">
              <Zap className="h-8 w-8 text-foreground/20" strokeWidth={1.5} />
            </div>
            <div className="p-3">
              <h4 className="line-clamp-2 font-heading text-xs font-semibold leading-snug">
                {c.title}
              </h4>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-card-hover px-2 py-0.5 text-[10px] font-medium text-foreground">
                  Tech
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                  style={{ backgroundColor: c.tone }}
                >
                  {c.plat}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ValueCard({
  index,
  title,
  body,
  Icon,
}: {
  index: string;
  title: string;
  body: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  return (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:-translate-y-0.5 hover:border-border-strong">
      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card-hover">
        <Icon className="h-4 w-4 text-foreground" strokeWidth={1.75} />
      </div>
      <h3 className="font-heading text-xl font-semibold tracking-tight">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{body}</p>

      <span className="pointer-events-none absolute bottom-4 right-6 select-none font-heading text-7xl font-bold text-foreground/[0.04] transition-colors duration-500 group-hover:text-foreground/[0.08]">
        {index}
      </span>
    </article>
  );
}

function Stat({
  value,
  label,
}: {
  value: React.ReactNode;
  label: string;
}) {
  return (
    <div>
      <div className="font-heading text-5xl font-bold tracking-tight text-accent md:text-6xl">
        {value}
      </div>
      <div className="mt-2 text-[11px] font-medium uppercase tracking-[0.15em] text-muted">
        {label}
      </div>
    </div>
  );
}

function PlatformRow(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex shrink-0 items-center gap-10 md:gap-14" {...props}>
      {MARQUEE_PLATFORMS.map((p) => (
        <div
          key={p.id + (props["aria-hidden"] ? "-b" : "-a")}
          className="flex items-center gap-2.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          <Image
            src={`/platforms/${p.id}.svg`}
            alt={p.label}
            width={18}
            height={18}
            className="icon-adaptive h-[18px] w-[18px] opacity-60"
          />
          <span>{p.label}</span>
        </div>
      ))}
    </div>
  );
}
