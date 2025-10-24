import React from "react";
import ArchiveLayout from "../ArchiveLayout";
import ArticleCard from "@/components/archive/ArchiveCard";
import { PaginationDemo } from "@/components/archive/Pagination";
import { BlogBreadcrumb } from "@/components/archive/ArchiveBreadcrumb";
import { Article } from "@/types/blog.type";

const ArticlesPage = () => {
  const articles: Article[] = [
    {
      id: 1,
      title: "Understanding Next.js 15 New Features",
      description:
        "Explore the latest features and improvements in Next.js 15 and how they can benefit your projects.",
      publication: "Tech Journal - Jan 15, 2024",
      image: "/api/placeholder/300/200",
    },
    {
      id: 2,
      title: "The Future of Software Development",
      description:
        "A comprehensive look at emerging trends and technologies shaping the future of Software development.",
      publication: "Dev Weekly - Jan 12, 2024",
      image: "/api/placeholder/300/200",
    },
    {
      id: 3,
      title: "TypeScript Best Practices 2024",
      description:
        "Learn the most effective TypeScript patterns and practices for modern Software development.",
      publication: "Code Review - Jan 10, 2024",
      image: "/api/placeholder/300/200",
    },
    {
      id: 4,
      title: "Responsive Design Mastery",
      description:
        "Master the art of creating fully responsive layouts that work across all devices and screen sizes.",
      publication: "Design Monthly - Jan 8, 2024",
      image: "/api/placeholder/300/200",
    },
    {
      id: 5,
      title: "State Management in React",
      description:
        "Comparing different state management solutions and when to use each in your React applications.",
      publication: "React Digest - Jan 5, 2024",
      image: "/api/placeholder/300/200",
    },
    {
      id: 6,
      title: "CSS Grid vs Flexbox",
      description:
        "A detailed comparison of CSS Grid and Flexbox with practical examples and use cases.",
      publication: "Web Design Pro - Jan 3, 2024",
      image: "/api/placeholder/300/200",
    },
  ];

  return (
    <>
      <div className="mb-4">
        <BlogBreadcrumb />
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Software Development
        </h1>
        <p className="text-muted-foreground mt-2">
          Browse through our collection of Software development articles and
          tutorials
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        <PaginationDemo />
      </div>
    </>
  );
};

export default ArticlesPage;
