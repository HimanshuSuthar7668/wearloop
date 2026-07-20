"use client";

import { useEffect, useRef } from "react";
import { Leaf, Recycle, Award } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      // 1. Animate left section content
      gsap.fromTo(".sustainability-left > *", 
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".sustainability-left",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // 2. Count up 73% stat
      const statVal = { value: 0 };
      gsap.to(statVal, {
        value: 73,
        duration: 2.0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".stat-box",
          start: "top 85%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.innerText = Math.round(statVal.value) + "%";
          }
        },
      });

      // 3. Animate right section pillars
      gsap.fromTo(".pillar-card",
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.18,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".pillars-container",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, containerRef);

    // Refresh ScrollTrigger to calculate correct positions after mounting
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      ctx.revert();
      clearTimeout(refreshTimer);
    };
  }, []);

  return (
    <section ref={containerRef} className="py-24 max-w-7xl mx-auto px-6 md:px-10 overflow-hidden">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div className="sustainability-left">
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
          <div className="mt-10 p-6 border border-sage/20 rounded-2xl bg-sage/5 inline-block stat-box">
            <p ref={counterRef} className="font-display text-5xl font-bold text-sage">
              0%
            </p>
            <p className="text-sm text-parchment/50 mt-1 max-w-[200px]">
              of our members say they buy fewer new clothes since joining
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-5 pillars-container">
          {pillars.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex gap-5 p-5 rounded-xl border border-parchment/8 hover:border-sage/40 hover:bg-sage/[0.02] transition-all duration-300 pillar-card group"
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-sage/10 border border-sage/20 flex items-center justify-center group-hover:bg-sage/20 group-hover:border-sage/40 transition-colors duration-300">
                <Icon size={18} className="text-sage" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-parchment mb-1 group-hover:text-sage transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-sm text-parchment/50 leading-relaxed group-hover:text-parchment/70 transition-colors duration-300">
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
