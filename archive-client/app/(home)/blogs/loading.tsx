import { SkeletonCardGrid, SkeletonSidebar } from "@/components/shared/SkeletonCard";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8 space-y-4">
                <div className="h-8 w-48 bg-muted animate-pulse rounded-lg" />
                <div className="h-4 w-96 bg-muted animate-pulse rounded-lg" />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Skeleton */}
                <aside className="w-full lg:w-80 shrink-0">
                    <SkeletonSidebar />
                </aside>

                {/* Main Content Skeleton */}
                <main className="flex-1">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                        <div className="h-9 w-40 bg-muted animate-pulse rounded" />
                    </div>
                    <SkeletonCardGrid count={6} />
                </main>
            </div>
        </div>
    );
}
