import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { PageHeader, Section, RuledList, PageFooterNote, ButtonLink } from "@/components/ui/Page";

export const metadata: Metadata = pageMetadata({
  title: "Sustainability",
  description:
    "How renting keeps clothes in use for longer, and the numbers we track: waste prevented, water saved, wears per piece.",
  path: "/sustainability",
});

const impactStats = [
  { value: "156 t", label: "textile waste kept out of landfill" },
  { value: "30×", label: "average rentals per garment" },
  { value: "70%", label: "less water than conventional laundering" },
  { value: "0", label: "single-use plastic in our packaging" },
];

const practices = [
  {
    title: "Pieces that get used",
    body: "On average a piece is rented more than 30 times before we retire it. One garment does the work of dozens of separate purchases.",
  },
  {
    title: "Cleaning with less water",
    body: "We use waterless and low-water dry cleaning between rentals. It uses up to 70% less water than normal laundering, and the clothes come out just as clean.",
  },
  {
    title: "One bag, many trips",
    body: "Orders go out in a sturdy garment bag that comes back with the return. There's no single-use plastic anywhere in the box.",
  },
  {
    title: "Fewer van journeys",
    body: "We group deliveries and pickups by neighbourhood and route stock through regional hubs, so fewer trips are needed.",
  },
];

const lifecycle = [
  { title: "Chosen to last", body: "Good fabric, strong seams and construction that survives dozens of wears and cleans." },
  { title: "Worn by many", body: "Members rent instead of buying, so one garment replaces several purchases in several wardrobes." },
  { title: "Restored in between", body: "Cleaning, a 12-point inspection and small repairs after every return." },
  { title: "Retired properly", body: "At the end of its rental life a piece goes to textile recycling or donation, never landfill." },
];

export default function SustainabilityPage() {
  return (
    <div className="pt-20">
      <PageHeader
        title="Most clothes get worn seven times. Ours get worn thirty."
        intro="That gap is the reason WearLoop exists. Here is how we keep it going, and the numbers we track."
      />

      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-10 border-t border-ink/15 pt-8">
          {impactStats.map(({ value, label }) => (
            <div key={label} className="pr-6">
              <dt className="sr-only">{label}</dt>
              <dd className="font-display text-4xl md:text-5xl text-ink tabular-nums">{value}</dd>
              <dd className="mt-2 text-sm text-ink/70 max-w-[14rem]">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Section title="What we do" tinted>
        <RuledList items={practices} />
      </Section>

      <Section title="The life of a piece" aside="Every garment follows the same route, from the day it arrives to the day it leaves.">
        <RuledList items={lifecycle} numbered />
      </Section>

      <Section title="Why we publish this" tinted>
        <p className="max-w-2xl text-ink/80 leading-relaxed">
          We measure waste prevented, water saved and how long garments stay
          in use, for every rental, and review the numbers every quarter. If
          renting didn&apos;t beat buying on these, there&apos;d be no point
          to the business.
        </p>
      </Section>

      <PageFooterNote title="Rent the next one." action={<ButtonLink href="/shop">Browse the collection</ButtonLink>} />
    </div>
  );
}
