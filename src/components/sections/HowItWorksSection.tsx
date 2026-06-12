import { Search, Package, RotateCcw } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Pick your pieces",
    description:
      "Browse 2,400+ items from 180+ premium brands. Filter by occasion, size, and duration. Add your favourites to the loop.",
  },
  {
    icon: Package,
    number: "02",
    title: "Delivered to your door",
    description:
      "We dry-clean and deliver each piece in a reusable garment bag within 24 hours of your rental start date.",
  },
  {
    icon: RotateCcw,
    number: "03",
    title: "Return & repeat",
    description:
      "Done wearing it? Drop it back in the pre-paid return bag. No cleaning needed — we handle everything.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-charcoal-light">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-rose mb-3">
            Simple by design
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-parchment">
            Fashion in three steps
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-8 left-[calc(16.67%)] right-[calc(16.67%)] h-px bg-gradient-to-r from-rose/20 via-rose/40 to-rose/20" />

          {steps.map(({ icon: Icon, number, title, description }) => (
            <div
              key={number}
              className="relative flex flex-col items-start gap-5 p-8 rounded-2xl border border-parchment/8 hover:border-parchment/16 transition-colors bg-charcoal/40"
            >
              {/* Step number */}
              <span className="absolute top-6 right-6 font-display text-5xl font-bold text-parchment/[0.04]">
                {number}
              </span>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-rose/10 border border-rose/20 flex items-center justify-center">
                <Icon size={20} className="text-rose" />
              </div>

              <div>
                <h3 className="font-display text-xl font-semibold text-parchment mb-2">
                  {title}
                </h3>
                <p className="text-sm text-parchment/50 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
