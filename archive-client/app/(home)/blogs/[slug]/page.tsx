import { getPostBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import BlogDetailsClient from "./BlogDetailsClient";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: "Blog Not Found",
        };
    }

    return {
        title: post.meta_title || post.title,
        description: post.meta_description || post.summary,
        keywords: post.keywords,
        openGraph: {
            title: post.meta_title || post.title,
            description: post.meta_description || post.summary,
            images: post.og_image ? [post.og_image] : [],
        },
    };
}

export default async function BlogDetailsPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post || post.status !== "published" || !post.is_public) {
        notFound();
    }

    return <BlogDetailsClient post={post} />;
}
