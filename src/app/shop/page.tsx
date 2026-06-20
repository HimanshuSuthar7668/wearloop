"use client";

import { useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { categories, occasions } from "@/lib/mockData";
import { FilterState, Product } from "@/types";
import { SlidersHorizontal, X, Plus } from "lucide-react";
import { useAppStore } from "@/context/AppContext";
import { getAuthUser } from "@/lib/utils";
import Button from "@/components/ui/Button";

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
  const { products, addProduct } = useAppStore();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // New product form states
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState<Product["category"]>("dress");
  const [occasion, setOccasion] = useState<Product["occasion"]>("party");
  const [description, setDescription] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [retailPrice, setRetailPrice] = useState(0);
  const [price1Day, setPrice1Day] = useState(0);
  const [price3Day, setPrice3Day] = useState(0);
  const [price7Day, setPrice7Day] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    const user = getAuthUser();
    if (user?.role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  const filtered = useMemo<Product[]>(() => {
    let result = [...products];

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
  }, [products, filters]);

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => setFilters((prev) => ({ ...prev, [key]: value }));

  const toggleSize = (sizeVal: string) => {
    if (selectedSizes.includes(sizeVal)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== sizeVal));
    } else {
      setSelectedSizes([...selectedSizes, sizeVal]);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSizes.length === 0) {
      alert("Please select at least one size.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    addProduct({
      name,
      brand,
      category,
      occasion,
      description,
      images: [imagePath || "/images/placeholder.jpg"],
      rentalPrice: {
        perDay: Number(price1Day),
        per3Days: Number(price3Day),
        perWeek: Number(price7Day),
      },
      retailPrice: Number(retailPrice),
      sizes: selectedSizes,
      tags,
    });

    // Reset fields
    setName("");
    setBrand("");
    setCategory("dress");
    setOccasion("party");
    setDescription("");
    setImagePath("");
    setRetailPrice(0);
    setPrice1Day(0);
    setPrice3Day(0);
    setPrice7Day(0);
    setSelectedSizes([]);
    setTagsInput("");
    setIsAdding(false);
  };

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
            {isAdmin && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-1.5 bg-rose text-charcoal hover:bg-rose-dark font-bold text-xs"
              >
                <Plus size={14} />
                Add Piece
              </Button>
            )}

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
                  className="flex items-center gap-1 text-xs text-[#c9a898] hover:text-[#c9a898]-dark transition-colors self-end mb-1"
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
        <p className="text-xs text-parchment/40 mb-6 font-medium">
          {filtered.length} piece{filtered.length !== 1 ? "s" : ""} found
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-parchment/30 mb-3 font-semibold">
              Nothing here yet
            </p>
            <p className="text-sm text-parchment/20">
              Try adjusting your filters
            </p>
            <button
              onClick={() => setFilters(defaultFilters)}
              className="mt-4 text-xs text-[#c9a898] hover:underline font-semibold"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-md z-999 flex items-center justify-center p-6">
          <div className="bg-charcoal-light border border-parchment/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setIsAdding(false)}
              className="absolute top-4 right-4 text-parchment/40 hover:text-parchment"
            >
              <X size={20} />
            </button>
            <h2 className="font-display text-xl font-bold text-parchment mb-6">
              Add New Designer Piece
            </h2>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-parchment/50 block mb-1">Piece Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Classic Trench Coat"
                    className="w-full bg-charcoal border border-parchment/10 rounded-lg px-4 py-2.5 text-sm text-parchment focus:border-rose outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-parchment/50 block mb-1">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Burberry"
                    className="w-full bg-charcoal border border-parchment/10 rounded-lg px-4 py-2.5 text-sm text-parchment focus:border-rose outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-parchment/50 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Product["category"])}
                    className="w-full bg-charcoal border border-parchment/10 rounded-lg px-4 py-2.5 text-sm text-parchment focus:border-rose outline-none"
                  >
                    <option value="dress">Dresses</option>
                    <option value="outerwear">Outerwear</option>
                    <option value="suit">Suits</option>
                    <option value="bottom">Bottoms</option>
                    <option value="top">Tops</option>
                    <option value="accessory">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-parchment/50 block mb-1">Occasion</label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value as Product["occasion"])}
                    className="w-full bg-charcoal border border-parchment/10 rounded-lg px-4 py-2.5 text-sm text-parchment focus:border-rose outline-none"
                  >
                    <option value="casual">Casual</option>
                    <option value="work">Work</option>
                    <option value="party">Party</option>
                    <option value="formal">Formal</option>
                    <option value="wedding">Wedding</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-parchment/50 block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Describe the fabric, design details, fit..."
                  className="w-full bg-charcoal border border-parchment/10 rounded-lg px-4 py-2.5 text-sm text-parchment focus:border-rose outline-none resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-parchment/50 block mb-1">Image Path / URL</label>
                  <input
                    type="text"
                    value={imagePath}
                    onChange={(e) => setImagePath(e.target.value)}
                    placeholder="e.g. /images/men-coats/mc_1.jpg"
                    className="w-full bg-charcoal border border-parchment/10 rounded-lg px-4 py-2.5 text-sm text-parchment focus:border-rose outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-parchment/50 block mb-1">Retail Price (₹)</label>
                  <input
                    type="number"
                    value={retailPrice || ""}
                    onChange={(e) => setRetailPrice(Number(e.target.value))}
                    placeholder="45000"
                    className="w-full bg-charcoal border border-parchment/10 rounded-lg px-4 py-2.5 text-sm text-parchment focus:border-rose outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase text-parchment/50 block mb-1">1-Day Rental (₹)</label>
                  <input
                    type="number"
                    value={price1Day || ""}
                    onChange={(e) => setPrice1Day(Number(e.target.value))}
                    placeholder="699"
                    className="w-full bg-charcoal border border-parchment/10 rounded-lg px-3 py-2 text-sm text-parchment focus:border-rose outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-parchment/50 block mb-1">3-Day Rental (₹)</label>
                  <input
                    type="number"
                    value={price3Day || ""}
                    onChange={(e) => setPrice3Day(Number(e.target.value))}
                    placeholder="1699"
                    className="w-full bg-charcoal border border-parchment/10 rounded-lg px-3 py-2 text-sm text-parchment focus:border-rose outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-parchment/50 block mb-1">7-Day Rental (₹)</label>
                  <input
                    type="number"
                    value={price7Day || ""}
                    onChange={(e) => setPrice7Day(Number(e.target.value))}
                    placeholder="2999"
                    className="w-full bg-charcoal border border-parchment/10 rounded-lg px-3 py-2 text-sm text-parchment focus:border-rose outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-parchment/50 block mb-2 font-medium">Select Sizes</label>
                <div className="flex gap-2">
                  {["XS", "S", "M", "L", "XL"].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                        selectedSizes.includes(sz)
                          ? "border-parchment bg-parchment text-charcoal"
                          : "border-parchment/10 hover:border-parchment/30 text-parchment/60"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-parchment/50 block mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. wool, coat, formal, winter"
                  className="w-full bg-charcoal border border-parchment/10 rounded-lg px-4 py-2.5 text-sm text-parchment focus:border-rose outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-parchment/5">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 border-parchment/10 hover:bg-parchment/5"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="flex-1 bg-rose text-charcoal hover:bg-rose-dark font-bold"
                >
                  Create Piece
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
