import { getMenu } from "@/lib/data";
import { MenuView } from "@/components/storefront/MenuView";

export const metadata = {
  title: "Menu — Chai Pe Charcha",
  description: "Browse karahi, BBQ, pizza, paratha, chai and more.",
};

// Server Component — fetches the menu on the server (good for SEO), then hands
// it to the interactive client view.
export default async function MenuPage() {
  const categories = await getMenu();

  return (
    <main>
      <div className="border-b border-neutral-200 bg-brand-soft px-4 py-8 text-center">
        <h1 className="font-serif text-4xl font-black text-ink">Our Menu</h1>
        <p className="mt-1 text-neutral-600">Tap + to add items to your cart</p>
      </div>
      {categories.length === 0 ? (
        <p className="py-20 text-center text-neutral-400">
          Menu is empty. Add items in the admin panel (or run the seed in schema.sql).
        </p>
      ) : (
        <MenuView categories={categories} />
      )}
    </main>
  );
}
