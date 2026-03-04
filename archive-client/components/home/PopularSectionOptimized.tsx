"use client";

import { useEffect, useState } from "react";
import type { ApiCategory } from "@/types/blog.type";
import { CategoryCard } from "./popular/CategoryCard";
import { ContributorTable } from "./popular/ContributorTable";
import { fallbackCategories } from "./popular/data";
import { useCategories } from "@/hooks/useCategories";

export default function PopularSectionOptimized() {
    const { categories: apiCategories, isLoading } = useCategories();
    const [categories, setCategories] = useState<ApiCategory[]>([]);

    useEffect(() => {
        if (!isLoading) {
            setCategories(apiCategories.length === 0 ? fallbackCategories : apiCategories.slice(0, 5));
        }
    }, [apiCategories, isLoading]);

    return (
        <main className="container mx-auto py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Section: Topics */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold tracking-tight">
                            Follow popular topics
                        </h2>
                        <p className="text-sm text-muted-foreground font-mono mt-2">
                            Explore trending categories
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="p-2 rounded-md bg-card/30 border border-white/5 backdrop-blur-md animate-pulse"
                                >
                                    <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="p-8 rounded-[1.5rem] bg-card/30 border border-white/5 backdrop-blur-md text-center text-muted-foreground">
                            No categories available yet
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {categories.map((category) => (
                                <CategoryCard key={category.id} category={category} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Right Section: Contributors */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold tracking-tight">
                            Top contributors
                        </h2>
                        <p className="text-sm text-muted-foreground font-mono mt-2">
                            Community leaders
                        </p>
                    </div>

                    <ContributorTable />
                </section>
            </div>
        </main>
    );
}
