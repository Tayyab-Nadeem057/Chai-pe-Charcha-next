"use client";

import { useState } from "react";

// Lightweight newsletter capture. There's no mailing-list backend yet, so this
// just confirms locally — wire it to a real provider (e.g. Mailchimp) later.
export function NewsletterForm() {
  const [done, setDone] = useState(false);

  if (done) {
    return <p className="text-sm text-brand-light">Thanks — we&apos;ll be in touch! ☕</p>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
      className="flex items-center gap-2"
    >
      <input
        type="email"
        required
        placeholder="Email"
        className="w-full rounded-lg border border-cream/15 bg-cream/10 px-3 py-2 text-sm text-cream placeholder-cream/40 focus:border-brand focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white transition hover:bg-brand-light"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </form>
  );
}
