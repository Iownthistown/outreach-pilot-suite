import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQSection = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs = [
    {
      question: "How does COSTRAS work?",
      answer: "COSTRAS monitors social conversations continuously, identifies engagement opportunities based on your criteria, and automatically generates authentic responses that connect with your audience. Our AI understands your brand personality and creates replies that sound genuinely human."
    },
    {
      question: "Will the responses seem automated or unnatural?",
      answer: "Absolutely not! Our AI specializes in crafting authentic, conversational responses that integrate seamlessly into discussions. We prioritize genuine value and relationship building over aggressive promotion."
    },
    {
      question: "How quickly will I see results?",
      answer: "Our automation begins immediately after configuration. You'll see activity on day one, with potential leads following shortly after. Most users observe substantial engagement improvements within 7-14 days."
    },
    {
      question: "Which platforms does COSTRAS support?",
      answer: "We primarily focus on Twitter (X) to ensure optimal performance. Support for LinkedIn and Reddit is currently in development!"
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Absolutely! You maintain complete subscription control. Cancel, pause, or modify plans whenever necessary, directly through your dashboard."
    },
    {
      question: "Is there a trial option available?",
      answer: "Yes! New users receive credits to experience our AI capabilities and evaluate engagement quality before selecting a paid subscription."
    },
    {
      question: "How simple is the setup process?",
      answer: "Setup takes under 2 minutes! Our AI automatically analyzes your digital presence to understand your communication style. No complex onboarding needed."
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
            href="mailto:support@costras.com" 
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