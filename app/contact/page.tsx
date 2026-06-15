import { SITE } from "@/lib/site";
import { ContactForm } from "@/components/storefront/ContactForm";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Contact — Chai Pe Charcha",
  description: "Reach Chai Pe Charcha on WhatsApp, call us, or find us on the map.",
};

export default function ContactPage() {
  const wa = `https://wa.me/${SITE.whatsapp}`;
  const tel = `tel:${SITE.phone.replace(/\s/g, "")}`;
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`;
  const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(SITE.mapsQuery)}&z=15&output=embed`;

  return (
    <main className="bg-cream">
      <section className="mx-auto max-w-6xl px-4 py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* ───── LEFT: heading + form ───── */}
          <div>
            <h1 className="font-serif text-4xl font-black text-cocoa sm:text-5xl">
              Get in <span className="italic text-brand">Touch</span>
            </h1>
            <p className="mt-3 max-w-md text-cocoa/55">
              Whether it&apos;s a catering inquiry or just to say hello, we&apos;d love to
              hear from you.
            </p>

            <div className="mt-8">
              <ContactForm />
            </div>

            {/* WhatsApp + quick icons */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href={wa}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(37,211,102,0.5)]"
              >
                <WhatsAppIcon /> WhatsApp Us
              </a>
              <a
                href={directions}
                target="_blank"
                rel="noopener"
                aria-label="Find us"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-cocoa/70 ring-1 ring-cocoa/10 transition hover:-translate-y-0.5 hover:text-brand hover:ring-brand"
              >
                <PinIcon />
              </a>
              <a
                href={tel}
                aria-label="Call us"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-cocoa/70 ring-1 ring-cocoa/10 transition hover:-translate-y-0.5 hover:text-brand hover:ring-brand"
              >
                <PhoneIcon />
              </a>
            </div>
          </div>

          {/* ───── RIGHT: map + info cards ───── */}
          <div className="space-y-6">
            {/* Map */}
            <div className="relative overflow-hidden rounded-3xl shadow-md ring-1 ring-cocoa/10">
              <iframe
                title="Chai Pe Charcha location"
                src={mapEmbed}
                className="h-[300px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={directions}
                target="_blank"
                rel="noopener"
                aria-label="Open directions"
                className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white shadow-[0_0_20px_rgba(232,115,28,0.5)] transition hover:scale-110"
              >
                <PinIcon />
              </a>
            </div>

            {/* Timings + Location */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-cocoa/5">
                <h3 className="flex items-center gap-2 font-serif text-lg font-black text-cocoa">
                  <span className="text-brand"><ClockIcon /></span> Timings
                </h3>
                <ul className="mt-4 space-y-2 text-sm">
                  {SITE.hours.map((h) => (
                    <li key={h.d} className="flex items-center justify-between gap-3">
                      <span className="text-cocoa/55">{h.d}</span>
                      <span className="font-semibold text-cocoa">{h.t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-cocoa/5">
                <h3 className="flex items-center gap-2 font-serif text-lg font-black text-cocoa">
                  <span className="text-brand"><PinIcon /></span> Location
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-cocoa/65">{SITE.address}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-cocoa/40">
                  Reservations
                </p>
                <a href={tel} className="text-sm font-semibold text-brand hover:underline">
                  {SITE.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* — inline line icons (no emoji) — */
function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 001.523 5.255l-.999 3.648 3.876-1.017zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  );
}
