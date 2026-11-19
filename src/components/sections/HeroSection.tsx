import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { mockProducts } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";

// Three pieces hanging on the rail, at slightly different drops.
const railPicks = [
  { id: "1", drop: "mt-4" },
  { id: "27", drop: "mt-14" },
  { id: "12", drop: "mt-0" },
];

const onRail = railPicks.map(({ id, drop }) => ({
  product: mockProducts.find((p) => p.id === id)!,
  drop,
}));

export default function HeroSection() {
  return (
    <section className="relative bg-paper pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-14 md:gap-8 items-end">
        <div className="md:col-span-6 lg:col-span-5">
          <h1 className="font-display text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[4.75rem] font-normal tracking-[-0.02em] text-ink">
            Wear it to the wedding.
            <span className="block italic text-rose-ink">Send it back on Monday.</span>
          </h1>

          <p className="mt-7 text-base md:text-lg text-ink/75 max-w-md leading-relaxed">
            Rent designer pieces by the day, for three days, or for the week.
            It arrives cleaned and pressed, and the return bag is already in
            the box.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/shop"
              className={buttonClass()}
            >
              See what&apos;s on the rail
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm text-ink underline underline-offset-[6px] decoration-ink/30 hover:decoration-ink transition-colors"
            >
              How renting works
            </Link>
          </div>
        </div>

        {/* The rail */}
        <div className="md:col-span-6 lg:col-span-6 lg:col-start-7">
          <div className="relative">
            <div className="h-[3px] rounded-full bg-ink/80" aria-hidden />
            <ul className="grid grid-cols-3 gap-3 sm:gap-5 px-2 sm:px-6">
              {onRail.map(({ product, drop }) => (
                <li key={product.id} className={`flex flex-col items-center ${drop}`}>
                  <span className="w-px h-6 bg-ink/50" aria-hidden />
                  <Link href={`/shop/${product.id}`} className="group block w-full">
                    <div className="relative aspect-[3/4] bg-white rounded-sm overflow-hidden shadow-[0_1px_0_rgba(0,0,0,0.06),0_12px_24px_-16px_rgba(0,0,0,0.35)]">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        priority
                        sizes="(max-width: 768px) 30vw, 200px"
                        className="object-contain p-2 group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                    <div className="mt-3 border-l-2 border-rose pl-2.5">
                      <p className="text-[11px] sm:text-xs text-ink/60">{product.brand}</p>
                      <p className="text-xs sm:text-sm text-ink leading-snug group-hover:underline underline-offset-2">
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs text-ink/70 tabular-nums">
                        {formatPrice(product.rentalPrice.per3Days)}{" "}
                        <span className="text-ink/70">for 3 days</span>
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
