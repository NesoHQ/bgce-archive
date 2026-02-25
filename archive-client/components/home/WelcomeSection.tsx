"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Zap, Terminal } from "lucide-react";

export function WelcomeSection() {
    return (
        <section className="relative overflow-hidden border-b border-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border border-primary/20 dark:border-primary/30 text-primary text-xs font-mono uppercase tracking-wider backdrop-blur-sm">
                                <Zap className="h-3 w-3" />
                                Best Golang Community Ever
                            </div>

                            {/* Headline */}
                            <div className="space-y-4">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                                    Master Go.{" "}
                                    <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 dark:from-primary dark:via-primary/90 dark:to-primary/70 bg-clip-text text-transparent">
                                        Build Better.
                                    </span>
                                </h1>
                                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                                    Learn from expert-led courses, build real-world projects, and join a thriving community of Go developers.
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap items-center gap-4">
                                <Button
                                    size="lg"
                                    asChild
                                    className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all group"
                                >
                                    <Link href="/explore/courses">
                                        Start Learning
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    asChild
                                    className="h-12 px-6 rounded-xl border-2 bg-gradient-to-r from-background to-muted/50 hover:from-muted/50 hover:to-muted transition-all"
                                >
                                    <Link href="/archive">
                                        Browse Archive
                                    </Link>
                                </Button>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-8 pt-4">
                                <div>
                                    <div className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">500+</div>
                                    <div className="text-sm text-muted-foreground">Courses</div>
                                </div>
                                <div className="w-px h-12 bg-gradient-to-b from-transparent via-border to-transparent" />
                                <div>
                                    <div className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">10K+</div>
                                    <div className="text-sm text-muted-foreground">Learners</div>
                                </div>
                                <div className="w-px h-12 bg-gradient-to-b from-transparent via-border to-transparent" />
                                <div>
                                    <div className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">1K+</div>
                                    <div className="text-sm text-muted-foreground">Projects</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Visual */}
                        <div className="relative hidden lg:block">
                            <div className="relative">
                                {/* Code Window */}
                                <div className="rounded-2xl border-2 border-border bg-gradient-to-br from-card to-card/80 dark:from-card dark:to-card/50 shadow-2xl shadow-primary/10 overflow-hidden backdrop-blur-sm">
                                    {/* Window Header */}
                                    <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-muted to-muted/80 dark:from-muted/80 dark:to-muted/50 border-b border-border backdrop-blur-sm">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-sm" />
                                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-sm" />
                                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-sm" />
                                        </div>
                                        <div className="flex-1 text-center">
                                            <span className="text-xs font-mono text-muted-foreground">main.go</span>
                                        </div>
                                    </div>

                                    {/* Code Content */}
                                    <div className="p-6 font-mono text-sm space-y-2 bg-gradient-to-br from-background/50 to-muted/30 dark:from-background/30 dark:to-muted/20">
                                        <div className="text-muted-foreground">
                                            <span className="text-purple-500 dark:text-purple-400">package</span> main
                                        </div>
                                        <div className="h-4" />
                                        <div className="text-muted-foreground">
                                            <span className="text-purple-500 dark:text-purple-400">import</span> <span className="text-green-600 dark:text-green-400">"fmt"</span>
                                        </div>
                                        <div className="h-4" />
                                        <div className="text-muted-foreground">
                                            <span className="text-purple-500 dark:text-purple-400">func</span> <span className="text-blue-600 dark:text-blue-400">main</span>() {"{"}
                                        </div>
                                        <div className="pl-4 text-muted-foreground">
                                            fmt.<span className="text-yellow-600 dark:text-yellow-400">Println</span>(<span className="text-green-600 dark:text-green-400">"Welcome to BGCE!"</span>)
                                        </div>
                                        <div className="text-muted-foreground">{"}"}</div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute -top-4 -right-4 p-4 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/30">
                                    <Code2 className="h-6 w-6" />
                                </div>
                                <div className="absolute -bottom-4 -left-4 p-4 rounded-xl bg-gradient-to-br from-card to-card/80 dark:from-card dark:to-card/50 border-2 border-border shadow-xl backdrop-blur-sm">
                                    <Terminal className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
