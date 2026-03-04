import Link from "next/link";
import Image from "next/image";
import { Eye, Clock, Flame, Sparkles, ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ApiPostListItem } from "@/types/blog.type";

interface BlogCardProps {
    blog: ApiPostListItem & { thumbnail?: string; og_image?: string };
}

const getAuthorInitials = (userId: number) => `U${userId}`;

const getAuthorColor = (userId: number) => {
    const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-red-500", "bg-yellow-500", "bg-pink-500"];
    return colors[userId % colors.length];
};

const formatReadTime = (readTime: number) => {
    return readTime > 0 ? `${readTime} min` : "1 min";
};

const formatViewCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
};

const getTags = (keywords?: string) => {
    if (!keywords) return [];
    return keywords.split(',').map(k => k.trim()).slice(0, 2);
};

export function BlogCard({ blog }: BlogCardProps) {
    const blogImage = blog.thumbnail || blog.og_image;

    return (
        <Link
            href={`/blogs/${blog.slug}`}
            className="group relative bg-gradient-to-br from-card via-card/95 to-card/80 border border-border backdrop-blur-sm rounded-lg overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300 hover:-translate-y-0.5"
        >
            {/* Image Section */}
            {blogImage ? (
                <div className="relative w-full h-32 sm:h-40 overflow-hidden bg-muted">
                    <Image
                        src={blogImage}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Badges on Image */}
                    <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
                        <div className="flex flex-wrap gap-1.5">
                            {getTags(blog.keywords).map((tag) => (
                                <span key={tag} className="text-[9px] font-mono font-bold text-white bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        {blog.is_featured && (
                            <span className="flex items-center gap-0.5 px-1.5 py-1 rounded bg-orange-500/90 backdrop-blur-sm text-white border border-orange-400/30 text-[8px] font-black leading-none">
                                <Flame className="h-2 w-2" />
                                HOT
                            </span>
                        )}
                    </div>
                </div>
            ) : (
                <div className="relative w-full h-32 sm:h-40 bg-gradient-to-br from-muted via-muted/80 to-muted/60 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/30" />

                    {/* Badges on Placeholder */}
                    <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
                        <div className="flex flex-wrap gap-1.5">
                            {getTags(blog.keywords).map((tag) => (
                                <span key={tag} className="text-[9px] font-mono font-bold text-muted-foreground bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        {blog.is_featured && (
                            <span className="flex items-center gap-0.5 px-1.5 py-1 rounded bg-orange-500/10 text-orange-600 border border-orange-500/20 text-[8px] font-black leading-none backdrop-blur-sm">
                                <Flame className="h-2 w-2" />
                                HOT
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Content Section */}
            <div className="p-3 sm:p-4">
                <h2 className="text-sm sm:text-base font-black text-foreground mb-2 group-hover:text-primary transition-all line-clamp-2 leading-tight">
                    {blog.title}
                </h2>

                <p className="text-[10px] sm:text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                    {blog.summary || blog.meta_description || "No description available"}
                </p>

                {/* Author Section */}
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
                    <Avatar className="h-5 w-5 border border-border">
                        <AvatarFallback className={`${getAuthorColor(blog.created_by)} text-white text-[8px]`}>
                            {getAuthorInitials(blog.created_by)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-foreground truncate">User {blog.created_by}</p>
                        <p className="text-[8px] text-muted-foreground">
                            {new Date(blog.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                    </div>
                </div>

                {/* Stats Section - Parallel Layout */}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 font-medium">
                            <Eye className="h-3 w-3" />
                            {formatViewCount(blog.view_count)}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                            <Clock className="h-3 w-3" />
                            {formatReadTime(blog.read_time)}
                        </span>
                    </div>

                    {blog.is_pinned && (
                        <span className="flex items-center gap-1 text-primary font-bold">
                            <Sparkles className="h-3 w-3" />
                            Pinned
                        </span>
                    )}
                </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent"></div>
            </div>
        </Link>
    );
}
