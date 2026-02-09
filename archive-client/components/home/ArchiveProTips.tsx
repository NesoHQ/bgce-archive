"use client";

import { Info, Heart, Cloud, ArrowRight } from "lucide-react";

const ArchiveProTips = () => {
  const tips = [
    {
      icon: <Info className="h-6 w-6 text-primary" />,
      title: "FAQs",
      desc: "Learn about BGCE Archive, how to become a community expert, and more",
    },
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: "Community guidelines",
      desc: "Tips to maintain a safe and inclusive environment",
    },
    {
      icon: <Cloud className="h-6 w-6 text-primary" />,
      title: "BGCE Official",
      desc: "Learn about BGCE Official content — Your trusted source for Go expertise",
    },
  ];

  return (
    <section className="container mx-auto py-16">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">
          BGCE Archive pro tips
        </h2>
        <p className="text-sm text-muted-foreground font-mono mt-2">
          Essential resources for community members
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tips.map((tip) => (
          <div
            key={tip.title}
            className="p-4  rounded-md bg-card/50 border border-gray-200 dark:border-white/10 backdrop-blur-md hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer group shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                {tip.icon}
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                  {tip.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tip.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ArchiveProTips;
