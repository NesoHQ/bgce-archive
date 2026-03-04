import type { ApiPost, ApiPostListItem, ApiCategory } from "@/types/blog.type";

export type SortOption = "new" | "views" | "featured";

export interface BlogFilters {
    searchQuery: string;
    selectedCategory: number | null;
    selectedSubcategory: number | null;
    sortBy: SortOption;
    showFeaturedOnly: boolean;
}

export interface BlogsClientProps {
    initialPosts: ApiPostListItem[];
    initialTotal: number;
    categories: ApiCategory[];
}
