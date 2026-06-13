"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Verify the caller is an admin before any trusted operation (image upload uses
// the service-role key, which bypasses RLS — so we must gate it ourselves).
async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") throw new Error("Not authorized");
  return supabase;
}

type Result = { ok: true } | { ok: false; error: string };

export async function saveItem(formData: FormData): Promise<Result> {
  let supabase;
  try {
    supabase = await requireAdmin();
  } catch (e: any) {
    return { ok: false, error: e.message };
  }

  const id = formData.get("id") ? Number(formData.get("id")) : null;
  const name = String(formData.get("name") ?? "").trim();
  const price = Number(formData.get("price"));
  const category_id = String(formData.get("category_id") ?? "");

  if (!name) return { ok: false, error: "Name is required" };
  if (!category_id) return { ok: false, error: "Category is required" };
  if (isNaN(price) || price < 0) return { ok: false, error: "Valid price required" };

  // Optional image upload to Supabase Storage.
  let image_url = (formData.get("existing_image") as string) || null;
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    if (file.size > 6 * 1024 * 1024) return { ok: false, error: "Image too large (max 6 MB)" };
    const admin = createAdminClient();
    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await admin.storage
      .from("menu-images")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (upErr) return { ok: false, error: "Upload failed: " + upErr.message };
    image_url = admin.storage.from("menu-images").getPublicUrl(path).data.publicUrl;
  }

  const row = {
    name,
    price,
    category_id,
    image_url,
    dine_in: formData.get("dine_in") === "on",
    takeaway: formData.get("takeaway") === "on",
    delivery: formData.get("delivery") === "on",
    is_active: formData.get("is_active") === "on",
    sold_out: formData.get("sold_out") === "on",
    is_featured: formData.get("is_featured") === "on",
    updated_at: new Date().toISOString(),
  };

  const { error } = id
    ? await supabase.from("menu_items").update(row).eq("id", id)
    : await supabase.from("menu_items").insert(row);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  return { ok: true };
}

export async function deleteItem(id: number): Promise<Result> {
  let supabase;
  try {
    supabase = await requireAdmin();
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  return { ok: true };
}

const TOGGLES = ["is_active", "sold_out", "is_featured"] as const;
export async function toggleItem(id: number, field: string, value: boolean): Promise<Result> {
  if (!TOGGLES.includes(field as any)) return { ok: false, error: "Invalid field" };
  let supabase;
  try {
    supabase = await requireAdmin();
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
  const { error } = await supabase.from("menu_items").update({ [field]: value }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  return { ok: true };
}
