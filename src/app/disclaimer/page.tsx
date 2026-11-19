import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { PageHeader, Section, RuledList, PageFooterNote, TextLink } from "@/components/ui/Page";

export const metadata: Metadata = pageMetadata({
  title: "Disclaimer",
  description:
    "WearLoop is a practice project. Nothing on this site is for sale, and no real orders or payments are taken.",
  path: "/disclaimer",
  noindex: true,
});

const points = [
  {
    title: "This is a practice project",
    body: "WearLoop is a personal, educational project built to practise design, front-end engineering and backend integration. It isn't a registered company, and there is no real clothing rental business behind it.",
  },
  {
    title: "Nothing here is for sale",
    body: "Every product, price, brand name and listing is placeholder content. WearLoop doesn't sell, rent, ship or deliver anything, and no real transaction happens on this site.",
  },
  {
    title: "Don't enter real payment details",
    body: "Checkout only simulates a payment and isn't connected to a real payment gateway. Please don't type real card numbers, UPI details or other sensitive payment information anywhere here.",
  },
];

export default function DisclaimerPage() {
  return (
    <div className="pt-20">
      <PageHeader title="Disclaimer" meta="Last updated 4 July 2026" />

      <section className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="border-l-4 border-rose-ink bg-paper-2 px-6 py-6 md:px-8 max-w-3xl">
          <p className="font-display text-xl md:text-2xl text-ink">WearLoop is not a real business.</p>
          <p className="mt-2 text-ink/80 leading-relaxed">
            The whole site, including its products, brands, prices and
            listings, was built for practice and demonstration. Nothing on it
            is being sold, rented, promoted or offered in the real world.
          </p>
        </div>
      </section>

      <Section title="In short">
        <RuledList items={points} />
      </Section>

      <Section title="Also worth knowing" tinted>
        <div className="max-w-2xl space-y-4 text-ink/80 leading-relaxed">
          <p>
            Any resemblance to real brands, products or businesses is
            unintentional. Names, images and descriptions are there to make
            the demo look realistic and carry no commercial intent.
          </p>
          <p>
            The Privacy Policy and Terms of Service are written as examples of
            what those documents would look like for a real business. They
            don&apos;t describe any actual company&apos;s legal obligations to
            you.
          </p>
        </div>
      </Section>

      <PageFooterNote
        title="Curious how it was built?"
        body="Happy to talk about it."
        action={<TextLink href="/contact">Get in touch</TextLink>}
      />
    </div>
  );
}
