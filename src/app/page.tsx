import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedSection from "@/components/sections/FeaturedSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import SustainabilitySection from "@/components/sections/SustainabilitySection";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "WearLoop — Rent. Wear. Return. Repeat.",
  description:
    "Discover premium fashion rentals from 180+ brands. Wear designer clothes for any occasion without the commitment. Sustainable, affordable, endlessly stylish.",
  keywords: [
    "clothes rental India",
    "rent designer clothes",
    "fashion rental platform",
    "sustainable fashion India",
    "outfit rental",
    "dress rental",
    "WearLoop",
  ],
  alternates: {
    canonical: "https://www.wearloop.in",
  },
  openGraph: {
    title: "WearLoop — Rent. Wear. Return. Repeat.",
    description:
      "Wear 2,400+ premium pieces from 180+ brands. Sustainable, pay-as-you-go fashion rental delivered to your door.",
    url: "https://www.wearloop.in",
    type: "website",
  },
  twitter: {
    title: "WearLoop — Rent. Wear. Return. Repeat.",
    description:
      "Wear 2,400+ premium pieces from 180+ brands. Sustainable, pay-as-you-go fashion rental delivered to your door.",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedSection />
      <HowItWorksSection />
      <SustainabilitySection />
      <CTASection />
    </>
  );
}
