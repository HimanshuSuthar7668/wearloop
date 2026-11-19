import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const suggestions = [
  { href: "/shop?occasion=wedding", label: "Wedding outfits" },
  { href: "/shop?occasion=party", label: "Party wear" },
  { href: "/shop?category=suit", label: "Suits" },
  { href: "/how-it-works", label: "How renting works" },
];

export default function NotFound() {
  return (
    <div className="min-h-[75vh] pt-32 pb-20 max-w-7xl mx-auto px-6 md:px-10">
      <p className="text-sm text-ink/60">404</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl text-ink max-w-xl">
        This page has been returned to the rail.
      </h1>
      <p className="mt-4 max-w-md text-ink/75">
        The link may be old, or the piece may have been retired. Try one of these instead.
      </p>

      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
        {suggestions.map((s) => (
          <li key={s.href}>
            <Link href={s.href} className="text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink">
              {s.label}
            </Link>
          </li>
        ))}
      </ul>

      <Link href="/shop" className={buttonClass({ className: "mt-10" })}>
        Browse the collection
      </Link>
    </div>
  );
}
