"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ApiPost, Article } from "@/types/blog.type";
import { Calendar, Eye, Clock, Star } from "lucide-react";

interface ArticleCardProps {
  article: ApiPost | Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  // Type guard to check if it's an ApiPost
  const isApiPost = (art: ApiPost | Article): art is ApiPost => {
    return "content" in art && "status" in art;
  };

  const postUrl = `/archive/post/${article.slug}`;

  // Handle both Article and ApiPost types
  const publishedDate =
    isApiPost(article) && article.published_at
      ? new Date(article.published_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      : isApiPost(article) && article.created_at
        ? new Date(article.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
        : "date" in article
          ? new Date(article.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
          : "N/A";

  const tags =
    isApiPost(article) && article.keywords
      ? article.keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
      : "tags" in article
        ? article.tags
        : [];

  const content = isApiPost(article) ? article.content : article.description;
  const wordCount = content?.split(/\s+/).length || 0;
  const readingTime = Math.ceil(wordCount / 200);

  const isFeatured = isApiPost(article) ? article.is_featured : false;
  const isPinned = isApiPost(article) ? article.is_pinned : false;
  const summary = isApiPost(article) ? article.summary : article.description;
  const viewCount = isApiPost(article)
    ? article.view_count
    : "views" in article
      ? article.views
      : 0;

  return (
    <Link href={postUrl}>
      <div className="h-full rounded-2xl bg-gradient-to-br from-card/90 to-card/70 dark:from-card dark:to-card/60 border-2 border-border backdrop-blur-sm 
        hover:border-primary/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20
        transition-all duration-300 ease-out cursor-pointer group overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative">
          <div className="p-6 space-y-5">
            {(isFeatured || isPinned) && (
              <div className="flex flex-wrap gap-2">
                {isFeatured && (
                  <Badge className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-primary/30 font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 shadow-lg">
                    <Star className="h-3 w-3 mr-1 fill-primary" />
                    Featured
                  </Badge>
                )}
                {isPinned && (
                  <Badge className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-primary/30 font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 shadow-lg">
                    Pinned
                  </Badge>
                )}
              </div>
            )}

            <h3 className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300 min-h-[3.5rem]">
              {article.title}
            </h3>

            {summary && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {summary}
              </p>
            )}

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 3).map((tag, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-full border-border hover:bg-primary/10 hover:border-primary/30 transition-all"
                  >
                    #{tag}
                  </Badge>
                ))}
                {tags.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-full border-border bg-primary/5"
                  >
                    +{tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="px-6 py-5 bg-gradient-to-r from-muted/90 to-muted/70 border-t-2 border-border">
            <div className="grid grid-cols-3 gap-4 text-xs font-mono">
              <div className="text-center group/stat">
                <div className="p-2.5 rounded-xl bg-primary/10 inline-block mb-2 group-hover/stat:bg-primary/20 group-hover/stat:scale-110 transition-all duration-200">
                  <Calendar className="h-4 w-4 text-primary mx-auto" />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  Published
                </div>
                <div className="font-bold mt-1.5 text-foreground">{publishedDate}</div>
              </div>
              <div className="text-center group/stat">
                <div className="p-2.5 rounded-xl bg-primary/10 inline-block mb-2 group-hover/stat:bg-primary/20 group-hover/stat:scale-110 transition-all duration-200">
                  <Clock className="h-4 w-4 text-primary mx-auto" />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  Read
                </div>
                <div className="font-bold mt-1.5 text-foreground">{readingTime} min</div>
              </div>
              <div className="text-center group/stat">
                <div className="p-2.5 rounded-xl bg-primary/10 inline-block mb-2 group-hover/stat:bg-primary/20 group-hover/stat:scale-110 transition-all duration-200">
                  <Eye className="h-4 w-4 text-primary mx-auto" />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  Views
                </div>
                <div className="font-bold mt-1.5 text-foreground">{viewCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
