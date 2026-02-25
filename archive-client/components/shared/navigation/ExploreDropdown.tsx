"use client";

import Link from "next/link";
import { BookOpen, Code, Folder, Cloud, Briefcase, Target, Brain } from "lucide-react";

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
            description: "Expert-led courses"
        },
        {
            icon: Brain,
            label: "Practice",
            href: "/explore/practice",
            description: "Coding challenges"
        },
        {
            icon: Folder,
            label: "Projects",
            href: "/explore/projects",
            description: "Real-world templates"
        },
        {
            icon: Cloud,
            label: "Cloud Labs",
            href: "/explore/cloud-labs",
            description: "Interactive environments"
        },
        {
            icon: Briefcase,
            label: "Get Hired",
            href: "/explore/get-hired",
            description: "Career resources"
        },
        {
            icon: Target,
            label: "Mock Interview",
            href: "/explore/mock-interview",
            description: "Practice interviews"
        },
        {
            icon: Code,
            label: "Interview Prep",
            href: "/explore/interview-prep",
            description: "Ace coding interviews"
        },
    ];

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop - covers entire screen */}
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
                onClick={onClose}
            />

            {/* Dropdown Menu */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[600px] z-[70]">
                <div className="bg-background border border-border rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-3">
                            {exploreItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
                                    >
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-200">
                                            <Icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                                                {item.label}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-0.5 leading-tight">
                                                {item.description}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
