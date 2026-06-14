import { createClient } from "@/lib/supabase/server";
import { OrderActions } from "@/components/admin/OrderActions";

export const dynamic = "force-dynamic"; // always show the latest orders

type OrderRow = {
  id: number;
  guest_name: string;
  guest_phone: string;
  delivery_address: string | null;
  service: string;
  status: string;
  total_price: number;
  created_at: string;
  order_items: { item_name: string; quantity: number }[];
};

const pill: Record<string, string> = {
  Pending: "bg-yellow-500/15 text-yellow-400",
  Accepted: "bg-green-500/15 text-green-400",
  Rejected: "bg-red-500/15 text-red-400",
};

export default async function AdminOrdersPage() {
  const supabase = createClient();
  // Counts are cheap (head-only); the table loads just the 100 most recent.
  const [list, totalRes, pendingRes, acceptedRes, rejectedRes] = await Promise.all([
    supabase
      .from("orders")
      .select("*, order_items(item_name, quantity)")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "Pending"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "Accepted"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "Rejected"),
  ]);

  const orders = (list.data ?? []) as OrderRow[];
  const counts = {
    total: totalRes.count ?? 0,
    pending: pendingRes.count ?? 0,
    accepted: acceptedRes.count ?? 0,
    rejected: rejectedRes.count ?? 0,
  };

  return (
    <div>
      <h1 className="mb-5 font-serif text-2xl font-black">All Orders</h1>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { l: "Total", v: counts.total, c: "text-brand" },
          { l: "Pending", v: counts.pending, c: "text-yellow-400" },
          { l: "Accepted", v: counts.accepted, c: "text-green-400" },
          { l: "Rejected", v: counts.rejected, c: "text-red-400" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-brand/15 bg-surface p-4">
            <div className={`font-serif text-3xl font-black ${s.c}`}>{s.v}</div>
            <div className="text-xs uppercase tracking-wider text-cream/40">{s.l}</div>
          </div>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="py-16 text-center text-cream/40">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-brand/15 bg-surface">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-cream/40">
              <tr className="border-b border-white/5">
                <th className="p-3">#</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-white/5">
                  <td className="p-3 font-bold text-brand">#{o.id}</td>
                  <td className="p-3">
                    <div className="font-semibold">{o.guest_name}</div>
                    <div className="text-xs text-cream/50">{o.guest_phone}</div>
                    <div className="text-xs text-cream/40">{o.delivery_address}</div>
                  </td>
                  <td className="p-3 text-cream/70">
                    {o.order_items.map((i, n) => (
                      <div key={n}>{i.item_name} ×{i.quantity}</div>
                    ))}
                  </td>
                  <td className="p-3 font-bold text-brand">Rs. {o.total_price}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${pill[o.status] ?? ""}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <OrderActions orderId={o.id} status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
