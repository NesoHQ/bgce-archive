"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Home,
  LogIn,
  UserPlus,
  Newspaper,
  BookOpen,
  Users,
  LifeBuoy,
  Folder,
  X,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "./ModeToggle";
import { TopNav } from "./TopNav";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

function DesktopAuthSection() {
  const { user, isAuthenticated, logout } = useAuth();

  if (isAuthenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs font-mono uppercase tracking-wider rounded-xl hover:bg-primary/10 gap-2"
          >
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {user.username}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.username}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="text-xs font-mono uppercase tracking-wider rounded-xl hover:bg-primary/10"
      >
        <Link href="/login">
          <LogIn className="h-4 w-4 mr-2" />
          Login
        </Link>
      </Button>
      <Button
        size="sm"
        asChild
        className="text-xs font-mono uppercase tracking-wider rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
      >
        <Link href="/register">
          <UserPlus className="h-4 w-4 mr-2" />
          Sign up
        </Link>
      </Button>
    </>
  );
}

function MobileAuthSection({ closeSheet }: { closeSheet: () => void }) {
  const { user, isAuthenticated, logout } = useAuth();

  if (isAuthenticated && user) {
    return (
      <div className="pt-6 px-6 border-t space-y-4">
        <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-muted">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium">{user.username}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          asChild
          className="w-full justify-start"
        >
          <Link href="/profile" onClick={closeSheet}>
            <User className="h-4 w-4 mr-2" />
            Profile
          </Link>
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            closeSheet();
            logout();
          }}
          className="w-full justify-start"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-6 px-6 border-t space-y-2">
      <Button
        variant="outline"
        asChild
        className="w-full justify-center"
      >
        <Link href="/login" onClick={closeSheet}>
          Login
        </Link>
      </Button>
      <Button asChild className="w-full justify-center">
        <Link href="/register" onClick={closeSheet}>
          Sign up
        </Link>
      </Button>
    </div>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/archive", label: "Archive", icon: Newspaper },
    { href: "/knowledge-center", label: "Knowledge", icon: BookOpen },
    { href: "/topics", label: "Topics", icon: Folder },
    { href: "/community", label: "Community", icon: Users },
    { href: "/nesohq-support", label: "Support", icon: LifeBuoy },
  ];

  const closeSheet = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col transition-all duration-500">
      <TopNav />
      <nav
        className={cn(
          "border-b transition-all duration-500",
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-border shadow-lg shadow-primary/5"
            : "bg-background/50 backdrop-blur-md border-transparent",
        )}
        suppressHydrationWarning
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo with gradient */}
            <Link
              href="/"
              className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hover:from-primary/80 hover:to-primary/40 transition-all duration-300"
            >
              BGCE Archive
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2.5 text-xs font-mono tracking-wider transition-all duration-300 uppercase rounded-xl group",
                      isActive
                        ? "text-primary font-bold "
                        : "text-muted-foreground hover:text-primary",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full animate-in fade-in slide-in-from-left-2" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <ModeToggle />
              <DesktopAuthSection />
            </div>

            <div className="flex lg:hidden items-center gap-4">
              <ModeToggle />
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-md">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between pb-6 border-b">
                      <span className="font-semibold text-lg">Menu</span>
                    </div>

                    <div className="flex-1 py-6 px-4 space-y-1">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeSheet}
                            className={cn(
                              "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                              isActive
                                ? "bg-muted text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>

                    <MobileAuthSection closeSheet={closeSheet} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
