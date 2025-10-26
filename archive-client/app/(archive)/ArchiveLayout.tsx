import CategoriesSidebar from "@/components/archive/CategoriesSidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Category } from "@/types/blog.type";
import { Filter } from "lucide-react";

interface ArchiveLayoutProps {
  children: React.ReactNode;
}

const ArchiveLayout = ({ children }: ArchiveLayoutProps) => {
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

  return (
    <div className="bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Button */}
          {/* <div className="lg:hidden">
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

          {/* Sidebar - Desktop *
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <CategoriesSidebar categories={categories} />
            </div>
          </aside> */}

          {/* Main Content */}
          <main className="flex-1 min-w-0 ">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default ArchiveLayout;
