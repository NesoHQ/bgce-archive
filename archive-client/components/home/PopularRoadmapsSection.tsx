"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, Clock, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PopularRoadmapsSection() {
    const roadmaps = [
        {
            id: 1,
            title: "Go Backend Development",
            description: "Master backend development with Go, from basics to advanced microservices",
            category: "Backend",
            progress: 75,
            duration: "12 weeks",
            students: "2.5K",
            rating: 4.8,
            trending: true,
        },
        {
            id: 2,
            title: "System Design Mastery",
            description: "Learn to design scalable systems and ace system design interviews",
            category: "Architecture",
            progress: 60,
            duration: "8 weeks",
            students: "3.2K",
            rating: 4.9,
            trending: true,
        },
        {
            id: 3,
            title: "Cloud Native with Kubernetes",
            description: "Deploy and manage containerized applications in production",
            category: "DevOps",
            progress: 45,
            duration: "10 weeks",
            students: "1.8K",
            rating: 4.7,
            trending: false,
        },
        {
            id: 4,
            title: "Full Stack Go Developer",
            description: "Build complete web applications with Go and modern frontend frameworks",
            category: "Full Stack",
            progress: 30,
            duration: "16 weeks",
            students: "2.1K",
            rating: 4.6,
            trending: true,
        },
    ];

    return (
        <section className="py-20 lg:py-28 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
                    <div className="space-y-3">
                        <h2 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                            Popular Roadmaps
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl">
                            Structured learning paths designed by experts to help you achieve your goals
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        asChild
                        className="hidden sm:flex hover:bg-accent hover:scale-105 transition-all duration-200"
                    >
                        <Link href="/roadmap">
                            View All
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Roadmap Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {roadmaps.map((roadmap) => (
                        <Link
                            key={roadmap.id}
                            href={`/roadmap/${roadmap.id}`}
                            className="group relative bg-card border-2 border-border rounded-2xl p-6 
                                hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 
                                hover:border-primary/50 hover:ring-2 hover:ring-primary/20
                                transition-all duration-300 ease-out
                                focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            {/* Trending Badge */}
                            {roadmap.trending && (
                                <div className="absolute -top-3 -right-3 flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg animate-pulse">
                                    <TrendingUp className="h-3 w-3" />
                                    Trending
                                </div>
                            )}

                            {/* Category Badge */}
                            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20">
                                {roadmap.category}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                                {roadmap.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-muted-foreground mb-5 line-clamp-2 leading-relaxed">
                                {roadmap.description}
                            </p>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-4">
                                <Star className="h-4 w-4 fill-primary text-primary" />
                                <span className="text-sm font-semibold text-foreground">{roadmap.rating}</span>
                                <span className="text-xs text-muted-foreground ml-1">({roadmap.students} students)</span>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-5">
                                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-2">
                                    <span>Completion</span>
                                    <span className="text-primary">{roadmap.progress}%</span>
                                </div>
                                <div className="h-2.5 bg-accent rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out group-hover:from-primary/90 group-hover:to-primary"
                                        style={{ width: `${roadmap.progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 text-primary" />
                                    <span className="font-medium">{roadmap.duration}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Users className="h-3.5 w-3.5 text-primary" />
                                    <span className="font-medium">{roadmap.students}</span>
                                </div>
                            </div>

                            {/* Hover Arrow */}
                            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ArrowRight className="h-5 w-5 text-primary" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Mobile View All Button */}
                <div className="mt-10 sm:hidden">
                    <Button variant="outline" asChild className="w-full min-h-[48px] rounded-xl border-2">
                        <Link href="/roadmap">
                            View All Roadmaps
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
