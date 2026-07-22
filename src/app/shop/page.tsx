import type { Metadata } from "next";
import ShopPageContent from "./ShopPageContent";

export const metadata: Metadata = {
  title: "Shop Designer Fashion Rentals",
  description:
    "Browse 2,400+ designer pieces from 180+ premium brands. Filter by occasion, size, and rental duration. Free delivery on every order.",
  keywords: [
    "rent designer clothes",
    "designer fashion rental",
    "clothes on rent India",
    "outfit rental shop",
    "luxury fashion rental",
    "WearLoop shop",
  ],
  alternates: {
    canonical: "https://www.wearloop.in/shop",
  },
  openGraph: {
    title: "Shop Designer Fashion Rentals — WearLoop",
    description:
      "Browse 2,400+ designer pieces from 180+ premium brands. Free delivery. Fit guarantee.",
    url: "https://www.wearloop.in/shop",
    type: "website",
  },
  twitter: {
    title: "Shop Designer Fashion Rentals — WearLoop",
    description:
      "Browse 2,400+ designer pieces from 180+ premium brands. Free delivery. Fit guarantee.",
  },
};

export default function ShopPage() {
  return <ShopPageContent />;
}
