import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-soft to-white px-4 py-24 text-center">
        <span className="rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand shadow-sm">
          Hyderabad · Delivery · Takeaway · Dine-in
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl font-serif text-5xl font-black leading-tight text-ink sm:text-6xl">
          Karahi, BBQ, Pizza & <span className="text-brand">Chai</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-neutral-600">
          Fresh, hot and made to order. Browse the menu and place your order in seconds.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/menu" className="btn-brand">Order Now →</Link>
          <Link
            href="/track"
            className="inline-flex items-center rounded-full border border-neutral-300 px-6 py-3 font-semibold text-ink hover:border-brand hover:text-brand"
          >
            Track Order
          </Link>
        </div>
      </section>

      {/* Service strip */}
      <section className="mx-auto grid max-w-4xl grid-cols-1 gap-4 px-4 py-12 sm:grid-cols-3">
        {[
          { t: "Delivery", d: "Hot food to your door" },
          { t: "Takeaway", d: "Quick bites & chai to go" },
          { t: "Dine-in", d: "BBQ & mains at our table" },
        ].map((s) => (
          <div key={s.t} className="rounded-2xl border border-neutral-200 p-6 text-center">
            <h3 className="font-serif text-xl font-black text-ink">{s.t}</h3>
            <p className="mt-1 text-sm text-neutral-500">{s.d}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
