"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Zap, Terminal, BookOpen, Users, Award, Rocket } from "lucide-react";

export function WelcomeSection() {
    return (
        <section className="relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12 relative">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-5 lg:pr-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border border-primary/20 dark:border-primary/30 text-primary text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm">
                            <Zap className="h-2.5 w-2.5" />
                            Professional Developer Platform
                        </div>

                        {/* Headline */}
                        <div className="space-y-3">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
                                Master Modern Development.{" "}
                                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 dark:from-primary dark:via-primary/90 dark:to-primary/70 bg-clip-text text-transparent">
                                    Build Production-Ready Systems.
                                </span>
                            </h1>
                            <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                                Comprehensive learning platform for backend engineering, cloud infrastructure, and distributed systems.
                                Learn Go, microservices, DevOps, and system design from industry practitioners.
                            </p>
                        </div>

                        {/* Key Features */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-start gap-2">
                                <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-foreground">Structured Curriculum</div>
                                    <div className="text-[10px] text-muted-foreground">From basics to advanced</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                                    <Rocket className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-foreground">Real-World Projects</div>
                                    <div className="text-[10px] text-muted-foreground">Production-grade code</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                                    <Users className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-foreground">Active Community</div>
                                    <div className="text-[10px] text-muted-foreground">Expert mentorship</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                                    <Award className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-foreground">Career Growth</div>
                                    <div className="text-[10px] text-muted-foreground">Interview preparation</div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                size="default"
                                asChild
                                className="h-10 px-5 rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all group"
                            >
                                <Link href="/explore/courses">
                                    Explore Courses
                                    <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button
                                size="default"
                                variant="outline"
                                asChild
                                className="h-10 px-5 rounded-lg border-2 bg-gradient-to-r from-background to-muted/50 hover:from-muted/50 hover:to-muted transition-all"
                            >
                                <Link href="/archive">
                                    View Archive
                                </Link>
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="inline-flex items-center gap-6 px-5 py-3 rounded-full bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 border border-border/50 backdrop-blur-sm">
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent tracking-tight">500+</span>
                                <span className="text-xs font-semibold text-muted-foreground/80 tracking-wide">Courses</span>
                            </div>
                            <div className="w-px h-5 bg-gradient-to-b from-transparent via-border to-transparent" />
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent tracking-tight">10K+</span>
                                <span className="text-xs font-semibold text-muted-foreground/80 tracking-wide">Developers</span>
                            </div>
                            <div className="w-px h-5 bg-gradient-to-b from-transparent via-border to-transparent" />
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold bg-gradient-to-br from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent tracking-tight">98%</span>
                                <span className="text-xs font-semibold text-muted-foreground/80 tracking-wide">Satisfaction</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual */}
                    <div className="relative hidden lg:block lg:pl-8">
                        <div className="relative">
                            {/* Code Window */}
                            <div className="rounded-xl border-2 border-border bg-gradient-to-br from-card to-card/80 dark:from-card dark:to-card/50 shadow-2xl shadow-primary/10 overflow-hidden backdrop-blur-sm">
                                {/* Window Header */}
                                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-muted to-muted/80 dark:from-muted/80 dark:to-muted/50 border-b border-border backdrop-blur-sm">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-sm" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-sm" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-sm" />
                                    </div>
                                    <div className="flex-1 text-center">
                                        <span className="text-[10px] font-mono text-muted-foreground">server.go</span>
                                    </div>
                                </div>

                                {/* Code Content */}
                                <div className="p-4 font-mono text-xs space-y-1.5 bg-gradient-to-br from-background/50 to-muted/30 dark:from-background/30 dark:to-muted/20">
                                    <div className="text-muted-foreground">
                                        <span className="text-purple-500 dark:text-purple-400">package</span> main
                                    </div>
                                    <div className="h-2" />
                                    <div className="text-muted-foreground">
                                        <span className="text-purple-500 dark:text-purple-400">import</span> (
                                    </div>
                                    <div className="pl-3 text-green-600 dark:text-green-400">
                                        "net/http"
                                    </div>
                                    <div className="pl-3 text-green-600 dark:text-green-400">
                                        "github.com/gin-gonic/gin"
                                    </div>
                                    <div className="text-muted-foreground">)</div>
                                    <div className="h-2" />
                                    <div className="text-muted-foreground">
                                        <span className="text-purple-500 dark:text-purple-400">func</span> <span className="text-blue-600 dark:text-blue-400">main</span>() {"{"}
                                    </div>
                                    <div className="pl-3 text-muted-foreground">
                                        r := gin.<span className="text-yellow-600 dark:text-yellow-400">Default</span>()
                                    </div>
                                    <div className="pl-3 text-muted-foreground">
                                        r.<span className="text-yellow-600 dark:text-yellow-400">GET</span>(<span className="text-green-600 dark:text-green-400">"/api/v1"</span>, handler)
                                    </div>
                                    <div className="pl-3 text-muted-foreground">
                                        r.<span className="text-yellow-600 dark:text-yellow-400">Run</span>(<span className="text-green-600 dark:text-green-400">":8080"</span>)
                                    </div>
                                    <div className="text-muted-foreground">{"}"}</div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -top-3 -right-3 p-3 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/30">
                                <Code2 className="h-4 w-4" />
                            </div>
                            <div className="absolute -bottom-3 -left-3 p-3 rounded-lg bg-gradient-to-br from-card to-card/80 dark:from-card dark:to-card/50 border-2 border-border shadow-xl backdrop-blur-sm">
                                <Terminal className="h-4 w-4 text-primary" />
                            </div>

                            {/* Tech Stack Badges */}
                            <div className="absolute -bottom-6 right-4 flex items-center gap-2">
                                <div className="px-2 py-1 rounded-md bg-card border border-border shadow-lg backdrop-blur-sm">
                                    <span className="text-[9px] font-semibold text-primary">Go</span>
                                </div>
                                <div className="px-2 py-1 rounded-md bg-card border border-border shadow-lg backdrop-blur-sm">
                                    <span className="text-[9px] font-semibold text-primary">Docker</span>
                                </div>
                                <div className="px-2 py-1 rounded-md bg-card border border-border shadow-lg backdrop-blur-sm">
                                    <span className="text-[9px] font-semibold text-primary">K8s</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
