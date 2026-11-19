"use client";

import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";
import { useAppStore } from "@/context/AppContext";

export default function FavouritesPageContent() {
  const { favourites, products } = useAppStore();

  const saved = favourites
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-display text-3xl md:text-4xl text-ink">Saved pieces</h1>
          {saved.length > 0 && (
            <p className="text-sm text-ink/60">
              {saved.length} {saved.length === 1 ? "piece" : "pieces"}
            </p>
          )}
        </div>

        {saved.length === 0 ? (
          <div className="mt-10 border-t border-ink/15 pt-10 pb-16">
            <p className="font-display text-2xl text-ink mb-2">Nothing saved yet</p>
            <p className="text-ink/70 mb-8 max-w-sm leading-relaxed">
              Tap the heart on any piece and it will wait for you here.
            </p>
            <Link href="/shop" className={buttonClass()}>
              Browse the collection
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm text-ink/70">Open a piece to pick your size and dates.</p>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
              {saved.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
