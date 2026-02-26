import ArchiveWrapper from "@/components/archive/ArchiveWrapper";
import { getPosts, getSubcategories } from "@/lib/api";
import { transformPostsToArticles } from "@/lib/transformers";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        categorySlug: string;
        subcategorySlug: string;
    }>;
}

const SubcategoryPage = async ({ params }: PageProps) => {
    const { subcategorySlug } = await params;

    // Fetch all subcategories and find the one with matching slug
    const subcategories = await getSubcategories();
    const subcategory = subcategories.find((sub) => sub.slug === subcategorySlug);

    if (!subcategory) {
        notFound();
    }

    // Fetch posts for this subcategory
    const posts = await getPosts({
        category_id: subcategory.parent_id,
        sub_category_id: subcategory.id,
        limit: 50,
    });

    // Transform API posts to Article format
    const articles = transformPostsToArticles(posts);

    return (
        <>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">{subcategory.label}</h1>
                {subcategory.description && (
                    <p className="text-muted-foreground mt-2">
                        {subcategory.description}
                    </p>
                )}
            </div>
            <ArchiveWrapper articles={articles} />
        </>
    );
};

export default SubcategoryPage;
