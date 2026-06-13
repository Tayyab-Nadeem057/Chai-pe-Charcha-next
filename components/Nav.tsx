"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const path = usePathname();
  // Storefront chrome doesn't belong on the admin or login screens.
  if (path.startsWith("/admin") || path.startsWith("/login")) return null;

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-serif text-xl font-black text-brand">
          Chai Pe Charcha
        </Link>
        <div className="flex items-center gap-5 text-sm font-medium text-neutral-600">
          <Link href="/" className="hover:text-brand">Home</Link>
          <Link href="/menu" className="hover:text-brand">Menu</Link>
          <Link href="/track" className="hover:text-brand">Track Order</Link>
        </div>
      </nav>
    </header>
  );
}
