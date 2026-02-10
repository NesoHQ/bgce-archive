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
      <div className="h-full rounded-md bg-gradient-to-br from-card/60 to-card/40  border border-gray-200  dark:border-white/10 backdrop-blur-md hover:border-primary/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 cursor-pointer group overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative">
          <div className="p-6 space-y-4">
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

            <h3 className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
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
                    className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border-white/20 hover:bg-primary/10 hover:border-primary/30 transition-all"
                  >
                    #{tag}
                  </Badge>
                ))}
                {tags.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border-white/20 bg-primary/5"
                  >
                    +{tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gradient-to-r from-muted/90 to-muted/70 border-t-2 border-white/10">
            <div className="grid grid-cols-3 gap-4 text-xs font-mono">
              <div className="text-center group/stat">
                <div className="p-2 rounded-xl bg-primary/10 inline-block mb-2 group-hover/stat:bg-primary/20 transition-colors">
                  <Calendar className="h-3.5 w-3.5 text-primary mx-auto" />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Published
                </div>
                <div className="font-bold mt-1">{publishedDate}</div>
              </div>
              <div className="text-center group/stat">
                <div className="p-2 rounded-xl bg-primary/10 inline-block mb-2 group-hover/stat:bg-primary/20 transition-colors">
                  <Clock className="h-3.5 w-3.5 text-primary mx-auto" />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Read
                </div>
                <div className="font-bold mt-1">{readingTime} min</div>
              </div>
              <div className="text-center group/stat">
                <div className="p-2 rounded-xl bg-primary/10 inline-block mb-2 group-hover/stat:bg-primary/20 transition-colors">
                  <Eye className="h-3.5 w-3.5 text-primary mx-auto" />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Views
                </div>
                <div className="font-bold mt-1">{viewCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
