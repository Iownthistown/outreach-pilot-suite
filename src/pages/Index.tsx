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

    // Add CSS to hide "Free AI Chatbot Widget" text
    const style = document.createElement('style');
    style.textContent = `
      .elfsight-app-2aed6db9-a8cb-4905-aed1-facaec2377a8 [data-elfsight-widget-branding],
      .elfsight-app-2aed6db9-a8cb-4905-aed1-facaec2377a8 .eapp-widget-branding,
      .elfsight-app-2aed6db9-a8cb-4905-aed1-facaec2377a8 .eapps-widget-branding,
      .elfsight-app-2aed6db9-a8cb-4905-aed1-facaec2377a8 [class*="branding"],
      .elfsight-app-2aed6db9-a8cb-4905-aed1-facaec2377a8 [class*="widget-branding"],
      .elfsight-app-2aed6db9-a8cb-4905-aed1-facaec2377a8 [class*="powered"],
      .elfsight-app-2aed6db9-a8cb-4905-aed1-facaec2377a8 a[href*="elfsight"],
      .elfsight-app-2aed6db9-a8cb-4905-aed1-facaec2377a8 * {
        font-size: 0 !important;
        opacity: 0 !important;
        visibility: hidden !important;
        display: none !important;
      }
      .elfsight-app-2aed6db9-a8cb-4905-aed1-facaec2377a8 iframe {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
      // Cleanup style
      if (style && style.parentNode) {
        style.parentNode.removeChild(style);
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
