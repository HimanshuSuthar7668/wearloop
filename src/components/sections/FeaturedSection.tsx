"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { featuredProducts } from "@/lib/mockData";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FeaturedSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header elements
      gsap.from(".featured-header-text > *", {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".featured-header",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".featured-header-link", {
        opacity: 0,
        x: 20,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".featured-header",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Stagger product cards
      gsap.from(".featured-card", {
        opacity: 0,
        y: 50,
        stagger: 0.15,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".featured-grid",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 max-w-7xl mx-auto px-6 md:px-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 featured-header">
        <div className="featured-header-text">
          <p className="text-xs uppercase tracking-[0.25em] text-[#c9a898] mb-3">
            Curated for you
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-parchment">
            Right now in the loop
          </h2>
        </div>
        <Link
          href="/shop"
          className="flex items-center gap-2 text-sm text-parchment/60 hover:text-parchment transition-colors group featured-header-link"
        >
          View full collection
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 featured-grid">
        {featuredProducts.map((product) => (
          <div key={product.id} className="featured-card">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
