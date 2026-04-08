"use server";

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

export async function fetchPlannedRoadmap(): Promise<RoadmapItem[]> {
  try {
    const response = await fetch(`${URLS}planned`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const res = await response.json();
    return transformRoadmapItems(res);
  } catch (err) {
    console.error("Failed to load planned roadmap:", err);
    return [];
  }
}

export async function fetchInProgressRoadmap(): Promise<RoadmapItem[]> {
  try {
    const response = await fetch(`${URLS}in-progress`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const res = await response.json();
    return transformRoadmapItems(res);
  } catch (err) {
    console.error("Failed to load in-progress roadmap:", err);
    return [];
  }
}

export async function fetchCompletedRoadmap(): Promise<RoadmapItem[]> {
  try {
    const response = await fetch(`${URLS}completed`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const res = await response.json();
    return transformRoadmapItems(res);
  } catch (err) {
    console.error("Failed to load completed roadmap:", err);
    return [];
  }
}

export async function fetchChangelog(): Promise<ChangelogItem[]> {
  try {
    const response = await fetch(`${URLS}changelog`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const res = await response.json();
    return transformChangelogItems(res);
  } catch (err) {
    console.error("Failed to load changelog:", err);
    return [];
  }
}

export async function fetchAllRoadmapData() {
  const [planned, inProgress, completed, changelog] = await Promise.all([
    fetchPlannedRoadmap(),
    fetchInProgressRoadmap(),
    fetchCompletedRoadmap(),
    fetchChangelog(),
  ]);

  return {
    planned,
    inProgress,
    completed,
    changelog,
  };
}
