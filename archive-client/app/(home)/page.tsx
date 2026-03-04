import React, { Suspense } from "react";
import nextDynamic from "next/dynamic";
import { WelcomeSection } from "@/components/home/WelcomeSectionOptimized";
import { SkeletonCardGrid } from "@/components/shared/SkeletonCard";

// Dynamic imports for better code splitting
const PopularCoursesSection = nextDynamic(
  () =>
    import("@/components/home/PopularCoursesSectionOptimized").then((mod) => ({
      default: mod.PopularCoursesSection,
    })),
  {
    loading: () => (
      <div className='py-16'>
        <SkeletonCardGrid count={4} />
      </div>
    ),
  },
);

import { CommunityTalksSection } from "@/components/home/CommunityTalksSectionOptimized";
import { api } from "@/lib/api";
import { CheatsheetSection } from "@/components/home/CheatsheetSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredPosts = await api.getPosts({ is_featured: true, limit: 3 });

  return (
    <>
      <WelcomeSection />
      <Suspense
        fallback={
          <div className='py-16'>
            <SkeletonCardGrid count={4} />
          </div>
        }>
        <PopularCoursesSection />
      </Suspense>
      <Suspense
        fallback={
          <div className='py-16'>
            <SkeletonCardGrid count={3} />
          </div>
        }>
        <CommunityTalksSection initialPosts={featuredPosts.data} />
      </Suspense>
      <Suspense
        fallback={
          <div className='py-16'>
            <SkeletonCardGrid count={4} />
          </div>
        }>
        <CheatsheetSection />
      </Suspense>
    </>
  );
}
