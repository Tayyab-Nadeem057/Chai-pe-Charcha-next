"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";
import { placeOrder } from "@/lib/actions/orders";

export function CartWidget() {
  const path = usePathname();
  const { lines, count, total, setQty, remove, clear, open, setOpen } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ id: number; total: number } | null>(null);

  // Hide the storefront cart on admin/login (all hooks above run first).
  if (path.startsWith("/admin") || path.startsWith("/login")) return null;

  async function checkout() {
    setError("");
    setBusy(true);
    const res = await placeOrder({
      ...form,
      service: "delivery",
      items: lines.map((l) => ({ item_id: l.item_id, variant: l.variant, quantity: l.quantity })),
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setSuccess({ id: res.orderId, total });
    clear();
  }

  return (
    <>
      {/* Floating button */}
      {count > 0 && !open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-brand"
        >
          🛒 Cart
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1.5 text-sm font-bold text-brand">
            {count}
          </span>
        </button>
      )}

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white">
            <header className="flex items-center justify-between border-b p-5">
              <h2 className="font-serif text-xl font-black">Your Cart 🍽️</h2>
              <button onClick={() => setOpen(false)} className="text-2xl text-neutral-400">×</button>
            </header>

            <div className="flex-1 overflow-y-auto p-5">
              {success ? (
                <div className="py-10 text-center">
                  <div className="text-5xl">✅</div>
                  <h3 className="mt-3 font-serif text-2xl font-black">Order Placed!</h3>
                  <p className="mt-1 text-neutral-500">We&apos;re preparing it right away.</p>
                  <div className="my-5 rounded-xl bg-brand-soft p-4">
                    <div className="text-xs uppercase tracking-widest text-neutral-500">Order ID</div>
                    <div className="font-serif text-3xl font-black text-brand">#{success.id}</div>
                    <div className="mt-1 text-sm text-neutral-600">Total: Rs. {success.total}</div>
                  </div>
                  <Link href={`/track?id=${success.id}`} className="btn-brand w-full">Track My Order →</Link>
                </div>
              ) : lines.length === 0 ? (
                <p className="py-16 text-center text-neutral-400">Your cart is empty.<br />Add something delicious!</p>
              ) : (
                <div className="space-y-3">
                  {lines.map((l) => (
                    <div key={l.name} className="flex items-center gap-3 border-b pb-3">
                      <div className="flex-1">
                        <div className="font-medium">{l.name}</div>
                        <div className="text-xs text-neutral-500">Rs. {l.price} each</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setQty(l.name, -1)} className="h-7 w-7 rounded-md border">−</button>
                        <span className="w-5 text-center font-semibold">{l.quantity}</span>
                        <button onClick={() => setQty(l.name, 1)} className="h-7 w-7 rounded-md border">+</button>
                      </div>
                      <button onClick={() => remove(l.name)} className="text-neutral-400">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!success && lines.length > 0 && (
              <footer className="space-y-2 border-t bg-neutral-50 p-5">
                <div className="flex justify-between text-lg">
                  <span>Total</span>
                  <strong className="text-brand">Rs. {total}</strong>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  placeholder="Phone (03001234567)"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  placeholder="Delivery address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
                <div className="rounded-lg border px-3 py-2 text-sm text-neutral-600">💵 Cash on Delivery</div>
                <button onClick={checkout} disabled={busy} className="btn-brand w-full disabled:opacity-50">
                  {busy ? "Placing order…" : "Place Order →"}
                </button>
              </footer>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
