"use client";

import { Code2, ArrowRight } from "lucide-react";

export default function NotebooksSection() {
  const notebooks = [
    {
      title: "Day 1a - From Prompt to Action",
      desc: "Learn how to build AI agents that can take actions",
      icon: (
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-white font-bold text-lg">k</span>
        </div>
      ),
      metadata: "105875 upvotes · 918 comments",
      tags: ["Python", "AI", "Tutorial"],
    },
    {
      title: "How to use Kaggle Notebooks¶",
      desc: "A comprehensive guide to using Kaggle's notebook environment",
      icon: (
        <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
        </div>
      ),
      metadata: "2205 upvotes · 20 comments",
      tags: ["Python", "Getting Started"],
    },
    {
      title: "Santa 2025 - Getting Started",
      desc: "2023 upvotes · 1 comment Santa 2025 - Christmas Tree Packing...",
      icon: (
        <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
        </div>
      ),
      metadata: "2023 upvotes · 1 comment",
      tags: ["Python", "Competition"],
    },
    {
      title: "Hull Starter Notebook",
      desc: "1709 upvotes · 8 comments Hull Tactical - Market Prediction",
      icon: (
        <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
        </div>
      ),
      metadata: "1709 upvotes · 8 comments",
      tags: ["Python", "Finance", "Trading"],
    },
  ];

  return (
    <section className="container mx-auto py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Code2 className="h-6 w-6" />
            Notebooks
          </h2>
          <p className="text-sm text-muted-foreground font-mono mt-2">
            1.6M public notebooks and access to a powerful notebook environment
            with no cost GPUs & TPUs.
          </p>
        </div>
        <button className="flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
          View all
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notebooks.map((item, idx) => (
          <div
            key={idx}
            className="rounded-md bg-card/30 border border-gray-300 dark:border-white/10 backdrop-blur-md hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden"
          >
            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Icon */}
              <div className="flex items-start gap-3">
                {item.icon}
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h3 className="font-bold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Metadata */}
              <p className="text-xs text-muted-foreground font-mono">
                {item.metadata}
              </p>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {item.desc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono uppercase tracking-wider text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
