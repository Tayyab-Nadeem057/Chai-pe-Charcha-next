"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AccountPage() {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function change(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (pw.length < 8) return setMsg({ ok: false, text: "Password must be at least 8 characters." });
    if (pw !== confirm) return setMsg({ ok: false, text: "Passwords do not match." });
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setMsg({ ok: false, text: error.message });
    setMsg({ ok: true, text: "Password updated successfully." });
    setPw("");
    setConfirm("");
  }

  return (
    <div className="max-w-md">
      <h1 className="mb-5 font-serif text-2xl font-black">Change Password</h1>
      {msg && (
        <p className={`mb-4 rounded-lg p-3 text-sm ${msg.ok ? "bg-green-500/15 text-green-300" : "bg-red-500/15 text-red-300"}`}>
          {msg.text}
        </p>
      )}
      <form onSubmit={change} className="space-y-3 rounded-2xl border border-brand/15 bg-surface p-5">
        <input
          type="password"
          placeholder="New password (min 8 characters)"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="w-full rounded-lg border border-brand/20 bg-coal px-4 py-3 text-sm"
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded-lg border border-brand/20 bg-coal px-4 py-3 text-sm"
        />
        <button type="submit" disabled={busy} className="btn-brand w-full disabled:opacity-50">
          {busy ? "Updating…" : "Update Password"}
        </button>
      </form>
    </div>
  );
}
