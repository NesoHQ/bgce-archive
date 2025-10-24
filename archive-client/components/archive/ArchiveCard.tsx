import Link from "next/link";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Article } from "@/types/blog.type";
import Image from "next/image";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 py-0">
      <div className="aspect-video bg-muted relative">
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-muted-foreground/10 flex items-center justify-center">
          <Image
            src="https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg"
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {article.description}
        </p>
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          {article.publication}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="outline"
          className="w-full bg-gray-800 text-white hover:bg-gray-950 hover:text-white   transition duration-400 ease-in-out"
          asChild
        >
          <Link href={`/archive/${String(article.id)}`}>Read Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
