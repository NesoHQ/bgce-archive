import React, { memo } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogCard } from "./BlogCard";
import type { ApiPostListItem } from "@/types/blog.type";

interface BlogGridProps {
    blogs: ApiPostListItem[];
    isLoading: boolean;
    onClearFilters: () => void;
}

export const BlogGrid = memo(function BlogGrid({ blogs, isLoading, onClearFilters }: BlogGridProps) {
    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="mt-4 text-sm text-muted-foreground">Loading blogs...</p>
            </div>
        );
    }

    if (blogs.length === 0) {
        return (
            <div className="text-center py-12 px-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                    <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1.5">No blogs found</h3>
                <p className="text-xs text-muted-foreground mb-3">Try adjusting your filters or search query</p>
                <Button variant="outline" size="sm" onClick={onClearFilters} className="border-2">
                    <X className="h-3 w-3 mr-1.5" />
                    Clear All Filters
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
            ))}
        </div>
    );
});
