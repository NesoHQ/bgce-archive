"use client";

import { Loader2 } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MobileViewAllButton } from "@/components/shared/MobileViewAllButton";
import { PostCard } from "@/components/shared/cards/PostCard";
import { usePosts } from "@/hooks/usePosts";

export function CommunityTalksSection() {
    const { posts, isLoading, error } = usePosts({
        is_featured: true,
        limit: 3,
        sort_by: "created_at",
        sort_order: "DESC"
    });

    return (
        <section className="py-10 lg:py-12 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                <SectionHeader
                    title="Community Talks"
                    description="Learn from community experts and share your knowledge"
                    viewAllHref="/blogs"
                />

                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}

                {error && !isLoading && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Failed to load featured posts</p>
                    </div>
                )}

                {!isLoading && !error && posts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No featured posts available at the moment.</p>
                    </div>
                )}

                {!isLoading && !error && posts.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {posts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>

                        <MobileViewAllButton href="/blogs" text="View All Talks" />
                    </>
                )}
            </div>
        </section>
    );
}
