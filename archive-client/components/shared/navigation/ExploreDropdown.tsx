"use client";

import Link from "next/link";
import { BookOpen, Code, Folder, Cloud, Briefcase, Target, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExploreDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ExploreDropdown({ isOpen, onClose }: ExploreDropdownProps) {
    const exploreItems = [
        {
            icon: BookOpen,
            label: "Courses",
            href: "/explore/courses",
            description: "Learn from expert-led courses"
        },
        {
            icon: Brain,
            label: "Practice",
            href: "/explore/practice",
            description: "Hands-on coding challenges"
        },
        {
            icon: Folder,
            label: "Projects",
            href: "/explore/projects",
            description: "Real-world project templates"
        },
        {
            icon: Cloud,
            label: "Cloud Labs",
            href: "/explore/cloud-labs",
            description: "Interactive cloud environments"
        },
        {
            icon: Briefcase,
            label: "Get Hired",
            href: "/explore/get-hired",
            description: "Career resources & opportunities"
        },
        {
            icon: Target,
            label: "Mock Interview",
            href: "/explore/mock-interview",
            description: "Practice technical interviews"
        },
        {
            icon: Code,
            label: "Interview Prep",
            href: "/explore/interview-prep",
            description: "Ace your coding interviews"
        },
    ];

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            {/* Dropdown */}
            <div className="absolute top-full left-0 mt-2 w-[600px] bg-card border border-border rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                        {exploreItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors duration-200 group"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                                            {item.label}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-0.5">
                                            {item.description}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
