import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import type { ApiPost } from "@/types/blog.type";
import { apiClient } from "@/lib/api-client";

export function useBlogDetail(initialPost: ApiPost | undefined, slug: string) {
    const router = useRouter();
    const [post, setPost] = useState<ApiPost | null>(initialPost || null);
    const [isLoading, setIsLoading] = useState(!initialPost);
    const [error, setError] = useState<string | null>(null);
    const isFirstRun = useRef(!!initialPost);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        async function fetchPost() {
            try {
                setIsLoading(true);
                const postData = await apiClient.getPostBySlug(slug);

                if (!postData) {
                    router.push('/404');
                    return;
                }

                // Check if post is published and public
                if (postData.status !== 'published' || !postData.is_public) {
                    router.push('/404');
                    return;
                }

                setPost(postData);
            } catch (err) {
                console.error('Error fetching post:', err);
                setError('Failed to load post');
            } finally {
                setIsLoading(false);
            }
        }

        fetchPost();
    }, [slug, router]);

    const tags = useMemo(() => post?.keywords ? post.keywords.split(',').map(k => k.trim()).filter(Boolean) : [], [post?.keywords]);
    const readTime = useMemo(() => post?.read_time && post.read_time > 0 ? `${post.read_time} min` : "1 min", [post?.read_time]);

    const getAuthorInitials = (userId: number) => `U${userId}`;
    const getAuthorColor = (userId: number) => {
        const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-red-500", "bg-yellow-500", "bg-pink-500"];
        return colors[userId % colors.length];
    };

    return {
        post,
        isLoading,
        error,
        tags,
        readTime,
        getAuthorInitials,
        getAuthorColor
    };
}
