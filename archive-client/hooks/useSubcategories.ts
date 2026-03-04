import { useState, useEffect } from "react";
import type { ApiSubcategory } from "@/types/blog.type";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export function useSubcategories(parentUuid?: string) {
    const [subcategories, setSubcategories] = useState<ApiSubcategory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!parentUuid) {
            setSubcategories([]);
            return;
        }

        const fetchSubcategories = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `${API_URL}/sub-categories?parent_uuid=${parentUuid}&status=approved`
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch subcategories: ${response.status}`);
                }

                const result = await response.json();

                if (result.status && result.data) {
                    setSubcategories(result.data);
                } else {
                    setSubcategories([]);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch subcategories");
                console.error("Error fetching subcategories:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubcategories();
    }, [parentUuid]);

    return { subcategories, isLoading, error };
}
