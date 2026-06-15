"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Category, MenuItem } from "@/lib/types";
import { useCart } from "./CartContext";
import { Reveal } from "@/components/Reveal";

type Sort = "default" | "price-asc" | "price-desc";

export function MenuView({ categories, service }: { categories: Category[]; service?: string }) {
  const { add, setOpen } = useCart();
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("default");

  function handleAdd(item: MenuItem) {
    if (item.variants && item.variants.length > 0) {
      setModalItem(item);
      return;
    }
    add({ item_id: item.id, name: item.name, variant: null, price: item.price });
    setOpen(true);
  }

  // Apply category filter + search + sort.
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories
      .filter((c) => activeCat === "all" || c.id === activeCat)
      .map((c) => {
        let items = c.items.filter((i) => !q || i.name.toLowerCase().includes(q));
        if (sort === "price-asc") items = [...items].sort((a, b) => a.price - b.price);
        if (sort === "price-desc") items = [...items].sort((a, b) => b.price - a.price);
        return { ...c, items };
      })
      .filter((c) => c.items.length > 0);
  }, [categories, activeCat, query, sort]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12">
      {/* ───── Upper body: title + search ───── */}
      <div className="pt-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-4xl font-black text-cocoa sm:text-5xl">Our Menu</h1>
            <p className="mt-2 text-cocoa/55">
              {service ? `Showing the ${service} menu` : "Fresh, hot & made to order"}
              {service && (
                <>
                  {" · "}
                  <Link href="/menu" className="font-medium text-brand hover:underline">
                    Change
                  </Link>
                </>
              )}
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa/35">
              <SearchIcon />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes…"
              className="w-full rounded-full border border-cocoa/10 bg-white py-2.5 pl-10 pr-4 text-sm text-cocoa placeholder-cocoa/35 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
        </div>
      </div>

      {/* ───── Sticky filter + sort bar ───── */}
      <div className="sticky top-[68px] z-30 -mx-4 mt-6 mb-8 border-b border-cocoa/5 bg-cream/85 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto">
            <FilterPill active={activeCat === "all"} onClick={() => setActiveCat("all")}>
              All
            </FilterPill>
            {categories.map((cat) => (
              <FilterPill
                key={cat.id}
                active={activeCat === cat.id}
                onClick={() => setActiveCat(cat.id)}
              >
                {cat.label}
              </FilterPill>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="shrink-0 rounded-full border border-cocoa/10 bg-white px-4 py-2 text-sm font-medium text-cocoa/70 shadow-sm transition hover:ring-1 hover:ring-brand/40 focus:outline-none"
          >
            <option value="default">Sort</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* ───── Sections ───── */}
      {shown.length === 0 ? (
        <p className="py-24 text-center text-cocoa/45">No dishes match “{query}”.</p>
      ) : (
        shown.map((cat) => (
          <section key={cat.id} className="mb-16">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sand/80 via-brand-soft/50 to-sand/40 px-6 py-8 text-center ring-1 ring-cocoa/5">
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-terracotta">
                  {cat.items.length} {cat.items.length === 1 ? "dish" : "dishes"}
                </span>
                <h2 className="mt-2 font-serif text-3xl font-black text-cocoa sm:text-4xl">
                  {cat.label}
                </h2>
                <div className="mx-auto mt-3 h-px w-14 bg-brand/50" />
                {cat.description && (
                  <p className="mx-auto mt-3 max-w-md text-sm text-cocoa/55">{cat.description}</p>
                )}
              </div>
            </Reveal>

            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cat.items.map((item, i) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, delay: (i % 9) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgba(61,40,23,0.07)] ring-1 ring-cocoa/5 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_46px_rgba(61,40,23,0.14)]"
                >
                  {item.image_url ? (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />
                      {item.sold_out && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-semibold uppercase tracking-wider text-white">
                          Sold out
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-sand/50 text-4xl">🍽️</div>
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-serif text-lg font-bold leading-snug text-cocoa">{item.name}</h3>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <span className="font-bold text-brand">
                        Rs. {item.price}
                        {item.variants && item.variants.length > 0 && (
                          <span className="ml-1 text-xs font-normal text-cocoa/40">+</span>
                        )}
                      </span>
                      {!item.sold_out && (
                        <button
                          onClick={() => handleAdd(item)}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-xl font-bold text-white shadow-brand transition hover:scale-110"
                          aria-label={`Add ${item.name}`}
                        >
                          +
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        ))
      )}

      {modalItem && <VariantModal item={modalItem} onClose={() => setModalItem(null)} />}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
        active
          ? "bg-brand text-white shadow-[0_0_18px_rgba(232,115,28,0.6)]"
          : "bg-white text-cocoa/70 ring-1 ring-cocoa/10 hover:text-brand hover:ring-brand hover:shadow-[0_0_16px_rgba(232,115,28,0.45)]"
      }`}
    >
      {children}
    </button>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function VariantModal({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const { add, setOpen } = useCart();
  const [picked, setPicked] = useState<number | null>(null);
  const variants = item.variants ?? [];

  function confirm() {
    if (picked === null) return;
    const v = variants[picked];
    add({
      item_id: item.id,
      name: `${item.name} (${v.label})`,
      variant: v.label,
      price: item.price + v.price_offset,
    });
    onClose();
    setOpen(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm rounded-3xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-serif text-xl font-black text-cocoa">{item.name}</h3>
        <p className="mb-4 text-sm text-cocoa/50">Choose a size</p>
        <div className="space-y-2">
          {variants.map((v, i) => (
            <button
              key={v.label}
              onClick={() => setPicked(i)}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
                picked === i ? "border-brand bg-brand-soft" : "border-cocoa/10 hover:border-brand/40"
              }`}
            >
              <span className="font-medium text-cocoa">{v.label}</span>
              <span className="font-bold text-brand">Rs. {item.price + v.price_offset}</span>
            </button>
          ))}
        </div>
        <button disabled={picked === null} onClick={confirm} className="btn-brand mt-5 w-full disabled:opacity-50">
          Add to Cart
        </button>
      </motion.div>
    </div>
  );
}
