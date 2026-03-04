import BlogsClient from "./BlogsClientOptimized";
import type { Metadata } from "next";

// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Community Blogs - BGCE",
  description: "Insights, tutorials, and stories from our community",
};

export default async function BlogsPage() {
  // No server-side data fetching - let client handle it
  return <BlogsClient />;
}
