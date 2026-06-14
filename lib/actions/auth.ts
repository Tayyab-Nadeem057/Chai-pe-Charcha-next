"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Server-side login. Runs without relying on client hydration, and the Supabase
// server client writes the session cookie directly — so the redirect to /admin
// always sees a valid session.
export async function login(_prev: { error: string }, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email and password are required." };

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  redirect("/admin");
}
