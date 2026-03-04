import { ApiResponse, ApiSubcategory } from "@/types/blog.type";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

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
        console.error(`Failed to fetch subcategories: ${response.status} ${response.statusText}`);
        return [];
      }

      const result: ApiResponse<ApiSubcategory[] | null> =
        await response.json();

      if (!result.status) {
        console.error("Subcategory API returned status false:", result.message);
        return [];
      }

      // Handle null data from backend
      const subcategories = result.data || [];
      console.log(`Fetched ${subcategories.length} subcategories for parent: ${parentUuid || 'all'}`);
      return subcategories;
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      return [];
    }
  },
};
