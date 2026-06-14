"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login } from "@/lib/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-brand w-full disabled:opacity-50">
      {pending ? "Signing in…" : "Sign In"}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(login, { error: "" });

  return (
    <main className="flex min-h-screen items-center justify-center bg-coal px-4">
      <div className="w-full max-w-sm rounded-2xl border border-brand/20 bg-surface p-8 text-cream shadow-2xl">
        <h1 className="text-center font-serif text-2xl font-black">Admin Panel</h1>
        <p className="mb-6 text-center text-xs uppercase tracking-widest text-brand/70">
          Chai Pe Charcha
        </p>
        {state?.error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {state.error}
          </div>
        )}
        <form action={formAction} className="space-y-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-lg border border-brand/20 bg-coal px-4 py-3 text-sm outline-none focus:border-brand"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-lg border border-brand/20 bg-coal px-4 py-3 text-sm outline-none focus:border-brand"
          />
          <SubmitButton />
        </form>
      </div>
    </main>
  );
}
