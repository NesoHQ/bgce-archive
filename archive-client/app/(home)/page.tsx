import HeroSection from "@/components/home/HeroSection";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// Lazy load non-critical components
const PopularSection = dynamic(() => import("@/components/home/PopularSection"), {
  loading: () => <div className="h-96 animate-pulse bg-muted rounded-lg" />,
});

const RecentQuestions = dynamic(() => import("@/components/home/RecentQuestions"), {
  loading: () => <div className="h-96 animate-pulse bg-muted rounded-lg" />,
});

const ArchiveProTips = dynamic(() => import("@/components/home/ArchiveProTips"), {
  loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" />,
});

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-lg" />}>
        <PopularSection />
      </Suspense>
      <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-lg" />}>
        <RecentQuestions />
      </Suspense>
      <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}>
        <ArchiveProTips />
      </Suspense>
    </div>
  );
}
