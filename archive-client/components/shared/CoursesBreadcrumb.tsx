"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Home } from "lucide-react";

export function CoursesBreadcrumb() {
    return (
        <div className="inline-block">
            <div className="py-3 px-4 rounded-full bg-card/50 border border-gray-300 dark:border-white/10 backdrop-blur-md shadow-lg">
                <Breadcrumb>
                    <BreadcrumbList className="font-mono text-xs">
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href="/"
                                className="flex items-center gap-2 hover:text-primary dark:hover:text-[oklch(0.85_0.28_260)] dark:hover:drop-shadow-[0_0_8px_oklch(0.65_0.18_260/0.3)] transition-all uppercase tracking-wider"
                            >
                                <Home className="h-3.5 w-3.5" />
                                Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRight className="h-3.5 w-3.5 text-primary" />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href="/explore"
                                className="hover:text-primary dark:hover:text-[oklch(0.85_0.28_260)] dark:hover:drop-shadow-[0_0_8px_oklch(0.65_0.18_260/0.3)] transition-all uppercase tracking-wider"
                            >
                                Explore
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRight className="h-3.5 w-3.5 text-primary" />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-primary font-bold uppercase tracking-wider">
                                Courses
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </div>
    );
}
