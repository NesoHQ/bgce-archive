"use client";

import Link from "next/link";
import { Github, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2025);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const footerLinks = {
    learn: [
      { label: "What is BGCE?", href: "/about" },
      { label: "Mission & Vision", href: "/mission" },
      { label: "Getting Started", href: "/getting-started" },
      { label: "Documentation", href: "/docs" },
    ],
    resources: [
      { label: "Archive", href: "/archive" },
      { label: "Knowledge Center", href: "/knowledge-center" },
      { label: "Topics", href: "/topics" },
      { label: "Training", href: "/training" },
    ],
    community: [
      { label: "Community Groups", href: "/community-groups" },
      { label: "Support", href: "/nesohq-support" },
      { label: "Discord", href: "https://discord.gg/wHq4SjKrNY", external: true },
      { label: "Contributors", href: "/contributors" },
    ],
    help: [
      { label: "Contact Us", href: "/contact" },
      { label: "Support Ticket", href: "/support" },
      { label: "System Status", href: "/status" },
      { label: "Legal", href: "/legal" },
    ],
  };

  return (
    <footer className="relative bg-gradient-to-b from-transparent via-muted/10 to-muted/20 dark:from-transparent dark:via-muted/20 dark:to-muted/30 border-t border-primary/20 text-foreground pt-16 pb-8 px-4 sm:px-6 lg:px-8 mt-20 rounded-t-[60px] shadow-[0_-20px_60px_rgba(120,119,198,0.15)] overflow-hidden backdrop-blur-sm" suppressHydrationWarning>
      {/* Gradient Orbs */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-primary/10 to-transparent dark:from-primary/20 dark:to-transparent rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-blue-500/10 to-transparent dark:from-blue-500/20 dark:to-transparent rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative">
        {/* Top Actions Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-2">Join BGCE Archive</h2>
            <p className="text-muted-foreground">Start your learning journey today</p>
          </div>
          <Button
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-6 h-10 dark:text-white"
            asChild
          >
            <Link href="/register">Create an account</Link>
          </Button>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">Learn</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {footerLinks.learn.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">Community</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">Help</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Legal Section */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
                <span>
                  © {currentYear}, BGCE Archive. All rights reserved.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
              <Link
                href="https://github.com/nesohq"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com/nesohq"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://discord.gg/wHq4SjKrNY"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
