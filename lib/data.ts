import { createClient } from "@/lib/supabase/server";
import { withTimeout } from "@/lib/withTimeout";
import type { Category, MenuItem } from "@/lib/types";

// Server-side menu fetch. Runs on the server (SEO-friendly), reads only active,
// non-sold-out items grouped into categories. RLS already restricts what's visible.
export async function getMenu(service?: string): Promise<Category[]> {
  let categories: any[] | null = null;
  let items: any[] | null = null;
  try {
    const supabase = createClient();
    // 5s guard so a stalled server→DB connection can't hang the menu page.
    const res = await withTimeout(
      Promise.all([
        supabase.from("categories").select("*").order("sort_order"),
        supabase.from("menu_items").select("*").eq("is_active", true).order("sort_order"),
      ]),
      5000,
      [{ data: null }, { data: null }] as any,
    );
    categories = (res[0] as any).data;
    items = (res[1] as any).data;
  } catch {
    return []; // network blip — render an empty menu instead of crashing
  }

  if (!categories || !items) return [];

  const serviceCol =
    service === "dinein" ? "dine_in" : service === "takeaway" ? "takeaway" : service === "delivery" ? "delivery" : null;

  return categories
    .map((c) => ({
      ...c,
      items: (items as MenuItem[]).filter(
        (i) => i.category_id === c.id && (!serviceCol || (i as any)[serviceCol]),
      ),
    }))
    .filter((c) => c.items.length > 0) as Category[];
}
