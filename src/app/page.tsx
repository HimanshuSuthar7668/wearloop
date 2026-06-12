import HeroSection from "@/components/sections/HeroSection";
import FeaturedSection from "@/components/sections/FeaturedSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import SustainabilitySection from "@/components/sections/SustainabilitySection";
import CTASection from "@/components/sections/CTASection";

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
