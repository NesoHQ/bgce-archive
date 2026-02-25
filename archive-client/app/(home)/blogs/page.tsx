"use client";

import { useState } from "react";
import Link from "next/link";
import { ThumbsUp, MessageSquare, Eye, TrendingUp, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type SortOption = "hotness" | "new" | "trending";

export default function BlogsPage() {
    const [sortBy, setSortBy] = useState<SortOption>("hotness");

    const blogs = [
        {
            id: 1,
            title: "Building Scalable Microservices with Go",
            excerpt: "Learn how to design and implement microservices architecture using Go, gRPC, and Kubernetes for production-ready applications.",
            author: {
                name: "Sarah Chen",
                avatar: "SC",
            },
            date: "2024-02-20",
            views: 12500,
            likes: 489,
            comments: 123,
            tags: ["Go", "Microservices", "Architecture"],
            readTime: "12 min",
            hotness: 95,
        },
        {
            id: 2,
            title: "Optimizing Database Queries in Production",
            excerpt: "Deep dive into query optimization techniques, indexing strategies, and performance monitoring for high-traffic applications.",
            author: {
                name: "Michael Rodriguez",
                avatar: "MR",
            },
            date: "2024-02-18",
            views: 8900,
            likes: 356,
            comments: 87,
            tags: ["Database", "Performance", "SQL"],
            readTime: "15 min",
            hotness: 88,
        },
        {
            id: 3,
            title: "Introduction to gRPC and Protocol Buffers",
            excerpt: "A comprehensive guide to building efficient APIs with gRPC, including best practices and real-world examples.",
            author: {
                name: "Emily Watson",
                avatar: "EW",
            },
            date: "2024-02-15",
            views: 15200,
            likes: 567,
            comments: 145,
            tags: ["gRPC", "API", "Go"],
            readTime: "10 min",
            hotness: 92,
        },
        {
            id: 4,
            title: "Best Practices for Error Handling in Go",
            excerpt: "Master error handling patterns in Go, from basic error wrapping to advanced error management strategies.",
            author: {
                name: "David Kim",
                avatar: "DK",
            },
            date: "2024-02-12",
            views: 6700,
            likes: 289,
            comments: 56,
            tags: ["Go", "Best Practices", "Error Handling"],
            readTime: "8 min",
            hotness: 78,
        },
        {
            id: 5,
            title: "Deploying Go Apps to Kubernetes",
            excerpt: "Step-by-step guide to containerizing and deploying Go applications on Kubernetes with CI/CD pipelines.",
            author: {
                name: "Lisa Anderson",
                avatar: "LA",
            },
            date: "2024-02-10",
            views: 11300,
            likes: 445,
            comments: 98,
            tags: ["Kubernetes", "DevOps", "Go"],
            readTime: "18 min",
            hotness: 85,
        },
        {
            id: 6,
            title: "Testing Strategies for Go Applications",
            excerpt: "Comprehensive testing approaches including unit tests, integration tests, and end-to-end testing in Go.",
            author: {
                name: "James Wilson",
                avatar: "JW",
            },
            date: "2024-02-08",
            views: 5600,
            likes: 234,
            comments: 45,
            tags: ["Go", "Testing", "Quality"],
            readTime: "14 min",
            hotness: 72,
        },
    ];

    const sortedBlogs = [...blogs].sort((a, b) => {
        switch (sortBy) {
            case "hotness":
                return b.hotness - a.hotness;
            case "new":
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            case "trending":
                return (b.likes + b.comments * 2) - (a.likes + a.comments * 2);
            default:
                return 0;
        }
    });

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <section className="bg-gradient-to-b from-primary/5 to-background py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Community Blogs</h1>
                    <p className="text-muted-foreground">Insights, tutorials, and stories from our community</p>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Sort Options */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
                    <span className="text-sm font-medium text-foreground mr-2">Sort by:</span>
                    <Button
                        variant={sortBy === "hotness" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortBy("hotness")}
                        className="rounded-full"
                    >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Hotness
                    </Button>
                    <Button
                        variant={sortBy === "new" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortBy("new")}
                        className="rounded-full"
                    >
                        <Clock className="h-4 w-4 mr-2" />
                        New
                    </Button>
                    <Button
                        variant={sortBy === "trending" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortBy("trending")}
                        className="rounded-full"
                    >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Trending
                    </Button>
                </div>

                {/* Blogs Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {sortedBlogs.map((blog) => (
                        <Link
                            key={blog.id}
                            href={`/blogs/${blog.id}`}
                            className="group bg-card border border-border rounded-xl p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/50 transition-all duration-300"
                        >
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {blog.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Title */}
                            <h2 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                {blog.title}
                            </h2>

                            {/* Excerpt */}
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {blog.excerpt}
                            </p>

                            {/* Author & Meta */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                                            {blog.author.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{blog.author.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(blog.date).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground">{blog.readTime} read</span>
                            </div>

                            {/* Engagement Stats */}
                            <div className="flex items-center gap-6 text-xs text-muted-foreground pt-4 border-t border-border">
                                <div className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {blog.views.toLocaleString()}
                                </div>
                                <div className="flex items-center gap-1">
                                    <ThumbsUp className="h-3 w-3" />
                                    {blog.likes}
                                </div>
                                <div className="flex items-center gap-1">
                                    <MessageSquare className="h-3 w-3" />
                                    {blog.comments}
                                </div>
                                {sortBy === "hotness" && (
                                    <div className="ml-auto flex items-center gap-1 text-primary">
                                        <TrendingUp className="h-3 w-3" />
                                        {blog.hotness}
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
