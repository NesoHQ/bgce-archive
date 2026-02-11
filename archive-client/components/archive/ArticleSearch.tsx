"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";

import { Search, List, Grid } from "lucide-react";
import { getCategories, getSubcategories } from "@/lib/api";
import type { ApiCategory, ApiSubcategory } from "@/types/blog.type";

type ArticleSearchProps = {
  viewMode: string;
  setViewMode: (mode: "list" | "grid") => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  totalCount: number;
  filteredCount: number;
};

interface CategoryWithSubcategories extends ApiCategory {
  subcategories: ApiSubcategory[];
}

export function ArticleSearch({
  setViewMode,
  viewMode,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  totalCount,
  filteredCount,
}: ArticleSearchProps) {
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesData, subcategoriesData] = await Promise.all([
          getCategories(),
          getSubcategories(),
        ]);

        const categoriesWithSubs: CategoryWithSubcategories[] =
          categoriesData.map((cat) => ({
            ...cat,
            subcategories: subcategoriesData.filter(
              (sub) => sub.parent_id === cat.id,
            ),
          }));

        setCategories(categoriesWithSubs);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Get display label for selected category
  const getSelectedLabel = () => {
    if (selectedCategory === "all") return "All Categories";

    if (selectedCategory.startsWith("cat-")) {
      const catId = parseInt(selectedCategory.replace("cat-", ""));
      const category = categories.find((c) => c.id === catId);
      return category?.label || "Select Category";
    }

    if (selectedCategory.startsWith("sub-")) {
      const subId = parseInt(selectedCategory.replace("sub-", ""));
      for (const category of categories) {
        const subcategory = category.subcategories.find((s) => s.id === subId);
        if (subcategory) return `└─ ${subcategory.label}`;
      }
    }

    return "Select Category";
  };

  // Get display label for sort
  const getSortLabel = () => {
    switch (sortBy) {
      case "name-asc":
        return "Name (A-Z)";
      case "name-desc":
        return "Name (Z-A)";
      case "recent":
        return "Most Recent";
      case "popular":
        return "Most Popular";
      default:
        return "Sort By";
    }
  };

  return (
    <div className="w-full space-y-6 py-6">
      {/* Search and Filters Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search with enhanced styling */}
        <div className="relative flex-1 w-full group">
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-14 h-8 min-h-[56px] max-h-[56px] py-2 rounded-md border-gray-700 dark:border-white/20 bg-card/50 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary/50 font-mono shadow-lg hover:shadow-xl transition-all"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 pointer-events-none z-10">
            <Search className="h-4 w-4 text-primary" />
          </div>
        </div>

        {/* Category with Subcategories - Fixed display */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full lg:w-[280px] h-14 min-h-[56px] max-h-[56px] py-3 rounded-md border-gray-700 dark:border-white/20 bg-card/50 backdrop-blur-md focus:ring-2 focus:ring-primary focus:border-primary/50 font-mono shadow-lg hover:shadow-xl transition-all">
            <SelectValue>
              {loading ? "Loading..." : getSelectedLabel()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="font-mono max-h-[400px] rounded-md border-white/20 bg-card/95 backdrop-blur-md shadow-2xl">
            <SelectItem value="all" className="font-bold text-primary">
              📚 All Categories
            </SelectItem>

            {!loading && categories.length > 0 ? (
              categories.map((category) => (
                <SelectGroup key={category.id}>
                  <SelectItem
                    value={`cat-${category.id}`}
                    className="font-semibold"
                  >
                    📁 {category.label}
                  </SelectItem>

                  {category.subcategories.length > 0 &&
                    category.subcategories.map((subcategory) => (
                      <SelectItem
                        key={subcategory.id}
                        value={`sub-${subcategory.id}`}
                        className="pl-8 text-muted-foreground"
                      >
                        └─ {subcategory.label}
                      </SelectItem>
                    ))}
                </SelectGroup>
              ))
            ) : !loading ? (
              <SelectItem value="none" disabled>
                No categories available
              </SelectItem>
            ) : null}
          </SelectContent>
        </Select>

        {/* Sort - Fixed display */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full lg:w-[280px] h-14 min-h-[56px] max-h-[56px] py-3 rounded-md border-gray-700 dark:border-white/20 bg-card/50 backdrop-blur-md focus:ring-2 focus:ring-primary focus:border-primary/50 font-mono shadow-lg hover:shadow-xl transition-all">
            <SelectValue>{getSortLabel()}</SelectValue>
          </SelectTrigger>
          <SelectContent className="font-mono rounded-md border-gray-700 dark:border-white/20 bg-card/95 backdrop-blur-md shadow-2xl">
            <SelectItem value="name-asc">🔤 Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">🔤 Name (Z-A)</SelectItem>
            <SelectItem value="recent">🕐 Most Recent</SelectItem>
            <SelectItem value="popular">🔥 Most Popular</SelectItem>
          </SelectContent>
        </Select>

        {/* View Toggle with enhanced styling */}
        <div className="flex rounded-md border border-gray-200 dark:border-white/20 bg-card/50 backdrop-blur-md overflow-hidden shadow-lg hover:shadow-xl transition-all">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={`h-14 px-6 rounded-none transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "hover:bg-primary/10"
            }`}
          >
            <Grid className="h-5 w-5" />
          </Button>

          <div className="w-px bg-white/20" />

          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={`h-14 px-6 rounded-none transition-all cursor-pointer ${
              viewMode === "list"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "hover:bg-primary/10"
            }`}
          >
            <List className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
