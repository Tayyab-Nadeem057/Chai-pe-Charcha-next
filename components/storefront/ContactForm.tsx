"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

const SUBJECTS = ["General Inquiry", "Reservation", "Catering / Events", "Feedback", "Other"];

// Composes the form into a pre-filled WhatsApp message — inquiries land straight
// in the restaurant's WhatsApp, so no email server is required.
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState("");

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text =
      `*New inquiry — ${SITE.name}*\n\n` +
      `Name: ${name || "—"}\n` +
      `Email: ${email || "—"}\n` +
      `Subject: ${subject}\n\n` +
      `${message || "—"}`;
    window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
  }

  const label = "mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-cocoa/45";
  const field =
    "w-full rounded-xl border border-cocoa/10 bg-cream/40 px-4 py-3 text-sm text-cocoa placeholder-cocoa/30 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

  return (
    <form
      onSubmit={send}
      className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-cocoa/5 backdrop-blur sm:p-7"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Full Name</label>
          <input
            className={field}
            placeholder="e.g. Ali Raza"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className={label}>Email Address</label>
          <input
            type="email"
            className={field}
            placeholder="ali@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className={label}>Subject</label>
        <select className={field} value={subject} onChange={(e) => setSubject(e.target.value)}>
          {SUBJECTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className={label}>Message</label>
        <textarea
          rows={4}
          className={`${field} resize-none`}
          placeholder="How can we help you?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="btn-brand mt-5 w-full py-4 text-base shadow-[0_0_24px_rgba(232,115,28,0.4)]"
      >
        Send Message
      </button>
    </form>
  );
}
