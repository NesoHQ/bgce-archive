import { ApiCategory, ApiResponse } from "@/types/blog.type";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

export const categoryService = {
  getCategories: async (): Promise<ApiCategory[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/categories?status=approved`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        // Silently return empty array if backend is unavailable
        return [];
      }

      const result: ApiResponse<ApiCategory[]> = await response.json();

      if (!result.status) {
        return [];
      }

      // Filter only top-level categories (no parent_id or parent_id is null/undefined/0)
      return result.data.filter(
        (cat) => !cat.parent_id || cat.parent_id === null,
      );
    } catch (error) {
      // Silently return empty array if fetch fails (backend not running)
      return [];
    }
  },
  getCategoryBySlug: async (slug: string): Promise<ApiCategory | null> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/categories?slug=${slug}&status=approved`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch category: ${response.statusText}`);
      }

      const result: ApiResponse<ApiCategory[]> = await response.json();

      if (!result.status || result.data.length === 0) {
        return null;
      }

      return result.data[0];
    } catch (error) {
      console.error("Error fetching category:", error);
      return null;
    }
  },
};
