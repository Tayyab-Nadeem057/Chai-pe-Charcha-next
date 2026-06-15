import Link from "next/link";
import { Reveal } from "@/components/Reveal";

const OPTIONS = [
  { key: "delivery", title: "Delivery", desc: "Hot, fresh food to your door across Hyderabad." },
  { key: "takeaway", title: "Take Away", desc: "Quick bites, rolls & chai — ready when you are." },
  { key: "dinein", title: "Dine In", desc: "BBQ, karahi & mains, best enjoyed at our table." },
];

// Entry gate for the menu page: pick a service, then the menu is filtered to the
// items enabled for it in the admin panel (via /menu?service=...).
export function ServicePicker() {
  return (
    <section className="mx-auto flex min-h-[72vh] max-w-4xl flex-col items-center justify-center px-4 py-20">
      <Reveal className="text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-terracotta">
          Chai Pe Charcha
        </span>
        <h1 className="mt-2 font-serif text-3xl font-black text-cocoa sm:text-4xl">
          How would you like to order?
        </h1>
        <p className="mt-2 text-cocoa/55">Pick one to see the menu available for it.</p>
      </Reveal>

      <div className="mt-10 grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
        {OPTIONS.map((o, i) => (
          <Reveal key={o.key} delay={i * 0.08}>
            <Link
              href={`/menu?service=${o.key}`}
              className="group block rounded-3xl bg-white p-7 text-center shadow-sm ring-1 ring-cocoa/5 transition-all duration-300 hover:-translate-y-1 hover:ring-brand hover:shadow-[0_0_26px_rgba(232,115,28,0.35)]"
            >
              <h2 className="font-serif text-2xl font-black text-cocoa transition group-hover:text-brand">
                {o.title}
              </h2>
              <p className="mt-2 text-sm text-cocoa/55">{o.desc}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
