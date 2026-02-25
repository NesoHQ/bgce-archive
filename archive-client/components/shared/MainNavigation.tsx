"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, ChevronDown, BookOpen, Code, Folder,
  Cloud, Briefcase, Target, Brain, Mail, FileText,
  Users, User, LogOut, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "./ModeToggle";
import { TopNav } from "./TopNav";
import { Portal } from "@/components/ui/Portal";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface DropdownPosition {
  top: number;
  left?: number;
  right?: number;
}

export function MainNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [exploreCollapsed, setExploreCollapsed] = useState(true);
  const [resourcesCollapsed, setResourcesCollapsed] = useState(true);

  const [dropdownPositions, setDropdownPositions] = useState<{
    explore: DropdownPosition;
    resources: DropdownPosition;
    profile: DropdownPosition;
  }>({
    explore: { top: 0, left: 0 },
    resources: { top: 0, right: 0 },
    profile: { top: 0, right: 0 }
  });

  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const exploreRef = useRef<HTMLButtonElement>(null);
  const resourcesRef = useRef<HTMLButtonElement>(null);
  const profileRef = useRef<HTMLButtonElement>(null);
  const exploreDropdownRef = useRef<HTMLDivElement>(null);
  const resourcesDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        exploreDropdownRef.current &&
        !exploreDropdownRef.current.contains(event.target as Node) &&
        exploreRef.current &&
        !exploreRef.current.contains(event.target as Node)
      ) {
        setExploreOpen(false);
      }
      if (
        resourcesDropdownRef.current &&
        !resourcesDropdownRef.current.contains(event.target as Node) &&
        resourcesRef.current &&
        !resourcesRef.current.contains(event.target as Node)
      ) {
        setResourcesOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node) &&
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update dropdown positions dynamically
  useEffect(() => {
    const updatePositions = () => {
      if (exploreRef.current && exploreOpen) {
        const rect = exploreRef.current.getBoundingClientRect();
        setDropdownPositions(prev => ({
          ...prev,
          explore: { top: rect.bottom + 8, left: rect.left }
        }));
      }
      if (resourcesRef.current && resourcesOpen) {
        const rect = resourcesRef.current.getBoundingClientRect();
        setDropdownPositions(prev => ({
          ...prev,
          resources: { top: rect.bottom + 8, right: window.innerWidth - rect.right }
        }));
      }
      if (profileRef.current && profileOpen) {
        const rect = profileRef.current.getBoundingClientRect();
        setDropdownPositions(prev => ({
          ...prev,
          profile: { top: rect.bottom + 8, right: window.innerWidth - rect.right }
        }));
      }
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    window.addEventListener('scroll', updatePositions);

    return () => {
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions);
    };
  }, [exploreOpen, resourcesOpen, profileOpen]);

  const exploreItems = [
    { icon: BookOpen, label: "Courses", href: "/explore/courses", desc: "Expert-led courses to master new skills" },
    { icon: Brain, label: "Practice", href: "/explore/practice", desc: "Coding challenges and exercises" },
    { icon: Folder, label: "Projects", href: "/explore/projects", desc: "Real-world project templates" },
    { icon: Cloud, label: "Cloud Labs", href: "/explore/cloud-labs", desc: "Interactive cloud environments" },
    { icon: Briefcase, label: "Get Hired", href: "/explore/get-hired", desc: "Career resources and job prep" },
    { icon: Target, label: "Mock Interview", href: "/explore/mock-interview", desc: "Practice technical interviews" },
    { icon: Code, label: "Interview Prep", href: "/explore/interview-prep", desc: "Ace your coding interviews" },
  ];

  const resourceItems = [
    { icon: Mail, label: "Newsletter", href: "/resources/newsletter" },
    { icon: FileText, label: "Free Cheatsheet", href: "/resources/cheatsheet" },
    { icon: Users, label: "Community Actions", href: "/resources/community-actions" },
  ];

  const navLinks = [
    { href: "/projects", label: "Projects" },
    { href: "/models", label: "Models" },
    { href: "/benchmark", label: "Benchmark" },
    { href: "/discussion", label: "Discussion" },
    { href: "/roadmap", label: "Roadmap" },
    { href: "/blogs", label: "Blogs" },
    { href: "/support", label: "Support" },
  ];

  // Check if current path matches a route (exact match only, no nested routes)
  const isActiveRoute = (href: string) => pathname === href;

  // Check if we're in explore section (but not showing active on Explore button when on specific page)
  const isInExploreSection = pathname.startsWith("/explore/");

  // Check if we're in resources section
  const isInResourcesSection = pathname.startsWith("/resources/");

  return (
    <>
      <header data-navigation="main" className="sticky top-0 w-full bg-background">
        <TopNav />
        <nav className={cn(
          "transition-all duration-200 border-b bg-background",
          scrolled && "backdrop-blur-xl shadow-sm"
        )}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link
                href="/"
                className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                BGCE Archive
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1">
                {/* Explore Dropdown */}
                <button
                  ref={exploreRef}
                  onClick={() => {
                    setExploreOpen(!exploreOpen);
                    setResourcesOpen(false);
                    setProfileOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                    exploreOpen
                      ? "text-primary bg-accent"
                      : isInExploreSection
                        ? "text-primary bg-primary/5"
                        : "text-foreground hover:text-primary hover:bg-accent"
                  )}
                >
                  Explore
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", exploreOpen && "rotate-180")} />
                </button>

                {/* Regular Nav Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      setExploreOpen(false);
                      setResourcesOpen(false);
                      setProfileOpen(false);
                    }}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                      isActiveRoute(link.href)
                        ? "text-primary bg-primary/5"
                        : "text-foreground hover:text-primary hover:bg-accent"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Resources Dropdown */}
                <button
                  ref={resourcesRef}
                  onClick={() => {
                    setResourcesOpen(!resourcesOpen);
                    setExploreOpen(false);
                    setProfileOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                    resourcesOpen
                      ? "text-primary bg-accent"
                      : isInResourcesSection
                        ? "text-primary bg-primary/5"
                        : "text-foreground hover:text-primary hover:bg-accent"
                  )}
                >
                  Resources
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", resourcesOpen && "rotate-180")} />
                </button>
              </div>

              {/* Right Side - Theme Toggle & Auth */}
              <div className="hidden lg:flex items-center gap-3">
                <ModeToggle />
                {isAuthenticated && user ? (
                  <button
                    ref={profileRef}
                    onClick={() => {
                      setProfileOpen(!profileOpen);
                      setExploreOpen(false);
                      setResourcesOpen(false);
                    }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent transition-colors duration-200"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden xl:block">{user.username}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", profileOpen && "rotate-180")} />
                  </button>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/register">Sign up</Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="flex lg:hidden items-center gap-2">
                <ModeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="h-9 w-9"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t bg-background">
              <div className="container mx-auto px-4 py-4 space-y-1 max-h-[calc(100vh-8rem)] overflow-y-auto">
                {/* Explore Section */}
                <div>
                  <button
                    onClick={() => setExploreCollapsed(!exploreCollapsed)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors"
                  >
                    <span>Explore</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", !exploreCollapsed && "rotate-180")} />
                  </button>
                  {!exploreCollapsed && (
                    <div className="ml-4 mt-1 space-y-1">
                      {exploreItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
                          >
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Regular Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActiveRoute(link.href)
                        ? "text-primary bg-primary/5"
                        : "hover:bg-accent"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Resources Section */}
                <div>
                  <button
                    onClick={() => setResourcesCollapsed(!resourcesCollapsed)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors"
                  >
                    <span>Resources</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", !resourcesCollapsed && "rotate-180")} />
                  </button>
                  {!resourcesCollapsed && (
                    <div className="ml-4 mt-1 space-y-1">
                      {resourceItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
                          >
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Auth Section */}
                {isAuthenticated && user ? (
                  <div className="pt-4 border-t space-y-2">
                    <div className="px-3 py-2 bg-muted rounded-md">
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Button variant="outline" asChild className="w-full justify-start">
                      <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full justify-start">
                      <Link href="/settings" onClick={() => setMobileMenuOpen(false)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="w-full justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="pt-4 border-t space-y-2">
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        Sign up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Explore Dropdown - Fixed positioning below button */}
      {exploreOpen && (
        <Portal>
          <div
            ref={exploreDropdownRef}
            className="fixed z-[11000] animate-in fade-in slide-in-from-top-2 duration-200"
            style={{
              top: `${dropdownPositions.explore.top}px`,
              left: `${dropdownPositions.explore.left}px`,
              width: '640px'
            }}
          >
            <div className="bg-background border border-border rounded-xl shadow-2xl overflow-hidden">
              <div className="p-4">
                <div className="space-y-1">
                  {exploreItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setExploreOpen(false)}
                        className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-accent transition-colors duration-200 group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-200">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                            {item.label}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {item.desc}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )
      }

      {/* Resources Dropdown - Fixed positioning below button */}
      {
        resourcesOpen && (
          <Portal>
            <div
              ref={resourcesDropdownRef}
              className="fixed z-[11000] animate-in fade-in slide-in-from-top-2 duration-200"
              style={{
                top: `${dropdownPositions.resources.top}px`,
                right: `${dropdownPositions.resources.right}px`,
                width: '240px'
              }}
            >
              <div className="bg-background border border-border rounded-lg shadow-2xl overflow-hidden">
                <div className="p-2">
                  {resourceItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setResourcesOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors duration-200 group"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </Portal>
        )
      }

      {/* Profile Dropdown - Fixed positioning below button */}
      {
        profileOpen && user && (
          <Portal>
            <div
              ref={profileDropdownRef}
              className="fixed z-[11000] animate-in fade-in slide-in-from-top-2 duration-200"
              style={{
                top: `${dropdownPositions.profile.top}px`,
                right: `${dropdownPositions.profile.right}px`,
                width: '240px'
              }}
            >
              <div className="bg-background border border-border rounded-lg shadow-2xl overflow-hidden">
                <div className="p-3 border-b bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.username}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors duration-200 group"
                  >
                    <User className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                    <span className="text-sm font-medium">Profile</span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors duration-200 group"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                    <span className="text-sm font-medium">Settings</span>
                  </Link>
                </div>
                <div className="p-2 border-t">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </Portal>
        )
      }
    </>
  );
}
