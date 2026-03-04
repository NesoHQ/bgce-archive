import BlogDetailsClient from "./BlogDetailsClient";
import type { Metadata } from "next";

// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    return {
        title: `${slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} - BGCE`,
        description: "Read this article on BGCE Community",
    };
}

export default async function BlogDetailsPage({ params }: PageProps) {
    const { slug } = await params;
    return <BlogDetailsClient slug={slug} />;
}
