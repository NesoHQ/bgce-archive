"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface AuthWrapperProps {
  children: React.ReactNode;
  headerTitle: string;
  headerDescription: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
  className?: string;
  showSocial?: boolean; // Optional prop to show social login area if needed later
}

export function AuthWrapper({
  children,
  headerTitle,
  headerDescription,
  footerText,
  footerLinkText,
  footerLinkHref,
  className,
}: AuthWrapperProps) {
  return (
    <div className="relative flex mt-10 min-h-[calc(100vh-140px)] w-full items-center justify-center p-4 md:p-8 overflow-hidden">
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
        <Button
          variant="ghost"
          asChild
          className="group text-muted-foreground hover:text-primary transition-colors"
        >
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl mix-blend-multiply animate-blob filter dark:bg-primary/5" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-3xl mix-blend-multiply animate-blob animation-delay-2000 filter dark:bg-secondary/10" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl mix-blend-multiply animate-blob animation-delay-4000 filter dark:bg-accent/10" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg z-10"
      >
        <Card
          className={cn(
            "py-0 border-border/40 bg-background/60 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:shadow-primary/5 hover:border-border/60",
            className,
          )}
        >
          <CardHeader className="space-y-2 text-center pb-8 pt-10">
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-lg shadow-primary/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
              </div>
            </motion.div>
            <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {headerTitle}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground/80">
              {headerDescription}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-8">{children}</CardContent>

          <CardFooter className="flex flex-col space-y-4 pb-8 border-t border-border/40 pt-6 mt-2 bg-muted/20">
            <div className="text-center text-sm text-muted-foreground">
              {footerText}{" "}
              <Link
                href={footerLinkHref}
                className="font-semibold text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors"
              >
                {footerLinkText}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
