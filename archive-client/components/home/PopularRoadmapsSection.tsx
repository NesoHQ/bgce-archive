"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, Clock, Users } from "lucide-react";
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
            trending: true,
        },
    ];

    return (
        <section className="py-16 lg:py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground">Popular Roadmaps & Learning Guides</h2>
                        <p className="text-muted-foreground mt-2">Structured paths to achieve your learning goals</p>
                    </div>
                    <Button variant="ghost" asChild>
                        <Link href="/roadmap">
                            View All
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Roadmap Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {roadmaps.map((roadmap) => (
                        <Link
                            key={roadmap.id}
                            href={`/roadmap/${roadmap.id}`}
                            className="group relative bg-card border border-border rounded-xl p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/50 transition-all duration-300"
                        >
                            {/* Trending Badge */}
                            {roadmap.trending && (
                                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                    <TrendingUp className="h-3 w-3" />
                                    Trending
                                </div>
                            )}

                            {/* Category */}
                            <div className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-medium text-foreground mb-4">
                                {roadmap.category}
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                {roadmap.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {roadmap.description}
                            </p>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                    <span>Progress</span>
                                    <span>{roadmap.progress}%</span>
                                </div>
                                <div className="h-2 bg-accent rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-300"
                                        style={{ width: `${roadmap.progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {roadmap.duration}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {roadmap.students}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>


            </div>
        </section>
    );
}
