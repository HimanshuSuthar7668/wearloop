"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Heart, Calendar, Package, Shield } from "lucide-react";
import { mockProducts } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface PageProps {
  params: { id: string };
}

export default function ProductDetailPage({ params }: PageProps) {
  const product = mockProducts.find((p) => p.id === params.id);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedDuration, setSelectedDuration] = useState<"perDay" | "per3Days" | "perWeek">("per3Days");
  const [wished, setWished] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl text-parchment/40 mb-3">
            Piece not found
          </p>
          <Link href="/shop" className="text-sm text-[#c9a898] hover:underline">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const durationOptions = [
    { key: "perDay" as const, label: "1 day", price: product.rentalPrice.perDay },
    { key: "per3Days" as const, label: "3 days", price: product.rentalPrice.per3Days },
    { key: "perWeek" as const, label: "7 days", price: product.rentalPrice.perWeek },
  ];

  const savings = Math.round(
    ((product.retailPrice - product.rentalPrice.per3Days) / product.retailPrice) * 100
  );

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        {/* Breadcrumb */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-parchment/50 hover:text-parchment transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to shop
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-charcoal-light">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <button
              onClick={() => setWished(!wished)}
              className="absolute top-5 right-5 p-3 bg-charcoal/60 backdrop-blur-sm rounded-full hover:bg-charcoal/80 transition-colors"
            >
              <Heart
                size={18}
                className={wished ? "fill-rose text-[#c9a898]" : "text-parchment/60"}
              />
            </button>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs uppercase tracking-widest text-[#c9a898]">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1.5 text-sm text-parchment/50">
                  <Star size={12} className="fill-rose text-[#c9a898]" />
                  <span>{product.rating}</span>
                  <span className="text-parchment/30">({product.reviewCount})</span>
                </div>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-parchment">
                {product.name}
              </h1>
            </div>

            <p className="text-parchment/55 leading-relaxed">{product.description}</p>

            {/* Savings badge */}
            <div className="inline-flex items-center gap-2 bg-sage/10 border border-sage/20 rounded-lg px-4 py-2 text-sm text-sage w-fit">
              <Shield size={14} />
              Save {savings}% vs buying retail ({formatPrice(product.retailPrice)})
            </div>

            {/* Rental duration */}
            <div>
              <p className="text-xs uppercase tracking-wider text-parchment/40 mb-3">
                Rental Duration
              </p>
              <div className="grid grid-cols-3 gap-2">
                {durationOptions.map(({ key, label, price }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedDuration(key)}
                    className={`p-3 rounded-xl border text-center transition-colors ${
                      selectedDuration === key
                        ? "border-rose bg-rose/10"
                        : "border-parchment/10 hover:border-parchment/30"
                    }`}
                  >
                    <p className="text-sm font-semibold text-parchment">
                      {formatPrice(price)}
                    </p>
                    <p className="text-xs text-parchment/40 mt-0.5">{label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div>
              <p className="text-xs uppercase tracking-wider text-parchment/40 mb-3">
                Select Size
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "border-parchment bg-parchment text-charcoal"
                        : "border-parchment/20 text-parchment/60 hover:border-parchment/50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={!product.available || !selectedSize}
              >
                {!product.available
                  ? "Currently Unavailable"
                  : !selectedSize
                  ? "Select a Size"
                  : "Add to Bag"}
              </Button>
            </div>

            {/* Trust signals */}
            <div className="pt-4 border-t border-parchment/10 grid grid-cols-3 gap-4 text-center">
              {[
                { icon: Package, text: "Free delivery & return" },
                { icon: Shield, text: "Dry-cleaned before dispatch" },
                { icon: Calendar, text: "Flexible rental dates" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-2">
                  <Icon size={16} className="text-parchment/30" />
                  <p className="text-xs text-parchment/40 leading-tight">{text}</p>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 bg-parchment/5 border border-parchment/10 rounded-full text-parchment/40 capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
