"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Clock, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheatsheetPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const categories = ["All", "Programming", "DevOps", "Cloud", "Database", "Tools"];
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
        },
    ];

    const filteredCheatsheets = cheatsheets.filter((sheet) => {
        if (selectedCategory && selectedCategory !== "All" && sheet.category !== selectedCategory) {
            return false;
        }
        if (selectedTag && !sheet.tags.includes(selectedTag)) {
            return false;
        }
        return true;
    });

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Cheatsheets</h1>
                    <p className="text-muted-foreground">Quick reference guides for developers</p>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Category Filter */}
                <div className="mb-6">
                    <label className="text-sm font-medium text-foreground mb-3 block">Category</label>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category || (category === "All" && !selectedCategory) ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(category === "All" ? null : category)}
                                className="rounded-full"
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Popular Tags */}
                <div className="mb-8">
                    <label className="text-sm font-medium text-foreground mb-3 block">Popular Tags</label>
                    <div className="flex flex-wrap gap-2">
                        {popularTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedTag === tag
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-accent hover:bg-accent/80 text-foreground"
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Clear Filters */}
                {(selectedCategory || selectedTag) && (
                    <div className="mb-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSelectedCategory(null);
                                setSelectedTag(null);
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}

                {/* Cheatsheets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCheatsheets.map((sheet) => (
                        <Link
                            key={sheet.id}
                            href={`/resources/cheatsheet/${sheet.id}`}
                            className="group relative bg-gradient-to-br from-card/90 to-card/70 dark:from-card dark:to-card/60 border-2 border-border backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20 hover:border-primary/50 transition-all duration-300"
                        >
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${sheet.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                            <div className="relative z-10 p-6">
                                {/* Icon */}
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <FileText className="h-6 w-6 text-primary" />
                                </div>

                                {/* Category Badge */}
                                <div className="inline-block px-2 py-1 rounded-full bg-accent text-xs font-medium text-foreground mb-3">
                                    {sheet.category}
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                    {sheet.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    {sheet.description}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {sheet.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Meta Info */}
                                <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {sheet.readTime}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            {(sheet.views / 1000).toFixed(1)}K
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Download className="h-3 w-3" />
                                            {(sheet.downloads / 1000).toFixed(1)}K
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredCheatsheets.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground">No cheatsheets found matching your filters.</p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSelectedCategory(null);
                                setSelectedTag(null);
                            }}
                            className="mt-4"
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
