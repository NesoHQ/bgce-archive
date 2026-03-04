import { useState, useEffect } from "react";
import type { ApiCategory } from "@/types/blog.type";
import { apiClient } from "@/lib/api-client";

export function useCategories() {
    const [categories, setCategories] = useState<ApiCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const fetchCategories = async () => {
            try {
                const data = await apiClient.getCategories();
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
