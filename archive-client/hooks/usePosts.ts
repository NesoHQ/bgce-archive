import { useState, useEffect, useCallback } from "react";
import type { ApiPostListItem } from "@/types/blog.type";

const POSTAL_API_URL = process.env.NEXT_PUBLIC_POSTAL_API_URL || "http://localhost:8081/api/v1";

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
        try {
            setIsLoading(true);

            const params = new URLSearchParams();
            params.append("status", "published");

            if (filters.limit) params.append("limit", filters.limit.toString());
            if (filters.offset) params.append("offset", filters.offset.toString());
            if (filters.category_id) params.append("category_id", filters.category_id.toString());
            if (filters.sub_category_id) params.append("sub_category_id", filters.sub_category_id.toString());
            if (filters.search) params.append("search", filters.search);
            if (filters.is_featured !== undefined) params.append("is_featured", filters.is_featured.toString());
            if (filters.is_pinned !== undefined) params.append("is_pinned", filters.is_pinned.toString());
            if (filters.sort_by) params.append("sort_by", filters.sort_by);
            if (filters.sort_order) params.append("sort_order", filters.sort_order);

            const response = await fetch(`${POSTAL_API_URL}/posts?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch posts: ${response.status}`);
            }

            const result = await response.json();

            if (result.status && result.data) {
                setPosts(result.data);
                setTotal(result.meta?.total || 0);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch posts");
            console.error("Error fetching posts:", err);
        } finally {
            setIsLoading(false);
        }
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
