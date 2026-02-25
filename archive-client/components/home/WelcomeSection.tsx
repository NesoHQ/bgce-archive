"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, BookOpen, Award, ChevronDown } from "lucide-react";

export function WelcomeSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background min-h-[85vh] flex items-center">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                <div className="max-w-5xl mx-auto text-center space-y-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold animate-fade-in backdrop-blur-sm hover:bg-primary/15 transition-colors">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        Welcome to BGCE Archive
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground animate-fade-in-up leading-tight">
                        Learn, Build, and Grow with the{" "}
                        <span className="relative inline-block">
                            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-gradient">
                                Best Golang Community
                            </span>
                            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary/30 to-transparent rounded-full" />
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up delay-200 leading-relaxed">
                        Access expert-led courses, hands-on projects, and a thriving community of developers.
                        Start your journey to mastering Go and beyond.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300 pt-4">
                        <Button
                            size="lg"
                            asChild
                            className="min-h-[56px] px-8 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-200 text-base font-semibold group"
                        >
                            <Link href="/explore/courses">
                                Explore Courses
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            asChild
                            className="min-h-[56px] px-8 rounded-2xl border-2 hover:bg-accent hover:scale-105 active:scale-95 transition-all duration-200 text-base font-semibold"
                        >
                            <Link href="/projects">
                                Browse Projects
                            </Link>
                        </Button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground animate-fade-in-up delay-500">
                        <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-primary" />
                            <span>Industry Recognized</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            <span>10K+ Active Learners</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <span>500+ Resources</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <ChevronDown className="h-6 w-6 text-muted-foreground" />
            </div>
        </section>
    );
}
