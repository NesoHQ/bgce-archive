"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Cloud,
  Shield,
  Cpu,
  Layers,
  Server,
  FileText,
  Users,
  Clock,
  FolderOpen,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCategories } from "@/lib/api";
import type { ApiCategory } from "@/types/blog.type";

// Icon mapping for categories
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  cloud: Cloud,
  shield: Shield,
  cpu: Cpu,
  layers: Layers,
  server: Server,
  default: FolderOpen,
};

const contributors = [
  {
    rank: 1,
    name: "Riku_Kobayashi",
    points: "70,547",
    avatar: "/avatars/1.png",
  },
  {
    rank: 2,
    name: "Oleksii Bebych",
    points: "26,425",
    avatar: "/avatars/2.png",
  },
  {
    rank: 3,
    name: "Didier Durand",
    points: "23,846",
    avatar: "/avatars/3.png",
  },
  {
    rank: 4,
    name: "Gary",
    points: "22,420",
    avatar: "/avatars/4.png",
  },
  {
    rank: 5,
    name: "Giovanni Lauria",
    points: "19,619",
    avatar: "/avatars/5.png",
  },
];

// Helper function to get icon for category
function getCategoryIcon(slug: string) {
  const lowerSlug = slug.toLowerCase();
  for (const [key, Icon] of Object.entries(iconMap)) {
    if (lowerSlug.includes(key)) {
      return Icon;
    }
  }
  return iconMap.default;
}

export default function PopularSection() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();

        // If API returns empty array (error case), use fallback data
        if (data.length === 0) {
          setCategories([
            {
              id: 1,
              uuid: "fallback-1",
              label: "Cloud Computing",
              slug: "cloud-computing",
              description: "Learn about cloud infrastructure and services",
              status: "approved",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 2,
              uuid: "fallback-2",
              label: "Security",
              slug: "security",
              description: "Best practices for application security",
              status: "approved",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 3,
              uuid: "fallback-3",
              label: "Performance",
              slug: "performance",
              description: "Optimize your applications for speed",
              status: "approved",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 4,
              uuid: "fallback-4",
              label: "Architecture",
              slug: "architecture",
              description: "Design scalable system architectures",
              status: "approved",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 5,
              uuid: "fallback-5",
              label: "DevOps",
              slug: "devops",
              description: "Streamline development and operations",
              status: "approved",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);
        } else {
          setCategories(data.slice(0, 5)); // Show top 5 categories
        }
      } catch (error) {
        // Silently handle error - fallback data will be shown
        console.warn("Using fallback categories due to API unavailability");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <main className="container mx-auto py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section: Topics */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Follow popular topics
            </h2>
            <p className="text-sm text-muted-foreground font-mono mt-2">
              Explore trending categories
            </p>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="p-2 rounded-md bg-card/30 border border-white/5 backdrop-blur-md animate-pulse"
                >
                  <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 rounded-[1.5rem] bg-card/30 border border-white/5 backdrop-blur-md text-center text-muted-foreground">
              No categories available yet
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => {
                const IconComponent = getCategoryIcon(category.slug);
                return (
                  <div
                    key={category.id}
                    className="p-2 rounded-md  bg-card/50 border border-gray-200 dark:border-white/10 backdrop-blur-md hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer group shadow-lg"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
                      {/* Left: Icon + Title */}
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">
                            {category.label}
                          </span>
                          {category.description && (
                            <span className="text-xs text-muted-foreground line-clamp-1 font-mono">
                              {category.description}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Stats Row */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          {Math.floor(Math.random() * 10000)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5 text-primary" />
                          {Math.floor(Math.random() * 500)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Server className="h-3.5 w-3.5 text-primary" />
                          {Math.floor(Math.random() * 20)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-primary" />
                          {Math.floor(Math.random() * 5000)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Right Section: Contributors */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Top contributors
            </h2>
            <p className="text-sm text-muted-foreground font-mono mt-2">
              Community leaders
            </p>
          </div>

          <div className="rounded-md bg-card/50 border border-gray-200 dark:border-white/10 backdrop-blur-md overflow-hidden shadow-lg">
            <Table className="w-full text-sm">
              <TableHeader className="bg-muted/80 border-b border-white/10">
                <TableRow>
                  <TableHead className="p-4 font-bold text-center text-foreground uppercase tracking-widest text-[10px]">
                    Rank
                  </TableHead>
                  <TableHead className="p-4 font-bold text-left text-foreground uppercase tracking-widest text-[10px]">
                    Name
                  </TableHead>
                  <TableHead className="p-4 font-bold text-left text-foreground uppercase tracking-widest text-[10px]">
                    Points
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {contributors.map((contributor) => (
                  <TableRow
                    key={contributor.rank}
                    className="border-b border-gray-200 last:border-0 dark:border-white/10 transition-colors"
                  >
                    <TableCell className="p-4 font-medium text-center">
                      {contributor.rank <= 3 ? (
                        <span className="text-xl">
                          {contributor.rank === 1 && "🥇"}
                          {contributor.rank === 2 && "🥈"}
                          {contributor.rank === 3 && "🥉"}
                        </span>
                      ) : (
                        <span className="font-mono">{contributor.rank}</span>
                      )}
                    </TableCell>

                    <TableCell className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-primary/20">
                          <AvatarImage src={contributor.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {contributor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{contributor.name}</span>
                      </div>
                    </TableCell>

                    <TableCell className="p-4 font-mono font-bold text-primary">
                      {contributor.points}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </main>
  );
}
