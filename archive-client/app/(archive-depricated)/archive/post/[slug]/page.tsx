import { getPostBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import ArticlePage from "@/components/archive/ArticlePage";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

const PostPage = async ({ params }: PageProps) => {
    const { slug } = await params;

    // Fetch post by slug
    const post = await getPostBySlug(slug);

    if (!post || post.status !== "published" || !post.is_public) {
        notFound();
    }

    return <ArticlePage post={post} />;
};

export default PostPage;
