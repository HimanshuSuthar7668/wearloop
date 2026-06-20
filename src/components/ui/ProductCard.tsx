"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [wished, setWished] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-charcoal-light mb-3">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-700 ${
            hovered ? "scale-105" : "scale-100"
          }`}
          sizes="(max-width: 768px) 50vw, 25vw"
        />

        {/* Overlay on hover */}
        <div
          className={`absolute inset-0 bg-charcoal/40 transition-opacity duration-300 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Quick rent button */}
        <div
          className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <Link
            href={`/shop/${product.id}`}
            className="block w-full text-center py-2.5 bg-parchment text-charcoal text-sm font-semibold rounded hover:bg-parchment-dark transition-colors"
          >
            Rent Now
          </Link>
        </div>

        {/* Availability badge */}
        {!product.available && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-charcoal/80 text-parchment/60 text-xs rounded backdrop-blur-sm">
            Unavailable
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={() => setWished(!wished)}
          className="absolute top-3 right-3 p-1.5 bg-charcoal/60 backdrop-blur-sm rounded-full hover:bg-charcoal/80 transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart
            size={14}
            className={wished ? "fill-rose text-[#c9a898]" : "text-parchment/70"}
          />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-parchment/40 uppercase tracking-wider">
            {product.brand}
          </span>
          <div className="flex items-center gap-1 text-xs text-parchment/40">
            <Star size={10} className="fill-rose text-[#c9a898]" />
            <span>{product.rating}</span>
          </div>
        </div>

        <Link
          href={`/shop/${product.id}`}
          className="font-display text-sm text-parchment hover:text-[#c9a898] transition-colors line-clamp-1"
        >
          {product.name}
        </Link>

        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-sm font-semibold text-parchment">
            {formatPrice(product.rentalPrice.perDay)}
            <span className="text-xs font-normal text-parchment/40">/day</span>
          </span>
          <span className="text-xs text-parchment/30 line-through">
            {formatPrice(product.retailPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
