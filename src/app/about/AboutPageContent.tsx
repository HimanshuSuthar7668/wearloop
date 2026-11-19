"use client";

import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { useReveal } from "@/hooks/useReveal";

const beliefs = [
  {
    title: "Buy less, choose well",
    description:
      "We only take pieces we think will survive dozens of rentals. Fast fashion doesn't make it onto the rail, however popular it is.",
  },
  {
    title: "Show the working",
    description:
      "We log the impact of every rental. Packaging is reusable, cleaning is waterless where possible, and deliveries run on electric vehicles.",
  },
  {
    title: "Share the wardrobe",
    description:
      "The dress you wore last month is now at someone's sangeet in another city. We like that, and we think you will too.",
  },
];

const numbers = [
  { value: "48,000+", label: "rentals completed" },
  { value: "156 t", label: "textile waste prevented" },
  { value: "12,000+", label: "members" },
  { value: "4.8 / 5", label: "average rating" },
];

export default function AboutPageContent() {
  const heroRef = useReveal<HTMLElement>();
  const beliefsRef = useReveal<HTMLElement>();

  return (
    <div className="pt-20">
      <section ref={heroRef} className="max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-16 md:pt-24 grid md:grid-cols-12 gap-10">
        <h1
          className="md:col-span-7 font-display text-[2.75rem] leading-[1.04] md:text-6xl font-normal tracking-[-0.02em] text-ink text-balance"
          data-reveal
        >
          Three friends, one group chat, and too many outfits worn once.
        </h1>

        <div className="md:col-span-5 md:pt-3 space-y-5 text-ink/75 leading-relaxed" data-reveal>
          <p>
            WearLoop started in 2023 as a shared wardrobe between three friends
            who were tired of buying something new for every wedding, launch
            and dinner. The average piece of clothing gets worn about seven
            times before it&apos;s thrown away. Ours were doing worse.
          </p>
          <p>
            The group chat turned into a spreadsheet, then a waitlist, then
            this. We now work directly with premium labels and independent
            designers, and we pick each piece for how long it will last as
            much as how it looks.
          </p>
        </div>
      </section>

      <section ref={beliefsRef} className="bg-paper-2 py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-12">
          <h2 className="md:col-span-4 font-display text-3xl md:text-4xl font-normal text-ink" data-reveal>
            What we try to do
          </h2>
          <ol className="md:col-span-8 divide-y divide-ink/15 border-y border-ink/15">
            {beliefs.map(({ title, description }, i) => (
              <li key={title} className="py-6 grid sm:grid-cols-[3rem_1fr_1.4fr] gap-x-6 gap-y-2" data-reveal>
                <span className="text-sm text-ink/70 tabular-nums">{i + 1}.</span>
                <h3 className="font-display text-xl text-ink">{title}</h3>
                <p className="text-sm text-ink/70 leading-relaxed">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-24">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-10 border-t border-ink/15 pt-8">
          {numbers.map(({ value, label }) => (
            <div key={label}>
              <dt className="sr-only">{label}</dt>
              <dd className="font-display text-4xl md:text-5xl text-ink tabular-nums">{value}</dd>
              <dd className="mt-2 text-sm text-ink/60">{label}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            href="/shop"
            className={buttonClass()}
          >
            Browse the collection
          </Link>
          <Link
            href="/careers"
            className="text-sm text-ink underline underline-offset-[6px] decoration-ink/30 hover:decoration-ink transition-colors"
          >
            We&apos;re hiring
          </Link>
        </div>
      </section>
    </div>
  );
}
