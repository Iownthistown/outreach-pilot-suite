const StatsSection = () => {
  const stats = [
    {
      number: "50M+",
      label: "Twitter Impressions",
    },
    {
      number: "100K+",
      label: "Engaging Posts Created",
    },
    {
      number: "2K+",
      label: "Marketers Growing",
    },
    {
      number: "100%",
      label: "5 Star Rating",
    },
  ];

  return (
    <section className="py-20 bg-background border-t border-primary/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-gradient-card rounded-2xl p-6 border border-primary/20 shadow-card">
                <p className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.number}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;