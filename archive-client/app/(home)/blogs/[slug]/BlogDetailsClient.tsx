"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { BlogDetailsHeader } from "@/components/blogs/details/BlogDetailsHeader";
import { BlogDetailsContent } from "@/components/blogs/details/BlogDetailsContent";
import { BlogDetailsSidebar } from "@/components/blogs/details/BlogDetailsSidebar";
import { useMemo } from "react";

interface BlogDetailsClientProps {
    slug: string;
}

type PostWithOptionalTags = {
    tags?: string[] | string | null;
};

export default function BlogDetailsClient({ slug }: BlogDetailsClientProps) {
    const router = useRouter();

    const { data: post, isLoading, error } = useQuery({
        queryKey: ["post", slug],
        queryFn: () => api.getPostBySlug(slug),
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });

    // Calculate derived data
    const tags = useMemo(() => {
        if (!post || typeof post !== "object" || !("tags" in post)) return [];

        const rawTags = (post as PostWithOptionalTags).tags;
        if (!rawTags) return [];

        try {
            const parsed = typeof rawTags === "string" ? JSON.parse(rawTags) : rawTags;
            return Array.isArray(parsed) ? parsed.filter((tag): tag is string => typeof tag === "string") : [];
        } catch {
            return [];
        }
    }, [post]);

    const readTime = useMemo(() => {
        if (!post?.content) return 1;
        const wordsPerMinute = 200;
        const wordCount = post.content.split(/\s+/).length;
        return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
    }, [post?.content]);

    const getAuthorInitials = (userId: number) => {
        return `U${userId}`.slice(0, 2).toUpperCase();
    };

    const getAuthorColor = (userId: number) => {
        const colors = [
            'bg-blue-500',
            'bg-green-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-yellow-500',
            'bg-indigo-500'
        ];
        return colors[Math.abs(userId) % colors.length];
    };

    if (error || (!post && !isLoading)) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">{error ? 'Failed to load post' : 'Post not found'}</p>
                    <Button onClick={() => router.push('/blogs')}>Back to Blogs</Button>
                </div>
            </div>
        );
    }

    if (isLoading || !post) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <BlogDetailsHeader post={post} />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <BlogDetailsContent
                        post={post}
                        tags={tags}
                        readTime={`${readTime} min read`}
                        getAuthorInitials={getAuthorInitials}
                        getAuthorColor={getAuthorColor}
                    />
                    <BlogDetailsSidebar
                        post={post}
                        readTime={`${readTime} min read`}
                        getAuthorInitials={getAuthorInitials}
                        getAuthorColor={getAuthorColor}
                    />
                </div>
            </div>
        </div>
    );
}
