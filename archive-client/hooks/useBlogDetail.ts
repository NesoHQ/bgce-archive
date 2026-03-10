import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiPost } from "@/types/blog.type";
import { incrementViewCountAction } from "@/lib/actions";
import { api } from "@/lib/api";

type PostsQueryData = {
    data: Array<{ id: number; view_count: number }>;
    total: number;
};

export function useBlogDetail(initialPost: ApiPost | undefined, slug: string) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const incrementedPostId = useRef<number | null>(null);

    // Fetch Post
    const { data, isLoading, error } = useQuery({
        queryKey: ["post", slug],
        queryFn: () => api.getPostBySlug(slug),
        enabled: Boolean(slug),
        initialData: initialPost,
        staleTime: 60 * 1000,
    });

    // Mutation for view count
    const incrementViewMutation = useMutation({
        mutationFn: async (postId: number) => {
            const success = await incrementViewCountAction(postId);
            if (!success) {
                throw new Error("Failed to increment post view count");
            }

            return postId;
        },
        onSuccess: (postId) => {
            // Keep detail query in sync immediately after the increment succeeds.
            queryClient.setQueryData<ApiPost | null>(["post", slug], (currentPost) => {
                if (!currentPost || currentPost.id !== postId) {
                    return currentPost;
                }

                return {
                    ...currentPost,
                    view_count: (currentPost.view_count ?? 0) + 1,
                };
            });

            // Update all cached post-list variants (pagination/filter/sort) containing this post.
            queryClient.setQueriesData<PostsQueryData>(
                { queryKey: ["posts"] },
                (currentPostsData) => {
                    if (!currentPostsData?.data?.length) {
                        return currentPostsData;
                    }

                    let hasMatch = false;
                    const updatedPosts = currentPostsData.data.map((post) => {
                        if (post.id !== postId) {
                            return post;
                        }

                        hasMatch = true;
                        return {
                            ...post,
                            view_count: (post.view_count ?? 0) + 1,
                        };
                    });

                    if (!hasMatch) {
                        return currentPostsData;
                    }

                    return {
                        ...currentPostsData,
                        data: updatedPosts,
                    };
                }
            );

            // Ensure visible lists eventually reconcile with backend truth.
            queryClient.invalidateQueries({ queryKey: ["posts"], refetchType: "all" });
        },
    });

    // Validate post
    const post = useMemo(() => {
        if (!data) return null;

        if (data.status !== "published" || !data.is_public) {
            return null;
        }

        return data;
    }, [data]);

    // Increment view count only once
    useEffect(() => {
        if (post && incrementedPostId.current !== post.id) {
            incrementViewMutation.mutate(post.id);
            incrementedPostId.current = post.id;
        }
    }, [post]);

    // Redirect if post invalid
    useEffect(() => {
        if (!isLoading && data && !post) {
            router.push("/404");
        }

        if (!isLoading && !data && !error) {
            router.push("/404");
        }
    }, [isLoading, data, post, error, router]);

    // Tags
    const tags = useMemo(() => {
        if (!post?.keywords) return [];

        return post.keywords
            .split(",")
            .map(tag => tag.trim())
            .filter(Boolean);
    }, [post?.keywords]);

    // Read time
    const readTime = useMemo(() => {
        if (post?.read_time && post.read_time > 0) {
            return `${post.read_time} min read`;
        }

        if (!post?.content) return "1 min read";

        const wordsPerMinute = 200;
        const wordCount = post.content.split(/\s+/).length;
        const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

        return `${minutes} min read`;
    }, [post?.read_time, post?.content]);

    // Author avatar helpers
    const getAuthorInitials = (userId: number) => `U${userId}`;

    const getAuthorColor = (userId: number) => {
        const colors = [
            "bg-blue-500",
            "bg-purple-500",
            "bg-green-500",
            "bg-red-500",
            "bg-yellow-500",
            "bg-pink-500"
        ];

        return colors[userId % colors.length];
    };

    return {
        post,
        isLoading,
        error: error instanceof Error ? error.message : null,
        tags,
        readTime,
        getAuthorInitials,
        getAuthorColor
    };
}