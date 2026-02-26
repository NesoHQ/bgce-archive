"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, ThumbsUp, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getPosts } from "@/lib/api";
import type { ApiPost } from "@/types/blog.type";

export function CommunityTalksSection() {
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeaturedPosts() {
      try {
        setLoading(true);
        // Fetch all posts first, then filter for featured ones
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

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Helper function to get initials from title (since we don't have author info)
  const getInitials = (title: string) => {
    const words = title.split(' ');
    return words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
  };

  return (
    <section className="py-10 lg:py-12 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 gap-3">
          <div className="space-y-1">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">Community Talks</h2>
            <p className="text-sm text-muted-foreground max-w-2xl">Learn from community experts and share your knowledge</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden sm:flex hover:bg-accent transition-all duration-200"
          >
            <Link href="/blogs">
              View All
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blogs/${post.slug}`}
                className="group relative bg-gradient-to-br from-card to-card/80 dark:from-card dark:to-card/50 border-2 border-border rounded-lg p-4 
                  hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 
                  hover:border-primary/50 hover:ring-2 hover:ring-primary/20
                  transition-all duration-300 ease-out backdrop-blur-sm
                  focus:outline-none focus:ring-2 focus:ring-primary/50 overflow-hidden"
              >
                {/* Featured Badge */}
                <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-semibold mb-2.5 border border-orange-500/20">
                  Featured
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-foreground mb-2.5 group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem] leading-tight">
                  {post.title}
                </h3>

                {/* Summary */}
                {post.summary && (
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {post.summary}
                  </p>
                )}

                {/* Post Info */}
                <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-border">
                  <Avatar className="h-7 w-7 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-[10px] font-bold">
                      {getInitials(post.title)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {post.status === 'published' ? 'Published' : post.status}
                    </p>
                  </div>
                </div>

                {/* Engagement Stats */}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1 group/stat hover:text-primary transition-colors">
                    <Eye className="h-3 w-3" />
                    <span className="font-medium text-[10px]">{post.view_count.toLocaleString()}</span>
                  </div>
                  {post.is_pinned && (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-semibold text-orange-500">📌 Pinned</span>
                    </div>
                  )}
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="h-3.5 w-3.5 text-primary" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Mobile View All Button */}
        {!loading && posts.length > 0 && (
          <div className="mt-6 sm:hidden">
            <Button variant="outline" asChild className="w-full h-10 rounded-lg border-2">
              <Link href="/blogs">
                View All Talks
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
