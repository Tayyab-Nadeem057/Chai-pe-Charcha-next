import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Reveal } from "@/components/Reveal";
import { HeroContent } from "@/components/HeroContent";
import { HeroVideo } from "@/components/HeroVideo";
import { CountUp } from "@/components/CountUp";
import { withTimeout } from "@/lib/withTimeout";
import type { MenuItem } from "@/lib/types";

const STATS = [
  { to: 5000, suffix: "+", label: "Happy Customers" },
  { to: 50, suffix: "+", label: "Menu Items" },
  { to: 7, suffix: "", label: "Years Serving" },
  { to: 98, suffix: "%", label: "Satisfaction" },
];

export default async function Home() {
  // Fetch featured dishes, but never let a network blip crash the home page.
  let items: MenuItem[] = [];
  try {
    const supabase = createClient();
    // Only dishes the ADMIN has marked as Featured appear in "Loved by regulars".
    // (4s timeout so a stalled server→DB connection can never hang the page.)
    const res = await withTimeout(
      supabase
        .from("menu_items")
        .select("*")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("sort_order")
        .limit(6),
      4000,
      { data: [] as MenuItem[] } as any,
    );
    items = ((res as any).data ?? []) as MenuItem[];
  } catch {
    items = []; // database unreachable — show hero without featured
  }

  return (
    <main>
      {/* ───────── HERO ───────── */}
      <section className="relative flex h-[90vh] min-h-[580px] items-center justify-center overflow-hidden">
        {/* Warm fallback gradient (shows before/behind the video) */}
        <div className="absolute inset-0 bg-gradient-to-br from-cocoa via-[#2a160a] to-coal" />
        {/* Background video — restarts each time you scroll back to the hero */}
        <HeroVideo />
        {/* Dark, premium overlay — flat dim + warm gradient + soft vignette */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#1a0d04]/55 to-coal/95" />
        <div className="absolute inset-0 [background:radial-gradient(120%_90%_at_50%_40%,transparent_35%,rgba(0,0,0,0.55)_100%)]" />

        <HeroContent />
      </section>

      {/* ───────── FEATURED ───────── */}
      {items.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20">
          <Reveal className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
              Signature
            </span>
            <h2 className="mt-2 font-serif text-4xl font-black text-cocoa sm:text-5xl">
              Loved by regulars
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.08}>
                <Link
                  href="/menu"
                  className="group block overflow-hidden rounded-3xl bg-white shadow-[0_10px_40px_rgba(61,40,23,0.08)] ring-1 ring-cocoa/5 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(61,40,23,0.15)]"
                >
                  {item.image_url && (
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between p-5">
                    <h3 className="font-serif text-lg font-bold text-cocoa">{item.name}</h3>
                    <span className="rounded-full bg-brand-soft px-3 py-1 font-bold text-brand">
                      Rs. {item.price}
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <Link href="/menu" className="btn-brand px-8 py-4">
              See the full menu →
            </Link>
          </Reveal>
        </section>
      )}

      {/* ───────── STATS / STORY ───────── */}
      <section className="relative overflow-hidden bg-cocoa py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cocoa via-[#2a160a] to-coal" />
        <div className="relative mx-auto max-w-6xl px-4">
          <Reveal className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">
              Our Story
            </span>
            <h2 className="mx-auto mt-2 max-w-3xl font-serif text-4xl font-black text-cream sm:text-5xl">
              More Than a Meal — It&apos;s an Experience
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-cream/70">
              At Chai Pe Charcha, every dish is prepared with passion and the finest
              ingredients. From hearty mains to delightful snacks, our kitchen brings the
              true taste of Pakistan to your table.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1}>
                <div className="rounded-3xl border border-cream/10 bg-cream/5 p-7 text-center backdrop-blur">
                  <CountUp
                    to={s.to}
                    suffix={s.suffix}
                    className="font-serif text-4xl font-black text-brand-light sm:text-5xl"
                  />
                  <p className="mt-2 text-sm text-cream/60">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── SERVICE STRIP ───────── */}
      <section className="bg-sand/60">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-16 sm:grid-cols-3">
          {[
            { t: "Delivery", d: "Hot, fresh food to your door across Hyderabad." },
            { t: "Take Away", d: "Quick bites, rolls & chai — ready when you are." },
            { t: "Dine In", d: "BBQ, karahi & mains, best enjoyed at our table." },
          ].map((s, i) => (
            <Reveal key={s.t} delay={i * 0.1}>
              <div className="rounded-2xl bg-cream p-7 text-center shadow-sm ring-1 ring-cocoa/5">
                <h3 className="font-serif text-2xl font-black text-cocoa">{s.t}</h3>
                <p className="mt-2 text-sm text-cocoa/60">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────── FOOTER ───────── */}
      <footer className="bg-coal py-10 text-center text-cream/60">
        <p className="font-serif text-xl font-black text-cream">Chai Pe Charcha</p>
        <p className="mt-2 text-sm">Hyderabad · Delivery · Takeaway · Dine-in</p>
        <p className="mt-4 text-xs text-cream/30">© {new Date().getFullYear()} Chai Pe Charcha</p>
      </footer>
    </main>
  );
}
