"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/oblien";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (email.toLowerCase() !== confirmEmail.toLowerCase()) {
      setError("Emails do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, confirmEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push("/login");
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
        <Eyebrow>Start a pile</Eyebrow>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Create your <span className="text-muted">account.</span>
        </h1>
        <p className="mt-2 text-sm text-muted">
          Free, forever. One link away from your own library.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent">
            {error}
          </div>
        )}

        <Field
          id="name"
          label="Name"
          type="text"
          value={name}
          onChange={setName}
          placeholder="Your name"
          required
        />
        <Field
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          required
        />
        <Field
          id="confirmEmail"
          label="Confirm email"
          type="email"
          value={confirmEmail}
          onChange={setConfirmEmail}
          placeholder="you@example.com"
          required
        />
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
            placeholder="At least 8 characters"
          />
          <p className="mt-1.5 text-xs text-dim">Minimum 8 characters.</p>
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
              Create account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline underline-offset-4 decoration-border-strong hover:decoration-foreground/40"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.15em] text-muted"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-dim focus:border-foreground/40"
      />
    </div>
  );
}
