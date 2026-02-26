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
    Bookmark,
    Twitter,
    Facebook,
    Linkedin,
    Link2,
    ChevronRight,
    User,
    TrendingUp,
    Hash,
    Bell
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
            {/* Header Breadcrumb */}
            <div className="border-b border-border/40 bg-muted/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                            <ChevronRight className="h-3 w-3" />
                            <Link href="/blogs" className="hover:text-primary transition-colors">Blogs</Link>
                            <ChevronRight className="h-3 w-3" />
                            <span className="text-foreground font-medium truncate max-w-[150px] sm:max-w-[300px]">{post.title}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => router.push("/blogs")} className="h-8 text-xs">
                            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                            Back
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Article Content - Left Side */}
                    <article className="lg:col-span-8 space-y-4">

                        {/* Badges */}
                        {(post.is_featured || post.is_pinned) && (
                            <div className="flex items-center gap-2">
                                {post.is_featured && (
                                    <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 h-6 px-2.5">
                                        🔥 Featured
                                    </Badge>
                                )}
                                {post.is_pinned && (
                                    <Badge className="bg-primary/10 text-primary border-primary/20 h-6 px-2.5">
                                        📌 Pinned
                                    </Badge>
                                )}
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                            {post.title}
                        </h1>

                        {/* Author & Meta */}
                        <div className="flex flex-wrap items-center gap-3 pb-4 border-b">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8 border-2 border-border">
                                    <AvatarFallback className={`${getAuthorColor(post.created_by)} text-white text-xs font-bold`}>
                                        {getAuthorInitials(post.created_by)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-semibold">User {post.created_by}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    {readTime}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Eye className="h-4 w-4" />
                                    {post.view_count.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Summary */}
                        {post.summary && (
                            <div className="bg-muted/50 border-l-4 border-primary rounded-r-lg p-4">
                                <p className="text-sm text-muted-foreground italic leading-relaxed">
                                    {post.summary}
                                </p>
                            </div>
                        )}

                        {/* Tags */}
                        {tags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                                <Hash className="h-4 w-4 text-muted-foreground" />
                                {tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="h-6 px-2.5 cursor-pointer hover:bg-primary hover:text-white transition-colors">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Article Body */}
                        <div className="prose prose-base dark:prose-invert max-w-none
                            prose-headings:font-bold prose-headings:text-foreground
                            prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-8
                            prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-6
                            prose-h3:text-lg prose-h3:mb-2 prose-h3:mt-5
                            prose-p:text-base prose-p:leading-relaxed prose-p:mb-4
                            prose-a:text-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                            prose-strong:font-bold prose-strong:text-foreground
                            prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                            prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg prose-pre:p-4 prose-pre:my-4
                            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:italic prose-blockquote:my-4
                            prose-ul:my-4 prose-ol:my-4 prose-li:my-1
                            prose-img:rounded-lg prose-img:shadow-lg prose-img:my-6
                            prose-table:my-4 prose-th:p-3 prose-td:p-3
                            prose-hr:my-8
                        ">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {post.content}
                            </ReactMarkdown>
                        </div>
                    </article>

                    {/* Sidebar - Right Side */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-20 space-y-4">

                            {/* Actions */}
                            <div className="bg-card border rounded-lg p-4">
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    <button className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors group">
                                        <ThumbsUp className="h-5 w-5" />
                                        <span className="text-xs font-medium">Like</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors group">
                                        <Bookmark className="h-5 w-5" />
                                        <span className="text-xs font-medium">Save</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors group">
                                        <MessageSquare className="h-5 w-5" />
                                        <span className="text-xs font-medium">Comment</span>
                                    </button>
                                </div>
                                <div className="pt-3 border-t">
                                    <p className="text-xs font-medium text-muted-foreground mb-2">Share</p>
                                    <div className="flex gap-2">
                                        <button className="flex-1 p-2 rounded-lg hover:bg-blue-500/10 hover:text-blue-500 transition-colors">
                                            <Twitter className="h-4 w-4 mx-auto" />
                                        </button>
                                        <button className="flex-1 p-2 rounded-lg hover:bg-blue-600/10 hover:text-blue-600 transition-colors">
                                            <Facebook className="h-4 w-4 mx-auto" />
                                        </button>
                                        <button className="flex-1 p-2 rounded-lg hover:bg-blue-700/10 hover:text-blue-700 transition-colors">
                                            <Linkedin className="h-4 w-4 mx-auto" />
                                        </button>
                                        <button className="flex-1 p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                                            <Link2 className="h-4 w-4 mx-auto" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="bg-card border rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingUp className="h-4 w-4 text-primary" />
                                    <h3 className="font-semibold text-sm">Statistics</h3>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Eye className="h-4 w-4" />
                                            <span>Views</span>
                                        </div>
                                        <span className="font-semibold text-sm">{post.view_count.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>Read Time</span>
                                        </div>
                                        <span className="font-semibold text-sm">{readTime}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>Published</span>
                                        </div>
                                        <span className="font-semibold text-sm">
                                            {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Author */}
                            <div className="bg-card border rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <User className="h-4 w-4 text-primary" />
                                    <h3 className="font-semibold text-sm">Author</h3>
                                </div>
                                <div className="flex items-center gap-3 mb-3">
                                    <Avatar className="h-12 w-12 border-2 border-border">
                                        <AvatarFallback className={`${getAuthorColor(post.created_by)} text-white font-bold`}>
                                            {getAuthorInitials(post.created_by)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-sm">User {post.created_by}</p>
                                        <Badge variant="outline" className="text-xs h-5">Author</Badge>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                                    Community contributor sharing knowledge about programming and development.
                                </p>
                                <Button variant="outline" size="sm" className="w-full">
                                    <User className="h-3.5 w-3.5 mr-1.5" />
                                    Follow
                                </Button>
                            </div>

                            {/* Newsletter */}
                            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Bell className="h-4 w-4 text-primary" />
                                    <h3 className="font-semibold text-sm">Stay Updated</h3>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                                    Get the latest articles delivered to your inbox.
                                </p>
                                <Button className="w-full bg-primary hover:bg-primary/90">
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
