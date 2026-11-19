"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, getAuthToken } from "@/lib/utils";
import { useAppStore } from "@/context/AppContext";

/**
 * Shop grid card. The whole card links to the product page; the only extra
 * action is saving it. Booking happens on the product page, after a size and
 * dates have been chosen.
 */
export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { favourites, addToFavourites, removeFromFavourites } = useAppStore();
  const saved = favourites.includes(product.id);

  const toggleSaved = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!getAuthToken()) return router.push(`/auth?redirect=/shop/${product.id}`);
    if (saved) removeFromFavourites(product.id);
    else addToFavourites(product.id);
  };

  return (
    <article className="group relative">
      <Link href={`/shop/${product.id}`} className="block rounded-sm focus-visible:outline-offset-4">
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-white">
          <Image
            src={product.images[0]}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
          />
          {!product.available && (
            <span className="absolute left-3 top-3 rounded-sm bg-paper px-2 py-1 text-xs text-ink">Booked out</span>
          )}
        </div>

        <div className="mt-3">
          <p className="text-xs text-ink/60">{product.brand}</p>
          <h3 className="mt-0.5 text-sm text-ink leading-snug group-hover:underline underline-offset-2">{product.name}</h3>
          <p className="mt-1 text-sm text-ink tabular-nums">
            {formatPrice(product.rentalPrice.per3Days)}
            <span className="text-ink/60"> for 3 days</span>
          </p>
        </div>
      </Link>

      <button
        type="button"
        onClick={toggleSaved}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${product.name} from favourites` : `Save ${product.name} to favourites`}
        className="absolute right-2 top-2 p-2 rounded-sm text-neutral-500 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
      >
        <Heart size={16} className={saved ? "fill-rose-ink text-rose-ink" : ""} aria-hidden />
      </button>
    </article>
  );
}
