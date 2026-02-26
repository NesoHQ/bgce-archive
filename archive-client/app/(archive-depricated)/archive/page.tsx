import ArchiveWrapper from "@/components/archive/ArchiveWrapper";
import { getPosts } from "@/lib/api";
import { transformPostsToArticles } from "@/lib/transformers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Archive - BGCE",
  description: "Browse all posts from the Best Golang Community Ever",
};

const ArticlesPage = async () => {
  // Fetch all posts
  const posts = await getPosts({ limit: 50 });

  // Transform API posts to Article format
  const articles = transformPostsToArticles(posts);

  return (
    <>
      <ArchiveWrapper articles={articles} />
    </>
  );
};

export default ArticlesPage;
