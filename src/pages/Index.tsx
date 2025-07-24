import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import { ScrollAnimationWrapper } from "@/hooks/useScrollAnimation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ScrollAnimationWrapper>
        <StatsSection />
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper>
        <FeaturesSection />
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper>
        <HowItWorksSection />
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper>
        <PricingSection />
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper>
        <TestimonialsSection />
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper>
        <FAQSection />
      </ScrollAnimationWrapper>
      <Footer />
    </div>
  );
};

export default Index;
