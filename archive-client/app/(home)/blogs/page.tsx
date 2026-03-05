import BlogsClient from "./BlogsClientOptimized";
import type { Metadata } from "next";
import { api } from "@/lib/api";

// Force dynamic rendering - no caching per user request
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Community Blogs - BGCE",
  description: "Insights, tutorials, and stories from our community",
};

export default async function BlogsPage() {
  // Parallel fetching on the server for speed
  const [categories, { data: posts, total }] = await Promise.all([
    api.getCategories(),
    api.getPosts({ limit: 9, offset: 0 })
  ]);

  return (
    <BlogsClient
      initialCategories={categories}
      initialPosts={posts}
      initialTotal={total}
    />
  );
}
