"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Clock, Download, Eye, Search, Filter, X, SlidersHorizontal, Star, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Portal } from "@/components/ui/Portal";

type SortOption = "popular" | "downloads" | "recent";

export default function CheatsheetPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("popular");
    const [showMobileFilters, setShowMobileFilters] = useState(false);

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

    const categories = ["Programming", "DevOps", "Cloud", "Database", "Tools"];
    const popularTags = ["Go", "Kubernetes", "Docker", "AWS", "Git", "SQL", "Linux", "Python"];

    const cheatsheets = [
        {
            id: 1,
            title: "Go Programming Essentials",
            description: "Quick reference for Go syntax, data structures, and common patterns",
            category: "Programming",
            tags: ["Go", "Programming"],
            readTime: "5 min",
            downloads: 12500,
            views: 45000,
            color: "from-blue-500/20 to-blue-600/20",
            isPopular: true,
            rating: 4.8,
        },
        {
            id: 2,
            title: "Kubernetes Commands",
            description: "Essential kubectl commands and Kubernetes resource management",
            category: "DevOps",
            tags: ["Kubernetes", "DevOps"],
            readTime: "8 min",
            downloads: 8900,
            views: 32000,
            color: "from-purple-500/20 to-purple-600/20",
            isPopular: true,
            rating: 4.7,
        },
        {
            id: 3,
            title: "Docker Quick Reference",
            description: "Docker commands, Dockerfile best practices, and container management",
            category: "DevOps",
            tags: ["Docker", "DevOps"],
            readTime: "6 min",
            downloads: 15200,
            views: 52000,
            color: "from-cyan-500/20 to-cyan-600/20",
            isPopular: true,
            rating: 4.9,
        },
        {
            id: 4,
            title: "AWS Services Overview",
            description: "Comprehensive guide to AWS services, pricing, and use cases",
            category: "Cloud",
            tags: ["AWS", "Cloud"],
            readTime: "12 min",
            downloads: 10300,
            views: 38000,
            color: "from-orange-500/20 to-orange-600/20",
            isPopular: false,
            rating: 4.6,
        },
        {
            id: 5,
            title: "Git Commands Cheatsheet",
            description: "Git workflow, branching strategies, and essential commands",
            category: "Tools",
            tags: ["Git", "Tools"],
            readTime: "7 min",
            downloads: 18700,
            views: 67000,
            color: "from-red-500/20 to-red-600/20",
            isPopular: true,
            rating: 4.9,
        },
        {
            id: 6,
            title: "SQL Query Reference",
            description: "SQL syntax, joins, aggregations, and optimization techniques",
            category: "Database",
            tags: ["SQL", "Database"],
            readTime: "10 min",
            downloads: 13400,
            views: 48000,
            color: "from-green-500/20 to-green-600/20",
            isPopular: true,
            rating: 4.7,
        },
        {
            id: 7,
            title: "Linux Command Line",
            description: "Essential Linux commands, file operations, and system administration",
            category: "Tools",
            tags: ["Linux", "Tools"],
            readTime: "9 min",
            downloads: 11200,
            views: 41000,
            color: "from-yellow-500/20 to-yellow-600/20",
            isPopular: false,
            rating: 4.5,
        },
        {
            id: 8,
            title: "Python Quick Reference",
            description: "Python syntax, data structures, and standard library essentials",
            category: "Programming",
            tags: ["Python", "Programming"],
            readTime: "8 min",
            downloads: 16800,
            views: 59000,
            color: "from-indigo-500/20 to-indigo-600/20",
            isPopular: true,
            rating: 4.8,
        },
    ];

    const filteredCheatsheets = cheatsheets
        .filter((sheet) => {
            if (selectedCategory && sheet.category !== selectedCategory) return false;
            if (selectedTag && !sheet.tags.includes(selectedTag)) return false;
            if (searchQuery && !sheet.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !sheet.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "popular":
                    return b.views - a.views;
                case "downloads":
                    return b.downloads - a.downloads;
                case "recent":
                    return b.id - a.id;
                default:
                    return 0;
            }
        });

    const activeFiltersCount = [selectedCategory, selectedTag, searchQuery].filter(Boolean).length;

    return (
        <div className="min-h-screen">
            {/* Compact Header */}
            <section className="py-4 border-b border-border/50 bg-gradient-to-b from-background to-muted/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 rounded-lg bg-primary/10 dark:bg-primary/20">
                            <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <h1 className="text-xl font-bold text-foreground">Cheatsheets</h1>
                    </div>
                    <p className="text-xs text-muted-foreground">Quick reference guides for developers</p>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Mobile Filter Button */}
                <div className="lg:hidden mb-4">
                    <Button
                        onClick={() => setShowMobileFilters(true)}
                        variant="outline"
                        className="w-full h-10 border-2 dark:border-input dark:hover:border-[oklch(0.75_0.22_260)] dark:hover:bg-[oklch(0.28_0.06_260)] dark:hover:text-[oklch(0.85_0.28_260)] font-bold"
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
                            <div className="absolute inset-x-0 bottom-0 bg-card border-t-2 border-border dark:border-input rounded-t-2xl shadow-2xl max-h-[70vh] overflow-y-auto">
                                <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border dark:border-input p-4 flex items-center justify-between z-10">
                                    <div className="flex items-center gap-2">
                                        <SlidersHorizontal className="h-5 w-5 text-primary" />
                                        <h2 className="text-lg font-bold text-foreground">Filters & Search</h2>
                                    </div>
                                    <button
                                        onClick={() => setShowMobileFilters(false)}
                                        className="p-2 rounded-lg hover:bg-accent dark:hover:bg-accent/50 transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div>
                                        <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                                            <Search className="h-3.5 w-3.5" />
                                            Search Cheatsheets
                                        </label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search cheatsheets..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 h-11 text-base border-2 dark:bg-input/30 dark:border-input dark:hover:border-primary/50 dark:focus:border-primary transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-foreground mb-2 block uppercase tracking-wide">Sort By</label>
                                        <div className="space-y-2">
                                            {[
                                                { value: "popular", label: "Most Popular", icon: TrendingUp },
                                                { value: "downloads", label: "Most Downloaded", icon: Download },
                                                { value: "recent", label: "Recently Added", icon: Clock },
                                            ].map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => setSortBy(option.value as SortOption)}
                                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold transition-all border-2 flex items-center gap-2 ${sortBy === option.value
                                                        ? "bg-primary text-white dark:text-white border-primary shadow-md dark:shadow-[0_0_12px_oklch(0.65_0.18_260/0.3)]"
                                                        : "bg-card/50 dark:bg-card/30 border-border dark:border-input hover:border-primary/50 dark:hover:border-[oklch(0.75_0.22_260)] hover:bg-accent dark:hover:bg-[oklch(0.28_0.06_260)] text-foreground dark:hover:text-[oklch(0.85_0.28_260)]"
                                                        }`}
                                                >
                                                    <option.icon className="h-4 w-4" />
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-foreground mb-2 block uppercase tracking-wide">Category</label>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                                                    className={`px-3 py-2 rounded-full text-xs font-bold transition-all border-2 ${selectedCategory === cat
                                                        ? "bg-primary text-white dark:text-white border-primary shadow-md dark:shadow-[0_0_8px_oklch(0.65_0.18_260/0.3)]"
                                                        : "bg-card/50 dark:bg-card/30 border-border dark:border-input hover:border-primary/50 dark:hover:border-[oklch(0.75_0.22_260)] hover:bg-accent dark:hover:bg-[oklch(0.28_0.06_260)] text-foreground dark:hover:text-[oklch(0.85_0.28_260)]"
                                                        }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-foreground mb-2 block uppercase tracking-wide">Popular Tags</label>
                                        <div className="flex flex-wrap gap-2">
                                            {popularTags.map((tag) => (
                                                <button
                                                    key={tag}
                                                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                                    className={`px-3 py-2 rounded-full text-xs font-bold transition-all border-2 ${selectedTag === tag
                                                        ? "bg-primary text-white dark:text-white border-primary shadow-md dark:shadow-[0_0_8px_oklch(0.65_0.18_260/0.3)]"
                                                        : "bg-card/50 dark:bg-card/30 border-border dark:border-input hover:border-primary/50 dark:hover:border-[oklch(0.75_0.22_260)] hover:bg-accent dark:hover:bg-[oklch(0.28_0.06_260)] text-foreground dark:hover:text-[oklch(0.85_0.28_260)]"
                                                        }`}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        {activeFiltersCount > 0 && (
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedCategory(null);
                                                    setSelectedTag(null);
                                                    setSearchQuery("");
                                                }}
                                                className="flex-1 h-11 text-sm font-bold border-2 dark:border-input dark:hover:border-[oklch(0.75_0.22_260)] dark:hover:bg-[oklch(0.28_0.06_260)] dark:hover:text-[oklch(0.85_0.28_260)]"
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                Clear All
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() => setShowMobileFilters(false)}
                                            className="flex-1 h-11 text-sm font-bold bg-gradient-to-r from-[oklch(0.4_0.14_260)] to-[oklch(0.35_0.12_260)] hover:from-[oklch(0.45_0.16_260)] hover:to-[oklch(0.4_0.14_260)] dark:from-[oklch(0.65_0.18_260)] dark:to-[oklch(0.6_0.16_260)] dark:hover:from-[oklch(0.75_0.22_260)] dark:hover:to-[oklch(0.7_0.2_260)] text-white dark:text-white"
                                        >
                                            Show {filteredCheatsheets.length} Result{filteredCheatsheets.length !== 1 ? 's' : ''}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Portal>
                )}

                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Desktop Filters Sidebar */}
                    <aside className="hidden lg:block lg:w-48 flex-shrink-0">
                        <div className="sticky top-20 space-y-3">
                            <div>
                                <label className="text-[10px] font-bold text-foreground mb-1 flex items-center gap-1 uppercase tracking-wide">
                                    <Search className="h-2.5 w-2.5" />
                                    Search
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                    <Input
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-7 h-7 text-xs border-2 dark:bg-input/30 dark:border-input dark:hover:border-primary/50 dark:focus:border-primary transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-foreground mb-1 block uppercase tracking-wide">Sort By</label>
                                <div className="space-y-1">
                                    {[
                                        { value: "popular", label: "Popular", icon: TrendingUp },
                                        { value: "downloads", label: "Downloads", icon: Download },
                                        { value: "recent", label: "Recent", icon: Clock },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setSortBy(option.value as SortOption)}
                                            className={`w-full text-left px-2 py-1 rounded-md text-[10px] font-bold transition-all border-2 flex items-center gap-1.5 ${sortBy === option.value
                                                ? "bg-primary text-white dark:text-white border-primary shadow-md dark:shadow-[0_0_12px_oklch(0.65_0.18_260/0.3)]"
                                                : "bg-card/50 dark:bg-card/30 border-border dark:border-input hover:border-primary/50 dark:hover:border-[oklch(0.75_0.22_260)] hover:bg-accent dark:hover:bg-[oklch(0.28_0.06_260)] text-foreground dark:hover:text-[oklch(0.85_0.28_260)]"
                                                }`}
                                        >
                                            <option.icon className="h-2.5 w-2.5" />
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-foreground mb-1 block uppercase tracking-wide">Category</label>
                                <div className="flex flex-wrap gap-1">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                                            className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold transition-all border ${selectedCategory === cat
                                                ? "bg-primary text-white dark:text-white border-primary shadow-md dark:shadow-[0_0_8px_oklch(0.65_0.18_260/0.3)]"
                                                : "bg-card/50 dark:bg-card/30 border-border dark:border-input hover:border-primary/50 dark:hover:border-[oklch(0.75_0.22_260)] hover:bg-accent dark:hover:bg-[oklch(0.28_0.06_260)] text-foreground dark:hover:text-[oklch(0.85_0.28_260)]"
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-foreground mb-1 block uppercase tracking-wide">Tags</label>
                                <div className="flex flex-wrap gap-1">
                                    {popularTags.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                            className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold transition-all border ${selectedTag === tag
                                                ? "bg-primary text-white dark:text-white border-primary shadow-md dark:shadow-[0_0_8px_oklch(0.65_0.18_260/0.3)]"
                                                : "bg-card/50 dark:bg-card/30 border-border dark:border-input hover:border-primary/50 dark:hover:border-[oklch(0.75_0.22_260)] hover:bg-accent dark:hover:bg-[oklch(0.28_0.06_260)] text-foreground dark:hover:text-[oklch(0.85_0.28_260)]"
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {activeFiltersCount > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        setSelectedTag(null);
                                        setSearchQuery("");
                                    }}
                                    className="w-full h-7 text-[10px] font-bold border-2 dark:border-input dark:hover:border-[oklch(0.75_0.22_260)] dark:hover:bg-[oklch(0.28_0.06_260)] dark:hover:text-[oklch(0.85_0.28_260)]"
                                >
                                    <X className="h-2.5 w-2.5 mr-1" />
                                    Clear ({activeFiltersCount})
                                </Button>
                            )}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs font-bold text-foreground">
                                {filteredCheatsheets.length} Cheatsheet{filteredCheatsheets.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-2.5 md:gap-3">
                            {filteredCheatsheets.map((sheet) => (
                                <Link
                                    key={sheet.id}
                                    href={`/resources/cheatsheet/${sheet.id}`}
                                    className="group relative bg-gradient-to-br from-card via-card/95 to-card/80 dark:from-card dark:via-card/95 dark:to-card/50 border border-border dark:border-input backdrop-blur-sm rounded-lg overflow-hidden hover:shadow-lg dark:hover:shadow-[0_4px_20px_oklch(0.65_0.18_260/0.3)] hover:border-primary/50 dark:hover:border-[oklch(0.75_0.22_260)] transition-all duration-300 hover:-translate-y-1 active:scale-95"
                                >
                                    {/* Compact Icon Header */}
                                    <div className="relative aspect-[5/2] bg-gradient-to-br from-primary/25 via-primary/15 to-primary/5 dark:from-primary/35 dark:via-primary/20 dark:to-primary/5 flex items-center justify-center border-b border-border dark:border-input group-hover:border-primary/40 transition-colors">
                                        <FileText className="h-8 w-8 text-primary" />

                                        {/* Floating Badges */}
                                        <div className="absolute top-1.5 left-1.5 flex flex-wrap gap-1">
                                            {sheet.isPopular && (
                                                <span className="px-1.5 py-1 rounded bg-primary/90 dark:bg-primary/80 text-white text-[8px] font-black flex items-center gap-0.5 shadow-sm backdrop-blur-sm leading-none">
                                                    <Sparkles className="h-2 w-2" />
                                                    POPULAR
                                                </span>
                                            )}
                                        </div>

                                        {/* Rating Badge */}
                                        <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 px-1.5 py-1 rounded bg-card/90 dark:bg-card/80 border border-border/50 dark:border-input/50 shadow-sm backdrop-blur-sm">
                                            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                                            <span className="text-[8px] font-black text-foreground leading-none">{sheet.rating}</span>
                                        </div>
                                    </div>

                                    <div className="p-2.5 sm:p-3">
                                        {/* Category Badge */}
                                        <div className="mb-1.5">
                                            <span className="inline-block px-1.5 py-0.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-[9px] font-bold uppercase tracking-wide">
                                                {sheet.category}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-sm sm:text-base font-black text-foreground mb-1.5 group-hover:text-primary dark:group-hover:text-[oklch(0.85_0.28_260)] dark:group-hover:drop-shadow-[0_0_8px_oklch(0.65_0.18_260/0.3)] transition-all line-clamp-2 leading-tight tracking-tight">
                                            {sheet.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
                                            {sheet.description}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {sheet.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-[9px] font-mono font-bold text-muted-foreground bg-muted/50 dark:bg-muted/30 px-1.5 py-0.5 rounded"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-3 gap-1.5 mb-2">
                                            <div className="flex flex-col items-center justify-center p-1 rounded bg-accent/50 dark:bg-accent/30 border border-border/50 dark:border-input/30">
                                                <Clock className="h-2.5 w-2.5 text-primary mb-0.5" />
                                                <span className="text-[8px] font-black text-foreground leading-none">{sheet.readTime}</span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center p-1 rounded bg-accent/50 dark:bg-accent/30 border border-border/50 dark:border-input/30">
                                                <Eye className="h-2.5 w-2.5 text-primary mb-0.5" />
                                                <span className="text-[8px] font-black text-foreground leading-none">{(sheet.views / 1000).toFixed(1)}K</span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center p-1 rounded bg-accent/50 dark:bg-accent/30 border border-border/50 dark:border-input/30">
                                                <Download className="h-2.5 w-2.5 text-primary mb-0.5" />
                                                <span className="text-[8px] font-black text-foreground leading-none">{(sheet.downloads / 1000).toFixed(1)}K</span>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-1.5 border-t border-border dark:border-input/50">
                                            <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-wide">
                                                View & Download
                                            </span>
                                            <Download className="h-3 w-3 text-primary dark:text-primary group-hover:text-primary dark:group-hover:text-[oklch(0.85_0.28_260)] transition-colors" />
                                        </div>
                                    </div>

                                    {/* Hover Glow Effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent dark:from-primary/10"></div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Empty State */}
                        {filteredCheatsheets.length === 0 && (
                            <div className="text-center py-12 px-4">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted dark:bg-muted/50 mb-3">
                                    <Search className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-base font-bold text-foreground mb-1.5">No cheatsheets found</h3>
                                <p className="text-xs text-muted-foreground mb-3">Try adjusting your filters or search query</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        setSelectedTag(null);
                                        setSearchQuery("");
                                    }}
                                    className="border-2 dark:border-input dark:hover:border-[oklch(0.75_0.22_260)] dark:hover:bg-[oklch(0.28_0.06_260)] dark:hover:text-[oklch(0.85_0.28_260)]"
                                >
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
