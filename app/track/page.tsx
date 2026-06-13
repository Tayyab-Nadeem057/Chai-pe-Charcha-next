"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type OrderInfo = {
  id: number;
  status: string;
  guest_name?: string;
  total_price?: number;
  items?: { item_name: string; quantity: number }[];
};

function TrackInner() {
  const params = useSearchParams();
  const [id, setId] = useState(params.get("id") ?? "");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [msg, setMsg] = useState("");

  async function lookup(orderId: string, ph: string) {
    setMsg("");
    setOrder(null);
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_order", {
      p_id: Number(orderId),
      p_phone: ph,
    });
    if (error || !data) {
      setMsg("Order not found. Check the ID.");
      return;
    }
    setOrder(data as OrderInfo);
  }

  // Auto-lookup status if an id is in the URL.
  useEffect(() => {
    if (id) lookup(id, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusColor =
    order?.status === "Accepted" ? "text-green-600" : order?.status === "Rejected" ? "text-red-600" : "text-brand";

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="font-serif text-3xl font-black text-ink">Track Your Order</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Enter your order ID. Add your phone number to see full details.
      </p>

      <div className="mt-6 space-y-3">
        <input
          className="w-full rounded-lg border px-3 py-2"
          placeholder="Order ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          className="w-full rounded-lg border px-3 py-2"
          placeholder="Phone (optional, for full details)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={() => lookup(id, phone)} className="btn-brand w-full">
          Check Status
        </button>
      </div>

      {msg && <p className="mt-4 text-sm text-red-500">{msg}</p>}

      {order && (
        <div className="mt-6 rounded-2xl border border-neutral-200 p-5">
          <div className="text-sm text-neutral-500">Order #{order.id}</div>
          <div className={`font-serif text-2xl font-black ${statusColor}`}>{order.status}</div>
          {order.items && (
            <ul className="mt-3 space-y-1 text-sm text-neutral-600">
              {order.items.map((i, n) => (
                <li key={n}>{i.item_name} × {i.quantity}</li>
              ))}
            </ul>
          )}
          {order.total_price != null && (
            <div className="mt-3 font-bold text-brand">Total: Rs. {order.total_price}</div>
          )}
        </div>
      )}
    </main>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-neutral-400">Loading…</div>}>
      <TrackInner />
    </Suspense>
  );
}
