import { getPosts, getCategories } from "@/lib/api";
import BlogsClient from "./BlogsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Community Blogs - BGCE",
    description: "Insights, tutorials, and stories from our community",
};

export default async function BlogsPage() {
    // Fetch all published posts and categories
    const [posts, categories] = await Promise.all([
        getPosts({ limit: 100 }),
        getCategories(),
    ]);

    return <BlogsClient initialPosts={posts} categories={categories} />;
}
