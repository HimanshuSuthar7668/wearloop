import type { Metadata } from "next";
import FavouritesPageContent from "./FavouritesPageContent";

export const metadata: Metadata = {
  title: "Your Favourites — WearLoop",
  description: "View and manage your favourite WearLoop pieces.",
  robots: { index: false, follow: false },
};

export default function FavouritesPage() {
  return <FavouritesPageContent />;
}
