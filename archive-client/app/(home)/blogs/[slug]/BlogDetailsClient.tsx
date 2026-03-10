"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BlogDetailsHeader } from "@/components/blogs/details/BlogDetailsHeader";
import { BlogDetailsContent } from "@/components/blogs/details/BlogDetailsContent";
import { BlogDetailsSidebar } from "@/components/blogs/details/BlogDetailsSidebar";
import { useBlogDetail } from "@/hooks/useBlogDetail";
import type { ApiPost } from "@/types/blog.type";

interface BlogDetailsClientProps {
    slug: string;
    initialPost?: ApiPost;
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
        getAuthorColor,
    } = useBlogDetail(initialPost, slug);

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
