import type { Metadata } from "next";
import CartPageContent from "./CartPageContent";

export const metadata: Metadata = {
  title: "Your Bag — WearLoop",
  description: "Review the pieces in your WearLoop rental bag and check out.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartPageContent />;
}
