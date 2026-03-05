import type { ApiCategory, ApiPostListItem, ApiPost } from "@/types/blog.type";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const POSTAL_API_URL = process.env.NEXT_PUBLIC_POSTAL_API_URL || "http://localhost:8081/api/v1";

/**
 * Server-side API utility for React Server Components.
 * Uses cache: 'no-store' to ensure fresh data per the user's requirement.
 */
export const api = {
    // Fetch categories on the server
    async getCategories(): Promise<ApiCategory[]> {
        try {
            const res = await fetch(`${API_URL}/categories?status=approved`, {
                cache: 'no-store',
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) return [];
            const result = await res.json();

            if (result.status && result.data) {
                return result.data.filter((cat: any) => !cat.parent_id || cat.parent_id === null);
            }
            return [];
        } catch (error) {
            console.error("Error fetching categories on server:", error);
            return [];
        }
    },

    // Fetch posts on the server
    async getPosts(filters: Record<string, any> = {}): Promise<{ data: ApiPostListItem[], total: number }> {
        try {
            const params = new URLSearchParams();
            params.append("status", "published");

            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    params.append(key, value.toString());
                }
            });

            const res = await fetch(`${POSTAL_API_URL}/posts?${params.toString()}`, {
                cache: 'no-store',
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) return { data: [], total: 0 };
            const result = await res.json();

            if (result.status && result.data) {
                return {
                    data: result.data,
                    total: result.meta?.total || 0,
                };
            }
            return { data: [], total: 0 };
        } catch (error) {
            console.error("Error fetching posts on server:", error);
            return { data: [], total: 0 };
        }
    },

    // Fetch single post by slug on the server
    async getPostBySlug(slug: string): Promise<ApiPost | null> {
        try {
            const res = await fetch(`${POSTAL_API_URL}/posts/slug/${slug}`, {
                cache: 'no-store',
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) return null;
            const result = await res.json();

            if (result.status && result.data) {
                return result.data;
            }
            return null;
        } catch (error) {
            console.error(`Error fetching post ${slug} on server:`, error);
            return null;
        }
    }
};
