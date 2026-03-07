import {
  ThumbsUp,
  MessageSquare,
  Twitter,
  Facebook,
  Linkedin,
  Link2,
  CornerUpRight,
  CircleChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { ApiPost } from "@/types/blog.type";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

interface BlogDetailsSidebarProps {
  post: ApiPost;
  readTime: string;
  getAuthorInitials: (userId: number) => string;
  getAuthorColor: (userId: number) => string;
}

export function BlogDetailsSidebar({
  post,
  getAuthorInitials,
  getAuthorColor,
}: BlogDetailsSidebarProps) {
  return (
    <aside className="lg:col-span-4">
      <div className="sticky top-20 space-y-4">
        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-semibold text-sm">Comments</h3>

          <div className="flex items-center my-4 gap-1.5">
            <div className="bg-primary hover:bg-primary/90 p-1 rounded-full w-fit flex items-center justify-center">
              <ThumbsUp className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm text-muted-foreground">15</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 justify-between mt-4">
              <Avatar className="h-8 w-8 border-2 border-border">
                <AvatarFallback
                  className={`${getAuthorColor(post.created_by)} text-white text-xs font-bold`}
                >
                  {getAuthorInitials(post.created_by)}
                </AvatarFallback>
              </Avatar>

              <Button variant="ghost" size="sm" className="w-fit">
                <ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
                Like
              </Button>
              <Button variant="ghost" size="sm" className="w-fit">
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                Comment
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-fit">
                    <CornerUpRight className="h-3.5 w-3.5 mr-1.5" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  align="start"
                  className="border border-md rounded-md bg-card p-2"
                >
                  <DropdownMenuItem className="flex items-center">
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <Link2 className="h-4 w-4" />
                    Copy Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Comment input field */}
            <div className="relative group">
              <Input
                placeholder="Add a comment..."
                className="pl-7 h-10 rounded-full text-xs border focus:border-primary transition-all"
              />
              <CircleChevronRight className="absolute top-1/2 -translate-y-1/2 right-2 h-6 w-6 text-muted-foreground" />
            </div>

            <div className="h-[300px] overflow-y-auto flex flex-col gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 w-full">
                  <Avatar className="h-8 w-8 border-2 border-border">
                    <AvatarFallback
                      className={`${getAuthorColor(post.created_by)} text-white text-xs font-bold`}
                    >
                      {getAuthorInitials(post.created_by)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="w-full">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold">John Doe</span>
                      <span className="text-xs text-muted-foreground">
                        2 days ago
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pl-10">
                  <p className="text-sm text-muted-foreground">
                    This blog is really helpful. I learned a lot from it.
                    Thanks! Keep up the good work!
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 w-full">
                  <Avatar className="h-8 w-8 border-2 border-border">
                    <AvatarFallback
                      className={`${getAuthorColor(post.created_by)} text-white text-xs font-bold`}
                    >
                      {getAuthorInitials(post.created_by)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="w-full">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold">John Doe</span>
                      <span className="text-xs text-muted-foreground">
                        2 days ago
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pl-10">
                  <p className="text-sm text-muted-foreground">
                    This blog is really helpful. I learned a lot from it.
                    Thanks! Keep up the good work!
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 w-full">
                  <Avatar className="h-8 w-8 border-2 border-border">
                    <AvatarFallback
                      className={`${getAuthorColor(post.created_by)} text-white text-xs font-bold`}
                    >
                      {getAuthorInitials(post.created_by)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="w-full">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold">John Doe</span>
                      <span className="text-xs text-muted-foreground">
                        2 days ago
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pl-10">
                  <p className="text-sm text-muted-foreground">
                    This blog is really helpful. I learned a lot from it.
                    Thanks! Keep up the good work!
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 w-full">
                  <Avatar className="h-8 w-8 border-2 border-border">
                    <AvatarFallback
                      className={`${getAuthorColor(post.created_by)} text-white text-xs font-bold`}
                    >
                      {getAuthorInitials(post.created_by)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="w-full">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold">John Doe</span>
                      <span className="text-xs text-muted-foreground">
                        2 days ago
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pl-10">
                  <p className="text-sm text-muted-foreground">
                    This blog is really helpful. I learned a lot from it.
                    Thanks! Keep up the good work!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
