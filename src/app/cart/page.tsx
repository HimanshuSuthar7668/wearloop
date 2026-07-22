import type { Metadata } from "next";
import CartPageContent from "./CartPageContent";

export const metadata: Metadata = {
  title: "Your Rental Bag",
  description: "Review the pieces in your WearLoop rental bag and proceed to checkout.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function CartPage() {
  return <CartPageContent />;
}
