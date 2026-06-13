"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Category, MenuItem } from "@/lib/types";
import { saveItem, deleteItem, toggleItem } from "@/lib/actions/menu";

export function MenuManager({
  categories,
  items,
}: {
  categories: Pick<Category, "id" | "label">[];
  items: MenuItem[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<MenuItem | "new" | null>(null);
  const [pending, start] = useTransition();

  function toggle(item: MenuItem, field: "is_active" | "sold_out") {
    start(async () => {
      await toggleItem(item.id, field, !item[field]);
      router.refresh();
    });
  }

  function remove(id: number) {
    if (!confirm("Delete this item permanently?")) return;
    start(async () => {
      await deleteItem(id);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-black">Menu Items</h1>
        <button onClick={() => setEditing("new")} className="btn-brand">+ Add Item</button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`overflow-hidden rounded-2xl border border-brand/15 bg-surface ${item.is_active ? "" : "opacity-50"}`}
          >
            <div className="relative h-32 bg-coal">
              {item.image_url && <Image src={item.image_url} alt={item.name} fill className="object-cover" />}
            </div>
            <div className="p-3">
              <div className="flex items-start justify-between">
                <strong className="text-sm">{item.name}</strong>
                <span className="font-bold text-brand">Rs. {item.price}</span>
              </div>
              <div className="mt-1 text-xs text-cream/40">{item.category_id}</div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => toggle(item, "is_active")}
                  disabled={pending}
                  className={`rounded-full px-2.5 py-1 ${item.is_active ? "bg-green-500/15 text-green-400" : "bg-white/5 text-cream/40"}`}
                >
                  {item.is_active ? "✓ Active" : "Hidden"}
                </button>
                <button
                  onClick={() => toggle(item, "sold_out")}
                  disabled={pending}
                  className={`rounded-full px-2.5 py-1 ${item.sold_out ? "bg-red-500/15 text-red-400" : "bg-white/5 text-cream/40"}`}
                >
                  {item.sold_out ? "Sold out" : "In stock"}
                </button>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setEditing(item)} className="flex-1 rounded-lg bg-brand/15 py-1.5 text-xs font-semibold text-brand">✏️ Edit</button>
                <button onClick={() => remove(item.id)} className="flex-1 rounded-lg bg-red-500/15 py-1.5 text-xs font-semibold text-red-400">🗑 Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <ItemForm
          item={editing === "new" ? null : editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function ItemForm({
  item,
  categories,
  onClose,
  onSaved,
}: {
  item: MenuItem | null;
  categories: Pick<Category, "id" | "label">[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(item?.image_url ?? null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const res = await saveItem(fd);
      if (res.ok) onSaved();
      else setError(res.error);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-surface p-6 text-cream"
      >
        <h2 className="mb-4 font-serif text-xl font-black">{item ? "Edit Item" : "Add Item"}</h2>
        {error && <p className="mb-3 rounded-lg bg-red-500/15 p-2 text-sm text-red-300">{error}</p>}

        {item && <input type="hidden" name="id" value={item.id} />}
        <input type="hidden" name="existing_image" value={item?.image_url ?? ""} />

        <label className="mb-1 block text-xs uppercase tracking-wider text-cream/40">Name</label>
        <input name="name" defaultValue={item?.name} required className="mb-3 w-full rounded-lg border border-brand/20 bg-coal px-3 py-2 text-sm" />

        <div className="mb-3 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-cream/40">Price (Rs.)</label>
            <input name="price" type="number" min="0" step="1" defaultValue={item?.price} required className="w-full rounded-lg border border-brand/20 bg-coal px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-cream/40">Category</label>
            <select name="category_id" defaultValue={item?.category_id} required className="w-full rounded-lg border border-brand/20 bg-coal px-3 py-2 text-sm">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <label className="mb-1 block text-xs uppercase tracking-wider text-cream/40">Image</label>
        {preview && (
          <div className="relative mb-2 h-32 w-full overflow-hidden rounded-lg bg-coal">
            <Image src={preview} alt="preview" fill className="object-cover" />
          </div>
        )}
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setPreview(URL.createObjectURL(f));
          }}
          className="mb-3 w-full text-sm"
        />

        <div className="mb-3 space-y-2 rounded-lg border border-brand/15 p-3 text-sm">
          <div className="text-xs uppercase tracking-wider text-cream/40">Available for</div>
          <Check name="dine_in" label="Dine In" defaultChecked={item ? item.dine_in : true} />
          <Check name="takeaway" label="Take Away" defaultChecked={item ? item.takeaway : true} />
          <Check name="delivery" label="Delivery" defaultChecked={item ? item.delivery : true} />
        </div>
        <div className="mb-4 space-y-2 text-sm">
          <Check name="is_active" label="Show on website (active)" defaultChecked={item ? item.is_active : true} />
          <Check name="sold_out" label="Mark as sold out" defaultChecked={item ? item.sold_out : false} />
          <Check name="is_featured" label="Featured" defaultChecked={item ? item.is_featured : false} />
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-brand/20 py-3 text-sm">Cancel</button>
          <button type="submit" disabled={pending} className="btn-brand flex-1 disabled:opacity-50">
            {pending ? "Saving…" : "Save Item"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-brand" />
      {label}
    </label>
  );
}
