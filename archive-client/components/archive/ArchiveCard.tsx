"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  article: {
    id: number; // Add this for keys
    title: string;
    author: string;
    publishedAt: string;
    views: number;
    votes: number;
    description: string;
    tags: string[];
  };
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <Card className="border border-gray-200 dark:border-0 shadow-none rounded-md transition-all duration-300 bg-white dark:bg-gray-800 p-0 pb-10 hover:shadow-md dark:hover:shadow-gray-900 cursor-pointer">
      <div className="bg-[#EEEEFA] dark:bg-gray-700 py-5 px-4 rounded-t-md">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {article.title}
        </h3>

        {/* Author and meta info */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2 ">
          {/* Avatar */}
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-300 font-semibold text-sm">
            {article.author.charAt(0)}
          </div>

          {/* Name and badge */}
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-teal-900 dark:text-teal-300 font-medium hover:underline cursor-pointer">
                {article.author}
              </span>
              <Badge className="bg-[#504BAB] dark:bg-purple-700 text-white text-[10px] font-semibold">
                EXPERT
              </Badge>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              published {article.publishedAt} | {article.votes} votes |{" "}
              {article.views} views
            </span>
          </div>
        </div>
      </div>

      <div className="px-4">
        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {article.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          {article.tags.map((tag, i) => (
            <Badge
              key={i}
              variant="outline"
              className="text-[11px] px-2 py-1 rounded-full font-medium border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ArticleCard;
