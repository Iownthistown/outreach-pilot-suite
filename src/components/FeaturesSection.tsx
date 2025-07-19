import { Building, Users, TrendingUp, Clock, Target, BarChart3 } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Users,
      title: "For Entrepreneurs",
      subtitle: "Save time while growing your network",
      points: [
        "Automate social engagement",
        "Build authentic connections",
        "Convert engagement into opportunities"
      ]
    },
    {
      icon: Building,
      title: "For Companies",
      subtitle: "Scale your social media presence",
      points: [
        "Maintain consistent brand voice",
        "Increase team efficiency",
        "Track engagement metrics"
      ]
    },
    {
      icon: TrendingUp,
      title: "For Marketers",
      subtitle: "Amplify your content reach",
      points: [
        "Generate engaging responses",
        "Boost organic visibility",
        "Measure performance"
      ]
    }
  ];

  const mainFeatures = [
    {
      icon: Target,
      title: "Expand Your Reach",
      description: "Turn every interaction into an opportunity to grow your professional network"
    },
    {
      icon: Clock,
      title: "AI-Powered Engagement",
      description: "Let our smart algorithms craft perfect responses that resonate with your audience"
    },
    {
      icon: BarChart3,
      title: "Boost Your Impact",
      description: "Watch your influence grow as you consistently engage with your target audience"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Time is precious, engagement is essential
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            OutreachAI helps you maintain meaningful social media presence without spending hours creating replies
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

        {/* Trusted by section */}
        <div className="text-center mb-16">
          <p className="text-muted-foreground mb-8">Trusted by growing businesses and content creators worldwide</p>
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="bg-muted/20 rounded-lg px-6 py-3">OBI Real Estate</div>
            <div className="bg-muted/20 rounded-lg px-6 py-3">Producta</div>
            <div className="bg-muted/20 rounded-lg px-6 py-3">SavvyCal</div>
            <div className="bg-muted/20 rounded-lg px-6 py-3">Novasoft</div>
          </div>
        </div>

        {/* Transform section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Transform Your Social Media Game
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Leverage AI to create meaningful connections and drive engagement across your social platforms
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