"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopNav } from "./TopNav";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "./navigation/useNavigation";
import { DesktopNav } from "./navigation/DesktopNav";
import { DesktopAuth } from "./navigation/DesktopAuth";
import { MobileMenu } from "./navigation/MobileMenu";
import { ExploreDropdown } from "./navigation/ExploreDropdown";
import { ResourcesDropdown } from "./navigation/ResourcesDropdown";
import { ProfileDropdown } from "./navigation/ProfileDropdown";
import { ModeToggle } from "./ModeToggle";

export function MainNavigationOptimized() {
  const { user, isAuthenticated, logout } = useAuth();
  const {
    mobileMenuOpen,
    exploreOpen,
    resourcesOpen,
    profileOpen,
    scrolled,
    exploreCollapsed,
    resourcesCollapsed,
    dropdownPositions,
    exploreRef,
    resourcesRef,
    profileRef,
    exploreDropdownRef,
    resourcesDropdownRef,
    profileDropdownRef,
    isActiveRoute,
    isInExploreSection,
    isInResourcesSection,
    setMobileMenuOpen,
    setExploreOpen,
    setResourcesOpen,
    setProfileOpen,
    setExploreCollapsed,
    setResourcesCollapsed,
    closeAllDropdowns,
  } = useNavigation();

  return (
    <>
      <header
        data-navigation='main'
        className='sticky top-0 w-full bg-background z-[1000]'>
        <TopNav />
        <nav
          className={cn(
            "transition-all duration-200 border-b bg-background",
            scrolled && "backdrop-blur-xl shadow-sm",
          )}>
          <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex items-center justify-between h-16'>
              {/* Logo */}
              <Link
                href='/'
                className='font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hover:opacity-80 transition-opacity'>
                NESOHQ
              </Link>

              {/* Desktop Navigation */}
              <DesktopNav
                exploreOpen={exploreOpen}
                resourcesOpen={resourcesOpen}
                isInExploreSection={isInExploreSection}
                isInResourcesSection={isInResourcesSection}
                isActiveRoute={isActiveRoute}
                onExploreClick={() => {
                  setExploreOpen(!exploreOpen);
                  setResourcesOpen(false);
                  setProfileOpen(false);
                }}
                onResourcesClick={() => {
                  setResourcesOpen(!resourcesOpen);
                  setExploreOpen(false);
                  setProfileOpen(false);
                }}
                onLinkClick={closeAllDropdowns}
                exploreRef={exploreRef}
                resourcesRef={resourcesRef}
              />

              {/* Right Side - Search, Theme Toggle & Auth */}
              <DesktopAuth
                isAuthenticated={isAuthenticated}
                user={user}
                profileOpen={profileOpen}
                onProfileClick={() => {
                  setProfileOpen(!profileOpen);
                  setExploreOpen(false);
                  setResourcesOpen(false);
                }}
                profileRef={profileRef}
              />

              {/* Mobile Menu Button */}
              <div className='flex xl:hidden items-center gap-2'>
                <ModeToggle />
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className='h-9 w-9'>
                  {mobileMenuOpen ? (
                    <X className='h-5 w-5' />
                  ) : (
                    <Menu className='h-5 w-5' />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <MobileMenu
            isOpen={mobileMenuOpen}
            isAuthenticated={isAuthenticated}
            user={user}
            exploreCollapsed={exploreCollapsed}
            resourcesCollapsed={resourcesCollapsed}
            isActiveRoute={isActiveRoute}
            onClose={() => setMobileMenuOpen(false)}
            onExploreToggle={() => setExploreCollapsed(!exploreCollapsed)}
            onResourcesToggle={() => setResourcesCollapsed(!resourcesCollapsed)}
            onLogout={logout}
          />
        </nav>
      </header>

      {/* Dropdowns */}
      <ExploreDropdown
        isOpen={exploreOpen}
        position={dropdownPositions.explore}
        onClose={() => setExploreOpen(false)}
        dropdownRef={exploreDropdownRef}
      />

      <ResourcesDropdown
        isOpen={resourcesOpen}
        position={dropdownPositions.resources}
        onClose={() => setResourcesOpen(false)}
        dropdownRef={resourcesDropdownRef}
      />

      <ProfileDropdown
        isOpen={profileOpen}
        user={user}
        position={dropdownPositions.profile}
        onClose={() => setProfileOpen(false)}
        onLogout={logout}
        dropdownRef={profileDropdownRef}
      />
    </>
  );
}
