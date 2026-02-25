"use client";

import Link from "next/link";
import { ArrowRight, MessageSquare, ThumbsUp, Eye, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function CommunityTalksSection() {
  const talks = [
    {
      id: 1,
      title: "Building Scalable Microservices with Go",
      author: {
        name: "Sarah Chen",
        avatar: "SC",
      },
      date: "2 days ago",
      views: 1250,
      likes: 89,
      comments: 23,
      category: "Architecture",
      trending: true,
    },
    {
      id: 2,
      title: "Optimizing Database Queries in Production",
      author: {
        name: "Michael Rodriguez",
        avatar: "MR",
      },
      date: "5 days ago",
      views: 2100,
      likes: 156,
      comments: 45,
      category: "Performance",
      trending: true,
    },
    {
      id: 3,
      title: "Introduction to gRPC and Protocol Buffers",
      author: {
        name: "Emily Watson",
        avatar: "EW",
      },
      date: "1 week ago",
      views: 3400,
      likes: 234,
      comments: 67,
      category: "Tutorial",
      trending: false,
    },
    {
      id: 4,
      title: "Best Practices for Error Handling in Go",
      author: {
        name: "David Kim",
        avatar: "DK",
      },
      date: "1 week ago",
      views: 1890,
      likes: 142,
      comments: 38,
      category: "Best Practices",
      trending: false,
    },
    {
      id: 5,
      title: "Deploying Go Apps to Kubernetes",
      author: {
        name: "Lisa Anderson",
        avatar: "LA",
      },
      date: "2 weeks ago",
      views: 2750,
      likes: 198,
      comments: 52,
      category: "DevOps",
      trending: false,
    },
    {
      id: 6,
      title: "Testing Strategies for Go Applications",
      author: {
        name: "James Wilson",
        avatar: "JW",
      },
      date: "2 weeks ago",
      views: 1560,
      likes: 112,
      comments: 29,
      category: "Testing",
      trending: false,
    },
  ];

  return (
    <section className="py-10 lg:py-12 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 gap-3">
          <div className="space-y-1">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">Community Talks</h2>
            <p className="text-sm text-muted-foreground max-w-2xl">Learn from community experts and share your knowledge</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden sm:flex hover:bg-accent hover:scale-105 transition-all duration-200"
          >
            <Link href="/blogs">
              View All
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* Talks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {talks.slice(0, 3).map((talk) => (
            <Link
              key={talk.id}
              href={`/blogs/${talk.id}`}
              className="group relative bg-gradient-to-br from-card to-card/80 dark:from-card dark:to-card/50 border-2 border-border rounded-lg p-4 
                hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 
                hover:border-primary/50 hover:ring-2 hover:ring-primary/20
                transition-all duration-300 ease-out backdrop-blur-sm
                focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {/* Category Badge */}
              <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold mb-2.5 border border-primary/20">
                {talk.category}
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-foreground mb-2.5 group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem] leading-tight">
                {talk.title}
              </h3>

              {/* Author Info */}
              <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-border">
                <Avatar className="h-7 w-7 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-[10px] font-bold">
                    {talk.author.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{talk.author.name}</p>
                  <p className="text-[10px] text-muted-foreground">{talk.date}</p>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1 group/stat hover:text-primary transition-colors">
                  <Eye className="h-3 w-3" />
                  <span className="font-medium text-[10px]">{talk.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 group/stat hover:text-primary transition-colors">
                  <ThumbsUp className="h-3 w-3" />
                  <span className="font-medium text-[10px]">{talk.likes}</span>
                </div>
                <div className="flex items-center gap-1 group/stat hover:text-primary transition-colors">
                  <MessageSquare className="h-3 w-3" />
                  <span className="font-medium text-[10px]">{talk.comments}</span>
                </div>
              </div>

              {/* Hover Arrow */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="h-3.5 w-3.5 text-primary" />
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-6 sm:hidden">
          <Button variant="outline" asChild className="w-full h-10 rounded-lg border-2">
            <Link href="/blogs">
              View All Talks
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
