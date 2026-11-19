import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { PageHeader, PageFooterNote, ButtonLink } from "@/components/ui/Page";

export const metadata: Metadata = pageMetadata({
  title: "Questions about renting",
  description:
    "Answers on rental lengths, delivery, returns, damage, deposits, payment and cancelling a WearLoop order.",
  path: "/faq",
});

const categories = [
  {
    category: "Ordering",
    faqs: [
      {
        q: "How does renting actually work?",
        a: "Pick a piece and your dates, then check out. We clean and check everything and deliver it the day before your rental starts. When you're done, send it back in the prepaid bag that came with it.",
      },
      {
        q: "How long can I keep something?",
        a: "You can rent for one day, three days or a week. If you need longer, extend from your account at least 48 hours before the return date, as long as it isn't booked by someone else.",
      },
      {
        q: "Can I rent more than one thing at once?",
        a: "Yes. Put as many pieces in one order as you like, each with its own dates if you need.",
      },
      {
        q: "What if it doesn't fit?",
        a: "Every order has the Fit Guarantee. Tell us within 2 hours of delivery and we'll send a replacement or give you full credit.",
      },
    ],
  },
  {
    category: "Delivery and returns",
    faqs: [
      {
        q: "Is delivery free?",
        a: "Yes, on every order in the cities we serve, with no minimum spend.",
      },
      {
        q: "How do I send things back?",
        a: "Fold them into the return bag from your order, seal it, and give it to the courier at pickup or drop it at a partner location. There's nothing to print.",
      },
      {
        q: "What if I'm late returning something?",
        a: "There are a few hours of grace built in. After that, each extra day is charged at the daily rate.",
      },
      {
        q: "Do you deliver outside the big cities?",
        a: "We cover most metro and tier-1 cities and add more regularly. Put your pincode in at checkout to check.",
      },
    ],
  },
  {
    category: "Damage, care and payment",
    faqs: [
      {
        q: "What if I damage something?",
        a: "Normal wear is always covered. For real damage there may be a repair fee of 10 to 30% of the retail price. Add Accidental Damage Protection at checkout and there's no fee at all.",
      },
      {
        q: "How clean are the clothes?",
        a: "Everything is professionally dry-cleaned and goes through a 12-point inspection after every rental.",
      },
      {
        q: "How can I pay?",
        a: "Credit and debit cards, UPI, net banking and the main wallets. Payments go through PCI-DSS compliant providers.",
      },
      {
        q: "Is there a deposit?",
        a: "For most pieces, no. A handful of high-value items need a refundable deposit, which is shown before you pay and released once the piece comes back in good condition.",
      },
    ],
  },
  {
    category: "Cancelling and your account",
    faqs: [
      {
        q: "Can I cancel or change my dates?",
        a: "Cancel free up to 24 hours before your delivery slot for a full refund. You can move your dates from your account if the piece is free.",
      },
      {
        q: "Is there a subscription?",
        a: "No. You only pay when you rent something.",
      },
      {
        q: "How do I change my address or sizes?",
        a: "In your account settings. Keeping your sizes up to date means better recommendations next time.",
      },
    ],
  },
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export default function FaqPage() {
  return (
    <div className="pt-20">
      <PageHeader
        title="Questions we get asked a lot."
        intro="About renting, returns, damage and payment. If yours isn't here, write to us."
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10">
        <nav className="hidden md:block md:col-span-3" aria-label="Topics">
          <ul className="sticky top-24 space-y-2 text-sm">
            {categories.map(({ category }) => (
              <li key={category}>
                <a href={`#${slug(category)}`} className="text-ink/70 hover:text-ink hover:underline underline-offset-4">
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-8 md:col-start-5 space-y-14">
          {categories.map(({ category, faqs }) => (
            <section key={category} id={slug(category)} className="scroll-mt-24">
              <h2 className="font-display text-2xl text-ink mb-2">{category}</h2>
              <div className="divide-y divide-ink/15 border-b border-ink/15">
                {faqs.map(({ q, a }) => (
                  <details key={q} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-ink [&::-webkit-details-marker]:hidden">
                      <span className="font-medium">{q}</span>
                      <span className="text-ink/60 text-lg leading-none transition-transform group-open:rotate-45" aria-hidden>
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-ink/75 leading-relaxed max-w-2xl">{a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <PageFooterNote
        title="Didn't find it?"
        body="Sizing, an order, a partnership: we reply within 24 hours."
        action={<ButtonLink href="/contact">Contact us</ButtonLink>}
      />
    </div>
  );
}
