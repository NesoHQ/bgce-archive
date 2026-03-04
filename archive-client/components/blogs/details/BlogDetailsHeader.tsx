import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ApiPost } from "@/types/blog.type";
import { useRouter } from "next/navigation";

interface BlogDetailsHeaderProps {
    post: ApiPost;
}

export function BlogDetailsHeader({ post }: BlogDetailsHeaderProps) {
    const router = useRouter();

    return (
        <div className="border-b border-border/40 bg-muted/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <ChevronRight className="h-3 w-3" />
                        <Link href="/blogs" className="hover:text-primary transition-colors">Blogs</Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-foreground font-medium truncate max-w-[150px] sm:max-w-[300px]">{post.title}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => router.push("/blogs")} className="h-8 text-xs">
                        <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                        Back
                    </Button>
                </div>
            </div>
        </div>
    );
}
