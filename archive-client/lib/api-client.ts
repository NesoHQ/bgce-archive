// Optimized API client with request deduplication and parallel fetching

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const POSTAL_API_URL = process.env.NEXT_PUBLIC_POSTAL_API_URL || "http://localhost:8081/api/v1";

// In-flight request cache to prevent duplicate requests
const inflightRequests = new Map<string, Promise<any>>();

async function fetchWithDedup(url: string, options: RequestInit = {}): Promise<any> {
    const cacheKey = url;

    // Check if request is already in-flight
    if (inflightRequests.has(cacheKey)) {
        return inflightRequests.get(cacheKey);
    }

    // Make new request
    const promise = fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        },
    })
        .then(async (res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then((data) => {
            inflightRequests.delete(cacheKey);
            return data;
        })
        .catch((err) => {
            inflightRequests.delete(cacheKey);
            throw err;
        });

    inflightRequests.set(cacheKey, promise);
    return promise;
}

export const apiClient = {
    // Fetch categories (top-level only)
    async getCategories() {
        const url = `${API_URL}/categories?status=approved`;
        const result = await fetchWithDedup(url);

        if (result.status && result.data) {
            return result.data.filter((cat: any) => !cat.parent_id || cat.parent_id === null);
        }
        return [];
    },

    // Fetch subcategories by parent UUID
    async getSubcategories(parentUuid: string) {
        const url = `${API_URL}/sub-categories?parent_uuid=${parentUuid}&status=approved`;
        const result = await fetchWithDedup(url);

        if (result.status && result.data) {
            return result.data;
        }
        return [];
    },

    // Fetch posts with filters
    async getPosts(filters: Record<string, any>) {
        const params = new URLSearchParams();
        params.append("status", "published");

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, value.toString());
            }
        });

        const url = `${POSTAL_API_URL}/posts?${params.toString()}`;
        const result = await fetchWithDedup(url);

        if (result.status && result.data) {
            return {
                data: result.data,
                total: result.meta?.total || 0,
            };
        }
        return { data: [], total: 0 };
    },

    // Fetch single post by slug
    async getPostBySlug(slug: string) {
        const url = `${POSTAL_API_URL}/posts/slug/${slug}`;
        const result = await fetchWithDedup(url);

        if (result.status && result.data) {
            return result.data;
        }
        return null;
    },

    // Prefetch multiple resources in parallel
    async prefetch(urls: string[]) {
        return Promise.all(urls.map((url) => fetchWithDedup(url).catch(() => null)));
    },

    // Clear any active requests
    clearActiveRequests() {
        inflightRequests.clear();
    },
};
