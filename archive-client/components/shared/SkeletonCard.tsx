import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
    return (
        <div className="h-full rounded-2xl bg-card border-2 border-border p-6 space-y-5">
            {/* Badge */}
            <Skeleton className="h-6 w-24 rounded-full" />

            {/* Title */}
            <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
            </div>

            {/* Tags */}
            <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-border">
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center space-y-2">
                        <Skeleton className="h-10 w-10 rounded-xl mx-auto" />
                        <Skeleton className="h-3 w-16 mx-auto" />
                    </div>
                    <div className="text-center space-y-2">
                        <Skeleton className="h-10 w-10 rounded-xl mx-auto" />
                        <Skeleton className="h-3 w-16 mx-auto" />
                    </div>
                    <div className="text-center space-y-2">
                        <Skeleton className="h-10 w-10 rounded-xl mx-auto" />
                        <Skeleton className="h-3 w-16 mx-auto" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SkeletonCardGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}

export function SkeletonArticle() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 p-8">
            {/* Header */}
            <div className="space-y-6">
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-4/5" />
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <Skeleton className="h-20 rounded-xl" />
                    <Skeleton className="h-20 rounded-xl" />
                    <Skeleton className="h-20 rounded-xl" />
                    <Skeleton className="h-20 rounded-xl" />
                </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />

                <Skeleton className="h-48 w-full rounded-xl my-8" />

                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );
}
