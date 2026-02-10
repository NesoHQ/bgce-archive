"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export function TopNav() {
  const links = [
    { label: "NesoHQ Home", href: "https://nesohq.org" },
    { label: "Mission", href: "https://nesohq.org/mission" },
    { label: "OSS Projects", href: "https://nesohq.org/oss-projects" },
    { label: "Community Group", href: "https://nesohq.org/community" },
  ];

  return (
    <div className="w-full bg-foreground dark:bg-gray-900 text-background dark:text-gray-100 py-1.5 px-4 hidden md:block">
      <div className="container mx-auto flex items-center justify-end">
        <div className="flex items-center space-x-6">
          {links.map((link) => (
            <Link
              key={link.label}
              target="_blank"
              href={link.href}
              className={cn(
                "text-[14px]  tracking-widest font-medium hover:text-primary transition-colors hover:underline underline-offset-4",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
