"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchResult {
    id: number;
    title: string;
    slug: string;
    type: "article" | "roadmap" | "project";
    excerpt?: string;
}

export function GlobalSearch() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("recentSearches");
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Keyboard shortcut handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Mock search function - replace with actual API call
    const performSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            const mockResults: SearchResult[] = [
                {
                    id: 1,
                    title: "Getting Started with Go",
                    slug: "getting-started-with-go",
                    type: "article" as const,
                    excerpt: "Learn the basics of Go programming language...",
                },
                {
                    id: 2,
                    title: "Backend Development Roadmap",
                    slug: "backend-development",
                    type: "roadmap" as const,
                    excerpt: "Complete guide to becoming a backend developer...",
                },
            ].filter((item) =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
            );

            setResults(mockResults);
            setIsLoading(false);
        }, 300);
    }, []);

    useEffect(() => {
        const debounce = setTimeout(() => {
            performSearch(query);
        }, 300);

        return () => clearTimeout(debounce);
    }, [query, performSearch]);

    const handleResultClick = (result: SearchResult) => {
        // Save to recent searches
        const updated = [result.title, ...recentSearches.filter((s) => s !== result.title)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem("recentSearches", JSON.stringify(updated));

        // Navigate
        const path = result.type === "article" ? `/archive/post/${result.slug}` : `/${result.type}/${result.slug}`;
        router.push(path);
        setIsOpen(false);
        setQuery("");
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem("recentSearches");
    };

    if (!isOpen) {
        return (
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(true)}
                className="hidden lg:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
                <Search className="h-4 w-4" />
                <span className="text-sm">Search</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
        );
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in-0"
                onClick={() => setIsOpen(false)}
            />

            {/* Search Modal */}
            <div className="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-2xl z-50 animate-in fade-in-0 slide-in-from-top-4">
                <div className="bg-card border-2 border-border rounded-2xl shadow-2xl overflow-hidden">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 p-4 border-b border-border">
                        <Search className="h-5 w-5 text-muted-foreground" />
                        <Input
                            autoFocus
                            placeholder="Search articles, roadmaps, projects..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 border-0 focus-visible:ring-0 text-base bg-transparent"
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsOpen(false)}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Results */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {isLoading ? (
                            <div className="p-8 text-center">
                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
                                <p className="mt-4 text-sm text-muted-foreground">Searching...</p>
                            </div>
                        ) : query && results.length > 0 ? (
                            <div className="p-2">
                                {results.map((result) => (
                                    <button
                                        key={result.id}
                                        onClick={() => handleResultClick(result)}
                                        className="w-full text-left p-4 rounded-xl hover:bg-accent transition-colors group"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                                        {result.title}
                                                    </span>
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono uppercase">
                                                        {result.type}
                                                    </span>
                                                </div>
                                                {result.excerpt && (
                                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                                        {result.excerpt}
                                                    </p>
                                                )}
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : query && !isLoading ? (
                            <div className="p-8 text-center">
                                <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
                                <p className="text-xs text-muted-foreground mt-2">Try different keywords</p>
                            </div>
                        ) : recentSearches.length > 0 ? (
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        <Clock className="h-3 w-3" />
                                        Recent Searches
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearRecentSearches}
                                        className="h-6 text-xs text-muted-foreground hover:text-foreground"
                                    >
                                        Clear
                                    </Button>
                                </div>
                                <div className="space-y-1">
                                    {recentSearches.map((search, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setQuery(search)}
                                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm text-foreground"
                                        >
                                            {search}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                                <p className="text-sm text-muted-foreground">Start typing to search</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Search across articles, roadmaps, and projects
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-background border text-[10px] font-mono">↑↓</kbd>
                                <span>Navigate</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-background border text-[10px] font-mono">↵</kbd>
                                <span>Select</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-background border text-[10px] font-mono">ESC</kbd>
                                <span>Close</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
