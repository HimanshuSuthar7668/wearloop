import type { Metadata } from "next";
import { categories, occasions } from "@/lib/mockData";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import ShopPageContent from "./ShopPageContent";

interface PageProps {
  searchParams: { category?: string; occasion?: string; q?: string; size?: string; sort?: string };
}

const DESCRIPTIONS: Record<string, string> = {
  dress: "Rent gowns, cocktail dresses and wedding-guest dresses by the day. Cleaned, delivered and collected free.",
  suit: "Rent suits, tuxedos and bandhgalas for weddings, interviews and black-tie dinners. Delivered pressed, collected free.",
  top: "Rent kurtas and statement tops for mehendi, haldi and festive evenings.",
  outerwear: "Rent a winter puffer or a rain jacket for one trip instead of buying a coat you'll wear twice.",
  wedding: "Wedding outfits to rent: gowns, maxis, bandhgalas and suits for every function, delivered the day before.",
  party: "Party wear to rent: sequins, velvet and cocktail dresses for birthdays, launches and nights out.",
  formal: "Black-tie outfits to rent: floor-length gowns, tuxedos and dinner jackets.",
  work: "Workwear to rent for interviews, presentations and formal office days.",
  casual: "Everyday and travel pieces to rent, from winter puffers to monsoon jackets.",
};

export function generateMetadata({ searchParams }: PageProps): Metadata {
  const category = categories.find((c) => c.id === searchParams.category && c.id !== "all");
  const occasion = occasions.find((o) => o.id === searchParams.occasion && o.id !== "all");

  // Only category and occasion change what the page is about; search, size and sort
  // are variations of it, so they share its canonical URL and aren't indexed separately.
  const canonicalParams = new URLSearchParams();
  if (category) canonicalParams.set("category", category.id);
  if (occasion) canonicalParams.set("occasion", occasion.id);
  const canonical = absoluteUrl(`/shop${canonicalParams.size ? `?${canonicalParams}` : ""}`);

  const title = category
    ? occasion
      ? `${category.label} for ${occasion.forPhrase}, to rent`
      : `${category.label} to rent`
    : occasion
      ? `${occasion.heading} to rent`
      : "Rent designer outfits";

  const description =
    (category && !occasion && DESCRIPTIONS[category.id]) ||
    (occasion && DESCRIPTIONS[occasion.id]) ||
    "Rent dresses, suits and occasion wear for a day, three days or a week. Free delivery and collection, cleaning included.";

  const isVariant = Boolean(searchParams.q || searchParams.size || searchParams.sort);

  return {
    title,
    description,
    alternates: { canonical },
    robots: isVariant ? { index: false, follow: true } : undefined,
    openGraph: { title: `${title} | ${SITE_NAME}`, description, url: canonical, type: "website" },
    twitter: { title: `${title} | ${SITE_NAME}`, description },
  };
}

export default function ShopPage() {
  return <ShopPageContent />;
}
