import { createClient } from "@/lib/supabase/server";
import { MenuManager } from "@/components/admin/MenuManager";
import type { MenuItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const supabase = createClient();
  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("categories").select("id, label").order("sort_order"),
    // Admins see ALL items (active + hidden) thanks to the RLS "or is_admin()" rule.
    supabase.from("menu_items").select("*").order("category_id").order("sort_order"),
  ]);

  return (
    <MenuManager
      categories={categories ?? []}
      items={(items ?? []) as MenuItem[]}
    />
  );
}
