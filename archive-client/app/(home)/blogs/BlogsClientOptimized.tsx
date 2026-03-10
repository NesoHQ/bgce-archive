"use client";

import { useMemo, useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { BlogHeader } from "@/components/blogs/BlogHeader";
import { MobileFilterButton } from "@/components/blogs/MobileFilterButton";
import { BlogSidebar } from "@/components/blogs/BlogSidebar";
import { BlogGrid } from "@/components/blogs/BlogGrid";
import { useBlogFilters } from "@/hooks/useBlogFilters";
import { api } from "@/lib/api";
import type { ApiCategory, ApiPostListItem } from "@/types/blog.type";

const MobileFilterDrawer = dynamic(
  () => import("@/components/blogs/MobileFilterDrawer").then((mod) => ({ default: mod.MobileFilterDrawer })),
  { ssr: false },
);

export default function BlogsClient() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch categories using TanStack Query
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.getCategories(),
  });

  const {
    currentPage, pageSize, sortBy, searchQuery, selectedCategory,
    selectedSubcategory, expandedCategory, categorySearch, showAllCategories,
    showFeaturedOnly, showPinnedOnly, postFilters, activeFiltersCount,
    setCategorySearch, setShowAllCategories, setShowFeaturedOnly, setShowPinnedOnly,
    handleCategoryChange, handleSubcategoryChange, handleSearchChange, handleSortChange,
    handlePageSizeChange, clearAllFilters, handleToggleCategory, goToPage,
    displayedCategories, hasMoreCategories
  } = useBlogFilters(categories, []);

  // Fetch posts using TanStack Query with filters
  const { data: postsData, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["posts", postFilters],
    queryFn: () => api.getPosts(postFilters),
    staleTime: 30 * 1000,
    refetchOnMount: "always",
  });

  const posts = postsData?.data || [];
  const totalPosts = postsData?.total || 0;

  // Get category post count
  const getCategoryPostCountOptimized = useCallback((categoryId: number) =>
    posts.filter((post) => post.category_id === categoryId).length,
    [posts]
  );

  const selectedCategoryUuid = useMemo(() =>
    categories.find((c) => c.id === selectedCategory)?.uuid,
    [selectedCategory, categories]
  );

  // Fetch subcategories using TanStack Query
  const { data: subcategories = [], isLoading: isLoadingSubcategories } = useQuery({
    queryKey: ["subcategories", selectedCategoryUuid],
    queryFn: () => api.getSubcategories(selectedCategoryUuid!),
    enabled: !!selectedCategoryUuid,
  });

  const totalPages = Math.ceil(totalPosts / pageSize);

  useEffect(() => {
    document.body.style.overflow = showMobileFilters ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [showMobileFilters]);

  return (
    <div className="min-h-screen">
      <BlogHeader />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <MobileFilterButton
          onClick={() => setShowMobileFilters(true)}
          activeFiltersCount={activeFiltersCount}
        />

        {showMobileFilters && (
          <MobileFilterDrawer
            isOpen={showMobileFilters}
            onClose={() => setShowMobileFilters(false)}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            selectedSubcategory={selectedSubcategory}
            onSubcategoryChange={handleSubcategoryChange}
            subcategories={subcategories}
            expandedCategory={expandedCategory}
            onToggleCategory={handleToggleCategory}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            showFeaturedOnly={showFeaturedOnly}
            onToggleFeatured={() => setShowFeaturedOnly(!showFeaturedOnly)}
            onClearFilters={clearAllFilters}
            activeFiltersCount={activeFiltersCount}
            filteredBlogsCount={totalPosts}
          />
        )}

        <div className="flex flex-col lg:flex-row gap-4">
          <BlogSidebar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            selectedSubcategory={selectedSubcategory}
            onSubcategoryChange={handleSubcategoryChange}
            subcategories={subcategories}
            expandedCategory={expandedCategory}
            onToggleCategory={handleToggleCategory}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            showFeaturedOnly={showFeaturedOnly}
            onToggleFeatured={() => setShowFeaturedOnly(!showFeaturedOnly)}
            categorySearch={categorySearch}
            onCategorySearchChange={setCategorySearch}
            showAllCategories={showAllCategories}
            onToggleShowAll={() => setShowAllCategories(!showAllCategories)}
            displayedCategories={displayedCategories}
            hasMoreCategories={hasMoreCategories}
            getCategoryPostCount={getCategoryPostCountOptimized}
            totalPosts={totalPosts}
            isLoadingSubcategories={isLoadingSubcategories}
            onClearFilters={clearAllFilters}
            activeFiltersCount={activeFiltersCount}
          />

          <main className="flex-1">
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground">
                {isLoadingPosts ? "Loading..." : `${totalPosts} Blog${totalPosts !== 1 ? "s" : ""} found`}
                {totalPosts > 0 && ` (Page ${currentPage} of ${totalPages})`}
              </p>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="h-9 w-20 rounded-md border border-input bg-background px-2 py-1 text-sm"
                >
                  <option value={9}>9</option>
                  <option value={15}>15</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-muted-foreground">per page</span>
              </div>
            </div>

            <BlogGrid blogs={posts} isLoading={isLoadingPosts} onClearFilters={clearAllFilters} />

            {totalPages > 1 && !isLoadingPosts && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1, totalPages)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-md border border-input bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page, totalPages)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${page === currentPage
                        ? "bg-primary text-primary-foreground"
                        : "border border-input bg-background hover:bg-accent"
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  {totalPages > 5 && <span className="px-2 text-muted-foreground">...</span>}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <button
                      onClick={() => goToPage(totalPages, totalPages)}
                      className="px-3 py-2 rounded-md border border-input bg-background hover:bg-accent text-sm font-medium"
                    >
                      {totalPages}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1, totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-md border border-input bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
