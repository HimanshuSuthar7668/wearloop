"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { Product } from "@/types";
import { formatPrice, getAuthUser } from "@/lib/utils";
import { useAppStore } from "@/context/AppContext";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [wished, setWished] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { cart, addToCart, removeFromCart, favourites, addToFavourites, removeFromFavourites } = useAppStore();

  const router = useRouter();

  useEffect(() => {
    const user = getAuthUser();
    setIsLoggedIn(!!user);
  }, []);

  const inCart = cart.some((item) => item.productId === product.id);
  const isFavourited = favourites.includes(product.id);

  const handleToggleCart = async (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      router.push("/auth");
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    if (inCart) {
      await removeFromCart(product.id);
    } else {
      const defaultSize =
        product.sizes && product.sizes.length > 0 ? product.sizes[0] : "M";
      await addToCart(product.id, defaultSize, 3);
    }
  };

  const handleToggleFavourite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push("/auth?redirect=/favourites");
      return;
    }
    if (isFavourited) {
      await removeFromFavourites(product.id);
    } else {
      await addToFavourites(product.id);
    }
  };

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

        {/* Top Right Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {/* Favourite */}
          <button
            onClick={handleToggleFavourite}
            className="p-1.5 bg-charcoal/60 backdrop-blur-sm rounded-full hover:bg-charcoal/80 transition-colors"
            aria-label={isFavourited ? "Remove from favourites" : "Add to favourites"}
          >
            <Heart
              size={14}
              className={isFavourited ? "fill-rose text-rose" : "text-parchment/70"}
            />
          </button>
          {/* Add to Cart */}
          <button
            onClick={handleToggleCart}
            className="p-1.5 bg-charcoal/60 backdrop-blur-sm rounded-full hover:bg-charcoal/80 transition-colors"
            aria-label={inCart ? "Remove from cart" : "Add to cart"}
          >
            <ShoppingCart
              size={14}
              className={
                inCart ? "fill-parchment text-parchment" : "text-parchment/70"
              }
            />
          </button>
        </div>
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
