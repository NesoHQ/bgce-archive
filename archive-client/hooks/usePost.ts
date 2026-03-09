import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function usePost(slug: string) {
    const { data: post, isLoading, error } = useQuery({
        queryKey: ["post", slug],
        queryFn: () => api.getPostBySlug(slug),
        enabled: Boolean(slug),
        staleTime: 60 * 1000,
    });

    return {
        post: post ?? null,
        isLoading,
        error: error instanceof Error ? error.message : null,
    };
}
