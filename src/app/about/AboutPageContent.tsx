"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Leaf, Users, Repeat } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const values = [
  {
    icon: Repeat,
    title: "Circular by design",
    description:
      "Every piece in our collection is chosen for its durability and timelessness. We design our entire service around maximising the life and love a garment receives.",
  },
  {
    icon: Leaf,
    title: "Sustainability, not greenwashing",
    description:
      "We track the environmental impact of every rental. Our packaging is 100% reusable, our cleaning uses waterless processes, and our fleet runs on electric vehicles.",
  },
  {
    icon: Users,
    title: "Community, not consumption",
    description:
      "WearLoop is built on the idea that fashion is more joyful when shared. Our members aren't customers — they're co-owners of a shared wardrobe.",
  },
];

const impactStats = [
  { value: "48,000+", label: "Rentals completed" },
  { value: "156 tonnes", label: "Textile waste prevented" },
  { value: "12,000+", label: "Members" },
  { value: "4.8/5", label: "Average rating" },
];

export default function AboutPageContent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.from(".about-hero > *", {
        opacity: 0,
        y: 30,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
      });

      // Story text reveal on scroll
      gsap.from(".about-story > *", {
        opacity: 0,
        y: 25,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-story",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Value cards stagger
      gsap.from(".about-value-card", {
        opacity: 0,
        y: 40,
        scale: 0.97,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-values-grid",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Impact counters — count up on scroll into view
      gsap.utils.toArray<HTMLElement>(".about-stat-value").forEach((el) => {
        const raw = el.dataset.value || "0";
        const numericMatch = raw.match(/[\d,]+(\.\d+)?/);
        if (!numericMatch) return;

        const numeric = parseFloat(numericMatch[0].replace(/,/g, ""));
        const prefix = raw.slice(0, numericMatch.index);
        const suffix = raw.slice((numericMatch.index || 0) + numericMatch[0].length);
        const hasComma = numericMatch[0].includes(",");
        const counter = { value: 0 };

        gsap.to(counter, {
          value: numeric,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            const rounded =
              numeric % 1 !== 0 ? counter.value.toFixed(1) : Math.round(counter.value).toString();
            const formatted = hasComma
              ? Number(rounded).toLocaleString("en-IN")
              : rounded;
            el.innerText = `${prefix}${formatted}${suffix}`;
          },
        });
      });

      // CTA reveal
      gsap.from(".about-cta", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-cta",
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen pt-20">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 md:px-10 pt-16 pb-12 text-center about-hero">
        <p className="text-xs uppercase tracking-[0.25em] text-[#c9a898] mb-4">
          Our story
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-parchment mb-6 text-balance">
          We built the wardrobe
          <br />
          <em className="not-italic text-[#c9a898]">the planet needed.</em>
        </h1>
        <p className="text-parchment/50 text-lg leading-relaxed max-w-xl mx-auto">
          WearLoop started with a simple observation: the average piece of
          clothing is worn just 7 times before being discarded. We thought we
          could do better.
        </p>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-12">
        <div className="prose prose-invert max-w-none about-story">
          <p className="text-parchment/60 leading-loose text-base border-l-2 border-rose/30 pl-6">
            Founded in 2023, WearLoop began as a small shared wardrobe between
            three friends who were tired of buying new outfits for every event.
            What started as a group chat became a platform, and today we serve
            thousands of members across India.
          </p>
          <p className="text-parchment/60 leading-loose text-base mt-6">
            We partner directly with premium brands and independent designers to
            build a collection that&apos;s worth wearing — and worth sharing. Every
            piece is selected not just for style, but for how long it will last in
            the loop.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-charcoal-light border-y border-parchment/10 py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <h2 className="font-display text-3xl font-bold text-parchment text-center mb-12">
            What we stand for
          </h2>
          <div className="grid md:grid-cols-3 gap-6 about-values-grid">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="about-value-card p-8 rounded-2xl border border-parchment/8 hover:border-parchment/20 transition-colors"
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
        </div>
      </section>

      {/* Impact numbers */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 text-center">
        <h2 className="font-display text-3xl font-bold text-parchment mb-14">
          Our impact so far
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {impactStats.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <p
                className="about-stat-value font-display text-4xl font-bold text-parchment"
                data-value={value}
              >
                0
              </p>
              <p className="text-sm text-parchment/40">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 text-center px-6 about-cta">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-rose text-charcoal font-semibold text-sm px-8 py-4 rounded-lg hover:bg-rose-dark transition-colors group"
        >
          Join the loop
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>
    </div>
  );
}
