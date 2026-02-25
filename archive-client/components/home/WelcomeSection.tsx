"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function WelcomeSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-fade-in">
                        <Sparkles className="h-4 w-4" />
                        Welcome to BGCE Archive
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground animate-fade-in-up">
                        Learn, Build, and Grow with the{" "}
                        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Best Golang Community
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up delay-200">
                        Access expert-led courses, hands-on projects, and a thriving community of developers.
                        Start your journey to mastering Go and beyond.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                        <Button size="lg" asChild className="rounded-xl shadow-lg shadow-primary/20 group">
                            <Link href="/explore/courses">
                                Explore Courses
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild className="rounded-xl">
                            <Link href="/projects">
                                Browse Projects
                            </Link>
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 animate-fade-in-up delay-500">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-foreground">500+</div>
                            <div className="text-sm text-muted-foreground mt-1">Courses</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-foreground">10K+</div>
                            <div className="text-sm text-muted-foreground mt-1">Students</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-foreground">1K+</div>
                            <div className="text-sm text-muted-foreground mt-1">Projects</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </section>
    );
}
