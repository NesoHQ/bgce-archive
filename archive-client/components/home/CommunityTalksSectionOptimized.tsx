"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MobileViewAllButton } from "@/components/shared/MobileViewAllButton";
import { PostCard } from "@/components/shared/cards/PostCard";
import type { ApiPostListItem } from "@/types/blog.type";
import { getPosts } from "@/action/post.action";

export function CommunityTalksSection() {
    const [posts, setPosts] = useState<ApiPostListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchFeaturedPosts() {
            try {
                setLoading(true);
                const allPosts = await getPosts({ limit: 100 });
                const featuredPosts = allPosts.filter(post => post.is_featured).slice(0, 3);
                setPosts(featuredPosts);
                setError(null);
            } catch (err) {
                console.error('Error fetching featured posts:', err);
                setError('Failed to load featured posts');
            } finally {
                setLoading(false);
            }
        }

        fetchFeaturedPosts();
    }, []);

    return (
        <section className="py-10 lg:py-12 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                <SectionHeader
                    title="Community Talks"
                    description="Learn from community experts and share your knowledge"
                    viewAllHref="/blogs"
                />

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && posts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No featured posts available at the moment.</p>
                    </div>
                )}

                {/* Talks Grid */}
                {!loading && !error && posts.length > 0 && (
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
