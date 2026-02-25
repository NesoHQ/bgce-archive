"use client";

import { useState, useEffect } from "react";
import { BlogBreadcrumb } from "./ArchiveBreadcrumb";
import { ArticleSearch } from "./ArticleSearch";
import ArticleCard from "./ArchiveCard";
import { PaginationDemo } from "./Pagination";
import { Article } from "@/types/blog.type";
import ArticleList from "./ArticleList";
import { NoSearchResults, NoContent } from "@/components/shared/EmptyState";

const ArchiveWrapper = ({
  articles: initialArticles,
}: {
  articles: Article[];
}) => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");

  useEffect(() => {
    // Start with initial articles
    let filteredArticles = [...initialArticles];

    // Apply category filter
    if (selectedCategory !== "all") {
      if (selectedCategory.startsWith("cat-")) {
        const catId = parseInt(selectedCategory.replace("cat-", ""));
        filteredArticles = filteredArticles.filter(
          (article) => article.category_id === catId,
        );
      } else if (selectedCategory.startsWith("sub-")) {
        const subId = parseInt(selectedCategory.replace("sub-", ""));
        filteredArticles = filteredArticles.filter(
          (article) => article.subcategory_id === subId,
        );
      }
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredArticles = filteredArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query) ||
          (article.tags &&
            article.tags.some((tag) => tag.toLowerCase().includes(query))),
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "name-asc":
        filteredArticles.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        filteredArticles.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "recent":
        filteredArticles.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        break;
      case "popular":
        filteredArticles.sort((a, b) => b.views - a.views);
        break;
    }

    setArticles(filteredArticles);
  }, [initialArticles, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="relative">
      {/* Technical Grid Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="mb-3">
          <BlogBreadcrumb />
        </div>

        {/* Search and Filters */}
        <ArticleSearch
          setViewMode={setViewMode}
          viewMode={viewMode}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalCount={initialArticles.length}
          filteredCount={articles.length}
        />

        {articles.length === 0 ? (
          searchQuery ? (
            <NoSearchResults query={searchQuery} />
          ) : (
            <NoContent type="articles" />
          )
        ) : (
          <>
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}

            {viewMode === "list" && <ArticleList articles={articles} />}

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <PaginationDemo />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ArchiveWrapper;
