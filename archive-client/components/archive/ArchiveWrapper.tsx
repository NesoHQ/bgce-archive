"use client";

import { useState } from "react";
import { BlogBreadcrumb } from "./ArchiveBreadcrumb";
import { ArticleSearch } from "./ArticleSearch";
import ArticleCard from "./ArchiveCard";
import { PaginationDemo } from "./Pagination";
import { Article } from "@/types/blog.type";
import ArticleList from "./ArticleList";

interface ArchiveWrapperProps {
  articles: Article[];
}

const ArchiveWrapper = ({ articles }: ArchiveWrapperProps) => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  return (
    <>
      <div className="mb-4">
        <BlogBreadcrumb />
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">All Archive</h1>
      </div>
      <ArticleSearch setViewMode={setViewMode} viewMode={viewMode} />

      {viewMode === "grid" && (
        <>
          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </>
      )}

      {viewMode === "list" && <ArticleList />}

      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        <PaginationDemo />
      </div>
    </>
  );
};

export default ArchiveWrapper;
