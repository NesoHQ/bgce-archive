import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Article } from "@/types/blog.type";
import Link from "next/link";
import { ThumbsUp, Eye, Calendar } from "lucide-react";

interface ArticleListProps {
  articles: Article[];
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
  console.log(articles);

  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <div
          key={article.id}
          className="rounded-md bg-card/50 border border-gray-200 dark:border-white/10 backdrop-blur-md hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden shadow-lg"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Main Content */}
            <div className="flex-1 p-8 space-y-4">
              <Link href={`/archive/post/${article.slug}`}>
                <h2 className="text-2xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer">
                  {article.title}
                </h2>
              </Link>

              <p className="text-muted-foreground leading-relaxed">
                {article.description}
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/10 text-primary border-primary/20 font-mono text-[10px] uppercase tracking-[0.2em]">
                  Article
                </Badge>
                {article.tags.slice(0, 5).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-[10px] font-mono uppercase tracking-wider border-white/10 hover:bg-primary/10 hover:border-primary/20 transition-colors"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Stats and Author Section */}
            <div className="bg-muted/80 p-6 lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10">
              <div className="flex lg:flex-col gap-6">
                {/* Stats */}
                <div className="flex lg:flex-row gap-6 lg:mb-6 items-center">
                  <div className="text-center">
                    <ThumbsUp className="h-4 w-4 text-primary mb-1 mx-auto" />
                    <div className="text-2xl font-bold font-mono text-primary">
                      {article.votes}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
                      Votes
                    </div>
                  </div>
                  <div className="text-center">
                    <Eye className="h-4 w-4 text-primary mb-1 mx-auto" />
                    <div className="text-2xl font-bold font-mono text-primary">
                      {article.views}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
                      Views
                    </div>
                  </div>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 flex-1 lg:flex-initial">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage
                      src={article.author.avatar}
                      alt={article.author.name || "Author"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {article.author.name
                        ? article.author.name.substring(0, 2).toUpperCase()
                        : "AU"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`inline-block px-3 py-1 ${article.author.badgeColor || "bg-primary"} text-primary-foreground text-[10px] font-mono font-bold rounded-full mb-2 uppercase tracking-wider`}
                    >
                      {article.author.badge || "Member"}
                    </div>
                    <div className="font-bold hover:text-primary transition-colors cursor-pointer">
                      {article.author.name || "Anonymous"}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      {article.date}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
