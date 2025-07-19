import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Creator & Influencer",
      rating: 5,
      text: "I was skeptical at first, but OutreachAI's replies have been a game-changer. My engagement is up 40% and I'm saving hours each week. It's like having a mini-me handling my social media, but better. Seriously impressed."
    },
    {
      name: "Alex Kim",
      role: "Software Engineer",
      rating: 5,
      text: "OutreachAI is a game changer for customer service. AI responses save me hours every day."
    },
    {
      name: "Emily Nguyen",
      role: "Content Creator",
      rating: 5,
      text: "I can't imagine creating content without OutreachAI. It's like having a super smart assistant who knows my audience better than I do. The automation is pure gold."
    },
    {
      name: "Michael Brown",
      role: "Small Business Owner",
      rating: 5,
      text: "OutreachAI has been a lifesaver for my small business. The AI-generated content has helped me connect with my customers on a whole new level."
    },
    {
      name: "Sophia Lee",
      role: "UX Designer",
      rating: 5,
      text: "OutreachAI's AI replies on X are so COOL. They're smart, engaging, and save me tons of time. Highly recommend."
    },
    {
      name: "Ethan Patel",
      role: "Digital Marketer",
      rating: 5,
      text: "OutreachAI is a must have for any digital marketer. The platform is intuitive, and the results speak for themselves."
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Trusted by 1000+ professionals
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See what our users are saying about their experience with OutreachAI
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card border border-primary/20 rounded-2xl p-6 shadow-card backdrop-blur-sm">
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-warning fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-foreground mb-6">
                "{testimonial.text}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-card border border-primary/20 rounded-2xl p-8 shadow-card backdrop-blur-sm max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Join thousands of professionals growing their social media
            </h3>
            <p className="text-muted-foreground mb-6">
              Start automating your outreach and watch your engagement soar
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;