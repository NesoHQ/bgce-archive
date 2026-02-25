import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { PopularRoadmapsSection } from "@/components/home/PopularRoadmapsSection";
import { CommunityTalksSection } from "@/components/home/CommunityTalksSection";

// Lazy load non-critical legacy components
const PopularSection = dynamic(
  () => import("@/components/home/PopularSection"),
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

export default function HomePage() {
  return (
    <div>
      <WelcomeSection />
      <PopularRoadmapsSection />
      <CommunityTalksSection />
      <Suspense
        fallback={<div className="h-96 animate-pulse bg-muted rounded-lg" />}
      >
        <PopularSection />
      </Suspense>
      <Suspense
        fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}
      >
        <DatasetsSection />
      </Suspense>
    </div>
  );
}
