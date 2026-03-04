"use client";

import { SectionHeader } from "@/components/shared/SectionHeader";
import { MobileViewAllButton } from "@/components/shared/MobileViewAllButton";
import { BlogCard } from "@/components/blogs/BlogCard";
import { usePosts } from "@/hooks/usePosts";
import { SkeletonCardGrid } from "@/components/shared/SkeletonCard";

import type { ApiPostListItem } from "@/types/blog.type";

interface CommunityTalksSectionProps {
    initialPosts?: ApiPostListItem[];
}

export function CommunityTalksSection({ initialPosts }: CommunityTalksSectionProps) {
    const { posts, isLoading, error } = usePosts({
        is_featured: true,
        limit: 3,
        sort_by: "created_at",
        sort_order: "DESC"
    }, initialPosts ? { data: initialPosts, total: initialPosts.length } : undefined);

    return (
        <section className="py-10 lg:py-12 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                <SectionHeader
                    title="Community Talks"
                    description="Learn from community experts and share your knowledge"
                    viewAllHref="/blogs"
                />

                {isLoading && (
                    <div className="py-8">
                        <SkeletonCardGrid count={3} />
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <BlogCard key={post.id} blog={post} />
                            ))}
                        </div>

                        <MobileViewAllButton href="/blogs" text="View All Talks" />
                    </>
                )}
            </div>
        </section>
    );
}
