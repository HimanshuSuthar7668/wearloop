import Link from "next/link";
import { AlertTriangle, Code2, ShieldOff, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer — WearLoop",
  description:
    "WearLoop is a demo project built for practice and learning purposes only — not a real, operating business.",
  robots: { index: false, follow: false },
};

const points = [
  {
    icon: Code2,
    title: "This is a practice project",
    body: "WearLoop is a personal / educational project built to practice web development — design, front-end engineering, and backend integration. It is not a registered company, and no real clothing rental business operates behind it.",
  },
  {
    icon: ShieldOff,
    title: "Nothing here is for sale",
    body: "Every product, price, brand name, and rental listing on this site is placeholder content created for demonstration purposes. WearLoop does not sell, rent, ship, or fulfil anything in the real world, and no genuine transaction takes place through this site.",
  },
  {
    icon: AlertTriangle,
    title: "Don't enter real payment details",
    body: "The checkout flow simulates a payment for demo purposes only — it does not connect to a real payment gateway. Please don't enter real card numbers, UPI credentials, or other sensitive payment information anywhere on this site.",
  },
];

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-[#c9a898] mb-4">
          Please read
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-parchment mb-5 text-balance">
          Disclaimer
        </h1>
        <p className="text-parchment/40 text-sm">Last updated: 4 July 2026</p>
      </section>

      {/* Callout */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 pb-4">
        <div className="flex gap-4 items-start bg-rose/5 border border-rose/20 rounded-2xl p-6">
          <AlertTriangle size={20} className="text-[#c9a898] shrink-0 mt-0.5" />
          <p className="text-parchment/70 leading-relaxed text-sm">
            <strong className="text-parchment">WearLoop is not a real business.</strong>{" "}
            This entire website — including its products, brands, pricing, and rental
            listings — was built purely for practice and demonstration purposes. Nothing
            on this site is being sold, rented, promoted, or offered in the real world.
          </p>
        </div>
      </section>

      {/* Points */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-16">
        <div className="flex flex-col divide-y divide-parchment/10">
          {points.map(({ icon: Icon, title, body }) => (
            <div key={title} className="py-8 flex gap-5">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-rose/10 border border-rose/20 flex items-center justify-center">
                <Icon size={18} className="text-[#c9a898]" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-parchment mb-2">
                  {title}
                </h2>
                <p className="text-sm text-parchment/50 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Extra notes */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 pb-16">
        <div className="flex flex-col gap-3 text-sm text-parchment/50 leading-relaxed">
          <p>
            Any resemblance to real brands, products, or businesses is unintentional and
            used only as realistic-looking placeholder content. All names, images, and
            descriptions are for illustration purposes and carry no commercial intent.
          </p>
          <p>
            The site&apos;s Privacy Policy and Terms of Service pages are also written as
            realistic examples of what such documents would look like for a real
            business — they don&apos;t reflect an actual company&apos;s legal
            obligations toward you.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-charcoal-light border-y border-parchment/10 py-16">
        <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
          <h2 className="font-display text-xl font-semibold text-parchment mb-3">
            Have a question about this project?
          </h2>
          <p className="text-sm text-parchment/50 leading-relaxed mb-5">
            Feel free to reach out — happy to talk about how it was built.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-parchment hover:text-[#c9a898] transition-colors"
          >
            <Mail size={14} />
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
