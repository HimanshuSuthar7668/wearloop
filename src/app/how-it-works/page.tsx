import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { PageHeader, Section, RuledList, PageFooterNote, ButtonLink } from "@/components/ui/Page";

export const metadata: Metadata = pageMetadata({
  title: "How renting works",
  description:
    "Pick a piece and your dates, get it delivered cleaned the day before, then send it back in the prepaid bag.",
  path: "/how-it-works",
});

const steps = [
  {
    title: "Find something",
    meta: "New pieces go up every week",
    body: "There are 2,400+ pieces from premium labels. Filter by occasion, size and how long you need it. Nothing is charged until checkout, so add as many as you like while you decide.",
  },
  {
    title: "Pick your dates",
    meta: "Book up to 60 days ahead",
    body: "A single day, a long weekend or a full week. Choose the day you need it and we'll work backwards from there.",
  },
  {
    title: "It arrives the day before",
    meta: "Delivery is free",
    body: "Every piece is dry-cleaned and checked before it leaves us, then delivered in a reusable WearLoop garment bag the day before your rental starts.",
  },
  {
    title: "Send it back",
    meta: "Takes about three minutes",
    body: "Fold it into the prepaid return bag and hand it to the courier, or drop it at a partner location. Cleaning and repairs are on us.",
  },
];

const promises = [
  { title: "If it doesn't fit", body: "Tell us within 2 hours of delivery and we'll send a replacement or give you full credit." },
  { title: "Delivery", body: "Free on every order. The return bag is prepaid and comes in the box." },
  { title: "Between rentals", body: "Each piece is cleaned and goes through a 12-point check before it's sent out again." },
];

const faqs = [
  {
    title: "What if I damage something?",
    body: "Normal wear is expected and covered. For real damage there's a repair fee of 10 to 30% of the retail price, which you can avoid entirely by adding Accidental Damage Protection at checkout.",
  },
  {
    title: "Can I keep it longer?",
    body: "Yes, if you extend at least 48 hours before your return date. Extra days are charged at the daily rate, as long as nobody else has booked it.",
  },
  {
    title: "Is there a membership fee?",
    body: "No. You pay for what you rent and nothing else.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="pt-20">
      <PageHeader
        title="From your basket to your door, and back again."
        intro="Renting should take less effort than buying. Here's every step, including the bits people usually ask about afterwards."
      />

      <Section title="Four steps">
        <RuledList items={steps} numbered />
      </Section>

      <Section title="What we promise" tinted>
        <dl className="grid sm:grid-cols-3 gap-8">
          {promises.map(({ title, body }) => (
            <div key={title} className="border-t border-ink/25 pt-4">
              <dt className="font-display text-lg text-ink">{title}</dt>
              <dd className="mt-2 text-sm text-ink/75 leading-relaxed">{body}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Questions people ask" aside="The full list lives on the FAQ page.">
        <RuledList items={faqs} />
      </Section>

      <PageFooterNote
        title="Seen enough?"
        body="The collection is the best explanation."
        action={<ButtonLink href="/shop">Browse the collection</ButtonLink>}
      />
    </div>
  );
}
