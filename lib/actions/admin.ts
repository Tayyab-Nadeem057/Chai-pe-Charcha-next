"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const STATUSES = ["Pending", "Accepted", "Rejected"] as const;

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw new Error("Not authorized");
  return supabase;
}

export async function updateOrderStatus(orderId: number, status: string) {
  if (!STATUSES.includes(status as any)) return { ok: false, error: "Invalid status" };
  let supabase;
  try {
    supabase = await requireAdmin();
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
  // Belt and suspenders: explicit admin check above + RLS in the database below.
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
