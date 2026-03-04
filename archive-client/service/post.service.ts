import {
  ApiPost,
  ApiPostListItem,
  ApiPostListResponse,
  ApiResponse,
} from "@/types/blog.type";

const POSTAL_API_URL =
  process.env.NEXT_PUBLIC_POSTAL_API_URL || "http://localhost:8081/api/v1";

export const postService = {
  getPosts: async (params?: {
    status?: string;
    category_id?: number;
    sub_category_id?: number;
    limit?: number;
    offset?: number;
    search?: string;
    is_featured?: boolean;
    is_pinned?: boolean;
    sort_by?: string;
    sort_order?: "ASC" | "DESC";
  }): Promise<{ data: ApiPostListItem[]; total: number }> => {
    try {
      const queryParams = new URLSearchParams();

      queryParams.append("status", params?.status ?? "published");

      const appendIfDefined = (
        key: string,
        value: string | number | boolean | undefined,
      ) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      };

      appendIfDefined("category_id", params?.category_id);
      appendIfDefined("sub_category_id", params?.sub_category_id);
      appendIfDefined("limit", params?.limit);
      appendIfDefined("offset", params?.offset);
      appendIfDefined("search", params?.search);
      appendIfDefined("is_featured", params?.is_featured);
      appendIfDefined("is_pinned", params?.is_pinned);
      appendIfDefined("sort_by", params?.sort_by);
      appendIfDefined("sort_order", params?.sort_order);

      const response = await fetch(
        `${POSTAL_API_URL}/posts?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }

      const result: ApiPostListResponse = await response.json();

      if (!result.status) {
        throw new Error(result.message || "Failed to fetch posts");
      }

      return {
        data: result.data || [],
        total: result.meta?.total || 0,
      };
    } catch (error) {
      console.error("Error fetching posts:", error);
      return { data: [], total: 0 };
    }
  },

  getPostBySlug: async (slug: string): Promise<ApiPost | null> => {
    try {
      const response = await fetch(`${POSTAL_API_URL}/posts/slug/${slug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
      console.error("Error fetching post:", error);
      return null;
    }
  },

  getPostById: async (id: number): Promise<ApiPost | null> => {
    try {
      const response = await fetch(`${POSTAL_API_URL}/posts/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
      console.error("Error fetching post:", error);
      return null;
    }
  },
};
