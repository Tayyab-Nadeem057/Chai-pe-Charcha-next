import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/admin";

// Server-side role guard. middleware.ts already requires a session; here we
// confirm the user is actually an ADMIN (defense in depth — RLS also enforces it).
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-coal text-cream">
        <div className="text-center">
          <p className="text-lg">This account is not an admin.</p>
          <form action={signOut}>
            <button className="mt-4 text-brand underline">Sign out</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-coal text-cream">
      <aside className="flex w-56 flex-col border-r border-brand/15 bg-surface p-4">
        <div className="mb-6">
          <h2 className="font-serif text-lg font-black text-brand">Chai Pe Charcha</h2>
          <p className="text-[0.65rem] uppercase tracking-widest text-cream/40">Admin Dashboard</p>
        </div>
        <nav className="flex flex-col gap-1 text-sm">
          <Link href="/admin" className="rounded-lg px-3 py-2 hover:bg-white/5">📋 Orders</Link>
          <Link href="/admin/menu" className="rounded-lg px-3 py-2 hover:bg-white/5">🍽️ Menu</Link>
          <Link href="/admin/categories" className="rounded-lg px-3 py-2 hover:bg-white/5">🗂️ Categories</Link>
          <Link href="/admin/account" className="rounded-lg px-3 py-2 hover:bg-white/5">🔒 Change Password</Link>
        </nav>
        <div className="mt-auto">
          <p className="px-3 text-xs text-cream/40">Logged in as</p>
          <p className="px-3 text-sm font-semibold">{profile?.name ?? "Admin"}</p>
          <form action={signOut}>
            <button className="mt-2 w-full rounded-lg border border-brand/20 px-3 py-2 text-sm text-cream/70 hover:bg-white/5">
              ↩ Logout
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-x-auto p-6">{children}</main>
    </div>
  );
}
