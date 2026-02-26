"use client";

import { useState, useEffect } from "react";
import { Search, Clock, Star, TrendingUp, BookOpen, Users, Filter, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CoursesBreadcrumb } from "@/components/shared/CoursesBreadcrumb";
import { Portal } from "@/components/ui/Portal";
import { StaticWatermark } from "@/components/ui/StaticWatermark";
import Link from "next/link";

export default function CoursesPage() {
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [showFreeOnly, setShowFreeOnly] = useState(false);
    const [showNewOnly, setShowNewOnly] = useState(false);
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
            {/* Combined Breadcrumb & Header Section */}
            <section className="py-4 border-b border-border/50 bg-gradient-to-b from-background to-muted/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-3">
                        <CoursesBreadcrumb />
                    </div>

                    {/* Header */}
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
                            {/* Backdrop */}
                            <div
                                className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
                                onClick={() => setShowMobileFilters(false)}
                            />

                            {/* Drawer */}
                            <div className="absolute inset-x-0 bottom-0 bg-card border-t-2 border-border dark:border-input rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
                                {/* Drawer Header */}
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

                                {/* Drawer Content */}
                                <div className="p-4 space-y-4">
                                    {/* Search */}
                                    <div>
                                        <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                                            <Search className="h-3.5 w-3.5" />
                                            Search Courses
                                        </label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Find courses..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 h-11 text-base border-2 dark:bg-input/30 dark:border-input dark:hover:border-primary/50 dark:focus:border-primary transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Quick Filters */}
                                    <div className="p-3 rounded-lg border-2 border-border dark:border-input bg-card/50 dark:bg-card/30 backdrop-blur-sm">
                                        <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                                            <Filter className="h-3.5 w-3.5" />
                                            Quick Filters
                                        </label>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 cursor-pointer group p-2 rounded-md hover:bg-accent/50 dark:hover:bg-accent/30 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={showNewOnly}
                                                    onChange={(e) => setShowNewOnly(e.target.checked)}
                                                    className="rounded border-border w-5 h-5 text-primary focus:ring-primary/20 dark:bg-input/50 dark:border-input"
                                                />
                                                <span className="text-sm font-medium text-foreground group-hover:text-primary dark:group-hover:text-[oklch(0.85_0.28_260)] transition-colors">Trending Courses</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer group p-2 rounded-md hover:bg-accent/50 dark:hover:bg-accent/30 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={showFreeOnly}
                                                    onChange={(e) => setShowFreeOnly(e.target.checked)}
                                                    className="rounded border-border w-5 h-5 text-primary focus:ring-primary/20 dark:bg-input/50 dark:border-input"
                                                />
                                                <span className="text-sm font-medium text-foreground group-hover:text-primary dark:group-hover:text-[oklch(0.85_0.28_260)] transition-colors">Free Courses Only</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Skill Level */}
                                    <div>
                                        <label className="text-sm font-bold text-foreground mb-2 block uppercase tracking-wide">Skill Level</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {levels.map((level) => (
                                                <button
                                                    key={level}
                                                    onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                                                    className={`text-center px-3 py-2.5 rounded-lg text-xs font-bold transition-all border-2 ${selectedLevel === level
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
                                        <label className="text-sm font-bold text-foreground mb-2 block uppercase tracking-wide">Topics</label>
                                        <div className="flex flex-wrap gap-2">
                                            {topics.map((topic) => (
                                                <button
                                                    key={topic}
                                                    onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
                                                    className={`px-3 py-2 rounded-full text-xs font-bold transition-all border-2 ${selectedTopic === topic
                                                        ? "bg-primary text-white dark:text-white border-primary shadow-md dark:shadow-[0_0_8px_oklch(0.65_0.18_260/0.3)]"
                                                        : "bg-card/50 dark:bg-card/30 border-border dark:border-input hover:border-primary/50 dark:hover:border-[oklch(0.75_0.22_260)] hover:bg-accent dark:hover:bg-[oklch(0.28_0.06_260)] text-foreground dark:hover:text-[oklch(0.85_0.28_260)]"
                                                        }`}
                                                >
                                                    {topic}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-2">
                                        {activeFiltersCount > 0 && (
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedLevel(null);
                                                    setSelectedTopic(null);
                                                    setShowFreeOnly(false);
                                                    setShowNewOnly(false);
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
                                            Show {filteredCourses.length} Course{filteredCourses.length !== 1 ? 's' : ''}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Portal>
                )}

                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Desktop Filters Sidebar - Hidden on Mobile */}
                    <aside className="hidden lg:block lg:w-48 flex-shrink-0">
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

                        {/* Super Compact & Rich Courses Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-2.5 md:gap-3">
                            {filteredCourses.map((course) => (
                                <Link
                                    key={course.id}
                                    href={`/explore/courses/${course.id}`}
                                    className="group relative bg-gradient-to-br from-card via-card/95 to-card/80 dark:from-card dark:via-card/95 dark:to-card/50 border border-border dark:border-input backdrop-blur-sm rounded-lg overflow-hidden hover:shadow-lg dark:hover:shadow-[0_4px_20px_oklch(0.65_0.18_260/0.3)] hover:border-primary/50 dark:hover:border-[oklch(0.75_0.22_260)] transition-all duration-300 hover:-translate-y-1 active:scale-95"
                                >
                                    <StaticWatermark />

                                    {/* Compact Thumbnail with Overlay */}
                                    <div className="relative aspect-[5/2] bg-gradient-to-br from-primary/25 via-primary/15 to-primary/5 dark:from-primary/35 dark:via-primary/20 dark:to-primary/5 flex items-center justify-center border-b border-border dark:border-input group-hover:border-primary/40 transition-colors">
                                        <div className="text-2xl">{course.thumbnail}</div>

                                        {/* Floating Badges on Thumbnail */}
                                        <div className="absolute top-1.5 left-1.5 flex flex-wrap gap-1">
                                            {course.trending && (
                                                <span className="px-1.5 py-1 rounded bg-primary/90 dark:bg-primary/80 text-white text-[8px] font-black flex items-center gap-0.5 shadow-sm backdrop-blur-sm leading-none">
                                                    <TrendingUp className="h-2 w-2" />
                                                    HOT
                                                </span>
                                            )}
                                            {course.price === "Free" && (
                                                <span className="px-1.5 py-1 rounded bg-green-500/90 dark:bg-green-500/80 text-white text-[8px] font-black shadow-sm backdrop-blur-sm leading-none">
                                                    FREE
                                                </span>
                                            )}
                                        </div>

                                        {/* Level Badge on Thumbnail */}
                                        <div className="absolute top-1.5 right-1.5">
                                            <span className="px-2 py-1 rounded bg-card/90 dark:bg-card/80 border border-border/50 dark:border-input/50 text-[9px] font-black text-foreground shadow-sm backdrop-blur-sm leading-none">
                                                {course.level.toUpperCase()}
                                            </span>
                                        </div>

                                        {/* Rating Badge on Thumbnail */}
                                        <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 px-1.5 py-1 rounded bg-card/90 dark:bg-card/80 border border-border/50 dark:border-input/50 shadow-sm backdrop-blur-sm">
                                            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                                            <span className="text-[8px] font-black text-foreground leading-none">{course.rating}</span>
                                        </div>
                                    </div>

                                    <div className="p-2.5 sm:p-3">
                                        {/* Title - More Readable */}
                                        <h3 className="text-sm sm:text-base font-black text-foreground mb-1.5 group-hover:text-primary dark:group-hover:text-[oklch(0.85_0.28_260)] dark:group-hover:drop-shadow-[0_0_8px_oklch(0.65_0.18_260/0.3)] transition-all line-clamp-2 leading-tight tracking-tight">
                                            {course.title}
                                        </h3>

                                        {/* Description - More Readable */}
                                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
                                            {course.description}
                                        </p>

                                        {/* Rich Meta Info Grid */}
                                        <div className="grid grid-cols-3 gap-1.5 mb-2">
                                            <div className="flex flex-col items-center justify-center p-1 rounded bg-accent/50 dark:bg-accent/30 border border-border/50 dark:border-input/30">
                                                <Clock className="h-2.5 w-2.5 text-primary mb-0.5" />
                                                <span className="text-[8px] font-black text-foreground leading-none">{course.duration}</span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center p-1 rounded bg-accent/50 dark:bg-accent/30 border border-border/50 dark:border-input/30">
                                                <Users className="h-2.5 w-2.5 text-primary mb-0.5" />
                                                <span className="text-[8px] font-black text-foreground leading-none">{(course.students / 1000).toFixed(1)}K</span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center p-1 rounded bg-accent/50 dark:bg-accent/30 border border-border/50 dark:border-input/30">
                                                <BookOpen className="h-2.5 w-2.5 text-primary mb-0.5" />
                                                <span className="text-[8px] font-black text-foreground leading-none">{course.topic.slice(0, 4)}</span>
                                            </div>
                                        </div>

                                        {/* Footer with Price */}
                                        <div className="flex items-center justify-between pt-1.5 border-t border-border dark:border-input/50">
                                            <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-wide">
                                                Enroll Now
                                            </span>
                                            <span className="text-sm font-black text-primary dark:text-primary group-hover:text-primary dark:group-hover:text-[oklch(0.85_0.28_260)] transition-colors">
                                                {course.price}
                                            </span>
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
