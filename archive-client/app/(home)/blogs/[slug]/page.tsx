import BlogDetailsClient from "./BlogDetailsClient";
import type { Metadata } from "next";
import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";

// Force dynamic rendering - no caching per user request
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await api.getPostBySlug(slug);

    return {
        title: post ? `${post.title} - BGCE` : `${slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} - BGCE`,
        description: post ? post.summary : "Read this article on BGCE Community",
    };
}

export default async function BlogDetailsPage({ params }: PageProps) {
    const { slug } = await params;
    const queryClient = getQueryClient();

    // Prefetch post data
    await queryClient.prefetchQuery({
        queryKey: ["post", slug],
        queryFn: () => api.getPostBySlug(slug),
        staleTime: 0,
    });

    const post = queryClient.getQueryData(["post", slug]) as Awaited<ReturnType<typeof api.getPostBySlug>>;

    if (!post) {
        notFound();
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <BlogDetailsClient slug={slug} initialPost={post} />
        </HydrationBoundary>
    );
}
