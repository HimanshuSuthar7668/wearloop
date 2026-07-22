import Link from "next/link";
import {
  Leaf,
  Repeat,
  Droplets,
  Recycle,
  Truck,
  PackageCheck,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Sustainability Commitment",
  description:
    "How WearLoop reduces textile waste through circular fashion — 156 tonnes prevented, 30x average garment uses, 70% less water. Our impact, our process.",
  keywords: [
    "sustainable fashion India",
    "circular fashion",
    "reduce textile waste",
    "eco-friendly clothing rental",
    "WearLoop sustainability",
  ],
  alternates: {
    canonical: "https://www.wearloop.in/sustainability",
  },
  openGraph: {
    title: "Our Sustainability Commitment — WearLoop",
    description:
      "156 tonnes of textile waste prevented. 30x average garment uses. See how renting instead of buying changes the math for the planet.",
    url: "https://www.wearloop.in/sustainability",
    type: "website",
  },
  twitter: {
    title: "Our Sustainability Commitment — WearLoop",
    description:
      "156 tonnes of textile waste prevented. 30x average garment uses. See how renting instead of buying changes the math for the planet.",
  },
};

const pillars = [
  {
    icon: Repeat,
    title: "Circular by design",
    description:
      "Every piece in our collection is rented an average of 30+ times before it's retired. Instead of one purchase and one closet, a single garment serves dozens of members — extending its useful life many times over.",
  },
  {
    icon: Droplets,
    title: "Low-impact cleaning",
    description:
      "We use waterless and low-water dry cleaning processes between rentals, cutting water usage by up to 70% compared to conventional laundering, without compromising on hygiene or finish.",
  },
  {
    icon: PackageCheck,
    title: "Reusable packaging",
    description:
      "Every order ships in a durable, reusable garment bag designed for round trips. There's no single-use plastic in our delivery or return packaging — the same bag goes out and comes back, order after order.",
  },
  {
    icon: Truck,
    title: "Consolidated logistics",
    description:
      "We batch deliveries and returns by neighbourhood and route stock through regional hubs, reducing the number of individual trips needed to get pieces to and from members.",
  },
];

const impactStats = [
  { value: "156 tonnes", label: "Textile waste prevented" },
  { value: "30x", label: "Average uses per garment" },
  { value: "70%", label: "Less water vs. conventional laundering" },
  { value: "0", label: "Single-use plastic in packaging" },
];

const lifecycle = [
  {
    step: "01",
    title: "Sourced to last",
    description:
      "We select pieces for durability first — quality fabrics, reinforced seams, and construction that can survive dozens of wears and cleanings.",
  },
  {
    step: "02",
    title: "Worn, not owned",
    description:
      "Members rent instead of buy, meaning one garment replaces what would otherwise be several individual purchases across different closets.",
  },
  {
    step: "03",
    title: "Restored between rentals",
    description:
      "Every return goes through professional cleaning, a 12-point inspection, and minor repairs where needed, before it re-enters the collection.",
  },
  {
    step: "04",
    title: "Retired responsibly",
    description:
      "When a piece finally reaches the end of its rental life, we route it to textile recycling or donation partners rather than landfill.",
  },
];

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-[#c9a898] mb-4">
          Our impact
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-parchment mb-5 text-balance">
          Fashion that gives back
          <br />
          <em className="not-italic text-[#c9a898]">more than it takes.</em>
        </h1>
        <p className="text-parchment/50 text-lg max-w-lg mx-auto">
          The average garment is worn just seven times before being discarded.
          WearLoop exists to change that math — one shared wardrobe at a time.
        </p>
      </section>

      {/* Impact numbers */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-charcoal-light border border-parchment/10 rounded-2xl py-10 px-6">
          {impactStats.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <p className="font-display text-4xl font-bold text-parchment">
                {value}
              </p>
              <p className="text-sm text-parchment/40">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24">
        <h2 className="font-display text-3xl font-bold text-parchment text-center mb-12">
          How we keep the loop going
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {pillars.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="p-8 rounded-2xl border border-parchment/8 hover:border-parchment/16 transition-colors bg-charcoal-light"
            >
              <div className="w-12 h-12 rounded-xl bg-rose/10 border border-rose/20 flex items-center justify-center mb-5">
                <Icon size={20} className="text-[#c9a898]" />
              </div>
              <h3 className="font-display text-lg font-semibold text-parchment mb-3">
                {title}
              </h3>
              <p className="text-sm text-parchment/50 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Lifecycle */}
      <section className="bg-charcoal-light border-y border-parchment/10 py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <h2 className="font-display text-3xl font-bold text-parchment text-center mb-4">
            The life of a WearLoop piece
          </h2>
          <p className="text-parchment/50 text-center max-w-xl mx-auto mb-14">
            From the day it enters our collection to the day it&apos;s retired,
            every garment follows the same disciplined lifecycle.
          </p>
          <div className="flex flex-col divide-y divide-parchment/10">
            {lifecycle.map(({ step, title, description }) => (
              <div key={step} className="py-6 flex gap-6 items-start">
                <span className="font-display text-2xl font-bold text-parchment/20 shrink-0 w-10">
                  {step}
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-parchment mb-1.5">
                    {title}
                  </h3>
                  <p className="text-sm text-parchment/50 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment note */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-24 text-center">
        <div className="w-12 h-12 rounded-xl bg-sage/10 border border-sage/20 flex items-center justify-center mx-auto mb-6">
          <Leaf size={20} className="text-sage" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-parchment mb-4">
          We publish our numbers, not just our intentions
        </h2>
        <p className="text-parchment/50 leading-relaxed">
          We track waste prevented, water saved, and garments kept in
          circulation for every rental — and we review these numbers
          internally each quarter. Sustainability isn&apos;t a marketing line for
          us; it&apos;s the reason the business model exists at all.
        </p>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24 text-center">
        <p className="font-display text-2xl font-semibold text-parchment mb-4">
          Join a wardrobe built to last.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-rose text-charcoal font-semibold text-sm px-8 py-4 rounded-lg hover:bg-rose-dark transition-colors group"
        >
          Browse the collection
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>
    </div>
  );
}
