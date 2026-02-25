"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Zap, Terminal, BookOpen, Users, Award, Rocket } from "lucide-react";

type TechStack = "go" | "docker" | "k8s";

const codeExamples = {
    go: {
        filename: "server.go",
        lines: [
            'package main',
            '',
            'import (',
            '    "net/http"',
            '    "github.com/gin-gonic/gin"',
            ')',
            '',
            'func main() {',
            '    r := gin.Default()',
            '    r.GET("/api/v1", handler)',
            '    r.Run(":8080")',
            '}',
        ]
    },
    docker: {
        filename: "Dockerfile",
        lines: [
            'FROM golang:1.21-alpine AS builder',
            '',
            'WORKDIR /app',
            'COPY go.* ./',
            'RUN go mod download',
            '',
            'COPY . .',
            'RUN go build -o server .',
            '',
            'FROM alpine:latest',
            'COPY --from=builder /app/server .',
            'CMD ["./server"]',
        ]
    },
    k8s: {
        filename: "deployment.yaml",
        lines: [
            'apiVersion: apps/v1',
            'kind: Deployment',
            'metadata:',
            '  name: api-server',
            'spec:',
            '  replicas: 3',
            '  selector:',
            '    matchLabels:',
            '      app: api',
            '  template:',
            '    metadata:',
            '      labels:',
            '        app: api',
            '    spec:',
            '      containers:',
            '        - name: server',
            '          image: api:latest',
            '          ports:',
            '            - containerPort: 8080',
        ]
    }
};

export function WelcomeSection() {
    const [activeTech, setActiveTech] = useState<TechStack>("go");
    const [displayedLines, setDisplayedLines] = useState<string[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        setDisplayedLines([]);
        setIsTyping(true);

        const currentCode = codeExamples[activeTech];
        let lineIndex = 0;

        intervalRef.current = setInterval(() => {
            if (lineIndex < currentCode.lines.length) {
                setDisplayedLines(prev => [...prev, currentCode.lines[lineIndex]]);
                lineIndex++;
            } else {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
                setIsTyping(false);
            }
        }, 80);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [activeTech]);

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
                                        <span className="text-[10px] font-mono text-muted-foreground">{codeExamples[activeTech].filename}</span>
                                    </div>
                                </div>

                                {/* Code Content */}
                                <div className="p-4 text-xs space-y-1.5 bg-gradient-to-br from-background/50 to-muted/30 dark:from-background/30 dark:to-muted/20 h-[320px] overflow-y-auto custom-scrollbar font-mono">
                                    {displayedLines.map((line, index) => (
                                        <div
                                            key={`${activeTech}-${index}`}
                                            className="text-muted-foreground whitespace-pre"
                                        >
                                            {line || '\u00A0'}
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <span className="inline-block w-1.5 h-3.5 bg-primary animate-pulse ml-0.5" />
                                    )}
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -top-3 -right-3 p-3 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/30">
                                <Code2 className="h-4 w-4" />
                            </div>
                            <div className="absolute -bottom-3 -left-3 p-3 rounded-lg bg-gradient-to-br from-card to-card/80 dark:from-card dark:to-card/50 border-2 border-border shadow-xl backdrop-blur-sm">
                                <Terminal className="h-4 w-4 text-primary" />
                            </div>

                            {/* Tech Stack Buttons */}
                            <div className="absolute -bottom-6 right-4 flex items-center gap-2">
                                <button
                                    onClick={() => setActiveTech("go")}
                                    className={`px-3 py-1.5 rounded-md border shadow-lg backdrop-blur-sm transition-all ${activeTech === "go"
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-card border-border hover:border-primary/50"
                                        }`}
                                >
                                    <span className="text-[9px] font-semibold">Go</span>
                                </button>
                                <button
                                    onClick={() => setActiveTech("docker")}
                                    className={`px-3 py-1.5 rounded-md border shadow-lg backdrop-blur-sm transition-all ${activeTech === "docker"
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-card border-border hover:border-primary/50"
                                        }`}
                                >
                                    <span className="text-[9px] font-semibold">Docker</span>
                                </button>
                                <button
                                    onClick={() => setActiveTech("k8s")}
                                    className={`px-3 py-1.5 rounded-md border shadow-lg backdrop-blur-sm transition-all ${activeTech === "k8s"
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-card border-border hover:border-primary/50"
                                        }`}
                                >
                                    <span className="text-[9px] font-semibold">K8s</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: hsl(var(--primary) / 0.3);
                    border-radius: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: hsl(var(--primary) / 0.5);
                }
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: hsl(var(--primary) / 0.3) transparent;
                }
            `}</style>
        </section>
    );
}
