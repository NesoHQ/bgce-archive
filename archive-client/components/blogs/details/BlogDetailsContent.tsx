import React, { useMemo } from "react";
import { Calendar, Clock, Eye, Hash } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ApiPost } from "@/types/blog.type";

interface BlogDetailsContentProps {
    post: ApiPost;
    tags: string[];
    readTime: string;
    getAuthorInitials: (userId: number) => string;
    getAuthorColor: (userId: number) => string;
}

export function BlogDetailsContent({
    post,
    tags,
    readTime,
    getAuthorInitials,
    getAuthorColor
}: BlogDetailsContentProps) {
    const renderedContent = useMemo(() => (
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
    ), [post.content]);

    return (
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
            {renderedContent}
        </article>
    );
}
