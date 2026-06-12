"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  // Cart state would be managed via context/zustand in a full implementation
  const items: unknown[] = [];

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-16">
        <h1 className="font-display text-4xl font-bold text-parchment mb-10">
          Your Bag
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-24 border border-parchment/10 rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-parchment/5 border border-parchment/10 flex items-center justify-center mx-auto mb-5">
              <ShoppingBag size={24} className="text-parchment/30" />
            </div>
            <p className="font-display text-xl text-parchment/40 mb-2">
              Your bag is empty
            </p>
            <p className="text-sm text-parchment/30 mb-8">
              Time to find something beautiful to wear.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-rose text-charcoal font-semibold text-sm px-6 py-3 rounded-lg hover:bg-rose-dark transition-colors group"
            >
              Browse the edit
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {/* Cart items would render here */}
            </div>
            <div className="bg-charcoal-light rounded-2xl p-6 border border-parchment/10 h-fit">
              <h2 className="font-display text-lg font-semibold text-parchment mb-4">
                Order Summary
              </h2>
              <button className="w-full bg-rose text-charcoal font-semibold py-3.5 rounded-lg hover:bg-rose-dark transition-colors text-sm mt-4">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
