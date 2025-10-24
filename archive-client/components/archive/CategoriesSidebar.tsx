import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/blog.type";

interface CategoriesSidebarProps {
  categories: Category[];
}

const CategoriesSidebar = ({ categories }: CategoriesSidebarProps) => {
  return (
    <div className="space-y-6 border rounded-lg p-4 bg-background">
      <h3 className="font-semibold text-lg text-center">Categories</h3>
      <hr />
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="space-y-2">
            <Button
              variant="ghost"
              asChild
              className="font-medium text-sm text-foreground w-full justify-start"
            >
              <Link href="/">{category.name}</Link>
            </Button>
            <hr />
            <div className="space-y-1 ml-2">
              {category.subcategories.map((subcategory) => (
                <Button
                  key={subcategory.id}
                  variant="ghost"
                  className="w-full justify-start text-sm h-8"
                  asChild
                >
                  <Link href="/">{subcategory.name}</Link>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSidebar;
