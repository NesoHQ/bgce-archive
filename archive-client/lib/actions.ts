"use server";

import type { ApiCategory, ApiSubcategory, ApiPostListItem, ApiPost } from "@/types/blog.type";
import type { LoginRequest, RegisterRequest, UserResponse, LoginResponse, ApiResponse } from "./auth-api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const POSTAL_API_URL = process.env.NEXT_PUBLIC_POSTAL_API_URL || "http://localhost:8081/api/v1";

// Create a generic fetch wrapping to be used by the server actions
async function serverFetch(url: string, options: RequestInit = {}) {
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!res.ok) {
        // Try to parse the error message from the backend
        let errorMsg = `HTTP ${res.status} - failed to fetch ${url}`;
        try {
            const errorData = await res.json();
            if (errorData && errorData.message) {
                errorMsg = errorData.message;
            }
        } catch (e) {
            // Ignore JSON parse errors for error responses
        }
        throw new Error(errorMsg);
    }

    return res.json();
}

/**
 * Register a new user
 */
export async function registerAction(data: RegisterRequest): Promise<ApiResponse<UserResponse>> {
    const url = `${API_URL}/auth/register`;
    return serverFetch(url, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

/**
 * Login a user
 */
export async function loginAction(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const url = `${API_URL}/auth/login`;
    return serverFetch(url, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

/**
 * Fetch top-level categories
 */
export async function getCategoriesAction(): Promise<ApiCategory[]> {
    try {
        const url = `${API_URL}/categories?status=approved`;
        const result = await serverFetch(url, { cache: "no-store" });

        if (result.status && result.data) {
            return result.data.filter((cat: any) => !cat.parent_id || cat.parent_id === null);
        }
        return [];
    } catch (error) {
        console.error("Server Action getCategories error:", error);
        return [];
    }
}

/**
 * Fetch subcategories by parent UUID
 */
export async function getSubcategoriesAction(parentUuid: string): Promise<ApiSubcategory[]> {
    try {
        const url = `${API_URL}/sub-categories?parent_uuid=${parentUuid}&status=approved`;
        const result = await serverFetch(url, { cache: "no-store" });

        if (result.status && result.data) {
            return result.data;
        }
        return [];
    } catch (error) {
        console.error("Server Action getSubcategories error:", error);
        return [];
    }
}

/**
 * Fetch posts based on filters
 */
export async function getPostsAction(filters: Record<string, any>): Promise<{ data: ApiPostListItem[], total: number }> {
    try {
        const params = new URLSearchParams();
        params.append("status", "published");

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, value.toString());
            }
        });

        const url = `${POSTAL_API_URL}/posts?${params.toString()}`;
        const result = await serverFetch(url, { cache: "no-store" });

        if (result.status && result.data) {
            return {
                data: result.data,
                total: result.meta?.total || 0,
            };
        }
        return { data: [], total: 0 };
    } catch (error) {
        console.error("Server Action getPosts error:", error);
        return { data: [], total: 0 };
    }
}

/**
 * Fetch a single post by slug
 */
export async function getPostBySlugAction(slug: string): Promise<ApiPost | null> {
    try {
        const url = `${POSTAL_API_URL}/posts/slug/${slug}`;
        const result = await serverFetch(url, { cache: "no-store" });

        if (result.status && result.data) {
            return result.data;
        }
        return null;
    } catch (error) {
        console.error(`Server Action getPostBySlug error (${slug}):`, error);
        return null;
    }
}

/**
 * Increment view count for a post
 */
export async function incrementViewCountAction(id: number) {
    try {
        const url = `${POSTAL_API_URL}/posts/${id}/view`;
        await serverFetch(url, { method: "POST" });
        return true;
    } catch (error) {
        console.error("Server Action incrementViewCount error:", error);
        return false;
    }
}
