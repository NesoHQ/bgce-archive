"use client";

import { ArrowRight } from "lucide-react";

interface CategoryItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  metadata: string;
  tags: string[];
}

interface CategorySectionProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  items: CategoryItem[];
  viewAllLink?: string;
}

export default function CategorySection({
  title,
  description,
  icon,
  items,
  viewAllLink = "#",
}: CategorySectionProps) {
  return (
    <section className="py-10 bg-gray-50/50 dark:bg-transparent">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2 mb-1">
              {icon && <span className="text-foreground">{icon}</span>}
              {title}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
          <a
            href={viewAllLink}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap mt-1"
          >
            View all →
          </a>
        </div>

        {/* Horizontal Scrollable Cards */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-custom">
          <div className="flex gap-3 w-max">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="w-[260px] bg-white dark:bg-card border border-gray-200 dark:border-white/10 rounded-md hover:shadow-md transition-all cursor-pointer overflow-hidden"
              >
                <div className="p-4">
                  {/* Icon + Title Row */}
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-shrink-0">{item.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-1">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Metadata */}
                  <p className="text-[11px] text-muted-foreground mb-2 ml-[52px]">
                    {item.metadata}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3 ml-[52px]">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 ml-[52px]">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[10px] bg-gray-100 dark:bg-muted text-gray-600 dark:text-muted-foreground rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-custom::-webkit-scrollbar {
          height: 6px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </section>
  );
}
