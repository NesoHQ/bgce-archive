"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { BlogHeader } from "@/components/blogs/BlogHeader";
import { MobileFilterButton } from "@/components/blogs/MobileFilterButton";
import { BlogSidebar } from "@/components/blogs/BlogSidebar";
import { BlogGrid } from "@/components/blogs/BlogGrid";
import type { BlogsClientProps, SortOption } from "@/components/blogs/types";
import type { ApiCategory } from "@/types/blog.type";
import { getSubcategories } from "@/action/subcategory.action";
import { getPosts } from "@/action/post.action";

// Dynamically import mobile drawer (heavy component)
const MobileFilterDrawer = dynamic(
  () =>
    import("@/components/blogs/MobileFilterDrawer").then((mod) => ({
      default: mod.MobileFilterDrawer,
    })),
  { ssr: false },
);

export default function BlogsClient({
  initialPosts,
  categories,
}: BlogsClientProps) {
  // State
  const [posts, setPosts] = useState(initialPosts);
  const [totalPosts, setTotalPosts] = useState(initialPosts.length);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [sortBy, setSortBy] = useState<SortOption>("new");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
    null,
  );
  const [subcategories, setSubcategories] = useState<ApiCategory[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [categorySearch, setCategorySearch] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  const totalPages = Math.ceil(totalPosts / pageSize);

  // Fetch subcategories when category is selected
  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find((c) => c.id === selectedCategory);
      if (category?.uuid) {
        setIsLoadingSubcategories(true);
        getSubcategories(category.uuid)
          .then(setSubcategories)
          .finally(() => setIsLoadingSubcategories(false));
      }
    } else {
      setSubcategories([]);
      setSelectedSubcategory(null);
    }
  }, [selectedCategory, categories]);

  // Fetch posts when filters change - SERVER SIDE
  // const fetchFilteredPosts = useCallback(async () => {
  //     setIsLoading(true);
  //     try {
  //         const params: any = {
  //             limit: pageSize,
  //             offset: (currentPage - 1) * pageSize,
  //         };

  //         // Category filters
  //         if (selectedCategory) params.category_id = selectedCategory;
  //         if (selectedSubcategory) params.sub_category_id = selectedSubcategory;

  //         // Search
  //         if (searchQuery) params.search = searchQuery;

  //         // Feature filters
  //         if (showFeaturedOnly) params.is_featured = true;
  //         if (showPinnedOnly) params.is_pinned = true;

  //         // Sorting
  //         if (sortBy === "new") {
  //             params.sort_by = "created_at";
  //             params.sort_order = "DESC";
  //         } else if (sortBy === "views") {
  //             params.sort_by = "view_count";
  //             params.sort_order = "DESC";
  //         } else if (sortBy === "featured") {
  //             params.is_featured = true;
  //             params.sort_by = "created_at";
  //             params.sort_order = "DESC";
  //         }

  //         const response = await fetch(`${process.env.NEXT_PUBLIC_POSTAL_API_URL || 'http://localhost:8081/api/v1'}/posts?${new URLSearchParams(params).toString()}`);
  //         const result = await response.json();

  //         if (result.status) {
  //             setPosts(result.data || []);
  //             setTotalPosts(result.meta?.total || 0);
  //         }
  //     } catch (error) {
  //         console.error("Error fetching posts:", error);
  //     } finally {
  //         setIsLoading(false);
  //     }
  // }, [currentPage, pageSize, selectedCategory, selectedSubcategory, searchQuery, showFeaturedOnly, showPinnedOnly, sortBy]);

  const fetchFilteredPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Parameters<typeof getPosts>[0] = {
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        category_id: selectedCategory || undefined,
        sub_category_id: selectedSubcategory || undefined,
        search: searchQuery || undefined,
        is_featured: showFeaturedOnly || undefined,
        is_pinned: showPinnedOnly || undefined,
      };

      if (sortBy === "new") {
        params.sort_by = "created_at";
        params.sort_order = "DESC";
      } else if (sortBy === "views") {
        params.sort_by = "view_count";
        params.sort_order = "DESC";
      } else if (sortBy === "featured") {
        params.is_featured = true;
        params.sort_by = "created_at";
        params.sort_order = "DESC";
      }

      const { data, total } = await getPosts(params);
      setPosts(data);
      setTotalPosts(total);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    selectedCategory,
    selectedSubcategory,
    searchQuery,
    showFeaturedOnly,
    showPinnedOnly,
    sortBy,
  ]);

  // Fetch posts when filters change
  useEffect(() => {
    fetchFilteredPosts();
  }, [fetchFilteredPosts]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategory,
    selectedSubcategory,
    searchQuery,
    showFeaturedOnly,
    showPinnedOnly,
    sortBy,
    pageSize,
  ]);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!categorySearch) return categories;
    return categories.filter((cat) =>
      cat.label.toLowerCase().includes(categorySearch.toLowerCase()),
    );
  }, [categories, categorySearch]);

  // Show only top 5 categories initially
  const displayedCategories = useMemo(() => {
    if (categorySearch || showAllCategories) return filteredCategories;
    return filteredCategories.slice(0, 5);
  }, [filteredCategories, categorySearch, showAllCategories]);

  const hasMoreCategories =
    filteredCategories.length > 5 && !showAllCategories && !categorySearch;

  // Get post count per category (approximate from initial load)
  const getCategoryPostCount = (categoryId: number) => {
    return initialPosts.filter((post) => post.category_id === categoryId)
      .length;
  };

  const activeFiltersCount = [
    searchQuery,
    selectedCategory,
    selectedSubcategory,
    showFeaturedOnly,
    showPinnedOnly,
  ].filter(Boolean).length;

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMobileFilters]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document
          .querySelector<HTMLInputElement>('input[placeholder*="Search"]')
          ?.focus();
      }
      if (e.key === "Escape" && activeFiltersCount > 0) {
        clearAllFilters();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [activeFiltersCount]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setCategorySearch("");
    setShowAllCategories(false);
    setShowFeaturedOnly(false);
    setShowPinnedOnly(false);
    setCurrentPage(1);
  };

  const handleToggleCategory = (categoryId: number) => {
    if (selectedCategory === categoryId) {
      setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    } else {
      setSelectedCategory(categoryId);
      setExpandedCategory(categoryId);
      setSelectedSubcategory(null);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      <BlogHeader />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <MobileFilterButton
          onClick={() => setShowMobileFilters(true)}
          activeFiltersCount={activeFiltersCount}
        />

        {/* Mobile Filter Drawer - Lazy loaded */}
        {showMobileFilters && (
          <MobileFilterDrawer
            isOpen={showMobileFilters}
            onClose={() => setShowMobileFilters(false)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            onSubcategoryChange={setSelectedSubcategory}
            subcategories={subcategories}
            expandedCategory={expandedCategory}
            onToggleCategory={handleToggleCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
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
            onSearchChange={setSearchQuery}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            onSubcategoryChange={setSelectedSubcategory}
            subcategories={subcategories}
            expandedCategory={expandedCategory}
            onToggleCategory={handleToggleCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            showFeaturedOnly={showFeaturedOnly}
            onToggleFeatured={() => setShowFeaturedOnly(!showFeaturedOnly)}
            categorySearch={categorySearch}
            onCategorySearchChange={setCategorySearch}
            showAllCategories={showAllCategories}
            onToggleShowAll={() => setShowAllCategories(!showAllCategories)}
            displayedCategories={displayedCategories}
            hasMoreCategories={hasMoreCategories}
            getCategoryPostCount={getCategoryPostCount}
            totalPosts={totalPosts}
            isLoadingSubcategories={isLoadingSubcategories}
            onClearFilters={clearAllFilters}
            activeFiltersCount={activeFiltersCount}
          />

          <main className="flex-1">
            {/* Results header with per-page selector */}
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground">
                {isLoading
                  ? "Loading..."
                  : `${totalPosts} Blog${totalPosts !== 1 ? "s" : ""} found`}
                {totalPosts > 0 && ` (Page ${currentPage} of ${totalPages})`}
              </p>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="h-9 w-20 rounded-md border border-input bg-background px-2 py-1 text-sm"
                >
                  <option value={9}>9</option>
                  <option value={15}>15</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-muted-foreground">per page</span>
              </div>
            </div>

            <BlogGrid
              blogs={posts}
              isLoading={isLoading}
              onClearFilters={clearAllFilters}
            />

            {/* Pagination */}
            {totalPages > 1 && !isLoading && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-md border border-input bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, totalPages) },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        page === currentPage
                          ? "bg-primary text-primary-foreground"
                          : "border border-input bg-background hover:bg-accent"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  {totalPages > 5 && (
                    <span className="px-2 text-muted-foreground">...</span>
                  )}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <button
                      onClick={() => goToPage(totalPages)}
                      className="px-3 py-2 rounded-md border border-input bg-background hover:bg-accent text-sm font-medium"
                    >
                      {totalPages}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
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
