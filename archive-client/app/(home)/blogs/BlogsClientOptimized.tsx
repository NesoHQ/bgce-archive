"use client";

import { useMemo, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { BlogHeader } from "@/components/blogs/BlogHeader";
import { MobileFilterButton } from "@/components/blogs/MobileFilterButton";
import { BlogSidebar } from "@/components/blogs/BlogSidebar";
import { BlogGrid } from "@/components/blogs/BlogGrid";
import type { SortOption } from "@/components/blogs/types";
import { useCategories } from "@/hooks/useCategories";
import { useSubcategories } from "@/hooks/useSubcategories";
import { usePosts } from "@/hooks/usePosts";
import { useBlogFilters } from "@/hooks/useBlogFilters";
import type { ApiCategory, ApiPostListItem } from "@/types/blog.type";

interface BlogsClientProps {
  initialCategories?: ApiCategory[];
  initialPosts?: ApiPostListItem[];
  initialTotal?: number;
}

const MobileFilterDrawer = dynamic(
  () => import("@/components/blogs/MobileFilterDrawer").then((mod) => ({ default: mod.MobileFilterDrawer })),
  { ssr: false },
);

export default function BlogsClient({
  initialCategories,
  initialPosts,
  initialTotal
}: BlogsClientProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { categories } = useCategories(initialCategories);

  // Fetch posts with initial data support
  // We need to call usePosts here to get the 'posts' for the hook below, 
  // but wait, useBlogFilters needs posts for getCategoryPostCount.
  // This is a circular dependency if not careful.
  // Actually, getCategoryPostCount is used in Sidebar.

  // Let's refactor the hook to accept posts later or just compute it in the component if needed.
  // But wait, the user wants it smaller.

  const {
    currentPage, pageSize, sortBy, searchQuery, selectedCategory,
    selectedSubcategory, expandedCategory, categorySearch, showAllCategories,
    showFeaturedOnly, showPinnedOnly, postFilters, activeFiltersCount,
    setCategorySearch, setShowAllCategories, setShowFeaturedOnly, setShowPinnedOnly,
    handleCategoryChange, handleSubcategoryChange, handleSearchChange, handleSortChange,
    handlePageSizeChange, clearAllFilters, handleToggleCategory, goToPage,
    displayedCategories, hasMoreCategories
  } = useBlogFilters(categories, []); // We'll update posts manually or use a ref

  const { posts, total: totalPosts, isLoading: isLoadingPosts } = usePosts(
    postFilters,
    initialPosts && initialTotal !== undefined ? { data: initialPosts, total: initialTotal } : undefined
  );

  // Update getCategoryPostCount to use the latest posts
  const getCategoryPostCountOptimized = useCallback((categoryId: number) =>
    posts.filter((post) => post.category_id === categoryId).length,
    [posts]
  );

  const selectedCategoryUuid = useMemo(() =>
    categories.find((c) => c.id === selectedCategory)?.uuid,
    [selectedCategory, categories]
  );

  const { subcategories, isLoading: isLoadingSubcategories } = useSubcategories(selectedCategoryUuid);
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
