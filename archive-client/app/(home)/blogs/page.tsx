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
    const [{data: posts}, categories] = await Promise.all([
        getPosts({ limit: 100 }),
        getCategories(),
    ]);

    return <BlogsClient initialPosts={posts} categories={categories} />;
}
