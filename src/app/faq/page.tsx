import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about renting, sizing, delivery, returns, payments, and your WearLoop account. Everything you need to rent with confidence.",
  keywords: [
    "WearLoop FAQ",
    "fashion rental questions",
    "how to return rented clothes",
    "clothes rental help",
    "WearLoop help center",
  ],
  alternates: {
    canonical: "https://www.wearloop.in/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions — WearLoop",
    description:
      "Everything you need to know about renting, returning, sizing, and getting the most out of WearLoop.",
    url: "https://www.wearloop.in/faq",
    type: "website",
  },
  twitter: {
    title: "Frequently Asked Questions — WearLoop",
    description:
      "Everything you need to know about renting, returning, sizing, and getting the most out of WearLoop.",
  },
};

const categories = [
  {
    category: "Ordering & rentals",
    faqs: [
      {
        q: "How does renting on WearLoop actually work?",
        a: "Browse the collection, pick your dates, and check out. We clean and inspect your items, then deliver them the day before your rental starts. When your rental period ends, you return everything using the pre-paid return bag included in your order.",
      },
      {
        q: "How long can I keep a rental for?",
        a: "Standard rental periods are 4, 8, or 12 days, selectable at checkout. Need it longer? You can extend from your account up to 48 hours before your scheduled return, subject to availability.",
      },
      {
        q: "Can I rent multiple items in one order?",
        a: "Yes. You can mix and match any number of pieces into a single order and set the same or different rental windows for each, as long as items are available for your chosen dates.",
      },
      {
        q: "What if an item doesn't fit?",
        a: "We offer a Fit Guarantee on every order. If something doesn't fit, contact us within 2 hours of delivery and we'll arrange a free replacement or issue full credit — no questions asked.",
      },
    ],
  },
  {
    category: "Delivery & returns",
    faqs: [
      {
        q: "Is delivery free?",
        a: "Yes, delivery is free on every order across our serviceable cities, with no minimum order value.",
      },
      {
        q: "How do I send items back?",
        a: "Fold your items into the reusable return bag that arrived with your order, seal it, and hand it to the courier when they collect it, or drop it at any partner location. No printing, no paperwork.",
      },
      {
        q: "What happens if I return an item late?",
        a: "A grace period of a few hours is built into every return window. Beyond that, late returns are charged at the daily rental rate for each additional day the item is out.",
      },
      {
        q: "Do you deliver outside major cities?",
        a: "We currently deliver across most metro and tier-1 cities in India, with new locations added regularly. Enter your pincode at checkout to confirm serviceability.",
      },
    ],
  },
  {
    category: "Damage, care & payments",
    faqs: [
      {
        q: "What if I damage an item while wearing it?",
        a: "Normal wear is expected and always covered. For significant damage, a repair fee of 10–30% of the item's retail value may apply. You can add Accidental Damage Protection at checkout to waive this entirely.",
      },
      {
        q: "How clean are the clothes when they arrive?",
        a: "Every single item is professionally dry-cleaned and passed through a 12-point quality inspection after each rental, before it's approved to ship again.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards, UPI, net banking, and popular wallets. Payments are processed securely through our PCI-DSS compliant payment partners.",
      },
      {
        q: "Do you charge a security deposit?",
        a: "Most items don't require a deposit. For a small number of high-value pieces, a refundable deposit is shown clearly at checkout before you confirm your order, and it's released automatically once the item is returned in good condition.",
      },
    ],
  },
  {
    category: "Cancellations & account",
    faqs: [
      {
        q: "Can I cancel or reschedule an order?",
        a: "Yes. Orders can be cancelled free of charge up to 24 hours before your delivery slot for a full refund. Rescheduling is available from your account subject to item availability.",
      },
      {
        q: "Is there a membership or subscription fee?",
        a: "No. WearLoop is entirely pay-as-you-go — you only pay for what you rent, whenever you rent it.",
      },
      {
        q: "How do I update my address or size profile?",
        a: "Head to your account settings to update your delivery address, saved sizes, and payment methods at any time. Your size profile helps us recommend better fits on future orders.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-[#c9a898] mb-4">
          Support
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-parchment mb-5 text-balance">
          Questions,
          <br />
          <em className="not-italic text-[#c9a898]">answered.</em>
        </h1>
        <p className="text-parchment/50 text-lg max-w-lg mx-auto">
          Everything you need to know about renting, returning, and getting
          the most out of WearLoop.
        </p>
      </section>

      {/* FAQ categories */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 pb-24">
        <div className="flex flex-col gap-16">
          {categories.map(({ category, faqs }) => (
            <div key={category}>
              <h2 className="font-display text-2xl font-bold text-parchment mb-6">
                {category}
              </h2>
              <div className="flex flex-col divide-y divide-parchment/10">
                {faqs.map(({ q, a }) => (
                  <div key={q} className="py-6">
                    <h3 className="font-display text-base font-semibold text-parchment mb-2">
                      {q}
                    </h3>
                    <p className="text-sm text-parchment/50 leading-relaxed">
                      {a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24 text-center">
        <p className="font-display text-2xl font-semibold text-parchment mb-4">
          Still have a question?
        </p>
        <p className="text-parchment/50 text-sm max-w-md mx-auto mb-6">
          Our team is happy to help with anything not covered here — sizing,
          orders, or partnerships.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-rose text-charcoal font-semibold text-sm px-8 py-4 rounded-lg hover:bg-rose-dark transition-colors group"
        >
          Contact us
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>
    </div>
  );
}
