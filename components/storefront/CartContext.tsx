"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { CartLine } from "@/lib/types";

type CartCtx = {
  lines: CartLine[];
  count: number;
  total: number;
  add: (line: Omit<CartLine, "quantity">) => void;
  setQty: (name: string, delta: number) => void;
  remove: (name: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "cpc_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);

  // Load once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
  }, []);

  // Persist on change.
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines]);

  const add = useCallback((line: Omit<CartLine, "quantity">) => {
    setLines((prev) => {
      const ex = prev.find((l) => l.name === line.name);
      if (ex) return prev.map((l) => (l.name === line.name ? { ...l, quantity: l.quantity + 1 } : l));
      return [...prev, { ...line, quantity: 1 }];
    });
  }, []);

  const setQty = useCallback((name: string, delta: number) => {
    setLines((prev) =>
      prev
        .map((l) => (l.name === name ? { ...l, quantity: l.quantity + delta } : l))
        .filter((l) => l.quantity > 0),
    );
  }, []);

  const remove = useCallback((name: string) => {
    setLines((prev) => prev.filter((l) => l.name !== name));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = lines.reduce((s, l) => s + l.quantity, 0);
  const total = lines.reduce((s, l) => s + l.quantity * l.price, 0);

  return (
    <Ctx.Provider value={{ lines, count, total, add, setQty, remove, clear, open, setOpen }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
