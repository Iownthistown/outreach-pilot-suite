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
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Load Elfsight platform script
    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

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
      
      {/* Elfsight AI Chatbot - Fixed position bottom right */}
      <div 
        className="elfsight-app-2aed6db9-a8cb-4905-aed1-facaec2377a8 fixed bottom-4 right-4 z-50" 
        data-elfsight-app-lazy
      />
    </div>
  );
};

export default Index;
