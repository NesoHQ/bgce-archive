import React, { Suspense } from "react";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { PopularCoursesSection } from "@/components/home/PopularCoursesSection";
import { CommunityTalksSection } from "@/components/home/CommunityTalksSection";
import { SkeletonCardGrid } from "@/components/shared/SkeletonCard";

export default function HomePage() {
  return (
    <div>
      <WelcomeSection />
      <Suspense fallback={<div className="py-16"><SkeletonCardGrid count={4} /></div>}>
        <PopularCoursesSection />
      </Suspense>
      <Suspense fallback={<div className="py-16"><SkeletonCardGrid count={3} /></div>}>
        <CommunityTalksSection />
      </Suspense>
    </div>
  );
}
