"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight, Trash2, ShoppingCart } from "lucide-react";
import { useAppStore } from "@/context/AppContext";
import { formatPrice } from "@/lib/utils";

export default function FavouritesPageContent() {
  const { favourites, products, removeFromFavourites, cart, addToCart } = useAppStore();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Map favourited product IDs to full product data
  const favouriteProducts = favourites
    .map((productId) => products.find((p) => p.id === productId))
    .filter(Boolean) as typeof products;

  const handleAddToCart = async (productId: string, sizes: string[]) => {
    setAddingToCart(productId);
    const defaultSize = sizes && sizes.length > 0 ? sizes[0] : "M";
    await addToCart(productId, defaultSize, 3);
    setTimeout(() => setAddingToCart(null), 800);
  };

  return (
    <div className="min-h-screen bg-charcoal pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-parchment">
              Your Favourites
            </h1>
            {favouriteProducts.length > 0 && (
              <p className="text-sm text-parchment/40 mt-1">
                {favouriteProducts.length} {favouriteProducts.length === 1 ? "piece" : "pieces"} saved
              </p>
            )}
          </div>
          {favouriteProducts.length > 0 && (
            <Link
              href="/shop"
              className="hidden md:flex items-center gap-2 text-sm text-parchment/60 hover:text-parchment transition-colors group"
            >
              Browse more
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Empty State */}
        {favouriteProducts.length === 0 ? (
          <div className="text-center py-20 border border-parchment/10 rounded-2xl bg-charcoal-light/30">
            <div className="w-16 h-16 rounded-full bg-rose/10 border border-rose/20 flex items-center justify-center mx-auto mb-5">
              <Heart size={24} className="text-rose" />
            </div>
            <p className="font-display text-xl text-parchment/70 mb-2">
              Nothing saved yet
            </p>
            <p className="text-sm text-parchment/40 mb-8 max-w-sm mx-auto leading-relaxed">
              Tap the heart on any piece to save it here for later.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-rose text-charcoal font-semibold text-sm px-6 py-3 rounded-lg hover:bg-rose-dark transition-all duration-200"
            >
              Browse Shop
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {favouriteProducts.map((product) => {
              const inCart = cart.some((item) => item.productId === product.id);
              const isAdding = addingToCart === product.id;

              return (
                <div
                  key={product.id}
                  className="bg-charcoal-light border border-parchment/10 rounded-2xl overflow-hidden hover:border-parchment/20 transition-all duration-200 group"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={product.images[0] || "/images/placeholder.jpg"}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Remove button */}
                    <button
                      onClick={() => removeFromFavourites(product.id)}
                      className="absolute top-3 right-3 p-2 bg-charcoal/60 backdrop-blur-sm rounded-full text-rose hover:bg-charcoal/80 transition-colors"
                      aria-label="Remove from favourites"
                    >
                      <Heart size={14} className="fill-rose text-rose" />
                    </button>
                    {!product.available && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-charcoal/80 text-parchment/60 text-xs rounded backdrop-blur-sm">
                        Unavailable
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <span className="text-[10px] uppercase tracking-wider text-rose font-bold">
                      {product.brand}
                    </span>
                    <Link
                      href={`/shop/${product.id}`}
                      className="block font-display text-sm font-bold text-parchment hover:text-rose transition-colors line-clamp-1 mt-0.5 mb-3"
                    >
                      {product.name}
                    </Link>

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="text-sm font-semibold text-parchment">
                          {formatPrice(product.rentalPrice.perDay)}
                          <span className="text-xs font-normal text-parchment/40">/day</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Remove */}
                        <button
                          onClick={() => removeFromFavourites(product.id)}
                          className="p-2 text-parchment/40 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-colors"
                          aria-label="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                        {/* Add to Cart */}
                        <button
                          disabled={inCart || !product.available}
                          onClick={() => handleAddToCart(product.id, product.sizes || [])}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                            inCart
                              ? "bg-sage/20 text-sage border border-sage/30 cursor-default"
                              : isAdding
                              ? "bg-rose/80 text-charcoal scale-95"
                              : "bg-rose text-charcoal hover:bg-rose-dark"
                          }`}
                        >
                          <ShoppingCart size={12} />
                          {inCart ? "In Bag" : isAdding ? "Adding…" : "Add to Bag"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
