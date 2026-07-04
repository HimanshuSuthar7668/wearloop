import Link from "next/link";
import {
  Heart,
  Users,
  TrendingUp,
  Sparkles,
  Code2,
  PackageSearch,
  Handshake,
  Headphones,
  ArrowRight,
  Mail,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers — WearLoop",
  description:
    "Join the team building India's premium clothing rental platform. See open roles at WearLoop.",
};

const values = [
  {
    icon: Heart,
    title: "Care like it's your own closet",
    description:
      "We treat every garment, every order, and every member interaction the way we'd want to be treated — with attention, not just efficiency.",
  },
  {
    icon: Users,
    title: "Small team, real ownership",
    description:
      "We're a lean team where everyone ships things members actually use. No layers of approval between an idea and a member seeing it.",
  },
  {
    icon: TrendingUp,
    title: "Built for the long run",
    description:
      "We're building a category in India, not chasing a quarter. That means we optimise for durable decisions over quick wins.",
  },
];

const roles = [
  {
    icon: Code2,
    title: "Software Engineer",
    department: "Engineering",
    location: "Bengaluru / Remote",
    type: "Full-time",
    description:
      "Help build the product members and our fulfilment team use every day — from the shopping experience to the internal tools that keep inventory moving.",
  },
  {
    icon: PackageSearch,
    title: "Fulfilment Ops Associate",
    department: "Operations",
    location: "Bengaluru",
    type: "Full-time",
    description:
      "Own quality inspection, cleaning coordination, and packing at our fulfilment hub, making sure every piece leaves in pristine condition and on time.",
  },
  {
    icon: Handshake,
    title: "Brand Partnerships Lead",
    department: "Merchandising",
    location: "Mumbai / Remote",
    type: "Full-time",
    description:
      "Grow our catalogue by signing new brand and designer partners, and manage the relationships that keep our collection fresh every week.",
  },
  {
    icon: Headphones,
    title: "Customer Experience Associate",
    department: "Support",
    location: "Remote",
    type: "Full-time",
    description:
      "Be the voice of WearLoop for members — resolving sizing questions, delivery issues, and everything in between with warmth and speed.",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-[#c9a898] mb-4">
          Join the team
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-parchment mb-5 text-balance">
          Help us build the
          <br />
          <em className="not-italic text-[#c9a898]">wardrobe of the future.</em>
        </h1>
        <p className="text-parchment/50 text-lg max-w-lg mx-auto">
          We&apos;re a small team solving a big problem — how India gets dressed
          without the waste. If that sounds like your kind of problem, we&apos;d
          love to talk.
        </p>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {values.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="p-8 rounded-2xl border border-parchment/8 hover:border-parchment/16 transition-colors bg-charcoal-light"
            >
              <div className="w-12 h-12 rounded-xl bg-rose/10 border border-rose/20 flex items-center justify-center mb-5">
                <Icon size={20} className="text-[#c9a898]" />
              </div>
              <h3 className="font-display text-lg font-semibold text-parchment mb-3">
                {title}
              </h3>
              <p className="text-sm text-parchment/50 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Open roles */}
      <section className="bg-charcoal-light border-y border-parchment/10 py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="flex items-center gap-2 justify-center mb-3 text-sage">
            <Sparkles size={14} />
            <span className="text-xs uppercase tracking-widest">
              Open roles
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold text-parchment text-center mb-12">
            Where we&apos;re hiring right now
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {roles.map(({ icon: Icon, title, department, location, type, description }) => (
              <div
                key={title}
                className="p-8 rounded-2xl border border-parchment/10 bg-charcoal hover:border-parchment/20 transition-colors flex flex-col"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-sage/10 border border-sage/20 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-sage" />
                  </div>
                  <span className="text-xs text-parchment/40 border border-parchment/10 rounded-full px-3 py-1 whitespace-nowrap">
                    {type}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-parchment mb-1">
                  {title}
                </h3>
                <p className="text-xs uppercase tracking-widest text-[#c9a898] mb-3">
                  {department} &middot; {location}
                </p>
                <p className="text-sm text-parchment/50 leading-relaxed mb-6 flex-1">
                  {description}
                </p>
                <a
                  href={`mailto:careers@wearloop.in?subject=Application: ${title}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-parchment hover:text-[#c9a898] transition-colors"
                >
                  <Mail size={14} />
                  Apply for this role
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Don't see a fit */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-24 text-center">
        <h2 className="font-display text-2xl font-semibold text-parchment mb-4">
          Don&apos;t see the right role?
        </h2>
        <p className="text-parchment/50 leading-relaxed mb-6">
          We&apos;re growing quickly and always open to meeting people who care
          about circular fashion. Send us your resume and a note about what
          you&apos;d want to work on — we read every message.
        </p>
        <a
          href="mailto:careers@wearloop.in?subject=General Application"
          className="inline-flex items-center gap-2 bg-rose text-charcoal font-semibold text-sm px-8 py-4 rounded-lg hover:bg-rose-dark transition-colors group"
        >
          <Mail size={16} />
          careers@wearloop.in
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </section>
    </div>
  );
}
