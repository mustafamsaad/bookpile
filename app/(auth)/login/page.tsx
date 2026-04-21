"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/oblien";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Eyebrow>Welcome back</Eyebrow>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Log in to your <span className="text-muted">pile.</span>
        </h1>
        <p className="mt-2 text-sm text-muted">
          Sign in to pick up where you left off.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.15em] text-muted"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-dim focus:border-foreground/40"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.15em] text-muted"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-dim focus:border-foreground/40"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-foreground underline underline-offset-4 decoration-border-strong hover:decoration-foreground/40"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
