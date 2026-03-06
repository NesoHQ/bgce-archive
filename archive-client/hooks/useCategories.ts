import { useState, useEffect } from "react";
import type { ApiCategory } from "@/types/blog.type";
import { getCategoriesAction } from "@/lib/actions";

export function useCategories(initialCategories?: ApiCategory[]) {
    const [categories, setCategories] = useState<ApiCategory[]>(initialCategories || []);
    const [isLoading, setIsLoading] = useState(!initialCategories);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialCategories && initialCategories.length > 0) return;

        let mounted = true;

        const fetchCategories = async () => {
            try {
                const data = await getCategoriesAction();
                if (mounted) {
                    setCategories(data);
                    setIsLoading(false);
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err.message : "Failed to fetch");
                    setIsLoading(false);
                }
            }
        };

        fetchCategories();

        return () => {
            mounted = false;
        };
    }, []);

    return { categories, isLoading, error };
}
