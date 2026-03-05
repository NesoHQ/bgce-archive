import React, { memo } from "react";
import { Search, X, Clock, Eye, Flame, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ApiCategory } from "@/types/blog.type";
import type { SortOption } from "./types";

interface BlogSidebarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    categories: ApiCategory[];
    selectedCategory: number | null;
    onCategoryChange: (categoryId: number | null) => void;
    selectedSubcategory: number | null;
    onSubcategoryChange: (subcategoryId: number | null) => void;
    subcategories: ApiCategory[];
    expandedCategory: number | null;
    onToggleCategory: (categoryId: number) => void;
    sortBy: SortOption;
    onSortChange: (sort: SortOption) => void;
    showFeaturedOnly: boolean;
    onToggleFeatured: () => void;
    categorySearch: string;
    onCategorySearchChange: (query: string) => void;
    showAllCategories: boolean;
    onToggleShowAll: () => void;
    displayedCategories: ApiCategory[];
    hasMoreCategories: boolean;
    getCategoryPostCount: (categoryId: number) => number;
    totalPosts: number;
    isLoadingSubcategories: boolean;
    onClearFilters: () => void;
    activeFiltersCount: number;
}

const sortOptions = [
    { value: "new" as const, label: "Newest", icon: Clock },
    { value: "views" as const, label: "Most Viewed", icon: Eye },
    { value: "featured" as const, label: "Featured First", icon: Flame },
];

export const BlogSidebar = memo(function BlogSidebar({
    searchQuery,
    onSearchChange,
    categories,
    selectedCategory,
    onCategoryChange,
    selectedSubcategory,
    onSubcategoryChange,
    subcategories,
    expandedCategory,
    onToggleCategory,
    sortBy,
    onSortChange,
    showFeaturedOnly,
    onToggleFeatured,
    categorySearch,
    onCategorySearchChange,
    showAllCategories,
    onToggleShowAll,
    displayedCategories,
    hasMoreCategories,
    getCategoryPostCount,
    totalPosts,
    isLoadingSubcategories,
    onClearFilters,
    activeFiltersCount,
}: BlogSidebarProps) {
    const getSelectedCategoryName = () => {
        if (!selectedCategory) return null;
        const category = categories.find(c => c.id === selectedCategory);
        return category?.label;
    };

    const getSelectedSubcategoryName = () => {
        if (!selectedSubcategory) return null;
        const subcategory = subcategories.find(s => s.id === selectedSubcategory);
        return subcategory?.label;
    };

    return (
        <aside className="hidden lg:block lg:w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-3">
                {/* Active Filter Breadcrumb */}
                {(selectedCategory || selectedSubcategory) && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-2 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center gap-1 text-[10px] mb-1.5">
                            <span className="text-muted-foreground">Filter:</span>
                            <span className="font-semibold text-primary truncate">
                                {getSelectedCategoryName()}
                                {selectedSubcategory && ` › ${getSelectedSubcategoryName()}`}
                            </span>
                        </div>
                        <button
                            onClick={onClearFilters}
                            className="text-[10px] text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
                        >
                            <X className="h-2.5 w-2.5" />
                            Clear (ESC)
                        </button>
                    </div>
                )}

                {/* Search */}
                <div className="bg-card border border-border rounded-lg p-2.5 hover:border-primary/30 transition-colors">
                    <label className="text-[10px] font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wider">
                        Search
                    </label>
                    <div className="relative group">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search blogs..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-7 h-7 text-xs border focus:border-primary transition-all"
                        />
                        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1 py-0.5 text-[8px] font-mono bg-muted rounded border border-border text-muted-foreground">
                            ⌘K
                        </kbd>
                    </div>
                </div>

                {/* Categories */}
                <div className="bg-card border border-border rounded-lg p-2.5 hover:border-primary/30 transition-colors">
                    <label className="text-[10px] font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wider">
                        Categories
                    </label>

                    {/* Category Search */}
                    {categories.length > 10 && (
                        <div className="relative mb-2 group">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Find..."
                                value={categorySearch}
                                onChange={(e) => onCategorySearchChange(e.target.value)}
                                className="pl-7 h-6 text-[10px] border focus:border-primary transition-all"
                            />
                            {categorySearch && (
                                <button
                                    onClick={() => onCategorySearchChange("")}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded transition-colors"
                                >
                                    <X className="h-2.5 w-2.5 text-muted-foreground" />
                                </button>
                            )}
                        </div>
                    )}

                    <div className="space-y-0.5 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                        {/* All Categories */}
                        <button
                            onClick={() => {
                                onCategoryChange(null);
                                onSubcategoryChange(null);
                            }}
                            className={`w-full text-left px-2 py-1.5 rounded text-xs font-medium transition-all flex items-center justify-between group ${!selectedCategory
                                ? "bg-primary text-white shadow-sm"
                                : "hover:bg-muted text-foreground"
                                }`}
                        >
                            <span>All Categories</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded ${!selectedCategory ? "bg-white/20" : "bg-muted group-hover:bg-muted-foreground/10"}`}>
                                {totalPosts}
                            </span>
                        </button>

                        {/* Category List */}
                        {displayedCategories.length > 0 ? (
                            displayedCategories.map((category) => {
                                const postCount = getCategoryPostCount(category.id);
                                return (
                                    <div key={category.id}>
                                        <button
                                            onClick={() => onToggleCategory(category.id)}
                                            className={`w-full text-left px-2 py-1.5 rounded text-xs font-medium transition-all flex items-center justify-between gap-1 group ${selectedCategory === category.id
                                                ? "bg-primary text-white shadow-sm"
                                                : "hover:bg-muted text-foreground"
                                                }`}
                                        >
                                            <span className="truncate flex-1">{category.label}</span>
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                {postCount > 0 && (
                                                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${selectedCategory === category.id ? "bg-white/20" : "bg-muted group-hover:bg-muted-foreground/10"}`}>
                                                        {postCount}
                                                    </span>
                                                )}
                                                {selectedCategory === category.id && subcategories.length > 0 && (
                                                    <ChevronDown className={`h-3 w-3 transition-transform ${expandedCategory === category.id ? 'rotate-180' : ''}`} />
                                                )}
                                            </div>
                                        </button>

                                        {/* Subcategories */}
                                        {selectedCategory === category.id && expandedCategory === category.id && (
                                            <div className="ml-3 mt-0.5 space-y-0.5 border-l border-primary/30 pl-2 animate-in slide-in-from-top-1 duration-150">
                                                {isLoadingSubcategories ? (
                                                    <div className="px-2 py-1.5 text-[10px] text-muted-foreground">
                                                        Loading...
                                                    </div>
                                                ) : subcategories.length > 0 ? (
                                                    subcategories.map((sub) => (
                                                        <button
                                                            key={sub.id}
                                                            onClick={() => onSubcategoryChange(sub.id)}
                                                            className={`w-full text-left px-2 py-1 rounded text-[11px] font-medium transition-all ${selectedSubcategory === sub.id
                                                                ? "bg-primary/90 text-white shadow-sm"
                                                                : "hover:bg-muted text-muted-foreground"
                                                                }`}
                                                        >
                                                            {sub.label}
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-2 py-1.5 text-[10px] text-muted-foreground">
                                                        No subcategories
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-[10px] text-muted-foreground">No categories found</p>
                            </div>
                        )}

                        {/* Show More/Less */}
                        {hasMoreCategories && (
                            <button
                                onClick={() => onToggleShowAll()}
                                className="w-full px-2 py-1.5 rounded text-[10px] font-medium bg-muted/50 hover:bg-muted text-foreground transition-all flex items-center justify-center gap-1"
                            >
                                <ChevronDown className="h-3 w-3" />
                                {categories.length - displayedCategories.length} more
                            </button>
                        )}
                        {showAllCategories && !categorySearch && (
                            <button
                                onClick={() => onToggleShowAll()}
                                className="w-full px-2 py-1.5 rounded text-[10px] font-medium bg-muted/50 hover:bg-muted text-foreground transition-all flex items-center justify-center gap-1"
                            >
                                <ChevronDown className="h-3 w-3 rotate-180" />
                                Show less
                            </button>
                        )}
                    </div>
                </div>

                {/* Sort By */}
                <div className="bg-card border border-border rounded-lg p-2.5 hover:border-primary/30 transition-colors">
                    <label className="text-[10px] font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wider">
                        Sort By
                    </label>
                    <div className="space-y-0.5">
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => onSortChange(option.value)}
                                className={`w-full text-left px-2 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${sortBy === option.value
                                    ? "bg-primary text-white shadow-sm"
                                    : "hover:bg-muted text-foreground"
                                    }`}
                            >
                                <option.icon className="h-3 w-3 flex-shrink-0" />
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Featured Filter Toggle */}
                    <div className="mt-2 pt-2 border-t border-border">
                        <button
                            onClick={onToggleFeatured}
                            className={`w-full text-left px-2 py-1.5 rounded text-xs font-medium transition-all flex items-center justify-between ${showFeaturedOnly
                                ? "bg-orange-500/10 text-orange-600 border border-orange-500/20"
                                : "hover:bg-muted text-foreground border border-transparent"
                                }`}
                        >
                            <div className="flex items-center gap-1.5">
                                <Flame className="h-3 w-3 flex-shrink-0" />
                                <span>Featured Only</span>
                            </div>
                            <div className={`w-7 h-3.5 rounded-full transition-all relative flex-shrink-0 ${showFeaturedOnly ? "bg-orange-500" : "bg-muted-foreground/30"}`}>
                                <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white shadow-sm transition-all duration-200 ${showFeaturedOnly ? "left-[14px]" : "left-0.5"}`} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
});
