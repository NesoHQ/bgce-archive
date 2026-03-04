"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks } from "./navData";

interface DesktopNavProps {
  exploreOpen: boolean;
  resourcesOpen: boolean;
  isInExploreSection: boolean;
  isInResourcesSection: boolean;
  isActiveRoute: (href: string) => boolean;
  onExploreClick: () => void;
  onResourcesClick: () => void;
  onLinkClick: () => void;
  exploreRef: React.RefObject<HTMLButtonElement | null>;
  resourcesRef: React.RefObject<HTMLButtonElement | null>;
}

export function DesktopNav({
  exploreOpen,
  resourcesOpen,
  isInExploreSection,
  isInResourcesSection,
  isActiveRoute,
  onExploreClick,
  onResourcesClick,
  onLinkClick,
  exploreRef,
  resourcesRef,
}: DesktopNavProps) {
  return (
    <div className='hidden xl:flex items-center gap-1'>
      {/* Explore Dropdown */}
      <button
        ref={exploreRef}
        onClick={onExploreClick}
        className={cn(
          "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
          exploreOpen
            ? "text-primary bg-accent"
            : isInExploreSection
              ? "text-primary bg-primary/5"
              : "text-foreground hover:text-primary hover:bg-accent",
        )}>
        Explore
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            exploreOpen && "rotate-180",
          )}
        />
      </button>

      {/* Regular Nav Links */}
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onLinkClick}
          className={cn(
            "px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
            isActiveRoute(link.href)
              ? "text-primary bg-primary/5"
              : "text-foreground hover:text-primary hover:bg-accent",
          )}>
          {link.label}
        </Link>
      ))}

      {/* Resources Dropdown */}
      <button
        ref={resourcesRef}
        onClick={onResourcesClick}
        className={cn(
          "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
          resourcesOpen
            ? "text-primary bg-accent"
            : isInResourcesSection
              ? "text-primary bg-primary/5"
              : "text-foreground hover:text-primary hover:bg-accent",
        )}>
        Resources
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            resourcesOpen && "rotate-180",
          )}
        />
      </button>
    </div>
  );
}
