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
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export function MainNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownPositions, setDropdownPositions] = useState({ explore: { top: 0, left: 0 }, resources: { top: 0, right: 0 }, profile: { top: 0, right: 0 } });
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const exploreRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        setExploreOpen(false);
      }
      if (resourcesRef.current && !resourcesRef.current.contains(event.target as Node)) {
        setResourcesOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const updatePositions = () => {
      if (exploreRef.current) {
        const rect = exploreRef.current.getBoundingClientRect();
        setDropdownPositions(prev => ({
          ...prev,
          explore: { top: rect.bottom + 8, left: rect.left }
        }));
      }
      if (resourcesRef.current) {
        const rect = resourcesRef.current.getBoundingClientRect();
        setDropdownPositions(prev => ({
          ...prev,
          resources: { top: rect.bottom + 8, right: window.innerWidth - rect.right }
        }));
      }
      if (profileRef.current) {
        const rect = profileRef.current.getBoundingClientRect();
        setDropdownPositions(prev => ({
          ...prev,
          profile: { top: rect.bottom + 8, right: window.innerWidth - rect.right }
        }));
      }
    };

    if (exploreOpen || resourcesOpen || profileOpen) {
      updatePositions();
      window.addEventListener('resize', updatePositions);
      window.addEventListener('scroll', updatePositions);
      return () => {
        window.removeEventListener('resize', updatePositions);
        window.removeEventListener('scroll', updatePositions);
      };
    }
  }, [exploreOpen, resourcesOpen, profileOpen]);

  const exploreItems = [
    { icon: BookOpen, label: "Courses", href: "/explore/courses", desc: "Expert-led courses" },
    { icon: Brain, label: "Practice", href: "/explore/practice", desc: "Coding challenges" },
    { icon: Folder, label: "Projects", href: "/explore/projects", desc: "Real-world templates" },
    { icon: Cloud, label: "Cloud Labs", href: "/explore/cloud-labs", desc: "Interactive environments" },
    { icon: Briefcase, label: "Get Hired", href: "/explore/get-hired", desc: "Career resources" },
    { icon: Target, label: "Mock Interview", href: "/explore/mock-interview", desc: "Practice interviews" },
    { icon: Code, label: "Interview Prep", href: "/explore/interview-prep", desc: "Ace coding interviews" },
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

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        <TopNav />
        <nav className={cn(
          "transition-all duration-200",
          scrolled ? "bg-background/95 backdrop-blur-xl shadow-sm" : "bg-background"
        )}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link
                href="/"
                className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                BGCE Archive
              </Link>

              <div className="hidden lg:flex items-center gap-1">
                <div ref={exploreRef}>
                  <button
                    onClick={() => {
                      setExploreOpen(!exploreOpen);
                      setResourcesOpen(false);
                      setProfileOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      pathname.startsWith("/explore")
                        ? "text-primary bg-primary/5"
                        : exploreOpen
                          ? "text-primary bg-accent"
                          : "text-foreground hover:text-primary hover:bg-accent"
                    )}
                  >
                    Explore
                    <ChevronDown className={cn("h-4 w-4 transition-transform", exploreOpen && "rotate-180")} />
                  </button>
                </div>

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
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      pathname === link.href || pathname.startsWith(link.href + "/")
                        ? "text-primary bg-primary/5"
                        : "text-foreground hover:text-primary hover:bg-accent"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                <div ref={resourcesRef}>
                  <button
                    onClick={() => {
                      setResourcesOpen(!resourcesOpen);
                      setExploreOpen(false);
                      setProfileOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      pathname.startsWith("/resources")
                        ? "text-primary bg-primary/5"
                        : resourcesOpen
                          ? "text-primary bg-accent"
                          : "text-foreground hover:text-primary hover:bg-accent"
                    )}
                  >
                    Resources
                    <ChevronDown className={cn("h-4 w-4 transition-transform", resourcesOpen && "rotate-180")} />
                  </button>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-2">
                <ModeToggle />
                {isAuthenticated && user ? (
                  <div ref={profileRef}>
                    <button
                      onClick={() => {
                        setProfileOpen(!profileOpen);
                        setExploreOpen(false);
                        setResourcesOpen(false);
                      }}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent transition-colors"
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium hidden xl:block">{user.username}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
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

          {mobileMenuOpen && (
            <div className="lg:hidden border-t">
              <div className="container mx-auto px-4 py-4 space-y-2">
                <Link
                  href="/explore"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
                >
                  Explore
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/resources/cheatsheet"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
                >
                  Resources
                </Link>
                {isAuthenticated && user ? (
                  <div className="pt-4 border-t space-y-2">
                    <div className="px-3 py-2 bg-muted rounded-md">
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                        Profile
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="w-full"
                    >
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

      {/* Explore Dropdown - Positioned below button */}
      {exploreOpen && (
        <div
          className="fixed z-[100]"
          style={{
            top: `${dropdownPositions.explore.top}px`,
            left: `${dropdownPositions.explore.left}px`,
            width: '600px'
          }}
        >
          <div className="bg-background border border-border rounded-lg shadow-2xl">
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                {exploreItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setExploreOpen(false)}
                      className="flex items-start gap-3 p-3 rounded-md hover:bg-accent transition-colors"
                    >
                      <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{item.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resources Dropdown */}
      {resourcesOpen && (
        <div
          className="fixed z-[100]"
          style={{
            top: `${dropdownPositions.resources.top}px`,
            right: `${dropdownPositions.resources.right}px`,
            width: '240px'
          }}
        >
          <div className="bg-background border border-border rounded-lg shadow-2xl">
            <div className="p-2">
              {resourceItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setResourcesOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Profile Dropdown */}
      {profileOpen && user && (
        <div
          className="fixed z-[100]"
          style={{
            top: `${dropdownPositions.profile.top}px`,
            right: `${dropdownPositions.profile.right}px`,
            width: '240px'
          }}
        >
          <div className="bg-background border border-border rounded-lg shadow-2xl">
            <div className="p-3 border-b">
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
                className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">Profile</span>
              </Link>
              <Link
                href="/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">Settings</span>
              </Link>
            </div>
            <div className="p-2 border-t">
              <button
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
