"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/lib/actions/admin";

export function OrderActions({ orderId, status }: { orderId: number; status: string }) {
  const [pending, start] = useTransition();
  const [err, setErr] = useState("");

  function set(next: string) {
    setErr("");
    start(async () => {
      const res = await updateOrderStatus(orderId, next);
      if (!res.ok) setErr(res.error ?? "Failed");
    });
  }

  if (status !== "Pending") {
    return <span className="text-xs text-cream/40">—</span>;
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => set("Accepted")}
        disabled={pending}
        className="rounded-lg bg-green-500/15 px-3 py-1.5 text-xs font-semibold text-green-400 hover:bg-green-500 hover:text-white disabled:opacity-50"
      >
        ✓ Accept
      </button>
      <button
        onClick={() => set("Rejected")}
        disabled={pending}
        className="rounded-lg bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500 hover:text-white disabled:opacity-50"
      >
        ✗ Reject
      </button>
      {err && <span className="text-xs text-red-400">{err}</span>}
    </div>
  );
}
