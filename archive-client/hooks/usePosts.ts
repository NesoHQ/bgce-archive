import { useQuery } from "@tanstack/react-query";
import type { ApiPostListItem } from "@/types/blog.type";
import { api } from "@/lib/api";

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

export function usePosts(filters: PostFilters, initialData?: { data: ApiPostListItem[], total: number }) {
    const query = useQuery({
        queryKey: ["posts", filters],
        queryFn: () => api.getPosts(filters),
        initialData,
        staleTime: 60 * 1000,
    });

    return {
        posts: query.data?.data ?? [],
        total: query.data?.total ?? 0,
        isLoading: query.isLoading,
        error: query.error instanceof Error ? query.error.message : null,
        refetch: query.refetch,
    };
}
