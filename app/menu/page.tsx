import Link from "next/link";
import { getMenu } from "@/lib/data";
import { MenuView } from "@/components/storefront/MenuView";
import { ServicePicker } from "@/components/storefront/ServicePicker";

export const metadata = {
  title: "Menu — Chai Pe Charcha",
  description: "Browse karahi, BBQ, pizza, paratha, chai and more.",
};

const LABELS: Record<string, string> = {
  delivery: "Delivery",
  takeaway: "Take Away",
  dinein: "Dine In",
};

// Server Component. Visitors first pick a service (Delivery / Take Away / Dine In);
// the menu is then filtered to the items enabled for that service in the admin panel.
export default async function MenuPage({
  searchParams,
}: {
  searchParams: { service?: string };
}) {
  const service = searchParams.service;
  const valid = service === "delivery" || service === "takeaway" || service === "dinein";

  if (!valid) {
    return (
      <main className="bg-cream">
        <ServicePicker />
      </main>
    );
  }

  const categories = await getMenu(service);

  return (
    <main className="bg-cream">
      {categories.length === 0 ? (
        <div className="px-4 py-28 text-center">
          <p className="text-cocoa/50">No items available for {LABELS[service]} right now.</p>
          <Link href="/menu" className="mt-3 inline-block font-medium text-brand hover:underline">
            Choose another option
          </Link>
        </div>
      ) : (
        <MenuView categories={categories} service={LABELS[service]} />
      )}
    </main>
  );
}
