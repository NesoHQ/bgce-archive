"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Eye,
    ThumbsUp,
    MessageSquare,
    Share2,
    Bookmark,
    Twitter,
    Facebook,
    Linkedin,
    Link2,
    ChevronRight
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ApiPost } from "@/types/blog.type";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BlogDetailsClientProps {
    post: ApiPost;
}

export default function BlogDetailsClient({ post }: BlogDetailsClientProps) {
    const router = useRouter();

    // Helper functions
    const getAuthorInitials = (userId: number) => `U${userId}`;
    const getAuthorColor = (userId: number) => {
        const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-red-500", "bg-yellow-500", "bg-pink-500"];
        return colors[userId % colors.length];
    };

    const calculateReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min`;
    };

    const getTags = (keywords?: string) => {
        if (!keywords) return [];
        return keywords.split(',').map(k => k.trim());
    };

    const tags = getTags(post.keywords);
    const readTime = calculateReadTime(post.content);

    return (
        <div className="min-h-screen bg-background">
            {/* Header with breadcrumb */}
            <div className="border-b border-border/50 bg-gradient-to-b from-background to-muted/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link href="/" className="hover:text-primary transition-colors">
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/blogs" className="hover:text-primary transition-colors">
                            Blogs
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground font-medium truncate max-w-[200px]">
                            {post.title}
                        </span>
                    </div>

                    <Button
                        variant="ghost"
                        onClick={() => router.push("/blogs")}
                        className="group mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                        Back to Blogs
                    </Button>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content */}
                    <article className="lg:col-span-8">
                        {/* Article Header */}
                        <div className="mb-8">
                            {/* Badges */}
                            <div className="flex items-center gap-2 mb-4">
                                {post.is_featured && (
                                    <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20">
                                        🔥 Featured
                                    </Badge>
                                )}
                                {post.is_pinned && (
                                    <Badge className="bg-primary/10 text-primary border-primary/20">
                                        📌 Pinned
                                    </Badge>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-6 leading-tight">
                                {post.title}
                            </h1>

                            {/* Summary */}
                            {post.summary && (
                                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                    {post.summary}
                                </p>
                            )}

                            {/* Author & Meta */}
                            <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12 border-2 border-border">
                                        <AvatarFallback className={`${getAuthorColor(post.created_by)} text-white font-bold`}>
                                            {getAuthorInitials(post.created_by)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-foreground">User {post.created_by}</p>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(post.created_at).toLocaleDateString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {readTime}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        {post.view_count.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Article Content */}
                        <div className="prose prose-lg dark:prose-invert max-w-none mb-8 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-code:text-primary prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:border prose-img:border-border">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {post.content}
                            </ReactMarkdown>
                        </div>

                        {/* Tags */}
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-border">
                                {tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="cursor-pointer hover:bg-primary hover:text-white dark:hover:text-white transition-colors"
                                    >
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between mb-8 p-6 rounded-lg border-2 border-border dark:border-input bg-card/50 dark:bg-card/30">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    className="gap-2 border-2 dark:border-input dark:hover:border-[oklch(0.75_0.22_260)] dark:hover:bg-[oklch(0.28_0.06_260)] dark:hover:text-[oklch(0.85_0.28_260)]"
                                >
                                    <ThumbsUp className="h-4 w-4" />
                                    Like
                                </Button>
                                <Button
                                    variant="outline"
                                    className="gap-2 border-2 dark:border-input dark:hover:border-[oklch(0.75_0.22_260)] dark:hover:bg-[oklch(0.28_0.06_260)] dark:hover:text-[oklch(0.85_0.28_260)]"
                                >
                                    <Bookmark className="h-4 w-4" />
                                    Save
                                </Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground mr-2">Share:</span>
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <Twitter className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <Facebook className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <Linkedin className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <Link2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Author Bio */}
                        <div className="p-6 rounded-lg border-2 border-border dark:border-input bg-gradient-to-br from-card via-card/95 to-card/80 dark:from-card dark:via-card/95 dark:to-card/50">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-16 w-16 border-2 border-border">
                                    <AvatarFallback className={`${getAuthorColor(post.created_by)} text-white text-xl font-bold`}>
                                        {getAuthorInitials(post.created_by)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-foreground mb-2">About User {post.created_by}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Community contributor sharing knowledge and insights about Go programming and software development.
                                    </p>
                                    <Button variant="outline" size="sm" className="border-2">
                                        Follow
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-20 space-y-6">
                            {/* Post Info */}
                            <div className="p-6 rounded-lg border-2 border-border dark:border-input bg-card/50 dark:bg-card/30">
                                <h3 className="text-lg font-bold text-foreground mb-4">Post Information</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Published:</span>
                                        <span className="font-semibold text-foreground">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Updated:</span>
                                        <span className="font-semibold text-foreground">
                                            {new Date(post.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Views:</span>
                                        <span className="font-semibold text-foreground">
                                            {post.view_count.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Read Time:</span>
                                        <span className="font-semibold text-foreground">{readTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Version:</span>
                                        <span className="font-semibold text-foreground">v{post.version}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Newsletter */}
                            <div className="p-6 rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5">
                                <h3 className="text-lg font-bold text-foreground mb-2">Stay Updated</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Get the latest articles delivered to your inbox.
                                </p>
                                <Button className="w-full bg-gradient-to-r from-[oklch(0.4_0.14_260)] to-[oklch(0.35_0.12_260)] hover:from-[oklch(0.45_0.16_260)] hover:to-[oklch(0.4_0.14_260)] dark:from-[oklch(0.65_0.18_260)] dark:to-[oklch(0.6_0.16_260)] dark:hover:from-[oklch(0.75_0.22_260)] dark:hover:to-[oklch(0.7_0.2_260)] text-white dark:text-white">
                                    Subscribe
                                </Button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
