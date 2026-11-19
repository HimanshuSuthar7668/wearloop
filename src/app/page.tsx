import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedSection from "@/components/sections/FeaturedSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import SustainabilitySection from "@/components/sections/SustainabilitySection";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  // The homepage uses the full default title rather than the "%s | WearLoop" template.
  title: { absolute: "WearLoop | Rent outfits for weddings, parties and black tie" },
  alternates: { canonical: "/" },
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
