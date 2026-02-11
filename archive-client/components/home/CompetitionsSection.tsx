"use client";

import { Trophy, ArrowRight, Users, Calendar, Award } from "lucide-react";

export default function CompetitionsSection() {
  const competitions = [
    {
      title: "AI Image Classification Challenge 2026",
      desc: "Build the most accurate image classifier using our dataset of 1M+ labeled images",
      prize: "$50,000",
      participants: "12,458",
      deadline: "15 days left",
      difficulty: "Advanced",
      tags: ["Computer Vision", "Deep Learning"],
    },
    {
      title: "Natural Language Processing Sprint",
      desc: "Create a sentiment analysis model that beats the current benchmark",
      prize: "$25,000",
      participants: "8,234",
      deadline: "28 days left",
      difficulty: "Intermediate",
      tags: ["NLP", "Transformers"],
    },
    {
      title: "Time Series Forecasting Competition",
      desc: "Predict stock market trends using historical data and machine learning",
      prize: "$35,000",
      participants: "15,892",
      deadline: "7 days left",
      difficulty: "Expert",
      tags: ["Time Series", "Finance"],
    },
  ];

  return (
    <section className="container mx-auto py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Competitions
          </h2>
          <p className="text-sm text-muted-foreground font-mono mt-2">
            Compete with the best data scientists and win amazing prizes
          </p>
        </div>
        <button className="flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
          View all
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.map((comp, idx) => (
          <div
            key={idx}
            className="rounded-md bg-card/30 border border-gray-300 dark:border-white/10 backdrop-blur-md hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden flex flex-col"
          >
            {/* Content */}
            <div className="p-6 space-y-4 flex-1">
              {/* Prize Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 dark:bg-yellow-500/20 border border-yellow-300 dark:border-yellow-500/30">
                  <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                  <span className="text-sm font-bold text-yellow-700 dark:text-yellow-400">
                    {comp.prize}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    comp.difficulty === "Beginner"
                      ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                      : comp.difficulty === "Intermediate"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                        : comp.difficulty === "Advanced"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400"
                          : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                  }`}
                >
                  {comp.difficulty}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem]">
                {comp.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 min-h-[4rem]">
                {comp.desc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {comp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono uppercase tracking-wider text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-muted/80 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono">
                {/* Stats */}
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    <strong>{comp.participants}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <strong>{comp.deadline}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
