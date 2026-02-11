import type { ApiCategory, ApiSubcategory, ApiResponse, ApiPost, ApiPostListResponse } from '@/types/blog.type';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
const POSTAL_API_URL = process.env.NEXT_PUBLIC_POSTAL_API_URL || 'http://localhost:8081/api/v1';

export async function getCategories(): Promise<ApiCategory[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/categories?status=approved`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }

        const result: ApiResponse<ApiCategory[]> = await response.json();

        if (!result.status) {
            throw new Error(result.message || 'Failed to fetch categories');
        }

        // Filter only top-level categories (no parent_id or parent_id is null/undefined/0)
        return result.data.filter(cat => !cat.parent_id || cat.parent_id === null);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export async function getSubcategories(parentUuid?: string): Promise<ApiSubcategory[]> {
    try {
        const url = parentUuid
            ? `${API_BASE_URL}/sub-categories?parent_uuid=${parentUuid}&status=approved`
            : `${API_BASE_URL}/sub-categories?status=approved`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch subcategories: ${response.statusText}`);
        }

        const result: ApiResponse<ApiSubcategory[] | null> = await response.json();

        if (!result.status) {
            throw new Error(result.message || 'Failed to fetch subcategories');
        }

        // Handle null data from backend
        return result.data || [];
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        return [];
    }
}

export async function getCategoryBySlug(slug: string): Promise<ApiCategory | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/categories?slug=${slug}&status=approved`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 600 }, // Cache for 10 minutes
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch category: ${response.statusText}`);
        }

        const result: ApiResponse<ApiCategory[]> = await response.json();

        if (!result.status || result.data.length === 0) {
            return null;
        }

        return result.data[0];
    } catch (error) {
        console.error('Error fetching category:', error);
        return null;
    }
}

// Post API functions (Postal service)
export async function getPosts(params?: {
    status?: string;
    category_id?: number;
    sub_category_id?: number;
    limit?: number;
    offset?: number;
}): Promise<ApiPost[]> {
    try {
        const queryParams = new URLSearchParams();

        // Only fetch published posts for public view
        queryParams.append('status', 'published');

        if (params?.category_id) {
            queryParams.append('category_id', params.category_id.toString());
        }
        if (params?.sub_category_id) {
            queryParams.append('sub_category_id', params.sub_category_id.toString());
        }
        if (params?.limit) {
            queryParams.append('limit', params.limit.toString());
        }
        if (params?.offset) {
            queryParams.append('offset', params.offset.toString());
        }

        const response = await fetch(`${POSTAL_API_URL}/posts?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 180 }, // Cache for 3 minutes
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }

        const result: ApiPostListResponse = await response.json();

        if (!result.status) {
            throw new Error(result.message || 'Failed to fetch posts');
        }

        return result.data || [];
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

export async function getPostBySlug(slug: string): Promise<ApiPost | null> {
    try {
        const response = await fetch(`${POSTAL_API_URL}/posts/slug/${slug}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 600 }, // Cache for 10 minutes
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch post: ${response.statusText}`);
        }

        const result: ApiResponse<ApiPost> = await response.json();

        if (!result.status) {
            return null;
        }

        return result.data;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

export async function getPostById(id: number): Promise<ApiPost | null> {
    try {
        const response = await fetch(`${POSTAL_API_URL}/posts/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 600 }, // Cache for 10 minutes
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch post: ${response.statusText}`);
        }

        const result: ApiResponse<ApiPost> = await response.json();

        if (!result.status) {
            return null;
        }

        return result.data;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}
