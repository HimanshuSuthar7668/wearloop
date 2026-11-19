import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { PageHeader, Section, RuledList, PageFooterNote, ButtonLink } from "@/components/ui/Page";

export const metadata: Metadata = pageMetadata({
  title: "Size guide",
  description:
    "Body measurements for every WearLoop size, how to choose between two sizes, and our Fit Guarantee.",
  path: "/sizing",
});

const sizeChart = [
  {
    size: "XS",
    us: "0–2",
    uk: "4–6",
    eu: "32–34",
    bustCm: "78–81",
    bustIn: "30.5–32",
    waistCm: "61–64",
    waistIn: "24–25",
    hipCm: "86–89",
    hipIn: "34–35",
  },
  {
    size: "S",
    us: "4–6",
    uk: "8–10",
    eu: "36–38",
    bustCm: "84–89",
    bustIn: "33–35",
    waistCm: "67–71",
    waistIn: "26.5–28",
    hipCm: "92–97",
    hipIn: "36–38",
  },
  {
    size: "M",
    us: "8–10",
    uk: "12–14",
    eu: "40–42",
    bustCm: "92–97",
    bustIn: "36–38",
    waistCm: "74–79",
    waistIn: "29–31",
    hipCm: "100–105",
    hipIn: "39.5–41",
  },
  {
    size: "L",
    us: "12–14",
    uk: "16–18",
    eu: "44–46",
    bustCm: "100–105",
    bustIn: "39.5–41",
    waistCm: "82–87",
    waistIn: "32–34",
    hipCm: "108–113",
    hipIn: "42.5–44.5",
  },
  {
    size: "XL",
    us: "16–18",
    uk: "20–22",
    eu: "48–50",
    bustCm: "108–114",
    bustIn: "42.5–45",
    waistCm: "90–96",
    waistIn: "35.5–38",
    hipCm: "116–122",
    hipIn: "45.5–48",
  },
];

const tips = [
  {
    title: "Between two sizes?",
    body: "For structured pieces like blazers and fitted dresses, go up a size so you can move. For loose, flowing cuts, go down for a neater shape.",
  },
  {
    title: "Read the note on the product page",
    body: "If a piece runs small, large or long, the listing says so. Those notes come from our own fittings and from members.",
  },
  {
    title: "Save your measurements",
    body: "Add them to your account once and we'll mark the size that suits you on every product.",
  },
  {
    title: "Check the reviews",
    body: "Reviewers often mention their usual size and how a piece fitted them, which is the most useful check there is.",
  },
];

export default function SizingPage() {
  return (
    <div className="pt-20">
      <PageHeader
        title="Pick a size with confidence."
        intro="Labels vary between brands, so we measure every piece ourselves. Here's how to choose, and what happens if it still doesn't fit."
      />

      <Section
        title="How we size"
        aside="We check the designer's measurements against the actual garment before it joins the collection."
      >
        <p className="max-w-2xl text-ink/80 leading-relaxed">
          Fit varies between brands and cuts, so treat the chart below as a
          starting point. Product pages flag anything that runs noticeably
          tight, loose or long.
        </p>
      </Section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16 md:pb-20">
        <div className="flex items-baseline justify-between gap-6 mb-6">
          <h2 className="font-display text-2xl md:text-3xl text-ink">Size chart</h2>
          <p className="text-sm text-ink/60">Body measurements, cm / in</p>
        </div>
        <div className="overflow-x-auto border-y border-ink/20">
          <table className="w-full text-sm text-left border-collapse min-w-[720px] tabular-nums">
            <thead>
              <tr className="text-ink/60 text-xs border-b border-ink/20">
                <th className="py-3 pr-5 font-medium">Size</th>
                <th className="py-3 px-5 font-medium">US</th>
                <th className="py-3 px-5 font-medium">UK</th>
                <th className="py-3 px-5 font-medium">EU</th>
                <th className="py-3 px-5 font-medium">Bust</th>
                <th className="py-3 px-5 font-medium">Waist</th>
                <th className="py-3 px-5 font-medium">Hip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {sizeChart.map((row) => (
                <tr key={row.size}>
                  <td className="py-4 pr-5 font-display text-base text-ink">{row.size}</td>
                  <td className="py-4 px-5 text-ink/80">{row.us}</td>
                  <td className="py-4 px-5 text-ink/80">{row.uk}</td>
                  <td className="py-4 px-5 text-ink/80">{row.eu}</td>
                  <td className="py-4 px-5 text-ink/80">{row.bustCm} / {row.bustIn}</td>
                  <td className="py-4 px-5 text-ink/80">{row.waistCm} / {row.waistIn}</td>
                  <td className="py-4 px-5 text-ink/80">{row.hipCm} / {row.hipIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Section title="Choosing between sizes" tinted>
        <RuledList items={tips} />
      </Section>

      <Section title="The Fit Guarantee">
        <p className="max-w-2xl text-ink/80 leading-relaxed">
          A chart only goes so far. If something doesn&apos;t fit, tell us
          within 2 hours of delivery and we&apos;ll send a replacement or put
          the full amount back in your account.
        </p>
      </Section>

      <PageFooterNote
        title="Still unsure?"
        body="Tell us what you're looking at and your usual size."
        action={<ButtonLink href="/contact">Ask our stylists</ButtonLink>}
      />
    </div>
  );
}
