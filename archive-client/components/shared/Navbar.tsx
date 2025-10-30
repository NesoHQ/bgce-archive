"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Menu,
  Sun,
  Moon,
  Home,
  LogIn,
  UserPlus,
  Newspaper,
  BookOpen,
  Users,
  LifeBuoy,
  Folder,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/knowledge-center", label: "Knowledge Center", icon: BookOpen },
    { href: "/archive", label: "Archive", icon: Newspaper },
    { href: "/topics", label: "Topics", icon: Folder },
    { href: "/community-groups", label: "Community Groups", icon: Users },
    {
      href: "/nesohq-support",
      label: "nesoHQ Support Official",
      icon: LifeBuoy,
    },
  ];

  const closeSheet = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-background  bg-gradient-to-br from-gray-950 via-gray-950 to-blue-950 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 backdrop-blur border-b">
      <div className="container  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 justify-between relative">
          {/* Brand */}
          <Link href="/" className="text-white text-xl font-bold flex-shrink-0">
            BGCE Archive
          </Link>

          {/* Centered Nav Links (Desktop only) */}
          <div className="hidden lg:flex flex-1 justify-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 text-sm font-medium transition-all ${
                    isActive
                      ? "text-blue-300"
                      : "text-gray-200 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right-side Buttons (Desktop) */}
          <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 text-white hover:bg-white/20"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="border border-white text-white rounded-sm hover:bg-white hover:text-indigo-600 transition-colors duration-300"
            >
              <Link href="/login" className="flex items-center space-x-1">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            </Button>

            <Button
              size="sm"
              asChild
              className="rounded-sm bg-white text-indigo-600 hover:bg-gray-100 transition-all"
            >
              <Link href="/register" className="flex items-center space-x-1">
                <UserPlus className="h-4 w-4" />
                <span>Register</span>
              </Link>
            </Button>
          </div>

          {/* Mobile + Tablet Menu */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 text-white"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Hamburger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-white"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white"
              >
                <div className="flex flex-col space-y-8 pt-6">
                  <div className="border-b border-white/30 pb-4 px-4 text-lg font-semibold">
                    BGCE Archive
                  </div>
                  <div className="flex flex-col space-y-4 px-4">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeSheet}
                          className={`flex items-center space-x-2 text-sm font-medium py-2 transition-all ${
                            isActive
                              ? "text-white underline underline-offset-4"
                              : "text-gray-200 hover:text-white"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="flex flex-col space-y-3 pt-4">
                    <Button
                      variant="outline"
                      asChild
                      className="bg-transparent border border-white text-white hover:bg-white hover:text-indigo-600"
                    >
                      <Link
                        href="/login"
                        onClick={closeSheet}
                        className="flex items-center space-x-2"
                      >
                        <LogIn className="h-4 w-4" />
                        <span>Login</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="bg-white text-indigo-600 hover:bg-gray-100"
                    >
                      <Link
                        href="/register"
                        onClick={closeSheet}
                        className="flex items-center space-x-2"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Register</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
