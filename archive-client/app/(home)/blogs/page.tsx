import BlogsClient from "./BlogsClientOptimized";
import type { Metadata } from "next";
import { getPosts } from "@/action/post.action";
import { getCategories } from "@/action/category.action";

export const metadata: Metadata = {
  title: "Community Blogs - BGCE",
  description: "Insights, tutorials, and stories from our community",
};

export default async function BlogsPage() {
  // Fetch all published posts and categories
  const [postResponse, categories] = await Promise.all([
    getPosts({ limit: 9, sort_by: "created_at", sort_order: "DESC" }),
    getCategories(),
  ]);

  return (
    <BlogsClient
      initialPosts={postResponse.data}
      initialTotal={postResponse.total}
      categories={categories}
    />
  );
}
