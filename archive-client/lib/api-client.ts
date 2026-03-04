// Optimized API client with request deduplication and parallel fetching

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const POSTAL_API_URL = process.env.NEXT_PUBLIC_POSTAL_API_URL || "http://localhost:8081/api/v1";

// In-flight request cache to prevent duplicate requests
const inflightRequests = new Map<string, Promise<any>>();

// Simple memory cache for frequently accessed data
const memoryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30000; // 30 seconds

function getCacheKey(url: string): string {
    return url;
}

function getFromCache(key: string): any | null {
    const cached = memoryCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }
    memoryCache.delete(key);
    return null;
}

function setCache(key: string, data: any): void {
    memoryCache.set(key, { data, timestamp: Date.now() });
}

async function fetchWithDedup(url: string): Promise<any> {
    const cacheKey = getCacheKey(url);

    // Check memory cache first
    const cached = getFromCache(cacheKey);
    if (cached) {
        return cached;
    }

    // Check if request is already in-flight
    if (inflightRequests.has(cacheKey)) {
        return inflightRequests.get(cacheKey);
    }

    // Make new request
    const promise = fetch(url, {
        headers: { "Content-Type": "application/json" },
    })
        .then(async (res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then((data) => {
            setCache(cacheKey, data);
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

    // Prefetch multiple resources in parallel
    async prefetch(urls: string[]) {
        return Promise.all(urls.map((url) => fetchWithDedup(url).catch(() => null)));
    },

    // Clear cache (useful for forced refresh)
    clearCache() {
        memoryCache.clear();
        inflightRequests.clear();
    },
};
