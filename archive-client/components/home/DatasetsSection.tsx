"use client";

import { Database, ArrowRight } from "lucide-react";

export default function DatasetsSection() {
  const datasets = [
    {
      title: "Bitcoin Historical Data",
      desc: "Bitcoin data at 1-min intervals from select exchanges, Jan 2012 to Present",
      icon: (
        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded flex items-center justify-center">
          <span className="text-2xl font-bold text-orange-600">₿</span>
        </div>
      ),
      metadata: "Usability 10.0 · 105 MB",
      tags: ["Bitcoin", "Cryptocurrency", "Finance"],
    },
    {
      title: "Fruits-360 dataset",
      desc: "A dataset with 173788 images of 250 fruits, vegetables, nuts and seeds",
      icon: (
        <div className="w-12 h-12 rounded overflow-hidden">
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3CradialGradient id='apple'%3E%3Cstop offset='0%25' style='stop-color:%23ff6b6b'/%3E%3Cstop offset='100%25' style='stop-color:%23c92a2a'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='55' r='35' fill='url(%23apple)'/%3E%3Cellipse cx='50' cy='20' rx='8' ry='12' fill='%2351cf66' transform='rotate(-20 50 20)'/%3E%3Crect x='48' y='15' width='4' height='20' fill='%238b4513'/%3E%3C/svg%3E"
            alt="fruits"
            className="w-full h-full object-cover"
          />
        </div>
      ),
      metadata: "Usability 8.8 · 6 GB",
      tags: ["Computer Vision", "Image Classification"],
    },
    {
      title: "International football results from 1872 to...",
      desc: "An up-to-date dataset of over 49,000 international football results",
      icon: (
        <div className="w-12 h-12 rounded overflow-hidden bg-white flex items-center justify-center">
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='48' fill='white' stroke='%23333' stroke-width='1'/%3E%3Cpath d='M50,15 L55,30 L70,30 L58,40 L63,55 L50,45 L37,55 L42,40 L30,30 L45,30 Z' fill='%23333'/%3E%3Cpath d='M50,55 L37,55 L30,70 L50,85' fill='%23333'/%3E%3Cpath d='M50,55 L63,55 L70,70 L50,85' fill='%23333'/%3E%3C/svg%3E"
            alt="football"
            className="w-full h-full"
          />
        </div>
      ),
      metadata: "Usability 10.0 · 1 MB",
      tags: ["Sports", "Football", "Statistics"],
    },
    {
      title: "arXiv Dataset",
      desc: "arXiv dataset and metadata of 1.7M+ scholarly papers across STEM",
      icon: (
        <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded flex items-center justify-center border border-gray-200 dark:border-gray-700">
          <span className="text-2xl font-bold text-red-600 italic">X</span>
        </div>
      ),
      metadata: "Usability 8.8 · 2 GB",
      tags: ["Research", "Papers", "STEM"],
    },
  ];

  return (
    <section className="container mx-auto py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Database className="h-6 w-6" />
            Datasets
          </h2>
          <p className="text-sm text-muted-foreground font-mono mt-2">
            652K high-quality public datasets. Everything from avocado prices to
            video game sales.
          </p>
        </div>
        <button className="flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
          View all
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {datasets.map((item, idx) => (
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
