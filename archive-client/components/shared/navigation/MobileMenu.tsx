"use client";

import Link from "next/link";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { exploreItems, resourceItems, navLinks } from "./navData";

interface User {
  username: string;
  email: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  isAuthenticated: boolean;
  user: User | null;
  exploreCollapsed: boolean;
  resourcesCollapsed: boolean;
  isActiveRoute: (href: string) => boolean;
  onClose: () => void;
  onExploreToggle: () => void;
  onResourcesToggle: () => void;
  onLogout: () => void;
}

export function MobileMenu({
  isOpen,
  isAuthenticated,
  user,
  exploreCollapsed,
  resourcesCollapsed,
  isActiveRoute,
  onClose,
  onExploreToggle,
  onResourcesToggle,
  onLogout,
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className='xl:hidden border-t bg-background'>
      <div className='container mx-auto px-4 py-4 space-y-1 max-h-[calc(100vh-8rem)] overflow-y-auto'>
        {/* Explore Section */}
        <div>
          <button
            onClick={onExploreToggle}
            className='flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors'>
            <span>Explore</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                !exploreCollapsed && "rotate-180",
              )}
            />
          </button>
          {!exploreCollapsed && (
            <div className='ml-4 mt-1 space-y-1'>
              {Object.values(exploreItems).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className='flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors'>
                    <Icon className='h-4 w-4 text-muted-foreground' />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Regular Links */}
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={cn(
              "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActiveRoute(link.href)
                ? "text-primary bg-primary/5"
                : "hover:bg-accent",
            )}>
            {link.label}
          </Link>
        ))}

        {/* Resources Section */}
        <div>
          <button
            onClick={onResourcesToggle}
            className='flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors'>
            <span>Resources</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                !resourcesCollapsed && "rotate-180",
              )}
            />
          </button>
          {!resourcesCollapsed && (
            <div className='ml-4 mt-1 space-y-1'>
              {resourceItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className='flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors'>
                    <Icon className='h-4 w-4 text-muted-foreground' />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Auth Section */}
        {isAuthenticated && user ? (
          <div className='pt-4 border-t space-y-2'>
            <div className='px-3 py-2 bg-muted rounded-md'>
              <p className='text-sm font-medium'>{user.username}</p>
              <p className='text-xs text-muted-foreground'>{user.email}</p>
            </div>
            <Button variant='outline' asChild className='w-full justify-start'>
              <Link href='/profile' onClick={onClose}>
                <User className='h-4 w-4 mr-2' />
                Profile
              </Link>
            </Button>
            <Button variant='outline' asChild className='w-full justify-start'>
              <Link href='/settings' onClick={onClose}>
                <Settings className='h-4 w-4 mr-2' />
                Settings
              </Link>
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                onClose();
                onLogout();
              }}
              className='w-full justify-start'>
              <LogOut className='h-4 w-4 mr-2' />
              Logout
            </Button>
          </div>
        ) : (
          <div className='pt-4 border-t space-y-2'>
            <Button variant='outline' asChild className='w-full'>
              <Link href='/login' onClick={onClose}>
                Login
              </Link>
            </Button>
            <Button asChild className='w-full dark:text-white'>
              <Link href='/register' onClick={onClose}>
                Sign up
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
