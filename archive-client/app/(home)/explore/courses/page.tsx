"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, Clock, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function CoursesPage() {
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [showFreeOnly, setShowFreeOnly] = useState(false);
    const [showNewOnly, setShowNewOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const levels = ["Beginner", "Intermediate", "Advanced"];
    const topics = ["AWS", "Java", "Python", "System Design", "DevOps", "Go", "Kubernetes", "Docker"];

    const courses = [
        {
            id: 1,
            title: "Complete Go Programming Bootcamp",
            description: "Master Go from basics to advanced concepts including concurrency, testing, and microservices",
            level: "Beginner",
            topic: "Go",
            duration: "40 hours",
            rating: 4.8,
            students: 12500,
            price: "Free",
            thumbnail: "🚀",
            trending: true,
        },
        {
            id: 2,
            title: "System Design Interview Masterclass",
            description: "Learn to design scalable systems and ace your system design interviews",
            level: "Advanced",
            topic: "System Design",
            duration: "25 hours",
            rating: 4.9,
            students: 8900,
            price: "$49",
            thumbnail: "🏗️",
            trending: true,
        },
        {
            id: 3,
            title: "AWS Solutions Architect Path",
            description: "Complete guide to AWS services and architecture patterns",
            level: "Intermediate",
            topic: "AWS",
            duration: "60 hours",
            rating: 4.7,
            students: 15200,
            price: "$79",
            thumbnail: "☁️",
            trending: false,
        },
        {
            id: 4,
            title: "Kubernetes for Developers",
            description: "Deploy and manage containerized applications with Kubernetes",
            level: "Intermediate",
            topic: "Kubernetes",
            duration: "30 hours",
            rating: 4.6,
            students: 6700,
            price: "Free",
            thumbnail: "⚓",
            trending: true,
        },
        {
            id: 5,
            title: "Python for Data Science",
            description: "Learn Python programming with focus on data analysis and machine learning",
            level: "Beginner",
            topic: "Python",
            duration: "45 hours",
            rating: 4.8,
            students: 18900,
            price: "$59",
            thumbnail: "🐍",
            trending: false,
        },
        {
            id: 6,
            title: "DevOps Engineering Complete Guide",
            description: "Master CI/CD, infrastructure as code, and cloud automation",
            level: "Advanced",
            topic: "DevOps",
            duration: "50 hours",
            rating: 4.7,
            students: 9800,
            price: "$89",
            thumbnail: "🔧",
            trending: true,
        },
    ];

    const filteredCourses = courses.filter((course) => {
        if (selectedLevel && course.level !== selectedLevel) return false;
        if (selectedTopic && course.topic !== selectedTopic) return false;
        if (showFreeOnly && course.price !== "Free") return false;
        if (showNewOnly && !course.trending) return false;
        if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !course.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Courses</h1>
                    <p className="text-muted-foreground">Learn from expert-led courses and advance your career</p>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="sticky top-24 space-y-6">
                            {/* Search */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search courses..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            {/* Quick Filters */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Quick Filters</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={showNewOnly}
                                            onChange={(e) => setShowNewOnly(e.target.checked)}
                                            className="rounded border-border"
                                        />
                                        <span className="text-sm text-foreground">New Only</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={showFreeOnly}
                                            onChange={(e) => setShowFreeOnly(e.target.checked)}
                                            className="rounded border-border"
                                        />
                                        <span className="text-sm text-foreground">Free</span>
                                    </label>
                                </div>
                            </div>

                            {/* Skill Level */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Skill Level</label>
                                <div className="space-y-2">
                                    {levels.map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedLevel === level
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-accent hover:bg-accent/80 text-foreground"
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Topics */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Topics</label>
                                <div className="flex flex-wrap gap-2">
                                    {topics.map((topic) => (
                                        <button
                                            key={topic}
                                            onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedTopic === topic
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-accent hover:bg-accent/80 text-foreground"
                                                }`}
                                        >
                                            {topic}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Filters */}
                            {(selectedLevel || selectedTopic || showFreeOnly || showNewOnly || searchQuery) && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedLevel(null);
                                        setSelectedTopic(null);
                                        setShowFreeOnly(false);
                                        setShowNewOnly(false);
                                        setSearchQuery("");
                                    }}
                                    className="w-full"
                                >
                                    Clear All Filters
                                </Button>
                            )}
                        </div>
                    </aside>

                    {/* Courses Grid */}
                    <main className="flex-1">
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"} found
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredCourses.map((course) => (
                                <Link
                                    key={course.id}
                                    href={`/explore/courses/${course.id}`}
                                    className="group bg-gradient-to-br from-card/90 to-card/70 dark:from-card dark:to-card/60 border-2 border-border backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20 hover:border-primary/50 transition-all duration-300"
                                >
                                    {/* Thumbnail */}
                                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-6xl">
                                        {course.thumbnail}
                                    </div>

                                    <div className="p-5">
                                        {/* Badges */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="px-2 py-1 rounded-full bg-accent text-xs font-medium">
                                                {course.level}
                                            </span>
                                            {course.price === "Free" && (
                                                <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">
                                                    Free
                                                </span>
                                            )}
                                            {course.trending && (
                                                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center gap-1">
                                                    <TrendingUp className="h-3 w-3" />
                                                    Trending
                                                </span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                            {course.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                            {course.description}
                                        </p>

                                        {/* Meta */}
                                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {course.duration}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                {course.rating}
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-3 border-t border-border">
                                            <span className="text-xs text-muted-foreground">
                                                {course.students.toLocaleString()} students
                                            </span>
                                            <span className="text-sm font-semibold text-primary">
                                                {course.price}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {filteredCourses.length === 0 && (
                            <div className="text-center py-16">
                                <p className="text-muted-foreground">No courses found matching your filters.</p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedLevel(null);
                                        setSelectedTopic(null);
                                        setShowFreeOnly(false);
                                        setShowNewOnly(false);
                                        setSearchQuery("");
                                    }}
                                    className="mt-4"
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
