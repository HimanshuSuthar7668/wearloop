import type { Metadata } from "next";
import AboutPageContent from "./AboutPageContent";

export const metadata: Metadata = {
  title: "About WearLoop",
  description:
    "The story behind WearLoop — circular fashion built for a sustainable future. Meet the team turning India's wardrobe into a shared, endlessly refreshing collection.",
  keywords: [
    "about WearLoop",
    "circular fashion India",
    "sustainable clothing brand",
    "fashion rental company India",
  ],
  alternates: {
    canonical: "https://www.wearloop.in/about",
  },
  openGraph: {
    title: "About WearLoop",
    description:
      "The story behind WearLoop — circular fashion built for a sustainable future.",
    url: "https://www.wearloop.in/about",
    type: "website",
  },
  twitter: {
    title: "About WearLoop",
    description:
      "The story behind WearLoop — circular fashion built for a sustainable future.",
  },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
