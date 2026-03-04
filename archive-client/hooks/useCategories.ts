import { useState, useEffect } from "react";
import type { ApiCategory } from "@/types/blog.type";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export function useCategories() {
    const [categories, setCategories] = useState<ApiCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_URL}/categories?status=approved`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch categories: ${response.status}`);
                }

                const result = await response.json();

                if (result.status && result.data) {
                    // Filter only top-level categories
                    const topLevel = result.data.filter(
                        (cat: ApiCategory) => !cat.parent_id || cat.parent_id === null
                    );
                    setCategories(topLevel);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch categories");
                console.error("Error fetching categories:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, isLoading, error };
}
