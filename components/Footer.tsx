import Link from "next/link";
import { SITE } from "@/lib/site";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  const wa = `https://wa.me/${SITE.whatsapp}`;

  return (
    <footer className="bg-coal text-cream/60">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <p className="font-serif text-xl font-black text-cream">{SITE.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            Karahi, BBQ, wood-fired pizza, parathas and perfectly brewed chai — the true
            taste of {SITE.city}, made fresh to order.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/40">Quick Links</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/" className="transition hover:text-brand-light">Home</Link></li>
            <li><Link href="/menu" className="transition hover:text-brand-light">Menu</Link></li>
            <li><Link href="/track" className="transition hover:text-brand-light">Track Order</Link></li>
            <li><Link href="/contact" className="transition hover:text-brand-light">Contact</Link></li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/40">Connect</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href={wa} target="_blank" rel="noopener" className="transition hover:text-brand-light">WhatsApp</a></li>
            <li><a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="transition hover:text-brand-light">Call {SITE.phone}</a></li>
            {SITE.instagram && (
              <li><a href={SITE.instagram} target="_blank" rel="noopener" className="transition hover:text-brand-light">Instagram</a></li>
            )}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/40">Newsletter</p>
          <p className="mt-4 mb-3 text-sm">Get specials & new dishes in your inbox.</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/30">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
