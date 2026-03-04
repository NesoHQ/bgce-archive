import { useState, useEffect } from "react";
import type { ApiSubcategory } from "@/types/blog.type";
import { apiClient } from "@/lib/api-client";

export function useSubcategories(parentUuid?: string) {
    const [subcategories, setSubcategories] = useState<ApiSubcategory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!parentUuid) {
            setSubcategories([]);
            return;
        }

        let mounted = true;
        setIsLoading(true);

        const fetchSubcategories = async () => {
            try {
                const data = await apiClient.getSubcategories(parentUuid);
                if (mounted) {
                    setSubcategories(data);
                    setIsLoading(false);
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err.message : "Failed to fetch");
                    setIsLoading(false);
                }
            }
        };

        fetchSubcategories();

        return () => {
            mounted = false;
        };
    }, [parentUuid]);

    return { subcategories, isLoading, error };
}
