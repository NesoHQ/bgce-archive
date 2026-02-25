"use client";

import { useState, useEffect } from "react";
import { CommunityBreadcrumb } from "./CommunityBreadcrumb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Portal } from "@/components/ui/Portal";
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
  X,
  Eye,
  MessageCircle,
  SlidersHorizontal,
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
  { name: "Sarah Miller", points: 1540, role: "Core Maintainer", color: "bg-purple-500" },
  { name: "Alex Chen", points: 1250, role: "Contributor", color: "bg-blue-500" },
  { name: "David Kim", points: 980, role: "Member", color: "bg-green-500" },
];

const events = [
  { title: "GopherCon 2026", date: "Oct 15-18", location: "San Diego, CA" },
  { title: "Go Systems Meetup", date: "Nov 5", location: "Online" },
];

const CommunityWrapper = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("recent");

  const categories = ["Technical", "News", "Architecture", "Events", "General"];

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileFilters]);

  const activeFiltersCount = [selectedCategory, searchQuery].filter(Boolean).length;

  return (
    <div className="relative min-h-screen">
      {/* Combined Breadcrumb & Header Section */}
      <section className="py-4 border-b border-border/50 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-3">
            <CommunityBreadcrumb />
          </div>

          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-primary/10 dark:bg-primary/20">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Community Hub</h1>
          </div>
          <p className="text-xs text-muted-foreground">Connect, share knowledge, and grow together</p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4 flex gap-2">
          <Button
            onClick={() => setShowMobileFilters(true)}
            variant="outline"
            className="flex-1 h-10 border-2 dark:border-input dark:hover:border-[oklch(0.75_0.22_260)] dark:hover:bg-[oklch(0.28_0.06_260)] dark:hover:text-[oklch(0.85_0.28_260)] font-bold"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-white text-xs">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          <Button
            className="h-10 px-4 font-bold bg-gradient-to-r from-[oklch(0.4_0.14_260)] to-[oklch(0.35_0.12_260)] hover:from-[oklch(0.45_0.16_260)] hover:to-[oklch(0.4_0.14_260)] dark:from-[oklch(0.65_0.18_260)] dark:to-[oklch(0.6_0.16_260)] dark:hover:from-[oklch(0.75_0.22_260)] dark:hover:to-[oklch(0.7_0.2_260)] text-white dark:text-white"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Desktop New Discussion Button */}
        <div className="hidden lg:flex justify-end mb-4">
          <Button className="h-10 px-6 font-bold bg-gradient-to-r from-[oklch(0.4_0.14_260)] to-[oklch(0.35_0.12_260)] hover:from-[oklch(0.45_0.16_260)] hover:to-[oklch(0.4_0.14_260)] dark:from-[oklch(0.65_0.18_260)] dark:to-[oklch(0.6_0.16_260)] dark:hover:from-[oklch(0.75_0.22_260)] dark:hover:to-[oklch(0.7_0.2_260)] text-white dark:text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Discussion
          </Button>
        </div>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <Portal>
            <div
              data-mobile-drawer="true"
              className="fixed inset-0 lg:hidden"
              style={{ zIndex: 2147483646 }}
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setShowMobileFilters(false)}
              />

              {/* Drawer */}
              <div className="absolute inset-x-0 bottom-0 bg-card border-t-2 border-border dark:border-input rounded-t-2xl shadow-2xl max-h-[70vh] overflow-y-auto">
                {/* Drawer Header */}
                <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border dark:border-input p-4 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-bold text-foreground">Filters</h2>
                  </div>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 rounded-lg hover:bg-accent dark:hover:bg-accent/50 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Drawer Content */}
                <div className="p-4 space-y-4">
                  {/* Search */}
                  <div>
                    <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                      <Search className="h-3.5 w-3.5" />
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search discussions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11 text-base border-2 dark:bg-input/30 dark:border-input dark:hover:border-primary/50 dark:focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="text-sm font-bold text-foreground mb-2 block uppercase tracking-wide">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                          className={`px-3 py-2 rounded-full text-xs font-bold transition-all border-2 ${selectedCategory === category
                            ? "bg-primary text-white dark:text-white border-primary shadow-md dark:shadow-[0_0_8px_oklch(0.65_0.18_260/0.3)]"
                            : "bg-card/50 dark:bg-card/30 border-border dark:border-input hover:border-primary/50 dark:hover:border-[oklch(0.75_0.22_260)] hover:bg-accent dark:hover:bg-[oklch(0.28_0.06_260)] text-foreground dark:hover:text-[oklch(0.85_0.28_260)]"
                            }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedCategory(null);
                          setSearchQuery("");
                        }}
                        className="flex-1 h-11 text-sm font-bold border-2 dark:border-input dark:hover:border-[oklch(0.75_0.22_260)] dark:hover:bg-[oklch(0.28_0.06_260)] dark:hover:text-[oklch(0.85_0.28_260)]"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                    )}
                    <Button
                      onClick={() => setShowMobileFilters(false)}
                      className="flex-1 h-11 text-sm font-bold bg-gradient-to-r from-[oklch(0.4_0.14_260)] to-[oklch(0.35_0.12_260)] hover:from-[oklch(0.45_0.16_260)] hover:to-[oklch(0.4_0.14_260)] dark:from-[oklch(0.65_0.18_260)] dark:to-[oklch(0.6_0.16_260)] dark:hover:from-[oklch(0.75_0.22_260)] dark:hover:to-[oklch(0.7_0.2_260)] text-white dark:text-white"
                    >
                      Show Results
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Portal>
        )}

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Desktop Filters Sidebar - Hidden on Mobile */}
          <aside className="hidden lg:block lg:w-56 flex-shrink-0">
            <div className="sticky top-20 space-y-3">
              {/* Search */}
              <div>
                <label className="text-[10px] font-bold text-foreground mb-1 flex items-center gap-1 uppercase tracking-wide">
                  <Search className="h-2.5 w-2.5" />
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-7 h-7 text-xs border-2 dark:bg-input/30 dark:border-input dark:hover:border-primary/50 dark:focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="text-[10px] font-bold text-foreground mb-1 block uppercase tracking-wide">Sort By</label>
                <div className="space-y-1">
                  {[
                    { value: "recent", label: "Recent", icon: Clock },
                    { value: "trending", label: "Trending", icon: TrendingUp },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`w-full text-left px-2 py-1 rounded-md text-[10px] font-bold transition-all border-2 flex items-center gap-1.5 ${sortBy === option.value
                        ? "bg-primary text-white dark:text-white border-primary shadow-md dark:shadow-[0_0_12px_oklch(0.65_0.18_260/0.3)]"
                        : "bg-card/50 dark:bg-card/30 border-border dark:border-input hover:border-primary/50 dark:hover:border-[oklch(0.75_0.22_260)] hover:bg-accent dark:hover:bg-[oklch(0.28_0.06_260)] text-foreground dark:hover:text-[oklch(0.85_0.28_260)]"
                        }`}
                    >
                      <option.icon className="h-2.5 w-2.5" />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-[10px] font-bold text-foreground mb-1 block uppercase tracking-wide">Category</label>
                <div className="flex flex-wrap gap-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                      className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold transition-all border ${selectedCategory === category
                        ? "bg-primary text-white dark:text-white border-primary shadow-md dark:shadow-[0_0_8px_oklch(0.65_0.18_260/0.3)]"
                        : "bg-card/50 dark:bg-card/30 border-border dark:border-input hover:border-primary/50 dark:hover:border-[oklch(0.75_0.22_260)] hover:bg-accent dark:hover:bg-[oklch(0.28_0.06_260)] text-foreground dark:hover:text-[oklch(0.85_0.28_260)]"
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery("");
                  }}
                  className="w-full h-7 text-[10px] font-bold border-2 dark:border-input dark:hover:border-[oklch(0.75_0.22_260)] dark:hover:bg-[oklch(0.28_0.06_260)] dark:hover:text-[oklch(0.85_0.28_260)]"
                >
                  <X className="h-2.5 w-2.5 mr-1" />
                  Clear ({activeFiltersCount})
                </Button>
              )}

              {/* Top Contributors */}
              <div className="p-3 rounded-lg border-2 border-border dark:border-input bg-card/50 dark:bg-card/30 backdrop-blur-sm mt-4">
                <h3 className="text-[10px] font-bold text-foreground mb-2 flex items-center gap-1 uppercase tracking-wide">
                  <Users className="h-2.5 w-2.5" />
                  Top Contributors
                </h3>
                <div className="space-y-2">
                  {contributors.slice(0, 3).map((contributor, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-1.5 rounded-md hover:bg-accent/50 dark:hover:bg-accent/30 transition-colors cursor-pointer group"
                    >
                      <div className="relative">
                        <Avatar className="h-6 w-6 border border-border">
                          <AvatarFallback className={`${contributor.color} text-white text-[8px]`}>
                            {contributor.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-0.5 -right-0.5 bg-yellow-500 text-black text-[7px] font-black w-3 h-3 rounded-full flex items-center justify-center">
                          {i + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] font-bold truncate group-hover:text-primary dark:group-hover:text-[oklch(0.85_0.28_260)] transition-colors">
                          {contributor.name}
                        </div>
                        <div className="text-[8px] text-muted-foreground">{contributor.points} pts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold text-foreground">
                {discussions.length} Discussion{discussions.length !== 1 ? "s" : ''}
              </p>
            </div>

            {/* Discussions Grid */}
            <div className="grid grid-cols-1 gap-3">
              {discussions.map((discussion) => (
                <div
                  key={discussion.id}
                  className="group relative bg-gradient-to-br from-card via-card/95 to-card/80 dark:from-card dark:via-card/95 dark:to-card/50 border border-border dark:border-input backdrop-blur-sm rounded-lg overflow-hidden hover:shadow-lg dark:hover:shadow-[0_4px_20px_oklch(0.65_0.18_260/0.3)] hover:border-primary/50 dark:hover:border-[oklch(0.75_0.22_260)] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer p-3 sm:p-4"
                >
                  <div className="flex gap-3">
                    {/* Stats Column */}
                    <div className="hidden sm:flex flex-col items-center gap-2 min-w-[60px]">
                      <div className="flex flex-col items-center p-2 rounded-lg bg-accent/50 dark:bg-accent/30 border border-border/50 dark:border-input/30 w-full">
                        <MessageCircle className="h-3 w-3 text-primary mb-0.5" />
                        <span className="text-sm font-black text-foreground">{discussion.replies}</span>
                        <span className="text-[8px] text-muted-foreground uppercase">Replies</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-lg bg-accent/50 dark:bg-accent/30 border border-border/50 dark:border-input/30 w-full">
                        <Eye className="h-3 w-3 text-primary mb-0.5" />
                        <span className="text-[10px] font-black text-foreground">{(discussion.views / 1000).toFixed(1)}K</span>
                        <span className="text-[8px] text-muted-foreground uppercase">Views</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className="border-primary/20 text-primary bg-primary/10 dark:bg-primary/20 text-[9px] font-bold uppercase tracking-wider"
                        >
                          {discussion.category}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">• {discussion.lastActive}</span>
                        {/* Mobile Stats */}
                        <div className="sm:hidden ml-auto flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <MessageCircle className="h-2.5 w-2.5" />
                            {discussion.replies}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Eye className="h-2.5 w-2.5" />
                            {(discussion.views / 1000).toFixed(1)}K
                          </span>
                        </div>
                      </div>

                      <h3 className="text-sm sm:text-base font-black text-foreground mb-2 group-hover:text-primary dark:group-hover:text-[oklch(0.85_0.28_260)] dark:group-hover:drop-shadow-[0_0_8px_oklch(0.65_0.18_260/0.3)] transition-all line-clamp-2 leading-tight">
                        {discussion.title}
                      </h3>

                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {discussion.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-mono font-bold text-muted-foreground bg-muted/50 dark:bg-muted/30 px-1.5 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5 border border-border">
                          <AvatarFallback className={`${discussion.author.color} text-white text-[8px]`}>
                            {discussion.author.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[10px] font-semibold text-foreground">{discussion.author.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <Button
              variant="outline"
              className="w-full mt-4 h-10 border-2 border-dashed hover:border-primary/50 dark:hover:border-[oklch(0.75_0.22_260)] text-muted-foreground hover:text-primary dark:hover:text-[oklch(0.85_0.28_260)] dark:hover:bg-[oklch(0.28_0.06_260)] font-bold"
            >
              Load More Discussions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </main>

          {/* Right Sidebar - Desktop Only */}
          <aside className="hidden xl:block xl:w-64 flex-shrink-0">
            <div className="sticky top-20 space-y-4">
              {/* Upcoming Events */}
              <div className="p-4 rounded-lg border-2 border-primary/20 dark:border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Upcoming Events
                </h3>
                <div className="space-y-3">
                  {events.map((event, i) => (
                    <div
                      key={i}
                      className="flex gap-3 p-2 rounded-lg bg-card/50 dark:bg-card/30 hover:bg-card dark:hover:bg-card/50 transition-colors border border-border/50 dark:border-input/30"
                    >
                      <div className="flex flex-col items-center justify-center bg-primary/10 dark:bg-primary/20 rounded-md p-1.5 min-w-[40px] text-primary border border-primary/20">
                        <span className="text-[8px] font-bold uppercase">{event.date.split(" ")[0]}</span>
                        <span className="text-sm font-black">{event.date.split(" ")[1].split("-")[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold leading-tight mb-1 line-clamp-2">{event.title}</div>
                        <div className="text-[9px] text-muted-foreground flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-green-500"></span>
                          {event.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  size="sm"
                  className="w-full mt-3 h-8 text-[10px] font-bold bg-primary/20 hover:bg-primary/30 dark:bg-primary/30 dark:hover:bg-primary/40 text-primary border border-primary/20"
                >
                  See All Events
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CommunityWrapper;
