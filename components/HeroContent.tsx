"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

// Hero text that animates IN on load, then fades/shrinks/lifts as you scroll
// down — and reverses (pops back) as you scroll up, because it's tied to the
// live scroll position, not a one-time reveal.
export function HeroContent() {
  const { scrollY } = useScroll();
  // Gentle, gradual fade as you scroll — subtle, not a sudden jump.
  const opacity = useTransform(scrollY, [0, 520], [1, 0]);
  const y = useTransform(scrollY, [0, 520], [0, -60]);
  const scale = useTransform(scrollY, [0, 520], [1, 0.97]);

  // Fast premium entrance: pops in almost immediately on load, with just a tiny
  // stagger so it still feels smooth rather than abrupt.
  const item = {
    hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { delay: i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
    }),
  };

  return (
    <motion.div style={{ opacity, y, scale }} className="relative z-10 px-6 text-center text-cream">
      <motion.span
        custom={0}
        variants={item}
        initial="hidden"
        animate="show"
        className="inline-block rounded-full border border-cream/20 bg-cream/5 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-light backdrop-blur"
      >
        Hyderabad · Since the first cup
      </motion.span>

      <motion.h1
        custom={1}
        variants={item}
        initial="hidden"
        animate="show"
        className="mt-6 font-serif text-5xl font-black leading-[0.95] sm:text-7xl lg:text-8xl"
      >
        <span className="text-cream">Chai Pe</span>
        <br />
        <span className="text-brand-light">Charcha</span>
      </motion.h1>

      <motion.p
        custom={2}
        variants={item}
        initial="hidden"
        animate="show"
        className="mx-auto mt-6 max-w-xl text-base text-cream/80 sm:text-lg"
      >
        Karahi, BBQ, wood-fired pizza, parathas and perfectly brewed chai — fresh,
        hot, and made to order.
      </motion.p>

      <motion.div
        custom={3}
        variants={item}
        initial="hidden"
        animate="show"
        className="mt-9 flex flex-wrap justify-center gap-4"
      >
        <Link href="/menu" className="btn-brand px-8 py-4 text-base">
          Order Now →
        </Link>
        <Link
          href="/track"
          className="inline-flex items-center rounded-full border border-cream/30 px-8 py-4 font-semibold text-cream backdrop-blur transition hover:bg-cream/10"
        >
          Track Order
        </Link>
      </motion.div>
    </motion.div>
  );
}
