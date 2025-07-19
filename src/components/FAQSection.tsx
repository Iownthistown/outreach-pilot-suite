import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQSection = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs = [
    {
      question: "How does OutreachAI work?",
      answer: "OutreachAI scans Twitter conversations 24/7, identifies relevant opportunities based on your targeting criteria, and automatically generates human-like replies that engage potential customers. Our AI analyzes your brand voice and creates responses that sound natural and authentic."
    },
    {
      question: "Will the replies sound spammy or robotic?",
      answer: "No! Our AI is specifically trained to create human-like, engaging responses that fit naturally into conversations. We focus on providing value and building genuine connections rather than pushy sales pitches."
    },
    {
      question: "Can I customize the AI's voice and tone?",
      answer: "Absolutely! You can customize personas, tone, and style to match your brand perfectly. Our AI learns from your website, social profiles, and custom instructions to ensure every reply sounds authentically like you."
    },
    {
      question: "How fast do results kick in?",
      answer: "Our AI starts working immediately after setup. You can see replies going out on Day 1, with leads potentially coming in the same day. Most users see significant engagement boosts within 1-2 weeks."
    },
    {
      question: "What platforms do you support?",
      answer: "We currently focus on Twitter (X) to deliver the best possible results. LinkedIn and Reddit support are in development and coming soon!"
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes! You have full control over your subscription. Cancel, pause, or switch plans whenever you need to, right from your dashboard."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes! New users get 20 free credits to test our AI replies and see the quality and engagement they generate before committing to a paid plan."
    },
    {
      question: "How does the setup process work?",
      answer: "Setup is incredibly simple - just 2 minutes! Our AI analyzes your website and social profiles to understand your brand voice automatically. No lengthy onboarding required."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Got questions? We've got answers. If you can't find what you're looking for, feel free to reach out to our team.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-card border border-primary/20 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/20 transition-colors"
              >
                <h3 className="text-lg font-semibold text-foreground pr-4">{faq.question}</h3>
                {openItems.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                )}
              </button>
              {openItems.includes(index) && (
                <div className="px-6 pb-4">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <a 
            href="mailto:support@outreachai.com" 
            className="text-primary hover:text-primary-glow transition-colors font-semibold"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;