import type { Metadata } from "next";
import AboutPageContent from "./AboutPageContent";

export const metadata: Metadata = {
  title: "About WearLoop",
  description: "The story behind WearLoop — circular fashion for a sustainable future.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
