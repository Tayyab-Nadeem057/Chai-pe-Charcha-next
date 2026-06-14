"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveCategory, deleteCategory } from "@/lib/actions/categories";

type Cat = { id: string; label: string; description: string | null; sort_order: number; count: number };

export function CategoryManager({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Cat | "new" | null>(null);
  const [pending, start] = useTransition();

  function remove(c: Cat) {
    if (!confirm(`Delete "${c.label}"? Its ${c.count} item(s) will be deleted too.`)) return;
    start(async () => {
      await deleteCategory(c.id);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-black">Categories</h1>
        <button onClick={() => setEditing("new")} className="btn-brand">+ Add Category</button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand/15 bg-surface">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-cream/40">
            <tr className="border-b border-white/5">
              <th className="p-3">Order</th>
              <th className="p-3">Name</th>
              <th className="p-3">Items</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-white/5">
                <td className="p-3 text-cream/40">{c.sort_order}</td>
                <td className="p-3">
                  <div className="font-semibold">{c.label}</div>
                  <div className="text-xs text-cream/40">{c.description}</div>
                </td>
                <td className="p-3 text-cream/60">{c.count}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditing(c)} className="rounded-lg bg-brand/15 px-3 py-1.5 text-xs font-semibold text-brand">Edit</button>
                    <button onClick={() => remove(c)} disabled={pending} className="rounded-lg bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-400">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <CategoryForm
          cat={editing === "new" ? null : editing}
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

function CategoryForm({ cat, onClose, onSaved }: { cat: Cat | null; onClose: () => void; onSaved: () => void }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const res = await saveCategory(fd);
      if (res.ok) onSaved();
      else setError(res.error);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-surface p-6 text-cream">
        <h2 className="mb-4 font-serif text-xl font-black">{cat ? "Edit Category" : "Add Category"}</h2>
        {error && <p className="mb-3 rounded-lg bg-red-500/15 p-2 text-sm text-red-300">{error}</p>}
        {cat && <input type="hidden" name="id" value={cat.id} />}

        <label className="mb-1 block text-xs uppercase tracking-wider text-cream/40">Name</label>
        <input name="label" defaultValue={cat?.label} required className="mb-3 w-full rounded-lg border border-brand/20 bg-coal px-3 py-2 text-sm" />

        <label className="mb-1 block text-xs uppercase tracking-wider text-cream/40">Description (optional)</label>
        <input name="description" defaultValue={cat?.description ?? ""} className="mb-3 w-full rounded-lg border border-brand/20 bg-coal px-3 py-2 text-sm" />

        <label className="mb-1 block text-xs uppercase tracking-wider text-cream/40">Sort order</label>
        <input name="sort_order" type="number" defaultValue={cat?.sort_order ?? 0} className="mb-4 w-full rounded-lg border border-brand/20 bg-coal px-3 py-2 text-sm" />

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-brand/20 py-3 text-sm">Cancel</button>
          <button type="submit" disabled={pending} className="btn-brand flex-1 disabled:opacity-50">
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
