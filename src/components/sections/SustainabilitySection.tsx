"use client";

import Link from "next/link";
import { useReveal } from "@/hooks/useReveal";

const facts = [
  { figure: "3.2 kg", text: "of textile waste kept out of landfill, on average, each time something is rented instead of bought." },
  { figure: "73%", text: "of members say they buy fewer new clothes since joining." },
];

export default function SustainabilitySection() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="py-20 md:py-28 max-w-7xl mx-auto px-6 md:px-10">
      <div className="grid md:grid-cols-12 gap-12 md:gap-8">
        <p
          className="md:col-span-7 font-display text-[1.75rem] leading-[1.25] md:text-[2.6rem] md:leading-[1.18] tracking-[-0.01em] text-ink text-balance"
          data-reveal
        >
          A dress bought for one wedding gets worn once. The same dress on our
          rail gets worn by up to{" "}
          <span className="italic text-sage-ink">forty people</span> a year.
        </p>

        <div className="md:col-span-4 md:col-start-9 flex flex-col justify-end" data-reveal>
          <dl className="divide-y divide-ink/15 border-y border-ink/15">
            {facts.map(({ figure, text }) => (
              <div key={figure} className="py-5 flex gap-5">
                <dt className="font-display text-2xl text-ink tabular-nums w-20 shrink-0">{figure}</dt>
                <dd className="text-sm text-ink/70 leading-relaxed">{text}</dd>
              </div>
            ))}
          </dl>
          <Link
            href="/sustainability"
            className="mt-6 self-start text-sm text-ink underline underline-offset-[6px] decoration-ink/30 hover:decoration-ink transition-colors"
          >
            How we measure this
          </Link>
        </div>
      </div>
    </section>
  );
}
