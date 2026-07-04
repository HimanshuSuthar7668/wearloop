"use client";

import { useEffect, useRef } from "react";
import { Search, Package, RotateCcw } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header fade-in
      gsap.from(".how-it-works-header > *", {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".how-it-works-header",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // 2. Connector line drawing
      gsap.to(".step-connector-progress", {
        scaleX: 1,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".steps-container",
          start: "top 75%",
          end: "bottom 65%",
          scrub: 1.2,
        },
      });

      // 3. Step cards stagger reveal
      gsap.from(".step-card", {
        opacity: 0,
        y: 45,
        scale: 0.96,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".steps-container",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 bg-charcoal-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-16 how-it-works-header">
          <p className="text-xs uppercase tracking-[0.25em] text-[#c9a898] mb-3">
            Simple by design
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-parchment">
            Fashion in three steps
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative steps-container">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-8 left-[calc(16.67%)] right-[calc(16.67%)] h-[2px] bg-parchment/10 overflow-hidden rounded-full">
            <div className="step-connector-progress w-full h-full bg-gradient-to-r from-rose via-[#c9a898] to-sage origin-left scale-x-0" />
          </div>

          {steps.map(({ icon: Icon, number, title, description }) => (
            <div
              key={number}
              className="relative flex flex-col items-start gap-5 p-8 rounded-2xl border border-parchment/8 hover:border-[#c9a898]/40 transition-all duration-300 bg-charcoal/40 step-card group"
            >
              {/* Step number */}
              <span className="absolute top-6 right-6 font-display text-5xl font-bold text-parchment/[0.04] group-hover:text-[#c9a898]/10 group-hover:scale-105 transition-all duration-300 select-none">
                {number}
              </span>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-rose/10 border border-rose/20 flex items-center justify-center group-hover:bg-rose/20 group-hover:border-rose/40 transition-colors duration-300">
                <Icon size={20} className="text-[#c9a898]" />
              </div>

              <div>
                <h3 className="font-display text-xl font-semibold text-parchment mb-2 group-hover:text-parchment transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-sm text-parchment/50 leading-relaxed group-hover:text-parchment/70 transition-colors duration-300">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
