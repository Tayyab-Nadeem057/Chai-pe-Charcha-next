"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Nav() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (path.startsWith("/admin") || path.startsWith("/login")) return null;

  const isHome = path === "/";
  const transparent = isHome && !scrolled;

  // iOS-style frosted pill that glows orange on hover. Compact on phones.
  const bubbleBase =
    "rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand hover:text-white hover:ring-brand hover:shadow-[0_0_18px_rgba(232,115,28,0.7)] sm:px-4 sm:py-2 sm:text-sm";
  const bubble = transparent
    ? "bg-white/10 text-cream ring-white/15"
    : "bg-cocoa/5 text-cocoa/80 ring-cocoa/10";

  return (
    <header
      className={`${isHome ? "fixed" : "sticky"} top-0 z-40 w-full transition-colors duration-300 ${
        transparent ? "bg-transparent" : "border-b border-cocoa/10 bg-cream/90 backdrop-blur"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Left: logo */}
        <Link href="/" aria-label="Home">
          {/* Put your logo at /public/logo.webp */}
          <img src="/logo.webp" alt="Chai Pe Charcha" className="h-10 w-auto sm:h-12" />
        </Link>

        {/* Right: links as frosted bubbles */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link href="/" className={`${bubbleBase} ${bubble}`}>Home</Link>
          <Link href="/menu" className={`${bubbleBase} ${bubble}`}>Menu</Link>
          <Link href="/track" className={`hidden sm:inline-block ${bubbleBase} ${bubble}`}>Track</Link>
          <Link href="/contact" className={`${bubbleBase} ${bubble}`}>Contact</Link>
        </div>
      </nav>
    </header>
  );
}
