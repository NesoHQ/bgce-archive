"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";
import { TopNav } from "./TopNav";
import { ExploreDropdown } from "./navigation/ExploreDropdown";
import { ResourcesDropdown } from "./navigation/ResourcesDropdown";
import { ProfileDropdown } from "./navigation/ProfileDropdown";
import { MobileMenu } from "./navigation/MobileMenu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export function MainNavigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const pathname = usePathname();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { href: "/explore", label: "Explore", hasDropdown: true },
        { href: "/projects", label: "Projects" },
        { href: "/models", label: "Models" },
        { href: "/benchmark", label: "Benchmark" },
        { href: "/discussion", label: "Discussion" },
        { href: "/roadmap", label: "Roadmap" },
        { href: "/blogs", label: "Blogs" },
        { href: "/support", label: "Support" },
    ];

    const handleDropdownToggle = (dropdown: string) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const closeDropdowns = () => {
        setActiveDropdown(null);
    };

    return (
        <header className="sticky top-0 z-50 w-full flex flex-col transition-all duration-300">
            <TopNav />
            <nav
                className={cn(
                    "border-b transition-all duration-300",
                    scrolled
                        ? "bg-background/95 backdrop-blur-xl border-border shadow-lg shadow-primary/5"
                        : "bg-background/80 backdrop-blur-md border-transparent"
                )}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hover:from-primary/80 hover:to-primary/40 transition-all duration-300"
                            onClick={closeDropdowns}
                        >
                            BGCE Archive
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                                if (item.label === "Explore") {
                                    return (
                                        <div key={item.href} className="relative">
                                            <button
                                                onClick={() => handleDropdownToggle("explore")}
                                                className={cn(
                                                    "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-accent",
                                                    isActive ? "text-primary" : "text-foreground"
                                                )}
                                            >
                                                {item.label}
                                                <ChevronDown className={cn(
                                                    "h-4 w-4 transition-transform duration-200",
                                                    activeDropdown === "explore" && "rotate-180"
                                                )} />
                                            </button>
                                            <ExploreDropdown
                                                isOpen={activeDropdown === "explore"}
                                                onClose={closeDropdowns}
                                            />
                                        </div>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={closeDropdowns}
                                        className={cn(
                                            "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-accent group",
                                            isActive ? "text-primary" : "text-foreground"
                                        )}
                                    >
                                        {item.label}
                                        {isActive && (
                                            <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
                                        )}
                                        <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                                    </Link>
                                );
                            })}

                            {/* Resources Button with Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => handleDropdownToggle("resources")}
                                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-accent"
                                >
                                    Resources
                                    <ChevronDown className={cn(
                                        "h-4 w-4 transition-transform duration-200",
                                        activeDropdown === "resources" && "rotate-180"
                                    )} />
                                </button>
                                <ResourcesDropdown
                                    isOpen={activeDropdown === "resources"}
                                    onClose={closeDropdowns}
                                />
                            </div>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center gap-3">
                            <ModeToggle />
                            {isAuthenticated ? (
                                <ProfileDropdown />
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

                        {/* Mobile Menu Toggle */}
                        <div className="flex lg:hidden items-center gap-3">
                            <ModeToggle />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(!isOpen)}
                                className="rounded-lg"
                            >
                                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} navItems={navItems} />
        </header>
    );
}
