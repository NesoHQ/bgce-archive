import React, { memo } from "react";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ApiPostListItem } from "@/types/blog.type";

interface PostCardProps {
    post: ApiPostListItem;
}

// Helper function to format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
};

// Helper function to get initials from title
const getInitials = (title: string) => {
    const words = title.split(' ');
    return words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
};

export const PostCard = memo(function PostCard({ post }: PostCardProps) {
    return (
        <Link
            href={`/blogs/${post.slug}`}
            className="group relative bg-gradient-to-br from-card to-card/80 dark:from-card dark:to-card/50 border-2 border-border rounded-lg p-4 
        hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 
        hover:border-primary/50 hover:ring-2 hover:ring-primary/20
        transition-all duration-300 ease-out backdrop-blur-sm
        focus:outline-none focus:ring-2 focus:ring-primary/50 overflow-hidden"
        >
            {/* Featured Badge */}
            {post.is_featured && (
                <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-semibold mb-2.5 border border-orange-500/20">
                    Featured
                </div>
            )}

            {/* Title */}
            <h3 className="text-base font-bold text-foreground mb-2.5 group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem] leading-tight">
                {post.title}
            </h3>

            {/* Summary */}
            {post.summary && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {post.summary}
                </p>
            )}

            {/* Post Info */}
            <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-border">
                <Avatar className="h-7 w-7 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-[10px] font-bold">
                        {getInitials(post.title)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                        {formatDate(post.created_at)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                        Published
                    </p>
                </div>
            </div>

            {/* Engagement Stats */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1 group/stat hover:text-primary transition-colors">
                    <Eye className="h-3 w-3" />
                    <span className="font-medium text-[10px]">{post.view_count.toLocaleString()}</span>
                </div>
                {post.is_pinned && (
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] font-semibold text-orange-500">📌 Pinned</span>
                    </div>
                )}
            </div>

            {/* Hover Arrow */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="h-3.5 w-3.5 text-primary" />
            </div>
        </Link>
    );
});
