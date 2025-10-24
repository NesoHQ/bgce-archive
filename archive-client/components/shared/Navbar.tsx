"use client";

import { useState } from "react";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa";
import { useTheme } from "next-themes";
import {
  Menu,
  Sun,
  Moon,
  Home,
  LogIn,
  UserPlus,
  Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/archive", label: "Archives", icon: Newspaper },
  ];

  const closeSheet = () => setIsOpen(false);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 sticky top-0 z-50  lg:sticky lg:top-0 ">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Name */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold"
          >
            <span>BGCE Archive</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Items */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9 cursor-pointer"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Login */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="border border-gray-800 dark:border-white rounded-sm hover:bg-gray-900 hover:text-white transition-colors duration-400 ease-in-out"
              >
                <Link href="/login" className="flex items-center space-x-1 ">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              </Button>

              {/* Register */}
              <Button
                size="sm"
                asChild
                className="rounded-sm bg-gray-800 hover:bg-gray-950 hover:text-white  dark:bg-white"
              >
                <Link href="/register" className="flex items-center space-x-1">
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-8 pt-6">
                  {/* Brand Name */}
                  <div className="border-b pb-4"></div>

                  {/* Navigation Links */}
                  <div className="flex flex-col space-y-4">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.href} className="px-4">
                          <Link
                            href={item.href}
                            onClick={closeSheet}
                            className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary my-2"
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>

                          <hr />
                        </div>
                      );
                    })}
                  </div>

                  {/* Auth Buttons */}
                  <div className="flex flex-col space-y-3 pt-4 px-4">
                    <Button variant="outline" asChild>
                      <Link
                        href="/login"
                        onClick={closeSheet}
                        className="flex items-center space-x-2"
                      >
                        <LogIn className="h-4 w-4" />
                        <span>Login</span>
                      </Link>
                    </Button>
                    <Button asChild>
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
