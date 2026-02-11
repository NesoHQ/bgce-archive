import { ApiPost, Article } from "@/types/blog.type";

export function transformPostToArticle(post: ApiPost): Article {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    author: {
      name: "Archive Team",
      avatar: "", // placeholder.svg
      badge: "CONTRIBUTOR",
      badgeColor: "bg-blue-600",
    },
    publishedAt: post.published_at
      ? new Date(post.published_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : new Date(post.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    views: post.view_count,
    votes: 0,
    description: post.summary || post.meta_description || "",
    tags: post.keywords ? post.keywords.split(",").map((k) => k.trim()) : [],
    date: post.published_at || post.created_at,
    category_id: post.category_id,
    subcategory_id: post.sub_category_id,
  };
}

export function transformPostsToArticles(posts: ApiPost[]): Article[] {
  return posts.map(transformPostToArticle);
}
