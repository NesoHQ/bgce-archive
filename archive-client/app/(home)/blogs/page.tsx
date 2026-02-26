import { getPosts } from "@/lib/api";
import BlogsClient from "./BlogsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Community Blogs - BGCE",
    description: "Insights, tutorials, and stories from our community",
};

export default async function BlogsPage() {
    // Fetch all published posts
    const posts = await getPosts({ limit: 100 });

    return <BlogsClient posts={posts} />;
}
