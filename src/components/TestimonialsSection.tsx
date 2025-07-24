import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Marcus Rodriguez",
      role: "CEO at TechFlow Solutions",
      rating: 5,
      text: "Initially hesitant, but COSTRAS completely transformed my approach. Engagement increased 40% while reclaiming hours weekly. It's like having a digital twin managing my presence, only smarter. Absolutely remarkable."
    },
    {
      name: "Jennifer Walsh",
      role: "Marketing Director at InnovateCorp",
      rating: 5,
      text: "COSTRAS revolutionized my client communication strategy. Automated responses recovered countless hours daily."
    },
    {
      name: "David Thompson",
      role: "Founder of CreativeHub",
      rating: 5,
      text: "Creating content without COSTRAS feels impossible now. It's like having an intelligent assistant who understands my audience intuitively. The automation capabilities are extraordinary."
    },
    {
      name: "Rachel Anderson",
      role: "VP Marketing at NextGen Media",
      rating: 5,
      text: "COSTRAS transformed my customer relationships. The intelligent content generation established deeper connections with my audience."
    },
    {
      name: "Kevin Liu",
      role: "Head of Growth at StartupLab",
      rating: 5,
      text: "COSTRAS delivers incredible Twitter/X automation. Smart, compelling interactions that save significant time. Strongly recommended."
    },
    {
      name: "Amanda Foster",
      role: "Brand Manager at GlobalReach",
      rating: 5,
      text: "COSTRAS is essential for digital marketing professionals. Intuitive interface with measurable, impressive outcomes."
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Empowering 1500+ professionals
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how professionals are transforming their social strategy with COSTRAS
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card border border-primary/20 rounded-2xl p-6 shadow-card backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/40 cursor-pointer group">
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
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
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
          <div className="bg-gradient-card border border-primary/20 rounded-2xl p-8 shadow-card backdrop-blur-sm max-w-2xl mx-auto transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/40 cursor-pointer">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Join the community of professionals scaling their digital presence
            </h3>
            <p className="text-muted-foreground mb-6">
              Begin your automation journey and experience exponential engagement growth
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;