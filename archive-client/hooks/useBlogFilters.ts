import { useState, useMemo, useEffect, useCallback, useTransition } from "react";
import type { SortOption } from "@/components/blogs/types";

export function useBlogFilters() {
    const [isPending, startTransition] = useTransition();

    // Filter state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);
    const [sortBy, setSortBy] = useState<SortOption>("new");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
    const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
    const [categorySearch, setCategorySearch] = useState("");
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
    const [showPinnedOnly, setShowPinnedOnly] = useState(false);

    // Debouncing search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleCategoryChange = useCallback((categoryId: number | null) => {
        startTransition(() => {
            setSelectedCategory(categoryId);
            setSelectedSubcategory(null);
            setCurrentPage(1);
        });
    }, []);

    const handleSubcategoryChange = useCallback((subcategoryId: number | null) => {
        startTransition(() => {
            setSelectedSubcategory(subcategoryId);
            setCurrentPage(1);
        });
    }, []);

    const handleSearchChange = useCallback((query: string) => {
        startTransition(() => {
            setSearchQuery(query);
            setCurrentPage(1);
        });
    }, []);

    const handleSortChange = useCallback((option: SortOption) => {
        startTransition(() => {
            setSortBy(option);
            setCurrentPage(1);
        });
    }, []);

    const handlePageSizeChange = useCallback((size: number) => {
        startTransition(() => {
            setPageSize(size);
            setCurrentPage(1);
        });
    }, []);

    const clearAllFilters = useCallback(() => {
        startTransition(() => {
            setSearchQuery("");
            setSelectedCategory(null);
            setSelectedSubcategory(null);
            setCategorySearch("");
            setShowAllCategories(false);
            setShowFeaturedOnly(false);
            setShowPinnedOnly(false);
            setCurrentPage(1);
        });
    }, []);

    const handleToggleCategory = useCallback((categoryId: number) => {
        startTransition(() => {
            if (selectedCategory === categoryId) {
                setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
            } else {
                handleCategoryChange(categoryId);
                setExpandedCategory(categoryId);
            }
        });
    }, [selectedCategory, handleCategoryChange]);

    const goToPage = useCallback((page: number, totalPages: number) => {
        if (page >= 1 && page <= totalPages) {
            startTransition(() => setCurrentPage(page));
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, []);

    const postFilters = useMemo(() => {
        const filters: any = {
            limit: pageSize,
            offset: (currentPage - 1) * pageSize,
        };

        if (selectedCategory) filters.category_id = selectedCategory;
        if (selectedSubcategory) filters.sub_category_id = selectedSubcategory;
        if (debouncedSearch) filters.search = debouncedSearch;
        if (showFeaturedOnly) filters.is_featured = true;
        if (showPinnedOnly) filters.is_pinned = true;

        if (sortBy === "new") {
            filters.sort_by = "created_at";
            filters.sort_order = "DESC";
        } else if (sortBy === "views") {
            filters.sort_by = "view_count";
            filters.sort_order = "DESC";
        } else if (sortBy === "featured") {
            filters.is_featured = true;
            filters.sort_by = "created_at";
            filters.sort_order = "DESC";
        }

        return filters;
    }, [currentPage, pageSize, selectedCategory, selectedSubcategory, debouncedSearch, showFeaturedOnly, showPinnedOnly, sortBy]);

    const activeFiltersCount = useMemo(() =>
        [searchQuery, selectedCategory, selectedSubcategory, showFeaturedOnly, showPinnedOnly].filter(Boolean).length,
        [searchQuery, selectedCategory, selectedSubcategory, showFeaturedOnly, showPinnedOnly]
    );

    return {
        // State
        currentPage,
        pageSize,
        sortBy,
        searchQuery,
        debouncedSearch,
        selectedCategory,
        selectedSubcategory,
        expandedCategory,
        categorySearch,
        showAllCategories,
        showFeaturedOnly,
        showPinnedOnly,
        isPending,
        postFilters,
        activeFiltersCount,

        // Setters
        setCategorySearch,
        setShowAllCategories,
        setShowFeaturedOnly,
        setShowPinnedOnly,
        setCurrentPage,
        setExpandedCategory,

        // Handlers
        handleCategoryChange,
        handleSubcategoryChange,
        handleSearchChange,
        handleSortChange,
        handlePageSizeChange,
        clearAllFilters,
        handleToggleCategory,
        goToPage,
    };
}
