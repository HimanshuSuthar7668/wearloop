"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThreeLoop from "@/components/ui/ThreeLoop";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP context for safe React cleaning
    const ctx = gsap.context(() => {
      // 1. Entrance timeline
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".hero-label", { opacity: 0, x: -30, duration: 1.0 })
        .from(".hero-title", { opacity: 0, y: 50, duration: 1.2 }, "-=0.8")
        .from(".hero-desc", { opacity: 0, y: 35, duration: 1.0 }, "-=0.9")
        .from(".hero-cta", { opacity: 0, y: 25, duration: 0.9 }, "-=0.8")
        .from(".hero-stat-item", { opacity: 0, y: 20, stagger: 0.15, duration: 0.8 }, "-=0.6")
        .from(".hero-3d-container", { opacity: 0, scale: 0.8, duration: 1.5, ease: "back.out(1.2)" }, "-=1.0");

      // 2. Parallax Scroll effect on text as page is scrolled
      gsap.to(".hero-text-content", {
        yPercent: -12,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden bg-charcoal">
      {/* Background ambient gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rose/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-sage/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-24 pb-16 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="flex flex-col gap-6 hero-text-content">
            <div className="flex items-center gap-3 hero-label">
              <div className="w-8 h-px bg-rose" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#c9a898] font-medium">
                Circular Fashion
              </span>
            </div>

            <h1 className="font-display hero-title text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-parchment text-balance">
              Your wardrobe,
              <br />
              <em className="text-[#c9a898]">infinitely</em>
              <br />
              renewed.
            </h1>

            <p className="text-parchment hero-desc text-base md:text-lg leading-relaxed max-w-sm">
              Wear designer pieces for any occasion. Return when done. Someone
              else&apos;s wardrobe becomes yours — and yours becomes theirs.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 hero-cta">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-rose text-charcoal font-semibold text-sm px-7 py-3.5 rounded hover:bg-rose-dark transition-colors group"
              >
                Browse the Edit
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 border border-parchment/20 text-parchment/70 hover:text-parchment hover:border-parchment/50 font-medium text-sm px-7 py-3.5 rounded transition-colors"
              >
                How it works
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4 border-t border-parchment/10">
              {[
                { value: "2,400+", label: "Pieces" },
                { value: "180+", label: "Brands" },
                { value: "Save 90%", label: "vs Retail" },
              ].map(({ value, label }) => (
                <div key={label} className="hero-stat-item">
                  <p className="font-display text-xl font-semibold text-parchment">
                    {value}
                  </p>
                  <p className="text-xs text-parchment/40 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Three.js Interactive Möbius Loop Canvas */}
          <div className="relative flex items-center justify-center hero-3d-container">
            <ThreeLoop />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-parchment/30">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-parchment/20 relative overflow-hidden">
          <div className="absolute top-0 w-full h-1/2 bg-parchment/60 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
