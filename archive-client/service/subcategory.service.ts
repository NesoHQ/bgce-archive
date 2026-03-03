import { ApiResponse, ApiSubcategory } from "@/types/blog.type";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

export const subcategoryService = {
  getSubcategories: async (parentUuid?: string): Promise<ApiSubcategory[]> => {
    try {
      const url = parentUuid
        ? `${API_BASE_URL}/sub-categories?parent_uuid=${parentUuid}&status=approved`
        : `${API_BASE_URL}/sub-categories?status=approved`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch subcategories: ${response.statusText}`,
        );
      }

      const result: ApiResponse<ApiSubcategory[] | null> =
        await response.json();

      if (!result.status) {
        throw new Error(result.message || "Failed to fetch subcategories");
      }

      // Handle null data from backend
      return result.data || [];
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      return [];
    }
  },
};
