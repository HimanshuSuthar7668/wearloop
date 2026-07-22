import Link from "next/link";
import { Search, Calendar, Package, RotateCcw, Shield, Sparkles, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — Fashion Rental Made Simple",
  description:
    "Learn how WearLoop's clothing rental service works in four simple steps — browse, pick your dates, receive pristine pieces, and return with ease.",
  keywords: [
    "how fashion rental works",
    "how to rent clothes India",
    "WearLoop rental process",
    "clothes on rent steps",
  ],
  alternates: {
    canonical: "https://www.wearloop.in/how-it-works",
  },
  openGraph: {
    title: "How WearLoop Works — Fashion Rental Made Simple",
    description:
      "Four easy steps to a full designer wardrobe — browse, pick dates, receive, return. No subscriptions. Free delivery.",
    url: "https://www.wearloop.in/how-it-works",
    type: "website",
  },
  twitter: {
    title: "How WearLoop Works — Fashion Rental Made Simple",
    description:
      "Four easy steps to a full designer wardrobe — browse, pick dates, receive, return. No subscriptions. Free delivery.",
  },
};

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Browse & choose",
    description:
      "Explore our curated collection of 2,400+ pieces from premium brands. Filter by occasion, size, style, and rental duration. Add items to your bag — no commitment until checkout.",
    detail: "New pieces added every week.",
  },
  {
    icon: Calendar,
    step: "02",
    title: "Pick your dates",
    description:
      "Choose when you need the piece — whether it's a single day, a long weekend, or a full week. Flexible calendar booking means you always get it when you need it.",
    detail: "Book up to 60 days in advance.",
  },
  {
    icon: Package,
    step: "03",
    title: "Delivered, pristine",
    description:
      "We professionally dry-clean and inspect every item before shipping. Your rental arrives in a reusable WearLoop garment bag, delivered to your door the day before your rental start.",
    detail: "Free delivery on all orders.",
  },
  {
    icon: RotateCcw,
    step: "04",
    title: "Wear, return, repeat",
    description:
      "Enjoy wearing it. When your rental ends, fold it into the pre-paid return bag and hand it to any courier or drop it at a partner location. We handle the rest.",
    detail: "Returns in under 3 minutes.",
  },
];

const faqs = [
  {
    q: "What if an item doesn't fit?",
    a: "We offer a Fit Guarantee — if your item doesn't fit, contact us within 2 hours of delivery for a free replacement or full credit.",
  },
  {
    q: "What if I damage an item?",
    a: "Minor wear is expected and covered. For significant damage, we charge a repair fee (10–30% of retail value). Accidental damage protection is available at checkout.",
  },
  {
    q: "How clean are the items?",
    a: "Every item is professionally dry-cleaned and inspected after each rental. We have a strict 12-point quality check before any piece ships again.",
  },
  {
    q: "Can I extend my rental?",
    a: "Yes, up to 48 hours before your return date through your account. Extensions are charged at the daily rate and subject to availability.",
  },
  {
    q: "Is there a membership fee?",
    a: "No. WearLoop is pay-as-you-go. You only pay when you rent something.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-[#c9a898] mb-4">
          Simple by design
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-parchment mb-5 text-balance">
          Renting clothes should be
          <br />
          <em className="not-italic text-[#c9a898]">this easy.</em>
        </h1>
        <p className="text-parchment/50 text-lg max-w-lg mx-auto">
          From browsing to your door in a few taps. No subscriptions, no
          surprises, no effort.
        </p>
      </section>

      {/* Steps */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24">
        <div className="grid md:grid-cols-2 gap-6">
          {steps.map(({ icon: Icon, step, title, description, detail }) => (
            <div
              key={step}
              className="relative p-8 rounded-2xl border border-parchment/8 hover:border-parchment/16 transition-colors bg-charcoal-light overflow-hidden"
            >
              <span className="absolute top-6 right-6 font-display text-7xl font-bold text-parchment/[0.04]">
                {step}
              </span>
              <div className="flex items-start gap-5">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-rose/10 border border-rose/20 flex items-center justify-center">
                  <Icon size={20} className="text-[#c9a898]" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-parchment mb-2">
                    {title}
                  </h2>
                  <p className="text-sm text-parchment/50 leading-relaxed mb-3">
                    {description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-sage">
                    <Sparkles size={10} />
                    {detail}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-charcoal-light border-y border-parchment/10 py-12">
        <div className="max-w-5xl mx-auto px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: Shield, label: "Fit Guarantee", sub: "Free replacement if it doesn't fit" },
            { icon: Package, label: "Free Delivery", sub: "On every order, always" },
            { icon: RotateCcw, label: "Easy Returns", sub: "Pre-paid return bag included" },
            { icon: Sparkles, label: "Cleaned & Inspected", sub: "12-point quality check" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-parchment/5 border border-parchment/10 flex items-center justify-center">
                <Icon size={16} className="text-parchment/40" />
              </div>
              <div>
                <p className="text-sm font-semibold text-parchment">{label}</p>
                <p className="text-xs text-parchment/40 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-24">
        <h2 className="font-display text-3xl font-bold text-parchment mb-10 text-center">
          Common questions
        </h2>
        <div className="flex flex-col divide-y divide-parchment/10">
          {faqs.map(({ q, a }) => (
            <div key={q} className="py-6">
              <h3 className="font-display text-base font-semibold text-parchment mb-2">
                {q}
              </h3>
              <p className="text-sm text-parchment/50 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24 text-center">
        <p className="font-display text-2xl font-semibold text-parchment mb-4">
          Ready to start?
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
