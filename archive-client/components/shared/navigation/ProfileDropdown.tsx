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
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
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
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-3 border-b border-border">
                            <div className="flex items-center gap-3">
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
                        </div>
                        <div className="p-2">
                            <Link
                                href="/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                            >
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Profile</span>
                            </Link>
                            <Link
                                href="/settings"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                            >
                                <Settings className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Settings</span>
                            </Link>
                        </div>
                        <div className="p-2 border-t border-border">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    logout();
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
