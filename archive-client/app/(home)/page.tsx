import { Suspense } from "react";
import nextDynamic from "next/dynamic";
import { WelcomeSection } from "@/components/home/WelcomeSectionOptimized";
import { SkeletonCardGrid } from "@/components/shared/SkeletonCard";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { api } from "@/lib/api";

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
import { CheatsheetSection } from "@/components/home/CheatsheetSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const queryClient = getQueryClient();

  // Prefetch popular posts using TanStack Query
  await queryClient.prefetchQuery({
    queryKey: ["posts", { is_featured: true, limit: 3, sort_by: "created_at", sort_order: "DESC" }],
    queryFn: () => api.getPosts({
      is_featured: true,
      limit: 3,
      sort_by: "created_at",
      sort_order: "DESC"
    }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
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
    </HydrationBoundary>
  );
}
