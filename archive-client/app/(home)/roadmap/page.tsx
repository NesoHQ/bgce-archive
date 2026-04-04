"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  GitBranch,
  Calendar,
  Zap,
} from "lucide-react";

// const roadmapItems = {
//   completed: [
//     {
//       id: 1,
//       title: "Platform Launch",
//       date: "Q4 2023",
//       features: [
//         "User authentication",
//         "Course catalog",
//         "Community features",
//         "Content management",
//       ],
//     },
//     {
//       id: 2,
//       title: "Enhanced Learning",
//       date: "Q1 2024",
//       features: [
//         "Code playgrounds",
//         "Progress tracking",
//         "Video optimization",
//         "Mobile responsive",
//       ],
//     },
//   ],
//   inProgress: [
//     {
//       id: 3,
//       title: "Community Tools",
//       date: "Q2 2024",
//       progress: 65,
//       features: [
//         "Discussion forums",
//         "Project showcase",
//         "Code review",
//         "Live sessions",
//       ],
//     },
//     {
//       id: 4,
//       title: "AI Features",
//       date: "Q2-Q3 2024",
//       progress: 40,
//       features: [
//         "AI suggestions",
//         "Personalized paths",
//         "Mock interviews",
//         "Collaboration tools",
//       ],
//     },
//   ],
//   planned: [
//     {
//       id: 5,
//       title: "Cloud Labs",
//       date: "Q3 2024",
//       features: [
//         "Cloud-based IDE",
//         "Pre-configured envs",
//         "K8s playground",
//         "Cloud sandbox",
//       ],
//     },
//     {
//       id: 6,
//       title: "Career Tools",
//       date: "Q4 2024",
//       features: ["Job board", "Resume builder", "Interview prep", "Mentorship"],
//     },
//     {
//       id: 7,
//       title: "Enterprise",
//       date: "Q1 2025",
//       features: [
//         "Team dashboards",
//         "Custom paths",
//         "SSO auth",
//         "Bulk licensing",
//       ],
//     },
//     {
//       id: 8,
//       title: "Cloud Labs",
//       date: "Q3 2024",
//       features: [
//         "Cloud-based IDE",
//         "Pre-configured envs",
//         "K8s playground",
//         "Cloud sandbox",
//       ],
//     },
//     // {
//     //   id: 9,
//     //   title: "Career Tools",
//     //   date: "Q4 2024",
//     //   features: ["Job board", "Resume builder", "Interview prep", "Mentorship"],
//     // },
//     // {
//     //   id: 10,
//     //   title: "Enterprise",
//     //   date: "Q1 2025",
//     //   features: [
//     //     "Team dashboards",
//     //     "Custom paths",
//     //     "SSO auth",
//     //     "Bulk licensing",
//     //   ],
//     // },
//   ],
//   changelog: [
//     {
//       id: 1,
//       version: "v2.1.0",
//       date: "Feb 20",
//       type: "feature",
//       changes: [
//         "Dark mode support",
//         "Enhanced search",
//         "Mobile nav fixes",
//         "Performance boost",
//       ],
//     },
//     {
//       id: 2,
//       version: "v2.0.0",
//       date: "Jan 15",
//       type: "major",
//       changes: [
//         "UI redesign",
//         "New course player",
//         "Enhanced profiles",
//         "Bug fixes",
//       ],
//     },
//     {
//       id: 3,
//       version: "v1.5.0",
//       date: "Dec 10",
//       type: "feature",
//       changes: [
//         "Progress tracking",
//         "Certificate system",
//         "Performance",
//         "Security updates",
//       ],
//     },
//   ],
// };

const URLS = `https://roadmap.nesohq.org/api/v1/`;

interface RoadmapItem {
  id: string;
  title: string;
  date: string;
  progress?: number;
  features: string[];
}

interface ChangelogItem {
  id: string;
  version: string;
  date: string;
  type: "major" | "feature";
  changes: string[];
}

const transformRoadmapItems = (payload: any): RoadmapItem[] => {
  if (!payload?.data || !Array.isArray(payload.data)) return [];

  return payload.data.map((item: any) => ({
    id: item.id,
    title: item.title || "Untitled",
    date:
      item.date ||
      (item.startedAt
        ? `${item.startedAt.quartile} ${item.startedAt.year}`
        : item.completedAt
          ? `${item.completedAt.quartile} ${item.completedAt.year}`
          : item.plannedAt
            ? `${item.plannedAt.quartile} ${item.plannedAt.year}`
            : "Unknown"),
    progress:
      typeof item.progress === "number"
        ? item.progress
        : typeof item.completionPercentage === "number"
          ? item.completionPercentage
          : undefined,
    features: item.items || item.features || [],
  }));
};

const transformChangelogItems = (payload: any): ChangelogItem[] => {
  if (!payload?.data || !Array.isArray(payload.data)) return [];

  return payload.data.map((item: any) => ({
    id: item.id,
    version: item.title || "v0.0.0",
    date: item.month && item.year ? `${item.month} ${item.year}` : "Unknown",
    type: "feature" as const,
    changes: item.items || [],
  }));
};

export default function RoadmapPage() {
  const [plannedItems, setPlannedItems] = useState<RoadmapItem[]>([]);
  const [inProgressItems, setInProgressItems] = useState<RoadmapItem[]>([]);
  const [completedItems, setCompletedItems] = useState<RoadmapItem[]>([]);
  const [changelogItems, setChangelogItems] = useState<ChangelogItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlannedRoadmap = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${URLS}planned`);
      const res = await response.json();

      setPlannedItems(transformRoadmapItems(res));
    } catch (err) {
      setError("Failed to load planned roadmap.");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchInProgressRoadmap = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${URLS}in-progress`);
      const res = await response.json();
      setInProgressItems(transformRoadmapItems(res));
    } catch (err) {
      setError("Failed to load in-progress roadmap. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompletedRoadmap = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${URLS}completed`);
      const res = await response.json();
      setCompletedItems(transformRoadmapItems(res));
    } catch (err) {
      setError("Failed to load completed roadmap. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChengelog = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${URLS}changelog`);
      const res = await response.json();

      setChangelogItems(transformChangelogItems(res));
    } catch (err) {
      setError("Failed to load changelog. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlannedRoadmap();
    fetchInProgressRoadmap();
    fetchCompletedRoadmap();
    fetchChengelog();
  }, []);

  return (
    <>
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="min-h-screen">
        {/* Compact Header */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                    Product Roadmap
                  </h1>

                  {/* Operational Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">
                      Operational
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Track our progress and upcoming features
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary">
                  Live Updates
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap Grid */}
        <section className="py-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Planned Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 mb-4">
                  <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <h2 className="text-sm font-bold text-foreground">Planned</h2>
                  <span className="ml-auto flex items-center justify-center h-5 w-5 rounded-full bg-purple-500/10 text-xs font-semibold text-purple-600 dark:text-purple-400">
                    {plannedItems.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto hide-scrollbar">
                  {isLoading ? (
                    <div className="text-xs text-muted-foreground">
                      Loading planned roadmap...
                    </div>
                  ) : error ? (
                    <div className="text-xs text-red-500">{error}</div>
                  ) : plannedItems.length === 0 ? (
                    <div className="text-xs text-muted-foreground">
                      No planned items available.
                    </div>
                  ) : (
                    plannedItems.map((item) => (
                      <div
                        key={item.id}
                        className="group relative bg-gradient-to-br from-card to-card/80 dark:from-card dark:to-card/50 border-2 border-border rounded-lg p-4 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/40 hover:ring-2 hover:ring-purple-500/20 transition-all duration-200 backdrop-blur-sm overflow-hidden"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground flex-shrink-0">
                            <Calendar className="h-3 w-3" />
                            <span>{item.date}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {item.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Circle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground leading-relaxed">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* In Progress Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 mb-4">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-sm font-bold text-foreground">
                    In Progress
                  </h2>
                  <span className="ml-auto flex items-center justify-center h-5 w-5 rounded-full bg-blue-500/10 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {inProgressItems.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto hide-scrollbar">
                  {isLoading ? (
                    <div className="text-xs text-muted-foreground">
                      Loading in-progress roadmap...
                    </div>
                  ) : error ? (
                    <div className="text-xs text-red-500">{error}</div>
                  ) : inProgressItems.length === 0 ? (
                    <div className="text-xs text-muted-foreground">
                      No in-progress items available.
                    </div>
                  ) : (
                    inProgressItems.map((item) => (
                      <div
                        key={item.id}
                        className="group relative bg-gradient-to-br from-card to-card/80 dark:from-card dark:to-card/50 border-2 border-blue-500/20 rounded-lg p-4 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/40 hover:ring-2 hover:ring-blue-500/20 transition-all duration-200 backdrop-blur-sm overflow-hidden"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-1 text-[10px] font-medium text-blue-600 dark:text-blue-400 flex-shrink-0">
                            <Calendar className="h-3 w-3" />
                            <span>{item.date}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {typeof item.progress === "number" && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-medium text-muted-foreground">
                                Progress
                              </span>
                              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                                {item.progress}%
                              </span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          {item.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Clock className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                              <span className="text-xs text-muted-foreground leading-relaxed">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Completed Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 mb-4">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <h2 className="text-sm font-bold text-foreground">
                    Completed
                  </h2>
                  <span className="ml-auto flex items-center justify-center h-5 w-5 rounded-full bg-green-500/10 text-xs font-semibold text-green-600 dark:text-green-400">
                    {completedItems.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto hide-scrollbar">
                  {isLoading ? (
                    <div className="text-xs text-muted-foreground">
                      Loading completed roadmap...
                    </div>
                  ) : error ? (
                    <div className="text-xs text-red-500">{error}</div>
                  ) : completedItems.length === 0 ? (
                    <div className="text-xs text-muted-foreground">
                      No completed items available.
                    </div>
                  ) : (
                    completedItems.map((item) => (
                      <div
                        key={item.id}
                        className="group relative bg-gradient-to-br from-card to-card/80 dark:from-card dark:to-card/50 border-2 border-green-500/20 rounded-lg p-4 hover:shadow-lg hover:shadow-green-500/10 hover:border-green-500/40 hover:ring-2 hover:ring-green-500/20 transition-all duration-200 backdrop-blur-sm overflow-hidden"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors leading-tight">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-1 text-[10px] font-medium text-green-600 dark:text-green-400 flex-shrink-0">
                            <Calendar className="h-3 w-3" />
                            <span>{item.date}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {item.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-green-600 dark:text-green-400" />
                              <span className="text-xs text-muted-foreground leading-relaxed">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Changelog Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 mb-4">
                  <GitBranch className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-bold text-foreground">
                    Changelog
                  </h2>
                  <span className="ml-auto flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                    {changelogItems.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto hide-scrollbar">
                  {changelogItems.map((item) => (
                    <div
                      key={item.id}
                      className="group relative bg-gradient-to-br from-card to-card/80 dark:from-card dark:to-card/50 border-2 border-border rounded-lg p-4 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/40 hover:ring-2 hover:ring-primary/20 transition-all duration-200 backdrop-blur-sm overflow-hidden"
                    >
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-primary">
                            {item.version}
                          </span>
                          {item.type === "major" && (
                            <span className="text-[9px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">
                              MAJOR
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground flex-shrink-0">
                          {item.date}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {item.changes.map((change: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                            <span className="text-xs text-muted-foreground leading-relaxed">
                              {change}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Compact CTA */}
            <div className="mt-8">
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg p-4 border border-primary/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-0.5">
                      Have a Feature Request?
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Help us build the features you need
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="/discussion/new"
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
                    >
                      Submit Feedback
                    </a>
                    <a
                      href="/discussion"
                      className="px-4 py-2 bg-accent text-foreground rounded-lg text-xs font-medium hover:bg-accent/80 transition-colors whitespace-nowrap"
                    >
                      Discuss
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
