import { Leaf, Recycle, Award } from "lucide-react";

const pillars = [
  {
    icon: Leaf,
    title: "Less waste, more style",
    description:
      "Each rental saves an average of 3.2 kg of textile waste from landfill. Looking good never felt this right.",
  },
  {
    icon: Recycle,
    title: "Circular by nature",
    description:
      "A single piece in our collection serves up to 40 different people per year. That's fashion doing more with less.",
  },
  {
    icon: Award,
    title: "Quality guaranteed",
    description:
      "Every item is professionally cleaned and inspected after each rental. If it doesn't meet our standard, it doesn't go out.",
  },
];

export default function SustainabilitySection() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6 md:px-10">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-sage mb-3">
            Why it matters
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-parchment mb-6 text-balance">
            Fashion that gives back
            <br />
            to the planet.
          </h2>
          <p className="text-parchment/50 leading-relaxed max-w-md">
            The fashion industry is responsible for 10% of global carbon
            emissions. Renting instead of buying is one of the most impactful
            choices you can make as a consumer.
          </p>

          {/* Big stat */}
          <div className="mt-10 p-6 border border-sage/20 rounded-2xl bg-sage/5 inline-block">
            <p className="font-display text-5xl font-bold text-sage">73%</p>
            <p className="text-sm text-parchment/50 mt-1 max-w-[200px]">
              of our members say they buy fewer new clothes since joining
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-5">
          {pillars.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex gap-5 p-5 rounded-xl border border-parchment/8 hover:border-parchment/16 transition-colors"
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-sage/10 border border-sage/20 flex items-center justify-center">
                <Icon size={18} className="text-sage" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-parchment mb-1">
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
  );
}
