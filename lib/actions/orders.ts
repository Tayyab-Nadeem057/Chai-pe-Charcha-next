"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// Validation — mirrors the DB rules. The DB function is the real enforcer.
const OrderSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+92|0092|92|0)?3\d{9}$/, "Enter a valid phone number"),
  address: z.string().trim().max(500).optional().default(""),
  service: z.enum(["delivery", "takeaway", "dinein"]).default("delivery"),
  items: z
    .array(
      z.object({
        item_id: z.number().int().positive(),
        variant: z.string().nullable().optional(),
        quantity: z.number().int().min(1).max(50),
      }),
    )
    .min(1, "Your cart is empty"),
});

export type OrderResult =
  | { ok: true; orderId: number }
  | { ok: false; error: string };

export async function placeOrder(input: unknown): Promise<OrderResult> {
  const parsed = OrderSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid order" };
  }
  const { name, phone, address, service, items } = parsed.data;

  const supabase = createClient();
  // The DB function computes every price from the database — the client's
  // prices are never trusted. Returns the new order id.
  const { data, error } = await supabase.rpc("place_order", {
    p_name: name,
    p_phone: phone,
    p_address: address,
    p_service: service,
    p_items: items,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, orderId: data as number };
}
