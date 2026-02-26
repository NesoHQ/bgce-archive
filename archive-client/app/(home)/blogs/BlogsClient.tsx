"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Eye, TrendingUp, Clock, BookOpen, Search, X, SlidersHorizontal, Flame, Sparkles, FolderTree, ChevronDown, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Portal } from "@/components/ui/Portal";
import type { ApiPost, ApiCategory } from "@/types/blog.type";
import { getPosts, getSubcategories } from "@/lib/api";

type SortOption = "new" | "views" | "featured";

interface BlogsClientProps {
    initialPosts: ApiPost[];
    categories: ApiCategory[];
}

export default function BlogsClient({ initialPosts, categories }: BlogsClientProps) {
    const [posts, setPosts] = useState<ApiPost[]>(initialPosts);
    const [sortBy, setSortBy] = useState<SortOption>("new");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
    const [subcategories, setSubcategories] = useState<ApiCategory[]>([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
    const [categorySearch, setCategorySearch] = useState("");
    const [showAllCategories, setShowAllCategories] = useState(false);

    // Fetch subcategories when category is selected
    useEffect(() => {
        if (selectedCategory) {
            const category = categories.find(c => c.id === selectedCategory);
            if (category?.uuid) {
                getSubcategories(category.uuid).then(setSubcategories);
            }
        } else {
            setSubcategories([]);
            setSelectedSubcategory(null);
        }
    }, [selectedCategory, categories]);

    // Fetch posts when filters change
    useEffect(() => {
        const fetchFilteredPosts = async () => {
            setIsLoading(true);
            try {
                const params: any = { limit: 100 };
                if (selectedCategory) params.category_id = selectedCategory;
                if (selectedSubcategory) params.sub_category_id = selectedSubcategory;

                const fetchedPosts = await getPosts(params);
                setPosts(fetchedPosts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFilteredPosts();
    }, [selectedCategory, selectedSubcategory]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (showMobileFilters) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showMobileFilters]);

    const filteredBlogs = posts
        .filter((post) => {
            if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !post.summary?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "new":
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case "views":
                    return b.view_count - a.view_count;
                case "featured":
                    if (a.is_featured && !b.is_featured) return -1;
                    if (!a.is_featured && b.is_featured) return 1;
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                default:
                    return 0;
            }
        });

    const activeFiltersCount = [searchQuery, selectedCategory, selectedSubcategory].filter(Boolean).length;

    // Filter categories based on search
    const filteredCategories = useMemo(() => {
        if (!categorySearch) return categories;
        return categories.filter(cat =>
            cat.label.toLowerCase().includes(categorySearch.toLowerCase())
        );
    }, [categories, categorySearch]);

    // Show only top 5 categories initially, unless searching or "show all" is clicked
    const displayedCategories = useMemo(() => {
        if (categorySearch || showAllCategories) return filteredCategories;
        return filteredCategories.slice(0, 5);
    }, [filteredCategories, categorySearch, showAllCategories]);

    const hasMoreCategories = filteredCategories.length > 5 && !showAllCategories && !categorySearch;

    const getAuthorInitials = (userId: number) => `U${userId}`;
    const getAuthorColor = (userId: number) => {
        const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-red-500", "bg-yellow-500", "bg-pink-500"];
        return colors[userId % colors.length];
    };

    const calculateReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min`;
    };

    const getTags = (keywords?: string) => {
        if (!keywords) return [];
        return keywords.split(',').map(k => k.trim()).slice(0, 2);
    };

    const clearAllFilters = () => {
        setSearchQuery("");
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setCategorySearch("");
        setShowAllCategories(false);
    };

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
        <div className="min-h-screen">
            {/* Header */}
            <section className="py-4 border-b border-border/50 bg-gradient-to-b from-background to-muted/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 rounded-lg bg-primary/10 dark:bg-primary/20">
                            <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <h1 className="text-xl font-bold text-foreground">Community Blogs</h1>
                    </div>
                    <p className="text-xs text-muted-foreground">Insights, tutorials, and stories from our community</p>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Mobile Filter Button */}
                <div className="lg:hidden mb-4">
                    <Button
                        onClick={() => setShowMobileFilters(true)}
                        variant="outline"
                        className="w-full h-10 border-2 font-bold"
                    >
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filters & Search
                        {activeFiltersCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-white text-xs">
                                {activeFiltersCount}
                            </span>
                        )}
                    </Button>
                </div>

                {/* Mobile Filter Drawer */}
                {showMobileFilters && (
                    <Portal>
                        <div
                            data-mobile-drawer="true"
                            className="fixed inset-0 lg:hidden"
                            style={{ zIndex: 2147483646 }}
                        >
                            <div
                                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                                onClick={() => setShowMobileFilters(false)}
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-card border-t-2 border-border rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
                                <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between z-10">
                                    <div className="flex items-center gap-2">
                                        <SlidersHorizontal className="h-5 w-5 text-primary" />
                                        <h2 className="text-lg font-bold text-foreground">Filters & Search</h2>
                                    </div>
                                    <button onClick={() => setShowMobileFilters(false)} className="p-2 rounded-lg hover:bg-accent transition-colors">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div>
                                        <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                                            <Search className="h-3.5 w-3.5" />
                                            Search Blogs
                                        </label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search blogs..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 h-11 text-base border-2"
                                            />
                                        </div>
                                    </div>

                                    {/* Category Filter Mobile */}
                                    <div>
                                        <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                                            <FolderTree className="h-3.5 w-3.5" />
                                            Category
                                        </label>
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory(null);
                                                    setSelectedSubcategory(null);
                                                }}
                                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold transition-all border-2 ${!selectedCategory
                                                    ? "bg-primary text-white border-primary shadow-md"
                                                    : "bg-card/50 border-border hover:border-primary/50 text-foreground"
                                                    }`}
                                            >
                                                All Categories
                                            </button>
                                            {categories.map((category) => (
                                                <div key={category.id}>
                                                    <button
                                                        onClick={() => {
                                                            if (selectedCategory === category.id) {
                                                                setExpandedCategory(expandedCategory === category.id ? null : category.id);
                                                            } else {
                                                                setSelectedCategory(category.id);
                                                                setExpandedCategory(category.id);
                                                                setSelectedSubcategory(null);
                                                            }
                                                        }}
                                                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold transition-all border-2 flex items-center justify-between ${selectedCategory === category.id
                                                            ? "bg-primary text-white border-primary shadow-md"
                                                            : "bg-card/50 border-border hover:border-primary/50 text-foreground"
                                                            }`}
                                                    >
                                                        <span>{category.label}</span>
                                                        {selectedCategory === category.id && subcategories.length > 0 && (
                                                            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCategory === category.id ? 'rotate-180' : ''}`} />
                                                        )}
                                                    </button>
                                                    {selectedCategory === category.id && expandedCategory === category.id && subcategories.length > 0 && (
                                                        <div className="ml-4 mt-2 space-y-2 border-l-2 border-primary/30 pl-3">
                                                            {subcategories.map((sub) => (
                                                                <button
                                                                    key={sub.id}
                                                                    onClick={() => setSelectedSubcategory(sub.id)}
                                                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-all border ${selectedSubcategory === sub.id
                                                                        ? "bg-primary/80 text-white border-primary shadow-sm"
                                                                        : "bg-card/30 border-border/50 hover:border-primary/50 text-foreground"
                                                                        }`}
                                                                >
                                                                    {sub.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-foreground mb-2 block uppercase tracking-wide">Sort By</label>
                                        <div className="space-y-2">
                                            {[
                                                { value: "new", label: "Newest", icon: Clock },
                                                { value: "views", label: "Most Viewed", icon: Eye },
                                                { value: "featured", label: "Featured", icon: Flame },
                                            ].map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => setSortBy(option.value as SortOption)}
                                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold transition-all border-2 flex items-center gap-2 ${sortBy === option.value
                                                        ? "bg-primary text-white border-primary shadow-md"
                                                        : "bg-card/50 border-border hover:border-primary/50 text-foreground"
                                                        }`}
                                                >
                                                    <option.icon className="h-4 w-4" />
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        {activeFiltersCount > 0 && (
                                            <Button variant="outline" onClick={clearAllFilters} className="flex-1 h-11 text-sm font-bold border-2">
                                                <X className="h-4 w-4 mr-2" />
                                                Clear All
                                            </Button>
                                        )}
                                        <Button onClick={() => setShowMobileFilters(false)} className="flex-1 h-11 text-sm font-bold bg-primary">
                                            Show {filteredBlogs.length} Blog{filteredBlogs.length !== 1 ? 's' : ''}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Portal>
                )}

                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Desktop Filters Sidebar - Scalable Design */}
                    <aside className="hidden lg:block lg:w-64 flex-shrink-0">
                        <div className="sticky top-24 space-y-4">
                            {/* Active Filter Breadcrumb */}
                            {(selectedCategory || selectedSubcategory) && (
                                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-3 shadow-sm">
                                    <div className="flex items-center gap-1.5 text-xs flex-wrap">
                                        <span className="text-muted-foreground font-medium">Filtered by:</span>
                                        <div className="flex items-center gap-1 flex-wrap">
                                            {selectedCategory && (
                                                <>
                                                    <span className="font-bold text-primary">{getSelectedCategoryName()}</span>
                                                    {selectedSubcategory && (
                                                        <>
                                                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                                            <span className="font-bold text-primary">{getSelectedSubcategoryName()}</span>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearAllFilters}
                                        className="w-full mt-2 h-7 text-xs font-semibold hover:bg-primary/10"
                                    >
                                        <X className="h-3 w-3 mr-1" />
                                        Clear Filters
                                    </Button>
                                </div>
                            )}

                            {/* Search Card */}
                            <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                <label className="text-xs font-bold text-foreground mb-2 flex items-center gap-2 uppercase tracking-wide">
                                    <div className="p-1.5 bg-primary/10 rounded-lg">
                                        <Search className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    Search Blogs
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by title..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 h-10 text-sm border-2 focus:border-primary transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Category Filter Card - Scalable */}
                            <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                <label className="text-xs font-bold text-foreground mb-3 flex items-center gap-2 uppercase tracking-wide">
                                    <div className="p-1.5 bg-primary/10 rounded-lg">
                                        <FolderTree className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    Categories
                                </label>

                                {/* Category Search - Only show if more than 10 categories */}
                                {categories.length > 10 && (
                                    <div className="relative mb-3">
                                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                        <Input
                                            placeholder="Find category..."
                                            value={categorySearch}
                                            onChange={(e) => setCategorySearch(e.target.value)}
                                            className="pl-8 h-8 text-xs border focus:border-primary transition-colors"
                                        />
                                        {categorySearch && (
                                            <button
                                                onClick={() => setCategorySearch("")}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded"
                                            >
                                                <X className="h-3 w-3 text-muted-foreground" />
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                                    {/* All Categories Option */}
                                    <button
                                        onClick={() => {
                                            setSelectedCategory(null);
                                            setSelectedSubcategory(null);
                                            setExpandedCategory(null);
                                        }}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-all border-2 flex items-center gap-2 ${!selectedCategory
                                            ? "bg-gradient-to-r from-primary to-primary/90 text-white border-primary shadow-md"
                                            : "bg-muted/30 border-border hover:border-primary/50 hover:bg-muted/50 text-foreground"
                                            }`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${!selectedCategory ? 'bg-white' : 'bg-primary'}`} />
                                        All Categories
                                    </button>

                                    {/* Category List */}
                                    {displayedCategories.length > 0 ? (
                                        displayedCategories.map((category) => (
                                            <div key={category.id} className="space-y-1">
                                                <button
                                                    onClick={() => {
                                                        if (selectedCategory === category.id) {
                                                            setExpandedCategory(expandedCategory === category.id ? null : category.id);
                                                        } else {
                                                            setSelectedCategory(category.id);
                                                            setExpandedCategory(category.id);
                                                            setSelectedSubcategory(null);
                                                        }
                                                    }}
                                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-all border-2 flex items-center justify-between gap-2 ${selectedCategory === category.id
                                                        ? "bg-gradient-to-r from-primary to-primary/90 text-white border-primary shadow-md"
                                                        : "bg-muted/30 border-border hover:border-primary/50 hover:bg-muted/50 text-foreground"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${selectedCategory === category.id ? 'bg-white' : 'bg-primary'}`} />
                                                        <span className="truncate">{category.label}</span>
                                                    </div>
                                                    {selectedCategory === category.id && subcategories.length > 0 && (
                                                        <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${expandedCategory === category.id ? 'rotate-180' : ''}`} />
                                                    )}
                                                </button>

                                                {/* Subcategories */}
                                                {selectedCategory === category.id && expandedCategory === category.id && subcategories.length > 0 && (
                                                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary/30 pl-3 animate-in slide-in-from-top-2 duration-200">
                                                        {subcategories.map((sub) => (
                                                            <button
                                                                key={sub.id}
                                                                onClick={() => setSelectedSubcategory(sub.id)}
                                                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all border flex items-center gap-2 ${selectedSubcategory === sub.id
                                                                    ? "bg-gradient-to-r from-primary/90 to-primary/80 text-white border-primary/50 shadow-sm"
                                                                    : "bg-muted/20 border-border/50 hover:border-primary/40 hover:bg-muted/40 text-foreground"
                                                                    }`}
                                                            >
                                                                <div className={`w-1 h-1 rounded-full flex-shrink-0 ${selectedSubcategory === sub.id ? 'bg-white' : 'bg-primary/60'}`} />
                                                                <span className="truncate">{sub.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-xs text-muted-foreground">No categories found</p>
                                        </div>
                                    )}

                                    {/* Show More/Less Button */}
                                    {hasMoreCategories && (
                                        <button
                                            onClick={() => setShowAllCategories(true)}
                                            className="w-full px-3 py-2 rounded-lg text-xs font-semibold bg-muted/30 border border-border hover:border-primary/50 hover:bg-muted/50 text-foreground transition-all flex items-center justify-center gap-2"
                                        >
                                            <ChevronDown className="h-3.5 w-3.5" />
                                            Show {filteredCategories.length - 5} More
                                        </button>
                                    )}
                                    {showAllCategories && !categorySearch && (
                                        <button
                                            onClick={() => setShowAllCategories(false)}
                                            className="w-full px-3 py-2 rounded-lg text-xs font-semibold bg-muted/30 border border-border hover:border-primary/50 hover:bg-muted/50 text-foreground transition-all flex items-center justify-center gap-2"
                                        >
                                            <ChevronDown className="h-3.5 w-3.5 rotate-180" />
                                            Show Less
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Sort By Card */}
                            <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-4 shadow-sm">
                                <label className="text-xs font-bold text-foreground mb-3 flex items-center gap-2 uppercase tracking-wide">
                                    <div className="p-1.5 bg-primary/10 rounded-lg">
                                        <TrendingUp className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    Sort By
                                </label>
                                <div className="space-y-2">
                                    {[
                                        { value: "new", label: "Newest First", icon: Clock },
                                        { value: "views", label: "Most Viewed", icon: Eye },
                                        { value: "featured", label: "Featured", icon: Flame },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setSortBy(option.value as SortOption)}
                                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-all border-2 flex items-center gap-2 ${sortBy === option.value
                                                ? "bg-gradient-to-r from-primary to-primary/90 text-white border-primary shadow-md"
                                                : "bg-muted/30 border-border hover:border-primary/50 hover:bg-muted/50 text-foreground"
                                                }`}
                                        >
                                            <option.icon className="h-4 w-4 flex-shrink-0" />
                                            <span>{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Active Filters Summary */}
                            {activeFiltersCount > 0 && (
                                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                                            Active Filters
                                        </span>
                                        <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                                            {activeFiltersCount}
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={clearAllFilters}
                                        className="w-full h-9 text-sm font-semibold border-2 border-primary/50 hover:bg-primary hover:text-white hover:border-primary transition-all"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Clear All Filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs font-bold text-foreground">
                                {isLoading ? "Loading..." : `${filteredBlogs.length} Blog${filteredBlogs.length !== 1 ? 's' : ''}`}
                            </p>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                                <p className="mt-4 text-sm text-muted-foreground">Loading blogs...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                                {filteredBlogs.map((blog) => (
                                    <Link
                                        key={blog.id}
                                        href={`/blogs/${blog.slug}`}
                                        className="group relative bg-gradient-to-br from-card via-card/95 to-card/80 border border-border backdrop-blur-sm rounded-lg overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300 hover:-translate-y-0.5 p-3 sm:p-4"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex flex-wrap gap-1.5">
                                                {getTags(blog.keywords).map((tag) => (
                                                    <span key={tag} className="text-[9px] font-mono font-bold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                            {blog.is_featured && (
                                                <span className="flex items-center gap-0.5 px-1.5 py-1 rounded bg-orange-500/10 text-orange-600 border border-orange-500/20 text-[8px] font-black leading-none">
                                                    <Flame className="h-2 w-2" />
                                                    HOT
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-sm sm:text-base font-black text-foreground mb-2 group-hover:text-primary transition-all line-clamp-2 leading-tight">
                                            {blog.title}
                                        </h2>

                                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                                            {blog.summary || blog.meta_description || "No description available"}
                                        </p>

                                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
                                            <Avatar className="h-5 w-5 border border-border">
                                                <AvatarFallback className={`${getAuthorColor(blog.created_by)} text-white text-[8px]`}>
                                                    {getAuthorInitials(blog.created_by)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-semibold text-foreground truncate">User {blog.created_by}</p>
                                                <p className="text-[8px] text-muted-foreground">
                                                    {new Date(blog.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                </p>
                                            </div>
                                            <span className="text-[9px] text-muted-foreground font-bold">{calculateReadTime(blog.content)}</span>
                                        </div>

                                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Eye className="h-2.5 w-2.5" />
                                                {blog.view_count >= 1000 ? `${(blog.view_count / 1000).toFixed(1)}K` : blog.view_count}
                                            </span>
                                            {blog.is_pinned && (
                                                <span className="ml-auto flex items-center gap-1 text-primary font-bold">
                                                    <Sparkles className="h-2.5 w-2.5" />
                                                    Pinned
                                                </span>
                                            )}
                                        </div>

                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent"></div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && filteredBlogs.length === 0 && (
                            <div className="text-center py-12 px-4">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                                    <Search className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-base font-bold text-foreground mb-1.5">No blogs found</h3>
                                <p className="text-xs text-muted-foreground mb-3">Try adjusting your filters or search query</p>
                                <Button variant="outline" size="sm" onClick={clearAllFilters} className="border-2">
                                    <X className="h-3 w-3 mr-1.5" />
                                    Clear All Filters
                                </Button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
