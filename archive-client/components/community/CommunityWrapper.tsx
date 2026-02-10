"use client";

import { useState } from "react";
import { CommunityBreadcrumb } from "./CommunityBreadcrumb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Users,
  Calendar,
  Search,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  Filter,
} from "lucide-react";

// Mock Data
const discussions = [
  {
    id: 1,
    title: "Best practices for Go routine management in high-load services",
    author: { name: "Alex Chen", avatar: "", color: "bg-blue-500" },
    category: "Technical",
    replies: 24,
    views: 1205,
    lastActive: "2h ago",
    tags: ["golang", "concurrency", "performance"],
  },
  {
    id: 2,
    title: "Upcoming changes in Go 1.22: Range over integers",
    author: { name: "Sarah Miller", avatar: "", color: "bg-purple-500" },
    category: "News",
    replies: 156,
    views: 5430,
    lastActive: "4h ago",
    tags: ["news", "update"],
  },
  {
    id: 3,
    title: "How to structure a large scale microservices architecture?",
    author: { name: "David Kim", avatar: "", color: "bg-green-500" },
    category: "Architecture",
    replies: 45,
    views: 2100,
    lastActive: "1d ago",
    tags: ["microservices", "architecture"],
  },
  {
    id: 4,
    title: "Anyone attending GopherCon 2026?",
    author: { name: "Emily White", avatar: "", color: "bg-red-500" },
    category: "Events",
    replies: 89,
    views: 3400,
    lastActive: "1d ago",
    tags: ["events", "community"],
  },
];

const contributors = [
  {
    name: "Sarah Miller",
    points: 1540,
    role: "Core Maintainer",
    color: "bg-purple-500",
  },
  {
    name: "Alex Chen",
    points: 1250,
    role: "Contributor",
    color: "bg-blue-500",
  },
  { name: "David Kim", points: 980, role: "Member", color: "bg-green-500" },
];

const events = [
  { title: "GopherCon 2026", date: "Oct 15-18", location: "San Diego, CA" },
  { title: "Go Systems Meetup", date: "Nov 5", location: "Online" },
];

const CommunityWrapper = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative min-h-screen">
      {/* Technical Grid Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <CommunityBreadcrumb />
        </div>

        {/* Hero Section */}
        <div className="mb-16 space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-5xl font-bold tracking-tight leading-[1.1]">
              Community{" "}
              <span className="text-primary italic bg-gradient-to-r from-primary to-primary/60 bg-clip-text ">
                Hub
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
              Connect with fellow developers, share knowledge, and stay updated
              with the latest community events.
            </p>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-center">
          <div className="relative flex-1 w-full group">
            <Input
              placeholder="Search discussions, members, or events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 h-14 min-h-[56px] max-h-[56px] py-3 rounded-md border-white/20 bg-card/50 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary/50 font-mono shadow-lg hover:shadow-xl transition-all"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 pointer-events-none z-10 transition-colors">
              <Search className="h-4 w-4 text-primary" />
            </div>
          </div>

          <Button className="h-14 min-h-[56px] px-8 rounded-md font-bold shadow-lg bg-primary hover:bg-primary/90 transition-all text-primary-foreground gap-2">
            <Plus className="h-5 w-5" />
            New Discussion
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Discussions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                Latest Discussions
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary"
                >
                  <TrendingUp className="h-4 w-4 mr-2" /> Trending
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Clock className="h-4 w-4 mr-2" /> Recent
                </Button>
              </div>
            </div>

            {discussions.map((discussion) => (
              <div
                key={discussion.id}
                className="group p-6 rounded-md bg-card/50 border border-gray-200 dark:border-white/10 backdrop-blur-md hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1 min-w-[60px] text-muted-foreground">
                    <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/50 group-hover:bg-primary/10 transition-colors">
                      <span className="text-lg font-bold group-hover:text-primary">
                        {discussion.replies}
                      </span>
                      <span className="text-[10px] uppercase">Replies</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className="border-primary/20 text-primary bg-primary/5 text-[10px] uppercase tracking-wider"
                      >
                        {discussion.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        • {discussion.lastActive}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors leading-snug">
                      {discussion.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {discussion.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    <Avatar className="h-10 w-10 border-2 border-background ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                      <AvatarFallback
                        className={`${discussion.author.color} text-white text-xs`}
                      >
                        {discussion.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full py-6 mt-4 border-dashed border-2 hover:border-primary/50 text-muted-foreground hover:text-primary"
            >
              View All Discussions <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-8">
            {/* Top Contributors */}
            <div className="rounded-md bg-card/30 border border-gray-200 dark:border-white/10 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Top Contributors
              </h3>
              <div className="space-y-4">
                {contributors.map((contributor, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarFallback
                          className={`${contributor.color} text-white text-xs`}
                        >
                          {contributor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                        {i + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm group-hover:text-primary transition-colors">
                        {contributor.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {contributor.role}
                      </div>
                    </div>
                    <div className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-sm">
                      {contributor.points}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-4 text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"
              >
                View Leaderboard
              </Button>
            </div>

            {/* Upcoming Events */}
            <div className="rounded-md bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-6 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Calendar className="h-24 w-24 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Events
              </h3>
              <div className="space-y-4 relative z-10">
                {events.map((event, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-3 rounded-lg bg-background/40 hover:bg-background/60 transition-colors border border-white/5"
                  >
                    <div className="flex flex-col items-center justify-center bg-primary/10 rounded-md p-2 min-w-[50px] text-primary border border-primary/20">
                      <span className="text-xs font-bold uppercase">
                        {event.date.split(" ")[0]}
                      </span>
                      <span className="text-lg font-bold">
                        {event.date.split(" ")[1].split("-")[0]}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-sm leading-tight mb-1">
                        {event.title}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-6 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20">
                See All Events
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityWrapper;
