"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, ThumbsUp, Eye, TrendingUp, Clock, Flame, Plus, Search, Filter, X, SlidersHorizontal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Portal } from "@/components/ui/Portal";
import { StaticWatermark } from "@/components/ui/StaticWatermark";

type SortOption = "hot" | "new" | "most-discussed";
type CategoryOption = "all" | "general" | "help" | "showcase" | "feedback";

export default function DiscussionPage() {
    const [sortBy, setSortBy] = useState<SortOption>("hot");
    const [category, setCategory] = useState<CategoryOption>("all");
    const [searchQuery, setSearchQuery] = useState("");
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

    const discussions = [
        {
            id: 1,
            title: "How to handle database connection pooling in Go?",
            excerpt: "I'm building a high-traffic API and wondering about best practices for managing database connections...",
            author: { name: "Alex Thompson", avatar: "AT", color: "bg-blue-500" },
            category: "help",
            date: "2024-02-20T10:30:00",
            views: 2340,
            upvotes: 45,
            comments: 23,
            tags: ["Go", "Database", "Performance"],
            isHot: true,
        },
        {
            id: 2,
            title: "Show HN: Built a CLI tool for managing microservices",
            excerpt: "After struggling with managing multiple microservices locally, I built a CLI tool that makes it easier...",
            author: { name: "Maria Garcia", avatar: "MG", color: "bg-purple-500" },
            category: "showcase",
            date: "2024-02-20T08:15:00",
            views: 5670,
            upvotes: 128,
            comments: 56,
            tags: ["CLI", "Microservices", "Tools"],
            isHot: true,
        },
        {
            id: 3,
            title: "Feedback wanted: New course on distributed systems",
            excerpt: "I'm creating a course on distributed systems with Go. Would love feedback on the curriculum...",
            author: { name: "John Smith", avatar: "JS", color: "bg-green-500" },
            category: "feedback",
            date: "2024-02-19T16:45:00",
            views: 1890,
            upvotes: 67,
            comments: 34,
            tags: ["Distributed Systems", "Course", "Feedback"],
            isHot: false,
        },
        {
            id: 4,
            title: "Best practices for structuring large Go projects?",
            excerpt: "Our codebase is growing and I'm looking for advice on project structure and organization...",
            author: { name: "Sarah Lee", avatar: "SL", color: "bg-red-500" },
            category: "general",
            date: "2024-02-19T14:20:00",
            views: 3450,
            upvotes: 89,
            comments: 45,
            tags: ["Go", "Architecture", "Best Practices"],
            isHot: true,
        },
        {
            id: 5,
            title: "Comparing gRPC vs REST for microservices communication",
            excerpt: "We're deciding between gRPC and REST for our microservices. What are your experiences?",
            author: { name: "David Chen", avatar: "DC", color: "bg-yellow-500" },
            category: "general",
            date: "2024-02-18T11:30:00",
            views: 4120,
            upvotes: 102,
            comments: 67,
            tags: ["gRPC", "REST", "Microservices"],
            isHot: true,
        },
        {
            id: 6,
            title: "Help: Memory leak in production Go application",
            excerpt: "We're experiencing memory leaks in production. Here's what we've tried so far...",
            author: { name: "Emma Wilson", avatar: "EW", color: "bg-pink-500" },
            category: "help",
            date: "2024-02-18T09:00:00",
            views: 2890,
            upvotes: 56,
            comments: 38,
            tags: ["Go", "Debugging", "Memory"],
            isHot: false,
        },
    ];

    const categories = [
        { value: "all", label: "All" },
        { value: "general", label: "General" },
        { value: "help", label: "Help" },
        { value: "showcase", label: "Showcase" },
        { value: "feedback", label: "Feedback" },
    ];

    const filteredDiscussions = discussions
        .filter((d) => {
            if (category !== "all" && d.category !== category) return false;
            if (searchQuery && !d.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !d.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "hot":
                    return (b.upvotes * 2 + b.comments) - (a.upvotes * 2 + a.comments);
                case "new":
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case "most-discussed":
                    return b.comments - a.comments;
                default:
                    return 0;
            }
        });

    const activeFiltersCount = [category !== "all" ? category : null, searchQuery].filter(Boolean).length;

    return (
        <div className="min-h-screen">
            {/* Compact Header */}
            <section className="py-4 border-b border-border/50 bg-gradient-to-b from-background to-muted/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 rounded-lg bg-primary/10 dark:bg-primary/20">
                            <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <h1 className="text-xl font-bold text-foreground">Discussions</h1>
                    </div>
                    <p className="text-xs text-muted-foreground">Join the conversation with the community</p>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Mobile Filter Button */}
                <div className="lg:hidden mb-4 flex gap-2">
                    <Button
                        onClick={() => setShowMobileFilters(true)}
                        variant="outline"
                        className="flex-1 h-10 border-2 dark:border-input dark:hover:border-[oklch(0.75_0.22_260)] dark:hover:bg-[oklch(0.28_0.06_260)] dark:hover:text-[oklch(0.85_0.28_260)] font-bold"
                    >
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filters
                        {activeFiltersCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-white text-xs">
                                {activeFiltersCount}
                            </span>
                        )}
                    </Button>
                    <Button
                        asChild
                        className="h-10 px-4 font-bold bg-gradient-to-r from-[oklch(0.4_0.14_260)] to-[oklch(0.35_0.12_260)] hover:from-[oklch(0.45_0.16_260)] hover:to-[oklch(0.4_0.14_260)] dark:from-[oklch(0.65_0.18_260)] dark:to-[oklch(0.6_0.16_260)] dark:hover:from-[oklch(0.75_0.22_260)] dark:hover:to-[oklch(0.7_0.2_260)] text-white dark:text-white"
                    >
                        <Link href="/discussion/new">
                            <Plus className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Desktop New Discussion Button */}
                <div className="hidden lg:flex justify-end mb-4">
                    <Button
                        asChild
                        className="h-10 px-6 font-bold bg-gradient-to-r from-[oklch(0.4_0.14_260)] to-[oklch(0.35_0.12_260)] hover:from-[oklch(0.45_0.16_260)] hover:to-[oklch(0.4_0.14_260)] dark:from-[oklch(0.65_0.18_260)] dark:to-[oklch(0.6_0.16_260)] dark:hover:from-[oklch(0.75_0.22_260)] dark:hover:to-[oklch(0.7_0.2_260)] text-white dark:text-white"
                    >
                        <Link href="/discussion/new">
                            <Plus className="h-4 w-4 mr-2" />
                            Start Discussion
                        </Link>
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
                                        <h2 className="text-lg font-bold text-foreground">Filters</h2>
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
                                            Search
                                        </label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search discussions..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 h-11 text-base border-2 dark:bg-input/30 dark:border-input dark:hover:border-primary/50 dark:focus:border-primary transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-foreground mb-2 block uppercase tracking-wide">Category</label>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.value}
                                                    onClick={() => setCategory(cat.value as CategoryOption)}
                                                    className={`px-3 py-2 rounded-full text-xs font-bold transition-all border-2 ${category === cat.value
                                                        ? "bg-primary text-white dark:text-white border-primary shadow-md dark:shadow-[0_0_8px_oklch(0.65_0.18_260/0.3)]"
                                                        : "bg-card/50 dark:bg-card/30 border-border dark:border-input hover:border-primary/50 dark:hover:border-[oklch(0.75_0.22_260)] hover:bg-accent dark:hover:bg-[oklch(0.28_0.06_260)] text-foreground dark:hover:text-[oklch(0.85_0.28_260)]"
                                                        }`}
                                                >
                                                    {cat.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        {activeFiltersCount > 0 && (
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setCategory("all");
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
                                            Show {filteredDiscussions.length} Result{filteredDiscussions.length !== 1 ? 's' : ''}
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
                                        { value: "hot", label: "Hot", icon: Flame },
                                        { value: "new", label: "New", icon: Clock },
                                        { value: "most-discussed", label: "Most Discussed", icon: MessageSquare },
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
                                            key={cat.value}
                                            onClick={() => setCategory(cat.value as CategoryOption)}
                                            className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold transition-all border ${category === cat.value
                                                ? "bg-primary text-white dark:text-white border-primary shadow-md dark:shadow-[0_0_8px_oklch(0.65_0.18_260/0.3)]"
                                                : "bg-card/50 dark:bg-card/30 border-border dark:border-input hover:border-primary/50 dark:hover:border-[oklch(0.75_0.22_260)] hover:bg-accent dark:hover:bg-[oklch(0.28_0.06_260)] text-foreground dark:hover:text-[oklch(0.85_0.28_260)]"
                                                }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {activeFiltersCount > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setCategory("all");
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
                                {filteredDiscussions.length} Discussion{filteredDiscussions.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {filteredDiscussions.map((discussion) => (
                                <Link
                                    key={discussion.id}
                                    href={`/discussion/${discussion.id}`}
                                    className="group relative bg-gradient-to-br from-card via-card/95 to-card/80 dark:from-card dark:via-card/95 dark:to-card/50 border border-border dark:border-input backdrop-blur-sm rounded-lg overflow-hidden hover:shadow-lg dark:hover:shadow-[0_4px_20px_oklch(0.65_0.18_260/0.3)] hover:border-primary/50 dark:hover:border-[oklch(0.75_0.22_260)] transition-all duration-300 hover:-translate-y-0.5 p-3 sm:p-4"
                                >
                                    <StaticWatermark />

                                    <div className="flex gap-3">
                                        {/* Upvote Column */}
                                        <div className="hidden sm:flex flex-col items-center gap-1 min-w-[50px]">
                                            <button className="p-1.5 rounded-lg hover:bg-accent dark:hover:bg-accent/50 transition-colors">
                                                <ThumbsUp className="h-4 w-4 text-muted-foreground hover:text-primary dark:hover:text-[oklch(0.85_0.28_260)] transition-colors" />
                                            </button>
                                            <span className="text-sm font-black text-foreground">{discussion.upvotes}</span>
                                            <span className="text-[8px] text-muted-foreground uppercase">Votes</span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start gap-2 mb-2">
                                                <Badge
                                                    variant="outline"
                                                    className="border-primary/20 text-primary bg-primary/10 dark:bg-primary/20 text-[9px] font-bold uppercase tracking-wider"
                                                >
                                                    {discussion.category}
                                                </Badge>
                                                {discussion.isHot && (
                                                    <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 text-[9px] font-bold flex items-center gap-0.5">
                                                        <Flame className="h-2 w-2" />
                                                        Hot
                                                    </Badge>
                                                )}
                                                <span className="text-[10px] text-muted-foreground">
                                                    {new Date(discussion.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                </span>
                                                {/* Mobile Stats */}
                                                <div className="sm:hidden ml-auto flex items-center gap-2 text-[10px] text-muted-foreground">
                                                    <span className="flex items-center gap-0.5">
                                                        <ThumbsUp className="h-2.5 w-2.5" />
                                                        {discussion.upvotes}
                                                    </span>
                                                    <span className="flex items-center gap-0.5">
                                                        <MessageSquare className="h-2.5 w-2.5" />
                                                        {discussion.comments}
                                                    </span>
                                                </div>
                                            </div>

                                            <h2 className="text-sm sm:text-base font-black text-foreground mb-2 group-hover:text-primary dark:group-hover:text-[oklch(0.85_0.28_260)] dark:group-hover:drop-shadow-[0_0_8px_oklch(0.65_0.18_260/0.3)] transition-all line-clamp-2 leading-tight">
                                                {discussion.title}
                                            </h2>

                                            <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
                                                {discussion.excerpt}
                                            </p>

                                            <div className="flex flex-wrap gap-1.5 mb-2">
                                                {discussion.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="text-[9px] font-mono font-bold text-muted-foreground bg-muted/50 dark:bg-muted/30 px-1.5 py-0.5 rounded"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-5 w-5 border border-border">
                                                        <AvatarFallback className={`${discussion.author.color} text-white text-[8px]`}>
                                                            {discussion.author.avatar}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-[10px] font-semibold text-foreground">{discussion.author.name}</span>
                                                </div>
                                                <div className="hidden sm:flex items-center gap-3 text-[10px] text-muted-foreground">
                                                    <span className="flex items-center gap-0.5">
                                                        <Eye className="h-2.5 w-2.5" />
                                                        {(discussion.views / 1000).toFixed(1)}K
                                                    </span>
                                                    <span className="flex items-center gap-0.5">
                                                        <MessageSquare className="h-2.5 w-2.5" />
                                                        {discussion.comments}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
