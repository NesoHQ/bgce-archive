"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { ApiPost } from "@/types/blog.type";
import { useBlogDetail } from "@/hooks/useBlogDetail";
import { BlogDetailsHeader } from "@/components/blogs/details/BlogDetailsHeader";
import { BlogDetailsContent } from "@/components/blogs/details/BlogDetailsContent";
import { BlogDetailsSidebar } from "@/components/blogs/details/BlogDetailsSidebar";

interface BlogDetailsClientProps {
    initialPost?: ApiPost;
    slug: string;
}

export default function BlogDetailsClient({ initialPost, slug }: BlogDetailsClientProps) {
    const router = useRouter();
    const {
        post,
        isLoading,
        error,
        tags,
        readTime,
        getAuthorInitials,
        getAuthorColor
    } = useBlogDetail(initialPost, slug);

    if (error || (!post && !isLoading)) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">{error || 'Post not found'}</p>
                    <Button onClick={() => router.push('/blogs')}>Back to Blogs</Button>
                </div>
            </div>
        );
    }

    if (!post) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <BlogDetailsHeader post={post} />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <BlogDetailsContent
                        post={post}
                        tags={tags}
                        readTime={readTime}
                        getAuthorInitials={getAuthorInitials}
                        getAuthorColor={getAuthorColor}
                    />
                    <BlogDetailsSidebar
                        post={post}
                        readTime={readTime}
                        getAuthorInitials={getAuthorInitials}
                        getAuthorColor={getAuthorColor}
                    />
                </div>
            </div>
        </div>
    );
}
