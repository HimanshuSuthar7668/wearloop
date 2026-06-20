import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { featuredProducts } from "@/lib/mockData";
import { ArrowRight } from "lucide-react";

export default function FeaturedSection() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6 md:px-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#c9a898] mb-3">
            Curated for you
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-parchment">
            Right now in the loop
          </h2>
        </div>
        <Link
          href="/shop"
          className="flex items-center gap-2 text-sm text-parchment/60 hover:text-parchment transition-colors group"
        >
          View full collection
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
