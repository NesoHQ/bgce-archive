"use client";

import Link from "next/link";
import { ArrowRight, MessageSquare, ThumbsUp, Eye } from "lucide-react";
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
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Community Talks</h2>
            <p className="text-muted-foreground mt-2">Learn from community experts and share your knowledge</p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link href="/blogs">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Talks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talks.map((talk) => (
            <Link
              key={talk.id}
              href={`/blogs/${talk.id}`}
              className="group bg-card border border-border rounded-xl p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/50 transition-all duration-300"
            >
              {/* Category Badge */}
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                {talk.category}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2">
                {talk.title}
              </h3>

              {/* Author Info */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                    {talk.author.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{talk.author.name}</p>
                  <p className="text-xs text-muted-foreground">{talk.date}</p>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {talk.views.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  {talk.likes}
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {talk.comments}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 sm:hidden">
          <Button variant="outline" asChild className="w-full">
            <Link href="/blogs">
              View All Talks
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
