import { useState, useEffect, useCallback } from "react";
import type { ApiPostListItem } from "@/types/blog.type";
import { apiClient } from "@/lib/api-client";

interface PostFilters {
    limit?: number;
    offset?: number;
    category_id?: number;
    sub_category_id?: number;
    search?: string;
    is_featured?: boolean;
    is_pinned?: boolean;
    sort_by?: string;
    sort_order?: "ASC" | "DESC";
}

export function usePosts(filters: PostFilters) {
    const [posts, setPosts] = useState<ApiPostListItem[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = useCallback(async () => {
        let mounted = true;
        setIsLoading(true);

        try {
            const result = await apiClient.getPosts(filters);
            if (mounted) {
                setPosts(result.data);
                setTotal(result.total);
                setIsLoading(false);
            }
        } catch (err) {
            if (mounted) {
                setError(err instanceof Error ? err.message : "Failed to fetch");
                setIsLoading(false);
            }
        }

        return () => {
            mounted = false;
        };
    }, [
        filters.limit,
        filters.offset,
        filters.category_id,
        filters.sub_category_id,
        filters.search,
        filters.is_featured,
        filters.is_pinned,
        filters.sort_by,
        filters.sort_order,
    ]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return { posts, total, isLoading, error, refetch: fetchPosts };
}
