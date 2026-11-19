"use client";

import Link from "next/link";
import { useReveal } from "@/hooks/useReveal";

const timeline = [
  {
    when: "Today",
    title: "Pick a piece and a size",
    body: "Choose how long you need it: one day, three, or a week. The price is the price; there's no subscription to cancel later.",
  },
  {
    when: "Within 24 hours",
    title: "It turns up ready to wear",
    body: "Dry-cleaned, pressed and folded into a reusable garment bag.",
  },
  {
    when: "When you're done",
    title: "Put it back in the bag",
    body: "Seal the prepaid return bag and hand it to the courier. Don't wash it; cleaning is our job.",
  },
];

export default function HowItWorksSection() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="bg-paper-2 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4" data-reveal>
          <h2 className="font-display text-3xl md:text-4xl font-normal tracking-[-0.01em] text-ink">
            How a rental goes
          </h2>
          <p className="mt-4 text-ink/70 max-w-xs leading-relaxed">
            Most people ask the same three questions. Here&apos;s the short
            version.
          </p>
          <Link
            href="/how-it-works"
            className="mt-6 inline-block text-sm text-ink underline underline-offset-[6px] decoration-ink/30 hover:decoration-ink transition-colors"
          >
            The long version
          </Link>
        </div>

        <ol className="md:col-span-8 grid sm:grid-cols-3 gap-x-8">
          {timeline.map(({ when, title, body }) => (
            <li key={when} className="border-t border-ink/25 pt-5 pb-8" data-reveal>
              <p className="text-xs font-medium uppercase tracking-wider text-rose-ink">{when}</p>
              <h3 className="mt-3 font-display text-xl text-ink leading-snug">{title}</h3>
              <p className="mt-2 text-sm text-ink/70 leading-relaxed">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
