import type { Metadata } from "next";
import FavouritesPageContent from "./FavouritesPageContent";

export const metadata: Metadata = {
  title: "Your Saved Pieces",
  description: "View and manage your favourite WearLoop pieces saved for later.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function FavouritesPage() {
  return <FavouritesPageContent />;
}
