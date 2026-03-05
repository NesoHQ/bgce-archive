import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            {/* Breadcrumb Skeleton */}
            <div className="border-b border-border/40 bg-muted/20 py-2">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Skeleton className="h-4 w-64 rounded" />
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Main Article Skeleton */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-32 rounded-full" />
                            <Skeleton className="h-12 w-full rounded-lg" />
                            <div className="flex items-center gap-4 py-4 border-b">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-64 w-full rounded-xl" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    </div>

                    {/* Sidebar Skeleton */}
                    <aside className="lg:col-span-4 space-y-6">
                        <div className="p-4 border rounded-xl space-y-4">
                            <div className="grid grid-cols-3 gap-2">
                                <Skeleton className="h-16 rounded-lg" />
                                <Skeleton className="h-16 rounded-lg" />
                                <Skeleton className="h-16 rounded-lg" />
                            </div>
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                        <div className="p-4 border rounded-xl space-y-4">
                            <Skeleton className="h-6 w-32" />
                            <div className="space-y-3">
                                <Skeleton className="h-12 w-full rounded-lg" />
                                <Skeleton className="h-12 w-full rounded-lg" />
                                <Skeleton className="h-12 w-full rounded-lg" />
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
}
