"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    User,
    Mail,
    Calendar,
    Shield,
    Edit,
    Save,
    X,
    Loader2,
    FileText,
    MessageSquare,
    Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ProfilePage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        full_name: "",
        email: "",
    });

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                full_name: user.full_name || "",
                email: user.email,
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setIsSaving(true);
        // TODO: Implement profile update API call
        setTimeout(() => {
            setIsSaving(false);
            setIsEditing(false);
        }, 1000);
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                username: user.username,
                full_name: user.full_name || "",
                email: user.email,
            });
        }
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <section className="relative overflow-hidden py-8">
            {/* Technical Grid Background */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="container mx-auto px-6 max-w-6xl">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">
                                My <span className="text-primary italic">Profile</span>
                            </h1>
                            <p className="text-sm text-muted-foreground font-mono mt-2">
                                Manage your account settings
                            </p>
                        </div>
                        {!isEditing && (
                            <Button
                                onClick={() => setIsEditing(true)}
                                className="rounded-xl shadow-lg shadow-primary/20"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                        )}
                    </div>

                    {/* Profile Card */}
                    <div className="rounded-md bg-card/50 border border-gray-200 dark:border-white/10 backdrop-blur-md shadow-lg overflow-hidden">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 border-b border-gray-200 dark:border-white/10">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                                    <AvatarFallback className="bg-primary/20 text-primary text-3xl font-bold">
                                        {user.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-center sm:text-left flex-1">
                                    <h2 className="text-3xl font-bold tracking-tight">
                                        {user.username}
                                    </h2>
                                    <p className="text-muted-foreground font-mono mt-1">
                                        {user.email}
                                    </p>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono">
                                            <Shield className="h-3.5 w-3.5 text-primary" />
                                            {user.role}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-mono text-green-600 dark:text-green-400">
                                            <Activity className="h-3.5 w-3.5" />
                                            {user.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-8">
                            {isEditing ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="username"
                                                className="text-sm font-medium flex items-center gap-2 uppercase tracking-wider text-[10px] text-muted-foreground"
                                            >
                                                <User className="h-4 w-4 text-primary" />
                                                Username
                                            </label>
                                            <Input
                                                id="username"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                className="bg-background/50 h-11 border-gray-200 dark:border-white/10"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="full_name"
                                                className="text-sm font-medium flex items-center gap-2 uppercase tracking-wider text-[10px] text-muted-foreground"
                                            >
                                                <User className="h-4 w-4 text-primary" />
                                                Full Name
                                            </label>
                                            <Input
                                                id="full_name"
                                                name="full_name"
                                                value={formData.full_name}
                                                onChange={handleChange}
                                                placeholder="Enter your full name"
                                                className="bg-background/50 h-11 border-gray-200 dark:border-white/10"
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <label
                                                htmlFor="email"
                                                className="text-sm font-medium flex items-center gap-2 uppercase tracking-wider text-[10px] text-muted-foreground"
                                            >
                                                <Mail className="h-4 w-4 text-primary" />
                                                Email
                                            </label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="bg-background/50 h-11 border-gray-200 dark:border-white/10"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
                                        <Button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            size="sm"
                                            className="rounded-xl shadow-lg shadow-primary/20"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            onClick={handleCancel}
                                            variant="outline"
                                            disabled={isSaving}
                                            size="sm"
                                            className="rounded-xl"
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-md bg-card/30 border border-gray-200 dark:border-white/10 backdrop-blur-md hover:border-primary/30 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                                                <User className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                                                    Username
                                                </p>
                                                <p className="font-bold">{user.username}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {user.full_name && (
                                        <div className="p-4 rounded-md bg-card/30 border border-gray-200 dark:border-white/10 backdrop-blur-md hover:border-primary/30 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                                                    <User className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                                                        Full Name
                                                    </p>
                                                    <p className="font-bold">{user.full_name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-4 rounded-md bg-card/30 border border-gray-200 dark:border-white/10 backdrop-blur-md hover:border-primary/30 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                                                <Mail className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                                                    Email
                                                </p>
                                                <p className="font-bold">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-md bg-card/30 border border-gray-200 dark:border-white/10 backdrop-blur-md hover:border-primary/30 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                                                <Calendar className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                                                    Member Since
                                                </p>
                                                <p className="font-bold">{formatDate(user.created_at)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight mb-4">
                            Activity <span className="text-primary italic">Stats</span>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-6 rounded-md bg-card/50 border border-gray-200 dark:border-white/10 backdrop-blur-md hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                                            Posts
                                        </p>
                                        <p className="text-3xl font-bold text-primary mt-2">0</p>
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                                        <FileText className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-md bg-card/50 border border-gray-200 dark:border-white/10 backdrop-blur-md hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                                            Comments
                                        </p>
                                        <p className="text-3xl font-bold text-primary mt-2">0</p>
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                                        <MessageSquare className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-md bg-card/50 border border-gray-200 dark:border-white/10 backdrop-blur-md hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                                            Reputation
                                        </p>
                                        <p className="text-3xl font-bold text-primary mt-2">0</p>
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                                        <Activity className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
