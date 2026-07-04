import Link from "next/link";
import { Ruler, Shield, MessageCircleQuestion, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sizing Guide — WearLoop",
  description:
    "Find your perfect fit with WearLoop's sizing guide — size chart, measuring tips, and our Fit Guarantee.",
};

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
    description:
      "For structured pieces like blazers and fitted dresses, size up for comfort and easier movement. For flowy, relaxed silhouettes, size down for a more tailored silhouette.",
  },
  {
    title: "Check the product page notes",
    description:
      "Many listings include a designer-specific note if a piece runs small, large, or true-to-size based on member feedback and our own fit testing.",
  },
  {
    title: "Use your saved measurements",
    description:
      "Add your measurements to your account once, and we'll highlight recommended sizes across the entire collection automatically.",
  },
  {
    title: "Read recent member reviews",
    description:
      "Reviews on each product page often mention the reviewer's usual size and how a specific piece fit them — a quick, real-world sanity check.",
  },
];

export default function SizingPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-[#c9a898] mb-4">
          Find your fit
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-parchment mb-5 text-balance">
          Sizing, made
          <br />
          <em className="not-italic text-[#c9a898]">simple.</em>
        </h1>
        <p className="text-parchment/50 text-lg max-w-lg mx-auto">
          Our sizes reflect how each piece actually fits, not just a label.
          Here&apos;s how to pick the right one — and what happens if you don&apos;t.
        </p>
      </section>

      {/* How sizing works */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 pb-16">
        <div className="flex items-start gap-5 p-8 rounded-2xl border border-parchment/8 bg-charcoal-light">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-rose/10 border border-rose/20 flex items-center justify-center">
            <Ruler size={20} className="text-[#c9a898]" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-parchment mb-2">
              How WearLoop sizing works
            </h2>
            <p className="text-sm text-parchment/50 leading-relaxed">
              Every piece is sized using the designer&apos;s own measurements,
              which we independently verify against the physical garment
              before it enters our collection. Because fit can vary between
              brands and cuts, we use the size chart below as a general
              guide, and product pages call out anything that runs
              noticeably tight, loose, or long.
            </p>
          </div>
        </div>
      </section>

      {/* Size chart */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 pb-20">
        <h2 className="font-display text-3xl font-bold text-parchment text-center mb-4">
          Size chart
        </h2>
        <p className="text-parchment/50 text-center max-w-lg mx-auto mb-10">
          Approximate body measurements for each size. All ranges are
          guidelines — always check individual product notes for
          designer-specific fit.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-parchment/10">
          <table className="w-full text-sm text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-charcoal-light text-parchment/40 text-xs uppercase tracking-wider">
                <th className="px-5 py-4 font-medium">Size</th>
                <th className="px-5 py-4 font-medium">US</th>
                <th className="px-5 py-4 font-medium">UK</th>
                <th className="px-5 py-4 font-medium">EU</th>
                <th className="px-5 py-4 font-medium">Bust (cm / in)</th>
                <th className="px-5 py-4 font-medium">Waist (cm / in)</th>
                <th className="px-5 py-4 font-medium">Hip (cm / in)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment/10">
              {sizeChart.map((row) => (
                <tr key={row.size} className="hover:bg-charcoal-light/50 transition-colors">
                  <td className="px-5 py-4 font-display font-semibold text-parchment">
                    {row.size}
                  </td>
                  <td className="px-5 py-4 text-parchment/60">{row.us}</td>
                  <td className="px-5 py-4 text-parchment/60">{row.uk}</td>
                  <td className="px-5 py-4 text-parchment/60">{row.eu}</td>
                  <td className="px-5 py-4 text-parchment/60">
                    {row.bustCm} / {row.bustIn}
                  </td>
                  <td className="px-5 py-4 text-parchment/60">
                    {row.waistCm} / {row.waistIn}
                  </td>
                  <td className="px-5 py-4 text-parchment/60">
                    {row.hipCm} / {row.hipIn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tips */}
      <section className="bg-charcoal-light border-y border-parchment/10 py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <h2 className="font-display text-3xl font-bold text-parchment text-center mb-12">
            Tips for choosing between two sizes
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {tips.map(({ title, description }) => (
              <div
                key={title}
                className="p-8 rounded-2xl border border-parchment/10 bg-charcoal hover:border-parchment/20 transition-colors"
              >
                <h3 className="font-display text-base font-semibold text-parchment mb-2 flex items-center gap-2">
                  <MessageCircleQuestion size={16} className="text-sage shrink-0" />
                  {title}
                </h3>
                <p className="text-sm text-parchment/50 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fit guarantee */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-24 text-center">
        <div className="w-12 h-12 rounded-xl bg-sage/10 border border-sage/20 flex items-center justify-center mx-auto mb-6">
          <Shield size={20} className="text-sage" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-parchment mb-4">
          Backed by our Fit Guarantee
        </h2>
        <p className="text-parchment/50 leading-relaxed">
          Sizing guides only get you so far — sometimes a piece just doesn&apos;t
          work on you. That&apos;s why every order includes our Fit Guarantee: if
          something doesn&apos;t fit, tell us within 2 hours of delivery and we&apos;ll
          send a free replacement or credit your account in full.
        </p>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24 text-center">
        <p className="font-display text-2xl font-semibold text-parchment mb-4">
          Not sure which size to pick?
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-rose text-charcoal font-semibold text-sm px-8 py-4 rounded-lg hover:bg-rose-dark transition-colors group"
        >
          Ask our styling team
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>
    </div>
  );
}
