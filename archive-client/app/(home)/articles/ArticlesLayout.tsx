import { BlogBreadcrumb } from "@/components/articles/ArticleBreadcrumb";
import ArticleCard from "@/components/articles/ArticleCard";
import CategoriesSidebar from "@/components/articles/CategoriesSidebar";
import { PaginationDemo } from "@/components/articles/Pagination";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Article, Category } from "@/types/blog.type";
import { Filter } from "lucide-react";

const ArticlesLayout = () => {
  // Sample data for UI demonstration
  const categories: Category[] = [
    {
      id: "1",
      name: "Technology",
      subcategories: [
        { id: "1-1", name: "Software Development" },
        { id: "1-2", name: "Game Development" },
      ],
    },
    {
      id: "2",
      name: "Science",
      subcategories: [
        { id: "2-1", name: "Biology" },
        { id: "2-2", name: "Physics" },
      ],
    },
    {
      id: "3",
      name: "Arts",
      subcategories: [
        { id: "3-1", name: "Digital Art" },
        { id: "3-2", name: "Traditional Art" },
      ],
    },
  ];

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
    <div className="min-h-screen bg-background">
      {/* <BlogBreadcrumb /> */}

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Categories
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <CategoriesSidebar categories={categories} />
              </SheetContent>
            </Sheet>
          </div>

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <CategoriesSidebar categories={categories} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-4">
              <BlogBreadcrumb />
            </div>

            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">
                Software Development
              </h1>
              <p className="text-muted-foreground mt-2">
                Browse through our collection of Software development articles
                and tutorials
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesLayout;
