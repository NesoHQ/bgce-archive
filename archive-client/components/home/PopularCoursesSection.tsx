"use client";

import Link from "next/link";
import { ArrowRight, Clock, Users, Star, Play, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PopularCoursesSection() {
    const courses = [
        {
            id: 1,
            title: "Go Fundamentals",
            description: "Master the basics of Go programming from syntax to concurrency",
            instructor: "John Doe",
            duration: "8 hours",
            students: "2.5K",
            rating: 4.8,
            level: "Beginner",
            lessons: 42,
        },
        {
            id: 2,
            title: "Building REST APIs",
            description: "Create production-ready REST APIs with Go and best practices",
            instructor: "Jane Smith",
            duration: "12 hours",
            students: "3.2K",
            rating: 4.9,
            level: "Intermediate",
            lessons: 56,
        },
        {
            id: 3,
            title: "Microservices Architecture",
            description: "Design and build scalable microservices with Go",
            instructor: "Mike Johnson",
            duration: "15 hours",
            students: "1.8K",
            rating: 4.7,
            level: "Advanced",
            lessons: 68,
        },
        {
            id: 4,
            title: "Testing in Go",
            description: "Write comprehensive tests and achieve high code coverage",
            instructor: "Sarah Wilson",
            duration: "6 hours",
            students: "2.1K",
            rating: 4.6,
            level: "Intermediate",
            lessons: 38,
        },
    ];

    const getLevelColor = (level: string) => {
        switch (level) {
            case "Beginner":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "Intermediate":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "Advanced":
                return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            default:
                return "bg-primary/10 text-primary border-primary/20";
        }
    };

    return (
        <section className="py-10 lg:py-12 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 gap-3">
                    <div className="space-y-1">
                        <h2 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                            Popular Courses
                        </h2>
                        <p className="text-sm text-muted-foreground max-w-2xl">
                            Start learning with our most popular courses
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="hidden sm:flex hover:bg-accent hover:scale-105 transition-all duration-200"
                    >
                        <Link href="/explore/courses">
                            View All
                            <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </Link>
                    </Button>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {courses.map((course) => (
                        <Link
                            key={course.id}
                            href={`/explore/courses/${course.id}`}
                            className="group relative bg-gradient-to-br from-card to-card/80 dark:from-card dark:to-card/50 border-2 border-border rounded-lg p-4 
                                hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 
                                hover:border-primary/50 hover:ring-2 hover:ring-primary/20
                                transition-all duration-300 ease-out backdrop-blur-sm
                                focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            {/* Level Badge */}
                            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold mb-3 border ${getLevelColor(course.level)}`}>
                                {course.level}
                            </div>

                            {/* Title */}
                            <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                                {course.title}
                            </h3>

                            {/* Description */}
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                                {course.description}
                            </p>

                            {/* Instructor */}
                            <p className="text-[10px] text-muted-foreground mb-3">
                                by <span className="font-semibold text-foreground">{course.instructor}</span>
                            </p>

                            {/* Rating & Students */}
                            <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-border">
                                <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                    <span className="text-xs font-semibold text-foreground">{course.rating}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                    <Users className="h-3 w-3" />
                                    <span>{course.students}</span>
                                </div>
                            </div>

                            {/* Meta Info */}
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-primary" />
                                    <span className="font-medium">{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <BookOpen className="h-3 w-3 text-primary" />
                                    <span className="font-medium">{course.lessons} lessons</span>
                                </div>
                            </div>

                            {/* Hover Play Icon */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="p-1.5 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
                                    <Play className="h-3 w-3 fill-current" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Mobile View All Button */}
                <div className="mt-6 sm:hidden">
                    <Button variant="outline" asChild className="w-full h-10 rounded-lg border-2">
                        <Link href="/explore/courses">
                            View All Courses
                            <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
