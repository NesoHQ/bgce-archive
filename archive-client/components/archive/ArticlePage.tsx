"use client";

import React, { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Calendar, Eye, Clock, Share2, Bookmark, Code2, ChevronRight } from "lucide-react";
import { ArchiveRightSidebar } from "./ArchiveRightSidebar";
import { ApiPost } from "@/types/blog.type";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

interface ArticlePageProps {
  post: ApiPost;
}

const ArticlePage = ({ post }: ArticlePageProps) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : new Date(post.created_at).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const tags = post.keywords ? post.keywords.split(',').map(k => k.trim()).filter(Boolean) : [];

  // Calculate reading time
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Extract headings for table of contents
  useEffect(() => {
    const extractedHeadings: Array<{ id: string; text: string; level: number }> = [];
    const lines = post.content.split('\n');

    lines.forEach((line) => {
      const h2Match = line.match(/^##\s+(.+)$/);
      const h3Match = line.match(/^###\s+(.+)$/);

      if (h2Match) {
        const text = h2Match[1];
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        extractedHeadings.push({ id, text, level: 2 });
      } else if (h3Match) {
        const text = h3Match[1];
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        extractedHeadings.push({ id, text, level: 3 });
      }
    });

    setHeadings(extractedHeadings);
  }, [post.content]);

  // Reading progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted/30 z-50">
        <div
          className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Technical Grid Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <article className="lg:col-span-8 animate-fade-in space-y-8">
              {/* Header Card */}
              <div className="p-8 rounded-[2rem] bg-card/50 border border-white/10 backdrop-blur-md space-y-6 shadow-lg">
                {/* Badges */}
                {(post.is_featured || post.is_pinned) && (
                  <div className="flex flex-wrap gap-2">
                    {post.is_featured && (
                      <Badge className="bg-primary/10 text-primary border-primary/20 font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1">
                        Featured
                      </Badge>
                    )}
                    {post.is_pinned && (
                      <Badge className="bg-primary/10 text-primary border-primary/20 font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1">
                        Pinned
                      </Badge>
                    )}
                  </div>
                )}

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                  {post.title}
                </h1>

                {/* Meta Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                  <div className="p-3 rounded-xl bg-muted/80 border border-white/10 text-center shadow-lg">
                    <Calendar className="w-4 h-4 text-primary mb-1 mx-auto" />
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Published</div>
                    <div className="text-xs font-bold mt-1">{publishedDate}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/80 border border-white/10 text-center shadow-lg">
                    <Clock className="w-4 h-4 text-primary mb-1 mx-auto" />
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Read Time</div>
                    <div className="text-xs font-bold mt-1">{readingTime} min</div>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/80 border border-white/10 text-center shadow-lg">
                    <Eye className="w-4 h-4 text-primary mb-1 mx-auto" />
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Views</div>
                    <div className="text-xs font-bold mt-1">{post.view_count}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/80 border border-white/10 text-center shadow-lg">
                    <Code2 className="w-4 h-4 text-primary mb-1 mx-auto" />
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Version</div>
                    <div className="text-xs font-bold mt-1">v{post.version}</div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              {post.summary && (
                <div className="p-6 bg-primary/10 rounded-[1.5rem] border border-primary/30 border-l-4 border-l-primary backdrop-blur-sm shadow-lg">
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary mb-3">Summary</div>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {post.summary}
                  </p>
                </div>
              )}

              {/* Table of Contents */}
              {headings.length > 0 && (
                <div className="p-6 rounded-[1.5rem] bg-card/50 border border-border backdrop-blur-sm shadow-lg">
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary mb-4 flex items-center gap-2">
                    <Code2 className="h-3 w-3" />
                    Table of Contents
                  </div>
                  <nav className="space-y-2">
                    {headings.map((heading, index) => (
                      <a
                        key={index}
                        href={`#${heading.id}`}
                        className={`block text-sm hover:text-primary transition-colors group ${heading.level === 3 ? 'ml-4' : ''
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className={heading.level === 2 ? 'font-semibold' : 'text-muted-foreground'}>
                            {heading.text}
                          </span>
                        </span>
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="text-[10px] font-mono hover:bg-primary/10 hover:border-primary/30 transition-colors cursor-pointer uppercase tracking-wider px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Markdown Content */}
              <div className="p-8 rounded-[2rem] bg-card/50 border border-white/10 backdrop-blur-md shadow-lg">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight, rehypeRaw]}
                    components={{
                      h1: ({ node, children, ...props }) => {
                        const text = String(children);
                        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        return (
                          <h1 id={id} className="text-4xl font-bold tracking-tight mt-12 mb-6 text-foreground scroll-mt-24" {...props}>
                            {children}
                          </h1>
                        );
                      },
                      h2: ({ node, children, ...props }) => {
                        const text = String(children);
                        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        return (
                          <h2 id={id} className="text-3xl font-bold tracking-tight mt-12 mb-6 text-foreground border-b-2 border-primary/20 pb-3 scroll-mt-24" {...props}>
                            {children}
                          </h2>
                        );
                      },
                      h3: ({ node, children, ...props }) => {
                        const text = String(children);
                        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        return (
                          <h3 id={id} className="text-2xl font-semibold tracking-tight mt-10 mb-5 text-foreground scroll-mt-24" {...props}>
                            {children}
                          </h3>
                        );
                      },
                      h4: ({ node, ...props }) => (
                        <h4 className="text-xl font-semibold tracking-tight mt-6 mb-3 text-foreground" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="text-base text-muted-foreground leading-8 mb-6" {...props} />
                      ),
                      a: ({ ...props }) => (
                        <a className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors font-medium" {...props} />
                      ),
                      code: ({ ...props }) => {
                        const { inline, className, children } = props as { inline?: boolean; className?: string; children?: React.ReactNode };
                        if (inline) {
                          return (
                            <code className="bg-primary/10 px-2 py-1 rounded-md text-sm font-mono text-primary border border-primary/20 font-semibold">
                              {children}
                            </code>
                          );
                        }
                        return (
                          <code className={className}>
                            {children}
                          </code>
                        );
                      },
                      pre: ({ ...props }) => (
                        <pre className="bg-muted/80 rounded-xl p-6 overflow-x-auto my-8 border-2 border-border font-mono text-sm shadow-lg hover:shadow-xl transition-shadow" {...props} />
                      ),
                      blockquote: ({ ...props }) => (
                        <blockquote className="border-l-4 border-primary pl-6 pr-6 py-4 italic text-muted-foreground my-8 bg-primary/5 rounded-r-lg" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="my-6 ml-6 space-y-3 list-disc marker:text-primary" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="my-6 ml-6 space-y-3 list-decimal marker:text-primary marker:font-semibold" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="text-muted-foreground leading-7 pl-2" {...props} />
                      ),
                      table: ({ node, ...props }) => (
                        <div className="my-6 overflow-x-auto">
                          <table className="w-full border-collapse border border-border rounded-lg overflow-hidden" {...props} />
                        </div>
                      ),
                      thead: ({ node, ...props }) => (
                        <thead className="bg-muted" {...props} />
                      ),
                      th: ({ node, ...props }) => (
                        <th className="border border-border px-4 py-3 text-left font-semibold text-sm" {...props} />
                      ),
                      td: ({ node, ...props }) => (
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground" {...props} />
                      ),
                      img: ({ node, ...props }) => (
                        <img className="rounded-lg my-6 border border-border" {...props} />
                      ),
                      hr: ({ node, ...props }) => (
                        <hr className="my-8 border-border" {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="font-semibold text-foreground" {...props} />
                      ),
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 rounded-[2rem] bg-card/50 border border-white/10 backdrop-blur-md shadow-lg">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-mono uppercase tracking-widest rounded-full border border-white/20 hover:bg-primary/10 hover:border-primary/30 transition-all shadow-lg">
                      <ThumbsUp className="w-4 h-4" />
                      <span>Helpful</span>
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-mono uppercase tracking-widest rounded-full border border-white/20 hover:bg-primary/10 hover:border-primary/30 transition-all shadow-lg">
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-mono uppercase tracking-widest rounded-full border border-white/20 hover:bg-primary/10 hover:border-primary/30 transition-all shadow-lg">
                      <Bookmark className="w-4 h-4" />
                      <span className="hidden sm:inline">Save</span>
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-mono uppercase tracking-widest rounded-full border border-white/20 hover:bg-primary/10 hover:border-primary/30 transition-all shadow-lg">
                      <Share2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <ArchiveRightSidebar post={post} />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
