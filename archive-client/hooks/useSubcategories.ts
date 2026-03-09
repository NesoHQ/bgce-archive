import { useQuery } from "@tanstack/react-query";
import type { ApiSubcategory } from "@/types/blog.type";
import { api } from "@/lib/api";

export function useSubcategories(parentUuid?: string) {
    const { data, isLoading, error } = useQuery<ApiSubcategory[]>({
        queryKey: ["subcategories", parentUuid],
        queryFn: () => api.getSubcategories(parentUuid as string),
        enabled: Boolean(parentUuid),
        staleTime: 60 * 1000,
    });

    return {
        subcategories: data ?? [],
        isLoading,
        error: error instanceof Error ? error.message : null,
    };
}
