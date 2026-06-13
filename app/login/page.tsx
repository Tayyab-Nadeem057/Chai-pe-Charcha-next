"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-coal px-4">
      <div className="w-full max-w-sm rounded-2xl border border-brand/20 bg-surface p-8 text-cream shadow-2xl">
        <h1 className="text-center font-serif text-2xl font-black">Admin Panel</h1>
        <p className="mb-6 text-center text-xs uppercase tracking-widest text-brand/70">
          Chai Pe Charcha
        </p>
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}
        <form onSubmit={signIn} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-brand/20 bg-coal px-4 py-3 text-sm outline-none focus:border-brand"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-brand/20 bg-coal px-4 py-3 text-sm outline-none focus:border-brand"
          />
          <button type="submit" disabled={busy} className="btn-brand w-full disabled:opacity-50">
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
