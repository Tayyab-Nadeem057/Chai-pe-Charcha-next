"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const STATUSES = ["Pending", "Accepted", "Rejected"] as const;

export async function updateOrderStatus(orderId: number, status: string) {
  if (!STATUSES.includes(status as any)) return { ok: false, error: "Invalid status" };
  const supabase = createClient();
  // RLS only lets admins update — this is enforced in the database.
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
