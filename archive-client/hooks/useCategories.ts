import { useQuery } from "@tanstack/react-query";
import type { ApiCategory } from "@/types/blog.type";
import { api } from "@/lib/api";

export function useCategories(initialCategories?: ApiCategory[]) {
    const hasInitialData = Boolean(initialCategories && initialCategories.length > 0);

    const { data, isLoading, error } = useQuery({
        queryKey: ["categories"],
        queryFn: () => api.getCategories(),
        initialData: hasInitialData ? initialCategories : undefined,
        staleTime: 60 * 1000,
    });

    return {
        categories: data ?? [],
        isLoading,
        error: error instanceof Error ? error.message : null,
    };
}
