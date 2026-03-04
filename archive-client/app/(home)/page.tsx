import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { WelcomeSection } from "@/components/home/WelcomeSectionOptimized";
import { SkeletonCardGrid } from "@/components/shared/SkeletonCard";

// Dynamic imports for better code splitting
const PopularCoursesSection = dynamic(
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

const CommunityTalksSection = dynamic(
  () =>
    import("@/components/home/CommunityTalksSectionOptimized").then((mod) => ({
      default: mod.CommunityTalksSection,
    })),
  {
    loading: () => (
      <div className='py-16'>
        <SkeletonCardGrid count={3} />
      </div>
    ),
  },
);

const CheatsheetSection = dynamic(
  () =>
    import("@/components/home/CheatsheetSection").then((mod) => ({
      default: mod.CheatsheetSection,
    })),
  {
    loading: () => (
      <div className='py-16'>
        <SkeletonCardGrid count={4} />
      </div>
    ),
  },
);

export default function HomePage() {
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
        <CommunityTalksSection />
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
