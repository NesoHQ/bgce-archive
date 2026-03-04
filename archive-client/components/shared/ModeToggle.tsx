"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = (event: React.MouseEvent) => {
    const isDark = theme === "dark";

    if (!document.startViewTransition) {
      setTheme(isDark ? "light" : "dark");
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );

    const transition = document.startViewTransition(async () => {
      setTheme(isDark ? "light" : "dark");
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  if (!mounted) {
    return (
      <div className='h-8 w-14 rounded-full bg-muted/50 border border-border animate-pulse' />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "group relative flex items-center h-8 w-14 rounded-full p-1 transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background hover:scale-105 active:scale-95 cursor-pointer",
        isDark
          ? "bg-slate-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
          : "bg-gradient-to-r from-blue-400 to-sky-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]",
      )}
      aria-label='Toggle theme'>
      <div className='absolute inset-0 flex justify-between px-2 items-center pointer-events-none'>
        <Sun
          size={10}
          className={cn(
            "transition-all duration-500",
            isDark ? "text-slate-700 opacity-50" : "text-white opacity-0",
          )}
        />
        <Moon
          size={10}
          className={cn(
            "transition-all duration-500",
            !isDark ? "text-blue-600 opacity-50" : "text-white opacity-0",
          )}
        />
      </div>

      <div
        className={cn(
          "relative flex items-center justify-center h-6 w-6 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          isDark
            ? "translate-x-6 bg-slate-800 shadow-[0_0_15px_rgba(120,119,198,0.4)] border border-slate-700"
            : "translate-x-0 bg-white shadow-lg",
        )}>
        <div className='relative h-4 w-4'>
          <Sun
            className={cn(
              "absolute inset-0 h-4 w-4 text-orange-500 transition-all duration-500",
              isDark
                ? "rotate-180 scale-0 opacity-0"
                : "rotate-0 scale-100 opacity-100",
            )}
          />
          <Moon
            className={cn(
              "absolute inset-0 h-4 w-4 text-blue-400 transition-all duration-500",
              isDark
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-180 scale-0 opacity-0",
            )}
          />
        </div>
      </div>

      {isDark && (
        <span className='absolute right-2 top-1 w-1 h-1 bg-white rounded-full animate-pulse opacity-50' />
      )}
    </button>
  );
}
