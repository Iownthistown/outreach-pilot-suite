import { Building, Users, TrendingUp, Clock, Target, BarChart3 } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Users,
      title: "For Entrepreneurs",
      subtitle: "Streamline networking while you scale",
      points: [
        "Intelligent conversation management",
        "Foster genuine relationships",
        "Transform interactions into leads"
      ]
    },
    {
      icon: Building,
      title: "For Companies",
      subtitle: "Enhance your digital footprint",
      points: [
        "Preserve brand consistency",
        "Optimize team productivity",
        "Monitor engagement analytics"
      ]
    },
    {
      icon: TrendingUp,
      title: "For Marketers",
      subtitle: "Expand your content influence",
      points: [
        "Create compelling interactions",
        "Increase organic reach",
        "Analyze campaign performance"
      ]
    }
  ];

  const mainFeatures = [
    {
      icon: Target,
      title: "Maximize Your Influence",
      description: "Transform casual interactions into meaningful connections that drive business growth"
    },
    {
      icon: Clock,
      title: "Intelligent Automation",
      description: "Advanced AI creates contextual responses that maintain your personal touch"
    },
    {
      icon: BarChart3,
      title: "Amplify Your Presence",
      description: "Build lasting engagement through consistent, strategic Twitter/X interactions"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Efficiency meets authenticity
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            COSTRAS enables consistent Twitter/X engagement while preserving your unique voice and authentic connections
          </p>
        </div>

        {/* Target Audience Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="bg-card border border-primary/20 rounded-2xl p-8 shadow-card backdrop-blur-sm">
              <div className="mb-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.subtitle}</p>
              </div>
              <ul className="space-y-2">
                {feature.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex items-center gap-2 text-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Transform section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Revolutionize Your Digital Strategy
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Harness intelligent automation to build authentic relationships and accelerate your online growth
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {mainFeatures.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;