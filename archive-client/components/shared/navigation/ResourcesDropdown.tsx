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
            description: "Stay updated"
        },
        {
            icon: FileText,
            label: "Free Cheatsheet",
            href: "/resources/cheatsheet",
            description: "Quick references"
        },
        {
            icon: Users,
            label: "Community Actions",
            href: "/resources/community-actions",
            description: "Get involved"
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
            <div className="absolute right-0 top-full mt-2 w-72 z-[70]">
                <div className="bg-background border border-border rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-3">
                        {resourceItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
                                >
                                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-200">
                                        <Icon className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
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
