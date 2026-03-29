"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "../ModeToggle";
import { GlobalSearch } from "../GlobalSearch";
import { cn } from "@/lib/utils";

interface User {
  username: string;
  email: string;
}

interface DesktopAuthProps {
  isAuthenticated: boolean;
  user: User | null;
  profileOpen: boolean;
  onProfileClick: () => void;
  profileRef: React.RefObject<HTMLButtonElement | null>;
}

export function DesktopAuth({
  isAuthenticated,
  user,
  profileOpen,
  onProfileClick,
  profileRef,
}: DesktopAuthProps) {
  return (
    <div className='hidden xl:flex items-center gap-3'>
      <GlobalSearch />
      <ModeToggle />
      {isAuthenticated && user ? (
        <button
          ref={profileRef}
          onClick={onProfileClick}
          className='flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent transition-colors duration-200'>
          <Avatar className='h-8 w-8'>
            <AvatarFallback className='bg-primary/20 text-primary text-sm font-semibold'>
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className='text-sm font-medium hidden xl:block'>
            {user.username}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              profileOpen && "rotate-180",
            )}
          />
        </button>
      ) : (
        <>
          <Button variant='ghost' size='sm' asChild>
            <Link href='/login'>Login</Link>
          </Button>
          <Button size='sm' asChild className='dark:text-white'>
            <Link href='/register'>Sign up</Link>
          </Button>
        </>
      )}
    </div>
  );
}
