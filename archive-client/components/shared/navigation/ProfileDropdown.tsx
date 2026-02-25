"use client";

import { useState } from "react";
import Link from "next/link";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

export function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
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

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-2 w-64 z-[70]">
                        <div className="bg-background border border-border rounded-xl shadow-2xl overflow-hidden">
                            {/* User Info */}
                            <div className="p-4 border-b border-border bg-accent/30">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback className="bg-primary/20 text-primary text-base font-semibold">
                                            {user.username.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">{user.username}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="p-2">
                                <Link
                                    href="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
                                >
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <User className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium group-hover:text-primary transition-colors">Profile</span>
                                </Link>
                                <Link
                                    href="/settings"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
                                >
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <Settings className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium group-hover:text-primary transition-colors">Settings</span>
                                </Link>
                            </div>

                            {/* Logout */}
                            <div className="p-2 border-t border-border">
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        logout();
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-destructive/10 transition-all duration-200 group"
                                >
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                                        <LogOut className="h-4 w-4 text-destructive" />
                                    </div>
                                    <span className="text-sm font-medium text-destructive">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
