import { useState, useEffect } from "react";
import type { ApiPost } from "@/types/blog.type";

const POSTAL_API_URL = process.env.NEXT_PUBLIC_POSTAL_API_URL || "http://localhost:8081/api/v1";

export function usePost(slug: string) {
    const [post, setPost] = useState<ApiPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;

        async function fetchPost() {
            try {
                setIsLoading(true);
                const response = await fetch(`${POSTAL_API_URL}/posts/slug/${slug}`);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const result = await response.json();

                if (result.status && result.data) {
                    setPost(result.data);
                    setError(null);
                } else {
                    throw new Error("Invalid response");
                }
            } catch (err) {
                console.error("Error fetching post:", err);
                setError(err instanceof Error ? err.message : "Failed to fetch post");
                setPost(null);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPost();
    }, [slug]);

    return { post, isLoading, error };
}
