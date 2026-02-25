"use client";

import { MainNavigation } from "@/components/shared/MainNavigation";
import Footer from "@/components/shared/Footer";
import { AlertTriangle, ArrowLeft, BookOpen, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col bg-background">
            <MainNavigation />

            <section className="relative flex-1 flex items-center justify-center overflow-hidden py-32">
                {/* Technical Grid Background */}
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />

                {/* Glowing Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[140px]" />

                <div className="container px-6 mx-auto relative z-10">
                    <div className="max-w-3xl mx-auto text-center space-y-12">
                        {/* Error Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-destructive/20 bg-destructive/5 text-[10px] font-mono uppercase tracking-[0.3em] text-destructive mx-auto">
                            <AlertTriangle className="h-4 w-4 animate-pulse" />
                            Archive Alert
                        </div>

                        {/* Error Code Display */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-3xl" />
                            <div className="relative p-12 rounded-[2.5rem] bg-gradient-to-br from-card/60 to-card/40 border-2 border-white/10 backdrop-blur-2xl space-y-6 shadow-2xl">
                                <div className="flex items-center justify-center gap-4">
                                    <BookOpen className="h-8 w-8 text-primary" />
                                    <h1 className="text-8xl md:text-9xl font-bold font-mono tracking-tighter text-primary">
                                        404
                                    </h1>
                                </div>

                                <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                                <div className="space-y-3">
                                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                                        Article Not Found
                                    </h2>
                                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                                        The knowledge you&apos;re seeking has drifted beyond our archive.
                                        This entry doesn&apos;t exist in our vault.
                                    </p>
                                </div>

                                {/* Terminal-style error log */}
                                <div className="p-6 rounded-2xl bg-muted/80 border-2 border-white/10 font-mono text-left max-w-lg mx-auto shadow-lg">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex gap-2">
                                            <span className="text-primary">$</span>
                                            <span className="text-muted-foreground">
                                                bgce-archive locate --path=
                                                <span className="text-destructive">unknown</span>
                                            </span>
                                        </div>
                                        <div className="text-destructive/70 text-xs pl-4">
                                            ERROR: Article not found in knowledge vault
                                        </div>
                                        <div className="text-muted-foreground/50 text-xs pl-4">
                                            Suggestion: Return to archive index
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/"
                                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-mono uppercase tracking-widest text-xs group shadow-lg hover:shadow-xl hover:-translate-y-1"
                            >
                                <ArrowLeft className="h-4 w-4 transition-transform duration-300 ease-in-out group-hover:-translate-x-2" />
                                Return Home
                            </Link>

                            <Link
                                href="/archive"
                                className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-white/20 bg-card/50 backdrop-blur-md hover:bg-card/70 hover:border-primary/30 transition-all font-mono uppercase tracking-widest text-xs group shadow-lg hover:shadow-xl hover:-translate-y-1"
                            >
                                <Search className="h-4 w-4 transition-transform duration-300 ease-in-out group-hover:scale-110" />
                                Browse Archive
                            </Link>
                        </div>

                        {/* Technical Diagnostics */}
                        <div className="pt-8 border-t border-white/10">
                            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-card/60 to-card/40 border-2 border-white/10 shadow-lg">
                                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">
                                        Status Code
                                    </div>
                                    <div className="text-2xl font-bold text-destructive">404</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-card/60 to-card/40 border-2 border-white/10 shadow-lg">
                                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">
                                        Error Type
                                    </div>
                                    <div className="text-2xl font-bold">Not Found</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-card/60 to-card/40 border-2 border-white/10 shadow-lg">
                                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">
                                        Protocol
                                    </div>
                                    <div className="text-2xl font-bold text-primary">BGCE-1</div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="pt-6">
                            <p className="text-sm text-muted-foreground mb-4 font-mono uppercase tracking-wider">
                                Quick Navigation
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center">
                                <Link
                                    href="/archive"
                                    className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors font-mono"
                                >
                                    All Articles
                                </Link>
                                <span className="text-muted-foreground">•</span>
                                <Link
                                    href="/"
                                    className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors font-mono"
                                >
                                    Popular Posts
                                </Link>
                                <span className="text-muted-foreground">•</span>
                                <Link
                                    href="/"
                                    className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors font-mono"
                                >
                                    Recent Questions
                                </Link>
                                <span className="text-muted-foreground">•</span>
                                <Link
                                    href="/knowledge-center"
                                    className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors font-mono"
                                >
                                    Knowledge Center
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
