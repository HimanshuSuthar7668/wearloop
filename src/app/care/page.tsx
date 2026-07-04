import Link from "next/link";
import {
  Sparkles,
  Ban,
  AlertTriangle,
  PackageCheck,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Care Instructions — WearLoop",
  description:
    "How to care for your WearLoop rentals — what we handle, what to avoid, and how returns and damage reporting work.",
};

const handledByUs = [
  "Professional dry cleaning after every single rental",
  "A 12-point quality inspection before a piece ships again",
  "Minor repairs — loose buttons, small stitching fixes, steaming",
  "Odour and stain treatment using garment-safe processes",
  "Packaging in a reusable, breathable garment bag",
];

const avoidList = [
  {
    title: "Don't attempt to wash or dry clean it yourself",
    description:
      "Please don't machine wash, hand wash, or send items to your own dry cleaner. Our cleaning partners use processes calibrated for delicate fabrics and embellishments — home washing can shrink, discolour, or damage pieces in ways we can't repair.",
  },
  {
    title: "Avoid direct contact with perfume, makeup, and self-tanner",
    description:
      "Spray fragrance before dressing, not after, and let makeup and self-tanner fully set before putting an item on. These are the most common causes of staining we see.",
  },
  {
    title: "Skip the iron on embellished or delicate pieces",
    description:
      "If a piece needs touching up, use a low-heat steamer instead of an iron, especially on sequins, beading, lace, or pieces with printed detailing.",
  },
  {
    title: "Don't remove the WearLoop tag",
    description:
      "The small interior tag helps our fulfilment team track and inspect the item — please leave it attached throughout your rental.",
  },
];

const returnSteps = [
  {
    step: "01",
    title: "Fold, don't stuff",
    description:
      "Fold items along their natural seams the way they arrived, rather than balling them up, to avoid unnecessary creasing in transit.",
  },
  {
    step: "02",
    title: "Use the pre-paid return bag",
    description:
      "Every order arrives with a reusable return bag and a pre-printed label already attached — no need to print anything yourself.",
  },
  {
    step: "03",
    title: "Hand it off or drop it",
    description:
      "Give the sealed bag to your courier at pickup, or drop it at any partner collection point before your return deadline.",
  },
  {
    step: "04",
    title: "We take it from there",
    description:
      "Once we receive it, the item goes through inspection and cleaning before either returning to the collection or, if needed, being flagged for repair.",
  },
];

export default function CarePage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-[#c9a898] mb-4">
          Handle with care
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-parchment mb-5 text-balance">
          Wear it freely,
          <br />
          <em className="not-italic text-[#c9a898]">just a little kindly.</em>
        </h1>
        <p className="text-parchment/50 text-lg max-w-lg mx-auto">
          Every WearLoop piece is meant to be enjoyed, not preserved behind
          glass. A few simple habits keep each garment in great shape for the
          next person to love.
        </p>
      </section>

      {/* What we handle */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 pb-16">
        <div className="flex items-start gap-5 p-8 rounded-2xl border border-parchment/8 bg-charcoal-light">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-sage/10 border border-sage/20 flex items-center justify-center">
            <Sparkles size={20} className="text-sage" />
          </div>
          <div className="w-full">
            <h2 className="font-display text-lg font-semibold text-parchment mb-4">
              What WearLoop already takes care of
            </h2>
            <ul className="space-y-2.5">
              {handledByUs.map((item) => (
                <li
                  key={item}
                  className="text-sm text-parchment/50 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-sage shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* What to avoid */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24">
        <div className="flex items-center gap-2 justify-center mb-3 text-[#c9a898]">
          <Ban size={14} />
          <span className="text-xs uppercase tracking-widest">
            While you have it
          </span>
        </div>
        <h2 className="font-display text-3xl font-bold text-parchment text-center mb-12">
          A few things to avoid
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {avoidList.map(({ title, description }) => (
            <div
              key={title}
              className="p-8 rounded-2xl border border-parchment/8 hover:border-parchment/16 transition-colors bg-charcoal-light"
            >
              <h3 className="font-display text-base font-semibold text-parchment mb-2">
                {title}
              </h3>
              <p className="text-sm text-parchment/50 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Returns */}
      <section className="bg-charcoal-light border-y border-parchment/10 py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="flex items-center gap-2 justify-center mb-3 text-sage">
            <PackageCheck size={14} />
            <span className="text-xs uppercase tracking-widest">
              Returning your rental
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold text-parchment text-center mb-12">
            How returns work
          </h2>
          <div className="flex flex-col divide-y divide-parchment/10">
            {returnSteps.map(({ step, title, description }) => (
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

      {/* Damage reporting */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-24 text-center">
        <div className="w-12 h-12 rounded-xl bg-rose/10 border border-rose/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={20} className="text-[#c9a898]" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-parchment mb-4">
          Something happened to the item?
        </h2>
        <p className="text-parchment/50 leading-relaxed mb-2">
          Life happens — a spill at dinner, a snag on a doorframe. If an item
          gets damaged during your rental, tell us as soon as possible from
          your account or by contacting support, rather than trying to fix it
          yourself.
        </p>
        <p className="text-parchment/50 leading-relaxed">
          Normal wear is always covered at no cost. For more significant
          damage, a repair fee of 10–30% of the item&apos;s retail value may
          apply, unless you added Accidental Damage Protection at checkout,
          in which case it&apos;s waived entirely.
        </p>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24 text-center">
        <p className="font-display text-2xl font-semibold text-parchment mb-4">
          Have a care question we didn&apos;t cover?
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-rose text-charcoal font-semibold text-sm px-8 py-4 rounded-lg hover:bg-rose-dark transition-colors group"
        >
          Get in touch
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>
    </div>
  );
}
