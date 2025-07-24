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
      <ScrollAnimationWrapper delay={50}>
        <StatsSection />
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper delay={100}>
        <FeaturesSection />
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper delay={150}>
        <HowItWorksSection />
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper delay={200}>
        <PricingSection />
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper delay={250}>
        <TestimonialsSection />
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper delay={300}>
        <FAQSection />
      </ScrollAnimationWrapper>
      <Footer />
    </div>
  );
};

export default Index;
