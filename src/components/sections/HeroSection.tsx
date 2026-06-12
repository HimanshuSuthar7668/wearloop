"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

export default function HeroSection() {
  const circleText = "RENT · WEAR · RETURN · REPEAT · ";

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/products");
        console.log(res,"------");
      } catch (err) {
        console.log(err);
      }
    };
    fetchTest();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-charcoal">
      {/* Background ambient gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rose/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-sage/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-24 pb-16 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="flex flex-col gap-6 animate-fade-up">
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-rose" />
              <span className="text-xs uppercase tracking-[0.25em] text-rose font-medium">
                Circular Fashion
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-parchment text-balance">
              Your wardrobe,
              <br />
              <em className="text-rose not-italic">infinitely</em>
              <br />
              renewed.
            </h1>

            <p className="text-parchment/55 text-base md:text-lg leading-relaxed max-w-sm">
              Wear designer pieces for any occasion. Return when done. Someone
              else&apos;s wardrobe becomes yours — and yours becomes theirs.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
                <div key={label}>
                  <p className="font-display text-xl font-semibold text-parchment">
                    {value}
                  </p>
                  <p className="text-xs text-parchment/40 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Circular rotating badge + image */}
          <div className="relative flex items-center justify-center animate-fade-in animate-delay-200">
            {/* Central image frame */}
            <div className="relative w-72 h-96 md:w-80 md:h-[440px] rounded-2xl overflow-hidden">
              {/* Using CSS gradient as image placeholder — replace with real image */}
              <div className="absolute inset-0 bg-gradient-to-br from-charcoal-light via-[#2a1f2e] to-charcoal" />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              {/* Subtle vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />

              {/* Price tag */}
              <div className="absolute bottom-5 left-5 glass rounded-lg px-4 py-3">
                <p className="text-xs text-parchment/50 mb-0.5">Rent from</p>
                <p className="font-display text-xl font-semibold text-parchment">
                  ₹499
                  <span className="text-xs text-parchment/50 font-normal">/day</span>
                </p>
              </div>
            </div>

            {/* Circular rotating text */}
            <div className="absolute -right-6 -top-6 w-32 h-32 md:w-40 md:h-40">
              <svg
                viewBox="0 0 160 160"
                className="w-full h-full rotate-text"
                style={{ animation: "spin 18s linear infinite" }}
              >
                <defs>
                  <path
                    id="circle-path"
                    d="M 80 80 m -60 0 a 60 60 0 1 1 120 0 a 60 60 0 1 1 -120 0"
                  />
                </defs>
                <text
                  fill="none"
                  className="text-rose"
                  style={{ fill: "#C9A898", fontSize: "11px", letterSpacing: "3px" }}
                >
                  <textPath href="#circle-path">{circleText}</textPath>
                </text>
                {/* Center dot */}
                <circle cx="80" cy="80" r="4" fill="#C9A898" />
              </svg>
            </div>

            {/* Floating tag */}
            <div className="absolute -left-4 top-12 glass rounded-xl px-4 py-3 max-w-[140px]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
                <span className="text-xs text-sage font-medium">Available Now</span>
              </div>
              <p className="text-xs text-parchment/60 leading-relaxed">
                Silk Slip Dress · Size S–L
              </p>
            </div>
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
