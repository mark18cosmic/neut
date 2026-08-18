"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import { inputClass, Button } from "./ui";

export default function LoginForm({ next = "/admin" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    if (!supabaseConfigured) {
      setError("Supabase isn't connected yet — add the project keys to .env.local.");
      return;
    }
    setBusy(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setBusy(false);
      setError("That email and password don't match an account.");
      return;
    }

    router.replace(next.startsWith("/admin") ? next : "/admin");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-chrome px-5 py-16">
      {/* Slow moving island wash behind the card */}
      <div
        className="absolute inset-0 animate-kenburns opacity-70"
        style={{
          background:
            "radial-gradient(120% 120% at 25% 20%, #B79B75 0%, #5A6642 55%, #171712 100%)",
        }}
      />
      <div className="absolute inset-0 animate-drift opacity-40" style={{ background: "radial-gradient(circle at 70% 30%, rgba(251,248,241,0.25), transparent 55%)" }} />

      <div className="relative w-full max-w-sm animate-sheetUp rounded-2xl bg-ivory/95 p-8 shadow-2xl backdrop-blur">
        <div className="text-center">
          <Logo size={56} className="mx-auto animate-popIn" />
          <h1 className="wordmark mt-5 text-3xl text-olive-deep">Neut Studio</h1>
          <p className="mt-1 text-sm text-olive/55">Sign in to edit the shop.</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-3">
          <label className="block">
            <span className="eyebrow text-olive/45">Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${inputClass} mt-1.5`}
            />
          </label>
          <label className="block">
            <span className="eyebrow text-olive/45">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} mt-1.5`}
            />
          </label>

          {error && (
            <p role="alert" className="animate-popIn rounded-md bg-clay/25 px-3 py-2 text-xs text-olive-deep">
              {error}
            </p>
          )}

          <Button type="submit" busy={busy} className="w-full">
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <Link href="/" className="link-grow mt-6 block text-center text-xs text-olive/50">
          ← Back to the shop
        </Link>
      </div>
    </div>
  );
}
