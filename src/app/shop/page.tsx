"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { mockProducts, categories, occasions } from "@/lib/mockData";
import { FilterState, Product } from "@/types";
import { SlidersHorizontal, X } from "lucide-react";

const defaultFilters: FilterState = {
  category: "all",
  occasion: "all",
  size: "all",
  minPrice: 0,
  maxPrice: 2000,
  sort: "popular",
};

const sizes = ["all", "XS", "S", "M", "L", "XL"];

export default function ShopPage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo<Product[]>(() => {
    let result = [...mockProducts];

    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.occasion !== "all") {
      result = result.filter((p) => p.occasion === filters.occasion);
    }
    if (filters.size !== "all") {
      result = result.filter((p) => p.sizes.includes(filters.size));
    }
    result = result.filter(
      (p) =>
        p.rentalPrice.perDay >= filters.minPrice &&
        p.rentalPrice.perDay <= filters.maxPrice
    );

    switch (filters.sort) {
      case "price-asc":
        result.sort((a, b) => a.rentalPrice.perDay - b.rentalPrice.perDay);
        break;
      case "price-desc":
        result.sort((a, b) => b.rentalPrice.perDay - a.rentalPrice.perDay);
        break;
      case "newest":
        result.reverse();
        break;
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [filters]);

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen pt-16">
      {/* Header bar */}
      <div className="border-b border-parchment/10 bg-charcoal/80 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between gap-4">
          {/* Category tabs */}
          <div className="flex gap-1 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateFilter("category", cat.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                  filters.category === cat.id
                    ? "bg-rose text-charcoal"
                    : "text-parchment/60 hover:text-parchment hover:bg-parchment/5"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <select
              value={filters.sort}
              onChange={(e) =>
                updateFilter("sort", e.target.value as FilterState["sort"])
              }
              className="text-xs bg-parchment/5 border border-parchment/10 text-parchment/70 rounded px-3 py-2 focus:outline-none focus:border-rose/50"
            >
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 text-xs text-parchment/60 hover:text-parchment transition-colors border border-parchment/10 hover:border-parchment/30 rounded px-3 py-2"
            >
              <SlidersHorizontal size={12} />
              Filters
            </button>
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="border-t border-parchment/10 bg-charcoal-light px-6 md:px-10 py-5">
            <div className="max-w-7xl mx-auto flex flex-wrap gap-6">
              {/* Occasion */}
              <div>
                <p className="text-xs text-parchment/40 uppercase tracking-wider mb-2">
                  Occasion
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {occasions.map((occ) => (
                    <button
                      key={occ.id}
                      onClick={() => updateFilter("occasion", occ.id)}
                      className={`px-3 py-1.5 rounded text-xs transition-colors ${
                        filters.occasion === occ.id
                          ? "bg-sage/20 border border-sage/40 text-sage"
                          : "border border-parchment/10 text-parchment/50 hover:border-parchment/30"
                      }`}
                    >
                      {occ.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <p className="text-xs text-parchment/40 uppercase tracking-wider mb-2">
                  Size
                </p>
                <div className="flex gap-1.5">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => updateFilter("size", size)}
                      className={`w-10 h-8 rounded text-xs transition-colors ${
                        filters.size === size
                          ? "bg-parchment text-charcoal font-semibold"
                          : "border border-parchment/10 text-parchment/50 hover:border-parchment/30"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              {JSON.stringify(filters) !== JSON.stringify(defaultFilters) && (
                <button
                  onClick={() => setFilters(defaultFilters)}
                  className="flex items-center gap-1 text-xs text-rose hover:text-rose-dark transition-colors self-end mb-1"
                >
                  <X size={12} />
                  Clear all
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <p className="text-xs text-parchment/40 mb-6">
          {filtered.length} piece{filtered.length !== 1 ? "s" : ""}
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-parchment/30 mb-3">
              Nothing here yet
            </p>
            <p className="text-sm text-parchment/20">
              Try adjusting your filters
            </p>
            <button
              onClick={() => setFilters(defaultFilters)}
              className="mt-4 text-xs text-rose hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
