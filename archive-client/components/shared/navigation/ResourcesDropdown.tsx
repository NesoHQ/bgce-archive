"use client";

import Link from "next/link";
import { Mail, FileText, Users } from "lucide-react";

interface ResourcesDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ResourcesDropdown({ isOpen, onClose }: ResourcesDropdownProps) {
    const resourceItems = [
        {
            icon: Mail,
            label: "Newsletter",
            href: "/resources/newsletter",
        },
        {
            icon: FileText,
            label: "Free Cheatsheet",
            href: "/resources/cheatsheet",
        },
        {
            icon: Users,
            label: "Community Actions",
            href: "/resources/community-actions",
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
            <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2">
                    {resourceItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors duration-200 group"
                            >
                                <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
