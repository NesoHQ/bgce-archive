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

export function CommunityBreadcrumb() {
  return (
    <div className="inline-block">
      <div className="p-4 rounded-full bg-card/50 border border-white/10 backdrop-blur-md shadow-lg">
        <Breadcrumb>
          <BreadcrumbList className="font-mono text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="flex items-center gap-2 hover:text-primary transition-colors uppercase tracking-wider"
              >
                <Home className="h-3.5 w-3.5" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-3.5 w-3.5 text-primary" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-primary font-bold uppercase tracking-wider">
                Community
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
