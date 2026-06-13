"use client";

import { useState } from "react";
import Image from "next/image";
import type { Category, MenuItem } from "@/lib/types";
import { useCart } from "./CartContext";

export function MenuView({ categories }: { categories: Category[] }) {
  const { add, setOpen } = useCart();
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);

  function handleAdd(item: MenuItem) {
    if (item.variants && item.variants.length > 0) {
      setModalItem(item);
      return;
    }
    add({ item_id: item.id, name: item.name, variant: null, price: item.price });
    setOpen(true);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {categories.map((cat) => (
        <section key={cat.id} className="mb-10">
          <h2 className="mb-1 font-serif text-2xl font-black text-ink">{cat.label}</h2>
          {cat.description && <p className="mb-4 text-sm text-neutral-500">{cat.description}</p>}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cat.items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
              >
                {item.image_url && (
                  <div className="relative h-40 w-full bg-neutral-100">
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-semibold text-ink">{item.name}</h3>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <span className="font-bold text-brand">Rs. {item.price}</span>
                    {item.sold_out ? (
                      <span className="text-xs font-semibold text-neutral-400">Sold out</span>
                    ) : (
                      <button
                        onClick={() => handleAdd(item)}
                        className="h-9 w-9 rounded-full bg-brand text-lg font-bold text-white transition hover:scale-105"
                        aria-label={`Add ${item.name}`}
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      {modalItem && (
        <VariantModal item={modalItem} onClose={() => setModalItem(null)} />
      )}
    </div>
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-serif text-xl font-black text-ink">{item.name}</h3>
        <p className="mb-4 text-sm text-neutral-500">Choose an option</p>
        <div className="space-y-2">
          {variants.map((v, i) => (
            <button
              key={v.label}
              onClick={() => setPicked(i)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm ${
                picked === i ? "border-brand bg-brand-soft" : "border-neutral-200"
              }`}
            >
              <span className="font-medium">{v.label}</span>
              <span className="font-bold text-brand">Rs. {item.price + v.price_offset}</span>
            </button>
          ))}
        </div>
        <button
          disabled={picked === null}
          onClick={confirm}
          className="btn-brand mt-5 w-full disabled:opacity-50"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
