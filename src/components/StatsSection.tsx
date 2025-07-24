import { ScrollAnimationWrapper } from "@/hooks/useScrollAnimation";

const StatsSection = () => {
  const stats = [
    {
      number: "25M+",
      label: "Social Interactions",
    },
    {
      number: "75K+",
      label: "Automated Responses",
    },
    {
      number: "1.5K+",
      label: "Active Users",
    },
    {
      number: "98%",
      label: "Satisfaction Rate",
    },
  ];

  return (
    <section className="py-20 bg-background border-t border-primary/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <ScrollAnimationWrapper key={index} delay={index * 50}>
              <div className="text-center transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="bg-gradient-card rounded-2xl p-6 border border-primary/20 shadow-card transition-all duration-300 hover:shadow-lg hover:border-primary/40">
                  <p className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.number}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </ScrollAnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;