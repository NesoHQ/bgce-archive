import HeroSection from "@/components/home/HeroSection";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// Lazy load non-critical components
const PopularSection = dynamic(
  () => import("@/components/home/PopularSection"),
  {
    loading: () => <div className="h-96 animate-pulse bg-muted rounded-lg" />,
  },
);

const RecentQuestions = dynamic(
  () => import("@/components/home/RecentQuestions"),
  {
    loading: () => <div className="h-96 animate-pulse bg-muted rounded-lg" />,
  },
);

const DatasetsSection = dynamic(
  () => import("@/components/home/DatasetsSection"),
  {
    loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" />,
  },
);

const NotebooksSection = dynamic(
  () => import("@/components/home/NotebooksSection"),
  {
    loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" />,
  },
);

const CompetitionsSection = dynamic(
  () => import("@/components/home/CompetitionsSection"),
  {
    loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" />,
  },
);

const CoursesSection = dynamic(
  () => import("@/components/home/CoursesSection"),
  {
    loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" />,
  },
);

const ArchiveProTips = dynamic(
  () => import("@/components/home/ArchiveProTips"),
  {
    loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" />,
  },
);

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <Suspense
        fallback={<div className="h-96 animate-pulse bg-muted rounded-lg" />}
      >
        <PopularSection />
      </Suspense>
      <Suspense
        fallback={<div className="h-96 animate-pulse bg-muted rounded-lg" />}
      >
        <RecentQuestions />
      </Suspense>
      <Suspense
        fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}
      >
        <DatasetsSection />
      </Suspense>
      <Suspense
        fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}
      >
        <NotebooksSection />
      </Suspense>
      <Suspense
        fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}
      >
        <CompetitionsSection />
      </Suspense>
      <Suspense
        fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}
      >
        <CoursesSection />
      </Suspense>
      <Suspense
        fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}
      >
        <ArchiveProTips />
      </Suspense>
    </div>
  );
}
