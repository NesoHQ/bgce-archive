"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    navItems: Array<{ href: string; label: string; hasDropdown?: boolean }>;
}

export function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuth();

    const exploreItems = [
        { label: "Courses", href: "/explore/courses" },
        { label: "Practice", href: "/explore/practice" },
        { label: "Projects", href: "/explore/projects" },
        { label: "Cloud Labs", href: "/explore/cloud-labs" },
        { label: "Get Hired", href: "/explore/get-hired" },
        { label: "Mock Interview", href: "/explore/mock-interview" },
        { label: "Interview Prep", href: "/explore/interview-prep" },
    ];

    const resourceItems = [
        { label: "Newsletter", href: "/resources/newsletter" },
        { label: "Free Cheatsheet", href: "/resources/cheatsheet" },
        { label: "Community Actions", href: "/resources/community-actions" },
    ];

    if (!isOpen) return null;

    return (
        <div className="lg:hidden fixed inset-0 z-50 bg-background">
            <div className="h-full overflow-y-auto">
                <div className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                        if (item.label === "Explore") {
                            return (
                                <div key={item.href}>
                                    <button
                                        onClick={() => setExpandedSection(expandedSection === "explore" ? null : "explore")}
                                        className={cn(
                                            "w-full flex items-center justify-between px-4 py-3 rounded-md text-sm font-medium transition-colors",
                                            isActive ? "bg-primary/10 text-primary" : "hover:bg-accent text-foreground"
                                        )}
                                    >
                                        {item.label}
                                        {expandedSection === "explore" ? (
                                            <ChevronDown className="h-4 w-4" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4" />
                                        )}
                                    </button>
                                    {expandedSection === "explore" && (
                                        <div className="ml-4 mt-1 space-y-1">
                                            {exploreItems.map((subItem) => (
                                                <Link
                                                    key={subItem.href}
                                                    href={subItem.href}
                                                    onClick={onClose}
                                                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                                                >
                                                    {subItem.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    "block px-4 py-3 rounded-md text-sm font-medium transition-colors",
                                    isActive ? "bg-primary/10 text-primary" : "hover:bg-accent text-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}

                    {/* Resources Section */}
                    <div>
                        <button
                            onClick={() => setExpandedSection(expandedSection === "resources" ? null : "resources")}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-md text-sm font-medium hover:bg-accent transition-colors text-foreground"
                        >
                            Resources
                            {expandedSection === "resources" ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </button>
                        {expandedSection === "resources" && (
                            <div className="ml-4 mt-1 space-y-1">
                                {resourceItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Auth Section */}
                <div className="p-4 border-t mt-4">
                    {isAuthenticated && user ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-muted">
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
                            <Button
                                variant="outline"
                                asChild
                                className="w-full"
                            >
                                <Link href="/profile" onClick={onClose}>
                                    Profile
                                </Link>
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    onClose();
                                    logout();
                                }}
                                className="w-full"
                            >
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Button variant="outline" asChild className="w-full">
                                <Link href="/login" onClick={onClose}>
                                    Login
                                </Link>
                            </Button>
                            <Button asChild className="w-full">
                                <Link href="/register" onClick={onClose}>
                                    Sign up
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
