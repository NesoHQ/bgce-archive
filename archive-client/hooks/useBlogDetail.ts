import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiPost } from "@/types/blog.type";
import { incrementViewCountAction } from "@/lib/actions";
import { api } from "@/lib/api";

export function useBlogDetail(initialPost: ApiPost | undefined, slug: string) {
    const router = useRouter();
    const incrementedPostId = useRef<number | null>(null);
    const incrementViewMutation = useMutation({
        mutationFn: incrementViewCountAction,
    });

    const { data, isLoading, error } = useQuery({
        queryKey: ["post", slug],
        queryFn: () => api.getPostBySlug(slug),
        enabled: Boolean(slug),
        initialData: initialPost,
        staleTime: 60 * 1000,
    });

    const post = useMemo(() => {
        if (!data) return null;
        if (data.status !== "published" || !data.is_public) return null;
        return data;
    }, [data]);

    useEffect(() => {
        if (post && incrementedPostId.current !== post.id) {
            incrementViewMutation.mutate(post.id);
            incrementedPostId.current = post.id;
        }
    }, [post, incrementViewMutation]);

    useEffect(() => {
        if (!isLoading && data && !post) {
            router.push("/404");
        }

        if (!isLoading && !data && !error) {
            router.push("/404");
        }
    }, [isLoading, data, post, error, router]);

    const tags = useMemo(() => post?.keywords ? post.keywords.split(",").map(k => k.trim()).filter(Boolean) : [], [post?.keywords]);
    const readTime = useMemo(() => {
        if (post?.read_time && post.read_time > 0) {
            return `${post.read_time} min`;
        }
        return "1 min"; // Fallback for UI components that expect a string
    }, [post?.read_time]);

    const getAuthorInitials = (userId: number) => `U${userId}`;
    const getAuthorColor = (userId: number) => {
        const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-red-500", "bg-yellow-500", "bg-pink-500"];
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
