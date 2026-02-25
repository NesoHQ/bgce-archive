"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, ThumbsUp, Eye, TrendingUp, Clock, Flame } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type SortOption = "hot" | "new" | "most-discussed";
type CategoryOption = "all" | "general" | "help" | "showcase" | "feedback";

export default function DiscussionPage() {
    const [sortBy, setSortBy] = useState<SortOption>("hot");
    const [category, setCategory] = useState<CategoryOption>("all");

    const discussions = [
        {
            id: 1,
            title: "How to handle database connection pooling in Go?",
            excerpt: "I'm building a high-traffic API and wondering about best practices for managing database connections...",
            author: {
                name: "Alex Thompson",
                avatar: "AT",
            },
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
            author: {
                name: "Maria Garcia",
                avatar: "MG",
            },
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
            author: {
                name: "John Smith",
                avatar: "JS",
            },
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
            author: {
                name: "Sarah Lee",
                avatar: "SL",
            },
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
            author: {
                name: "David Chen",
                avatar: "DC",
            },
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
            author: {
                name: "Emma Wilson",
                avatar: "EW",
            },
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
        { value: "all", label: "All Discussions" },
        { value: "general", label: "General" },
        { value: "help", label: "Help & Questions" },
        { value: "showcase", label: "Show & Tell" },
        { value: "feedback", label: "Feedback" },
    ];

    const filteredDiscussions = discussions
        .filter((d) => category === "all" || d.category === category)
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

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-foreground mb-4">Discussions</h1>
                            <p className="text-muted-foreground">Join the conversation with the community</p>
                        </div>
                        <Button asChild>
                            <Link href="/discussion/new">Start Discussion</Link>
                        </Button>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Category Tabs */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                    {categories.map((cat) => (
                        <Button
                            key={cat.value}
                            variant={category === cat.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCategory(cat.value as CategoryOption)}
                            className="rounded-full whitespace-nowrap"
                        >
                            {cat.label}
                        </Button>
                    ))}
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
                    <span className="text-sm font-medium text-foreground mr-2">Sort by:</span>
                    <Button
                        variant={sortBy === "hot" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortBy("hot")}
                        className="rounded-full"
                    >
                        <Flame className="h-4 w-4 mr-2" />
                        Hot
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
                        variant={sortBy === "most-discussed" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortBy("most-discussed")}
                        className="rounded-full"
                    >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Most Discussed
                    </Button>
                </div>

                {/* Discussions List */}
                <div className="space-y-4">
                    {filteredDiscussions.map((discussion) => (
                        <Link
                            key={discussion.id}
                            href={`/discussion/${discussion.id}`}
                            className="group block bg-gradient-to-br from-card/90 to-card/70 dark:from-card dark:to-card/60 border-2 border-border rounded-xl p-6 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 hover:ring-2 hover:ring-primary/20 transition-all duration-300 backdrop-blur-sm"
                        >
                            <div className="flex gap-4">
                                {/* Upvote Section */}
                                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                                    <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                                        <ThumbsUp className="h-5 w-5 text-muted-foreground hover:text-primary" />
                                    </button>
                                    <span className="text-sm font-semibold text-foreground">{discussion.upvotes}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    {/* Title & Badges */}
                                    <div className="flex items-start gap-2 mb-2">
                                        <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex-1">
                                            {discussion.title}
                                        </h2>
                                        {discussion.isHot && (
                                            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-medium flex-shrink-0">
                                                <Flame className="h-3 w-3" />
                                                Hot
                                            </span>
                                        )}
                                    </div>

                                    {/* Excerpt */}
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                        {discussion.excerpt}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {discussion.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 rounded-full bg-accent text-xs font-medium text-foreground"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Meta Info */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                                                    {discussion.author.avatar}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium text-foreground">{discussion.author.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(discussion.date).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-3 w-3" />
                                                {discussion.views.toLocaleString()}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageSquare className="h-3 w-3" />
                                                {discussion.comments}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
