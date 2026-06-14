import { createClient } from "@/lib/supabase/server";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const supabase = createClient();
  const [{ data: cats }, { data: items }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("menu_items").select("category_id"),
  ]);

  const counts: Record<string, number> = {};
  (items ?? []).forEach((i: any) => {
    counts[i.category_id] = (counts[i.category_id] ?? 0) + 1;
  });

  const categories = (cats ?? []).map((c: any) => ({
    id: c.id,
    label: c.label,
    description: c.description,
    sort_order: c.sort_order,
    count: counts[c.id] ?? 0,
  }));

  return <CategoryManager categories={categories} />;
}
