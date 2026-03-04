import {
    ThumbsUp,
    Bookmark,
    MessageSquare,
    Twitter,
    Facebook,
    Linkedin,
    Link2,
    TrendingUp,
    Eye,
    Clock,
    Calendar,
    User,
    Bell
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ApiPost } from "@/types/blog.type";

interface BlogDetailsSidebarProps {
    post: ApiPost;
    readTime: string;
    getAuthorInitials: (userId: number) => string;
    getAuthorColor: (userId: number) => string;
}

export function BlogDetailsSidebar({
    post,
    readTime,
    getAuthorInitials,
    getAuthorColor
}: BlogDetailsSidebarProps) {
    return (
        <aside className="lg:col-span-4">
            <div className="sticky top-20 space-y-4">

                {/* Actions */}
                <div className="bg-card border rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        <button className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors group">
                            <ThumbsUp className="h-5 w-5" />
                            <span className="text-xs font-medium">Like</span>
                        </button>
                        <button className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors group">
                            <Bookmark className="h-5 w-5" />
                            <span className="text-xs font-medium">Save</span>
                        </button>
                        <button className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors group">
                            <MessageSquare className="h-5 w-5" />
                            <span className="text-xs font-medium">Comment</span>
                        </button>
                    </div>
                    <div className="pt-3 border-t">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Share</p>
                        <div className="flex gap-2">
                            <button className="flex-1 p-2 rounded-lg hover:bg-blue-500/10 hover:text-blue-500 transition-colors">
                                <Twitter className="h-4 w-4 mx-auto" />
                            </button>
                            <button className="flex-1 p-2 rounded-lg hover:bg-blue-600/10 hover:text-blue-600 transition-colors">
                                <Facebook className="h-4 w-4 mx-auto" />
                            </button>
                            <button className="flex-1 p-2 rounded-lg hover:bg-blue-700/10 hover:text-blue-700 transition-colors">
                                <Linkedin className="h-4 w-4 mx-auto" />
                            </button>
                            <button className="flex-1 p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                                <Link2 className="h-4 w-4 mx-auto" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-card border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold text-sm">Statistics</h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Eye className="h-4 w-4" />
                                <span>Views</span>
                            </div>
                            <span className="font-semibold text-sm">{post.view_count.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>Read Time</span>
                            </div>
                            <span className="font-semibold text-sm">{readTime}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Published</span>
                            </div>
                            <span className="font-semibold text-sm">
                                {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Author */}
                <div className="bg-card border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <User className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold text-sm">Author</h3>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-12 w-12 border-2 border-border">
                            <AvatarFallback className={`${getAuthorColor(post.created_by)} text-white font-bold`}>
                                {getAuthorInitials(post.created_by)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-sm">User {post.created_by}</p>
                            <Badge variant="outline" className="text-xs h-5">Author</Badge>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                        Community contributor sharing knowledge about programming and development.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                        <User className="h-3.5 w-3.5 mr-1.5" />
                        Follow
                    </Button>
                </div>

                {/* Newsletter */}
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Bell className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold text-sm">Stay Updated</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                        Get the latest articles delivered to your inbox.
                    </p>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                        Subscribe
                    </Button>
                </div>

            </div>
        </aside>
    );
}
