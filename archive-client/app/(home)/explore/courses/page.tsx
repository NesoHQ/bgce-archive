"use client";

import { useState } from "react";
import { Search, Clock, Star, TrendingUp, BookOpen, Users, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CoursesBreadcrumb } from "@/components/shared/CoursesBreadcrumb";
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
            duration: "40h",
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
            duration: "25h",
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
            duration: "60h",
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
            duration: "30h",
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
            duration: "45h",
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
            duration: "50h",
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

    const activeFiltersCount = [selectedLevel, selectedTopic, showFreeOnly, showNewOnly, searchQuery].filter(Boolean).length;

    return (
        <div className="min-h-screen">
            {/* Breadcrumb */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
                <CoursesBreadcrumb />
            </div>

            {/* Compact Header */}
            <section className="py-3 border-b border-border/50 bg-gradient-to-b from-background to-muted/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 rounded-lg bg-primary/10 dark:bg-primary/20">
                            <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <h1 className="text-xl font-bold text-foreground">Professional Courses</h1>
                    </div>
                    <p className="text-xs text-muted-foreground">Expert-led courses for modern developers</p>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Ultra Compact Filters Sidebar */}
                    <aside className="lg:w-48 flex-shrink-0">
                        <div className="sticky top-20 space-y-3">
                            {/* Search */}
                            <div>
                                <label className="text-[10px] font-bold text-foreground mb-1 flex items-center gap-1 uppercase tracking-wide">
                                    <Search className="h-2.5 w-2.5" />
                                    Search
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                    <Input
                                        placeholder="Find courses..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-7 h-7 text-xs border-2 dark:bg-input/30 dark:border-input dark:hover:border-primary/50 dark:focus:border-primary transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Quick Filters */}
                            <div className="p-2 rounded-lg border-2 border-border dark:border-input bg-card/50 dark:bg-card/30 backdrop-blur-sm">
                                <label className="text-[10px] font-bold text-foreground mb-1 flex items-center gap-1 uppercase tracking-wide">
                                    <Filter className="h-2.5 w-2.5" />
                                    Filters
                                </label>
                                <div className="space-y-1">
                                    <label className="flex items-center gap-1.5 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={showNewOnly}
                                            onChange={(e) => setShowNewOnly(e.target.checked)}
                                            className="rounded border-border w-3 h-3 text-primary focus:ring-primary/20 dark:bg-input/50 dark:border-input"
                                        />
                                        <span className="text-[10px] font-medium text-foreground group-hover:text-primary dark:group-hover:text-[oklch(0.85_0.28_260)] transition-colors">Trending</span>
                                    </label>
                                    <label className="flex items-center gap-1.5 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={showFreeOnly}
                                            onChange={(e) => setShowFreeOnly(e.target.checked)}
                                            className="rounded border-border w-3 h-3 text-primary focus:ring-primary/20 dark:bg-input/50 dark:border-input"
                                        />
                                        <span className="text-[10px] font-medium text-foreground group-hover:text-primary dark:group-hover:text-[oklch(0.85_0.28_260)] transition-colors">Free Only</span>
                                    </label>
                                </div>
                            </div>

                            {/* Skill Level */}
                            <div>
                                <label className="text-[10px] font-bold text-foreground mb-1 block uppercase tracking-wide">Level</label>
                                <div className="space-y-1">
                                    {levels.map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                                            className={`w-full text-left px-2 py-1 rounded-md text-[10px] font-bold transition-all border-2 ${selectedLevel === level
                                                ? "bg-primary text-white dark:text-white border-primary shadow-md dark:shadow-[0_0_12px_oklch(0.65_0.18_260/0.3)]"
                                                : "bg-card/50 dark:bg-card/30 border-border dark:border-input hover:border-primary/50 dark:hover:border-[oklch(0.75_0.22_260)] hover:bg-accent dark:hover:bg-[oklch(0.28_0.06_260)] text-foreground dark:hover:text-[oklch(0.85_0.28_260)]"
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Topics */}
                            <div>
                                <label className="text-[10px] font-bold text-foreground mb-1 block uppercase tracking-wide">Topics</label>
                                <div className="flex flex-wrap gap-1">
                                    {topics.map((topic) => (
                                        <button
                                            key={topic}
                                            onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
                                            className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold transition-all border ${selectedTopic === topic
                                                ? "bg-primary text-white dark:text-white border-primary shadow-md dark:shadow-[0_0_8px_oklch(0.65_0.18_260/0.3)]"
                                                : "bg-card/50 dark:bg-card/30 border-border dark:border-input hover:border-primary/50 dark:hover:border-[oklch(0.75_0.22_260)] hover:bg-accent dark:hover:bg-[oklch(0.28_0.06_260)] text-foreground dark:hover:text-[oklch(0.85_0.28_260)]"
                                                }`}
                                        >
                                            {topic}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Filters */}
                            {activeFiltersCount > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedLevel(null);
                                        setSelectedTopic(null);
                                        setShowFreeOnly(false);
                                        setShowNewOnly(false);
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

                    {/* Courses Grid */}
                    <main className="flex-1">
                        {/* Results Header */}
                        <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <p className="text-xs font-bold text-foreground">
                                    {filteredCourses.length} {filteredCourses.length === 1 ? "Course" : "Courses"}
                                </p>
                                {activeFiltersCount > 0 && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-[9px] font-bold">
                                        {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Ultra Compact Courses Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-2.5">
                            {filteredCourses.map((course) => (
                                <Link
                                    key={course.id}
                                    href={`/explore/courses/${course.id}`}
                                    className="group bg-gradient-to-br from-card to-card/80 dark:from-card dark:to-card/50 border-2 border-border dark:border-input backdrop-blur-sm rounded-md overflow-hidden hover:shadow-lg dark:hover:shadow-[0_4px_20px_oklch(0.65_0.18_260/0.3)] hover:border-primary/50 dark:hover:border-[oklch(0.75_0.22_260)] transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    {/* Minimal Thumbnail */}
                                    <div className="aspect-[3/1.5] bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 dark:from-primary/30 dark:via-primary/15 dark:to-primary/5 flex items-center justify-center text-3xl border-b border-border dark:border-input group-hover:border-primary/30 transition-colors">
                                        {course.thumbnail}
                                    </div>

                                    <div className="p-2">
                                        {/* Minimal Badges */}
                                        <div className="flex items-center gap-0.5 mb-1">
                                            <span className="px-1 py-0.5 rounded-full bg-accent dark:bg-accent/50 text-[8px] font-bold border border-border/50 dark:border-input/50 leading-none">
                                                {course.level.slice(0, 3)}
                                            </span>
                                            {course.price === "Free" && (
                                                <span className="px-1 py-0.5 rounded-full bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 text-[8px] font-bold border border-green-500/20 leading-none">
                                                    Free
                                                </span>
                                            )}
                                            {course.trending && (
                                                <span className="px-1 py-0.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-[8px] font-bold flex items-center gap-0.5 border border-primary/20 leading-none">
                                                    <TrendingUp className="h-1.5 w-1.5" />
                                                    Hot
                                                </span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-[11px] font-bold text-foreground mb-0.5 group-hover:text-primary dark:group-hover:text-[oklch(0.85_0.28_260)] dark:group-hover:drop-shadow-[0_0_8px_oklch(0.65_0.18_260/0.3)] transition-all line-clamp-2 leading-tight">
                                            {course.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-[9px] text-muted-foreground mb-1.5 line-clamp-2 leading-snug">
                                            {course.description}
                                        </p>

                                        {/* Meta Info */}
                                        <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground mb-1.5">
                                            <div className="flex items-center gap-0.5">
                                                <Clock className="h-2 w-2" />
                                                <span className="font-bold">{course.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-0.5">
                                                <Star className="h-2 w-2 fill-yellow-400 text-yellow-400" />
                                                <span className="font-bold">{course.rating}</span>
                                            </div>
                                            <div className="flex items-center gap-0.5">
                                                <Users className="h-2 w-2" />
                                                <span className="font-bold">{(course.students / 1000).toFixed(1)}K</span>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-1.5 border-t border-border dark:border-input/50">
                                            <span className="text-[8px] text-muted-foreground font-semibold">
                                                {(course.students / 1000).toFixed(1)}K enrolled
                                            </span>
                                            <span className="text-[11px] font-bold text-primary dark:text-primary group-hover:text-primary dark:group-hover:text-[oklch(0.85_0.28_260)] transition-colors">
                                                {course.price}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Empty State */}
                        {filteredCourses.length === 0 && (
                            <div className="text-center py-12 px-4">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted dark:bg-muted/50 mb-3">
                                    <Search className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-base font-bold text-foreground mb-1.5">No courses found</h3>
                                <p className="text-xs text-muted-foreground mb-3">Try adjusting your filters or search query</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedLevel(null);
                                        setSelectedTopic(null);
                                        setShowFreeOnly(false);
                                        setShowNewOnly(false);
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
