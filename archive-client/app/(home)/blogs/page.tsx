import BlogsClient from "./BlogsClientOptimized";
import type { Metadata } from "next";
import { api } from "@/lib/api";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";

// Force dynamic rendering - no caching per user request
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Community Blogs - BGCE",
  description: "Insights, tutorials, and stories from our community",
};

export default async function BlogsPage() {
  const queryClient = getQueryClient();

  // Prefetch data on the server using TanStack Query
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["categories"],
      queryFn: () => api.getCategories(),
    }),
    queryClient.prefetchQuery({
      queryKey: ["posts", { limit: 9, offset: 0 }],
      queryFn: () => api.getPosts({ limit: 9, offset: 0 }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogsClient />
    </HydrationBoundary>
  );
}
