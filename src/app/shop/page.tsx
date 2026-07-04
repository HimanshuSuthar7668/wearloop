import type { Metadata } from "next";
import ShopPageContent from "./ShopPageContent";

export const metadata: Metadata = {
  title: "Shop — WearLoop",
  description:
    "Browse 2,400+ designer pieces from 180+ premium brands. Filter by occasion, size, and rental duration.",
};

export default function ShopPage() {
  return <ShopPageContent />;
}
