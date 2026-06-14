"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type Result = { ok: true } | { ok: false; error: string };

export async function saveCategory(formData: FormData): Promise<Result> {
  let supabase;
  try {
    supabase = await requireAdmin();
  } catch (e: any) {
    return { ok: false, error: e.message };
  }

  const existingId = (formData.get("id") as string) || "";
  const label = String(formData.get("label") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sort_order = Number(formData.get("sort_order")) || 0;
  if (!label) return { ok: false, error: "Name is required" };

  if (existingId) {
    // Edit: id (used by items) stays fixed; only update the display fields.
    const { error } = await supabase
      .from("categories")
      .update({ label, description, sort_order })
      .eq("id", existingId);
    if (error) return { ok: false, error: error.message };
  } else {
    const id = slugify(label);
    if (!id) return { ok: false, error: "Name must contain letters or numbers" };
    const { error } = await supabase
      .from("categories")
      .insert({ id, label, description, sort_order });
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/menu");
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<Result> {
  let supabase;
  try {
    supabase = await requireAdmin();
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
  // NOTE: deleting a category also deletes its items (ON DELETE CASCADE).
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/categories");
  revalidatePath("/menu");
  return { ok: true };
}
