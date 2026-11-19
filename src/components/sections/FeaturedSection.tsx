"use client";

import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { featuredProducts } from "@/lib/mockData";
import { useReveal } from "@/hooks/useReveal";

export default function FeaturedSection() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="py-20 md:py-24 max-w-7xl mx-auto px-6 md:px-10 border-t border-ink/10">
      <div className="flex items-baseline justify-between gap-6 mb-10" data-reveal>
        <h2 className="font-display text-3xl md:text-4xl font-normal tracking-[-0.01em] text-ink">
          Booked most this month
        </h2>
        <Link
          href="/shop"
          className="shrink-0 text-sm text-ink underline underline-offset-[6px] decoration-ink/30 hover:decoration-ink transition-colors"
        >
          All pieces
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
        {featuredProducts.map((product) => (
          <div key={product.id} data-reveal>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
