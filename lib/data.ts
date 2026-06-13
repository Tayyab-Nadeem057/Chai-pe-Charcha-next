import { createClient } from "@/lib/supabase/server";
import type { Category, MenuItem } from "@/lib/types";

// Server-side menu fetch. Runs on the server (SEO-friendly), reads only active,
// non-sold-out items grouped into categories. RLS already restricts what's visible.
export async function getMenu(service?: string): Promise<Category[]> {
  const supabase = createClient();

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase
      .from("menu_items")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

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
