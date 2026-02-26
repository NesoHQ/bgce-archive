import ArchiveWrapper from "@/components/archive/ArchiveWrapper";
import { getPosts, getCategoryBySlug } from "@/lib/api";
import { transformPostsToArticles } from "@/lib/transformers";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        categorySlug: string;
    }>;
}

const CategoryPage = async ({ params }: PageProps) => {
    const { categorySlug } = await params;

    // Fetch category by slug
    const category = await getCategoryBySlug(categorySlug);

    if (!category) {
        notFound();
    }

    // Fetch posts for this category
    const posts = await getPosts({ category_id: category.id, limit: 50 });

    // Transform API posts to Article format
    const articles = transformPostsToArticles(posts);

    return (
        <>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">{category.label}</h1>
                {category.description && (
                    <p className="text-muted-foreground mt-2">{category.description}</p>
                )}
            </div>
            <ArchiveWrapper articles={articles} />
        </>
    );
};

export default CategoryPage;
