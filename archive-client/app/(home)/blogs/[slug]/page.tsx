import BlogDetailsClient from "./BlogDetailsClient";
import type { Metadata } from "next";
import { api } from "@/lib/api";
import { notFound } from "next/navigation";

// Force dynamic rendering - no caching per user request
export const dynamic = "force-dynamic";

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
    const post = await api.getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return <BlogDetailsClient initialPost={post} slug={slug} />;
}
